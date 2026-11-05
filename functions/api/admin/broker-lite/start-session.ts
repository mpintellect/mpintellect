// functions/api/admin/broker-lite/start-session.ts
// Mints a short-lived session token for tampermonkey/litefinance-sync.user.js,
// gated by a live TOTP code checked against the same admin_totp secret used
// for /admin login (functions/api/admin/validate.ts) - not a separate
// secret. sync.ts then requires this token, on top of
// LITEFINANCE_INGEST_TOKEN, on every page push, so a leaked ingest token
// alone still can't write data without a fresh code from the admin's own
// authenticator app.
//
// Shares the same brute-force lockout state (failed_attempts/locked_until
// on admin_totp) as /admin login - wrong codes here count against the same
// limit, deliberately, since it's the same underlying secret.

import { verifyTotp } from '../../../../backend-lib/totp';

const SESSION_TTL_MS = 15 * 60 * 1000; // covers even a full-month walk (~120 requests) with room to spare
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

export async function onRequestPost(context: any) {
  const { request, env } = context;

  const authHeader = request.headers.get('Authorization');
  if (!env.LITEFINANCE_INGEST_TOKEN || authHeader !== `Bearer ${env.LITEFINANCE_INGEST_TOKEN}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const code = (body.code || '').trim();
  if (!/^\d{6}$/.test(code)) {
    return new Response(JSON.stringify({ error: 'A 6-digit code is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const totpRow = await env.DB.prepare(
    'SELECT secret, enabled, failed_attempts, locked_until FROM admin_totp WHERE id = 1'
  ).first();

  if (!totpRow || !totpRow.enabled) {
    return new Response(JSON.stringify({ error: 'TOTP is not set up on this admin account' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (totpRow.locked_until && new Date(String(totpRow.locked_until)).getTime() > Date.now()) {
    return new Response(JSON.stringify({ error: 'Too many wrong codes - locked, try again later' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const codeValid = await verifyTotp(String(totpRow.secret), code);
  if (!codeValid) {
    const attempts = (Number(totpRow.failed_attempts) || 0) + 1;
    if (attempts >= MAX_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + LOCKOUT_MS).toISOString();
      await env.DB.prepare('UPDATE admin_totp SET failed_attempts = 0, locked_until = ? WHERE id = 1')
        .bind(lockedUntil)
        .run();
    } else {
      await env.DB.prepare('UPDATE admin_totp SET failed_attempts = ? WHERE id = 1').bind(attempts).run();
    }
    return new Response(JSON.stringify({ error: 'Invalid code' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await env.DB.prepare('UPDATE admin_totp SET failed_attempts = 0, locked_until = NULL WHERE id = 1').run();

  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  await env.DB.prepare('INSERT INTO litefinance_sync_sessions (token, expires_at) VALUES (?, ?)')
    .bind(sessionToken, expiresAt)
    .run();

  return new Response(JSON.stringify({ ok: true, sessionToken, expiresAt }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
