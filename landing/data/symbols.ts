// data/symbols.ts

export const SYMBOLS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD", "NZDUSD", "USDCHF",
  "XAUUSD", "XAUEUR", "XAGUSD", "PLATINUM", "BRENT",
  "BTCUSD", "ETHUSD", "XRPUSD", "DOGEUSD", "LTCUSD",
  "US500", "USTEC", "US30", "HK50", "FRANCE40",
  "CHINA50", "UK100", "EURJPY", "EURGBP", "GBPJPY", "GBPCHF"
] as const;

export type SymbolKey = typeof SYMBOLS[number];

export const DISPLAY_NAMES: Record<SymbolKey, string> = {
  EURUSD: "EUR/USD (Euro / US Dollar)",
  GBPUSD: "GBP/USD (British Pound / US Dollar)",
  USDJPY: "USD/JPY (US Dollar / Japanese Yen)",
  USDCAD: "USD/CAD (US Dollar / Canadian Dollar)",
  AUDUSD: "AUD/USD (Australian Dollar / US Dollar)",
  NZDUSD: "NZD/USD (New Zealand Dollar / US Dollar)",
  USDCHF: "USD/CHF (US Dollar / Swiss Franc)",
  XAUUSD: "XAU/USD (Gold / US Dollar)",
  XAUEUR: "XAU/EUR (Gold / Euro)",
  XAGUSD: "XAG/USD (Silver / US Dollar)",
  PLATINUM: "XPT/USD (Platinum / US Dollar)",
  BRENT: "US Crude Oil",
  BTCUSD: "BTC/USD (Bitcoin / US Dollar)",
  ETHUSD: "ETH/USD (Ethereum / US Dollar)",
  XRPUSD: "XRP/USD (Ripple / US Dollar)",
  DOGEUSD: "DGE/USD (Dogecoin / US Dollar)",
  LTCUSD: "LTC/USD (Litecoin / US Dollar)",
  US500: "S&P 500 Index (US)",
  USTEC: "NASDAQ 100 Index (US)",
  US30: "Dow Jones 30 Index (US).com Inc.",
  HK50: "Hong Kong 50 stock index Index (Europe) PLC",
  FRANCE40: "FRANCE40 Index (France)",
  CHINA50: "GER40 Index (DAX)",
  UK100: "UK100 Index (FTSE)",
  EURJPY: "EUR/JPY (Euro / Japanese Yen)",
  EURGBP: "EUR/GBP (Euro / British Pound)",
  GBPJPY: "GBP/JPY (British Pound / Japanese Yen)",
  GBPCHF: "GBP/CHF (British Pound / Swiss Franc)"
};

export const CONTRACT_SIZES: Record<SymbolKey, { contract: number; pip: number }> = {
  // === Forex Pairs ===
  EURUSD:  { contract: 100000, pip: 0.0001 },
  GBPUSD:  { contract: 100000, pip: 0.0001 },
  USDJPY:  { contract: 100000, pip: 0.01 },
  USDCAD:  { contract: 100000, pip: 0.0001 },
  AUDUSD:  { contract: 100000, pip: 0.0001 },
  NZDUSD:  { contract: 100000, pip: 0.0001 },
  USDCHF:  { contract: 100000, pip: 0.0001 },
  EURJPY:  { contract: 100000, pip: 0.01 },
  EURGBP:  { contract: 100000, pip: 0.0001 },
  GBPJPY:  { contract: 100000, pip: 0.01 },
  GBPCHF:  { contract: 100000, pip: 0.0001 },

  // === Commodities ===
  XAUUSD:  { contract: 100, pip: 0.1 },    // Gold vs USD
  XAUEUR:  { contract: 100, pip: 0.1 },    // Gold vs EUR
  XAGUSD:  { contract: 5000, pip: 0.01 },  // Silver
  PLATINUM:  { contract: 100, pip: 0.1 },    // Platinum
  BRENT: { contract: 1000, pip: 0.01 },  // US Crude Oil

  // === Cryptocurrencies ===
  BTCUSD:  { contract: 1, pip: 0.5 },
  ETHUSD:  { contract: 1, pip: 0.1 },
  XRPUSD:  { contract: 1000, pip: 0.0001 },  // Usually traded in 1000-lot
  DOGEUSD:  { contract: 1000, pip: 0.0001 },  // Dogecoin
  LTCUSD:  { contract: 1, pip: 0.01 },

  // === Indices ===
  US500:     { contract: 10, pip: 0.1 },    // S&P 500
  USTEC:      { contract: 10, pip: 0.1 },    // NASDAQ 100
  US30:      { contract: 10, pip: 1 },      // Dow Jones 30
  HK50:    { contract: 10, pip: 1 },      // Hong Kong 50 stock index
  FRANCE40:     { contract: 10, pip: 1 },      // FRANCE40 (France)
  CHINA50:    { contract: 10, pip: 1 },      // CHINA50 (Germany)
  UK100:    { contract: 10, pip: 1 }       // FTSE 100 (UK)
};