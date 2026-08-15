const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

const env = (name) => Deno.env.get(name) || "";

function getProviders() {
  const list = [];
  const add = (name, key, model) => {
    if (key) list.push({ name, key, model });
  };
  add("OpenRouter", env("OPENROUTER_API_KEY"), env("OPENROUTER_MODEL") || "openrouter/free");
  add("Groq", env("GROQ_API_KEY"), env("GROQ_MODEL") || "llama-3.1-8b-instant");
  add("Gemini", env("GEMINI_API_KEY"), env("GEMINI_MODEL") || "gemini-2.5-flash");
  add("OpenAI", env("OPENAI_API_KEY"), env("OPENAI_MODEL") || "gpt-4.1-mini");
  return list;
}

async function callProvider(provider, system, message) {
  if (provider.name === "OpenRouter" || provider.name === "Groq") {
    const endpoint =
      provider.name === "OpenRouter"
        ? "https://openrouter.ai/api/v1/chat/completions"
        : "https://api.groq.com/openai/v1/chat/completions";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: message },
        ],
        max_tokens: 700,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || `${provider.name} request failed`);
    return data?.choices?.[0]?.message?.content?.trim() || "";
  }

  if (provider.name === "Gemini") {
    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(provider.model)}` +
      `:generateContent?key=${encodeURIComponent(provider.key)}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || "Gemini request failed");
    return (data?.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || "")
      .join("")
      .trim();
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: provider.model,
      instructions: system,
      input: message,
      max_output_tokens: 700,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "OpenAI request failed");
  return data?.output_text?.trim() || "";
}

function parseJson(raw) {
  const cleaned = String(raw || "")
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("AI returned an invalid response.");
  return JSON.parse(cleaned.slice(start, end + 1));
}

/*
 * IMPORTANT:
 * CORS preflight is handled before any authentication, database, or AI work.
 * This function intentionally does not import supabase-js at module startup.
 * That keeps OPTIONS requests reliable and avoids startup failures being
 * incorrectly reported by the browser as a CORS error.
 */
Deno.serve(async (req) => {
  // Handle browser preflight FIRST.
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization) {
      return json({ error: "Login required." }, 401);
    }

    const supabaseUrl = env("SUPABASE_URL");
    const anonKey = env("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !anonKey) {
      return json({ error: "Supabase environment is not configured." }, 500);
    }

    // Verify the user's JWT through Supabase Auth.
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: anonKey,
        Authorization: authorization,
      },
    });

    const user = await authResponse.json();

    if (!authResponse.ok || !user?.id) {
      return json({ error: "Invalid or expired session." }, 401);
    }

    // Check the user's profile. Admin is required for this endpoint.
    const profileResponse = await fetch(
      `${supabaseUrl}/rest/v1/profiles?select=role,status&id=eq.${encodeURIComponent(user.id)}&limit=1`,
      {
        headers: {
          apikey: anonKey,
          Authorization: authorization,
        },
      }
    );

    const profiles = await profileResponse.json();

    if (!profileResponse.ok) {
      return json({ error: "Unable to verify account permissions." }, 500);
    }

    const profile = profiles?.[0];

    if (!profile || profile.role !== "admin" || profile.status !== "active") {
      return json({ error: "Admin access required." }, 403);
    }

    const body = await req.json();

    const message = String(body?.message || "").trim();
    if (!message) return json({ error: "Message is required." }, 400);
    if (message.length > 1500) return json({ error: "Message is too long." }, 400);

    const scenario = String(body?.scenario || "free");
    const correctionMode = body?.correction_mode === "detailed" ? "detailed" : "gentle";
    const history = Array.isArray(body?.history) ? body.history.slice(-12) : [];

    const system = `You are Minji, a warm Korean conversation partner helping a learner practice Korean speaking.

Scenario: ${scenario}

Correction mode: ${
      correctionMode === "detailed"
        ? "Give useful corrections for grammar, word choice, spelling, or naturalness."
        : "Only correct meaningful mistakes. Do not interrupt natural Korean for tiny stylistic differences."
    }

Always continue the conversation naturally.
Reply primarily in Korean.
Keep replies concise, around 1-3 Korean sentences.

Return ONLY valid JSON in exactly this shape:
{
  "response": "Korean reply",
  "translation": "brief English meaning",
  "correction": {
    "has_correction": true,
    "original": "learner sentence or empty",
    "corrected": "natural Korean or empty",
    "explanation": "short English explanation or empty"
  }
}

If the learner's sentence is understandable and acceptable, set has_correction to false.
Do not invent mistakes.`;

    const prompt =
      `Conversation history: ${JSON.stringify(history)}\n` +
      `Learner just said: ${message}`;

    const providers = getProviders();

    if (!providers.length) {
      return json({ error: "No AI providers are configured." }, 503);
    }

    let raw = "";
    let providerUsed = "";
    let lastError = "";

    for (const provider of providers) {
      try {
        raw = await callProvider(provider, system, prompt);
        providerUsed = provider.name;
        break;
      } catch (error) {
        lastError = String(error?.message || error);
      }
    }

    if (!raw) {
      return json({
        error: "All configured AI providers failed.",
        details: lastError,
      }, 502);
    }

    const result = parseJson(raw);

    return json({
      ...result,
      provider: providerUsed,
    });
  } catch (error) {
    console.error("ai-speaking-partner error:", error);
    return json({
      error: "Speaking Partner request failed.",
      details: String(error?.message || error),
    }, 500);
  }
});
