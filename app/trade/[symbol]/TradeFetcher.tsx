'use client';

import { useEffect, useState } from 'react';
import TradeClientView from '@/components/TradeClientView';

export default function TradeFetcher({ symbol }: { symbol: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSymbolData = async () => {
    try {
      setLoading(true); 
      setError(null);
      
      const cleanSymbol = symbol.replace(/[-_/]/g, '').toUpperCase();
      const response = await fetch(`/api/symbol-data?symbol=${cleanSymbol}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setData(result);
    } catch (err) {
      console.error(`Error loading ${symbol} trade data:`, err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSymbolData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading {symbol.toUpperCase()} trade setup...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Trade Data Unavailable</h1>
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

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400">No trade data available for {symbol.toUpperCase()}</p>
        </div>
      </div>
    );
  }

  return <TradeClientView data={data} symbol={symbol} onRefresh={fetchSymbolData} />;
}