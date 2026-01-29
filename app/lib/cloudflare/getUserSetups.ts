// /app/lib/cloudflare/getUserSetups.ts
import { query } from "./db-simple";

/**
 * Fetch all trade setups linked to a specific userId from Cloudflare D1
 */
export async function getUserSetups(userId: string, limit: number = 100) {
  if (!userId) throw new Error("Missing userId for fetching setups.");

  try {
    const setups = await query(
      `SELECT * FROM setups WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
      [userId, limit]
    );

    // Transform database fields to match application interface
    return setups.map((setup: any) => ({
      id: setup.id,
      symbol: setup.symbol,
      entryPrice: parseFloat(setup.entry_price),
      takeProfit: parseFloat(setup.take_profit),
      stopLoss: parseFloat(setup.stop_loss),
      generatedAt: setup.generated_at,
      createdAt: setup.created_at,
      status: setup.status,
      capital: parseFloat(setup.capital) || 1000,
      lotSize: parseFloat(setup.lot_size) || 0.01,
      riskReward: parseFloat(setup.risk_reward) || 1.5,
      userId: setup.user_id
    }));
  } catch (error) {
    console.error("Error fetching user setups from D1:", error);
    throw new Error("Failed to fetch user setups.");
  }
}

/**
 * Get setup statistics for a user
 */
export async function getUserSetupStats(userId: string) {
  try {
    const stats = await query(
      `SELECT 
        COUNT(*) as total_setups,
        SUM(CASE WHEN status = 'hit_tp' THEN 1 ELSE 0 END) as tp_hits,
        SUM(CASE WHEN status = 'hit_sl' THEN 1 ELSE 0 END) as sl_hits,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired
       FROM setups WHERE user_id = ?`,
      [userId]
    );

    return stats[0] || {
      total_setups: 0,
      tp_hits: 0,
      sl_hits: 0,
      pending: 0,
      expired: 0
    };
  } catch (error) {
    console.error("Error fetching setup stats:", error);
    return {
      total_setups: 0,
      tp_hits: 0,
      sl_hits: 0,
      pending: 0,
      expired: 0
    };
  }
}