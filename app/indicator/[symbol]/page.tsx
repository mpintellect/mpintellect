// app/indicator/[symbol]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import IndicatorClientView from '@/components/IndicatorClientView';

export default function IndicatorPage() {
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
        console.error(`Error loading ${symbol} indicator data:`, err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  // Update metadata client-side
  useEffect(() => {
    if (data?.momentum) {
      const rsi = data.momentum.rsi_latest || 50;
      const bias = (data.momentum.momentum_bias || 'NEUTRAL').toUpperCase();
      
      // Generate report for status
      const report = generateIndicatorReport(data);
      
      // Update page title
      document.title = report.title;
      
      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', report.desc);
      }
    }
  }, [data]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
          <p className="mt-4 text-zinc-400">Scanning RSI momentum for {symbol.toUpperCase()}...</p>
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
          <h1 className="text-2xl font-bold mb-2">Indicator Unavailable</h1>
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
          <p className="text-zinc-400">No indicator data available for {symbol.toUpperCase()}</p>
        </div>
      </div>
    );
  }

  // Success - render the client view
  return <IndicatorClientView data={data} symbol={symbol} />;
}

// Helper function for metadata (also used in client view)
function generateIndicatorReport(data: any) {
  const m = data.momentum || {};
  const rsi = m.rsi_latest || 50;
  const bias = (m.momentum_bias || 'NEUTRAL').toUpperCase();

  // Default State: Neutral
  let status = "NEUTRAL MOMENTUM";
  let color = "text-purple-400";
  let barColor = "bg-purple-500";
  let sentiment = "Wait for clarity";
  let advice = "RSI is floating in the middle zone (30-70). This indicates price is following the average trend without extremes. Look for price action confirmation rather than trading off RSI alone.";

  // LOGIC TREE
  if (rsi >= 70) {
    status = "⚠️ CRITICAL: OVERBOUGHT";
    color = "text-red-500";
    barColor = "bg-red-500";
    sentiment = "Reversal Risk High";
    advice = "Price is statistically extended to the upside. The probability of a pullback or consolidation is very high. Buying here chases the top. Watch for Bearish Divergence.";
  } 
  else if (rsi <= 30) {
    status = "💎 OPPORTUNITY: OVERSOLD";
    color = "text-emerald-400";
    barColor = "bg-emerald-500";
    sentiment = "Bounce Likely";
    advice = "Selling pressure has exhausted. Price is statistically cheap relative to recent history. Watch for a bullish reaction or rejection wicks to enter long.";
  } 
  else if (rsi > 55 && (bias.includes("BULL"))) {
    status = "STRONG BULLISH MOMENTUM";
    color = "text-green-400";
    barColor = "bg-green-500";
    sentiment = "Trend Following";
    advice = "Buyers are in control. RSI is holding above 50, supporting the uptrend. Dip buying is favored while RSI stays above the 40-50 floor.";
  }
  else if (rsi < 45 && (bias.includes("BEAR"))) {
    status = "STRONG BEARISH MOMENTUM";
    color = "text-red-400";
    barColor = "bg-red-500";
    sentiment = "Sell Rallies";
    advice = "Sellers are dominating. RSI is suppressed below 50, confirming the downtrend. Rallies that fail to push RSI above 60 offer selling opportunities.";
  }

  return {
    title: `Live RSI Indicator for ${data.symbol || 'Unknown'}: ${rsi.toFixed(1)} - ${status}`,
    desc: `Real-time RSI monitor for ${data.symbol || 'Unknown'}. Current Value: ${rsi.toFixed(1)}. Market Bias: ${bias}. Technical Verification: ${sentiment}.`,
    rsiValue: rsi,
    status,
    color,
    barColor,
    advice,
    sentiment,
    divergence: m.divergence_detected !== "None" && m.divergence_detected ? m.divergence_detected : "No Divergence",
    strength: m.momentum_strength || "NEUTRAL"
  };
}