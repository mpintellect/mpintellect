// functions/api/admin/validate.ts
//
// Admin password + TOTP two-factor gate for app/admin/AdminGate.tsx. One
// shared admin account (matching ADMIN_PASSWORD's own single-secret model),
// so this is a state machine keyed off the admin_totp row, not a per-user
// login:
//   - no admin_totp row                -> reason: 'setup_required'
//     (client calls POST /api/admin/totp/setup next to generate one)
//   - locked_until is in the future    -> reason: 'locked' (too many wrong
//     codes recently - see MAX_ATTEMPTS/LOCKOUT_MS below)
//   - row exists, enabled=0 (pending)  -> reason: 'confirm_setup' until a
//     code is sent; a correct one flips enabled=1 right here, completing
//     setup and login in the same call
//   - row exists, enabled=1            -> reason: 'code_required' until a
//     code is sent, like any normal TOTP second factor
//
// On a fully successful login (password + code), also logs a row to
// admin_sessions (IP, user agent, timestamp) and returns a sessionToken -
// see functions/api/admin/sessions.ts for the device list/"Disconnect" UI
// this feeds. That table is visibility + a soft kick for the /admin UI, not
// a hard boundary: the API endpoints below it still trust ADMIN_PASSWORD as
// a bearer token the way they always have.
//
// Fails closed if ADMIN_PASSWORD/ADMIN_KEY isn't configured - see
// CLAUDE.md's note on this file for why the old hardcoded-password fallback
// was removed.

import { verifyTotp } from '../../../backend-lib/totp';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// After this many wrong codes in a row, lock further attempts out for
// LOCKOUT_MS - a correct password alone should never be enough to brute-
// force the remaining 6-digit TOTP code (1-in-~3,000,000 per 90s window
// without this).
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json().catch(() => ({}));
    const { password, code } = body;

    // Fails closed if neither is configured, rather than falling back to a
    // guessable default - see CLAUDE.md's note on this file for why the old
    // "mpintellect-admin" hardcoded fallback was removed. Same convention as
    // verifyAdminAuth() in backend-lib/ad-shared.ts.
    const expectedPassword = env.ADMIN_PASSWORD || env.ADMIN_KEY;

    if (!password) {
      return new Response(
        JSON.stringify({ valid: false, reason: 'password', error: 'Password required' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!expectedPassword || password !== expectedPassword) {
      return new Response(
        JSON.stringify({ valid: false, reason: 'password' }),
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const totpRow = await env.DB.prepare(
      'SELECT secret, enabled, failed_attempts, locked_until FROM admin_totp WHERE id = 1'
    ).first();

    if (!totpRow) {
      return new Response(
        JSON.stringify({ valid: false, reason: 'setup_required' }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    if (totpRow.locked_until && new Date(String(totpRow.locked_until)).getTime() > Date.now()) {
      return new Response(
        JSON.stringify({ valid: false, reason: 'locked', lockedUntil: totpRow.locked_until }),
        { status: 429, headers: CORS_HEADERS }
      );
    }

    if (!code) {
      return new Response(
        JSON.stringify({ valid: false, reason: totpRow.enabled ? 'code_required' : 'confirm_setup' }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    const codeValid = await verifyTotp(String(totpRow.secret), String(code));
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
      return new Response(
        JSON.stringify({ valid: false, reason: 'bad_code' }),
        { status: 401, headers: CORS_HEADERS }
      );
    }

    await env.DB.prepare(
      'UPDATE admin_totp SET enabled = 1, failed_attempts = 0, locked_until = NULL WHERE id = 1'
    ).run();

    const sessionToken = crypto.randomUUID();
    const ip = request.headers.get('CF-Connecting-IP') || '';
    const userAgent = request.headers.get('User-Agent') || '';
    await env.DB.prepare('INSERT INTO admin_sessions (id, ip, user_agent) VALUES (?, ?, ?)')
      .bind(sessionToken, ip, userAgent)
      .run();

    return new Response(JSON.stringify({ valid: true, sessionToken }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ valid: false, error: error.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
