-- 1. Users Table (Consolidated with all fields)

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  email_verified INTEGER DEFAULT 0,
  license_type TEXT DEFAULT 'free',
  referral_code TEXT UNIQUE,
  setup_count INTEGER DEFAULT 2,
  trial_count INTEGER DEFAULT 0,
  last_email_opened INTEGER,
  email_engagement_count INTEGER DEFAULT 0,
  last_purchase_at INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
, license_key TEXT, license_expires_at TEXT, has_scalper_x1 INTEGER DEFAULT 0)

-- 2. Auth & Sessions
CREATE TABLE IF NOT EXISTS user_passwords (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT
);

-- 3. Setups Table
CREATE TABLE IF NOT EXISTS setups (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  entry_price REAL NOT NULL,
  take_profit REAL NOT NULL,
  stop_loss REAL NOT NULL,
  lot_size REAL DEFAULT 0.01,
  capital REAL DEFAULT 1000,
  risk_reward REAL DEFAULT 1.5,
  status TEXT DEFAULT 'pending',
  created_at TEXT NOT NULL,
  generated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. News & Content
CREATE TABLE IF NOT EXISTS news_articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  symbol TEXT NOT NULL,
  title TEXT NOT NULL,
  signal TEXT NOT NULL CHECK(signal IN ('BUY', 'SELL', 'HOLD')),
  price_at_alert REAL NOT NULL,
  content TEXT,
  excerpt TEXT,
  category TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'published',
  timestamp TEXT NOT NULL,
  generated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS news_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  news_id TEXT NOT NULL,
  user_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  viewed_at INTEGER NOT NULL,
  FOREIGN KEY (news_id) REFERENCES news_articles(id) ON DELETE CASCADE
);

-- 5. Newsletter
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

-- 6. Stripe & Payments
CREATE TABLE stripe_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  price_id TEXT NOT NULL,
  setup_count INTEGER NOT NULL,
  amount_paid REAL NOT NULL,
  currency TEXT DEFAULT 'EUR',
  customer_email TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  created_at TEXT NOT NULL,  -- Changed to TEXT
  updated_at TEXT NOT NULL,
  license_key TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS setup_credits_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  change_amount INTEGER NOT NULL,
  new_total INTEGER NOT NULL,
  reason TEXT NOT NULL,
  stripe_session_id TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Push Notifications
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT NOT NULL UNIQUE,
  subscription_data TEXT NOT NULL,
  user_id TEXT,
  email TEXT,
  display_name TEXT,
  device_info TEXT,
  status TEXT DEFAULT 'active',
  created_at INTEGER,
  updated_at INTEGER
);

-- 8. Referrals
-- 8. REFERRALS - CORRECTED VERSION


-- Create referral_codes table (simplified - we store code directly in users table)
-- Actually, we don't need this separate table since referral_code is already in users

-- Create referrals table (tracks who referred whom)
CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrer_id TEXT NOT NULL,
  referred_id TEXT NOT NULL UNIQUE, -- One user can only be referred once
  status TEXT DEFAULT 'completed',
  created_at TEXT NOT NULL,
  FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (referred_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create referral_redemptions table (for manual code redemption)
CREATE TABLE IF NOT EXISTS referral_redemptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  referral_code TEXT NOT NULL,
  redeemed_at TEXT NOT NULL,
  setups_added INTEGER DEFAULT 5,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_user_id ON referral_redemptions(user_id);

-- 9. Logs & Analytics
CREATE TABLE IF NOT EXISTS seo_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT,
  path TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Indexes (Optimized for SQLite)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_setups_user ON setups(user_id);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_push_endpoint ON push_subscriptions(endpoint);
-- 11. Market Polls (Unified System)
CREATE TABLE market_polls (id TEXT PRIMARY KEY, question TEXT, symbol TEXT, category TEXT, votes_low INTEGER DEFAULT 0, votes_medium INTEGER DEFAULT 0, votes_high INTEGER DEFAULT 0, total_votes INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT)

CREATE TABLE IF NOT EXISTS poll_votes (
  id TEXT PRIMARY KEY,
  poll_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT,
  vote TEXT NOT NULL CHECK (vote IN ('low', 'medium', 'high')),
  voted_at TEXT NOT NULL,
  UNIQUE(poll_id, user_id),
  FOREIGN KEY (poll_id) REFERENCES market_polls(id) ON DELETE CASCADE
);

-- 12. Poll Indexes
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user_id ON poll_votes(user_id);
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  license_type TEXT DEFAULT 'basic',
  license_key TEXT UNIQUE,
  license_expires_at DATETIME,
  setup_count INTEGER DEFAULT 10,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stripe_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  price_id TEXT NOT NULL,
  setup_count INTEGER DEFAULT 0,
  amount_paid DECIMAL(10,2) NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  license_key TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS license_activations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  license_key TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  fingerprint TEXT,
  activated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (license_key) REFERENCES users(license_key)
);
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  email_verified INTEGER DEFAULT 0,
  license_type TEXT DEFAULT 'free', -- Ensure this is here
  license_key TEXT,                 -- Ensure this is here
  license_expires_at TEXT,          -- Ensure this is here
  referral_code TEXT UNIQUE,
  setup_count INTEGER DEFAULT 2,
  trial_count INTEGER DEFAULT 0,
  last_email_opened INTEGER,
  email_engagement_count INTEGER DEFAULT 0,
  last_purchase_at INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
-- Create push_subscriptions table in Cloudflare D1
CREATE TABLE push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT NOT NULL UNIQUE,
  subscription_data TEXT NOT NULL,
  user_id TEXT,
  email TEXT,
  display_name TEXT,
  device_info TEXT,
  status TEXT DEFAULT 'active',
  created_at INTEGER,
  updated_at INTEGER
)

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_status ON push_subscriptions(status);