// functions/api/admin/broker-lite/users-gaps.ts
// Lists already-synced litefinance_users rows missing email - every
// registered LiteFinance client has one, so a gap here means a past
// profile fetch failed or returned nothing (transient network issue, not a
// design limitation). tampermonkey/litefinance-sync.user.js re-fetches just
// these profiles each sync click and pushes corrected rows - not a backfill
// of clients from before the sync's dateFrom floor, which is a deliberate
// scope decision, not a gap. Gated by LITEFINANCE_INGEST_TOKEN like
// watermark.ts, not the main admin password.
//
// `id IS NOT NULL` excludes Excel-imported rows (schema.sql's
// litefinance_users comment) - those have no real /users/view profile to
// re-fetch, so without this they'd be retried forever on every click for
// nothing. MAX_GAPS caps how many get retried per click, same spirit as
// Investizo's MAX_NEW_USERS_PER_SYNC.
const MAX_GAPS = 10;

export async function onRequestGet(context: any) {
  const { request, env } = context;

  const authHeader = request.headers.get('Authorization');
  if (!env.LITEFINANCE_INGEST_TOKEN || authHeader !== `Bearer ${env.LITEFINANCE_INGEST_TOKEN}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const rows = await env.DB.prepare(
      `SELECT id, client_uid, country, reg_date
       FROM litefinance_users WHERE (email IS NULL OR email = '') AND id IS NOT NULL
       LIMIT ?`
    )
      .bind(MAX_GAPS)
      .all();

    return new Response(JSON.stringify({ rows: rows?.results || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to load gaps' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
