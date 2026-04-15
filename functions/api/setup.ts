// functions/api/setup.ts (Move from app/api/setup/route.ts)

/**
 * Cloudflare Handler: onRequestGet
 * Fetches specific symbol setup data from R2 storage
 */
export async function onRequestGet(context: any) {
  // FIXED: Destructure 'request' from 'context' so it's defined
  const { request } = context;

  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return Response.json({ error: "Symbol parameter required" }, { status: 400 });
    }

    // Clean the symbol to match your file names (output_BTCUSD.json)
    const cleanSymbol = symbol.replace(/[-_/]/g, "").toUpperCase();
    console.log('🚀 Setup API (R2) called for symbol:', cleanSymbol);
    
    // ✅ NEW CLOUDFLARE R2 URL
    const R2_URL = 'https://data.mpintellect.com';
    const fileUrl = `${R2_URL}/output_${cleanSymbol}.json`;
    
    console.log('📡 Fetching from R2:', fileUrl);
    
    const response = await fetch(fileUrl, {
      headers: { 'Accept': 'application/json' },
      // FIXED: 'next: { revalidate }' changed to Cloudflare native 'cf: { cacheTtl }'
      cf: { cacheTtl: 60 }
    } as any);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`❌ Symbol file 'output_${cleanSymbol}.json' not found in R2`);
        return Response.json({ error: "Symbol setup not found" }, { status: 404 });
      }
      throw new Error(`Cloudflare R2 returned ${response.status}`);
    }

    const symbolData = await response.json();
    
    console.log(`✅ Successfully fetched setup for ${cleanSymbol} from R2`);
    
    // Return with Cache-Control so the browser/Cloudflare Edge helps with the load
    return Response.json(symbolData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        'Content-Type': 'application/json'
      },
    });

  } catch (error: any) {
    console.error('❌ Setup API error:', error);
    return Response.json(
      { error: "Failed to fetch setup data" },
      { status: 500 }
    );
  }
}