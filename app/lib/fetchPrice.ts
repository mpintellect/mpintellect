// app/lib/fetchPrice.ts
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
  PLATINUM: 'PLATINUM',
  BRENT: 'BRENT',
  BTCUSD: 'BTCUSD',
  ETHUSD: 'ETHUSD',
  XRPUSD: 'XRPUSD',
  DOGEUSD: 'DOGEUSD',
  LTCUSD: 'LTCUSD',
  US500: 'US500',
  USTEC: 'USTEC',
  US30: 'US30',
  HK50: 'HK50',
  FRANCE40: 'FRANCE40',
  CHINA50: 'CHINA50',
  UK100: 'UK100',
  EURJPY: 'EURJPY',
  EURGBP: 'EURGBP',
  GBPJPY: 'GBPJPY',
  GBPCHF: 'GBPCHF',
  NASDAQ: 'NASDAQ',
  TSLA: '#TSLA',
  AAPL: '#AAPL',
  AMD: '#AMD',
  AMZN: '#AMZN',
  TSCO: '#TSCO'
};

export type PriceData = {
  symbol: string;
  price: number;
  decimals: number;
  timestamp: number;
};

export type AllPricesData = {
  [symbol: string]: PriceData;
};

// Cache for prices
let pricesCache: AllPricesData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

/**
 * Fetch current price for a specific symbol using the API route
 */
export async function fetchCurrentPrice(symbol: string): Promise<number | null> {
  try {
    console.log(`🔍 [fetchCurrentPrice] Requested symbol: ${symbol}`);
    
    const mappedSymbol = SYMBOL_MAP[symbol] || symbol;
    console.log(`🔍 [fetchCurrentPrice] Mapped symbol: ${mappedSymbol}`);
    
    // Use API route instead of direct Google Storage call
    const res = await fetch(`/api/price?symbol=${encodeURIComponent(mappedSymbol)}`);
    
    console.log(`📡 API response status: ${res.status}, ok: ${res.ok}`);
    
    if (!res.ok) {
      console.error(`❌ API route failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    console.log(`✅ [fetchCurrentPrice] SUCCESS: ${mappedSymbol} = ${data.price}`);
    
    return data.price;
    
  } catch (err) {
    console.error("❌ Error in fetchCurrentPrice:", err);
    return null;
  }
}

/**
 * Fetch all prices data (cached for 2 minutes)
 */
export async function fetchAllPrices(): Promise<AllPricesData | null> {
  try {
    // Check cache first
    const now = Date.now();
    if (pricesCache && (now - cacheTimestamp < CACHE_DURATION)) {
      console.log('📊 Returning cached prices data');
      return pricesCache;
    }

    console.log('🔄 Cache miss - fetching fresh prices data...');
    
    const res = await fetch('https://us-central1-mzprimer-livefeed.cloudfunctions.net/api/prices');
    
    if (!res.ok) {
      throw new Error(`Google Storage returned ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    
    // Validate data structure
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid data structure from prices.json');
    }

    // Update cache
    pricesCache = data;
    cacheTimestamp = now;
    
    console.log(`✅ Successfully fetched ${Object.keys(data).length} symbols`);
    return data;
    
  } catch (err) {
    console.error('❌ Error fetching all prices:', err);
    
    // Return cached data even if expired
    if (pricesCache) {
      console.log('🔄 Using expired cache as fallback');
      return pricesCache;
    }
    
    return null;
  }
}

/**
 * Fetch price data for a specific symbol with full details
 */
export async function fetchPriceData(symbol: string): Promise<PriceData | null> {
  try {
    const mappedSymbol = SYMBOL_MAP[symbol] || symbol;
    
    // Use getAllPrices for better caching
    const allPrices = await fetchAllPrices();
    
    if (!allPrices || !allPrices[mappedSymbol]) {
      console.warn(`⚠️ Symbol '${mappedSymbol}' not found in prices data`);
      return null;
    }

    return allPrices[mappedSymbol];
    
  } catch (err) {
    console.error(`❌ Error fetching price data for ${symbol}:`, err);
    return null;
  }
}

/**
 * Fetch prices for multiple symbols at once
 */
export async function fetchMultiplePrices(symbols: string[]): Promise<Record<string, number | null>> {
  try {
    const allPrices = await fetchAllPrices();
    const results: Record<string, number | null> = {};

    for (const symbol of symbols) {
      const mappedSymbol = SYMBOL_MAP[symbol] || symbol;
      
      if (allPrices && allPrices[mappedSymbol] && typeof allPrices[mappedSymbol].price === 'number') {
        results[symbol] = allPrices[mappedSymbol].price;
      } else {
        results[symbol] = null;
      }
    }

    console.log(`✅ Fetched ${Object.values(results).filter(p => p !== null).length}/${symbols.length} prices`);
    return results;
    
  } catch (err) {
    console.error('❌ Error fetching multiple prices:', err);
    
    // Return null for all symbols on error
    const results: Record<string, number | null> = {};
    symbols.forEach(symbol => { results[symbol] = null; });
    return results;
  }
}

/**
 * Get available symbols from prices data
 */
export async function getAvailableSymbols(): Promise<string[]> {
  try {
    const allPrices = await fetchAllPrices();
    return allPrices ? Object.keys(allPrices) : [];
  } catch (err) {
    console.error('❌ Error getting available symbols:', err);
    return [];
  }
}

/**
 * Check if a symbol exists in the prices data
 */
export async function symbolExists(symbol: string): Promise<boolean> {
  try {
    const mappedSymbol = SYMBOL_MAP[symbol] || symbol;
    const allPrices = await fetchAllPrices();
    return !!(allPrices && allPrices[mappedSymbol]);
  } catch (err) {
    console.error(`❌ Error checking if symbol exists: ${symbol}`, err);
    return false;
  }
}

/**
 * Get the last update timestamp of prices data
 */
export async function getPricesLastUpdate(): Promise<number | null> {
  try {
    const allPrices = await fetchAllPrices();
    
    if (!allPrices) return null;
    
    // Find the latest timestamp among all symbols
    let latestTimestamp = 0;
    Object.values(allPrices).forEach(priceData => {
      if (priceData.timestamp > latestTimestamp) {
        latestTimestamp = priceData.timestamp;
      }
    });
    
    return latestTimestamp > 0 ? latestTimestamp : null;
    
  } catch (err) {
    console.error('❌ Error getting last update timestamp:', err);
    return null;
  }
}

/**
 * Clear the prices cache (useful for testing or manual refresh)
 */
export function clearPricesCache(): void {
  pricesCache = null;
  cacheTimestamp = 0;
  console.log('🧹 Prices cache cleared');
}

/**
 * Get cache status (useful for debugging)
 */
export function getCacheStatus(): { hasCache: boolean; isFresh: boolean; cacheAge: number } {
  const now = Date.now();
  const hasCache = !!pricesCache;
  const isFresh = hasCache && (now - cacheTimestamp < CACHE_DURATION);
  const cacheAge = hasCache ? Math.round((now - cacheTimestamp) / 1000) : 0;
  
  return { hasCache, isFresh, cacheAge };
}