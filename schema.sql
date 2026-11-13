-- ==========================================================
-- MPIntellect Cloudflare D1 Database Schema
-- ==========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  email_verified INTEGER DEFAULT 0,
  license_type TEXT DEFAULT 'free',
  license_key TEXT,
  license_expires_at TEXT,
  referral_code TEXT UNIQUE,
  setup_count INTEGER DEFAULT 2,
  trial_count INTEGER DEFAULT 0,
  last_email_opened INTEGER,
  email_engagement_count INTEGER DEFAULT 0,
  last_purchase_at INTEGER,
  has_scalper_x1 INTEGER DEFAULT 0,
  has_scalper_x2 INTEGER DEFAULT 0,
  has_scalper_x3 INTEGER DEFAULT 0,
  has_matrix INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. Auth & Passwords
CREATE TABLE IF NOT EXISTS user_passwords (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Trade Setups Table
CREATE TABLE IF NOT EXISTS setups (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  entry_price REAL NOT NULL,
  take_profit REAL NOT NULL,
  stop_loss REAL NOT NULL,
  lot_size REAL DEFAULT 0.01,
  capital REAL DEFAULT 1000,
  risk_reward REAL DEFAULT 1.5,
  status TEXT DEFAULT 'pending',
  created_at TEXT NOT NULL,
  generated_at TEXT NOT NULL
);

-- 5. News & Content
CREATE TABLE IF NOT EXISTS news_articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  symbol TEXT NOT NULL,
  title TEXT NOT NULL,
  signal TEXT NOT NULL CHECK(signal IN ('BUY', 'SELL', 'HOLD', 'bullish', 'bearish', 'neutral')),
  price_at_alert REAL NOT NULL,
  content TEXT,
  excerpt TEXT,
  category TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'published',
  timestamp TEXT NOT NULL,
  generated_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS news_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  news_id TEXT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  user_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  viewed_at INTEGER NOT NULL
);

-- 6. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  source TEXT DEFAULT 'footer',
  referral_code TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'unsubscribed', 'bounced')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  unsubscribed_at INTEGER,
  unsubscribe_reason TEXT,
  reactivated_at INTEGER,
  last_email_sent INTEGER,
  email_count INTEGER DEFAULT 0
);

-- 7. Stripe & Payments
CREATE TABLE IF NOT EXISTS stripe_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE NOT NULL,
  price_id TEXT NOT NULL,
  setup_count INTEGER NOT NULL DEFAULT 0,
  amount_paid REAL NOT NULL,
  currency TEXT DEFAULT 'EUR',
  customer_email TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  license_key TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS setup_credits_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  change_amount INTEGER NOT NULL,
  new_total INTEGER NOT NULL,
  reason TEXT NOT NULL,
  stripe_session_id TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS license_activations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  license_key TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  fingerprint TEXT,
  activated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Push Notifications
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT NOT NULL UNIQUE,
  subscription_data TEXT NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  device_info TEXT,
  type TEXT DEFAULT 'trial_user',
  source TEXT,
  status TEXT DEFAULT 'active',
  created_at INTEGER,
  updated_at INTEGER
);

-- 9. Referrals System
CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'completed',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS referral_codes (
  code TEXT PRIMARY KEY,
  owner_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  is_active INTEGER DEFAULT 1,
  expires_at TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS referral_redemptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  redeemed_at TEXT NOT NULL,
  setups_added INTEGER DEFAULT 5
);

