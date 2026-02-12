// functions/api/license-activate.ts

const HEADERS = { 
  "Content-Type": "application/json", 
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const { key, sessionId } = await request.json();

    // 1. Verify Database Snapshot is loaded
    const tables: any = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const hasUsers = tables.results.some((r: any) => r.name === 'users');

    if (!hasUsers) {
      return new Response(JSON.stringify({ ok: false, error: "Database snapshot empty. Restart test:prod." }), { status: 200, headers: HEADERS });
    }

    let user: any = null;

    // 2. Logic for Auto-Activation (Session) or Manual (Key)
    if (sessionId) {
      // Find key via real Stripe session record pulled from Live
      const purchase: any = await env.DB.prepare(
        "SELECT license_key FROM stripe_purchases WHERE stripe_session_id = ?"
      ).bind(sessionId).first();

      if (purchase?.license_key) {
        user = await env.DB.prepare(
          "SELECT license_key, license_expires_at FROM users WHERE license_key = ?"
        ).bind(purchase.license_key).first();
      }
    } else if (key) {
      user = await env.DB.prepare(
        "SELECT license_key, license_expires_at FROM users WHERE license_key = ? AND license_type = 'pro'"
      ).bind(key).first();
    }

    if (!user) {
      return new Response(JSON.stringify({ ok: false, error: "License not found in snapshot." }), { status: 200, headers: HEADERS });
    }

    return new Response(JSON.stringify({
      ok: true,
      license: { key: user.license_key, expiresAt: user.license_expires_at }
    }), { status: 200, headers: HEADERS });

  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: "System Error: " + e.message }), { status: 500, headers: HEADERS });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: HEADERS });
}