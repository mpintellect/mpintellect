// app/api/livemarketfeed/route.ts


// ✅ ENABLE EDGE RUNTIME (Super Fast)
export const runtime = 'edge';

// Disable static generation for this route to ensure freshness
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch directly from Google Cloud Storage
    // Adding timestamp to bypass Vercel's internal fetch cache
    const gcsUrl = `https://storage.googleapis.com/mzprimer-data-store/market_intelligence.json?t=${Date.now()}`;

    const response = await fetch(gcsUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache', // Force fetch from GCS
      },
      next: { revalidate: 30 } // Revalidate every 30s
    });

    if (!response.ok) {
      throw new Error('Failed to fetch market intelligence');
    }

    const data = await response.json();

    // Return with headers that allow browser caching for 30 seconds
    // stale-while-revalidate=59 means: "If cache is old (30-89s), show old data while fetching new in background"
    return Response.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Market Intelligence API Error:', error);
    return Response.json(
      { error: 'Failed to load market data', signals: [] }, 
      { status: 500 }
    );
  }
}