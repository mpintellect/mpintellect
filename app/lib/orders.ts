
// app/lib/orders.ts (D1 SQL VERSION)
import { execute, queryOne } from './cloudflare/db-simple';

export const PRODUCTS = {
  aiAssistantMonthly: {
    id: "ai-assistant-monthly",
    name: "AI Assistant – Monthly",
    priceUsd: 6,
    available: true,
  },
  aiAssistantPro: {
    id: "ai-assistant-pro",
    name: "AI Assistant – Pro Monthly",
    priceUsd: 30,
    available: false,
  },
  scalperX1: {
    id: "scalper-x1",
    name: "Scalper X1",
    filePath: "MZPrimer_Scalper_X1_V.1.ex5",
    priceUsd: 15,
    available: true,
  }
} as any;

export async function createOrder(db: D1Database, o: any) {
  const id = crypto.randomUUID();
  const now = Date.now();
  
  await execute(db, `
    INSERT INTO stripe_purchases (user_id, stripe_session_id, amount_paid, status, created_at, updated_at)
    VALUES (?, ?, ?, 'pending', ?, ?)
  `, [o.userId, id, o.amountUsd, now, now]);

  return { id, ...o };
}

export async function getOrder(db: D1Database, id: string) {
  return await queryOne(db, 'SELECT * FROM stripe_purchases WHERE stripe_session_id = ?', [id]);
}