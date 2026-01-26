import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return NextResponse.json({ error: "Symbol parameter required" }, { status: 400 });
    }

    // Clean the symbol to match your file names (output_BTCUSD.json)
    const cleanSymbol = symbol.replace(/[-_/]/g, "").toUpperCase();
    console.log('🚀 Setup API (R2) called for symbol:', cleanSymbol);
    
    // ✅ NEW CLOUDFLARE R2 URL
    // Use the same pub-xxxx.r2.dev link from your other files
    const R2_URL = 'https://data.mzprimer.com';
    const fileUrl = `${R2_URL}/output_${cleanSymbol}.json`;
    
    console.log('📡 Fetching from R2:', fileUrl);
    
    const response = await fetch(fileUrl, {
      headers: {
        'Accept': 'application/json',
      },
      // Revalidate every 60 seconds to keep the analysis fresh
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`❌ Symbol file 'output_${cleanSymbol}.json' not found in R2`);
        return NextResponse.json({ error: "Symbol setup not found" }, { status: 404 });
      }
      throw new Error(`Cloudflare R2 returned ${response.status}`);
    }

    const symbolData = await response.json();
    
    console.log(`✅ Successfully fetched setup for ${cleanSymbol} from R2`);
    
    // Return with Cache-Control so the browser/CDN helps with the load
    return NextResponse.json(symbolData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });

  } catch (error) {
    console.error('❌ Setup API error:', error);
    return NextResponse.json(
      { error: "Failed to fetch setup data" },
      { status: 500 }
    );
  }
}