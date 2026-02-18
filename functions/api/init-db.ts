// /functions/api/init-db.ts

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

/**
 * Handle CORS preflight requests
 */
export async function onRequestOptions() {
  return new Response(null, { 
    status: 204,
    headers: CORS_HEADERS
  });
}

/**
 * GET: Provide information about the endpoint
 */
export async function onRequestGet(context: any) {
  return new Response(
    JSON.stringify({ 
      message: "Database Initialization Endpoint",
      description: "Use POST method to initialize all database tables and perform migrations",
      endpoint: "/api/init-db",
      method: "POST",
      version: "2.1.0",
      features: [
        "Table creation with IF NOT EXISTS",
        "Automatic column migrations",
        "Post-migration index creation",
        "Sample data insertion",
        "License key support",
        "Comprehensive error handling"
      ],
      note: "This will create all required tables, add new columns, and create indexes after migrations"
    }), 
    { 
      status: 200,
      headers: CORS_HEADERS
    }
  );
}

/**
 * Run database migrations to add new columns to existing tables
 */
async function runMigrations(env: any) {
  const migrations = [
    {
      table: 'users',
      column: 'license_key',
      sql: "ALTER TABLE users ADD COLUMN license_key TEXT"
    },
    {
      table: 'users',
      column: 'license_expires_at',
      sql: "ALTER TABLE users ADD COLUMN license_expires_at TEXT"
    },
    {
      table: 'setups',
      column: 'capital',
      sql: "ALTER TABLE setups ADD COLUMN capital REAL DEFAULT 1000"
    },
    {
      table: 'setups',
      column: 'risk_reward',
      sql: "ALTER TABLE setups ADD COLUMN risk_reward REAL DEFAULT 1.5"
    },
    {
      table: 'market_polls',
      column: 'category',
      sql: "ALTER TABLE market_polls ADD COLUMN category TEXT DEFAULT 'General'"
    }
  ];

  const migrationResults = [];

  for (const migration of migrations) {
    try {
      console.log(`🔄 Running migration: ${migration.table} -> ${migration.column}`);
      await env.DB.prepare(migration.sql).run();
      migrationResults.push({
        table: migration.table,
        column: migration.column,
        status: 'added',
        message: `Column ${migration.column} added successfully`
      });
      console.log(`✅ Migration successful: ${migration.table}.${migration.column}`);
    } catch (error: any) {
      // Ignore "duplicate column" errors, log others
      if (!error.message.includes('duplicate column name')) {
        console.warn(`⚠️ Migration failed for ${migration.table}.${migration.column}:`, error.message);
        migrationResults.push({
          table: migration.table,
          column: migration.column,
          status: 'failed',
          error: error.message
        });
      } else {
        migrationResults.push({
          table: migration.table,
          column: migration.column,
          status: 'exists',
          message: 'Column already exists'
        });
      }
    }
  }

  return migrationResults;
}

/**
 * Create indexes after tables and migrations are complete
 */
async function createIndexes(env: any) {
  const indexes = [
    // Sessions indexes
    `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`,
    
    // Setups indexes
    `CREATE INDEX IF NOT EXISTS idx_setups_user_id ON setups(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_setups_symbol ON setups(symbol)`,
    `CREATE INDEX IF NOT EXISTS idx_setups_status ON setups(status)`,
    
    // Poll votes indexes
    `CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id)`,
    `CREATE INDEX IF NOT EXISTS idx_poll_votes_user_id ON poll_votes(user_id)`,
    
    // News indexes
    `CREATE INDEX IF NOT EXISTS idx_news_symbol ON news_articles(symbol)`,
    `CREATE INDEX IF NOT EXISTS idx_news_timestamp ON news_articles(timestamp)`,
    
    // Stripe indexes
    `CREATE INDEX IF NOT EXISTS idx_stripe_user_id ON stripe_purchases(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_stripe_created_at ON stripe_purchases(created_at)`,
    
    // Referrals indexes
    `CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id)`,
    `CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id)`,
    `CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status)`,
    
    // Users indexes (create these AFTER migrations to ensure columns exist)
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
    `CREATE INDEX IF NOT EXISTS idx_users_license_key ON users(license_key)`,
    
    // License activations indexes
    `CREATE INDEX IF NOT EXISTS idx_license_activations_user_id ON license_activations(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_license_activations_license_key ON license_activations(license_key)`
  ];

  const indexResults = [];

  for (const sql of indexes) {
    const indexName = sql.match(/CREATE INDEX IF NOT EXISTS (\w+)/)?.[1] || 'unknown';
    
    try {
      console.log(`  Creating index: ${indexName}...`);
      await env.DB.prepare(sql).run();
      indexResults.push({
        index: indexName,
        status: 'created',
        sql: sql.substring(0, 100) + '...'
      });
      console.log(`  ✅ Created index: ${indexName}`);
    } catch (error: any) {
      console.error(`  ❌ Failed to create index ${indexName}:`, error.message);
      indexResults.push({
        index: indexName,
        status: 'error',
        error: error.message
      });
    }
  }

  return indexResults;
}

