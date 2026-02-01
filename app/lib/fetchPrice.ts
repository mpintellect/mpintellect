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

// Cache for prices (client-side only)
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
    
    // Use API route instead of direct R2 call
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
 * Fetch all prices from R2 (Server-side only)
 */
export async function fetchAllPrices(): Promise<AllPricesData | null> {
  try {
    // Check cache first (client-side only)
    if (typeof window !== 'undefined') {
      const now = Date.now();
      if (pricesCache && (now - cacheTimestamp < CACHE_DURATION)) {
        console.log('📊 Returning cached prices data');
        return pricesCache;
      }
    }

    console.log('🔄 Cache miss - fetching fresh prices data from R2...');
    
    // ✅ CLOUDFLARE R2 URL - Update with your actual URL
    const R2_PUBLIC_URL = 'https://your-r2-domain.com/prices.json'; 
    
    const res = await fetch(R2_PUBLIC_URL, {
      // Cloudflare-compatible cache headers
      headers: {
        'Cache-Control': 'public, max-age=120, s-maxage=120', // 2 minute cache
      },
      // Remove Next.js-specific options
      // next: { revalidate: 300 } // ❌ REMOVE THIS
    });
    
    if (!res.ok) {
      throw new Error(`Cloudflare R2 returned ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    
    // Validate data structure
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid data structure from prices.json');
    }

    // Update cache (client-side only)
    if (typeof window !== 'undefined') {
      pricesCache = data;
      cacheTimestamp = Date.now();
    }
    
    console.log(`✅ Successfully fetched ${Object.keys(data).length} symbols from R2`);
    return data;
    
  } catch (err) {
    console.error('❌ Error fetching all prices from R2:', err);
    
    // Return cached data even if expired (client-side only)
    if (typeof window !== 'undefined' && pricesCache) {
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
    
    // For client-side, use the API
    if (typeof window !== 'undefined') {
      const res = await fetch(`/api/price-data?symbol=${encodeURIComponent(mappedSymbol)}`);
      if (!res.ok) return null;
      return await res.json();
    }
    
    // For server-side, use getAllPrices
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
    // For client-side, use batch API endpoint
    if (typeof window !== 'undefined') {
      const res = await fetch(`/api/batch-prices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols }),
      });
      if (!res.ok) return {};
      const data = await res.json();
      
      const results: Record<string, number | null> = {};
      symbols.forEach(symbol => {
        results[symbol] = data[symbol] || null;
      });
      return results;
    }
    
    // Server-side: fetch all and filter
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
    
    // For client-side, use API
    if (typeof window !== 'undefined') {
      const res = await fetch(`/api/symbol-exists?symbol=${encodeURIComponent(mappedSymbol)}`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.exists || false;
    }
    
    // Server-side: check in allPrices
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
    // For client-side, use API
    if (typeof window !== 'undefined') {
      const res = await fetch(`/api/prices-last-update`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.timestamp || null;
    }
    
    // Server-side: calculate from data
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
 * Clear the prices cache (client-side only)
 */
export function clearPricesCache(): void {
  if (typeof window === 'undefined') return;
  
  pricesCache = null;
  cacheTimestamp = 0;
  console.log('🧹 Prices cache cleared');
}

/**
 * Get cache status (client-side only)
 */
export function getCacheStatus(): { hasCache: boolean; isFresh: boolean; cacheAge: number } {
  if (typeof window === 'undefined') {
    return { hasCache: false, isFresh: false, cacheAge: 0 };
  }
  
  const now = Date.now();
  const hasCache = !!pricesCache;
  const isFresh = hasCache && (now - cacheTimestamp < CACHE_DURATION);
  const cacheAge = hasCache ? Math.round((now - cacheTimestamp) / 1000) : 0;
  
  return { hasCache, isFresh, cacheAge };
}

// ==========================================
// NEW: Client-side specific functions
// ==========================================

/**
 * Client-side only: Fetch prices with caching
 */
export async function fetchPricesClient(): Promise<AllPricesData | null> {
  if (typeof window === 'undefined') {
    throw new Error('fetchPricesClient can only be called on the client');
  }
  
  try {
    const now = Date.now();
    if (pricesCache && (now - cacheTimestamp < CACHE_DURATION)) {
      return pricesCache;
    }
    
    const res = await fetch('/api/prices');
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    
    const data = await res.json();
    pricesCache = data;
    cacheTimestamp = now;
    
    return data;
  } catch (error) {
    console.error('Error fetching prices on client:', error);
    return pricesCache; // Return stale cache if available
  }
}

/**
 * Client-side only: Fetch single price
 */
export async function fetchPriceClient(symbol: string): Promise<number | null> {
  if (typeof window === 'undefined') {
    throw new Error('fetchPriceClient can only be called on the client');
  }
  
  try {
    const res = await fetch(`/api/price-client?symbol=${encodeURIComponent(symbol)}`);
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.price;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}