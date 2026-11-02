// functions/api/admin/totp/setup.ts
//
// One-time step: generates a new TOTP secret and stores it (unconfirmed -
// enabled=0) in D1, returning the otpauth:// URI app/admin/AdminGate.tsx
// renders as a QR code for the admin to scan into an authenticator app.
// functions/api/admin/validate.ts activates it (enabled=1) the first time a
// correct code comes back against it - there's no separate "confirm"
// endpoint, that happens inline in the same login call.
//
// Requires the admin password itself - same trust boundary as the rest of
// /admin, there's no separate per-user account system here. Refuses to run
// if 2FA is already active (enabled=1): a bare password should never be
// enough to silently swap out an already-configured second factor. To reset
// lost 2FA, clear the admin_totp row directly in D1.

import { generateSecret, otpauthUrl } from '../../../../backend-lib/totp';

export async function onRequestPost(context: any) {
  const { request, env } = context;

  const body = await request.json().catch(() => ({}));
  const { password } = body;
  const expectedPassword = env.ADMIN_PASSWORD || env.ADMIN_KEY;

  if (!expectedPassword || password !== expectedPassword) {
    return new Response(JSON.stringify({ error: 'Incorrect password' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const existing = await env.DB.prepare('SELECT enabled FROM admin_totp WHERE id = 1').first();
    if (existing && existing.enabled) {
      return new Response(
        JSON.stringify({ error: 'Two-factor authentication is already configured.' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const secret = generateSecret();
    await env.DB.prepare(
      `INSERT INTO admin_totp (id, secret, enabled) VALUES (1, ?, 0)
       ON CONFLICT(id) DO UPDATE SET secret = excluded.secret, enabled = 0`
    )
      .bind(secret)
      .run();

    return new Response(
      JSON.stringify({ secret, otpauthUrl: otpauthUrl(secret, 'Admin', 'MPIntellect') }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to set up 2FA' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
