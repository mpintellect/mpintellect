// functions/api/admin/broker/users/data.ts
// Read-only feed for app/admin/users/page.tsx - everything already in D1
// (seeded by sync.ts, email/phone filled in lazily by detail.ts). Never
// talks to Investizo itself. Admin-gated the same way as the rest of
// /api/admin/* (Bearer <ADMIN_PASSWORD|ADMIN_KEY>, fails closed).

export async function onRequestGet(context: any) {
  const { request, env } = context;

  const authHeader = request.headers.get('Authorization');
  const expectedSecret = env.ADMIN_PASSWORD || env.ADMIN_KEY;
  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // reg_date is Investizo's own "DD.MM.YYYY HH:MM" text, not ISO - same
  // chrono-key re-slice as functions/api/admin/broker/data.ts, needed so
  // ORDER BY is actually chronological and not lexicographic on the day.
  const CHRONO_KEY = `(substr(reg_date,7,4) || substr(reg_date,4,2) || substr(reg_date,1,2) || substr(reg_date,12,5))`;

  try {
    const { results } = await env.DB.prepare(
      `SELECT investizo_id, name, country, verification_status, reg_date, last_visit,
              partner, manager, email, phone, detail_fetched_at, synced_at
       FROM broker_users
       ORDER BY ${CHRONO_KEY} DESC`
    ).all();

    return new Response(JSON.stringify({ users: results || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to load users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
