import { Candle } from "./determineTradeSide";

export interface TP_SL_Result {
  slPrice: number;
  tpPrice: number;
  slPips: number;
  tpPips: number;
  rrRatio: number;
  atr: number;
  isValid: boolean;
  reason?: string;
}

function determineRR({
  confidence,
  atr,
  avgAtr,
  trendStrength,
}: {
  confidence: number;
  atr: number;
  avgAtr: number;
  trendStrength: "weak" | "moderate" | "strong";
}): number {
  if (confidence <= 1 || trendStrength === "weak") return 1.0;
  if (confidence <= 3 || trendStrength === "moderate") {
    return atr > avgAtr ? 1.5 : 1.3;
  }
  if (confidence >= 4 && trendStrength === "strong" && atr > avgAtr * 1.2) {
    return 2.0;
  }
  return 1.5;
}

function getTrendStrength(candles: Candle[]): "weak" | "moderate" | "strong" {
  let upMoves = 0,
    downMoves = 0;
  for (let i = 1; i < 10; i++) {
    if (
      candles[i].high > candles[i - 1].high &&
      candles[i].low > candles[i - 1].low
    )
      upMoves++;
    else if (
      candles[i].high < candles[i - 1].high &&
      candles[i].low < candles[i - 1].low
    )
      downMoves++;
  }
  const score = Math.abs(upMoves - downMoves);
  if (score <= 2) return "weak";
  if (score <= 4) return "moderate";
  return "strong";
}

/**
 * Calculates SL/TP using recent candle structure and adaptive RR logic
 */
export function calculateSLTP({
  entry,
  decision,
  candles,
  pip,
  confidence,
  minPips = 5,
  rrRatio: rrRatioOverride, // ✅ Allow override of RR
}: {
  entry: number;
  decision: "BUY" | "SELL";
  candles: Candle[];
  pip: number;
  confidence: number;
  minPips?: number;
  rrRatio?: number;
}): TP_SL_Result {
  const decimalPlaces = pip.toString().split(".")[1]?.length || 2;
  const recent = candles.slice(-15);
  const lows = recent.map((c) => c.low);
  const highs = recent.map((c) => c.high);

  // === ATR Calculation
  const trueRanges = [];
  for (let i = 1; i < recent.length; i++) {
    const tr = Math.max(
      recent[i].high - recent[i].low,
      Math.abs(recent[i].high - recent[i - 1].close),
      Math.abs(recent[i].low - recent[i - 1].close)
    );
    trueRanges.push(tr);
  }
  const atr = trueRanges.reduce((a, b) => a + b, 0) / trueRanges.length;
  const avgAtr = atr; // You can expand this later

  // === Determine dynamic RR ratio
  const trendStrength = getTrendStrength(candles);
  const dynamicRR = determineRR({ confidence, atr, avgAtr, trendStrength });

  let rrRatio = rrRatioOverride || dynamicRR;
  rrRatio = Math.max(rrRatio, 1.3); // Enforce min

  // === Swing points
  const swingLow = Math.min(...lows);
  const swingHigh = Math.max(...highs);

  let slPrice: number;
  let tpPrice: number;
  let slPips: number;

  if (decision === "BUY") {
    const rawSL = swingLow;
    slPips = Math.round(Math.max((entry - rawSL) / pip, minPips));
    slPrice = entry - slPips * pip;
    tpPrice = entry + slPips * rrRatio * pip;
  } else {
    const rawSL = swingHigh;
    slPips = Math.round(Math.max((rawSL - entry) / pip, minPips));
    slPrice = entry + slPips * pip;
    tpPrice = entry - slPips * rrRatio * pip;
  }

  const tpPips = Math.round(slPips * rrRatio);
  const isValid =
    slPips >= minPips &&
    (decision === "BUY"
      ? slPrice < entry && tpPrice > entry
      : slPrice > entry && tpPrice < entry);

  // === ✅ Return normal result if valid
  if (isValid) {
    return {
      slPrice: Number(slPrice.toFixed(decimalPlaces)),
      tpPrice: Number(tpPrice.toFixed(decimalPlaces)),
      slPips,
      tpPips,
      rrRatio: Number(rrRatio.toFixed(2)),
      atr: Number(atr.toFixed(decimalPlaces)),
      isValid: true,
    };
  }

  // === ❗Fallback for Stocks if invalid
  if (minPips === 2) {
    const fallbackSlPips = 10;
    const fallbackTpPips = 20;
    const fallbackRR = fallbackTpPips / fallbackSlPips;

    const fallbackSl =
      decision === "BUY"
        ? entry - fallbackSlPips * pip
        : entry + fallbackSlPips * pip;

    const fallbackTp =
      decision === "BUY"
        ? entry + fallbackTpPips * pip
        : entry - fallbackTpPips * pip;

    return {
      isValid: true,
      slPrice: Number(fallbackSl.toFixed(decimalPlaces)),
      tpPrice: Number(fallbackTp.toFixed(decimalPlaces)),
      slPips: fallbackSlPips,
      tpPips: fallbackTpPips,
      rrRatio: Number(fallbackRR.toFixed(2)),
      atr: Number(atr.toFixed(decimalPlaces)),
      reason: "Fallback SL/TP for stock symbol",
    };
  }

  // === ❌ Otherwise return failure
  return {
    slPrice: 0,
    tpPrice: 0,
    slPips: 0,
    tpPips: 0,
    rrRatio: 0,
    atr: Number(atr.toFixed(decimalPlaces)),
    isValid: false,
    reason: "SL/TP calculation failed due to structure conflict",
  };
}