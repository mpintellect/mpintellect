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
  XPTUSD: 'XPTUSD',
  USCRUDE: 'USCRUDE',
  BTCUSD: 'BTCUSD',
  ETHUSD: 'ETHUSD',
  XRPUSD: 'XRPUSD',
  DGEUSD: 'DGEUSD',
  LTCUSD: 'LTCUSD',
  SPX: 'SPX',
  NQ: 'NQ',
  YM: 'YM',
  SX5E: 'SX5E',
  CAC: 'CAC',
  FDAX: 'FDAX',
  FTSE: 'FTSE',
  EURJPY: 'EURJPY',
  EURGBP: 'EURGBP',
  GBPJPY: 'GBPJPY',
  GBPCHF: 'GBPCHF',
};

export async function fetchCurrentPrice(symbol: string): Promise<number | null> {
  try {
    console.log(`🔍 [fetchCurrentPrice] Starting for symbol: ${symbol}`);
    
    const mappedSymbol = SYMBOL_MAP[symbol] || symbol;
    console.log(`🔍 [fetchCurrentPrice] Mapped symbol: ${mappedSymbol}`);
    
    const docRef = doc(db, 'prices', mappedSymbol);
    console.log(`🔍 [fetchCurrentPrice] Document path: prices/${mappedSymbol}`);
    
    const docSnap = await getDoc(docRef);
    console.log(`🔍 [fetchCurrentPrice] Document exists: ${docSnap.exists()}`);

    if (!docSnap.exists()) {
      console.warn(`⚠️ No price found in Firestore for "${mappedSymbol}"`);
      return null;
    }

    const data = docSnap.data();
    console.log(`🔍 [fetchCurrentPrice] Raw data:`, data);
    
    const price = data?.price;
    console.log(`🔍 [fetchCurrentPrice] Extracted price: ${price}, type: ${typeof price}`);

    if (typeof price === 'number') {
      console.log(`✅ [fetchCurrentPrice] Success: ${mappedSymbol} = ${price}`);
      return price;
    } else {
      console.warn(`⚠️ Invalid price format for "${mappedSymbol}": ${price}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching price from Firestore:', error);
    return null;
  }
}