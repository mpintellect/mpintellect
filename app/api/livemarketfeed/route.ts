import { NextResponse } from 'next/server';

// ✅ ENABLE EDGE RUNTIME (Super Fast)
export const runtime = 'edge';

// Disable static generation for this route to ensure freshness
export const dynamic = 'force-dynamic';

// ✅ NEW CLOUDFLARE R2 URL
// Replace with your actual pub-xxxx.r2.dev link
const R2_URL = "https://data.mzprimer.com/market_intelligence.json";

export async function GET() {
  try {
    // Fetch directly from Cloudflare R2
    // Adding timestamp to bypass Vercel's internal fetch cache
    const urlWithCacheBuster = `${R2_URL}?t=${Date.now()}`;

    const response = await fetch(urlWithCacheBuster, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache', // Force fresh fetch from R2
      },
      next: { revalidate: 30 } // Check for updates every 30s
    });

    if (!response.ok) {
      throw new Error(`R2 Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Return with headers that allow browser caching for 30 seconds
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Market Intelligence API Error:', error);
    return NextResponse.json(
      { error: 'Failed to load market data', signals: [] }, 
      { status: 500 }
    );
  }
}