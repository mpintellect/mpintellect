

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// ✅ NEW CLOUDFLARE R2 URL
// Replace with your actual pub-xxxx.r2.dev link
const R2_NEWS_URL = "https://data.mzprimer.com/news.json";

export async function GET() {
  try {
    // Fetch from R2 with a cache buster timestamp
    const res = await fetch(`${R2_NEWS_URL}?t=${Date.now()}`, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
      next: { revalidate: 60 } // Check for new news every minute
    });

    if (!res.ok) {
      throw new Error(`R2 News Error: ${res.status}`);
    }

    const data = await res.json();

    return Response.json(data, {
      status: 200,
      headers: {
        // Cache in browser for 1 min, allow stale up to 5 mins
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('News API Error:', error);
    // Return empty array instead of crashing
    return Response.json([], { status: 200 }); 
  }
}