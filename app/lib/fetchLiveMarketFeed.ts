// lib/fetchLiveMarketFeed.ts

export async function fetchLiveMarketFeed() {
  try {
    const url = "https://storage.googleapis.com/mzprimer-data-store/market_intelligence.json";
    
    const res = await fetch(url, {
      method: "GET",
      cache: "no-cache",
      next: { revalidate: 10 }   // optional caching
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