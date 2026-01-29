// app/lib/cloudflare/db-simple.ts - OPENNEXT VERSION
// Simple helper functions that work with OpenNext and Cloudflare

// OpenNext provides Cloudflare bindings via environment
export function getDB() {
  // Method 1: OpenNext runtime (production)
  if (typeof process !== 'undefined' && process.env.DB) {
    return process.env.DB;
  }
  
  // Method 2: Cloudflare Pages Functions environment
  if (typeof globalThis !== 'undefined') {
    // Try various OpenNext/Cloudflare environment patterns
    const env = (globalThis as any).env || 
                (globalThis as any).process?.env || 
                (globalThis as any).__env__;
    
    if (env?.DB) {
      return env.DB;
    }
    
    // Direct global access (Cloudflare Workers style)
    if ((globalThis as any).DB) {
      return (globalThis as any).DB;
    }
  }
  
  // Method 3: Local development with wrangler
  if (typeof globalThis !== 'undefined' && (globalThis as any).__cloudflare__?.env?.DB) {
    return (globalThis as any).__cloudflare__.env.DB;
  }
  
  console.warn('Database not available in current context. Running in:', 
    typeof window !== 'undefined' ? 'browser' : 
    typeof process !== 'undefined' ? 'Node.js' : 'unknown');
  
  // Return mock for local development
  if (process.env.NODE_ENV === 'development') {
    console.log('Returning mock database for development');
    return {
      prepare: (sql: string) => ({
        bind: (...params: any[]) => ({
          all: async () => ({ 
            results: [],
            success: true,
            meta: {}
          }),
          run: async () => ({
            success: true,
            meta: { last_row_id: null }
          })
        })
      })
    } as any;
  }
  
  return null;
}

// ✅ ALIAS for backward compatibility
export const getDb = getDB;

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = getDB();
  if (!db) {
    console.error('D1 database not available');
    return [];
  }

  try {
    const stmt = db.prepare(sql);
    const bound = params.length > 0 ? stmt.bind(...params) : stmt;
    const result = await bound.all();
    return result.results || [];
  } catch (error) {
    console.error('D1 query error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    return [];
  }
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results[0] || null;
}

export async function execute(sql: string, params: any[] = []): Promise<{ success: boolean; id?: number }> {
  const db = getDB();
  if (!db) {
    console.error('D1 database not available');
    return { success: false };
  }

  try {
    const stmt = db.prepare(sql);
    const bound = params.length > 0 ? stmt.bind(...params) : stmt;
    const result = await bound.run();
    
    const lastRowId = result.meta?.last_row_id;
    
    return {
      success: true,
      ...(lastRowId !== null && lastRowId !== undefined ? { id: lastRowId } : {})
    };
  } catch (error) {
    console.error('D1 execute error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    return { success: false };
  }
}

// Simple authentication helpers
export async function getUserById(userId: string) {
  return queryOne<{
    id: string;
    email: string;
    display_name?: string;
    photo_url?: string;
    email_verified: number;
    license_type: string;
    created_at: string;
  }>('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
}

export async function getUserByEmail(email: string) {
  return queryOne<{
    id: string;
    email: string;
    display_name?: string;
    photo_url?: string;
    email_verified: number;
    license_type: string;
    created_at: string;
  }>('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
}

export async function createUser(email: string, displayName?: string) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  const result = await execute(
    `INSERT INTO users (id, email, display_name, email_verified, license_type, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, email, displayName || null, 0, 'free', now, now]
  );
  
  if (result.success) {
    return { id, email, display_name: displayName };
  } else {
    throw new Error('Failed to create user');
  }
}