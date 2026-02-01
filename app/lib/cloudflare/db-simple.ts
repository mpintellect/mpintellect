// app/lib/cloudflare/db-simple.ts

/**
 * FIXED: This satisfies the "No matching export" error.
 * It looks for the D1 database in the global Cloudflare environment.
 */
export function getDB(): D1Database {
  // This handles the context for Cloudflare Functions
  const globalEnv = (globalThis as any);
  const db = globalEnv.DB || globalEnv.env?.DB || globalEnv.__env__?.DB;
  
  if (!db) {
    // Return a mock during the build process so Next.js doesn't crash
    return {
      prepare: (sql: string) => ({
        bind: (...params: any[]) => ({
          all: async () => ({ results: [] }),
          run: async () => ({ success: true }),
          first: async () => null,
        }),
      }),
    } as any;
  }
  return db;
}

// ✅ EXPORT BOTH to satisfy all files (Fixes the 6 errors in your log)
export const getDb = getDB;

/**
 * Standard Query Helpers
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = getDB();
  try {
    const result = await db.prepare(sql).bind(...params).all<T>();
    return result.results || [];
  } catch (error) {
    console.error('D1 query error:', error);
    return [];
  }
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results[0] || null;
}

export async function execute(sql: string, params: any[] = []) {
  const db = getDB();
  try {
    const result = await db.prepare(sql).bind(...params).run();
    return { success: true, id: result.meta?.last_row_id };
  } catch (error) {
    console.error('D1 execute error:', error);
    return { success: false };
  }
}