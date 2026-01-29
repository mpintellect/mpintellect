-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscription_status TEXT DEFAULT 'free',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- News Archive Table
CREATE TABLE IF NOT EXISTS news_archive (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Push Subscriptions Table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Market Questions (AI)
CREATE TABLE IF NOT EXISTS market_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  question TEXT NOT NULL,
  answer TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Push Subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT NOT NULL UNIQUE,
  subscription_data TEXT NOT NULL,
  user_id TEXT,
  email TEXT,
  display_name TEXT,
  device_info TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  created_at INTEGER,
  updated_at INTEGER
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_push_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_email ON push_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_push_status ON push_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_push_endpoint ON push_subscriptions(endpoint);
-- Link clicks tracking table
CREATE TABLE IF NOT EXISTS link_clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  url TEXT NOT NULL,
  campaign_id TEXT,
  user_id TEXT,
  clicked_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  
  INDEX idx_link_clicks_email (email),
  INDEX idx_link_clicks_url (url),
  INDEX idx_link_clicks_campaign (campaign_id),
  INDEX idx_link_clicks_timestamp (clicked_at)
);
-- Email tracking table
CREATE TABLE IF NOT EXISTS email_opens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'daily_signal',
  campaign_id TEXT,
  user_id TEXT,
  user_agent TEXT,
  opened_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  
  -- Indexes for faster queries
  INDEX idx_email_opens_email (email),
  INDEX idx_email_opens_type (type),
  INDEX idx_email_opens_campaign (campaign_id),
  INDEX idx_email_opens_user (user_id),
  INDEX idx_email_opens_timestamp (opened_at)
);

-- Add email engagement fields to users table (if not exists)
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_email_opened INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_engagement_count INTEGER DEFAULT 0;
-- News articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT,
  category TEXT,
  tags TEXT, -- JSON array or comma-separated
  image_url TEXT,
  timestamp INTEGER,
  source_url TEXT,
  status TEXT DEFAULT 'published' CHECK(status IN ('draft', 'published', 'archived')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id TEXT,
  author_name TEXT,
  category TEXT,
  tags TEXT, -- JSON array
  featured_image TEXT,
  reading_time INTEGER, -- in minutes
  meta_description TEXT,
  meta_keywords TEXT,
  published_at INTEGER,
  updated_at INTEGER,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
  view_count INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_timestamp ON news_articles(timestamp);
CREATE INDEX IF NOT EXISTS idx_news_status ON news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news_articles(slug);

CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category);
-- Push notifications log table
CREATE TABLE IF NOT EXISTS push_notifications_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subscription_id INTEGER,
  user_id TEXT,
  email TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  url TEXT,
  type TEXT DEFAULT 'trade_signal',
  sent_at INTEGER NOT NULL,
  status TEXT DEFAULT 'sent' CHECK(status IN ('sent', 'failed', 'pending')),
  error TEXT,
  created_at INTEGER NOT NULL,
  
  -- Foreign key reference
  FOREIGN KEY (subscription_id) REFERENCES push_subscriptions(id) ON DELETE SET NULL,
  
  -- Indexes for analytics
  INDEX idx_push_log_status (status),
  INDEX idx_push_log_sent_at (sent_at),
  INDEX idx_push_log_user (user_id),
  INDEX idx_push_log_type (type)
);

-- Update push_subscriptions table (if not already exists)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT NOT NULL UNIQUE,
  subscription_data TEXT NOT NULL,
  user_id TEXT,
  email TEXT,
  display_name TEXT,
  device_info TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'unsubscribed')),
  type TEXT CHECK(type IN ('anonymous_lead', 'trial_user', 'registered_client')),
  source TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  INDEX idx_push_user_id (user_id),
  INDEX idx_push_status (status),
  INDEX idx_push_type (type),
  INDEX idx_push_endpoint (endpoint)
);
-- Newsletter subscribers table
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
  email_count INTEGER DEFAULT 0,
  
  -- Indexes for fast queries
  INDEX idx_newsletter_email (email),
  INDEX idx_newsletter_status (status),
  INDEX idx_newsletter_created_at (created_at),
  INDEX idx_newsletter_source (source)
);

