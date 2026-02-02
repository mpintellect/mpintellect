import { SymbolData } from "@/app/lib/fetchData";

export function generateIndicatorReport(data: SymbolData) {
  const m = data.momentum;
  const rsi = m.rsi_latest;
  const bias = m.momentum_bias.toUpperCase(); // BULLISH, BEARISH, NEUTRAL

  // Default State: Neutral
  let status = "NEUTRAL MOMENTUM";
  let color = "text-purple-400";
  let barColor = "bg-purple-500";
  let sentiment = "Wait for clarity";
  let advice = "RSI is floating in the middle zone (30-70). This indicates price is following the average trend without extremes. Look for price action confirmation rather than trading off RSI alone.";

  // LOGIC TREE
  if (rsi >= 70) {
    status = "⚠️ CRITICAL: OVERBOUGHT";
    color = "text-red-500";
    barColor = "bg-red-500";
    sentiment = "Reversal Risk High";
    advice = "Price is statistically extended to the upside. The probability of a pullback or consolidation is very high. Buying here chases the top. Watch for Bearish Divergence.";
  } 
  else if (rsi <= 30) {
    status = "💎 OPPORTUNITY: OVERSOLD";
    color = "text-emerald-400";
    barColor = "bg-emerald-500";
    sentiment = "Bounce Likely";
    advice = "Selling pressure has exhausted. Price is statistically cheap relative to recent history. Watch for a bullish reaction or rejection wicks to enter long.";
  } 
  else if (rsi > 55 && (bias.includes("BULL"))) {
    status = "STRONG BULLISH MOMENTUM";
    color = "text-green-400";
    barColor = "bg-green-500";
    sentiment = "Trend Following";
    advice = "Buyers are in control. RSI is holding above 50, supporting the uptrend. Dip buying is favored while RSI stays above the 40-50 floor.";
  }
  else if (rsi < 45 && (bias.includes("BEAR"))) {
    status = "STRONG BEARISH MOMENTUM";
    color = "text-red-400";
    barColor = "bg-red-500";
    sentiment = "Sell Rallies";
    advice = "Sellers are dominating. RSI is suppressed below 50, confirming the downtrend. Rallies that fail to push RSI above 60 offer selling opportunities.";
  }

  // META TEXT
  const title = `Live RSI Indicator for ${data.symbol}: ${rsi.toFixed(1)} - ${status}`;
  const desc = `Real-time RSI monitor for ${data.symbol}. Current Value: ${rsi.toFixed(1)}. Market Bias: ${bias}. Technical Verification: ${sentiment}.`;

  return {
    title,
    desc,
    rsiValue: rsi,
    status,
    color,
    barColor,
    advice,
    sentiment,
    divergence: m.divergence_detected !== "None" ? m.divergence_detected : "No Divergence",
    strength: m.momentum_strength
  };
}