/**
 * Insert or update sample data for testing
 */
async function seedSampleData(env: any) {
  const seedResults = [];

  try {
    // Sample market polls
    const samplePolls = [
      {
        id: 'poll-001',
        question: 'Will the Fed cut rates in Q2 2024?',
        symbol: 'USD',
        category: 'Macro',
        votes_low: 15,
        votes_medium: 25,
        votes_high: 40,
        total_votes: 80,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'poll-002',
        question: 'Bitcoin halving impact on crypto market',
        symbol: 'BTCUSD',
        category: 'Crypto',
        votes_low: 30,
        votes_medium: 45,
        votes_high: 25,
        total_votes: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'poll-003',
        question: 'S&P 500 year-end target',
        symbol: 'SPX',
        category: 'Equities',
        votes_low: 20,
        votes_medium: 50,
        votes_high: 30,
        total_votes: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'poll-004',
        question: 'Oil price direction for next quarter',
        symbol: 'WTI',
        category: 'Commodities',
        votes_low: 35,
        votes_medium: 40,
        votes_high: 25,
        total_votes: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const poll of samplePolls) {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO market_polls 
        (id, question, symbol, category, votes_low, votes_medium, votes_high, total_votes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        poll.id,
        poll.question,
        poll.symbol,
        poll.category,
        poll.votes_low,
        poll.votes_medium,
        poll.votes_high,
        poll.total_votes,
        poll.created_at,
        poll.updated_at
      ).run();
    }
    seedResults.push({ type: 'polls', status: 'success', count: samplePolls.length });
    console.log(`✅ Inserted ${samplePolls.length} sample polls`);
  } catch (error: any) {
    console.warn("⚠️ Could not insert sample polls:", error.message);
    seedResults.push({ type: 'polls', status: 'error', error: error.message });
  }

  try {
    // Sample news articles
    const sampleNews = [
      {
        id: 'news-001',
        slug: 'fed-rate-decision-march-2024',
        symbol: 'USD',
        title: 'Fed Signals Potential Rate Cuts in 2024',
        signal: 'bullish',
        price_at_alert: 103.50,
        timestamp: new Date().toISOString(),
        created_at: Date.now()
      },
      {
        id: 'news-002',
        slug: 'bitcoin-etf-inflows-surge',
        symbol: 'BTCUSD',
        title: 'Bitcoin ETFs See Record Inflows as Institutional Interest Grows',
        signal: 'bullish',
        price_at_alert: 52000,
        timestamp: new Date().toISOString(),
        created_at: Date.now()
      }
    ];

    for (const news of sampleNews) {
      await env.DB.prepare(`
        INSERT OR IGNORE INTO news_articles 
        (id, slug, symbol, title, signal, price_at_alert, timestamp, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        news.id,
        news.slug,
        news.symbol,
        news.title,
        news.signal,
        news.price_at_alert,
        news.timestamp,
        news.created_at
      ).run();
    }
    seedResults.push({ type: 'news', status: 'success', count: sampleNews.length });
    console.log(`✅ Inserted ${sampleNews.length} sample news articles`);
  } catch (error: any) {
    console.warn("⚠️ Could not insert sample news:", error.message);
    seedResults.push({ type: 'news', status: 'error', error: error.message });
  }

  return seedResults;
}

/**
 * POST: Initialize all database tables and run migrations
 */
export async function onRequestPost(context: any) {
  const { env } = context;
  const startTime = Date.now();

  try {
    console.log("🔄 Starting database initialization and migrations...");
    console.log("📋 Environment:", process.env.NODE_ENV || 'development');
    
    // ==================== STEP 1: CREATE TABLES (without problematic indexes) ====================
    // ==================== STEP 1: CREATE TABLES ====================
const tables = [
  // 1. Users Table (Consolidated with all fields)
  `CREATE TABLE IF NOT EXISTS users (
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
    updated_at TEXT NOT NULL,
    license_key TEXT,
    license_expires_at TEXT,
    has_scalper_x1 INTEGER DEFAULT 0,
    has_scalper_x2 INTEGER DEFAULT 0,
    has_scalper_x3 INTEGER DEFAULT 0,
    has_matrix INTEGER DEFAULT 0
  )`,

  // 2. Auth & Sessions
  `CREATE TABLE IF NOT EXISTS user_passwords (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    expires_at TEXT
  )`,

  // 3. Setups Table
  `CREATE TABLE IF NOT EXISTS setups (
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
  )`,

  // 4. News & Content
  `CREATE TABLE IF NOT EXISTS news_articles (
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
  )`,

  `CREATE TABLE IF NOT EXISTS news_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    news_id TEXT NOT NULL,
    user_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    viewed_at INTEGER NOT NULL,
    FOREIGN KEY (news_id) REFERENCES news_articles(id) ON DELETE CASCADE
  )`,

  // 5. Newsletter
  `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
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
  )`,

  // 6. Stripe & Payments
  `CREATE TABLE IF NOT EXISTS stripe_purchases (
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
    updated_at INTEGER NOT NULL,
    license_key TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS setup_credits_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    change_amount INTEGER NOT NULL,
    new_total INTEGER NOT NULL,
    reason TEXT NOT NULL,
    stripe_session_id TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // 7. Push Notifications
  `CREATE TABLE IF NOT EXISTS push_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT NOT NULL UNIQUE,
    subscription_data TEXT NOT NULL,
    user_id TEXT,
    email TEXT,
    display_name TEXT,
    device_info TEXT,
    status TEXT DEFAULT 'active',
    type TEXT DEFAULT 'trial_user',
    source TEXT,
    created_at INTEGER,
    updated_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // 8. Referrals
  `CREATE TABLE IF NOT EXISTS referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referrer_id TEXT,
    referred_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS referral_codes (
    code TEXT PRIMARY KEY,
    owner_id TEXT,
    is_active INTEGER DEFAULT 1,
    expires_at TEXT,
    created_at TEXT,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS referral_redemptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    referral_code TEXT NOT NULL,
    redeemed_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referral_code) REFERENCES referral_codes(code) ON DELETE CASCADE
  )`,

  // 9. Logs & Analytics
  `CREATE TABLE IF NOT EXISTS seo_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT,
    path TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // 10. Market Polls (Unified System)
  `CREATE TABLE IF NOT EXISTS market_polls (
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
  )`,

  `CREATE TABLE IF NOT EXISTS poll_votes (
    id TEXT PRIMARY KEY,
    poll_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT,
    vote TEXT NOT NULL CHECK (vote IN ('low', 'medium', 'high')),
    voted_at TEXT NOT NULL,
    UNIQUE(poll_id, user_id),
    FOREIGN KEY (poll_id) REFERENCES market_polls(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // 11. License Activations
  `CREATE TABLE IF NOT EXISTS license_activations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_key TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    fingerprint TEXT,
    activated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (license_key) REFERENCES users(license_key),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`
];
    // Execute all table creation SQL statements
    console.log(`📊 Creating ${tables.length} tables...`);
    
    const tableResults = [];
    for (let i = 0; i < tables.length; i++) {
      const sql = tables[i];
      const tableName = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || `Table ${i + 1}`;
      
      try {
        console.log(`  Creating ${tableName}...`);
        await env.DB.prepare(sql).run();
        tableResults.push({
          object: tableName,
          type: 'table',
          status: 'created'
        });
      } catch (error: any) {
        console.error(`  ❌ Failed to create ${tableName}:`, error.message);
        tableResults.push({
          object: tableName,
          type: 'table',
          status: 'error',
          error: error.message
        });
      }
    }

    // ==================== STEP 2: RUN MIGRATIONS TO ADD NEW COLUMNS ====================
    console.log("🔄 Running database migrations...");
    const migrationResults = await runMigrations(env);

    // ==================== STEP 3: CREATE INDEXES (NOW WITH ALL COLUMNS EXISTING) ====================
    console.log("📊 Creating indexes...");
    const indexResults = await createIndexes(env);

    // ==================== STEP 4: SEED SAMPLE DATA ====================
    console.log("🌱 Seeding sample data...");
    const seedResults = await seedSampleData(env);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Compile final response
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      environment: process.env.NODE_ENV || 'development',
      summary: {
        tables: {
          total: tables.length,
          successful: tableResults.filter(r => r.status === 'created').length,
          failed: tableResults.filter(r => r.status === 'error').length
        },
        migrations: {
          total: migrationResults.length,
          successful: migrationResults.filter(r => r.status === 'added').length,
          existing: migrationResults.filter(r => r.status === 'exists').length,
          failed: migrationResults.filter(r => r.status === 'failed').length
        },
        indexes: {
          total: indexResults.length,
          successful: indexResults.filter(r => r.status === 'created').length,
          failed: indexResults.filter(r => r.status === 'error').length
        },
        seedData: {
          successful: seedResults.filter(r => r.status === 'success').length,
          failed: seedResults.filter(r => r.status === 'error').length
        }
      },
      details: {
        tableResults,
        migrationResults,
        indexResults,
        seedResults
      },
      message: "Database initialization and migrations completed successfully"
    };

    console.log(`✅ Database initialization complete in ${duration}ms`);
    
    return new Response(
      JSON.stringify(response, null, 2), 
      {
        status: 200,
        headers: CORS_HEADERS
      }
    );

  } catch (error: any) {
    console.error('💥 Database initialization failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        hint: 'Check your database connection and permissions'
      }, null, 2), 
      {
        status: 500,
        headers: CORS_HEADERS
      }
    );
  }
}