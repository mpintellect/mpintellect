// functions/api/auth/logout.ts

export async function onRequestPost(context: any) {
  const { request, env } = context; 

  try {
    // 1. Safely parse body (prevents 500 if empty)
    const body = await request.json().catch(() => ({}));
    const { sessionId } = body;

    if (sessionId) {
      // 2. Delete session from D1
      await env.DB.prepare('DELETE FROM sessions WHERE id = ?')
        .bind(sessionId)
        .run();
    }

    // 3. Clear the cookie by setting an expired date
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'mz_token=; path=/; domain=.localhost; Max-Age=0; HttpOnly'
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}