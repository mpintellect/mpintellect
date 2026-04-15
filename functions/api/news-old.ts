// functions/api/news.ts

/**
 * GET: Fetches the central news feed from R2.
 * This acts as the "Source of Truth" for the Ticker and the Polls.
 */
export async function onRequestGet(context: any) {
  const { env } = context;

  try {
    // 1. Target the R2 JSON feed
    const R2_NEWS_URL = "https://data.mpintellect.com/news-old.json";
    
    // 2. Use a cache-buster based on the minute to prevent over-fetching 
    // but keep data fresh.
    const cacheBuster = Math.floor(Date.now() / 60000); 
    const url = `${R2_NEWS_URL}?v=${cacheBuster}`;

    const res = await fetch(url, {
      headers: { 
        'Accept': 'application/json',
        'User-Agent': 'MPIntellect Intell-Internal-Fetcher' 
      },
      // ✅ Cloudflare Native Caching
      // @ts-ignore
      cf: { 
        cacheTtl: 60, // Cache this at the Edge for 1 minute
        cacheEverything: true 
      }
    } as any);

    if (!res.ok) {
      throw new Error(`R2 Storage unreachable: ${res.status}`);
    }

    const data = await res.json();

    // 3. Return the response with proper headers for the Frontend
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff'
      },
    });

  } catch (error: any) {
    console.error('❌ News API Error:', error.message);
    
    // 4. Fallback: Return empty array so the Ticker doesn't crash the UI
    return new Response(JSON.stringify([]), { 
      status: 200, // Return 200 with empty data to keep the site stable
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}