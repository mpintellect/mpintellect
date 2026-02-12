PRAGMA defer_foreign_keys=TRUE;
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
, license_key TEXT, license_expires_at TEXT);
INSERT INTO "users" VALUES('09df35e3-f938-4a98-815b-c6e480d5d8dd','abdrahman.mez734544@gmail.com','abdrahman.mez734544',NULL,0,'free',NULL,1000,0,NULL,0,NULL,'2026-02-02 23:09:27.475','2026-02-02 23:09:27.475',NULL,NULL);
INSERT INTO "users" VALUES('8fc9fefd-3122-4c28-af2e-104f4c74bdc0','abdrahman.mez7@gmail.com','abdrahman.mez7',NULL,0,'free',NULL,1000,0,NULL,0,NULL,'2026-02-02 23:09:56.464','2026-02-02T23:10:10.982Z',NULL,NULL);
INSERT INTO "users" VALUES('3ef52a60-2ae3-4405-9152-447b8171e934','abdrahman.mez733@gmail.com','abdrahman.mez733',NULL,0,'free',NULL,36,0,NULL,0,NULL,'2026-02-02 23:11:23.091','2026-02-03T15:41:11.616Z',NULL,NULL);
INSERT INTO "users" VALUES('796b19ab-9761-4b3b-b9e1-7a05147fd520','abdrahman.mez75@gmail.com','abdrahman.mez75',NULL,0,'free',NULL,0,0,NULL,0,NULL,'2026-02-03 00:23:43.248','2026-02-03T00:24:12.256Z',NULL,NULL);
INSERT INTO "users" VALUES('e7b47d31-d5bc-4e3b-8dad-86584113a661','abdrahman.mez756@gmail.com','abdrahman.mez756',NULL,0,'free',NULL,2,0,NULL,0,NULL,'2026-02-03 01:14:04.521','2026-02-03 01:14:04.521',NULL,NULL);
INSERT INTO "users" VALUES('cf130405-9ce9-432d-878a-c6714d3e5f84','abdrahman.mez7565@gmail.com','abdrahman.mez7565',NULL,0,'free',NULL,0,0,NULL,0,NULL,'2026-02-03 01:14:15.024','2026-02-03T01:14:41.757Z',NULL,NULL);
INSERT INTO "users" VALUES('58a526c2-2c9e-4939-8585-52fa921c1005','abdrahman.mez7333@gmail.com','abdrahman.mez7333',NULL,0,'free',NULL,2,0,NULL,0,NULL,'2026-02-09 11:25:52.885','2026-02-09 11:25:52.885',NULL,NULL);
INSERT INTO "users" VALUES('83b7290b-b3de-47a2-aba3-124b12a641b9','abdrahman.mez73335@gmail.com','abdrahman.mez73335',NULL,0,'free',NULL,0,0,NULL,0,NULL,'2026-02-09 11:26:11.385','2026-02-09T11:30:16.413Z',NULL,NULL);
INSERT INTO "users" VALUES('145b99a2-627a-488c-877d-76d7cc4224e6','abdrahman.mez7333555@gmail.com','abdrahman.mez7333555',NULL,0,'free',NULL,0,0,NULL,0,NULL,'2026-02-12 15:12:25.834','2026-02-12T15:13:23.008Z',NULL,NULL);
CREATE TABLE user_passwords (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "user_passwords" VALUES('09df35e3-f938-4a98-815b-c6e480d5d8dd','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','2026-02-02 23:09:28');
INSERT INTO "user_passwords" VALUES('8fc9fefd-3122-4c28-af2e-104f4c74bdc0','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','2026-02-02 23:09:56');
INSERT INTO "user_passwords" VALUES('3ef52a60-2ae3-4405-9152-447b8171e934','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','2026-02-02 23:11:23');
INSERT INTO "user_passwords" VALUES('796b19ab-9761-4b3b-b9e1-7a05147fd520','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','2026-02-03 00:23:43');
INSERT INTO "user_passwords" VALUES('e7b47d31-d5bc-4e3b-8dad-86584113a661','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','2026-02-03 01:14:05');
INSERT INTO "user_passwords" VALUES('cf130405-9ce9-432d-878a-c6714d3e5f84','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','2026-02-03 01:14:15');
INSERT INTO "user_passwords" VALUES('58a526c2-2c9e-4939-8585-52fa921c1005','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','2026-02-09 11:25:53');
INSERT INTO "user_passwords" VALUES('83b7290b-b3de-47a2-aba3-124b12a641b9','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','2026-02-09 11:26:11');
INSERT INTO "user_passwords" VALUES('145b99a2-627a-488c-877d-76d7cc4224e6','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','2026-02-12 15:12:26');
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT
);
INSERT INTO "sessions" VALUES('bd530176-6254-4810-9afb-68237080048a','09df35e3-f938-4a98-815b-c6e480d5d8dd','2026-03-04 23:09:27.475');
INSERT INTO "sessions" VALUES('ace7d498-62f0-4f7b-9246-09f805465c10','8fc9fefd-3122-4c28-af2e-104f4c74bdc0','2026-03-04 23:09:56.464');
INSERT INTO "sessions" VALUES('125ca5f7-d27e-4149-baaf-4a63aa5b286d','3ef52a60-2ae3-4405-9152-447b8171e934','2026-03-04 23:11:23.091');
INSERT INTO "sessions" VALUES('19cded3d-5705-4fe6-b7ce-0360c1bf617a','3ef52a60-2ae3-4405-9152-447b8171e934','2026-03-04T23:56:46.619Z');
INSERT INTO "sessions" VALUES('2a5f5f73-ad3a-40c7-a33c-da8de3132c77','3ef52a60-2ae3-4405-9152-447b8171e934','2026-03-05T00:19:38.633Z');
INSERT INTO "sessions" VALUES('251b63ee-a0b1-46be-99b2-bafe64b17a2f','8fc9fefd-3122-4c28-af2e-104f4c74bdc0','2026-03-05T00:23:26.853Z');
INSERT INTO "sessions" VALUES('33882574-63d2-4a19-8711-89da46435f4c','796b19ab-9761-4b3b-b9e1-7a05147fd520','2026-03-05 00:23:43.248');
INSERT INTO "sessions" VALUES('9bbd76e4-fbd4-4b0f-abce-522c3589ff95','796b19ab-9761-4b3b-b9e1-7a05147fd520','2026-03-05T00:24:04.637Z');
INSERT INTO "sessions" VALUES('a02b8fc9-1966-4882-9a49-0a69687a7ac0','e7b47d31-d5bc-4e3b-8dad-86584113a661','2026-03-05 01:14:04.521');
INSERT INTO "sessions" VALUES('d8391f24-adb8-4a9a-a0e3-f57169af6c8f','cf130405-9ce9-432d-878a-c6714d3e5f84','2026-03-05 01:14:15.024');
INSERT INTO "sessions" VALUES('c149a30f-b1ef-4f99-a847-94a3ba75b95d','3ef52a60-2ae3-4405-9152-447b8171e934','2026-03-05T13:06:25.313Z');
INSERT INTO "sessions" VALUES('92c4570e-48bd-4719-a0be-f9fb57b72778','3ef52a60-2ae3-4405-9152-447b8171e934','2026-03-05T13:32:00.515Z');
INSERT INTO "sessions" VALUES('c47014e0-bb0b-4e0e-97be-304ac6dc1f56','58a526c2-2c9e-4939-8585-52fa921c1005','2026-03-11 11:25:52.885');
INSERT INTO "sessions" VALUES('ddee2c60-42cb-4783-b082-0d649cae8913','83b7290b-b3de-47a2-aba3-124b12a641b9','2026-03-11 11:26:11.385');
INSERT INTO "sessions" VALUES('b442cf45-02f0-4098-8659-27e2e18fa348','83b7290b-b3de-47a2-aba3-124b12a641b9','2026-03-12T10:57:08.794Z');
INSERT INTO "sessions" VALUES('758de8c1-7a49-4a2a-bf87-397ffdd32bab','83b7290b-b3de-47a2-aba3-124b12a641b9','2026-03-12T15:40:01.620Z');
INSERT INTO "sessions" VALUES('0896f309-c4b2-4930-8ffc-eadee8dc5926','83b7290b-b3de-47a2-aba3-124b12a641b9','2026-03-12T15:43:57.333Z');
INSERT INTO "sessions" VALUES('78b5aab0-641e-46a4-92e1-104de562f160','145b99a2-627a-488c-877d-76d7cc4224e6','2026-03-14 15:12:25.834');
INSERT INTO "sessions" VALUES('40b1c9d6-cd97-43ef-a035-728ffeaf64c9','145b99a2-627a-488c-877d-76d7cc4224e6','2026-03-14T15:13:16.199Z');
INSERT INTO "sessions" VALUES('035f8f0d-4de4-4f8d-a271-f0415ff491a7','145b99a2-627a-488c-877d-76d7cc4224e6','2026-03-14T15:31:31.583Z');
INSERT INTO "sessions" VALUES('3e8211a1-966b-4b35-9540-9a2e5a46fa01','58a526c2-2c9e-4939-8585-52fa921c1005','2026-03-14T15:31:48.240Z');
INSERT INTO "sessions" VALUES('604a3b97-5e6b-4dad-9965-c4c0a4baa427','145b99a2-627a-488c-877d-76d7cc4224e6','2026-03-14T15:33:37.511Z');
CREATE TABLE setups (
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
INSERT INTO "setups" VALUES('50ebc67c-522b-4e59-9ca2-182193210675','3ef52a60-2ae3-4405-9152-447b8171e934','XAUUSD',4899.07,4832.31,4939.13,0.01,1000,1.6665002496255277,'hit_tp','2026-02-03T13:32:05.809Z','2026-02-03T13:32:05.809Z');
INSERT INTO "setups" VALUES('090ed049-43b3-4b21-bee7-09cf86752ee4','3ef52a60-2ae3-4405-9152-447b8171e934','XAUUSD',4899.07,4832.31,4939.13,0.01,123,1.6665002496255277,'hit_sl','2026-02-03T13:32:37.288Z','2026-02-03T13:32:37.288Z');
INSERT INTO "setups" VALUES('26311660-abc4-419c-b221-f7576d3f7652','3ef52a60-2ae3-4405-9152-447b8171e934','XAUUSD',4899.07,4832.31,4939.13,0.04,12234,1.6665002496255277,'pending','2026-02-03T13:32:54.954Z','2026-02-03T13:32:54.954Z');
INSERT INTO "setups" VALUES('ff920a7f-6a84-4a59-ac36-884e559ba4a6','3ef52a60-2ae3-4405-9152-447b8171e934','GBPUSD',1.3805,1.3745,1.3815,0.15,1234,6.000000000000666,'pending','2026-02-03T15:41:01.357Z','2026-02-03T15:41:01.357Z');
INSERT INTO "setups" VALUES('a4947b2e-26fd-4703-8dcf-2f744e68dd1e','83b7290b-b3de-47a2-aba3-124b12a641b9','XAUUSD',4899.07,4832.31,4939.13,0.01,1234,1.6665002496255277,'pending','2026-02-09T11:29:46.055Z','2026-02-09T11:29:46.055Z');
INSERT INTO "setups" VALUES('8d7a0723-a404-4f40-8072-45c9e356a7f0','83b7290b-b3de-47a2-aba3-124b12a641b9','XAUUSD',4899.07,4832.31,4939.13,0.01,1246,1.6665002496255277,'hit_tp','2026-02-09T11:30:16.597Z','2026-02-09T11:30:16.597Z');
INSERT INTO "setups" VALUES('71408235-adce-4b89-8597-d0fceace0816','145b99a2-627a-488c-877d-76d7cc4224e6','BTCUSD',77277.2,76671.4,77640.6,0.06,1000,1.667033571821652,'hit_tp','2026-02-12T15:13:23.268Z','2026-02-12T15:13:23.268Z');
CREATE TABLE news_articles (
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
CREATE TABLE news_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  news_id TEXT NOT NULL,
  user_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  viewed_at INTEGER NOT NULL,
  FOREIGN KEY (news_id) REFERENCES news_articles(id) ON DELETE CASCADE
);
CREATE TABLE newsletter_subscribers (
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
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL, license_key TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE setup_credits_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  change_amount INTEGER NOT NULL,
  new_total INTEGER NOT NULL,
  reason TEXT NOT NULL,
  stripe_session_id TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
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
);
CREATE TABLE referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrer_id TEXT,
  referred_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE referral_codes (
  code TEXT PRIMARY KEY,
  owner_id TEXT,
  is_active INTEGER DEFAULT 1,
  expires_at TEXT,
  created_at TEXT
);
CREATE TABLE referral_redemptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  referral_code TEXT NOT NULL,
  redeemed_at TEXT NOT NULL
);
CREATE TABLE seo_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT,
  path TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE market_polls (id TEXT PRIMARY KEY, question TEXT, symbol TEXT, category TEXT, votes_low INTEGER DEFAULT 0, votes_medium INTEGER DEFAULT 0, votes_high INTEGER DEFAULT 0, total_votes INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT);
