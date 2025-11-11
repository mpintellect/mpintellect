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
    
    const response = await fetch('https://us-central1-mzprimer-livefeed.cloudfunctions.net/api/tradesetup', {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('📡 Google Storage response status:', response.status);

    if (!response.ok) {
      throw new Error(`Google Storage returned ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Available symbols:', Object.keys(data));
    
    const symbolData = data[symbol];
    
    if (!symbolData) {
      console.warn(`❌ Symbol '${symbol}' not found in tradesetup.json`);
      return NextResponse.json({ error: "Symbol not found" }, { status: 404 });
    }

    console.log(`✅ Successfully found setup for ${symbol}`);
    return NextResponse.json(symbolData);

  } catch (error) {
    console.error('❌ Setup API error:', error);
    return NextResponse.json(
      { error: "Failed to fetch setup data" },
      { status: 500 }
    );
  }
}