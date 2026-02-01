import { SymbolData } from "../fetchData";

export const generateAnalysisReport = (data: SymbolData) => {
  const sym = data.symbol.toUpperCase();
  const t = data.trend;
  const m = data.momentum;
  const v = data.volatility;

  // FORMATTER
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 8 });

  // 1. STRUCTURE ANALYSIS
  let structure = "Neutral / Ranging";
  if (t.ema_alignment === 'bullish' && m.rsi_latest > 50) structure = "Constructive Bullish Structure";
  if (t.ema_alignment === 'bearish' && m.rsi_latest < 50) structure = "Deteriorating Bearish Structure";

  // 2. CONFLUENCE SCORE (How many indicators agree?)
  let confluenceCount = 0;
  if (t.trend_strength === 'strong') confluenceCount++;
  if (m.momentum_strength !== 'weak') confluenceCount++;
  if (data.zones?.zone_strength === 'strong') confluenceCount++;
  
  const confluenceText = confluenceCount === 3 
    ? "High Confluence (Institutions Active)" 
    : confluenceCount === 2 
        ? "Moderate Confluence (Standard Market)" 
        : "Low Confluence (Retail Noise)";

  return {
    title: `${sym} Technical Analysis: Deep Dive Market Structure & Risk Report`,
    metaDesc: `${sym} full market health check. Structure: ${structure}. Volatility Regime: ${v.volatility_regime}. Trend Integrity Score: ${t.trend_strength_score}/100.`,

    // A. Market Health
    health_check: `
      Price action for ${sym} is exhibiting a **${structure}**. 
      The correlation between Trend Flow and Momentum is currently **${m.trend_alignment}**, which confirms ${m.trend_alignment === 'aligned' ? 'movement authenticity' : 'potential divergence'}.
    `,

    // B. Liquidity Profile
    liquidity: `
      Order flow analysis identifies specific activity near the **${fmt(data.zones.support_zone)}** (Demand) and **${fmt(data.zones.resistance_zone)}** (Supply) pools.
      Volatility metrics suggest a **${v.volatility_regime}** environment, requiring ${v.volatility_level === 'high' ? 'loose stops' : 'standard position sizing'}.
    `,

    // C. Confluence Summary
    verdict: `
      Market Reality: ${confluenceText}.
      Primary Driver: ${t.trend_strength_score > m.momentum_strength.length * 10 ? "Trend Following" : "Mean Reversion"}
    `
  };
};