-- 10. Market Polls
CREATE TABLE IF NOT EXISTS market_polls (
  id TEXT PRIMARY KEY,
  question TEXT,
  symbol TEXT,
  category TEXT DEFAULT 'General',
  votes_low INTEGER DEFAULT 0,
  votes_medium INTEGER DEFAULT 0,
  votes_high INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS poll_votes (
  id TEXT PRIMARY KEY,
  poll_id TEXT NOT NULL REFERENCES market_polls(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT,
  vote TEXT NOT NULL CHECK (vote IN ('low', 'medium', 'high')),
  voted_at TEXT NOT NULL,
  UNIQUE(poll_id, user_id)
);

-- 11. Ads Queue (for automated chart generation)
CREATE TABLE IF NOT EXISTS ad_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL,
  style TEXT NOT NULL,
  size TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. SEO Logs
CREATE TABLE IF NOT EXISTS seo_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT,
  path TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 13. Broker (Investizo / invest-panel.com) Sync
-- Scraped via backend-lib/investizo-scraper.ts - no public API exists on
-- their side (plain Yii2 server-rendered CRM), so this mirrors what the
-- partner dashboard shows. Written by both workers/broker-sync (cron) and
-- functions/api/admin/broker/sync.ts (manual "Refresh" button), read by
-- functions/api/admin/broker/data.ts for app/admin/broker/page.tsx.
CREATE TABLE IF NOT EXISTS broker_stats_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  registrations INTEGER,
  deposits_total REAL,
  deposits_commission REAL,
  withdrawals_done REAL,
  withdrawals_pending REAL,
  affiliate_rebate REAL,
  affiliate_pending REAL,
  pamm_current REAL,
  equity REAL,
  balance REAL,
  raw_json TEXT,
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Row id is Investizo's own "#" transaction id, so re-syncs upsert in place
-- instead of duplicating.
CREATE TABLE IF NOT EXISTS broker_deposits (
  id TEXT PRIMARY KEY,
  tx_date TEXT,
  user_name TEXT,
  method TEXT,
  purse_transaction TEXT,
  account TEXT,
  account_amount REAL,
  payment_amount REAL,
  payment_currency TEXT,
  status TEXT,
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS broker_withdrawals (
  id TEXT PRIMARY KEY,
  tx_date TEXT,
  user_name TEXT,
  method TEXT,
  purse_transaction TEXT,
  account TEXT,
  account_amount REAL,
  payment_amount REAL,
  payment_currency TEXT,
  status TEXT,
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS broker_sync_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT, -- 'cron' | 'manual'
  status TEXT, -- 'success' | 'error'
  message TEXT,
  deposits_synced INTEGER DEFAULT 0,
  withdrawals_synced INTEGER DEFAULT 0,
  duration_ms INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Second broker (LiteFinance, admin.litefinance.com), separate from the
-- broker_* tables above (Investizo). Unlike Investizo, admin.litefinance.com
-- is VPN-gated with 2FA-per-new-device and only one device connected at a
-- time, so there is no Worker-based login/scrape - rows are pushed in here
-- by a Tampermonkey userscript running inside the admin's own already-
-- authenticated browser tab (see tampermonkey/litefinance-sync.user.js and
-- functions/api/admin/broker-lite/sync.ts), not pulled by us. id is
-- LiteFinance's own "#" transaction id. tx_date is "DD.MM.YYYY HH:MM" same
-- as Investizo's, so the CHRONO_KEY re-slice trick in
-- functions/api/admin/broker/data.ts applies unchanged.
CREATE TABLE IF NOT EXISTS litefinance_deposits (
  id TEXT PRIMARY KEY,
  tx_date TEXT,
  user_name TEXT,
  country TEXT,
  verification_status TEXT, -- 'verified' | 'unverified' | ''
  account TEXT,
  method TEXT,
  deposit_amount REAL,
  deposit_currency TEXT,
  pay_amount REAL,
  pay_currency TEXT,
  usd_amount REAL,
  status TEXT, -- 'Deposited' | 'Created' | 'Declined' | ...
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS litefinance_withdrawals (
  id TEXT PRIMARY KEY,
  tx_date TEXT,
  user_name TEXT,
  country TEXT,
  verification_status TEXT,
  account TEXT,
  method TEXT,
  usd_amount REAL,
  pay_amount REAL,
  pay_currency TEXT,
  total_amount REAL,
  total_currency TEXT,
  status TEXT, -- 'Done' | 'Done auto' | 'Wait' | 'Hold' | 'Unconfirmed' | 'Return' | 'Error' | ...
  auto_test TEXT, -- 'Y' | 'N'
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS litefinance_sync_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT, -- 'deposits' | 'withdrawals' | 'users'
  page INTEGER,
  rows_synced INTEGER DEFAULT 0,
  status TEXT, -- 'success' | 'error'
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- The /users/index list's "User" column shows the profile's Name if one is
-- set, and only falls back to the email when no name exists - so it's
-- ambiguous, never trust it as "the email". Both name and email are
-- captured reliably from the profile page (/users/view?id=<view_id> - a
-- DIFFERENT internal id than client_uid, captured separately) instead,
-- fetched alongside phone and the verification-status fields for every
-- newly-found user in the same sync click (not lazy/per-row like
-- Investizo's broker_users) - acceptable since the watermark walk in
-- tampermonkey/litefinance-sync.user.js only ever touches genuinely new
-- registrations since the last sync, not a full backfill.
-- `id` is NULL for rows bulk-imported from the admin's own Excel account
-- exports (/Users/mezganimez/Downloads/litefinance/accounts/data) rather
-- than scraped from a live /users/view profile - those don't have
-- LiteFinance's internal profile id, only an MT5 account number (`account`,
-- comma-joined when a client has several). SQLite allows multiple NULLs in
-- a TEXT PRIMARY KEY column (NULL != NULL for uniqueness purposes), so this
-- doesn't violate the constraint, but it does mean upserts keyed on `id`
-- (upsertUsers() in functions/api/admin/broker-lite/sync.ts) never match
-- these rows - if the live scraper later captures the same person for
-- real, it creates a second row rather than updating this one. Accepted
-- tradeoff, not yet reconciled.
CREATE TABLE IF NOT EXISTS litefinance_users (
  id TEXT PRIMARY KEY, -- the /users/view?id= value, not client_uid; NULL for Excel-imported rows
  client_uid TEXT,
  name TEXT,
  email TEXT,
  country TEXT,
  account TEXT, -- MT5 account number(s), comma-joined if several - only populated for Excel-imported rows
  reg_date TEXT,
  phone TEXT,
  email_status TEXT,
  phone_status TEXT,
  client_status TEXT,
  detail_fetched_at DATETIME,
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Second factor for the LiteFinance push, on top of the long-lived
-- LITEFINANCE_INGEST_TOKEN: functions/api/admin/broker-lite/start-session.ts
-- mints a row here only after verifying a live TOTP code against the same
-- admin_totp secret used for /admin login (not a separate secret) - so
-- even a leaked ingest token can't push data without a fresh 6-digit code
-- from the admin's own authenticator app. tampermonkey/litefinance-sync.user.js
-- asks for the code once per sync click (never cached) and sends the
-- resulting token on every page push for that run; sync.ts rejects any push
-- whose token is missing, unknown, or past expires_at.
CREATE TABLE IF NOT EXISTS litefinance_sync_sessions (
  token TEXT PRIMARY KEY,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Internal transfer ledger of LiteFinance's "LocalService" cash-agent
-- account (MT5-CLS-905151, admin.litefinance.com/accounts/view?server=20&
-- login=905151) - the single account the Morocco cash agent uses to
-- manually move balance in/out of each client's own trading account for a
-- local (cash) deposit/withdrawal. NOT the same data as
-- litefinance_deposits/withdrawals above (the brokerage-wide lists filtered
-- by "local" method) - this is that one account's own "All operations" tab,
-- scraped via tampermonkey/litefinance-sync.user.js clicking its in-page
-- "Load more" button (no URL pagination exists for it, unlike
-- /deposits/index - confirmed by probing offset/page/start params, all
-- 403). raw_type is LiteFinance's own label from the LocalService account's
-- point of view, which is the OPPOSITE of the client's:
--   raw_type='Withdrawal' (balance leaves LocalService, credited to a
--     client's own MT5 account) = the CLIENT making a local deposit
--   raw_type='Deposit' (balance arrives into LocalService from a client's
--     own MT5 account) = the CLIENT making a local withdrawal
-- The swap to the client's point of view happens at query time
-- (functions/api/admin/broker-lite/data.ts), never in storage, so raw_type
-- here always matches exactly what LiteFinance itself shows.
CREATE TABLE IF NOT EXISTS litefinance_local_ops (
  id TEXT PRIMARY KEY, -- LiteFinance's own "Deal" id
  tx_date TEXT, -- "DD.MM.YYYY HH:MM:SS"
  raw_type TEXT, -- 'Deposit' | 'Withdrawal' - LocalService account's own label, see above
  counterparty_account TEXT, -- e.g. "MT5-ECN-7392273" - the client account on the other side of the transfer
  op_ref TEXT, -- e.g. "WDRW-AR-6221015" / "DPST-IT-6218054"
  amount REAL, -- absolute USD amount
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Call center log, scraped from admin.litefinance.com/calls/index
-- ("Commpeak Calls" - Commpeak is the VoIP/call-center platform LiteFinance
-- uses). Scoped to agent_code IN ('2033','2034') only - the two managers
-- actually tracked here, per explicit admin request; everything else (IVR/
-- system calls, other agents) is filtered out in the userscript and never
-- reaches this table. Full history, not bounded to "this month" like every
-- other litefinance_* sync - also per explicit request.
-- Unlike every other table above, call_start here is already
-- "YYYY-MM-DD HH:MM:SS" (LiteFinance's own format on this page, not the
-- "DD.MM.YYYY" used everywhere else), so it sorts/compares correctly as
-- plain text with no re-slice trick needed. user_id is the SAME id
-- litefinance_users.id uses (/users/view?id=) - captured directly from the
-- Destination cell's email link when the admin panel can resolve the
-- caller to a known client, giving a real foreign key between a call and a
-- client (unlike deposits/withdrawals, which only ever captured a free-text
-- user_name). client_email is the raw text of that same cell (null when
-- LiteFinance shows "Unknown user" instead of an email) - kept as its own
-- column, separate from user_id, so data.ts can ALSO resolve a call to a
-- client by matching client_email against litefinance_users.email when
-- user_id itself is null (LiteFinance didn't resolve the caller) but the
-- email text still matches a known client - see data.ts's calls_resolved
-- CTE. There is no "successful" column on this table - the admin panel's
-- own Successful filter was found live to not actually filter results (and
-- one filter combination 500'd), so "successful" is treated purely as
-- hangup_cause = 'ANSWERED' at query time, never stored as its own flag.
CREATE TABLE IF NOT EXISTS litefinance_calls (
  id TEXT PRIMARY KEY, -- LiteFinance's own call id
  agent_code TEXT, -- "2033" | "2034"
  agent_name TEXT, -- e.g. "Karima Hamouch"
  destination TEXT, -- client's phone number dialed
  client_email TEXT, -- raw email text from the Destination cell, null if LiteFinance shows "Unknown user"
  user_id TEXT, -- litefinance_users.id, when the call resolved to a known client
  call_start TEXT, -- "YYYY-MM-DD HH:MM:SS"
  duration_sec INTEGER,
  hangup_cause TEXT, -- 'ANSWERED' | 'ORIGINATOR_CANCEL' | 'NORMAL_CIRCUIT_CONGESTION' | 'NORMAL_TEMPORARY_FAILURE' | ...
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Referred clients of the LocalService affiliate account (nouhaila laarj,
-- admin.litefinance.com/affiliate/referrals?id=3827279 - her LiteFinance
-- user profile's own "Username" field is literally "LocalService"), scraped
-- from that page's "Referrals network" tab. One row per client, aggregated
-- across all of that client's MT4/MT5 sub-accounts for whatever date range
-- was selected on the page at sync time - this is a refreshed snapshot
-- (upserted by id), not an append-only history. id is litefinance_users.id
-- (from the referral name's /users/view?id= link) - the SAME FK space as
-- litefinance_calls.user_id. uid is the separate "UID" column shown on that
-- page (a different number from id). active comes directly from the page's
-- own "active"/"inactive" row CSS class (confirmed live - not a color
-- guess), not derived from any of the numeric columns.
CREATE TABLE IF NOT EXISTS litefinance_local_service_clients (
  id TEXT PRIMARY KEY,
  uid TEXT,
  name TEXT,
  reg_date TEXT, -- "DD.MM.YYYY"
  active INTEGER, -- 1 = active (green), 0 = inactive (red)
  total_dpst REAL,
  total_wdrw REAL,
  total_commission REAL,
  total_trades INTEGER,
  total_volume REAL,
  total_profit REAL,
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Pre-aggregated rows scraped from admin.litefinance.com/chat/statistics-
-- support (the live-chat support widget's own stats page - a different
-- channel from litefinance_calls, which only covers Commpeak phone calls).
-- That page already groups/aggregates server-side (by manager, by country,
-- or a plain combined total), so each row here is one of THOSE pre-computed
-- numbers, not a raw chat session - tampermonkey/litefinance-sync.user.js
-- requests a handful of fixed (date range, grouping, country filter,
-- manager filter) combinations per month rather than re-deriving this
-- breakdown from raw data ourselves.
--   bucket_type: 'manager' (one row per manager for that request) | 'country'
--     (one row per country) | 'summary' (the page's own single combined
--     "SUMMARY" row for that request - bucket_key is always 'TOTAL').
--   bucket_key: the exact Name-column text for that row (a manager's display
--     name, a country name, or 'TOTAL').
--   country_filter / manager_filter: the filter actually applied to the
--     request that produced this row ('' when that filter wasn't used) -
--     'MA' + manager_filter='' means "every manager who touched Morocco
--     chats"; manager_filter='10447,10529' + country_filter='' means "the
--     two tracked support-team managers, every country". Together with
--     bucket_type/bucket_key/date_from/date_to this is the row's natural key
--     (see sync.ts's upsertChatSupportStats), so re-syncing the same month
--     just refreshes the same rows instead of duplicating them.
CREATE TABLE IF NOT EXISTS litefinance_chat_support_stats (
  id TEXT PRIMARY KEY,
  bucket_type TEXT NOT NULL,
  bucket_key TEXT NOT NULL,
  date_from TEXT NOT NULL, -- "YYYY-MM-DD HH:MM:SS", already chronologically sortable
  date_to TEXT NOT NULL,
  country_filter TEXT NOT NULL DEFAULT '',
  manager_filter TEXT NOT NULL DEFAULT '',
  sessions INTEGER,
  users INTEGER,
  rating REAL,
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_litefinance_chat_support_stats_lookup
  ON litefinance_chat_support_stats(bucket_type, country_filter, manager_filter, date_from);

-- Pre-2026-11 monthly deposit/withdrawal totals, hand-entered by the admin
-- from LiteFinance's own historical reporting (March 2022 - October 2026) -
-- litefinance_deposits/litefinance_withdrawals only ever hold the CURRENT
-- month (the Tampermonkey sync re-scrapes "this month" each time, nothing
-- older), so there was no way to show a full multi-year trend without this.
-- One-time seed, not touched by any sync - data.ts's monthly stats merge
-- this table for any month it covers with the live-computed totals above
-- for whatever month(s) aren't in here (in practice: this table stops where
-- the live sync's coverage begins, no overlap to reconcile).
CREATE TABLE IF NOT EXISTS litefinance_monthly_stats_history (
  month TEXT PRIMARY KEY, -- "YYYY-MM"
  deposits REAL NOT NULL,
  withdrawals REAL NOT NULL
);

-- Manually-entered outflows from the local (Morocco) cash balance - office
-- expenses, transfers, marketing spend, etc. - that never show up in
-- Investizo's own deposit/withdrawal lists. Subtracted from the local
-- balance shown on app/admin/broker/page.tsx and exported to the Google
-- Sheet ledger alongside deposits/withdrawals (functions/api/admin/broker/
-- export-sheet.ts). expense_date is admin-entered ISO text ("YYYY-MM-DD
-- HH:MM"), not scraped, so it sorts correctly as plain text unlike
-- Investizo's own "DD.MM.YYYY" format.
CREATE TABLE IF NOT EXISTS broker_local_expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expense_date TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  amount_mad REAL,
  amount_usd REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Investizo's Users list (invest-panel.com/users/index), deliberately
-- NOT kept in sync the way broker_deposits/broker_withdrawals are - a full
-- backfill would be ~86 list-page requests plus one profile-page request
-- PER USER (4,293 of them) for email/phone, a far bigger footprint than
-- anything else this app does against Investizo. Instead:
--   - name/country/verification_status/reg_date/last_visit/partner/manager
--     come for free off the list page (see backend-lib/investizo-scraper.ts),
--     seeded once from just its first two pages (~100 most recent users,
--     2 requests), not the full history.
--   - email/phone are fetched lazily, one request each, only when the admin
--     actually opens that specific user in app/admin/users - cached here
--     permanently afterward, never re-fetched. detail_fetched_at is null
--     until that happens.
CREATE TABLE IF NOT EXISTS broker_users (
  investizo_id TEXT PRIMARY KEY,
  name TEXT,
  country TEXT,
  verification_status TEXT, -- 'verified' | 'unverified'
  reg_date TEXT,
  last_visit TEXT,
  partner TEXT,
  manager TEXT,
  email TEXT,
  phone TEXT,
  detail_fetched_at DATETIME,
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Single shared TOTP (Google Authenticator-compatible, RFC 6238) secret for
-- the /admin password gate (app/admin/AdminGate.tsx,
-- functions/api/admin/validate.ts) - one shared admin account, matching
-- ADMIN_PASSWORD's own single-secret model, not a multi-user system. id is
-- pinned to 1 so there is ever only one row. enabled=0 means setup has
-- started (secret generated, QR shown) but not yet confirmed with a code;
-- validate.ts flips it to 1 on the first successful code.
-- failed_attempts/locked_until throttle code brute-forcing: once someone
-- already has the password, a 6-digit TOTP code is the only thing left
-- guarding /admin, so repeated wrong codes lock further attempts out for a
-- cooldown window rather than allowing unlimited guesses.
CREATE TABLE IF NOT EXISTS admin_totp (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  secret TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Logs every successful /admin login (password + TOTP both verified) so the
-- admin can see which devices/IPs have accessed the panel and when, with a
-- manual "Disconnect" action (app/admin/security/page.tsx,
-- functions/api/admin/sessions.ts). This is visibility plus a soft kick for
-- the /admin UI (AdminGateProvider checks its own session on each page
-- load/heartbeat and logs out if revoked) - it does NOT gate the
-- underlying API endpoints (broker, telegram, etc.), which still trust
-- ADMIN_PASSWORD as a bearer token the way they always have, so revoking a
-- session here is not a hard security boundary by itself.
CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  ip TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  revoked INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_last_seen ON admin_sessions(last_seen_at);

-- ==========================================================
-- Performance Indexes
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_license_key ON users(license_key);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_setups_user_id ON setups(user_id);
CREATE INDEX IF NOT EXISTS idx_setups_symbol ON setups(symbol);
CREATE INDEX IF NOT EXISTS idx_setups_status ON setups(status);

CREATE INDEX IF NOT EXISTS idx_news_slug ON news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_news_symbol ON news_articles(symbol);
CREATE INDEX IF NOT EXISTS idx_push_endpoint ON push_subscriptions(endpoint);
CREATE INDEX IF NOT EXISTS idx_push_user_id ON push_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_stripe_user_id ON stripe_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_session_id ON stripe_purchases(stripe_session_id);

CREATE INDEX IF NOT EXISTS idx_broker_deposits_date ON broker_deposits(tx_date);
CREATE INDEX IF NOT EXISTS idx_broker_withdrawals_date ON broker_withdrawals(tx_date);
CREATE INDEX IF NOT EXISTS idx_broker_sync_log_created ON broker_sync_log(created_at);
CREATE INDEX IF NOT EXISTS idx_litefinance_deposits_date ON litefinance_deposits(tx_date);
CREATE INDEX IF NOT EXISTS idx_litefinance_withdrawals_date ON litefinance_withdrawals(tx_date);
CREATE INDEX IF NOT EXISTS idx_litefinance_sync_log_created ON litefinance_sync_log(created_at);
CREATE INDEX IF NOT EXISTS idx_litefinance_sync_sessions_expires ON litefinance_sync_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_litefinance_users_reg_date ON litefinance_users(reg_date);
-- The one above indexes the raw "DD.MM.YYYY HH:MM" column, but data.ts's
-- USER_CHRONO_KEY sorts by a re-sliced "YYYYMMDD HH:MM" expression (so it
-- sorts correctly as text) - a plain-column index can't serve an
-- expression-based ORDER BY, so that first index was never actually usable
-- for the main Users-list query. Live-verified on production: adding this
-- expression index cut that query's D1 rows_read from ~21,000 to ~13,000
-- (and proportionally further once the result is actually smaller than the
-- full table, e.g. ~6,600 at LIMIT 2000) - found while investigating an
-- unexpectedly high daily D1 rows-read count.
CREATE INDEX IF NOT EXISTS idx_litefinance_users_chrono ON litefinance_users ((substr(reg_date,7,4) || substr(reg_date,4,2) || substr(reg_date,1,2) || substr(reg_date,12,5)));
CREATE INDEX IF NOT EXISTS idx_litefinance_local_ops_date ON litefinance_local_ops(tx_date);
CREATE INDEX IF NOT EXISTS idx_litefinance_calls_date ON litefinance_calls(call_start);
CREATE INDEX IF NOT EXISTS idx_litefinance_calls_agent ON litefinance_calls(agent_code);
CREATE INDEX IF NOT EXISTS idx_litefinance_calls_user_id ON litefinance_calls(user_id);
CREATE INDEX IF NOT EXISTS idx_broker_local_expenses_date ON broker_local_expenses(expense_date);

-- ----------------------------------------------------------------------------
-- Accountant (accountant.mpintellect.com) - company invoicing for services/
-- payments to clients & partners, plus a general expense ledger and a
-- revenue/P&L overview derived from the two. Entirely separate from the
-- broker_local_expenses table above, which is specifically the Morocco cash
-- balance's own outflows, not general company accounting. Same admin-gate
-- convention as the rest of /api/admin/* (Bearer <ADMIN_PASSWORD|ADMIN_KEY>).
-- ----------------------------------------------------------------------------

-- Free-form company profile used to prefill invoice headers/payment
-- instructions (name, address, tax/ICE id, bank name/account/IBAN/SWIFT) and
-- to track the next invoice number to auto-assign - a plain key/value store
-- since these fields are few, rarely change, and don't need their own typed
-- columns. Edited from app/accountant/settings/page.tsx.
CREATE TABLE IF NOT EXISTS accountant_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS accountant_clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, -- company or person name, shown on the invoice as "Bill To"
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  tax_id TEXT, -- ICE/tax number, if the client has one
  country TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- One row per invoice; subtotal/tax/total are computed from
-- accountant_invoice_items at read time (data.ts), not stored here, so
-- editing a line item can never leave a stale total behind.
CREATE TABLE IF NOT EXISTS accountant_invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number TEXT UNIQUE NOT NULL, -- e.g. "INV-2026-0001", assigned from accountant_settings' counter
  client_id INTEGER NOT NULL REFERENCES accountant_clients(id),
  issue_date TEXT NOT NULL, -- "YYYY-MM-DD"
  due_date TEXT,
  currency TEXT NOT NULL DEFAULT 'USD', -- 'USD' | 'MAD'
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  tax_rate REAL NOT NULL DEFAULT 0, -- percentage, e.g. 20 for 20% TVA - 0 when not applicable
  notes TEXT,
  payment_instructions TEXT, -- bank details shown on the invoice, prefilled from accountant_settings but editable per invoice
  paid_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accountant_invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER NOT NULL REFERENCES accountant_invoices(id),
  description TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS accountant_expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expense_date TEXT NOT NULL, -- "YYYY-MM-DD"
  description TEXT NOT NULL,
  category TEXT,
  vendor TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  amount REAL NOT NULL, -- always a positive magnitude, `type` carries the sign/meaning
  type TEXT NOT NULL DEFAULT 'expense', -- 'expense' | 'revenue' | 'bank_fee' - lets one ledger hold a full bank-statement import (client payments, spend, bank fees), not just manual outflows
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_accountant_invoices_issue_date ON accountant_invoices(issue_date);
CREATE INDEX IF NOT EXISTS idx_accountant_invoices_client ON accountant_invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_accountant_invoice_items_invoice ON accountant_invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_accountant_expenses_date ON accountant_expenses(expense_date);