INSERT INTO "market_polls" VALUES('iran_venezuela_crisis',NULL,NULL,NULL,1,1,0,2,'2026-02-10T15:43:41.789Z','2026-02-12T15:09:18.425Z');
INSERT INTO "market_polls" VALUES('central_bank_gold_2026',NULL,NULL,NULL,0,0,1,1,'2026-02-12T15:09:22.427Z','2026-02-12T15:09:22.427Z');
CREATE TABLE poll_votes (id TEXT PRIMARY KEY, poll_id TEXT, user_id TEXT, user_name TEXT, vote TEXT, voted_at TEXT);
INSERT INTO "poll_votes" VALUES('23d0fe24-14e2-41da-9c72-b7b122b0565e','iran_venezuela_crisis','v_ptt9izva7b','Anonymous','medium','2026-02-10T15:43:41.789Z');
INSERT INTO "poll_votes" VALUES('6c49bce3-05de-4f61-8bfb-27a74658a536','iran_venezuela_crisis','v_obyk689s14','Anonymous','low','2026-02-12T15:09:18.425Z');
INSERT INTO "poll_votes" VALUES('79e325b4-5942-472f-a7ba-beefb2b8e198','central_bank_gold_2026','v_obyk689s14','Anonymous','high','2026-02-12T15:09:22.427Z');
CREATE TABLE license_activations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  license_key TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  fingerprint TEXT,
  activated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (license_key) REFERENCES users(license_key)
);
DELETE FROM sqlite_sequence;
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_setups_user ON setups(user_id);
CREATE INDEX idx_news_slug ON news_articles(slug);
CREATE INDEX idx_push_endpoint ON push_subscriptions(endpoint);
CREATE INDEX idx_poll_votes_poll_id ON poll_votes(poll_id);
CREATE INDEX idx_poll_votes_user_id ON poll_votes(user_id);
