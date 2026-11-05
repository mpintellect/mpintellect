// functions/api/admin/broker/data.ts
// Read-only feed for app/admin/broker/page.tsx: latest Investizo stats
// snapshot, most recent deposits/withdrawals, and the last sync's status -
// all already in D1 (written by workers/broker-sync's cron job or the
// manual-refresh sync.ts endpoint). This endpoint never talks to Investizo
// itself. Admin-gated the same way as the rest of /api/admin/* and
// /api/telegram/* (Bearer <ADMIN_PASSWORD|ADMIN_KEY>, fails closed).

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

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10) || 50, 200);

  // tx_date is Investizo's own "DD.MM.YYYY HH:MM" text, not ISO - sorting
  // the raw string puts "31.07.2025" ahead of "02.11.2026" (lexicographic on
  // the day first). Re-slice to "YYYYMMDDHH:MM" so ORDER BY is actually
  // chronological; relies on the format being fixed-width, which the scraper
  // guarantees (backend-lib/investizo-scraper.ts).
  const CHRONO_KEY = `(substr(tx_date,7,4) || substr(tx_date,4,2) || substr(tx_date,1,2) || substr(tx_date,12,5))`;

  // Same success/declined classification as app/admin/broker/page.tsx's
  // isSuccessStatus/isDeclinedStatus - keep these in sync if either changes.
  const SUCCESS_STATUSES = `('deposited','completed','complete','done')`;
  const DECLINED_STATUSES = `('declined','rejected','error','canceled','cancelled')`;
  // Same match as functions/api/admin/broker/export-sheet.ts - keep in sync
  // if either changes. Matches the normal "local (Local Deposit Morocco)"
  // method string, AND bare "local" (seen on at least one real deposit,
  // id 450716, confirmed by the admin as a Morocco transaction) - but NOT
  // "local (Local deposit Algeria)", a different, unrelated method.
  const LOCAL_METHOD_FILTER = `(LOWER(method) = 'local' OR LOWER(method) LIKE 'local (local deposit morocco)%')`;
  // payment_amount is normally already MAD for local transactions, but at
  // least one row (id 450716, bare "local" method) has payment_currency
  // USD instead - Investizo's own Payment column showed a dollar figure for
  // it. Confirmed by the admin: MAD = USD * 10 (their fixed rate) in that
  // case. Same expression as export-sheet.ts - keep in sync.
  const MAD_AMOUNT_EXPR = `(CASE WHEN LOWER(payment_currency) = 'mad' THEN payment_amount ELSE account_amount * 10 END)`;

  // "YYYY-MM" for the calendar month tx_date falls in - same substr
  // positions as CHRONO_KEY, just stopping after the month.
  const MONTH_KEY = (col: string) => `(substr(${col},7,4) || '-' || substr(${col},4,2))`;
  const now = new Date();
  const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

  try {
    const [
      latestStats,
      deposits,
      withdrawals,
      lastSync,
      totals,
      localBalance,
      expenses,
      monthlyDeposits,
      monthlyWithdrawals,
      monthlyRegistrations,
    ] = await Promise.all([
      env.DB.prepare('SELECT * FROM broker_stats_snapshots ORDER BY synced_at DESC LIMIT 1').first(),
      env.DB.prepare(`SELECT * FROM broker_deposits ORDER BY ${CHRONO_KEY} DESC LIMIT ?`).bind(limit).all(),
      env.DB.prepare(`SELECT * FROM broker_withdrawals ORDER BY ${CHRONO_KEY} DESC LIMIT ?`).bind(limit).all(),
      env.DB.prepare('SELECT * FROM broker_sync_log ORDER BY created_at DESC LIMIT 1').first(),
      // Totals over the FULL tables, not just the `limit`-capped rows above -
      // the overview cards need to be accurate even once synced history
      // outgrows what the page loads for display.
      env.DB.prepare(
        `SELECT
          (SELECT COALESCE(SUM(account_amount),0) FROM broker_deposits WHERE LOWER(status) IN ${SUCCESS_STATUSES}) AS deposits_total_amount,
          (SELECT COUNT(*) FROM broker_deposits WHERE LOWER(status) IN ${SUCCESS_STATUSES}) AS deposits_success_count,
          (SELECT COUNT(*) FROM broker_deposits WHERE LOWER(status) IN ${DECLINED_STATUSES}) AS deposits_declined_count,
          (SELECT COALESCE(SUM(account_amount),0) FROM broker_withdrawals WHERE LOWER(status) IN ${SUCCESS_STATUSES}) AS withdrawals_total_amount,
          (SELECT COUNT(*) FROM broker_withdrawals WHERE LOWER(status) IN ${SUCCESS_STATUSES}) AS withdrawals_completed_count,
          (SELECT COALESCE(SUM(account_amount),0) FROM broker_withdrawals WHERE LOWER(status) NOT IN ${SUCCESS_STATUSES} AND LOWER(status) NOT IN ${DECLINED_STATUSES}) AS withdrawals_pending_amount,
          (SELECT COUNT(*) FROM broker_withdrawals WHERE LOWER(status) NOT IN ${SUCCESS_STATUSES} AND LOWER(status) NOT IN ${DECLINED_STATUSES}) AS withdrawals_pending_count,
          (SELECT COUNT(*) FROM (
            SELECT user_name FROM broker_deposits WHERE user_name IS NOT NULL AND user_name != ''
            UNION
            SELECT user_name FROM broker_withdrawals WHERE user_name IS NOT NULL AND user_name != ''
          )) AS unique_users,
          (SELECT COALESCE(SUM(account_amount),0) FROM broker_deposits WHERE LOWER(status) IN ${SUCCESS_STATUSES} AND ${MONTH_KEY('tx_date')} = ?) AS deposits_this_month_amount,
          (SELECT COALESCE(SUM(account_amount),0) FROM broker_withdrawals WHERE LOWER(status) IN ${SUCCESS_STATUSES} AND ${MONTH_KEY('tx_date')} = ?) AS withdrawals_this_month_amount`
      )
        .bind(currentMonth, currentMonth)
        .first(),
      // Local (Morocco) balance: deposited - withdrawn - manual expenses,
      // in both MAD and USD. Separate from `totals` above, which covers
      // every method, not just local.
      env.DB.prepare(
        `SELECT
          (SELECT COALESCE(SUM(${MAD_AMOUNT_EXPR}),0) FROM broker_deposits WHERE ${LOCAL_METHOD_FILTER} AND LOWER(status) IN ${SUCCESS_STATUSES}) AS deposited_mad,
          (SELECT COALESCE(SUM(account_amount),0) FROM broker_deposits WHERE ${LOCAL_METHOD_FILTER} AND LOWER(status) IN ${SUCCESS_STATUSES}) AS deposited_usd,
          (SELECT COALESCE(SUM(${MAD_AMOUNT_EXPR}),0) FROM broker_withdrawals WHERE ${LOCAL_METHOD_FILTER} AND LOWER(status) IN ${SUCCESS_STATUSES}) AS withdrawn_mad,
          (SELECT COALESCE(SUM(account_amount),0) FROM broker_withdrawals WHERE ${LOCAL_METHOD_FILTER} AND LOWER(status) IN ${SUCCESS_STATUSES}) AS withdrawn_usd,
          (SELECT COALESCE(SUM(amount_mad),0) FROM broker_local_expenses) AS expenses_mad,
          (SELECT COALESCE(SUM(amount_usd),0) FROM broker_local_expenses) AS expenses_usd`
      ).first(),
      env.DB.prepare('SELECT * FROM broker_local_expenses ORDER BY expense_date DESC').all(),
      env.DB.prepare(
        `SELECT ${MONTH_KEY('tx_date')} AS month, COALESCE(SUM(account_amount),0) AS total
         FROM broker_deposits WHERE LOWER(status) IN ${SUCCESS_STATUSES}
         GROUP BY month ORDER BY month DESC LIMIT 12`
      ).all(),
      env.DB.prepare(
        `SELECT ${MONTH_KEY('tx_date')} AS month, COALESCE(SUM(account_amount),0) AS total
         FROM broker_withdrawals WHERE LOWER(status) IN ${SUCCESS_STATUSES}
         GROUP BY month ORDER BY month DESC LIMIT 12`
      ).all(),
      env.DB.prepare(
        `SELECT ${MONTH_KEY('reg_date')} AS month, COUNT(*) AS count
         FROM broker_users WHERE reg_date IS NOT NULL AND reg_date != ''
         GROUP BY month ORDER BY month DESC LIMIT 12`
      ).all(),
    ]);

    const monthlyMap = new Map<string, { month: string; deposits: number; withdrawals: number }>();
    for (const r of (monthlyDeposits?.results || []) as any[]) {
      monthlyMap.set(r.month, { month: r.month, deposits: r.total, withdrawals: 0 });
    }
    for (const r of (monthlyWithdrawals?.results || []) as any[]) {
      const existing = monthlyMap.get(r.month);
      if (existing) existing.withdrawals = r.total;
      else monthlyMap.set(r.month, { month: r.month, deposits: 0, withdrawals: r.total });
    }
    const monthlyStats = Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));
    const monthlyRegistrationStats = ((monthlyRegistrations?.results || []) as any[])
      .map((r) => ({ month: r.month, count: r.count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return new Response(
      JSON.stringify({
        stats: latestStats || null,
        deposits: deposits?.results || [],
        withdrawals: withdrawals?.results || [],
        lastSync: lastSync || null,
        totals: totals || null,
        monthlyStats,
        monthlyRegistrations: monthlyRegistrationStats,
        localBalance: localBalance || null,
        expenses: expenses?.results || [],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to load broker data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
