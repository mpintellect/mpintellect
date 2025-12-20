// app/analysis/[symbol]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AnalysisClientView from '@/components/AnalysisClientView';

export default function AnalysisPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/data-proxy?symbol=${symbol}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setData(result);
      } catch (err) {
        console.error(`Error loading ${symbol} analysis data:`, err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  // Update metadata client-side
  useEffect(() => {
    if (data?.trend) {
      const sym = data.symbol?.toUpperCase() || symbol;
      const bias = (data.trend.trend || 'NEUTRAL').replace("_", " ").toUpperCase();
      
      // Update page title
      document.title = `${sym} Technical Analysis: ${bias} Structure Confirmed`;
      
      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 
          `Complete technical breakdown for ${sym}. Momentum, Volatility, and Liquidity analysis powered by MZPrimer. Institutional Bias: ${bias}.`
        );
      }
      
      // Update keywords (optional)
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', 
          `${sym} technical analysis, ${sym} chart analysis, ${sym} support resistance`
        );
      }
    }
  }, [data, symbol]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-zinc-400">Analyzing {symbol.toUpperCase()} market structure...</p>
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
          <h1 className="text-2xl font-bold mb-2">Analysis Unavailable</h1>
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
          <p className="text-zinc-400">No analysis data available for {symbol.toUpperCase()}</p>
        </div>
      </div>
    );
  }

  // Success - render the client view
  return <AnalysisClientView data={data} symbol={symbol} />;
}

// ⚠️ NO EXPORTS - This is a client component