// app/lib/cloudflare/db-simple.ts - CLEAN NATIVE VERSION

/**
 * Native D1 Query Helper
 * We pass the 'db' instance directly from the Cloudflare Function context
 */
export async function query<T = any>(db: D1Database, sql: string, params: any[] = []): Promise<T[]> {
  if (!db) {
    console.error('D1 database instance is missing');
    return [];
  }

  try {
    const stmt = db.prepare(sql);
    const bound = params.length > 0 ? stmt.bind(...params) : stmt;
    const result = await bound.all<T>();
    return result.results || [];
  } catch (error) {
    console.error('D1 query error:', error);
    return [];
  }
}

/**
 * Get a single row
 */
export async function queryOne<T = any>(db: D1Database, sql: string, params: any[] = []): Promise<T | null> {
  const results = await query<T>(db, sql, params);
  return results[0] || null;
}

/**
 * Execute a write command (Insert/Update/Delete)
 */
export async function execute(db: D1Database, sql: string, params: any[] = []): Promise<{ success: boolean; id?: number }> {
  if (!db) {
    console.error('D1 database instance is missing');
    return { success: false };
  }

  try {
    const stmt = db.prepare(sql);
    const bound = params.length > 0 ? stmt.bind(...params) : stmt;
    const result = await bound.run();
    
    return {
      success: true,
      id: result.meta?.last_row_id as number || undefined
    };
  } catch (error) {
    console.error('D1 execute error:', error);
    return { success: false };
  }
}

// Authentication helpers updated to accept 'db'
export async function getUserById(db: D1Database, userId: string) {
  return queryOne(db, 'SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
}

export async function getUserByEmail(db: D1Database, email: string) {
  return queryOne(db, 'SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
}