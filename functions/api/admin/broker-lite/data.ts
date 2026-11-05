// functions/api/admin/broker-lite/data.ts
// Read-only feed for app/admin/broker-lite/page.tsx: deposits/withdrawals
// already in D1 (written by tampermonkey/litefinance-sync.user.js via
// sync.ts), plus totals and the last sync log entry. Never talks to
// LiteFinance itself. Admin-gated the same way as the rest of /api/admin/*
// (Bearer <ADMIN_PASSWORD|ADMIN_KEY>, fails closed) - this is the dashboard
// read, separate from sync.ts's own LITEFINANCE_INGEST_TOKEN gate.

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
  const limit = Math.min(parseInt(searchParams.get('limit') || '500', 10) || 500, 2000);
  // Separate, much higher cap for users - the bulk Excel import brought
  // litefinance_users to 8000+ rows, far past what deposits/withdrawals
  // ever need.
  const usersLimit = Math.min(parseInt(searchParams.get('usersLimit') || '2000', 10) || 2000, 20000);

  // tx_date is "DD.MM.YYYY HH:MM", same format and same re-slice trick as
  // functions/api/admin/broker/data.ts's CHRONO_KEY.
  const CHRONO_KEY = `(substr(tx_date,7,4) || substr(tx_date,4,2) || substr(tx_date,1,2) || substr(tx_date,12,5))`;

  const SUCCESS_DEPOSIT_STATUSES = `('deposited')`;
  const DECLINED_DEPOSIT_STATUSES = `('declined')`;
  const DONE_WITHDRAWAL_STATUSES = `('done','done auto')`;
  const FAILED_WITHDRAWAL_STATUSES = `('return','error')`;
  // The overview stat cards are Morocco-only per the admin's request - the
  // raw deposits/withdrawals rows below stay unfiltered (every country),
  // the Country multi-select filter in the UI already covers browsing
  // other countries.
  const MOROCCO_FILTER = `LOWER(country) = 'morocco'`;

  const USER_CHRONO_KEY = `(substr(reg_date,7,4) || substr(reg_date,4,2) || substr(reg_date,1,2) || substr(reg_date,12,5))`;

  // "YYYY-MM" for the calendar month tx_date/reg_date falls in - same
  // substr positions as CHRONO_KEY, just stopping after the month.
  const MONTH_KEY = (col: string) => `(substr(${col},7,4) || '-' || substr(${col},4,2))`;
  const now = new Date();
  const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

  try {
    const [deposits, withdrawals, users, lastSync, totals, monthlyDeposits, monthlyWithdrawals, monthlyRegistrations] = await Promise.all([
      env.DB.prepare(`SELECT * FROM litefinance_deposits ORDER BY ${CHRONO_KEY} DESC LIMIT ?`).bind(limit).all(),
      env.DB.prepare(`SELECT * FROM litefinance_withdrawals ORDER BY ${CHRONO_KEY} DESC LIMIT ?`).bind(limit).all(),
      env.DB.prepare(`SELECT * FROM litefinance_users ORDER BY ${USER_CHRONO_KEY} DESC LIMIT ?`).bind(usersLimit).all(),
      env.DB.prepare('SELECT * FROM litefinance_sync_log ORDER BY created_at DESC LIMIT 1').first(),
      env.DB.prepare(
        `SELECT
          (SELECT COALESCE(SUM(usd_amount),0) FROM litefinance_deposits WHERE LOWER(status) IN ${SUCCESS_DEPOSIT_STATUSES} AND ${MOROCCO_FILTER}) AS deposits_total_amount,
          (SELECT COUNT(*) FROM litefinance_deposits WHERE LOWER(status) IN ${SUCCESS_DEPOSIT_STATUSES} AND ${MOROCCO_FILTER}) AS deposits_success_count,
          (SELECT COUNT(*) FROM litefinance_deposits WHERE LOWER(status) IN ${DECLINED_DEPOSIT_STATUSES} AND ${MOROCCO_FILTER}) AS deposits_declined_count,
          (SELECT COALESCE(SUM(usd_amount),0) FROM litefinance_withdrawals WHERE LOWER(status) IN ${DONE_WITHDRAWAL_STATUSES} AND ${MOROCCO_FILTER}) AS withdrawals_total_amount,
          (SELECT COUNT(*) FROM litefinance_withdrawals WHERE LOWER(status) IN ${DONE_WITHDRAWAL_STATUSES} AND ${MOROCCO_FILTER}) AS withdrawals_done_count,
          (SELECT COUNT(*) FROM litefinance_withdrawals WHERE LOWER(status) IN ${FAILED_WITHDRAWAL_STATUSES} AND ${MOROCCO_FILTER}) AS withdrawals_failed_count,
          (SELECT COUNT(*) FROM litefinance_withdrawals WHERE LOWER(status) NOT IN ${DONE_WITHDRAWAL_STATUSES} AND LOWER(status) NOT IN ${FAILED_WITHDRAWAL_STATUSES} AND ${MOROCCO_FILTER}) AS withdrawals_pending_count,
          (SELECT COUNT(*) FROM (
            SELECT user_name FROM litefinance_deposits WHERE user_name IS NOT NULL AND user_name != '' AND ${MOROCCO_FILTER}
            UNION
            SELECT user_name FROM litefinance_withdrawals WHERE user_name IS NOT NULL AND user_name != '' AND ${MOROCCO_FILTER}
          )) AS unique_users,
          (SELECT COALESCE(SUM(usd_amount),0) FROM litefinance_deposits WHERE LOWER(status) IN ${SUCCESS_DEPOSIT_STATUSES} AND ${MOROCCO_FILTER} AND ${MONTH_KEY('tx_date')} = ?) AS deposits_this_month_amount,
          (SELECT COALESCE(SUM(usd_amount),0) FROM litefinance_withdrawals WHERE LOWER(status) IN ${DONE_WITHDRAWAL_STATUSES} AND ${MOROCCO_FILTER} AND ${MONTH_KEY('tx_date')} = ?) AS withdrawals_this_month_amount`
      )
        .bind(currentMonth, currentMonth)
        .first(),
      env.DB.prepare(
        `SELECT ${MONTH_KEY('tx_date')} AS month, COALESCE(SUM(usd_amount),0) AS total
         FROM litefinance_deposits WHERE LOWER(status) IN ${SUCCESS_DEPOSIT_STATUSES} AND ${MOROCCO_FILTER}
         GROUP BY month ORDER BY month DESC LIMIT 12`
      ).all(),
      env.DB.prepare(
        `SELECT ${MONTH_KEY('tx_date')} AS month, COALESCE(SUM(usd_amount),0) AS total
         FROM litefinance_withdrawals WHERE LOWER(status) IN ${DONE_WITHDRAWAL_STATUSES} AND ${MOROCCO_FILTER}
         GROUP BY month ORDER BY month DESC LIMIT 12`
      ).all(),
      env.DB.prepare(
        `SELECT ${MONTH_KEY('reg_date')} AS month, COUNT(*) AS count
         FROM litefinance_users WHERE reg_date IS NOT NULL AND reg_date != '' AND ${MOROCCO_FILTER}
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
        deposits: deposits?.results || [],
        withdrawals: withdrawals?.results || [],
        users: users?.results || [],
        lastSync: lastSync || null,
        totals: totals || null,
        monthlyRegistrations: monthlyRegistrationStats,
        monthlyStats,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to load broker-lite data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
