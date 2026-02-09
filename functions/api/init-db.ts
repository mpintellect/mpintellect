// functions/api/init-db.ts

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
      description: "Use POST method to initialize all database tables",
      endpoint: "/api/init-db",
      method: "POST",
      note: "This will create all required tables if they don't exist"
    }), 
    { 
      status: 200,
      headers: CORS_HEADERS
    }
  );
}

/**
 * POST: Initialize all database tables
 */
export async function onRequestPost(context: any) {
  const { env } = context;

  try {
    console.log("🔄 Starting database initialization...");
    
    // List of all table creation SQL statements
    const tables = [
      // ==================== USERS & AUTH ====================
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
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
      
      `CREATE TABLE IF NOT EXISTS user_passwords (
        user_id TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS email_verifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,

      // ==================== SETUPS ====================
      `CREATE TABLE IF NOT EXISTS setups (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        symbol TEXT NOT NULL,
        entry_price REAL,
        take_profit REAL,
        stop_loss REAL,
        lot_size REAL DEFAULT 0.01,
        capital REAL DEFAULT 1000,
        risk_reward REAL DEFAULT 1.5,
        status TEXT DEFAULT 'pending',
        created_at TEXT NOT NULL,
        generated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,

      // ==================== NEWS & ARTICLES ====================
      `CREATE TABLE IF NOT EXISTS news_articles (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        symbol TEXT NOT NULL,
        title TEXT NOT NULL,
        signal TEXT NOT NULL,
        price_at_alert REAL,
        timestamp TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )`,

      // ==================== MARKET POLLS ====================
      `CREATE TABLE IF NOT EXISTS market_polls (
        id TEXT PRIMARY KEY,
        question TEXT,
        symbol TEXT,
        category TEXT,
        votes_low INTEGER DEFAULT 0,
        votes_medium INTEGER DEFAULT 0,
        votes_high INTEGER DEFAULT 0,
        total_votes INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
      
      `CREATE TABLE IF NOT EXISTS poll_votes (
        id TEXT PRIMARY KEY,
        poll_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        user_name TEXT,
        vote TEXT NOT NULL CHECK (vote IN ('low', 'medium', 'high')),
        voted_at TEXT NOT NULL,
        UNIQUE(poll_id, user_id),
        FOREIGN KEY (poll_id) REFERENCES market_polls(id) ON DELETE CASCADE
      )`,

      // ==================== STRIPE & PAYMENTS ====================
      `CREATE TABLE IF NOT EXISTS stripe_purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        stripe_session_id TEXT UNIQUE,
        price_id TEXT NOT NULL,
        setup_count INTEGER NOT NULL,
        amount_paid REAL NOT NULL,
        customer_email TEXT NOT NULL,
        status TEXT DEFAULT 'completed',
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,

      // ==================== NEWSLETTER ====================
      `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'active',
        created_at INTEGER NOT NULL
      )`,

      // ==================== REFERRALS ====================
      `CREATE TABLE IF NOT EXISTS referrals (
        id TEXT PRIMARY KEY,
        referrer_id TEXT NOT NULL,
        referred_id TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TEXT NOT NULL,
        FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (referred_id) REFERENCES users(id) ON DELETE CASCADE
      )`,

      // ==================== INDEXES ====================
      `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_setups_user_id ON setups(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_setups_symbol ON setups(symbol)`,
      `CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id)`,
      `CREATE INDEX IF NOT EXISTS idx_poll_votes_user_id ON poll_votes(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_news_symbol ON news_articles(symbol)`,
      `CREATE INDEX IF NOT EXISTS idx_stripe_user_id ON stripe_purchases(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id)`,
      `CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id)`
    ];

    // Execute all SQL statements
    console.log(`📊 Creating ${tables.length} tables...`);
    
    const results = [];
    for (let i = 0; i < tables.length; i++) {
      const sql = tables[i];
      const tableName = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || `Table ${i + 1}`;
      
      try {
        console.log(`  Creating ${tableName}...`);
        await env.DB.prepare(sql).run();
        results.push({
          table: tableName,
          status: 'created',
          sql: sql.substring(0, 100) + '...'
        });
      } catch (error: any) {
        console.error(`  ❌ Failed to create ${tableName}:`, error.message);
        results.push({
          table: tableName,
          status: 'error',
          error: error.message
        });
      }
    }

    // Insert sample poll data for testing
    console.log("📝 Inserting sample poll data...");
    try {
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
      console.log("✅ Sample poll data inserted");
    } catch (error: any) {
      console.warn("⚠️ Could not insert sample polls:", error.message);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Database initialization complete",
        summary: {
          totalTables: tables.length,
          successful: results.filter(r => r.status === 'created').length,
          failed: results.filter(r => r.status === 'error').length
        },
        results: results
      }), 
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
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }), 
      {
        status: 500,
        headers: CORS_HEADERS
      }
    );
  }
}