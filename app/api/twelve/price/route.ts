// app/api/twelve/price/route.ts
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return new Response(JSON.stringify({ error: 'Symbol is required' }), { status: 400 });
  }

  const API_KEY = process.env.TWELVEDATA_API_KEY;

  const symbolMap: Record<string, string> = {
    EURUSD: 'EUR/USD',
    GBPUSD: 'GBP/USD',
    USDJPY: 'USD/JPY',
    USDCAD: 'USD/CAD',
    AUDUSD: 'AUD/USD',
    NZDUSD: 'NZD/USD',
    USDCHF: 'USD/CHF',
    XAUUSD: 'XAU/USD',
    XAUEUR: 'XAU/EUR',
    XAGUSD: 'XAG/USD',
    BTCUSD: 'BTC/USD',
    ETHUSD: 'ETH/USD',
    GER40:  'GER40',
    US30:   'US30',
    US100:  'US100',
  };

  const mappedSymbol = symbolMap[symbol] || symbol;

  try {
    const res = await fetch(`https://api.twelvedata.com/price?symbol=${mappedSymbol}&apikey=${API_KEY}`);
    const data = await res.json();
console.log("🔍 Response from TwelveData:", data); // ADD THIS
    if (!data?.price) {
      return new Response(JSON.stringify({ error: 'Price not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ price: parseFloat(data.price) }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch price' }), { status: 500 });
  }
}