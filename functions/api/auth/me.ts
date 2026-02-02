// functions/api/auth/me.ts

export async function onRequestGet(context: any) {
  const { request, env } = context;

  try {
    const authHeader = request.headers.get('Authorization') || "";
    const token = authHeader.replace('Bearer ', '').trim();

    if (!token || token.length < 10) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing or Invalid Token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`🔍 [ME] Checking Token: ${token.substring(0, 8)}...`);

    const session = await env.DB.prepare(
      "SELECT user_id, expires_at FROM sessions WHERE id = ?"
    ).bind(token).first();

    if (!session) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid Session" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Manual expiry check
    const now = new Date().toISOString().replace('T', ' ').replace('Z', '');
    if (session.expires_at < now) {
      return new Response(
        JSON.stringify({ success: false, error: "Expired" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await env.DB.prepare(
      "SELECT * FROM users WHERE id = ?"
    ).bind(session.user_id).first();

    console.log(`✅ [ME] Authorized user: ${user.email}`);

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error('💥 [ME] Crash:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: "Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}