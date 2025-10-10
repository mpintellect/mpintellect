// lib/fetchPerformance.ts
export type SymbolPerformance = {
  symbol: string;
  winRate: number;
  tp: number;
  sl: number;
  grade: string;
};

export type PerformanceSummary = {
  generatedAt: string;
  period: string;
  topPerformers: SymbolPerformance[];
  worstPerformers: SymbolPerformance[];
};

export async function fetchPerformanceSummary(): Promise<PerformanceSummary | null> {
  try {
    console.log('🌐 Fetching from server API...');
    
    const response = await fetch('/api/performance', {
      // ✅ Important for caching
      cache: 'default',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // ✅ Handle error response from API
    if (data.error) {
      console.warn('⚠️ API returned error:', data.error);
      return null;
    }

    console.log('✅ Server API data loaded');
    return data;

  } catch (error) {
    console.error('❌ Error fetching from server API:', error);
    return null;
  }
}

// ✅ Optional: Get cache status
export async function getPerformanceCacheStatus() {
  try {
    const response = await fetch('/api/performance', {
      method: 'POST'
    });
    return await response.json();
  } catch (error) {
    console.error('❌ Error getting cache status:', error);
    return null;
  }
}

// ✅ Optional: Force cache refresh
export async function refreshPerformanceCache(): Promise<PerformanceSummary | null> {
  try {
    // Clear server cache by making it expired
    const response = await fetch('/api/performance?refresh=true', {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('❌ Error refreshing cache:', error);
    return null;
  }
}