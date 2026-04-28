// functions/api/setup.ts
/**
 * Cloudflare Handler: onRequestGet
 * Fetches specific symbol setup data from R2 storage
 * Supports both Scalper (5min) and Day Trader (H1) strategies
 */
export async function onRequestGet(context: any) {
  const { request } = context;

  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const strategy = searchParams.get('strategy') || 'daytrader'; // Default to daytrader
    
    if (!symbol) {
      return Response.json({ error: "Symbol parameter required" }, { status: 400 });
    }

    // Clean the symbol to match your file names
    const cleanSymbol = symbol.replace(/[-_/]/g, "").toUpperCase();
    console.log('🚀 Setup API (R2) called for symbol:', cleanSymbol, 'strategy:', strategy);
    
    // ✅ SELECT CORRECT FILE BASED ON STRATEGY
    const R2_URL = 'https://data.mpintellect.com';
    let fileName: string;
    
    if (strategy === 'scalper') {
      fileName = `output_${cleanSymbol}.json`;      // Scalper (5min)
    } else {
      fileName = `D1_output_${cleanSymbol}.json`;   // Day Trader (H1)
    }
    
    const fileUrl = `${R2_URL}/${fileName}`;
    
    console.log('📡 Fetching from R2:', fileUrl);
    
    const response = await fetch(fileUrl, {
      headers: { 'Accept': 'application/json' },
      cf: { cacheTtl: 60 }
    } as any);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`❌ Symbol file '${fileName}' not found in R2`);
        return Response.json({ error: "Symbol setup not found" }, { status: 404 });
      }
      throw new Error(`Cloudflare R2 returned ${response.status}`);
    }

    const symbolData = await response.json();
    
    console.log(`✅ Successfully fetched ${strategy} setup for ${cleanSymbol} from R2`);
    
    // Add strategy info to response metadata
    const enrichedData = {
      ...symbolData,
      _metadata: {
        strategy: strategy,
        fetched_at: new Date().toISOString()
      }
    };
    
    return Response.json(enrichedData, {
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