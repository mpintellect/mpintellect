export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  time: string | number;
}

export function determineTradeSide(candlesRaw: Candle[]): {
  decision: "BUY" | "SELL";
  reason: string;
  tp: number;
  sl: number;
  confidence: number;
} {
  const candles = candlesRaw.slice(-72); // Last 6 hours of 5-min data

  if (candles.length < 10) {
    const fallback = candles[candles.length - 1]?.close || 0;
    return {
      decision: "BUY",
      reason: "Not enough data — defaulted to BUY.",
      tp: Number((fallback + 1).toFixed(6)),
      sl: Number((fallback - 1).toFixed(6)),
      confidence: 1,
    };
  }

  let buyScore = 0;
  let sellScore = 0;

  // 1️⃣ Micro Trend Direction
  let upMoves = 0, downMoves = 0;
  for (let i = 1; i < 10; i++) {
    if (candles[i].high > candles[i - 1].high && candles[i].low > candles[i - 1].low) upMoves++;
    else if (candles[i].high < candles[i - 1].high && candles[i].low < candles[i - 1].low) downMoves++;
  }
  if (upMoves > downMoves) buyScore++; else sellScore++;

  // 2️⃣ Momentum Bias
  const last5 = candles.slice(-5);
  const bodyStrengths = last5.map(c => Math.abs(c.close - c.open));
  const avgBody = bodyStrengths.reduce((a, b) => a + b, 0) / 5;
  const last = candles[candles.length - 1];
  const lastBody = Math.abs(last.close - last.open);
  if (last.close > last.open && lastBody > avgBody) buyScore++;
  else if (last.close < last.open && lastBody > avgBody) sellScore++;

  // 3️⃣ Wick Psychology
  const topWick = last.high - Math.max(last.close, last.open);
  const bottomWick = Math.min(last.close, last.open) - last.low;
  if (bottomWick > topWick * 1.5) buyScore++;
  else if (topWick > bottomWick * 1.5) sellScore++;

  // 4️⃣ Breakout / Pullback
  const highs = candles.slice(-10).map(c => c.high);
  const lows = candles.slice(-10).map(c => c.low);
  const maxHigh = Math.max(...highs);
  const minLow = Math.min(...lows);
  const currentClose = last.close;
  if (currentClose > maxHigh) buyScore++;
  else if (currentClose < minLow) sellScore++;

  // 5️⃣ Volatility Expansion
  const recentRange = candles.slice(-5).map(c => c.high - c.low);
  const prevRange = candles.slice(-10, -5).map(c => c.high - c.low);
  const avgRecent = recentRange.reduce((a, b) => a + b, 0) / 5;
  const avgPrev = prevRange.reduce((a, b) => a + b, 0) / 5;
  if (avgRecent > avgPrev * 1.2) {
    if (currentClose > last.open) buyScore++;
    else sellScore++;
  }

  // ✅ Final Decision
  let decision: "BUY" | "SELL";
  if (buyScore > sellScore) decision = "BUY";
  else if (sellScore > buyScore) decision = "SELL";
  else decision = currentClose > last.open ? "BUY" : "SELL";

  // 🎯 TP & SL based on ATR
  const atr = avgRecent;
  const multiplier = 1.5;
  const tp = decision === "BUY" ? currentClose + atr * multiplier : currentClose - atr * multiplier;
  const sl = decision === "BUY" ? currentClose - atr : currentClose + atr;

  const confidence = Math.abs(buyScore - sellScore);
  const reason = `Based on 5-layer analysis (${buyScore} BUY vs ${sellScore} SELL), AI suggests ➤ ${decision}`;

  return {
    decision,
    reason,
    tp: Number(tp.toFixed(6)),
    sl: Number(sl.toFixed(6)),
    confidence,
  };
}