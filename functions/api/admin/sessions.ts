// functions/api/admin/sessions.ts
//
// Lists and revokes rows from admin_sessions (written by
// functions/api/admin/validate.ts on every successful password+TOTP login).
// Powers the device list / "Disconnect" button on app/admin/security/
// page.tsx. See validate.ts's header comment for what "revoke" actually
// does (soft-kicks that session's /admin UI, doesn't block the underlying
// API bearer-token auth).
//
// Admin-gated the same way as the rest of /api/admin/* (Bearer
// <ADMIN_PASSWORD|ADMIN_KEY>, fails closed).

function checkAuth(request: Request, env: any): boolean {
  const authHeader = request.headers.get('Authorization');
  const expectedSecret = env.ADMIN_PASSWORD || env.ADMIN_KEY;
  return !!expectedSecret && authHeader === `Bearer ${expectedSecret}`;
}

function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestGet(context: any) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  try {
    const sessions = await env.DB.prepare(
      'SELECT id, ip, user_agent, created_at, last_seen_at, revoked FROM admin_sessions ORDER BY last_seen_at DESC LIMIT 100'
    ).all();
    return new Response(JSON.stringify({ sessions: sessions?.results || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to load sessions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  const body = await request.json().catch(() => ({}));
  const { id } = body;
  if (!id) {
    return new Response(JSON.stringify({ error: 'id is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await env.DB.prepare('UPDATE admin_sessions SET revoked = 1 WHERE id = ?').bind(id).run();
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to revoke session' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
