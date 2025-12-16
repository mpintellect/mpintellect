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
  
  
  
  // Indices
  { id: 'US500', name: 'S&P 500', type: 'Indices' },
  { id: 'USTEC', name: 'NASDAQ 100', type: 'Indices' },
  { id: 'US30', name: 'Dow Jones 30', type: 'Indices' },
  
];

const BASE_URL = 'https://mz-ads-engine.netlify.app';

// Simple CSV escape helper
function csvEscape(value: string): string {
  const v = value ?? '';
  if (v.includes('"') || v.includes(',') || v.includes('\n')) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return `"${v}"`;
}

export async function GET() {
  // 🚀 FIXED DATE FORMAT: YYYY-MM-DD_HH
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = now.getHours();

  // RESULT: "2025-12-16_H12" (Correct Year-Month-Day format)
  const DATE_PREFIX = `${year}-${month}-${day}_H${hour}`;

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
    // 1. Create UNIQUE cache-buster for EACH symbol
    // Using timestamp ensures every symbol has different URL
    const uniqueCache = `${DATE_PREFIX}_${Date.now()}_${sym.id}`;
    
    // 2. Construct Image URL with unique cache-buster
    const imageUrl = `${BASE_URL}/api/og-google?symbol=${sym.id}&size=standard&theme=dark&v=${uniqueCache}`;
    
    // 3. Landing Page
    const landingPage = `https://mzprimer.com/trade/${sym.id.toLowerCase()}`;

    // 4. Ad Text
    const desc = `Live AI Technical Analysis for ${sym.name}. Entry, Stop Loss & Take Profit.`;

    rows.push([
      `${sym.id}`,
      `${sym.name} Forecast`,
      landingPage,
      imageUrl,
      desc,
      '4.50 EUR'
    ].map(csvEscape).join(','));
  }

  const csvContent = `${header}\n${rows.join('\n')}`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="google_ads_live.csv"',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}