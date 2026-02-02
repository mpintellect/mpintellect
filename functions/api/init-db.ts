// functions/api/init-db.ts
export async function onRequestPost(context: any) {
  const { env } = context;

  try {
    console.log("🔄 Initializing database tables...");

    // Execute each table creation separately
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        display_name TEXT,
        setup_count INTEGER DEFAULT 0,
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
      
      `CREATE TABLE IF NOT EXISTS setups (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        symbol TEXT NOT NULL,
        entry_price REAL,
        take_profit REAL,
        stop_loss REAL,
        capital REAL,
        lot_size REAL,
        risk_reward REAL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)`,
      `CREATE INDEX IF NOT EXISTS idx_setups_user_id ON setups(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_setups_created_at ON setups(created_at)`
    ];

    const results = [];
    for (const sql of tables) {
      console.log(`Executing: ${sql.substring(0, 60)}...`);
      const result = await env.DB.prepare(sql).run();
      results.push({ sql, success: result.success });
    }

    // Verify tables were created
    const tablesCheck = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    ).all();

    const tableNames = tablesCheck.results?.map((t: any) => t.name) || [];

    console.log("✅ Database initialized successfully!");
    console.log("📊 Tables created:", tableNames);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Database initialized',
      tables: tableNames,
      results: results
    }), { 
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error: any) {
    console.error('💥 Database initialization failed:', error.message);
    console.error('💥 Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), { 
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Also add GET method to check tables
export async function onRequestGet(context: any) {
  const { env } = context;

  try {
    const tables = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    ).all();

    return new Response(JSON.stringify({ 
      success: true, 
      tables: tables.results || [],
      count: tables.results?.length || 0
    }), { 
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error: any) {
    console.error('💥 Failed to check tables:', error.message);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      message: 'Database might not be initialized. Use POST /api/init-db to initialize.'
    }), { 
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}