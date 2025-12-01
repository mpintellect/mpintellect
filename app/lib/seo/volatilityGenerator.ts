import { TrendData } from "../../lib/fetchData"; // Reuse the interface or extend it

export const generateVolatilityReport = (data: any) => {
  const v = data.volatility;
  const isHighVol = v.volatility_level === "high" || v.volatility_score > 0.7;
  
  const fmt = (num: number) => num.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return {
    // 1. PAGE TITLE
    title: `${data.symbol} Volatility Analysis: ${v.volatility_regime.toUpperCase()} Risk Profile`,
    
    // 2. META DESCRIPTION
    metaDesc: `Current ${data.symbol} Volatility Score: ${v.volatility_score}. Daily ATR is ${fmt(v.current_atr)}. Read our risk management guide and Stop Loss calibration for today.`,

    // 3. CONTEXT
    context: `
      The market state for ${data.symbol} is currently classified as "${v.volatility_regime.toUpperCase()}". 
      The standardized Volatility Score is reading ${v.volatility_score.toFixed(2)} (Scale 0-1). 
      ${v.volatility_score < 0.3 
        ? "This low reading indicates price compression. Often referred to as the 'Calm before the Storm', this state frequently precedes explosive breakouts." 
        : "Elevated readings suggest expanded ranges. Traders should expect wider swings and potentially slippage on market orders."}
    `,

    // 4. STATS EXPLANATION
    stats: `
      The Daily Average True Range (ATR) represents the expected move over a 24-hour period. 
      Currently, ${data.symbol} moves approximately ${fmt(v.current_atr)} points per day. 
      Compared to its historical baseline of ${fmt(v.avg_range)}, volatility is ${v.current_atr > v.avg_range ? "expanding" : "contracting"}.
    `,

    // 5. STRATEGY
    strategy: `
      Risk premiums must be adjusted for this environment. 
      Our AI calculates an optimal Stop Loss multiplier of ${v.optimal_sl_multiplier}x ATR to avoid "noise" while protecting capital. 
      In this ${v.volatility_regime} environment, strictly limit order placement is recommended over market execution.
    `
  };
};