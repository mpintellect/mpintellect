// app/api/price/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return NextResponse.json({ error: "Symbol parameter required" }, { status: 400 });
    }

    console.log('🚀 Price API called for symbol:', symbol);
    
    const response = await fetch('https://us-central1-mzprimer-livefeed.cloudfunctions.net/api/prices');
    
    if (!response.ok) {
      throw new Error(`Google Storage returned ${response.status}`);
    }

    const data = await response.json();
    const symbolData = data[symbol];
    
    if (!symbolData || typeof symbolData.price !== 'number') {
      return NextResponse.json({ error: "Symbol not found or invalid price" }, { status: 404 });
    }

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