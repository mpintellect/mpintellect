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
  "PLATINUM", "BRENT", "BTCUSD", "ETHUSD", "XRPUSD",
  "DOGEUSD", "LTCUSD", "US500", "USTEC", "US30",
  "HK50", "CAC", "CHINA50", "UK100", "EURJPY",
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
    PLATINUM: "Platinum / USD",
    BTCUSD: "Bitcoin",
    ETHUSD: "Ethereum",
    XRPUSD: "Ripple",
    DOGEUSD: "Dogecoin",
    LTCUSD: "Litecoin",
    BRENT: "US Crude Oil",
    CHINA50: "CHINA50 Index",
    UK100: "FTSE 100 Index",
    US500: "S&P 500 Index (US)",
    NASDAQ: "NASDAQ Index",
    USTEC: "NASDAQ 100 Index (US)",
    US30: "Dow Jones 30 Index (US)",
    HK50: "Hong Kong 50 stock index Index (Europe)",
    FRANCE40: "FRANCE40 Index (France)",
  };
  return names[symbol] || symbol;
}