// lib/fetchLiveMarketFeed.ts

export async function fetchLiveMarketFeed() {
  try {
    // Use the API route instead of direct GCS fetch for better caching and error handling
    const url = "/api/livemarketfeed";
    
    const res = await fetch(url, {
      method: "GET",
      cache: "no-cache",
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (!res.ok) {
      console.error("Live Feed Fetch Error:", res.status, res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Live Feed Fetch Exception:", error);
    return null;
  }
}