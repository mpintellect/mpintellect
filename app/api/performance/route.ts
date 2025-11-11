// app/api/performance/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Performance API called - fetching fresh data from Google Storage');
    
    // Fetch fresh data from Google Storage
    const response = await fetch(
      'https://us-central1-mzprimer-livefeed.cloudfunctions.net/api/performance',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      }
    );

    console.log('📡 Google Storage response status:', response.status);

    if (!response.ok) {
      throw new Error(`Google Storage returned ${response.status}: ${response.statusText}`);
    }

    const performanceData = await response.json();
    
    // Validate the data structure
    if (!performanceData.topPerformers || !performanceData.worstPerformers) {
      throw new Error('Invalid data structure from Google Storage');
    }

    console.log('✅ Successfully fetched fresh performance data from Google Storage');
    console.log(`📊 Top performers: ${performanceData.topPerformers.length}`);
    console.log(`📉 Worst performers: ${performanceData.worstPerformers.length}`);

    return NextResponse.json(performanceData);

  } catch (error) {
    console.error('❌ API route error:', error);
    
    // Return empty structure on error (no fallback cache)
    console.log('💥 Fetch failed, returning empty structure');
    return NextResponse.json({
      topPerformers: [],
      worstPerformers: []
    });
  }
}