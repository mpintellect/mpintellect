// app/lib/generators/trendGenerator.ts

import { SymbolData } from "../fetchData";

export const generateTrendReport = (data: SymbolData) => {
  const t = data.trend;
  const isBullish = t.trend.toLowerCase().includes("bullish");

  // ✅ FIXED: No forced decimals. 
  // We allow up to 10 decimal places so Forex (5) and Crypto (2-8) display exactly as fetched.
  const fmt = (num: number) => num.toLocaleString('en-US', { maximumFractionDigits: 10 });

  return {
    // 1. PAGE TITLE (H1)
    title: `${data.symbol} Trend Analysis: ${t.trend.toUpperCase()} Structure Confirmed`,
    
    // 2. META DESCRIPTION
    metaDesc: `Live trend report for ${data.symbol}. Our AI Trend Score is ${t.trend_strength_score}/100, signaling a ${t.trend_strength} move. Read the full institutional analysis.`,

    // 3. SEO CONTENT BLOCKS
    context: `
      The overarching market structure for ${data.symbol} is currently ${t.trend}. 
      Our institutional trend algorithm calculates a Strength Score of ${t.trend_strength_score}/100, 
      classifying this movement as "${t.trend_strength}".
      ${t.trend_strength_score > 75 
        ? "High scores indicate strong institutional commitment to this direction." 
        : "Lower scores suggest a potential chopping market or trend exhaustion."}
    `,

    technicals: `
      Price action (${fmt(t.current_price)}) is currently trading ${t.price_position.vs_ema50} the key 50-period moving average (${fmt(t.current_emas.ema_50)}).
      The current EMA Alignment is labeled as "${t.ema_alignment}", which typically validates ${isBullish ? 'support holding on dips' : 'overhead resistance at prior swing highs'}.
    `,

    verdict: `
      Smart money flow indicates ${isBullish ? "Upward" : "Downward"} momentum. 
      Traders should focus on ${isBullish ? 'long' : 'short'} entries aligning with the primary trend to minimize liquidity risk.
    `
  };
};