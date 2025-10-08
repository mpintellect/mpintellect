import { calculateLotSize } from "./LOTsizecalculate";
import { Candle, determineTradeSide } from "./determineTradeSide";
import { calculateSLTP } from "./SL-TPcalculate";
import { getDynamicRiskPercent } from "./determineRiskPercent";
import { CONTRACT_SIZES } from "@/data/symbols";
import type { SymbolKey } from "@/data/symbols";

export interface TradeSetupResult {
  entry: number;
  sl: number;
  tp: number;
  slUSD: number;
  tpUSD: number;
  lots: number;
  slPips: number;
  tpPips: number;
  rrRatio: number;
  atr: number;
  decision: "BUY" | "SELL";
  reason: string;
  confidence: number;
  valid: boolean;
}

/**
 * Combines AI-based direction, realistic SL/TP, and lot size calculation
 */
export function calculateTradeSetup({
  symbol,
  candles,
  capital,
}: {
  symbol: SymbolKey;
  candles: Candle[];
  capital: number;
}): TradeSetupResult {
  const pip = CONTRACT_SIZES[symbol].pip;
  const contract = CONTRACT_SIZES[symbol].contract;

  const { decision, reason, confidence } = determineTradeSide(candles);
  const entryRaw = candles[candles.length - 1]?.close || 0;
  const entry = Number(entryRaw.toFixed(6));

  // === STEP 1: Calculate ATR (Volatility)
  const atrCandles = candles.slice(-15);
  const period = 14;
  const trueRanges: number[] = [];

  for (let i = 1; i < atrCandles.length; i++) {
    const current = atrCandles[i];
    const prev = atrCandles[i - 1];
    const tr = Math.max(
      current.high - current.low,
      Math.abs(current.high - prev.close),
      Math.abs(current.low - prev.close)
    );
    trueRanges.push(tr);
  }

  const atr = trueRanges.slice(-period).reduce((sum, tr) => sum + tr, 0) / period;

  // === STEP 2: SL/TP Calculation using Dynamic RR logic
  const isStock = symbol.startsWith("#");

let sltp = calculateSLTP({
  entry,
  decision,
  candles,
  pip,
  confidence,
  minPips: isStock ? 2 : 5,
});

// 🛠️ Fallback for stock symbols (SPX, NQ, etc.)
if (!sltp.isValid && isStock) {
  const fallbackSl = decision === "BUY" ? entry - 20 * pip : entry + 20 * pip;
  const fallbackTp = decision === "BUY" ? entry + 40 * pip : entry - 40 * pip;
  const fallbackSlPips = 20;
  const fallbackTpPips = 40;
  const rrRatio = fallbackTpPips / fallbackSlPips;

  sltp = {
  isValid: true,
  slPrice: fallbackSl,
  tpPrice: fallbackTp,
  slPips: fallbackSlPips,
  tpPips: fallbackTpPips,
  rrRatio,
  atr, // ✅ Add this line to fix the TypeScript error
  reason: "Fallback setup for stock symbol",
};
}

  // === STEP 3: Invalid structure fallback
  if (!sltp.isValid) {
  console.debug("❌ SLTP invalid setup", {
    symbol,
    decision,
    entry,
    sltp,
    atr,
    candles: candles.slice(-3), // show last 3
  });

  return {
    entry,
    sl: 0,
    tp: 0,
    slUSD: 0,
    tpUSD: 0,
    lots: 0,
    slPips: 0,
    tpPips: 0,
    rrRatio: 0,
    atr,
    decision,
    reason: sltp.reason || reason,
    confidence,
    valid: false,
  };
}

  // ✅ STEP 4: Get dynamic risk %
  const riskPercent = getDynamicRiskPercent({ capital, confidence });

  // ✅ STEP 5: Lot Size Calculation
  const lotData = calculateLotSize({
    capital,
    slPips: sltp.slPips,
    pip,
    contract,
    riskPercent,
  });

  const tpUSD = sltp.tpPips * pip * contract * lotData.lotSize;

  // === FINAL RESULT
  return {
    entry,
    sl: sltp.slPrice,
    tp: sltp.tpPrice,
    slUSD: lotData.slUSD,
    tpUSD: Number(tpUSD.toFixed(2)),
    lots: lotData.lotSize,
    slPips: sltp.slPips,
    tpPips: sltp.tpPips,
    rrRatio: sltp.rrRatio,
    atr,
    decision,
    reason,
    confidence,
    valid: lotData.isValid,
  };
}