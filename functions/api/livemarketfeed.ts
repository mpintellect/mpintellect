// functions/api/livemarketfeed.ts

export async function onRequestGet(context: any) {
  const { env } = context;

  try {
    const R2_URL = "https://data.mzprimer.com/market_intelligence.json";
    
    // Add a timestamp to prevent browser caching
    const url = `${R2_URL}?t=${Date.now()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache', 
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "R2 Fetch Failed" }), { status: 500 });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30', // Cache for 30s
        'Access-Control-Allow-Origin': '*'    // Prevent CORS errors
      },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}