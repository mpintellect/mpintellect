'use client';

import { useState, useEffect } from 'react';
import { Activity, Zap, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Gauge, Bot } from 'lucide-react';
import SymbolNavigation from '@/components/SymbolNavigation';

interface IndicatorClientViewProps {
  data: any;
  symbol: string;
  onRefresh: () => Promise<void>;
}

export default function IndicatorClientView({ data, symbol, onRefresh }: IndicatorClientViewProps) {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setLastUpdated(new Date().toISOString());
    setIsRefreshing(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  const text = generateIndicatorReport(data);
  const rsi = text.rsiValue;

  // ✅ LOGIC: Select the correct Icon based on RSI Value
  let StatusIcon = Activity; // Default
  if (rsi >= 70) {
      StatusIcon = AlertTriangle; // Warning for Overbought
  } else if (rsi <= 30) {
      StatusIcon = CheckCircle;   // Check for Opportunity
  } else {
      StatusIcon = TrendingUp;    // Standard Trend
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 px-6 flex flex-col items-center">
      
      {/* HEADER */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <span className="flex items-center justify-center gap-2 text-purple-500 font-bold uppercase tracking-[0.2em] text-xs mb-4">
           <Gauge size={14} /> Momentum Scanner
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
          {data.symbol} <span className="text-zinc-600">RSI Check</span>
        </h1>
        <p className="text-zinc-400 text-lg">
          Institutional momentum analysis measuring overbought/oversold conditions using RSI(14) logic.
        </p>

        <div className="flex items-center justify-center gap-4 mt-4">
          <p className="text-zinc-400 text-sm">
            Updated: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded-md disabled:opacity-50"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* --- THE INDICATOR DASHBOARD --- */}
      <div className="w-full max-w-3xl bg-[#09090b] border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Glow Background based on status */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${text.barColor}`} />
        
        {/* MAIN NUMBER DISPLAY */}
        <div className="text-center mb-10">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Relative Strength Index (14)</p>
            <div className={`text-8xl font-black ${text.color} tracking-tighter drop-shadow-2xl`}>
                {rsi.toFixed(1)}
            </div>
            
            {/* ✅ FIXED: Icon is now used here */}
            <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-bold tracking-wider ${text.color}`}>
                <StatusIcon size={16} /> 
                {text.status}
            </div>
        </div>

        {/* VISUAL GAUGE BAR */}
        <div className="relative h-6 w-full bg-zinc-800/50 rounded-full mb-10 overflow-hidden ring-1 ring-zinc-700">
            <div className="absolute top-0 bottom-0 left-[30%] w-[1px] bg-zinc-600 z-10" title="Oversold Boundary" /> 
            <div className="absolute top-0 bottom-0 left-[70%] w-[1px] bg-zinc-600 z-10" title="Overbought Boundary" />
            
            <div 
                className={`h-full transition-all duration-1000 ${text.barColor} relative`} 
                style={{ width: `${Math.max(0, Math.min(100, rsi))}%` }}
            >
                <div className="absolute right-0 top-0 bottom-0 w-[10px] bg-white/50 blur-[4px]" />
            </div>
        </div>

        {/* ANALYSIS GRID */}
        <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-zinc-800">
            <div>
                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                    <Zap size={18} className="text-yellow-500" /> Technical Context
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    {text.advice}
                </p>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span className="text-zinc-500 text-xs uppercase font-bold">Trend Bias</span>
                    <span className="text-white font-mono">{data.momentum?.momentum_bias?.toUpperCase() || 'NEUTRAL'}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span className="text-zinc-500 text-xs uppercase font-bold">Velocity Strength</span>
                    <span className="text-white font-mono">{data.momentum?.momentum_strength || 'NEUTRAL'}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span className="text-zinc-500 text-xs uppercase font-bold">Divergence</span>
                    <span className={`font-mono ${text.divergence.includes('None') ? 'text-zinc-500' : 'text-orange-400'}`}>
                        {text.divergence}
                    </span>
                </div>
            </div>
        </div>

      </div>

      {/* --- FOOTER --- */}
      <SymbolNavigation symbol={symbol} />
    </div>
  );
}

// Helper function for indicator report generation
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