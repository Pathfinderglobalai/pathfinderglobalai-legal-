// LOTUNIX checkout initiation — fail-closed until an approved payment integration is installed.
// No card collection, mock-success shortcuts, or member enrollment writes.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const allowedOrigins = new Set([
  "https://www.pathfinderglobalai.com",
  "https://pathfinderglobalai.com",
  "https://pathfinderglobalai.github.io"
]);
function cors(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin) ? origin : "https://www.pathfinderglobalai.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Vary": "Origin",
  };
}
function json(req: Request, status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(req), "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });
  if (req.method !== "POST") return json(req, 405, { code: "METHOD_NOT_ALLOWED", message: "POST required." });
  const origin = req.headers.get("origin");
  if (origin && !allowedOrigins.has(origin)) return json(req, 403, { code: "ORIGIN_REJECTED", message: "Origin not allowed." });
  const authorization = req.headers.get("authorization") || "";
  const bearer = authorization.match(/^Bearer (\S+)$/i);
  if (!bearer) return json(req, 401, { code: "SIGN_IN_REQUIRED", message: "Please sign in to your LOTUNIX account." });
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) return json(req, 503, { code: "SERVICE_UNAVAILABLE", message: "Checkout is unavailable." });
  const client = createClient(supabaseUrl, anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: { user }, error } = await client.auth.getUser(bearer[1]);
  if (error || !user) return json(req, 401, { code: "SIGN_IN_REQUIRED", message: "Please sign in to your LOTUNIX account." });
  let request: { course_id?: unknown };
  try { request = await req.json(); } catch { return json(req, 400, { code: "INVALID_REQUEST", message: "Invalid checkout request." }); }
  if (request?.course_id !== "lotunix-13") return json(req, 400, { code: "INVALID_COURSE", message: "Course not available." });
  // Do not let a toggle alone enable billing. A provider-specific implementation,
  // verified seller onboarding, signed webhooks and server-side pricing are still required.
  return json(req, 503, {
    code: "CHECKOUT_NOT_CONFIGURED",
    message: "Secure checkout is not yet accepting payments. No order was placed or card charged."
  });
});
