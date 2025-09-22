// lib/fetchPrice.ts

import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const SYMBOL_MAP: Record<string, string> = {
  EURUSD: 'EURUSD',
  GBPUSD: 'GBPUSD',
  USDJPY: 'USDJPY',
  USDCAD: 'USDCAD',
  AUDUSD: 'AUDUSD',
  NZDUSD: 'NZDUSD',
  USDCHF: 'USDCHF',
  XAUUSD: 'XAUUSD',
  XAUEUR: 'XAUEUR',
  XAGUSD: 'XAGUSD',
  BTCUSD: 'BTCUSD',
  ETHUSD: 'ETHUSD',
  AAPL:   'AAPL',
  TSLA:   'TSLA',
  AMZN:   'AMZN',
  US30:   'US30',
  NASDAQ: 'NASDAQ'
};

export async function fetchCurrentPrice(symbol: string): Promise<number | null> {
  try {
    const mappedSymbol = SYMBOL_MAP[symbol] || symbol;
    const docRef = doc(db, 'prices', mappedSymbol);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return typeof data.price === 'number' ? data.price : null;
    } else {
      console.warn(`❌ No document found for ${mappedSymbol}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Firebase fetch error:', error);
    return null;
  }
}