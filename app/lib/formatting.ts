// lib/formatting.ts
const SYMBOL_SPECS: Record<string, { pip: number; contract: number; decimals: number }> = {
  // Forex (Standard Lot = 100,000 units)
  "EURUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "GBPUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "USDJPY": { pip: 0.01, contract: 100000, decimals: 3 },
  "USDCAD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "AUDUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "NZDUSD": { pip: 0.0001, contract: 100000, decimals: 5 },
  "USDCHF": { pip: 0.0001, contract: 100000, decimals: 5 },
  "EURJPY": { pip: 0.01, contract: 100000, decimals: 3 },
  "EURGBP": { pip: 0.0001, contract: 100000, decimals: 5 },
  "GBPJPY": { pip: 0.01, contract: 100000, decimals: 3 },
  "GBPCHF": { pip: 0.0001, contract: 100000, decimals: 5 },

  // Metals
  "XAUUSD": { pip: 0.01, contract: 100, decimals: 2 }, 
  "XAUEUR": { pip: 0.01, contract: 100, decimals: 2 },
  "XAGUSD": { pip: 0.001, contract: 5000, decimals: 3 },
  "PLATINUM": { pip: 0.01, contract: 100, decimals: 2 },

  // Energy
  "BRENT": { pip: 0.01, contract: 1000, decimals: 2 },

  // Crypto
  "BTCUSD": { pip: 1.0, contract: 1, decimals: 1 },
  "ETHUSD": { pip: 0.1, contract: 1, decimals: 2 },
  "XRPUSD": { pip: 0.0001, contract: 1000, decimals: 4 },
  "LTCUSD": { pip: 0.01, contract: 10, decimals: 2 },
  "DOGEUSD": { pip: 0.0001, contract: 1000, decimals: 4 },

  // Indices
  "US500": { pip: 0.1, contract: 1, decimals: 2 },
  "USTEC": { pip: 0.1, contract: 1, decimals: 2 },
  "US30": { pip: 1.0, contract: 1, decimals: 1 },
  "HK50": { pip: 0.1, contract: 1, decimals: 2 },
  "FRANCE40": { pip: 0.1, contract: 1, decimals: 2 },
  "CHINA50": { pip: 0.1, contract: 1, decimals: 1 },
  "UK100": { pip: 0.1, contract: 1, decimals: 1 },
};

export function formatPriceForSymbol(symbol: string, price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) {
    return "----";
  }
  
  // Clean symbol string (e.g., "btc-usd" -> "BTCUSD")
  const cleanSymbol = symbol.replace(/[-_/]/g, "").toUpperCase();
  const spec = SYMBOL_SPECS[cleanSymbol];
  
  if (!spec) {
    // Fallback: default to 5 decimals for unknown symbols
    return price.toFixed(5);
  }
  
  // Use the exact decimal places from spec
  return price.toFixed(spec.decimals);
}

export function getSymbolDecimals(symbol: string): number {
  const cleanSymbol = symbol.replace(/[-_/]/g, "").toUpperCase();
  const spec = SYMBOL_SPECS[cleanSymbol];
  return spec?.decimals || 5; // Default to 5 if not found
}