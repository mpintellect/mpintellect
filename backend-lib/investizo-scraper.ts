// backend-lib/investizo-scraper.ts
//
// Pulls deposit/withdrawal/summary data out of invest-panel.com ("Investizo"),
// the broker partner CRM at app/admin/broker/page.tsx is a front-end for.
// There is no public API on their side - it's a plain server-rendered Yii2
// app (login form posts LoginForm[email]/LoginForm[password] + a
// _csrf-backend token, session tracked via a cookie) - so this logs in with
// a real fetch() POST and scrapes the authenticated HTML with Cloudflare's
// native HTMLRewriter. No headless browser needed.
//
// Used only by functions/api/admin/broker/sync.ts, the admin page's manual
// "Refresh" button - deliberately no background cron, so Investizo only
// ever sees a login when the admin actually opens the dashboard and asks
// for fresh data.
//
// Built from the page structure seen live (screenshots), not raw HTML, since
// nobody but the account owner can log in to check selectors directly - if
// Investizo's markup differs from what's assumed here, syncInvestizoData()
// will fail loudly (caught, logged to broker_sync_log with a message) rather
// than silently writing nothing. Check broker_sync_log first if a sync comes
// back empty.

export interface InvestizoEnv {
  INVESTIZO_EMAIL?: string;
  INVESTIZO_PASSWORD?: string;
  DB: D1Database;
}

const BASE = 'https://invest-panel.com';

// How many deposit/withdrawal list pages (50 rows each) to pull per sync.
// Investizo sorts newest-first, so this caps each manual refresh to the
// most recent ~250 rows instead of walking all 700+ every time - older
// rows were already upserted on a prior run; raise this for a one-off
// full backfill.
const MAX_LIST_PAGES = 5;

interface SyncResult {
  ok: boolean;
  message: string;
  stats?: Record<string, string>;
  depositsSynced: number;
  withdrawalsSynced: number;
  durationMs: number;
}

// ---------------------------------------------------------------------------
// Cookie jar helpers - Workers' fetch() Headers supports getSetCookie() per
// the modern Fetch spec (multiple Set-Cookie headers, each kept distinct).
// ---------------------------------------------------------------------------
function collectCookies(headers: Headers): string[] {
  const anyHeaders = headers as any;
  if (typeof anyHeaders.getSetCookie === 'function') {
    return anyHeaders.getSetCookie();
  }
  // Fallback for older runtimes: single combined header, best-effort split.
  const raw = headers.get('set-cookie');
  return raw ? raw.split(/,(?=\s*[\w-]+=)/) : [];
}

function mergeCookieJar(jar: Map<string, string>, setCookies: string[]) {
  for (const sc of setCookies) {
    const [pair] = sc.split(';');
    const eq = pair.indexOf('=');
    if (eq === -1) continue;
    const name = pair.slice(0, eq).trim();
    const value = pair.slice(eq + 1).trim();
    if (name) jar.set(name, value);
  }
}

function cookieHeader(jar: Map<string, string>): string {
  return Array.from(jar.entries()).map(([k, v]) => `${k}=${v}`).join('; ');
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
async function login(env: InvestizoEnv): Promise<Map<string, string>> {
  if (!env.INVESTIZO_EMAIL || !env.INVESTIZO_PASSWORD) {
    throw new Error('INVESTIZO_EMAIL / INVESTIZO_PASSWORD not configured');
  }

  const jar = new Map<string, string>();

  const loginPageRes = await fetch(`${BASE}/login/index`, { redirect: 'manual' });
  mergeCookieJar(jar, collectCookies(loginPageRes.headers));
  const html = await loginPageRes.text();

  const csrfMatch = html.match(/name="csrf-token"\s+content="([^"]+)"/);
  const csrfToken = csrfMatch?.[1];
  if (!csrfToken) {
    throw new Error('Could not find csrf-token meta tag on Investizo login page - page markup may have changed');
  }

  const body = new URLSearchParams();
  body.set('_csrf-backend', csrfToken);
  body.set('LoginForm[email]', env.INVESTIZO_EMAIL);
  body.set('LoginForm[password]', env.INVESTIZO_PASSWORD);
  body.set('LoginForm[remember]', '0');

  const loginRes = await fetch(`${BASE}/login/index`, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookieHeader(jar),
      Referer: `${BASE}/login/index`,
    },
    body: body.toString(),
  });
  mergeCookieJar(jar, collectCookies(loginRes.headers));

  // A successful Yii2 login redirects (302) to the dashboard; a failed one
  // re-renders the login form with 200. Include a snippet of Investizo's
  // own response body in the error (not just the status code) so
  // broker_sync_log shows the actual cause instead of a guess.
  if (loginRes.status !== 302) {
    const snippet = (await loginRes.text()).replace(/\s+/g, ' ').trim().slice(0, 400);
    throw new Error(`Investizo login did not redirect (status ${loginRes.status}): ${snippet || '(empty body)'}`);
  }

  return jar;
}

