// backend-lib/ad-config.ts

export type SymbolDef = {
  id: string;
  name: string;
  category: 'Forex' | 'Crypto' | 'Metals' | 'Indices' | 'Energy' | 'Robots';
};

export const AD_SYMBOLS: SymbolDef[] = [
  { id: 'EURUSD', name: 'EUR/USD', category: 'Forex' },
  { id: 'GBPUSD', name: 'GBP/USD', category: 'Forex' },
  { id: 'XAUUSD', name: 'Gold (XAU/USD)', category: 'Metals' },
  { id: 'BTCUSD', name: 'Bitcoin (BTC)', category: 'Crypto' },
  { id: 'ETHUSD', name: 'Ethereum (ETH)', category: 'Crypto' },
  { id: 'US500', name: 'S&P 500 Index', category: 'Indices' },
  { id: 'USTEC', name: 'Nasdaq 100', category: 'Indices' },
  { id: 'BRENT', name: 'Crude Oil (Brent)', category: 'Energy' },
 
];

export const LANDING_HOST = 'https://mzprimer.com';

/**
 * CSV Utility: Properly escapes values for Catalog CSV standards
 */
export function csvEscape(value: string): string {
  const v = (value || '').toString();
  if (v.includes('"') || v.includes(',') || v.includes('\n')) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return `"${v}"`;
}