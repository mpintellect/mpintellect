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
  { id: 'EURJPY', name: 'EUR/JPY', type: 'Forex' },
  { id: 'EURGBP', name: 'EUR/GBP', type: 'Forex' },
  { id: 'GBPJPY', name: 'GBP/JPY', type: 'Forex' },
  
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
const IMAGE_HOST = 'https://mz-ads-engine.netlify.app'; // Netlify
const LANDING_HOST = 'https://mzprimer.com';            // Vercel

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
  const CACHE_VERSION = `v${HOURLY_ID}`;

  // Google Custom Feed Headers
  const header = [
    'ID', 
    'Item title', 
    'Final URL', 
    'Image URL', 
    'Item description', 
    'Price'
  ].map(csvEscape).join(',');

  let rows: string[] = [];

  for (const sym of SYMBOLS) {
    // 1. Construct Image URL using Netlify + Dynamic Version
    const imageUrl = `${IMAGE_HOST}/api/og-google?symbol=${sym.id}&s=${CACHE_VERSION}`;
    
    // 2. Landing Page (Main Site)
    const landingPage = `${LANDING_HOST}/trade/${sym.id.toLowerCase()}`;

    // 3. Ad Text
    const desc = `Live AI Technical Analysis for ${sym.name}. Entry, Stop Loss & Take Profit.`;

    rows.push([
      `${sym.id}`,                                      // ID
      `"${sym.name} Forecast"`,                         // Title
      landingPage,                                      // Final URL
      imageUrl,                                         // Image URL (Live)
      `"${desc}"`,                                      // Description
      '4.50 EUR'                                        // Price
    ].map(csvEscape).join(','));
  }

  const csvContent = `${header}\n${rows.join('\n')}`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      // CSV
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="google_custom_feed.csv"',

      // CORS
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*",

      // 🔥 CRITICAL: Disable caching everywhere
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
      "Netlify-CDN-Cache-Control": "no-store",
    },
  });
}

// Preflight support (VERY IMPORTANT for ads crawlers)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}