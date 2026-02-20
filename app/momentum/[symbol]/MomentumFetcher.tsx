'use client';

import { useEffect, useState } from 'react';
import MomentumClientView from '@/components/MomentumClientView';

export default function MomentumFetcher({ symbol }: { symbol: string }) {
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
      console.error(`Error loading ${symbol} momentum data:`, err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSymbolData();
  }, [symbol]);

  // Update metadata client-side
  useEffect(() => {
    if (data?.momentum) {
      const m = data.momentum;
      const rsi = m.rsi_latest || 50;
      const bias = (m.momentum_bias || 'NEUTRAL').toUpperCase();
      const symbolName = data.symbol || symbol;
      
      // Generate report for state
      let state = "Equilibrium";
      if (rsi > 70) state = "Overbought";
      if (rsi < 30) state = "Oversold";
      
      // Dynamic title
      let title = `${symbolName} Momentum Analysis: ${bias} | RSI ${rsi.toFixed(1)}`;
      if (rsi > 70) title = `⚠️ ${symbolName} Momentum Overbought Alert: RSI ${rsi.toFixed(1)}`;
      if (rsi < 30) title = `💎 ${symbolName} Momentum Oversold Opportunity: RSI ${rsi.toFixed(1)}`;
      
      document.title = title;
      
      // Dynamic description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        const velocity = (m.rsi_slope || 0) > 0.05 ? "Accelerating" : (m.rsi_slope || 0) < -0.05 ? "Decelerating" : "Stable";
        metaDesc.setAttribute('content', 
          `Live Momentum oscillator check for ${symbolName}. RSI at ${rsi.toFixed(1)} (${state}). Velocity: ${velocity}. Strength: ${m.momentum_strength || 'neutral'}.`
        );
      }
      
      // Add keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', 
          `${symbolName} momentum, ${symbolName} RSI, ${symbolName} oscillator, ${symbolName} velocity, momentum trading`
        );
      }
    }
  }, [data, symbol]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
          <p className="mt-4 text-zinc-400">Analyzing momentum for {symbol.toUpperCase()}...</p>
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
          <h1 className="text-2xl font-bold mb-2">Momentum Data Unavailable</h1>
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
          <p className="text-zinc-400">No momentum data available for {symbol.toUpperCase()}</p>
        </div>
      </div>
    );
  }

  // Success - render the client view
  return <MomentumClientView data={data} symbol={symbol} onRefresh={fetchSymbolData} />;
}