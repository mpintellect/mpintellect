import { NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '@/firebase-key.json';

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount as any) });
}

const db = getFirestore();
const SYMBOLS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD",
  "NZDUSD", "USDCHF", "XAUUSD", "XAUEUR", "XAGUSD",
  "XPTUSD", "USCRUDE", "BTCUSD", "ETHUSD", "XRPUSD",
  "DGEUSD", "LTCUSD", "SPX", "NQ", "YM",
  "SX5E", "CAC", "FDAX", "FTSE", "EURJPY",
  "EURGBP", "GBPJPY", "GBPCHF"
];

export async function GET() {
  const results: {
    symbol: string;
    name: string;
    changePercent: number;
    latestPrice: number;
    trend: 'up' | 'down' | 'sideways';
  }[] = [];

  for (const symbol of SYMBOLS) {
    try {
      const snapshot = await db
        .collection('market_data')
        .doc(symbol)
        .collection('candles')
        .orderBy('time', 'desc')
        .limit(576) // 48h of 5-minute candles
        .get();

      const candles = snapshot.docs.map(doc => doc.data()).reverse();
      if (candles.length < 576) continue;

      // Split into two halves: Day 1 and Day 2
      const firstDay = candles.slice(0, 288).map(c => c.close);
      const secondDay = candles.slice(288).map(c => c.close);

      const avg1 = firstDay.reduce((a, b) => a + b, 0) / firstDay.length;
      const avg2 = secondDay.reduce((a, b) => a + b, 0) / secondDay.length;
      const diff = avg2 - avg1;
      const pct = (diff / avg1) * 100;

      let trend: 'up' | 'down' | 'sideways' = 'sideways';
      if (pct > 0.05) trend = 'up';
      else if (pct < -0.05) trend = 'down';

      results.push({
        symbol,
        name: getSymbolName(symbol),
        changePercent: +pct.toFixed(2),
        latestPrice: +secondDay.at(-1),
        trend
      });
    } catch (e) {
      console.warn(`⚠️ Error with ${symbol}`, e);
    }
  }

  const up = results
    .filter(r => r.trend === 'up')
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3);

  const down = results
    .filter(r => r.trend === 'down')
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 3);

  return NextResponse.json({ up, down });
}

function getSymbolName(symbol: string): string {
  const names: Record<string, string> = {
    XAUUSD: "Gold / USD",
    XAUEUR: "Gold / EUR",
    XAGUSD: "Silver / USD",
    XPTUSD: "Platinum / USD",
    BTCUSD: "Bitcoin",
    ETHUSD: "Ethereum",
    XRPUSD: "Ripple",
    DGEUSD: "Dogecoin",
    LTCUSD: "Litecoin",
    USCRUDE: "US Crude Oil",
    FDAX: "DAX 40 Index",
    FTSE: "FTSE 100 Index",
    SPX: "S&P 500 Index (US)",
    NASDAQ: "NASDAQ Index",
    NQ: "NASDAQ 100 Index (US)",
    YM: "Dow Jones 30 Index (US)",
    SX5E: "Euro Stoxx 50 Index (Europe)",
    CAC: "CAC 40 Index (France)",
  };
  return names[symbol] || symbol;
}