async function authedGet(jar: Map<string, string>, path: string): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    headers: { Cookie: cookieHeader(jar) },
  });
}

// ---------------------------------------------------------------------------
// HTML parsing via HTMLRewriter (no DOM available in Workers)
// ---------------------------------------------------------------------------

// /statistics/summary renders two side-by-side <table>s, each row a
// <tr><th>Label</th><td>Value</td></tr> pair (e.g. "Deposits" / "$ 0.00") -
// label in a <th>, value in a <td>, not two <td>s.
async function parseSummaryStats(res: Response): Promise<Record<string, string>> {
  const stats: Record<string, string> = {};
  let label = '';
  let value = '';

  const flushRow = () => {
    const l = label.trim();
    const v = value.trim();
    if (l) stats[l] = v;
    label = '';
    value = '';
  };

  const rewriter = new HTMLRewriter()
    .on('table tr', { element() { flushRow(); } })
    .on('table tr th', { text(chunk) { label += chunk.text; } })
    .on('table tr td', { text(chunk) { value += chunk.text; } });

  await rewriter.transform(res).text(); // drive the stream; result discarded
  flushRow(); // last row has no following <tr> to trigger the flush above
  return stats;
}

interface ListRow {
  id: string;
  cells: string[];
}

// Deposits/Withdrawals list pages: a single data <table> with a <tbody>,
// each row's cells in column order (#, Date, User, Method,
// Purse/Transaction, Account, Account amount, Payment, Status).
async function parseListTable(res: Response): Promise<ListRow[]> {
  const rows: ListRow[] = [];
  let current: string[] = [];
  let cellText = '';
  let inBody = false;

  const rewriter = new HTMLRewriter()
    .on('table tbody', {
      element(el) {
        inBody = true;
        el.onEndTag(() => {
          inBody = false;
        });
      },
    })
    .on('table tbody tr', {
      element(el) {
        current = [];
        el.onEndTag(() => {
          if (inBody && current.length > 0 && current[0]) {
            rows.push({ id: current[0], cells: current });
          }
        });
      },
    })
    .on('table tbody tr td', {
      // Cells like the User column nest multiple elements/text nodes
      // (icon, flag <img>, name <a>, each separated by whitespace text
      // nodes) - pushing on every chunk.lastInTextNode pushed one array
      // entry per text node instead of per cell, corrupting every column
      // after it. Accumulate the whole cell and push once, on its close tag.
      element(el) {
        cellText = '';
        el.onEndTag(() => {
          current.push(cellText.replace(/\s+/g, ' ').trim());
        });
      },
      text(chunk) {
        cellText += chunk.text;
      },
    });

  await rewriter.transform(res).text();
  return rows;
}

// "$ 182.00" / "1 820.00 MAD" -> { amount: 1820, currency: 'MAD' }
// Investizo uses a space as the thousands separator (e.g. "2 400.00"), so a
// comma/space between two digits is a grouping separator to drop, not a
// boundary - matching just the leading digit run would truncate "2 400.00" to 2.
function parseMoney(raw: string | undefined): { amount: number | null; currency: string } {
  if (!raw) return { amount: null, currency: '' };
  const trimmed = raw.trim();
  const noThousands = trimmed.replace(/(\d)[,\s](?=\d)/g, '$1');
  const match = noThousands.match(/([\d.]+)/);
  const amount = match ? parseFloat(match[1]) : null;
  const currency = noThousands.replace(/[\d.\s$]/g, '').trim() || (trimmed.includes('$') ? 'USD' : '');
  return { amount, currency };
}

