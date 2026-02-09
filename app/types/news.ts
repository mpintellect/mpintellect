export interface NewsItem {
  id: string;
  headline: string;
  content: string;
  category: string;
  symbols: string;
  symbol?: string;
  timestamp: string;
  impactScore: number;
  sentimentScore: number;
  volatility: number;
  url?: string;
}

export const SYMBOL_CATEGORIES = [
  { value: 'ALL', label: 'All Markets' },
  { value: 'FOREX', label: 'Forex' },
  { value: 'CRYPTO', label: 'Crypto' },
  { value: 'METALS', label: 'Metals' },
  { value: 'INDICES', label: 'Indices' },
  { value: 'COMMODITIES', label: 'Commodities' },
  { value: 'STOCKS', label: 'Stocks' },
  { value: 'BONDS', label: 'Bonds' },
] as const;

export type CategoryValue = typeof SYMBOL_CATEGORIES[number]['value'];