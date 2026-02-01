// functions/api/news.ts
export async function onRequestGet() {
  try {
    const R2_NEWS_URL = "https://data.mzprimer.com/news.json";
    const url = `${R2_NEWS_URL}?t=${Date.now()}`;

    const res = await fetch(url, {
      headers: { 'Cache-Control': 'no-cache' },
      // @ts-ignore
      cf: { cacheTtl: 60 } // Cache at edge for 1 minute
    });

    if (!res.ok) {
      throw new Error(`R2 News Error: ${res.status}`);
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        'Access-Control-Allow-Origin': '*'
      },
    });

  } catch (error) {
    console.error('News API Error:', error);
    // Return empty array instead of crashing
    return new Response(JSON.stringify([]), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}