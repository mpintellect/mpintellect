// functions/api/admin/broker-lite/sync.ts
//
// Ingest endpoint for the LiteFinance (admin.litefinance.com) broker sync.
// Unlike functions/api/admin/broker/sync.ts (Investizo), this Worker never
// talks to LiteFinance itself - it can't, admin.litefinance.com is VPN-gated
// with 2FA-per-new-device and only one device connected at a time, none of
// which a stateless Pages Function can satisfy. Instead,
// tampermonkey/litefinance-sync.user.js runs inside the admin's own
// already-authenticated browser tab, scrapes page-by-page client-side, and
// POSTs each page's parsed rows here as it goes.
//
// Deliberately gated by its own LITEFINANCE_INGEST_TOKEN, NOT the main
// ADMIN_PASSWORD/ADMIN_KEY - that token lives in Tampermonkey's local
// storage on whatever machine is running the userscript, so a leak of it
// should only be able to write broker-lite rows, not everything the main
// admin bearer token can do.
interface DepositRow {
  id: string;
  txDate: string;
  userName: string;
  country: string;
  verification: string;
  account: string;
  method: string;
  depositAmount: number | null;
  depositCurrency: string;
  payAmount: number | null;
  payCurrency: string;
  usdAmount: number | null;
  status: string;
}

interface WithdrawalRow {
  id: string;
  txDate: string;
  userName: string;
  country: string;
  verification: string;
  account: string;
  method: string;
  usdAmount: number | null;
  payAmount: number | null;
  payCurrency: string;
  totalAmount: number | null;
  totalCurrency: string;
  status: string;
  autoTest: string;
}

interface UserRow {
  id: string;
  clientUid: string;
  name: string | null;
  email: string | null;
  country: string;
  regDate: string;
  phone: string | null;
  emailStatus: string | null;
  phoneStatus: string | null;
  clientStatus: string | null;
}

// From the LocalService cash-agent account's own "All operations" tab - see
// schema.sql's litefinance_local_ops comment for the raw_type swap.
interface LocalOpRow {
  id: string;
  txDate: string;
  rawType: string;
  counterpartyAccount: string;
  opRef: string;
  amount: number | null;
}

// From /calls/index ("Commpeak Calls") - see schema.sql's litefinance_calls
// comment. userId is litefinance_users.id when the call resolved to a known
// client, null otherwise ("Unknown user"). clientEmail is the raw email text
// from the same cell (also null for "Unknown user") - kept separately so
// data.ts can fall back to matching by email when userId itself is null.
interface CallRow {
  id: string;
  agentCode: string | null;
  agentName: string | null;
  destination: string | null;
  clientEmail: string | null;
  userId: string | null;
  callStart: string;
  durationSec: number | null;
  hangupCause: string | null;
}

async function upsertDeposits(db: any, rows: DepositRow[]): Promise<number> {
  if (rows.length === 0) return 0;
  const stmt = db.prepare(
    `INSERT INTO litefinance_deposits
      (id, tx_date, user_name, country, verification_status, account, method,
       deposit_amount, deposit_currency, pay_amount, pay_currency, usd_amount, status, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET
       tx_date=excluded.tx_date, user_name=excluded.user_name, country=excluded.country,
       verification_status=excluded.verification_status, account=excluded.account, method=excluded.method,
       deposit_amount=excluded.deposit_amount, deposit_currency=excluded.deposit_currency,
       pay_amount=excluded.pay_amount, pay_currency=excluded.pay_currency,
       usd_amount=excluded.usd_amount, status=excluded.status, synced_at=CURRENT_TIMESTAMP`
  );
  const batch = rows.map((r) =>
    stmt.bind(
      r.id, r.txDate ?? null, r.userName ?? null, r.country ?? null, r.verification ?? null,
      r.account ?? null, r.method ?? null, r.depositAmount, r.depositCurrency ?? null,
      r.payAmount, r.payCurrency ?? null, r.usdAmount, r.status ?? null
    )
  );
  await db.batch(batch);
  return rows.length;
}

async function upsertWithdrawals(db: any, rows: WithdrawalRow[]): Promise<number> {
  if (rows.length === 0) return 0;
  const stmt = db.prepare(
    `INSERT INTO litefinance_withdrawals
      (id, tx_date, user_name, country, verification_status, account, method,
       usd_amount, pay_amount, pay_currency, total_amount, total_currency, status, auto_test, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET
       tx_date=excluded.tx_date, user_name=excluded.user_name, country=excluded.country,
       verification_status=excluded.verification_status, account=excluded.account, method=excluded.method,
       usd_amount=excluded.usd_amount, pay_amount=excluded.pay_amount, pay_currency=excluded.pay_currency,
       total_amount=excluded.total_amount, total_currency=excluded.total_currency,
       status=excluded.status, auto_test=excluded.auto_test, synced_at=CURRENT_TIMESTAMP`
  );
  const batch = rows.map((r) =>
    stmt.bind(
      r.id, r.txDate ?? null, r.userName ?? null, r.country ?? null, r.verification ?? null,
      r.account ?? null, r.method ?? null, r.usdAmount, r.payAmount, r.payCurrency ?? null,
      r.totalAmount, r.totalCurrency ?? null, r.status ?? null, r.autoTest ?? null
    )
  );
  await db.batch(batch);
  return rows.length;
}

