// app/api/performance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

// ✅ SERVER-SIDE CACHE (in memory)
let serverCache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Performance API called');
    
    // ✅ 1. Check server cache first
    const now = Date.now();
    if (serverCache && (now - serverCache.timestamp < CACHE_DURATION)) {
      console.log('📊 Returning cached data from server memory');
      return NextResponse.json(serverCache.data);
    }

    console.log('🔄 Cache miss - fetching from Firebase...');
    
    // ✅ 2. Fetch fresh data from Firebase
    const docRef = doc(db, "performance_summary", "latest");
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      console.warn("⚠️ No performance data in Firebase");
      return NextResponse.json(
        { error: "Performance data not found" },
        { status: 404 }
      );
    }

    const firebaseData = snapshot.data();
    
    // ✅ 3. Transform to frontend format
    const performanceData = {
      generatedAt: firebaseData.generatedAt,
      period: firebaseData.period,
      topPerformers: firebaseData.topPerformers || [],
      worstPerformers: firebaseData.worstPerformers || [],
    };

    // ✅ 4. Update server cache
    serverCache = {
      data: performanceData,
      timestamp: now
    };

    console.log('✅ Server cache updated with fresh data');
    console.log(`📊 Top performers: ${performanceData.topPerformers.length}`);
    console.log(`📉 Worst performers: ${performanceData.worstPerformers.length}`);

    return NextResponse.json(performanceData);

  } catch (error) {
    console.error('❌ API route error:', error);
    
    // ✅ 5. Fallback to cached data even if expired
    if (serverCache) {
      console.log('🔄 Using expired cache as fallback');
      return NextResponse.json(serverCache.data);
    }
    
    return NextResponse.json(
      { error: "Failed to fetch performance data" },
      { status: 500 }
    );
  }
}

// ✅ Optional: Cache status endpoint
export async function POST(request: NextRequest) {
  const cacheStatus = {
    hasCache: !!serverCache,
    isFresh: serverCache ? (Date.now() - serverCache.timestamp < CACHE_DURATION) : false,
    cacheAge: serverCache ? Math.round((Date.now() - serverCache.timestamp) / 1000) : null,
    cacheSize: serverCache ? JSON.stringify(serverCache.data).length : 0
  };
  
  return NextResponse.json(cacheStatus);
}