// app/api/candles/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import serviceAccount from '../../../firebase-key.json';

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
  });
}

const db = getFirestore();

// === Helper to calculate EMA ===
function calculateEMA(prices: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const emaArray: number[] = [];
  let ema = prices[0]; // seed with first price

  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      emaArray.push(ema);
    } else {
      ema = prices[i] * k + ema * (1 - k);
      emaArray.push(ema);
    }
  }

  return emaArray;
}
interface CandleData {
  id: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: string;
}
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
const rawSymbol = searchParams.get("symbol");

const STOCK_SYMBOLS = ["NQ", "SPX", "YM", "SX5E", "CAC"];

const symbol =
  STOCK_SYMBOLS.includes(`#${rawSymbol}`) && !rawSymbol?.startsWith("#")
    ? `#${rawSymbol}`
    : rawSymbol;

if (!symbol) {
  return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
}

  try {
    const candlesRef = db
      .collection("market_data")
      .doc(symbol)
      .collection("candles")
      .orderBy("time", "desc")
      .limit(20);

    const snapshot = await candlesRef.get();

    const candles: CandleData[] = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...(doc.data() as Omit<CandleData, "id">),
}));

    // === Extract close prices (last 20) for EMA
    const closePrices = candles.map((candle) => candle.close).reverse();
    const ema7 = calculateEMA(closePrices, 7);
    const ema20 = calculateEMA(closePrices, 20);

    // === Last values of EMAs
    const lastEma7 = ema7[ema7.length - 1];
    const lastEma20 = ema20[ema20.length - 1];

    let bias = "NEUTRAL";
    let reason = "";

    if (lastEma7 > lastEma20) {
      bias = "BUY";
      reason = "EMA-7 is above EMA-20 (bullish crossover)";
    } else if (lastEma7 < lastEma20) {
      bias = "SELL";
      reason = "EMA-7 is below EMA-20 (bearish crossover)";
    } else {
      bias = "NEUTRAL";
      reason = "No crossover detected";
    }

    return NextResponse.json({
      symbol,
      candles,
      analysis: {
        bias,
        ema7: Number(lastEma7.toFixed(5)),
        ema20: Number(lastEma20.toFixed(5)),
        reason,
      },
    });

  } catch (error) {
    console.error("❌ Error fetching candles:", error);
    return NextResponse.json({ error: "Failed to fetch candles" }, { status: 500 });
  }
}