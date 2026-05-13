// functions/api/chart/deduct.ts
// Cloudflare Worker function

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    // Get auth token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer', '').trim();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - No token provided" }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify session
    const session = await env.DB.prepare(
      "SELECT user_id, expires_at FROM sessions WHERE id = ?"
    ).bind(token).first();

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check expiry
    const now = new Date().toISOString().replace('T', ' ').replace('Z', '');
    if (session.expires_at < now) {
      return new Response(
        JSON.stringify({ error: "Session expired" }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get user
    const user = await env.DB.prepare(
      "SELECT id, setup_count FROM users WHERE id = ?"
    ).bind(session.user_id).first();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has credits
    if (user.setup_count <= 0) {
      return new Response(
        JSON.stringify({ error: "No credits left" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Deduct one credit
    await env.DB.prepare(
      "UPDATE users SET setup_count = setup_count - 1 WHERE id = ?"
    ).bind(user.id).run();

    // Get updated count
    const updatedUser = await env.DB.prepare(
      "SELECT setup_count FROM users WHERE id = ?"
    ).bind(user.id).first();

    console.log(`✅ Credit deducted for user ${user.id}. Remaining: ${updatedUser.setup_count}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        creditsRemaining: updatedUser.setup_count 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("❌ Error deducting chart credit:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}