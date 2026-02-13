// app/analysis/[symbol]/AnalysisFetcher.tsx
'use client';

import { useEffect, useState } from 'react';
import AnalysisClientView from '@/components/AnalysisClientView';

export default function AnalysisFetcher({ symbol }: { symbol: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create a lowercase version for display
  const displaySymbol = symbol.toLowerCase();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ Normalize to UPPERCASE before hitting the API (API requirement)
        const apiSymbol = symbol.toUpperCase();
        const res = await fetch(`/api/symbol-data?symbol=${apiSymbol}`);
        
        if (!res.ok) {
          throw new Error(`Symbol ${displaySymbol} not found in database.`); // Use lowercase in error message
        }
        
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        console.error("Failed to load analysis data", e);
        setError(e.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [symbol, displaySymbol]); // Add displaySymbol to dependencies if needed

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analysis for {displaySymbol}...</p> {/* Use lowercase here */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Pass the lowercase symbol to AnalysisClientView
  return <AnalysisClientView data={data} symbol={displaySymbol} />;
}