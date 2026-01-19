import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const JSON_URL = "https://storage.googleapis.com/mzprimer-data-store/news.json";

export async function GET() {
  try {
    // Server-side fetch (Bypasses CORS)
    const res = await fetch(`${JSON_URL}?t=${Date.now()}`, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
      next: { revalidate: 60 } // Check for new news every minute
    });

    if (!res.ok) {
      throw new Error(`GCS Error: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        // Cache in browser for 1 min, allow stale up to 5 mins
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('News API Error:', error);
    // Return empty array instead of crashing so the UI handles it gracefully
    return NextResponse.json([], { status: 200 }); 
  }
}