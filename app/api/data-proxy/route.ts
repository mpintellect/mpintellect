export const runtime = 'edge';
export const maxDuration = 5;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol parameter is required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Clean symbol (e.g. BTC-USD -> BTCUSD)
    const cleanSymbol = symbol.replace(/[-_/]/g, "").toUpperCase();
    
    // ✅ NEW CLOUDFLARE R2 URL
    // Replace with your actual pub-xxxx.r2.dev link
    const R2_URL = "https://pub-9a73dba996664c48aaa24b679e1122a2.r2.dev";
    const r2Url = `${R2_URL}/output_${cleanSymbol}.json`;
    
    console.log(`[API Proxy] Fetching from R2: ${r2Url}`);

    // Fetch from Cloudflare R2 with Vercel's edge cache
    const response = await fetch(r2Url, {
      cache: 'force-cache',
      next: { revalidate: 300 } // 5 minutes cache (matches your upload cycle)
    });

    if (!response.ok) {
      if (response.status === 404) {
         return new Response(
            JSON.stringify({ error: `Setup for ${cleanSymbol} not found in R2` }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
      }
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch data from R2 storage',
          status: response.status 
        }),
        { 
          status: 502, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    
    // Return with strong caching headers to minimize R2 "Class B" operations
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'max-age=300',
      },
    });

  } catch (error) {
    console.error('[API Error]:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}