async function fetchListPages(
  jar: Map<string, string>,
  basePath: 'deposits' | 'withdrawals',
  maxPages: number
): Promise<ListRow[]> {
  const all: ListRow[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const path = page === 1 ? `/${basePath}/index` : `/${basePath}/index?page=${page}`;
    const res = await authedGet(jar, path);
    if (!res.ok) break;
    const rows = await parseListTable(res);
    if (rows.length === 0) break; // ran past the last page
    all.push(...rows);
  }
  return all;
}

// ---------------------------------------------------------------------------
// D1 upserts
// ---------------------------------------------------------------------------
async function upsertListRows(db: D1Database, table: 'broker_deposits' | 'broker_withdrawals', rows: ListRow[]): Promise<number> {
  if (rows.length === 0) return 0;
  const stmt = db.prepare(
    `INSERT INTO ${table}
      (id, tx_date, user_name, method, purse_transaction, account, account_amount, payment_amount, payment_currency, status, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET
       tx_date=excluded.tx_date, user_name=excluded.user_name, method=excluded.method,
       purse_transaction=excluded.purse_transaction, account=excluded.account,
       account_amount=excluded.account_amount, payment_amount=excluded.payment_amount,
       payment_currency=excluded.payment_currency, status=excluded.status,
       synced_at=CURRENT_TIMESTAMP`
  );
  const batch = rows.map((r) => {
    // Deposits cells: [#, Date, User, Method, Purse/Transaction, Account, Account amount, Payment, Status]
    // Withdrawals cells: [#, Date, User, "Method: purse" (one combined column,
    // e.g. "bsc-usdt: 0x1fab..."), Account, Account amount, Payment, Status, (blank trailing column)]
    // - withdrawals/index has no separate Purse/Transaction column, so don't
    // destructure it as if it were shaped like deposits.
    let id: string, date: string, user: string, method: string, purse: string | undefined,
      account: string, accountAmountRaw: string, paymentRaw: string, status: string;
    if (table === 'broker_deposits') {
      [id, date, user, method, purse, account, accountAmountRaw, paymentRaw, status] = r.cells;
    } else {
      [id, date, user, method, account, accountAmountRaw, paymentRaw, status] = r.cells;
      purse = undefined;
    }
    const accountAmount = parseMoney(accountAmountRaw);
    const payment = parseMoney(paymentRaw);
    return stmt.bind(
      id, date ?? null, user ?? null, method ?? null, purse ?? null, account ?? null,
      accountAmount.amount, payment.amount, payment.currency, status ?? null
    );
  });
  await db.batch(batch);
  return rows.length;
}

