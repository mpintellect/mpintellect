import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return NextResponse.json({ error: "Symbol parameter required" }, { status: 400 });
    }

    console.log('🚀 Price API (R2) called for symbol:', symbol);
    
    // ✅ NEW CLOUDFLARE R2 URL
    // Replace with your actual pub-xxxx.r2.dev link
    const R2_URL = 'https://data.mzprimer.com/prices.json';
    
    // We use a short revalidate (60s) so the API stays fresh
    const response = await fetch(R2_URL, {
        next: { revalidate: 60 } 
    });
    
    if (!response.ok) {
      throw new Error(`Cloudflare R2 returned ${response.status}`);
    }

    const data = await response.json();
    const symbolData = data[symbol];
    
    if (!symbolData || typeof symbolData.price !== 'number') {
      console.warn(`⚠️ Symbol '${symbol}' not found in R2 prices.json`);
      return NextResponse.json({ error: "Symbol not found or invalid price" }, { status: 404 });
    }

    // Return the data exactly as the frontend expects it
    return NextResponse.json({
      symbol,
      price: symbolData.price,
      decimals: symbolData.decimals,
      timestamp: symbolData.timestamp
    });

  } catch (error) {
    console.error('❌ Price API error:', error);
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}