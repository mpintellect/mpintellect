// functions/api/symbol-data.ts (Move from app/api/symbol-data/route.ts)

import { getSymbolData } from '../../app/lib/fetchData';

/**
 * Cloudflare Handler: onRequestGet
 * Fetches historical and technical data for a specific symbol
 */
export async function onRequestGet(context: any) {
  // FIXED: Destructure 'request' from 'context' so the variable is defined
  const { request } = context;

  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return Response.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    // Fetch data using your existing fetchData.ts function
    // Ensure app/lib/fetchData.ts does not use 'fs' (filesystem)
    const data = await getSymbolData(symbol);

    if (!data) {
      return Response.json(
        { error: `No data found for symbol: ${symbol}` },
        { status: 404 }
      );
    }

    // Return the data with Edge Caching headers
    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        'Content-Type': 'application/json'
      },
    });

  } catch (error: any) {
    console.error('API error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}