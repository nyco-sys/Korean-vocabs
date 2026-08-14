import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Content-Type": "application/json",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: corsHeaders });
const env = (name: string) => Deno.env.get(name) || "";

async function getAdmin(req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth) throw new Error("Login required.");
  const url = env("SUPABASE_URL");
  const publishable = JSON.parse(env("SUPABASE_PUBLISHABLE_KEYS")).default;
  const userClient = createClient(url, publishable, { global: { headers: { Authorization: auth } } });
  const { data: { user }, error } = await userClient.auth.getUser();
  if (error || !user) throw new Error("Login required.");
  const { data: profile } = await userClient.from("profiles").select("id,role,status").eq("id", user.id).single();
  if (!profile || profile.role !== "admin" || profile.status !== "active") throw new Error("Admin access required.");
  return { user, url };
}

function serviceClient() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { autoRefreshToken: false, persistSession: false } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    await getAdmin(req);
    const admin = serviceClient();

    if (req.method === "GET") {
      const { data, error } = await admin.from("profiles").select("id,email,display_name,role,status,ai_tutor_enabled,created_at,updated_at").order("created_at", { ascending: false });
      if (error) throw error;
      return json({ users: data || [] });
    }

    const body = await req.json();

    if (req.method === "POST") {
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const displayName = String(body.display_name || "").trim();
      const role = body.role === "admin" ? "admin" : "user";
      const aiEnabled = !!body.ai_tutor_enabled;
      if (!email || password.length < 8) return json({ error: "Email and a password of at least 8 characters are required." }, 400);

      const { data: created, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: displayName } });
      if (error) throw error;
      const { error: profileError } = await admin.from("profiles").update({ display_name: displayName, role, status: "active", ai_tutor_enabled: aiEnabled, updated_at: new Date().toISOString() }).eq("id", created.user.id);
      if (profileError) throw profileError;
      return json({ user: { id: created.user.id, email, display_name: displayName, role, status: "active", ai_tutor_enabled: aiEnabled } }, 201);
    }

    const userId = String(body.user_id || "");
    if (!userId) return json({ error: "user_id is required." }, 400);
    const { user: actingAdmin } = await getAdmin(req);
    if (userId === actingAdmin.id && req.method === "DELETE") return json({ error: "You cannot delete the currently signed-in admin account." }, 400);

    if (req.method === "PATCH") {
      const { data: target } = await admin.from("profiles").select("id,role,status").eq("id", userId).single();
      if (!target) return json({ error: "User not found." }, 404);
      const removingAdmin = target.role === "admin" && (body.role === "user" || body.status === "disabled");
      if (removingAdmin) {
        const { count } = await admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin").eq("status", "active");
        if ((count || 0) <= 1) return json({ error: "The last active admin account cannot be disabled or changed to a user." }, 400);
      }
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.display_name !== undefined) patch.display_name = String(body.display_name || "").trim();
      if (body.status !== undefined) patch.status = body.status === "disabled" ? "disabled" : "active";
      if (body.ai_tutor_enabled !== undefined) patch.ai_tutor_enabled = !!body.ai_tutor_enabled;
      if (body.role !== undefined) patch.role = body.role === "admin" ? "admin" : "user";
      const { error } = await admin.from("profiles").update(patch).eq("id", userId);
      if (error) throw error;
      if (body.password) {
        if (String(body.password).length < 8) return json({ error: "Password must be at least 8 characters." }, 400);
        const { error: passwordError } = await admin.auth.admin.updateUserById(userId, { password: String(body.password) });
        if (passwordError) throw passwordError;
      }
      return json({ updated: true });
    }

    if (req.method === "DELETE") {
      const { data: target } = await admin.from("profiles").select("id,role,status").eq("id", userId).single();
      if (!target) return json({ error: "User not found." }, 404);
      if (target.role === "admin" && target.status === "active") {
        const { count } = await admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin").eq("status", "active");
        if ((count || 0) <= 1) return json({ error: "The last active admin account cannot be deleted." }, 400);
      }
      const { error } = await admin.auth.admin.deleteUser(userId);
      if (error) throw error;
      return json({ deleted: true });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (error) {
    console.error("admin-users error", error);
    return json({ error: error instanceof Error ? error.message : "Request failed." }, 403);
  }
});
