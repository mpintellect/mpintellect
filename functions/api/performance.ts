// functions/api/performance.ts (Move from app/api/performance/route.ts)

/**
 * Cloudflare Handler: onRequestGet
 * Fetches fresh performance data from Google Cloud Storage via Proxy
 */
export async function onRequestGet(context: any) {
  // Destructure context if needed (even if not used, it defines the environment)
  const { request, env } = context;

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
        // Standard Cloudflare timeout handling
        signal: AbortSignal.timeout(10000) 
      }
    );

    if (!response.ok) {
      throw new Error(`Google Storage returned ${response.status}: ${response.statusText}`);
    }

    const performanceData: any = await response.json();
    
    // Validate the data structure
    if (!performanceData.topPerformers || !performanceData.worstPerformers) {
      throw new Error('Invalid data structure from Google Storage');
    }

    // Return the response directly
    return Response.json(performanceData);

  } catch (error: any) {
    console.error('❌ API route error:', error);
    
    // Return empty structure on error so the UI doesn't break
    return Response.json({
      topPerformers: [],
      worstPerformers: []
    });
  }
}