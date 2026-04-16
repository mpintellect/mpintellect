// functions/api/livemarketfeed.ts
export async function onRequestGet(context: any) {
  const { request, env } = context;

  try {
    console.log('Fetching market  data...');
    
    const R2_URL = "https://data.mpintellect.com/market_.json";
    const url = `${R2_URL}?t=${Date.now()}`;

    console.log('URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Add Cloudflare cache control
      // @ts-ignore
      cf: {
        cacheTtl: 30, // Cache for 30 seconds at edge
        cacheEverything: true,
      }
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      console.error('R2 fetch failed:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ 
          error: "R2 Fetch Failed", 
          status: response.status,
          statusText: response.statusText
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const data = await response.json();
    console.log('Data fetched successfully, signals count:', data?.signals?.length || 0);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30',
        'Access-Control-Allow-Origin': '*'
      },
    });

  } catch (error: any) {
    console.error('Error in livemarketfeed function:', error);
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error",
        message: error.message 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}