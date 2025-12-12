import { NextResponse } from 'next/server';

type SymbolDef = {
  id: string;
  name: string;
  type: 'Crypto' | 'Commodity' | 'Forex' | 'Indices';
};

// 1. CONFIG: Your Symbols List
const SYMBOLS: SymbolDef[] = [
  // Forex
  { id: 'EURUSD', name: 'EUR/USD', type: 'Forex' },
  { id: 'GBPUSD', name: 'GBP/USD', type: 'Forex' },
  { id: 'USDJPY', name: 'USD/JPY', type: 'Forex' },
  { id: 'USDCAD', name: 'USD/CAD', type: 'Forex' },
  { id: 'AUDUSD', name: 'AUD/USD', type: 'Forex' },
  { id: 'NZDUSD', name: 'NZD/USD', type: 'Forex' },
  { id: 'USDCHF', name: 'USD/CHF', type: 'Forex' },
  { id: 'EURJPY', name: 'EUR/JPY', type: 'Forex' },
  { id: 'EURGBP', name: 'EUR/GBP', type: 'Forex' },
  { id: 'GBPJPY', name: 'GBP/JPY', type: 'Forex' },
  { id: 'GBPCHF', name: 'GBP/CHF', type: 'Forex' },
  
  // Metals
  { id: 'XAUUSD', name: 'Gold (XAU/USD)', type: 'Commodity' },
  { id: 'XAUEUR', name: 'Gold/EUR', type: 'Commodity' },
  { id: 'XAGUSD', name: 'Silver (XAG/USD)', type: 'Commodity' },
  { id: 'PLATINUM', name: 'Platinum', type: 'Commodity' },
  
  // Energy
  { id: 'BRENT', name: 'Crude Oil (Brent)', type: 'Commodity' },
  
  // Crypto
  { id: 'BTCUSD', name: 'Bitcoin (BTC)', type: 'Crypto' },
  { id: 'ETHUSD', name: 'Ethereum (ETH)', type: 'Crypto' },
  { id: 'XRPUSD', name: 'Ripple (XRP)', type: 'Crypto' },
  { id: 'LTCUSD', name: 'Litecoin (LTC)', type: 'Crypto' },
  { id: 'DOGEUSD', name: 'Dogecoin', type: 'Crypto' },
  
  // Indices
  { id: 'US500', name: 'S&P 500', type: 'Indices' },
  { id: 'USTEC', name: 'NASDAQ 100', type: 'Indices' },
  { id: 'US30', name: 'Dow Jones 30', type: 'Indices' },
  { id: 'HK50', name: 'Hong Kong 50', type: 'Indices' },
  { id: 'FRANCE40', name: 'CAC 40', type: 'Indices' },
  { id: 'CHINA50', name: 'FTSE China A50', type: 'Indices' },
  { id: 'UK100', name: 'FTSE 100', type: 'Indices' },
];

const BASE_URL = 'https://mzprimer.com'; // ✅ use your live domain

// Simple CSV escape: wrap in quotes and escape inner quotes
function csvEscape(value: string): string {
  const v = value ?? '';
  if (v.includes('"') || v.includes(',') || v.includes('\n')) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  // Still wrap everything in quotes for safety & consistency
  return `"${v}"`;
}

export async function GET() {
  // Facebook Catalog CSV header
  const header = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'link',
    'image_link',
    'brand',
    'google_product_category',
    'custom_label_0',
    'custom_label_1',
  ]
    .map(csvEscape)
    .join(',');

  const rows: string[] = [];

  for (const sym of SYMBOLS) {
    const symbolLower = sym.id.toLowerCase();

    // --- PRODUCT 1: AI CHAT (Lead Gen / Free Trial) ---
    rows.push(
      [
        `${sym.id}-CHAT`,
        `${sym.name} Analysis`,
        `Interactive AI Trading Assistant for ${sym.name}. Instant lot size, risk and basic scenario suggestions. Includes 2 free trials.`,
        'in stock',
        'new',
        '0.00 EUR',
        `${BASE_URL}/AIChat?symbol=${sym.id}&source=fb_ad`,
        `${BASE_URL}/api/og?symbol=${sym.id}&type=CHAT`,
        'MZPrimer AI',
        'Software > Business & Productivity',
        sym.type,
        'Lead_Gen',
      ]
        .map(csvEscape)
        .join(',')
    );

    // --- PRODUCT 2: TARGETS / SETUP (Upsell / Strategy Tool) ---
    rows.push(
      [
        `${sym.id}-SETUP`,
        `${sym.name}`,
        `Structured Entry, Stop Loss and Take Profit zones for ${sym.name}. Designed for disciplined trade planning.`,
        'in stock',
        'new',
        '4.50 EUR',
        `${BASE_URL}/trade/${symbolLower}`,
        `${BASE_URL}/api/og?symbol=${sym.id}&type=TARGETS`,
        'MZPrimer Data',
        'Software > Business & Productivity',
        sym.type,
        'Strategy_Tool',
      ]
        .map(csvEscape)
        .join(',')
    );

    // --- PRODUCT 3: RISK ENGINE (Utility / Calculator) ---
    rows.push(
      [
        `${sym.id}-RISK`,
        `${sym.name}`,
        `Volatility-adjusted risk calculator for ${sym.name}. Helps you size positions and place stop loss levels with clear risk visibility.`,
        'in stock',
        'new',
        '4.50 EUR',
        `${BASE_URL}/calculator/${symbolLower}`,
        `${BASE_URL}/api/og?symbol=${sym.id}&type=RISK`,
        'MZPrimer Tools',
        'Software > Business & Productivity',
        sym.type,
        'Utility_Tool',
      ]
        .map(csvEscape)
        .join(',')
    );
  }

  const csvContent = `${header}\n${rows.join('\n')}`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="mzprimer_catalog.csv"',
    },
  });
}