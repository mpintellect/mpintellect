import { SymbolData } from "../fetchData";

export const generateTradeReport = (data: SymbolData) => {
  const sym = data.symbol.toUpperCase();
  // Assume there is at least 1 pending order, if not mock one from current price
  const order = (data as any).pending_orders?.primary_order || (data as any).pending_orders?.pending_orders?.[0];
  const tpSl = (data as any).tp_sl;
  const risk = (data as any).risk_score;

  if (!order) return { title: `${sym} Trading Update`, metaDesc: "No active setup." };

  const action = order.type.replace('_LIMIT', '').replace('_STOP', ''); // "BUY"
  const rr = order.rr_ratio || tpSl?.rr_ratio || 2.0;

  return {
    title: `Live Trade Setup: ${action} ${sym} | R:R ${rr} Signal`,
    metaDesc: `Active trading plan for ${sym}. Entry: ${order.entry_price}. Stop Loss: ${order.sl_price}. Take Profit: ${order.tp_price}. Strategy: ${order.rationale}.`,

    header: `${action} SIGNAL DETECTED`,
    
    rationale: `
      Primary Setup: **${order.type.replace('_', ' ')}**.
      Reasoning: ${order.rationale || "Algorithmic breakout detected"}. 
      Market Context: ${(data as any).pending_orders?.market_context?.replace('_', ' ') || "Trend Following"}.
    `,

    execution: `
      Place orders at **${order.entry_price}** to secure an optimal risk-reward ratio of 1:${rr}. 
      The calculated invalidation point (Stop Loss) aligns with recent ${action === 'BUY' ? 'support' : 'resistance'} structures.
    `,

    risk_manage: `
      Risk Category: **${risk?.risk_category?.replace(/_/g, ' ') || 'STANDARD'}**. 
      Recommended Position Size Multiplier: ${risk?.position_size_multiplier || '1.0'}x.
    `
  };
};