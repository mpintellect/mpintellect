import { SymbolData } from "../../lib/fetchData";

export const generateMomentumReport = (data: SymbolData) => {
  const m = data.momentum;
  
  // Format numbers cleanly
  const rsi = m.rsi_latest;
  const slope = m.rsi_slope;
  
  // Logic Helpers
  let state = "Equilibrium";
  if (rsi > 70) state = "Overbought (Potential Exhaustion)";
  if (rsi < 30) state = "Oversold (Value Area)";
  
  const velocity = slope > 0.05 ? "Accelerating" : slope < -0.05 ? "Decelerating" : "Stable";

  return {
    // 1. Title Tag
    title: `${data.symbol} Momentum Analysis: ${m.momentum_bias.toUpperCase()} | RSI ${rsi.toFixed(1)}`,
    
    // 2. Meta Description
    metaDesc: `Live Momentum oscillator check for ${data.symbol}. RSI is at ${rsi.toFixed(1)} (${state}). Velocity: ${velocity}. Detailed divergence analysis.`,

    // 3. Intro / Context
    context: `
      Price velocity for ${data.symbol} currently holds a "${m.momentum_bias}" bias. 
      The Relative Strength Index (RSI) is printing at ${rsi.toFixed(1)}, placing the market in the ${state} zone.
      Our algorithms grade the raw momentum strength as "${m.momentum_strength}", indicating ${m.momentum_strength === 'weak' ? 'indecision or potential consolidation' : 'a committed impulse move'}.
    `,

    // 4. Detailed Stats
    stats: `
      The slope of the momentum oscillator is currently ${velocity} (${slope.toFixed(4)}), which measures the rate of change in order flow aggression.
      Divergence Scan: ${m.divergence_detected === 'none' ? 'No structural anomalies detected.' : `⚠️ ALERT: ${m.divergence_detected} detected. This often signals a reversal risk.`}
    `,

    // 5. Final Verdict
    verdict: `
      ${rsi > 70 
        ? "Caution on long positions; oscillator extended." 
        : rsi < 30 
          ? "Watch for mean-reversion buy triggers." 
          : "Market is balanced; focus on trend following strategies."}
    `
  };
};