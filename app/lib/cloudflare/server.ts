// app/lib/cloudflare/server.ts
// This replaces firebaseAdmin.ts

import { getRequestContext } from '@cloudflare/next-on-pages';

export class CloudflareServer {
  private env: any;

  constructor() {
    try {
      const context = getRequestContext();
      this.env = context.env;
    } catch (error) {
      console.warn('Cloudflare context not available (running locally?)');
      this.env = {};
    }
  }

  // ========== DATABASE (D1) ==========

  getDb() {
    return this.env.DB;
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const db = this.getDb();
    if (!db) {
      console.warn('D1 database not available');
      return [];
    }

    try {
      // FIX: Remove the type argument from .all() and cast the result instead
      const result = await db.prepare(sql).bind(...params).all();
      return result.results as T[];
    } catch (error) {
      console.error('D1 query error:', error);
      return [];
    }
  }

  async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results[0] || null;
  }

  async execute(sql: string, params: any[] = []): Promise<{ success: boolean; id?: number }> {
    const db = this.getDb();
    if (!db) {
      console.warn('D1 database not available');
      return { success: false };
    }

    try {
      const result = await db.prepare(sql).bind(...params).run();
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

  // ========== KEY-VALUE STORE ==========

  getKV() {
    return this.env.KV;
  }

  async getFromKV<T = any>(key: string): Promise<T | null> {
    const kv = this.getKV();
    if (!kv) {
      console.warn('KV namespace not available');
      return null;
    }

    try {
      const value = await kv.get(key, { type: 'json' });
      return value as T | null;
    } catch (error) {
      console.error('KV get error:', error);
      return null;
    }
  }

  async setInKV(key: string, value: any, options?: { expirationTtl?: number }): Promise<void> {
    const kv = this.getKV();
    if (!kv) {
      console.warn('KV namespace not available');
      return;
    }

    try {
      await kv.put(key, JSON.stringify(value), options);
    } catch (error) {
      console.error('KV set error:', error);
    }
  }

  async deleteFromKV(key: string): Promise<void> {
    const kv = this.getKV();
    if (!kv) {
      console.warn('KV namespace not available');
      return;
    }

    try {
      await kv.delete(key);
    } catch (error) {
      console.error('KV delete error:', error);
    }
  }

  // ========== OBJECT STORAGE (R2) ==========

  getR2() {
    return this.env.R2;
  }

  async uploadToR2(key: string, data: Buffer | ArrayBuffer, contentType?: string): Promise<void> {
    const r2 = this.getR2();
    if (!r2) {
      console.warn('R2 bucket not available');
      return;
    }

    try {
      await r2.put(key, data, {
        httpMetadata: { contentType }
      });
    } catch (error) {
      console.error('R2 upload error:', error);
    }
  }

  // ========== USER MANAGEMENT ==========

  async getUserById(userId: string) {
    return this.queryOne<{
      id: string;
      email: string;
      display_name?: string;
      photo_url?: string;
      email_verified: number;
      license_type: string;
      created_at: string;
    }>('SELECT id, email, display_name, photo_url, email_verified, license_type, created_at FROM users WHERE id = ?', [userId]);
  }

  async getUserByEmail(email: string) {
    return this.queryOne<{
      id: string;
      email: string;
      display_name?: string;
      photo_url?: string;
      email_verified: number;
      license_type: string;
      created_at: string;
    }>('SELECT id, email, display_name, photo_url, email_verified, license_type, created_at FROM users WHERE email = ?', [email]);
  }

  async createUser(userData: {
    email: string;
    display_name?: string;
    photo_url?: string;
    license_type?: string;
  }) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await this.execute(
      `INSERT INTO users (id, email, display_name, photo_url, license_type, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userData.email,
        userData.display_name || null,
        userData.photo_url || null,
        userData.license_type || 'free',
        now,
        now
      ]
    );

    return { id, ...userData };
  }
}

// Export singleton instance
export const cfServer = new CloudflareServer();