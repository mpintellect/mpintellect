// app/api/data-proxy/route.ts
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

    // Clean symbol
    const cleanSymbol = symbol.replace(/[-_/]/g, "").toUpperCase();
    const gcsUrl = `https://storage.googleapis.com/mzprimer-data-store/output_${cleanSymbol}.json`;
    
    console.log(`[API] Fetching: ${gcsUrl}`);

    // Fetch from Google Cloud Storage with cache
    const response = await fetch(gcsUrl, {
      cache: 'force-cache',
      next: { revalidate: 300 } // 5 minutes cache
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch data from storage',
          status: response.status 
        }),
        { 
          status: 502, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    
    // Return with caching headers
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