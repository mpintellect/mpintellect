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