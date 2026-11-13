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

  // litefinance_calls.call_start is already "YYYY-MM-DD HH:MM:SS" (see
  // schema.sql) - a plain substr(1,7), no re-slice needed like MONTH_KEY
  // above. "Successful" is defined here as hangup_cause = 'ANSWERED' - the
  // admin panel's own "Successful" filter was found live to not actually
  // filter results, so it's never trusted as a source field.
  const CALL_MONTH_KEY = `substr(call_start,1,7)`;
  const CALL_ANSWERED = `hangup_cause = 'ANSWERED'`;

  // There's no foreign key between litefinance_users and
  // litefinance_deposits/withdrawals - the deposits/withdrawals lists only
  // ever captured a free-text user_name, not a user id - so "active" is
  // matched by LOWER(TRIM(name)) across both tables, the best link this
  // data model has. Matches on ANY row regardless of status ("any activity
  // either one" per the admin - even a declined attempt counts as
  // activity), but the $ totals shown only sum successful rows so they stay
  // meaningful. Morocco-only throughout, same as every other stat here.
  const ACTIVE_USERS_CTE = `
    WITH dep_any AS (
      SELECT DISTINCT LOWER(TRIM(user_name)) AS uname FROM litefinance_deposits
      WHERE user_name IS NOT NULL AND user_name != '' AND ${MOROCCO_FILTER}
    ),
    wd_any AS (
      SELECT DISTINCT LOWER(TRIM(user_name)) AS uname FROM litefinance_withdrawals
      WHERE user_name IS NOT NULL AND user_name != '' AND ${MOROCCO_FILTER}
    ),
    dep_agg AS (
      SELECT LOWER(TRIM(user_name)) AS uname, COUNT(*) AS deposit_count, COALESCE(SUM(usd_amount),0) AS total_deposited
      FROM litefinance_deposits
      WHERE user_name IS NOT NULL AND user_name != '' AND LOWER(status) IN ${SUCCESS_DEPOSIT_STATUSES} AND ${MOROCCO_FILTER}
      GROUP BY uname
    ),
    wd_agg AS (
      SELECT LOWER(TRIM(user_name)) AS uname, COUNT(*) AS withdrawal_count, COALESCE(SUM(usd_amount),0) AS total_withdrawn
      FROM litefinance_withdrawals
      WHERE user_name IS NOT NULL AND user_name != '' AND LOWER(status) IN ${DONE_WITHDRAWAL_STATUSES} AND ${MOROCCO_FILTER}
      GROUP BY uname
    )
  `;
  const ACTIVE_USERS_MATCH = `
    LOWER(u.country) = 'morocco'
    AND u.name IS NOT NULL AND u.name != ''
    AND (
      EXISTS (SELECT 1 FROM dep_any WHERE dep_any.uname = LOWER(TRIM(u.name)))
      OR EXISTS (SELECT 1 FROM wd_any WHERE wd_any.uname = LOWER(TRIM(u.name)))
    )
  `;

  try {
    const [
      deposits,
      withdrawals,
      users,
      localOps,
      calls,
      activeUsers,
      activeUsersCount,
      totalMoroccoUsersCount,
      lastSync,
      totals,
      localOpsTotals,
      monthlyDeposits,
      monthlyWithdrawals,
      monthlyLocalBalanceDeposit,
      monthlyStatsHistory,
      monthlyRegistrations,
      callsManagerStats,
      localServiceClients,
      supportTeamMonthly,
      supportTeamByCountryTotal,
      moroccoByManagerTotal,
      moroccoSummaryMonthly,
    ] = await Promise.all([
      env.DB.prepare(`SELECT * FROM litefinance_deposits ORDER BY ${CHRONO_KEY} DESC LIMIT ?`).bind(limit).all(),
      env.DB.prepare(`SELECT * FROM litefinance_withdrawals ORDER BY ${CHRONO_KEY} DESC LIMIT ?`).bind(limit).all(),
      // latest_call: the newest litefinance_calls row per client, matched
      // only via c.user_id - the direct link LiteFinance itself sets when it
      // resolves the caller (same id space as litefinance_users.id, so this
      // is a plain primary-key join, no search/index of our own needed). No
      // email/phone fallback - a call LiteFinance shows as "Unknown user"
      // (user_id null) just won't appear in that client's history. A fallback
      // match against email, then phone, was tried and dropped: it was never
      // actually needed (0 of 518 calls lacked user_id) and the first version
      // of it caused a D1 read-quota incident. call_agent_name/call_hangup_cause/
      // call_last_at are null for a client never reached by any call - the
      // frontend renders that as "Not called yet".
      // is_active reuses the exact same dep_any/wd_any EXISTS match as
      // ACTIVE_USERS_MATCH below (live-measured at ~9k rows read for the
      // whole Morocco user base - cheap), just folded into this one query
      // instead of a separate request, so every row in the general Users
      // list can show a status dot without adding another full query.
      env.DB.prepare(
        `${ACTIVE_USERS_CTE},
         latest_call AS (
           SELECT c.user_id, c.agent_name, c.hangup_cause, c.call_start,
             ROW_NUMBER() OVER (PARTITION BY c.user_id ORDER BY c.call_start DESC) AS rn
           FROM litefinance_calls c WHERE c.user_id IS NOT NULL
         )
         SELECT u.*, lc.agent_name AS call_agent_name, lc.hangup_cause AS call_hangup_cause, lc.call_start AS call_last_at,
           CASE WHEN (
             EXISTS (SELECT 1 FROM dep_any WHERE dep_any.uname = LOWER(TRIM(u.name)))
             OR EXISTS (SELECT 1 FROM wd_any WHERE wd_any.uname = LOWER(TRIM(u.name)))
           ) THEN 1 ELSE 0 END AS is_active
         FROM litefinance_users u
         LEFT JOIN latest_call lc ON lc.user_id = u.id AND lc.rn = 1
         ORDER BY ${USER_CHRONO_KEY} DESC LIMIT ?`
      )
        .bind(usersLimit)
        .all(),
      // tx_date here is "DD.MM.YYYY HH:MM:SS" - same format and re-slice
      // trick as CHRONO_KEY above (defined against the same column name).
      env.DB.prepare(`SELECT * FROM litefinance_local_ops ORDER BY ${CHRONO_KEY} DESC LIMIT 5000`).all(),
      // Morocco-only per the admin's request. Tried joining c.user_id to
      // litefinance_users.id and filtering on country first, but live-
      // verified that join only resolves 38 of 666 calls to any user row at
      // all (litefinance_users sync coverage gap, unrelated to this filter)
      // - it made the whole tab go empty. destination is Morocco's +212
      // dialing code with no "+" or formatting (confirmed live, "212..." on
      // 666/666 calls synced so far) and is always present, unlike user_id
      // resolution, so it's used instead - no join needed.
      env.DB.prepare(
        `SELECT * FROM litefinance_calls
         WHERE destination LIKE '212%'
         ORDER BY call_start DESC LIMIT 5000`
      ).all(),
      env.DB.prepare(
        `${ACTIVE_USERS_CTE}
         SELECT u.id, u.client_uid, u.name, u.email, u.country, u.account, u.reg_date, u.phone,
           u.email_status, u.phone_status, u.client_status,
           COALESCE(dep_agg.deposit_count,0) AS deposit_count,
           COALESCE(dep_agg.total_deposited,0) AS total_deposited,
           COALESCE(wd_agg.withdrawal_count,0) AS withdrawal_count,
           COALESCE(wd_agg.total_withdrawn,0) AS total_withdrawn
         FROM litefinance_users u
         LEFT JOIN dep_agg ON dep_agg.uname = LOWER(TRIM(u.name))
         LEFT JOIN wd_agg ON wd_agg.uname = LOWER(TRIM(u.name))
         WHERE ${ACTIVE_USERS_MATCH}
         ORDER BY (COALESCE(dep_agg.total_deposited,0) + COALESCE(wd_agg.total_withdrawn,0)) DESC
         LIMIT 5000`
      ).all(),
      // Exact count, separate from the LIMIT 5000 row fetch above, so the
      // stat card is never silently wrong if active clients ever exceed that.
      env.DB.prepare(
        `${ACTIVE_USERS_CTE}
         SELECT COUNT(*) AS count FROM litefinance_users u WHERE ${ACTIVE_USERS_MATCH}`
      ).first(),
      env.DB.prepare(`SELECT COUNT(*) AS count FROM litefinance_users WHERE ${MOROCCO_FILTER}`).first(),
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
      // litefinance_local_ops' raw_type is from the LocalService account's
      // own point of view, which is the OPPOSITE of the client's - see
      // schema.sql's litefinance_local_ops comment. The swap happens right
      // here: raw_type='Withdrawal' (balance leaves LocalService to a
      // client) is a client DEPOSIT; raw_type='Deposit' (balance arrives
      // from a client) is a client WITHDRAWAL. Never swapped anywhere else.
      env.DB.prepare(
        `SELECT
          (SELECT COALESCE(SUM(amount),0) FROM litefinance_local_ops WHERE raw_type = 'Withdrawal') AS deposits_total_amount,
          (SELECT COUNT(*) FROM litefinance_local_ops WHERE raw_type = 'Withdrawal') AS deposits_count,
          (SELECT COALESCE(SUM(amount),0) FROM litefinance_local_ops WHERE raw_type = 'Deposit') AS withdrawals_total_amount,
          (SELECT COUNT(*) FROM litefinance_local_ops WHERE raw_type = 'Deposit') AS withdrawals_count,
          (SELECT COALESCE(SUM(amount),0) FROM litefinance_local_ops WHERE raw_type = 'Withdrawal' AND ${MONTH_KEY('tx_date')} = ?) AS deposits_this_month_amount,
          (SELECT COALESCE(SUM(amount),0) FROM litefinance_local_ops WHERE raw_type = 'Deposit' AND ${MONTH_KEY('tx_date')} = ?) AS withdrawals_this_month_amount`
      )
        .bind(currentMonth, currentMonth)
        .first(),
      // LIMIT 120 (10 years headroom), not 12 - unlike the other dashboard
      // stats this one is merged with litefinance_monthly_stats_history
      // below into a multi-year chart, so truncating to the last 12 months
      // would silently cut off recent live-synced months once there are
      // more than a year's worth.
      env.DB.prepare(
        `SELECT ${MONTH_KEY('tx_date')} AS month, COALESCE(SUM(usd_amount),0) AS total
         FROM litefinance_deposits WHERE LOWER(status) IN ${SUCCESS_DEPOSIT_STATUSES} AND ${MOROCCO_FILTER}
         GROUP BY month ORDER BY month DESC LIMIT 120`
      ).all(),
      env.DB.prepare(
        `SELECT ${MONTH_KEY('tx_date')} AS month, COALESCE(SUM(usd_amount),0) AS total
         FROM litefinance_withdrawals WHERE LOWER(status) IN ${DONE_WITHDRAWAL_STATUSES} AND ${MOROCCO_FILTER}
         GROUP BY month ORDER BY month DESC LIMIT 120`
      ).all(),
      // raw_type='Deposit' here is the client's own local withdrawal (money
      // arrives into LocalService from a client) - displayed as "Local
      // Balance Deposit" everywhere else on this panel. Not Morocco-scoped,
      // same as localOpsTotals above - this ledger has no country column.
      env.DB.prepare(
        `SELECT ${MONTH_KEY('tx_date')} AS month, COALESCE(SUM(amount),0) AS total
         FROM litefinance_local_ops WHERE raw_type = 'Deposit'
         GROUP BY month ORDER BY month DESC LIMIT 120`
      ).all(),
      // Hand-entered pre-sync history (March 2022 onward) - see schema.sql's
      // litefinance_monthly_stats_history comment. Merged below with the
      // live-computed totals above; in practice the two never overlap
      // (litefinance_deposits/withdrawals only ever hold the current month).
      env.DB.prepare(`SELECT month, deposits, withdrawals FROM litefinance_monthly_stats_history ORDER BY month`).all(),
      // Morocco-only, same as every other stat on this dashboard - per the
      // admin, registration/deposit/etc. figures here are always scoped to
      // Morocco, never other countries. Counts every litefinance_users row
      // with a reg_date (the full D1 client base for that country), not a
      // `limit`-capped subset.
      env.DB.prepare(
        `SELECT ${MONTH_KEY('reg_date')} AS month, COUNT(*) AS count
         FROM litefinance_users WHERE reg_date IS NOT NULL AND reg_date != '' AND ${MOROCCO_FILTER}
         GROUP BY month ORDER BY month DESC LIMIT 12`
      ).all(),
      // Per-manager monthly call stats for the Calls tab's "Monthly Stats"
      // view - total calls, successful (ANSWERED) calls, and total talk
      // time per agent per month. Morocco-only via the destination +212
      // prefix, same reasoning as the calls query above.
      env.DB.prepare(
        `SELECT ${CALL_MONTH_KEY} AS month, agent_code, agent_name,
           COUNT(*) AS total_calls,
           SUM(CASE WHEN ${CALL_ANSWERED} THEN 1 ELSE 0 END) AS successful_calls,
           COALESCE(SUM(duration_sec),0) AS total_duration_sec
         FROM litefinance_calls
         WHERE destination LIKE '212%'
         GROUP BY month, agent_code, agent_name
         ORDER BY month DESC, total_calls DESC
         LIMIT 500`
      ).all(),
      // Referred clients of the LocalService affiliate account - see
      // schema.sql's litefinance_local_service_clients comment. active DESC
      // first so the Clients view can show active ones before the (usually
      // much larger) inactive pile without the frontend re-sorting 400+ rows.
      env.DB.prepare(
        `SELECT * FROM litefinance_local_service_clients ORDER BY active DESC, total_profit DESC LIMIT 5000`
      ).all(),
      // Chat support stats (admin.litefinance.com/chat/statistics-support,
      // the live-chat widget - a different channel from litefinance_calls'
      // Commpeak phone calls) - see schema.sql's litefinance_chat_support_
      // stats comment. manager_filter != '' identifies the two tracked
      // support-team managers' own rows regardless of which exact ids were
      // requested; country_filter = 'MA' identifies the Morocco-scoped rows.
      env.DB.prepare(
        `SELECT substr(date_from,1,7) AS month, bucket_key AS name, sessions, users, rating
         FROM litefinance_chat_support_stats
         WHERE bucket_type = 'manager' AND manager_filter != ''
         ORDER BY date_from, bucket_key`
      ).all(),
      env.DB.prepare(
        `SELECT bucket_key AS name, COALESCE(SUM(sessions),0) AS sessions, COALESCE(SUM(users),0) AS users
         FROM litefinance_chat_support_stats
         WHERE bucket_type = 'country' AND manager_filter != ''
         GROUP BY bucket_key ORDER BY sessions DESC`
      ).all(),
      env.DB.prepare(
        `SELECT bucket_key AS name, COALESCE(SUM(sessions),0) AS sessions, COALESCE(SUM(users),0) AS users
         FROM litefinance_chat_support_stats
         WHERE bucket_type = 'manager' AND country_filter = 'MA'
         GROUP BY bucket_key ORDER BY sessions DESC`
      ).all(),
      env.DB.prepare(
        `SELECT substr(date_from,1,7) AS month, sessions, users
         FROM litefinance_chat_support_stats
         WHERE bucket_type = 'summary' AND country_filter = 'MA'
         ORDER BY date_from`
      ).all(),
    ]);

    const monthlyMap = new Map<string, { month: string; deposits: number; withdrawals: number; localBalanceDeposit: number }>();
    // Historical rows go in first so the live-computed totals below always
    // win for any month both happen to cover (never actually happens today
    // - see litefinance_monthly_stats_history's comment - but keeps the
    // live sync authoritative if that ever changes).
    for (const r of (monthlyStatsHistory?.results || []) as any[]) {
      monthlyMap.set(r.month, { month: r.month, deposits: r.deposits, withdrawals: r.withdrawals, localBalanceDeposit: 0 });
    }
    for (const r of (monthlyDeposits?.results || []) as any[]) {
      const existing = monthlyMap.get(r.month);
      if (existing) existing.deposits = r.total;
      else monthlyMap.set(r.month, { month: r.month, deposits: r.total, withdrawals: 0, localBalanceDeposit: 0 });
    }
    for (const r of (monthlyWithdrawals?.results || []) as any[]) {
      const existing = monthlyMap.get(r.month);
      if (existing) existing.withdrawals = r.total;
      else monthlyMap.set(r.month, { month: r.month, deposits: 0, withdrawals: r.total, localBalanceDeposit: 0 });
    }
    for (const r of (monthlyLocalBalanceDeposit?.results || []) as any[]) {
      const existing = monthlyMap.get(r.month);
      if (existing) existing.localBalanceDeposit = r.total;
      else monthlyMap.set(r.month, { month: r.month, deposits: 0, withdrawals: 0, localBalanceDeposit: r.total });
    }
    const monthlyStats = Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));
    const monthlyRegistrationStats = ((monthlyRegistrations?.results || []) as any[])
      .map((r) => ({ month: r.month, count: r.count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const callsManagerStatsList = ((callsManagerStats?.results || []) as any[]).map((r) => ({
      month: r.month,
      agentCode: r.agent_code,
      agentName: r.agent_name,
      totalCalls: Number(r.total_calls || 0),
      successfulCalls: Number(r.successful_calls || 0),
      totalDurationSec: Number(r.total_duration_sec || 0),
    }));

    return new Response(
      JSON.stringify({
        deposits: deposits?.results || [],
        withdrawals: withdrawals?.results || [],
        users: users?.results || [],
        localOps: localOps?.results || [],
        calls: calls?.results || [],
        callsManagerStats: callsManagerStatsList,
        localServiceClients: localServiceClients?.results || [],
        activeUsers: activeUsers?.results || [],
        activeUsersCount: Number(activeUsersCount?.count || 0),
        totalMoroccoUsersCount: Number(totalMoroccoUsersCount?.count || 0),
        lastSync: lastSync || null,
        totals: totals || null,
        localOpsTotals: localOpsTotals || null,
        monthlyRegistrations: monthlyRegistrationStats,
        monthlyStats,
        chatSupportStats: {
          supportTeamMonthly: supportTeamMonthly?.results || [],
          supportTeamByCountryTotal: supportTeamByCountryTotal?.results || [],
          moroccoByManagerTotal: moroccoByManagerTotal?.results || [],
          moroccoSummaryMonthly: moroccoSummaryMonthly?.results || [],
        },
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
