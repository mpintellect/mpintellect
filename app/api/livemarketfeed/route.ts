// app/api/livemarketfeed/route.ts
import { NextResponse } from 'next/server';

// Edge runtime for Cloudflare Pages
export const runtime = 'edge';

// Disable static generation
export const dynamic = 'force-dynamic';

const R2_URL = "https://data.mzprimer.com/market_intelligence.json";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const cacheBuster = url.searchParams.get('t') || Date.now();
    
    // Construct URL with cache buster
    const fetchUrl = `${R2_URL}?t=${cacheBuster}`;
    
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`R2 Error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30',
      },
    });

  } catch (error) {
    console.error('Market Intelligence API Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to load market data', 
        signals: [] 
      }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}