// app/lib/cloudflare/db.ts
// This replaces firebase.ts (simple DB access)

import { getRequestContext } from '@cloudflare/next-on-pages';

/**
 * Get the Cloudflare D1 database instance
 * Equivalent to: const db = getFirestore(app);
 */
export function getDb() {
  const { env } = getRequestContext();
  return env.DB;
}

/**
 * Simple query helper
 * Equivalent to Firestore's collection().get()
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = getDb();
  const { results } = await db.prepare(sql).bind(...params).all<T>();
  return results;
}

/**
 * Get single record
 * Equivalent to Firestore's doc().get()
 */
export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results[0] || null;
}

/**
 * Execute INSERT/UPDATE/DELETE
 * Equivalent to Firestore's setDoc(), updateDoc(), deleteDoc()
 */
export async function execute(sql: string, params: any[] = []) {
  const db = getDb();
  return await db.prepare(sql).bind(...params).run();
}

/**
 * Batch operations
 * Equivalent to Firestore's batch()
 */
export async function batchExecute(operations: { sql: string; params: any[] }[]) {
  const db = getDb();
  
  // Start a transaction
  const statements = operations.map(op => 
    db.prepare(op.sql).bind(...op.params)
  );
  
  return await db.batch(statements);
}

// ========== SPECIFIC COLLECTION HELPERS ==========

// Users collection helpers (equivalent to Firestore's 'users' collection)
export const users = {
  async get(userId: string) {
    return queryOne(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
  },

  async getByEmail(email: string) {
    return queryOne(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
  },

  async create(data: {
    email: string;
    display_name?: string;
    photo_url?: string;
    license_type?: string;
  }) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await execute(
      `INSERT INTO users (id, email, display_name, photo_url, license_type, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.email,
        data.display_name || null,
        data.photo_url || null,
        data.license_type || 'free',
        now,
        now
      ]
    );

    return { id, ...data };
  }
};

// Setups collection helpers (if you have a setups collection)
export const setups = {
  async getAll(userId: string) {
    return query(
      'SELECT * FROM setups WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  },

  async create(data: {
    user_id: string;
    symbol: string;
    setup_type?: string;
    notes?: string;
  }) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await execute(
      `INSERT INTO setups (id, user_id, symbol, setup_type, notes, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.user_id,
        data.symbol,
        data.setup_type || null,
        data.notes || null,
        now,
        now
      ]
    );

    return { id, ...data };
  }
};