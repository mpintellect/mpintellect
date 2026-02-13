export async function onRequestGet(context: any) {
  const { request, env } = context;
  const authHeader = request.headers.get('Authorization') || "";
  const token = authHeader.replace('Bearer ', '').trim();

  try {
    // Verify session
    const session: any = await env.DB.prepare(
      "SELECT user_id FROM sessions WHERE id = ? AND datetime(expires_at) > datetime('now')"
    ).bind(token).first();

    if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    // Pull real history from D1
    const { results } = await env.DB.prepare(
      "SELECT * FROM stripe_purchases WHERE user_id = ? ORDER BY created_at DESC"
    ).bind(session.user_id).all();

    return new Response(JSON.stringify({ success: true, history: results }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}