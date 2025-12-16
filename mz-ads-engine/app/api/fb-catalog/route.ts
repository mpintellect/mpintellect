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
  
  
  // Metals
  { id: 'XAUUSD', name: 'Gold (XAU/USD)', type: 'Commodity' },
  { id: 'XAUEUR', name: 'Gold/EUR', type: 'Commodity' },
  
  
  // Energy
  { id: 'BRENT', name: 'Crude Oil (Brent)', type: 'Commodity' },
  
  // Crypto
  { id: 'BTCUSD', name: 'Bitcoin (BTC)', type: 'Crypto' },
  { id: 'ETHUSD', name: 'Ethereum (ETH)', type: 'Crypto' },
  { id: 'XRPUSD', name: 'Ripple (XRP)', type: 'Crypto' },
  
  
  // Indices
  { id: 'US500', name: 'S&P 500', type: 'Indices' },
  { id: 'USTEC', name: 'NASDAQ 100', type: 'Indices' },
  { id: 'US30', name: 'Dow Jones 30', type: 'Indices' },
  
];

// 🛑 CONFIG: SEPARATE HOSTS
const IMAGE_HOST = 'https://mz-ads-engine.netlify.app'; // Netlify (Images)
const LANDING_HOST = 'https://mzprimer.com';            // Vercel (Links)

function csvEscape(value: string): string {
  const v = value ?? '';
  if (v.includes('"') || v.includes(',') || v.includes('\n')) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return `"${v}"`;
}

export async function GET() {
  
  // 🚀 CACHE BUSTER: Updates every hour
  const now = Date.now();
  const HOURLY_ID = Math.floor(now / 3600000); 
  const LIVE_VERSION = `v${HOURLY_ID}`;

  const header = [
    'id', 'title', 'description', 'availability', 'condition', 
    'price', 'link', 'image_link', 'brand', 
    'google_product_category', 'custom_label_0', 'custom_label_1',
  ].map(csvEscape).join(',');

  const rows: string[] = [];

  for (const sym of SYMBOLS) {
    const symbolLower = sym.id.toLowerCase();

    // 1. CHAT PRODUCT
    rows.push([
      `${sym.id}-CHAT`,
      `${sym.name} Analysis`,
      `Interactive AI Trading Assistant for ${sym.name}.`,
      'in stock', 'new', '0.00 EUR',
      `${LANDING_HOST}/AIChat?symbol=${sym.id}&source=fb_ad&auto_start=true`,
      `${IMAGE_HOST}/api/og?symbol=${sym.id}&type=CHAT&v=${LIVE_VERSION}`,
      'MZPrimer AI', 'Software > Business & Productivity', sym.type, 'Lead_Gen'
    ].map(csvEscape).join(','));

    // 2. TARGETS PRODUCT
    rows.push([
      `${sym.id}-SETUP`,
      `${sym.name}`,
      `Structured Entry, Stop Loss and Take Profit zones for ${sym.name}.`,
      'in stock', 'new', '4.50 EUR',
      `${LANDING_HOST}/trade/${symbolLower}`,
      `${IMAGE_HOST}/api/og?symbol=${sym.id}&type=TARGETS&v=${LIVE_VERSION}`,
      'MZPrimer Data', 'Software > Business & Productivity', sym.type, 'Strategy_Tool'
    ].map(csvEscape).join(','));

    // 3. RISK PRODUCT
    rows.push([
      `${sym.id}-RISK`,
      `${sym.name}`,
      `Volatility-adjusted risk calculator for ${sym.name}.`,
      'in stock', 'new', '4.50 EUR',
      `${LANDING_HOST}/calculator/${symbolLower}`,
      `${IMAGE_HOST}/api/og?symbol=${sym.id}&type=RISK&v=${LIVE_VERSION}`,
      'MZPrimer Tools', 'Software > Business & Productivity', sym.type, 'Utility_Tool'
    ].map(csvEscape).join(','));
  }

  return new NextResponse(`${header}\n${rows.join('\n')}`, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="mzprimer_catalog.csv"',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}