async function upsertUsers(db: any, rows: UserRow[]): Promise<number> {
  if (rows.length === 0) return 0;
  const stmt = db.prepare(
    `INSERT INTO litefinance_users
      (id, client_uid, name, email, country, reg_date,
       phone, email_status, phone_status, client_status, detail_fetched_at, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET
       client_uid=excluded.client_uid, name=excluded.name, email=excluded.email, country=excluded.country,
       reg_date=excluded.reg_date,
       phone=excluded.phone, email_status=excluded.email_status, phone_status=excluded.phone_status,
       client_status=excluded.client_status, detail_fetched_at=CURRENT_TIMESTAMP, synced_at=CURRENT_TIMESTAMP`
  );
  const batch = rows.map((r) =>
    stmt.bind(
      r.id, r.clientUid ?? null, r.name ?? null, r.email ?? null, r.country ?? null, r.regDate ?? null,
      r.phone ?? null, r.emailStatus ?? null,
      r.phoneStatus ?? null, r.clientStatus ?? null
    )
  );
  await db.batch(batch);
  return rows.length;
}

async function upsertLocalOps(db: any, rows: LocalOpRow[]): Promise<number> {
  if (rows.length === 0) return 0;
  const stmt = db.prepare(
    `INSERT INTO litefinance_local_ops
      (id, tx_date, raw_type, counterparty_account, op_ref, amount, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET
       tx_date=excluded.tx_date, raw_type=excluded.raw_type, counterparty_account=excluded.counterparty_account,
       op_ref=excluded.op_ref, amount=excluded.amount, synced_at=CURRENT_TIMESTAMP`
  );
  const batch = rows.map((r) =>
    stmt.bind(r.id, r.txDate ?? null, r.rawType ?? null, r.counterpartyAccount ?? null, r.opRef ?? null, r.amount)
  );
  await db.batch(batch);
  return rows.length;
}

async function upsertCalls(db: any, rows: CallRow[]): Promise<number> {
  if (rows.length === 0) return 0;
  const stmt = db.prepare(
    `INSERT INTO litefinance_calls
      (id, agent_code, agent_name, destination, client_email, user_id, call_start, duration_sec, hangup_cause, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET
       agent_code=excluded.agent_code, agent_name=excluded.agent_name, destination=excluded.destination,
       client_email=excluded.client_email, user_id=excluded.user_id, call_start=excluded.call_start,
       duration_sec=excluded.duration_sec, hangup_cause=excluded.hangup_cause, synced_at=CURRENT_TIMESTAMP`
  );
  const batch = rows.map((r) =>
    stmt.bind(
      r.id, r.agentCode ?? null, r.agentName ?? null, r.destination ?? null, r.clientEmail ?? null, r.userId ?? null,
      r.callStart ?? null, r.durationSec, r.hangupCause ?? null
    )
  );
  await db.batch(batch);
  return rows.length;
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  const authHeader = request.headers.get('Authorization');
  if (!env.LITEFINANCE_INGEST_TOKEN || authHeader !== `Bearer ${env.LITEFINANCE_INGEST_TOKEN}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Second factor on top of the bearer token above - a session minted by
  // start-session.ts only after a live TOTP code, so a leaked
  // LITEFINANCE_INGEST_TOKEN alone still can't push data. One session
  // covers every page push of a single sync run (see SESSION_TTL_MS there).
  const sessionToken = request.headers.get('X-Sync-Session');
  if (!sessionToken) {
    return new Response(JSON.stringify({ error: 'Missing sync session - verify with a TOTP code first' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const session = await env.DB.prepare('SELECT expires_at FROM litefinance_sync_sessions WHERE token = ?')
    .bind(sessionToken)
    .first();
  if (!session || new Date(String(session.expires_at)).getTime() < Date.now()) {
    return new Response(JSON.stringify({ error: 'Sync session expired or invalid - verify with a TOTP code again' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { kind?: string; page?: number; rows?: unknown[] };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { kind, page, rows } = body;
  if (kind !== 'deposits' && kind !== 'withdrawals' && kind !== 'users' && kind !== 'local_ops' && kind !== 'calls') {
    return new Response(
      JSON.stringify({ error: 'kind must be "deposits", "withdrawals", "users", "local_ops", or "calls"' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (!Array.isArray(rows)) {
    return new Response(JSON.stringify({ error: 'rows must be an array' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const synced =
      kind === 'deposits'
        ? await upsertDeposits(env.DB, rows as DepositRow[])
        : kind === 'withdrawals'
        ? await upsertWithdrawals(env.DB, rows as WithdrawalRow[])
        : kind === 'users'
        ? await upsertUsers(env.DB, rows as UserRow[])
        : kind === 'local_ops'
        ? await upsertLocalOps(env.DB, rows as LocalOpRow[])
        : await upsertCalls(env.DB, rows as CallRow[]);

    await env.DB.prepare(
      `INSERT INTO litefinance_sync_log (kind, page, rows_synced, status, message) VALUES (?, ?, ?, 'success', ?)`
    )
      .bind(kind, page ?? null, synced, `Synced ${synced} ${kind} from page ${page ?? '?'}`)
      .run();

    return new Response(JSON.stringify({ ok: true, synced }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    const message = err?.message || String(err);
    await env.DB.prepare(
      `INSERT INTO litefinance_sync_log (kind, page, rows_synced, status, message) VALUES (?, ?, 0, 'error', ?)`
    )
      .bind(kind, page ?? null, message)
      .run()
      .catch(() => {});

    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
