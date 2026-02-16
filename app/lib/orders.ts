// app/lib/orders.ts (D1 SQL VERSION)
import { execute, queryOne } from '../../backend-lib/db-simple';

export const PRODUCTS = {
  aiAssistantMonthly: { id: "ai-assistant-monthly", name: "AI Assistant – Monthly", priceUsd: 10 },
  scalperX1: { id: "scalper-x1", name: "Scalper X1", priceUsd: 45 }
} as any;

/**
 * FIXED: Removed 'db: D1Database' argument
 * Now matches the 1-2 arguments expected by db-simple
 */
export async function createOrder(o: any) {
  const id = crypto.randomUUID();
  const now = Date.now();
  
  // FIXED: Removed 'db' from the execute call
  await execute(`
    INSERT INTO stripe_purchases (user_id, stripe_session_id, amount_paid, status, created_at, updated_at)
    VALUES (?, ?, ?, 'pending', ?, ?)
  `, [o.userId, id, o.amountUsd, now, now]);

  return { id, ...o };
}

/**
 * FIXED: Removed 'db: D1Database' argument
 */
export async function getOrder(id: string) {
  // FIXED: Removed 'db' from the queryOne call
  return await queryOne('SELECT * FROM stripe_purchases WHERE stripe_session_id = ?', [id]);
}