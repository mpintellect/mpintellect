// functions/api/admin/sessions/check.ts
//
// Polled periodically by app/admin/AdminGateProvider.tsx so a session that
// was revoked from the device list (functions/api/admin/sessions.ts) gets
// logged out of the /admin UI without waiting for a page reload. Also bumps
// last_seen_at so the device list reflects actual recent activity, not just
// login time.
//
// Admin-gated the same way as the rest of /api/admin/* (Bearer
// <ADMIN_PASSWORD|ADMIN_KEY>, fails closed) - the session token alone isn't
// treated as sufficient to ask about itself, same trust boundary as every
// other /admin endpoint.

export async function onRequestPost(context: any) {
  const { request, env } = context;

  const authHeader = request.headers.get('Authorization');
  const expectedSecret = env.ADMIN_PASSWORD || env.ADMIN_KEY;
  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json().catch(() => ({}));
  const { sessionToken } = body;
  if (!sessionToken) {
    return new Response(JSON.stringify({ valid: false }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const session = await env.DB.prepare('SELECT revoked FROM admin_sessions WHERE id = ?')
      .bind(sessionToken)
      .first();

    if (!session || session.revoked) {
      return new Response(JSON.stringify({ valid: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare('UPDATE admin_sessions SET last_seen_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(sessionToken)
      .run();

    return new Response(JSON.stringify({ valid: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ valid: false, error: err?.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
