// app/zones/[symbol]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ZonesClientView from '@/components/ZonesClientView';

// Define proper type for the data
interface SymbolData {
  symbol: string;
  zones: any;
  trend: any;
  [key: string]: any;
}

export default function ZonesPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const [data, setData] = useState<SymbolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`[ZonesPage] Fetching data for symbol: ${symbol}`);
        
        const response = await fetch(`/api/data-proxy?symbol=${symbol}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setData(result);
        console.log(`[ZonesPage] Data loaded for ${symbol}`);
        
      } catch (err) {
        console.error(`[ZonesPage] Error loading data:`, err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  // Loading state - SIMPLE INLINE SPINNER
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          {/* Simple CSS spinner */}
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading {symbol.toUpperCase()} zone data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Data Unavailable</h1>
          <p className="text-zinc-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400">No data available for {symbol.toUpperCase()}</p>
        </div>
      </div>
    );
  }

  // Success - render the client view
  return <ZonesClientView data={data} symbol={symbol} />;
}

// ⚠️ CRITICAL: Remove these exports for client components!
// export const dynamic = 'force-static';  // ❌ REMOVE THIS
// export const revalidate = false;        // ❌ REMOVE THIS

// Instead, configure static behavior in next.config.js or at the layout level