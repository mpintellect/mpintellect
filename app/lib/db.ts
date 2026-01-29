import { getRequestContext } from '@cloudflare/next-on-pages';

export function getDb() {
  // This gets the "DB" binding you defined in wrangler.json
  const { env } = getRequestContext();
  return env.DB;
}

/**
 * Helper to run a SELECT query
 */
export async function queryBuilder<T>(sql: string, params: any[] = []): Promise<T[]> {
  const db = getDb();
  const { results } = await db.prepare(sql).bind(...params).all<T>();
  return results;
}

/**
 * Helper to run an INSERT/UPDATE/DELETE
 */
export async function executeBuilder(sql: string, params: any[] = []) {
  const db = getDb();
  return await db.prepare(sql).bind(...params).run();
}