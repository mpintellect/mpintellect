// functions/api/data-proxy.ts

export async function onRequestGet(context: any) {
  const { request } = context;
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  const HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (!symbol) {
    return new Response(JSON.stringify({ error: 'Symbol parameter is required' }), {
      status: 400,
      headers: HEADERS,
    });
  }

  try {
    // 1. Clean symbol (e.g. BTC-USD -> BTCUSD)
    const cleanSymbol = symbol.replace(/[-_/]/g, "").toUpperCase();
    
    // 2. Construct R2 URL
    const R2_URL = "https://data.mpintellect.com";
    const r2Url = `${R2_URL}/output_${cleanSymbol}.json`;
    
    console.log(`[API Proxy] Fetching from R2: ${r2Url}`);

    // 3. Fetch from R2 with Cloudflare Edge Caching
    const response = await fetch(r2Url, {
      // @ts-ignore - Cloudflare native caching flag
      cf: {
        cacheTtl: 300, // 5 minutes
        cacheEverything: true,
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ error: `Setup for ${cleanSymbol} not found in R2` }),
          { status: 404, headers: HEADERS }
        );
      }
      return new Response(
        JSON.stringify({ error: 'R2 storage error', status: response.status }),
        { status: 502, headers: HEADERS }
      );
    }

    const data = await response.json();
    
    // 4. Return with Professional Cache Headers
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...HEADERS,
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });

  } catch (error: any) {
    console.error('[API Error]:', error.message);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: HEADERS,
    });
  }
}