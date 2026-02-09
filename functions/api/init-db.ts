// functions/api/init-db.ts

export async function onRequestPost(context: any) {
  const { env } = context;

  try {
    console.log("🔄 Initializing FULL database schema...");

    const tables = [
      // 1. Users & Auth
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

      // 2. Setups
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

      // 3. News & Articles
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

      // 4. Market Polls (THIS WAS THE MISSING PIECE)
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
        vote TEXT NOT NULL,
        voted_at TEXT NOT NULL,
        UNIQUE(poll_id, user_id)
      )`,

      // 5. Stripe & Payments
      `CREATE TABLE IF NOT EXISTS stripe_purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        stripe_session_id TEXT UNIQUE,
        price_id TEXT NOT NULL,
        setup_count INTEGER NOT NULL,
        amount_paid REAL NOT NULL,
        customer_email TEXT NOT NULL,
        status TEXT DEFAULT 'completed',
        created_at INTEGER NOT NULL
      )`,

      // 6. Newsletter
      `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'active',
        created_at INTEGER NOT NULL
      )`,

      // 7. Indexes
      `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_setups_user_id ON setups(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id)`
    ];

    for (const sql of tables) {
      console.log(`Executing SQL logic...`);
      await env.DB.prepare(sql).run();
    }

    return new Response(JSON.stringify({ success: true, message: "All tables initialized" }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error: any) {
    console.error('💥 Database initialization failed:', error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}