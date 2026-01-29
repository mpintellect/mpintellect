// app/lib/cloudflare/db-simple.ts - UPDATED VERSION
import { getRequestContext } from '@cloudflare/next-on-pages';

// Simple helper functions that work without complex types

export function getDB() {
  try {
    const { env } = getRequestContext();
    return env.DB;
  } catch (error) {
    console.warn('Cloudflare context not available. Are you running locally?');
    return null;
  }
}

// ✅ ADD THIS ALIAS FOR BACKWARD COMPATIBILITY
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
    const result = await bound.all<T>();
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

// FIXED: Update return type to handle null
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
    
    // FIX: Convert null to undefined or don't include id if it's null
    const lastRowId = result.meta?.last_row_id;
    
    return {
      success: true,
      ...(lastRowId !== null && lastRowId !== undefined ? { id: lastRowId } : {})
    };
  } catch (error) {
    console.error('D1 execute error:', error);
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