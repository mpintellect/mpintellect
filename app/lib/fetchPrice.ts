// lib/fetchPrice.ts

// ✅ Custom mapping for indices and others
const SYMBOL_MAP: Record<string, string> = {
  EURUSD: 'EUR/USD',
  GBPUSD: 'GBP/USD',
  USDJPY: 'USD/JPY',
  USDCAD: 'USD/CAD',
  AUDUSD: 'AUD/USD',
  NZDUSD: 'NZD/USD',
  USDCHF: 'USD/CHF',
  XAUUSD: 'XAU/USD',
  XAUEUR: 'XAU/EUR',
  XAGUSD: 'XAG/USD',
  BTCUSD: 'BTC/USD',
  ETHUSD: 'ETH/USD',
  AAPL:   'AAPL',
  TSLA:   'TSLA',
  AMZN:   'AMZN',
};

export async function fetchCurrentPrice(symbol: string): Promise<number | null> {
  try {
    const mappedSymbol = SYMBOL_MAP[symbol] || symbol;

    const res = await fetch(`/api/twelve/price?symbol=${encodeURIComponent(mappedSymbol)}`);
    const data = await res.json();

    return typeof data.price === 'number' ? data.price : null;
  } catch (error) {
    console.error('Error fetching current price:', error);
    return null;
  }
}