-- Newsletter campaigns table (optional for tracking emails sent)
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  template TEXT,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_for INTEGER,
  sent_at INTEGER,
  total_recipients INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounce_count INTEGER DEFAULT 0,
  unsubscribe_count INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  INDEX idx_campaigns_status (status),
  INDEX idx_campaigns_scheduled (scheduled_for),
  INDEX idx_campaigns_sent (sent_at)
);
-- Stripe purchases table (one-time purchases only)
CREATE TABLE IF NOT EXISTS stripe_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  price_id TEXT NOT NULL,
  setup_count INTEGER NOT NULL,
  amount_paid REAL NOT NULL,
  currency TEXT DEFAULT 'EUR',
  customer_email TEXT NOT NULL,
  status TEXT DEFAULT 'completed' CHECK(status IN ('completed', 'refunded', 'failed')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  -- Indexes for fast queries
  INDEX idx_stripe_purchases_user (user_id),
  INDEX idx_stripe_purchases_session (stripe_session_id),
  INDEX idx_stripe_purchases_created (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Setup credits history (audit trail)
CREATE TABLE IF NOT EXISTS setup_credits_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  change_amount INTEGER NOT NULL,
  new_total INTEGER NOT NULL,
  reason TEXT NOT NULL,
  stripe_session_id TEXT,
  notes TEXT,
  created_at INTEGER NOT NULL,
  
  INDEX idx_credits_history_user (user_id),
  INDEX idx_credits_history_reason (reason),
  INDEX idx_credits_history_created (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Stripe webhook errors log (simple error tracking)
CREATE TABLE IF NOT EXISTS stripe_webhook_errors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  stripe_session_id TEXT,
  user_id TEXT,
  error_message TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  
  INDEX idx_webhook_errors_created (created_at)
);

-- Ensure users table has setup_count column
ALTER TABLE users ADD COLUMN IF NOT EXISTS setup_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_purchase_at INTEGER;
-- News articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  symbol TEXT NOT NULL,
  title TEXT NOT NULL,
  signal TEXT NOT NULL CHECK(signal IN ('BUY', 'SELL', 'HOLD')),
  price_at_alert REAL NOT NULL,
  timestamp TEXT NOT NULL,
  generated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  -- Indexes for fast queries
  INDEX idx_news_symbol (symbol),
  INDEX idx_news_signal (signal),
  INDEX idx_news_created (created_at),
  INDEX idx_news_slug (slug)
);

-- SEO logs table for indexing tracking
CREATE TABLE IF NOT EXISTS seo_logs (
  symbol TEXT PRIMARY KEY,
  lastIndexedAt INTEGER,
  decision TEXT,
  trend TEXT,
  price REAL,
  lastTrigger TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  INDEX idx_seo_symbol (symbol),
  INDEX idx_seo_last_indexed (lastIndexedAt)
);

-- News views tracking
CREATE TABLE IF NOT EXISTS news_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  news_id TEXT NOT NULL,
  user_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  viewed_at INTEGER NOT NULL,
  
  INDEX idx_views_news (news_id),
  INDEX idx_views_user (user_id),
  INDEX idx_views_timestamp (viewed_at),
  FOREIGN KEY (news_id) REFERENCES news_articles(id) ON DELETE CASCADE
);
-- AI Chat Analytics table
CREATE TABLE IF NOT EXISTS ai_chat_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  chat_data TEXT NOT NULL, -- JSON string of chat data
  license_key TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  -- Indexes
  INDEX idx_ai_analytics_user (user_id),
  INDEX idx_ai_analytics_created (created_at),
  INDEX idx_ai_analytics_license (license_key)
);

-- AI Usage Tracking table
CREATE TABLE IF NOT EXISTS ai_usage_tracking (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL, -- e.g., 'setup_generated', 'analysis_viewed', 'signal_saved'
  metadata TEXT, -- JSON string of additional data
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  -- Indexes
  INDEX idx_usage_user (user_id),
  INDEX idx_usage_action (action),
  INDEX idx_usage_created (created_at)
);