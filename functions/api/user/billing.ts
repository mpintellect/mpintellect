// functions/api/user/billing.ts

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export async function onRequestGet(context: any) {
  const { request, env } = context;

  try {
    const authHeader = request.headers.get('Authorization') || "";
    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: HEADERS });

    // 1. Verify Session
    const session = await env.DB.prepare(
      "SELECT user_id FROM sessions WHERE id = ? AND datetime(expires_at) > datetime('now')"
    ).bind(token).first();

    if (!session) return new Response(JSON.stringify({ error: "Session expired" }), { status: 401, headers: HEADERS });

    // 2. Fetch Purchase History
    // Note: We join with users to ensure we have the latest email/license info if needed
    const { results } = await env.DB.prepare(
      `SELECT stripe_session_id, price_id, amount_paid, currency, status, created_at 
       FROM stripe_purchases 
       WHERE user_id = ? 
       ORDER BY created_at DESC`
    ).bind(session.user_id).all();

    return new Response(JSON.stringify({ success: true, history: results }), { 
      status: 200, 
      headers: HEADERS 
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: HEADERS });
  }
}