async function insertStatsSnapshot(db: D1Database, stats: Record<string, string>) {
  const num = (key: string) => parseMoney(stats[key]).amount;
  const int = (key: string) => {
    const v = stats[key];
    return v ? parseInt(v.replace(/\D/g, ''), 10) || 0 : null;
  };
  await db
    .prepare(
      `INSERT INTO broker_stats_snapshots
        (registrations, deposits_total, deposits_commission, withdrawals_done, withdrawals_pending,
         affiliate_rebate, affiliate_pending, pamm_current, equity, balance, raw_json, synced_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
    )
    .bind(
      int('Registrations'),
      num('Deposits'),
      num('Deposits Commission'),
      num('Withdrawals Done'),
      num('Withdrawals Pending'),
      num('Affiliate Rebate'),
      num('Affiliate Pending'),
      num('Pamm Current'),
      num('Equity'),
      num('Balance'),
      JSON.stringify(stats)
    )
    .run();
}

async function logSync(db: D1Database, source: 'cron' | 'manual', result: Omit<SyncResult, 'durationMs'> & { durationMs: number }) {
  await db
    .prepare(
      `INSERT INTO broker_sync_log (source, status, message, deposits_synced, withdrawals_synced, duration_ms)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(source, result.ok ? 'success' : 'error', result.message, result.depositsSynced, result.withdrawalsSynced, result.durationMs)
    .run();
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------
export async function syncInvestizoData(env: InvestizoEnv, source: 'cron' | 'manual' = 'manual'): Promise<SyncResult> {
  const start = Date.now();
  try {
    const jar = await login(env);

    const summaryRes = await authedGet(jar, '/statistics/summary');
    const stats = await parseSummaryStats(summaryRes);
    if (Object.keys(stats).length > 0) {
      await insertStatsSnapshot(env.DB, stats);
    }

    const [depositRows, withdrawalRows] = await Promise.all([
      fetchListPages(jar, 'deposits', MAX_LIST_PAGES),
      fetchListPages(jar, 'withdrawals', MAX_LIST_PAGES),
    ]);

    const depositsSynced = await upsertListRows(env.DB, 'broker_deposits', depositRows);
    const withdrawalsSynced = await upsertListRows(env.DB, 'broker_withdrawals', withdrawalRows);

    const result: SyncResult = {
      ok: true,
      message: `Synced ${Object.keys(stats).length} stat fields, ${depositsSynced} deposits, ${withdrawalsSynced} withdrawals`,
      stats,
      depositsSynced,
      withdrawalsSynced,
      durationMs: Date.now() - start,
    };
    await logSync(env.DB, source, result);
    return result;
  } catch (err: any) {
    const result: SyncResult = {
      ok: false,
      message: err?.message || String(err),
      depositsSynced: 0,
      withdrawalsSynced: 0,
      durationMs: Date.now() - start,
    };
    await logSync(env.DB, source, result);
    return result;
  }
}

// Cloudflare's standard email-obfuscation decode: first hex byte is an XOR
// key, every subsequent byte pair is one character XORed with it. See
// fetchAndCacheUserDetail() below for where this is needed.
function decodeCfEmail(hex: string): string {
  const key = parseInt(hex.slice(0, 2), 16);
  let email = '';
  for (let i = 2; i < hex.length; i += 2) {
    email += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  }
  return email;
}

// ---------------------------------------------------------------------------
// Users list (invest-panel.com/users/index) - see schema.sql's broker_users
// comment for why this is deliberately NOT kept in sync the way deposits/
// withdrawals are: a full backfill would be ~86 list-page requests plus one
// profile-page request PER USER (4,293 of them) for email/phone, a far
// bigger footprint than anything else this app does against Investizo.
// Instead: name/country/verification come free off the list page, seeded
// from just its first two pages (~100 most recent users); email/phone are
// fetched lazily, one request each, only when the admin opens that specific
// user in app/admin/users.
// ---------------------------------------------------------------------------

export interface UserListRow {
  id: string;
  name: string;
  country: string;
  verification: string; // 'verified' | 'unverified' | ''
  regDate: string;
  lastVisit: string;
  partner: string;
  manager: string;
}

// Each row: <tr data-key="<id>"><td><i title="Verified|Unverified">
// <img title="<Country>"><a>Name</a></td><td>RegDate</td><td>LastVisit</td>
// <td><i ...><img ...><a>Partner</a></td><td>Manager</td><td></td></tr> -
// the partner cell reuses the exact same icon+flag+link shape as the user
// cell (column 0), so the same per-column handlers cover both by tracking
// which <td> is currently open.
async function parseUsersListTable(res: Response): Promise<UserListRow[]> {
  const rows: UserListRow[] = [];
  let id = '';
  let colIndex = -1;
  let cellText = '';
  let name = '';
  let country = '';
  let verification = '';
  let regDate = '';
  let lastVisit = '';
  let partner = '';
  let manager = '';

  const rewriter = new HTMLRewriter()
    .on('table tbody tr', {
      element(el) {
        id = el.getAttribute('data-key') || '';
        colIndex = -1;
        name = '';
        country = '';
        verification = '';
        regDate = '';
        lastVisit = '';
        partner = '';
        manager = '';
        el.onEndTag(() => {
          if (id) {
            rows.push({
              id,
              name: name.trim(),
              country,
              verification,
              regDate,
              lastVisit,
              partner: partner.trim(),
              manager,
            });
          }
        });
      },
    })
    .on('table tbody tr td', {
      element(el) {
        colIndex++;
        cellText = '';
        el.onEndTag(() => {
          const text = cellText.replace(/\s+/g, ' ').trim();
          if (colIndex === 1) regDate = text;
          else if (colIndex === 2) lastVisit = text;
          else if (colIndex === 4) manager = text;
        });
      },
      text(chunk) {
        cellText += chunk.text;
      },
    })
    .on('table tbody tr td i', {
      element(el) {
        if (colIndex === 0) verification = (el.getAttribute('title') || '').toLowerCase();
      },
    })
    .on('table tbody tr td img', {
      element(el) {
        if (colIndex === 0) country = el.getAttribute('title') || '';
      },
    })
    .on('table tbody tr td a', {
      text(chunk) {
        if (colIndex === 0) name += chunk.text;
        else if (colIndex === 3) partner += chunk.text;
      },
    });

  await rewriter.transform(res).text();
  return rows;
}

async function upsertUsersList(db: D1Database, rows: UserListRow[]): Promise<number> {
  if (rows.length === 0) return 0;
  // Deliberately NOT touching email/phone/detail_fetched_at - those are
  // filled in separately by fetchAndCacheUserDetail() and must survive a
  // re-seed untouched.
  const stmt = db.prepare(
    `INSERT INTO broker_users
      (investizo_id, name, country, verification_status, reg_date, last_visit, partner, manager, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(investizo_id) DO UPDATE SET
       name=excluded.name, country=excluded.country, verification_status=excluded.verification_status,
       reg_date=excluded.reg_date, last_visit=excluded.last_visit, partner=excluded.partner,
       manager=excluded.manager, synced_at=CURRENT_TIMESTAMP`
  );
  const batch = rows.map((r) =>
    stmt.bind(r.id, r.name, r.country, r.verification, r.regDate, r.lastVisit, r.partner, r.manager)
  );
  await db.batch(batch);
  return rows.length;
}

// "02.11.2026 20:44" -> "20261102 20:44", sortable/comparable as plain text.
// Same re-slice trick as the CHRONO_KEY expressions in functions/api/admin/
// broker/data.ts and .../users/data.ts, just computed in JS here.
function chronoKey(regDate: string): string {
  const [d, t] = (regDate || '').split(' ');
  const [dd, mm, yyyy] = (d || '').split('.');
  return `${yyyy || ''}${mm || ''}${dd || ''} ${t || ''}`;
}

// Shared by syncNewUsers() and fetchAndCacheUserDetail() - the Email field
// isn't plain text, Investizo runs it through Cloudflare's email-obfuscation
// feature (<a class="__cf_email__" data-cfemail="HEX">), so the visible text
// is just a "[email protected]" placeholder; decode the hex directly rather
// than trusting parseSummaryStats for this one field. Phone is plain text,
// read the normal way. Reuses parseSummaryStats() since /users/view?id=X
// uses the exact same <tr><th>Label</th><td>Value</td></tr> shape as
// /statistics/summary.
async function fetchUserEmailPhone(
  jar: Map<string, string>,
  userId: string
): Promise<{ email: string | null; phone: string | null }> {
  const res = await authedGet(jar, `/users/view?id=${encodeURIComponent(userId)}`);
  const rawHtml = await res.text();
  const cfEmailMatch = rawHtml.match(/data-cfemail="([a-f0-9]+)"/);
  const email = cfEmailMatch ? decodeCfEmail(cfEmailMatch[1]) : null;

  const stats = await parseSummaryStats(new Response(rawHtml));
  // "Phone +212701276510 (SMS)" - strip the trailing delivery-method note.
  const phone = (stats['Phone'] || '').replace(/\s*\([^)]*\)\s*$/, '').trim() || null;

  return { email, phone };
}

// How many never-before-seen users a single "Seed users" click will fetch
// email/phone for before stopping and warning instead of continuing - a
// normal day is 1-2 new signups, so hitting this means something unusual
// happened (long gap since last sync, or a signup burst) worth a human
// look rather than quietly doing a much bigger pull than intended.
const MAX_NEW_USERS_PER_SYNC = 10;
// Defensive backstop on how many list pages to walk looking for the
// watermark, independent of the count cap above - guards against an
// infinite walk if the watermark comparison itself is ever wrong.
const MAX_USER_LIST_PAGES = 10;

// "Seed users" button: walks the Users list (newest-first) only as far as
// the most recent reg_date already in broker_users, so a normal click only
// ever touches brand-new registrations - typically just page 1. Each new
// user found also gets its email/phone fetched immediately (not lazily),
// since in steady state this is 1-2 people, not a bulk operation. See
// schema.sql's broker_users comment and MAX_NEW_USERS_PER_SYNC above for
// why this still caps out rather than ever silently doing a big pull.
export async function syncNewUsers(
  env: InvestizoEnv
): Promise<{ ok: boolean; message: string; added: number; capped: boolean }> {
  try {
    const watermarkRow = await env.DB.prepare(
      `SELECT reg_date FROM broker_users
       ORDER BY (substr(reg_date,7,4) || substr(reg_date,4,2) || substr(reg_date,1,2) || substr(reg_date,12,5)) DESC
       LIMIT 1`
    ).first();
    const watermark = watermarkRow ? chronoKey(String(watermarkRow.reg_date)) : '';

    const jar = await login(env);
    const newRows: UserListRow[] = [];
    let capped = false;

    pageLoop: for (let page = 1; page <= MAX_USER_LIST_PAGES; page++) {
      const path = page === 1 ? '/users/index' : `/users/index?page=${page}`;
      const res = await authedGet(jar, path);
      const rows = await parseUsersListTable(res);
      if (rows.length === 0) break;

      for (const row of rows) {
        if (watermark && chronoKey(row.regDate) <= watermark) {
          break pageLoop; // reached already-known territory - everything after is older
        }
        newRows.push(row);
        if (newRows.length > MAX_NEW_USERS_PER_SYNC) {
          capped = true;
          break pageLoop;
        }
      }
    }

    const kept = newRows.slice(0, MAX_NEW_USERS_PER_SYNC);
    await upsertUsersList(env.DB, kept);

    for (const row of kept) {
      const { email, phone } = await fetchUserEmailPhone(jar, row.id);
      await env.DB.prepare(
        `UPDATE broker_users SET email = ?, phone = ?, detail_fetched_at = CURRENT_TIMESTAMP WHERE investizo_id = ?`
      )
        .bind(email, phone, row.id)
        .run();
    }

    const message = capped
      ? `Found more than ${MAX_NEW_USERS_PER_SYNC} new registrations since last sync - stopped at ${MAX_NEW_USERS_PER_SYNC} to avoid a large pull. Run again to continue.`
      : kept.length === 0
      ? 'No new registrations since last sync.'
      : `Added ${kept.length} new user(s), email/phone included.`;

    return { ok: true, message, added: kept.length, capped };
  } catch (err: any) {
    return { ok: false, message: err?.message || String(err), added: 0, capped: false };
  }
}

// Lazy per-user detail fetch for email/phone - for users already in
// broker_users that syncNewUsers() didn't auto-fetch (the initial 2-page
// seed, or anyone fetched before this field existed). Only called when the
// admin opens a specific user in app/admin/users, and skips hitting
// Investizo entirely if already cached (detail_fetched_at set).
export async function fetchAndCacheUserDetail(
  env: InvestizoEnv,
  userId: string
): Promise<{ ok: boolean; email: string | null; phone: string | null; cached: boolean; message?: string }> {
  const existing = await env.DB.prepare(
    'SELECT email, phone, detail_fetched_at FROM broker_users WHERE investizo_id = ?'
  )
    .bind(userId)
    .first();

  if (existing && existing.detail_fetched_at) {
    return {
      ok: true,
      email: (existing.email as string | null) ?? null,
      phone: (existing.phone as string | null) ?? null,
      cached: true,
    };
  }

  try {
    const jar = await login(env);
    const { email, phone } = await fetchUserEmailPhone(jar, userId);

    await env.DB.prepare(
      `UPDATE broker_users SET email = ?, phone = ?, detail_fetched_at = CURRENT_TIMESTAMP WHERE investizo_id = ?`
    )
      .bind(email, phone, userId)
      .run();

    return { ok: true, email, phone, cached: false };
  } catch (err: any) {
    return { ok: false, email: null, phone: null, cached: false, message: err?.message || String(err) };
  }
}
