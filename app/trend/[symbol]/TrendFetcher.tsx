'use client';

import { useEffect, useState } from 'react';
import TrendClientView from '@/components/TrendClientView';
import { SymbolData } from '@/app/lib/fetchData';

export default function TrendFetcher({ symbol }: { symbol: string }) {
  const [data, setData] = useState<SymbolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ONE unified fetch function - ONLY place data is fetched
  const fetchSymbolData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const cleanSymbol = symbol.replace(/[-_/]/g, '').toUpperCase();
      console.log(`[TrendFetcher] Fetching ${cleanSymbol} from /api/symbol-data`);
      
      // ✅ CORRECT ENDPOINT - using symbol-data, NOT data-proxy
      const response = await fetch(`/api/symbol-data?symbol=${cleanSymbol}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Symbol ${cleanSymbol} not found in database`);
        }
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setData(result);
      console.log(`[TrendFetcher] Data loaded for ${cleanSymbol}`);
      
    } catch (err) {
      console.error(`[TrendFetcher] Error:`, err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount or symbol change
  useEffect(() => {
    fetchSymbolData();
  }, [symbol]);

  // Pass everything to child - child does NO fetching
  return (
    <TrendClientView 
      data={data}
      symbol={symbol}
      loading={loading}
      error={error}
      onRefresh={fetchSymbolData}  // Child can request refresh, but parent fetches
    />
  );
}