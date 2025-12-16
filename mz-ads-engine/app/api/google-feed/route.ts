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
  
  // 🚀 CUSTOM DATE FORMAT: YYYY-DD-MM_HH
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, '0');
  const hour = now.getHours();

  // RESULT: "2025-15-12_H14" (Year-Day-Month)
  const CACHE_VERSION = `${year}-${day}-${month}_H${hour}`;

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
    
    // 1. Construct Image URL using your Custom Date Format
    const imageUrl = `${BASE_URL}/api/og-google?symbol=${sym.id}&size=standard&theme=professional&v=${CACHE_VERSION}`;
    
    // 2. Landing Page
    const landingPage = `https://mzprimer.com/trade/${sym.id.toLowerCase()}`;

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
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="google_ads_live.csv"',
      // Prevent browser caching
      // ✅ CORS
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      
      // ✅ SMART CACHING
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}