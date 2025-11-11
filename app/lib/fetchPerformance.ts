// app/lib/fetchPerformance.ts
export type PerformanceSummary = {
  topPerformers: {
    symbol: string;
    grade: string;
    winRate: number;
    tp: number;
    sl: number;
  }[];
  worstPerformers: {
    symbol: string;
    grade: string;
    winRate: number;
    tp: number;
    sl: number;
  }[];
};

export async function fetchPerformanceSummary(): Promise<PerformanceSummary> {
  try {
    console.log("🔄 Fetching performance data via API route...");
    
    const res = await fetch('/api/performance', {
      cache: 'no-store' // Important: bypass browser cache
    });
    
    console.log("📡 API Route response status:", res.status);
    
    if (!res.ok) {
      throw new Error(`API route failed: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("✅ Successfully fetched performance data");
    return data;
    
  } catch (err) {
    console.error("❌ Error loading performance summary:", err);
    throw err;
  }
}