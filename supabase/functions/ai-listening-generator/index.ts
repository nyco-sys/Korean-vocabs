import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const env = (name: string) => Deno.env.get(name) || "";

function providers() {
  const p: any[] = [];
  const add = (name: string, key: string, model: string) => {
    if (key) p.push({ name, key, model });
  };
  add("OpenRouter", env("OPENROUTER_API_KEY"), env("OPENROUTER_MODEL") || "openrouter/free");
  add("Groq", env("GROQ_API_KEY"), env("GROQ_MODEL") || "llama-3.1-8b-instant");
  add("Gemini", env("GEMINI_API_KEY"), env("GEMINI_MODEL") || "gemini-2.5-flash");
  add("OpenAI", env("OPENAI_API_KEY"), env("OPENAI_MODEL") || "gpt-4.1-mini");
  return p;
}

function extract(d: any) {
  return (
    d?.output_text?.trim() ||
    d?.choices?.[0]?.message?.content?.trim() ||
    (d?.candidates?.[0]?.content?.parts || []).map((x: any) => x.text || "").join("").trim() ||
    ""
  );
}

async function callProvider(p: any, system: string, user: string) {
  if (p.name === "OpenAI") {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${p.key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: p.model, instructions: system, input: user, max_output_tokens: 2200 }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d?.error?.message || `OpenAI ${r.status}`);
    return extract(d);
  }

  if (p.name === "Gemini") {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(p.model)}:generateContent?key=${encodeURIComponent(p.key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
        }),
      },
    );
    const d = await r.json();
    if (!r.ok) throw new Error(d?.error?.message || `Gemini ${r.status}`);
    return extract(d);
  }

  const url = p.name === "Groq"
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://openrouter.ai/api/v1/chat/completions";

  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${p.key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: p.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      max_tokens: 2200,
    }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d?.error?.message || `${p.name} ${r.status}`);
  return extract(d);
}

Deno.serve(async (req) => {
  // The browser sends OPTIONS before POST. This must be answered before auth.
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) return json({ error: "Login required." }, 401);

    const supabaseUrl = env("SUPABASE_URL");
    const anonKey = env("SUPABASE_ANON_KEY") || env("SUPABASE_PUBLISHABLE_KEY");
    if (!supabaseUrl || !anonKey) {
      return json({ error: "Supabase function configuration is incomplete." }, 500);
    }

    // User client: validates the JWT belonging to the current browser session.
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) return json({ error: "Login required." }, 401);

    // Service-role client is used only inside this server function for the admin check.
    // The service-role key is never sent to the browser.
    const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceRoleKey) return json({ error: "Server configuration is incomplete." }, 500);

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("role,status,ai_tutor_enabled")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile lookup failed:", profileError);
      return json({ error: "Could not verify account permissions." }, 500);
    }

    if (profile?.role !== "admin" || profile?.status !== "active") {
      return json({ error: "Admin access required." }, 403);
    }

    const body = await req.json();
    const category = String(body.category || "EPS-TOPIK");
    const difficulty = String(body.difficulty || "Beginner");
    const topic = String(body.topic || "");
    const count = Math.min(Math.max(Number(body.count) || 3, 1), 10);

    const system = `You are a Korean listening-practice content generator. Create ORIGINAL EPS-TOPIK-style Korean listening questions. Never reproduce or quote official exam questions. Use natural Korean appropriate for the requested difficulty. Return ONLY valid JSON with this exact shape: {"questions":[{"question_text":"...","audio_text":"...","choice_1":"...","choice_2":"...","choice_3":"...","choice_4":"...","correct_answer":1,"translation":"...","explanation":"..."}]}. correct_answer must be 1,2,3,or 4. The audio_text must contain the Korean sentence/dialogue that the learner hears; do not put the answer label inside it. Make distractors plausible and clearly different. No markdown.`;
    const prompt = `Generate ${count} question(s). Category: ${category}. Difficulty: ${difficulty}. Topic: ${topic || "varied everyday/workplace Korean"}. Keep each question focused on listening comprehension.`;

    let lastError = "";
    for (const provider of providers()) {
      try {
        const raw = await callProvider(provider, system, prompt);
        const clean = raw.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
        const parsed = JSON.parse(clean);
        if (Array.isArray(parsed.questions) && parsed.questions.length) {
          return json({ questions: parsed.questions.slice(0, count), provider: provider.name });
        }
        lastError = `${provider.name}: AI returned no questions.`;
      } catch (error) {
        lastError = `${provider.name}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(lastError);
      }
    }

    return json({ error: lastError || "No AI provider is configured." }, 502);
  } catch (error) {
    console.error("ai-listening-generator error:", error);
    return json({ error: error instanceof Error ? error.message : "Generation failed." }, 500);
  }
});
