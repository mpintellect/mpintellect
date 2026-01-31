// functions/api/price.ts (Move from app/api/price/route.ts)

/**
 * Cloudflare Handler: onRequestGet
 * Fetches price data from R2 storage
 */
export async function onRequestGet(context: any) {
  // FIXED: Destructure 'request' from 'context' so the variable is defined
  const { request } = context;

  try {
    // Standard URL parsing using the extracted request object
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return Response.json({ error: "Symbol parameter required" }, { status: 400 });
    }

    console.log('🚀 Price API (R2) called for symbol:', symbol);
    
    // ✅ NEW CLOUDFLARE R2 URL
    const R2_URL = 'https://data.mzprimer.com/prices.json';
    
    // Cloudflare native fetch
    // Note: 'next: {revalidate}' is Next.js specific. 
    // In Cloudflare, we use 'cf: {cacheTtl: 60}' for internal caching.
    const response = await fetch(R2_URL, {
        cf: { cacheTtl: 60 } 
    } as any);
    
    if (!response.ok) {
      throw new Error(`Cloudflare R2 returned ${response.status}`);
    }

    const data: any = await response.json();
    const symbolData = data[symbol];
    
    if (!symbolData || typeof symbolData.price !== 'number') {
      console.warn(`⚠️ Symbol '${symbol}' not found in R2 prices.json`);
      return Response.json({ error: "Symbol not found or invalid price" }, { status: 404 });
    }

    // Return the data exactly as the frontend expects it
    return Response.json({
      symbol,
      price: symbolData.price,
      decimals: symbolData.decimals,
      timestamp: symbolData.timestamp
    });

  } catch (error: any) {
    console.error('❌ Price API error:', error);
    return Response.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}