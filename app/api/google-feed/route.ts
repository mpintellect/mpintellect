import { NextResponse } from 'next/server';

const SYMBOLS = [
  { id: 'BTCUSD', name: 'Bitcoin', type: 'Crypto' },
  { id: 'ETHUSD', name: 'Ethereum', type: 'Crypto' },
  { id: 'XAUUSD', name: 'Gold', type: 'Commodity' },
  { id: 'EURUSD', name: 'EUR/USD', type: 'Forex' },
  { id: 'GBPUSD', name: 'GBP/USD', type: 'Forex' },
  { id: 'USDJPY', name: 'USD/JPY', type: 'Forex' },
  { id: 'US500', name: 'S&P 500', type: 'Indices' },
  { id: 'USTEC', name: 'Nasdaq', type: 'Indices' },
  // Add all 28 symbols...
];

export async function GET() {
  const baseUrl = 'https://mzprimer.com'; // 🛑 CHANGE TO PROD DOMAIN

  // 1. CACHE BUSTER (Changes every 4 hours)
  // Google only updates if the URL changes. This forces the update.
  const date = new Date();
  const timeBlock = Math.floor(date.getHours() / 4); 
  const cacheKey = `${date.toISOString().split('T')[0]}_H${timeBlock}`; 

  // Google Custom Feed Headers
  const header = [
    'ID', 
    'Item title', 
    'Final URL', 
    'Image URL', 
    'Item description', 
    'Price'
  ].join(',');

  let rows: string[] = [];

  SYMBOLS.forEach((sym) => {
    // 2. Generate the Google-Specific Image URL
    // We add the ?v=cacheKey so Google thinks it's a new file
    const imageUrl = `${baseUrl}/api/og-google?symbol=${sym.id}&v=${cacheKey}`;
    
    // 3. Landing Page
    const landingPage = `${baseUrl}/trade/${sym.id.toLowerCase()}`;

    rows.push([
      `${sym.id}`,                                      // ID (Must match pixel)
      `"${sym.name} AI Analysis"`,                      // Title
      `${landingPage}`,                                 // URL
      `${imageUrl}`,                                    // Image
      `"Live AI Entry & Stop Loss for ${sym.name}"`,    // Description
      '4.50 EUR'                                        // Price
    ].join(','));
  });

  return new NextResponse(`${header}\n${rows.join('\n')}`, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="google_ads_live.csv"',
    },
  });
}