// app/api/setup/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return NextResponse.json({ error: "Symbol parameter required" }, { status: 400 });
    }

    console.log('🚀 Setup API called for symbol:', symbol);
    
    // ✅ FETCH INDIVIDUAL SYMBOL FILE FROM GCS
    // Now using: https://storage.googleapis.com/mzprimer-data-store/output_SYMBOL.json
    const gcsUrl = `https://storage.googleapis.com/mzprimer-data-store/output_${symbol}.json`;
    
    console.log('📡 Fetching from GCS:', gcsUrl);
    
    const response = await fetch(gcsUrl, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      // Revalidate every 60 seconds to match Python upload cycle
      next: { revalidate: 60 }
    });
    
    console.log('📡 Google Storage response status:', response.status);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`❌ Symbol file 'output_${symbol}.json' not found in GCS`);
        return NextResponse.json({ error: "Symbol setup not found" }, { status: 404 });
      }
      throw new Error(`Google Storage returned ${response.status}`);
    }

    const symbolData = await response.json();
    
    console.log(`✅ Successfully fetched setup for ${symbol}`);
    
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