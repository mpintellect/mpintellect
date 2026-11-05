// functions/api/admin/broker-lite/watermark.ts
// Tells tampermonkey/litefinance-sync.user.js the newest tx_date already in
// D1 for deposits, withdrawals, and the LocalService account's own
// operations ledger, so a sync only walks pages back to that point instead
// of re-walking the whole month every click - same idea as
// syncNewUsers()'s watermark in backend-lib/investizo-scraper.ts. Gated by
// the same LITEFINANCE_INGEST_TOKEN as sync.ts (not the main admin
// password) - the script never needs broader read access than this one
// value.

export async function onRequestGet(context: any) {
  const { request, env } = context;

  const authHeader = request.headers.get('Authorization');
  if (!env.LITEFINANCE_INGEST_TOKEN || authHeader !== `Bearer ${env.LITEFINANCE_INGEST_TOKEN}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // tx_date/reg_date are "DD.MM.YYYY HH:MM" - same re-slice trick as
  // data.ts's CHRONO_KEY so ORDER BY is chronological, not lexicographic on
  // the day-first text.
  const CHRONO_KEY = (col: string) =>
    `(substr(${col},7,4) || substr(${col},4,2) || substr(${col},1,2) || substr(${col},12,5))`;

  try {
    const [deposit, withdrawal, user, localOp] = await Promise.all([
      env.DB.prepare(`SELECT tx_date FROM litefinance_deposits ORDER BY ${CHRONO_KEY('tx_date')} DESC LIMIT 1`).first(),
      env.DB.prepare(`SELECT tx_date FROM litefinance_withdrawals ORDER BY ${CHRONO_KEY('tx_date')} DESC LIMIT 1`).first(),
      env.DB.prepare(`SELECT reg_date FROM litefinance_users ORDER BY ${CHRONO_KEY('reg_date')} DESC LIMIT 1`).first(),
      env.DB.prepare(`SELECT tx_date FROM litefinance_local_ops ORDER BY ${CHRONO_KEY('tx_date')} DESC LIMIT 1`).first(),
    ]);

    return new Response(
      JSON.stringify({
        deposits: deposit ? String(deposit.tx_date) : null,
        withdrawals: withdrawal ? String(withdrawal.tx_date) : null,
        users: user ? String(user.reg_date) : null,
        localOps: localOp ? String(localOp.tx_date) : null,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to load watermark' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
