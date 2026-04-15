// backend-lib/ad-config.ts

export type SymbolDef = {
  id: string;
  name: string;
  category: 'Forex' | 'Crypto' | 'Metals' | 'Indices' | 'Energy' | 'Robots';
};

export const AD_SYMBOLS: SymbolDef[] = [
  { id: 'EURUSD', name: 'EUR/USD', category: 'Forex' },
  { id: 'XAUUSD', name: 'Gold (XAU/USD)', category: 'Metals' },
  { id: 'BTCUSD', name: 'Bitcoin (BTC)', category: 'Crypto' },
  { id: 'ETHUSD', name: 'Ethereum (ETH)', category: 'Crypto' },
  { id: 'BRENT', name: 'Crude Oil (Brent)', category: 'Energy' },
 
];

export const LANDING_HOST = 'https://mpintellect.com';

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