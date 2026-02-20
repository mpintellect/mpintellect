'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Activity, ShieldAlert, ArrowRight, TrendingUp, Bot } from 'lucide-react';
import NotificationButton from '@/components/NotificationButton';
import SymbolNavigation from '@/components/SymbolNavigation';
import { SymbolData } from '@/app/lib/fetchData';

interface VolatilityClientViewProps {
  data: SymbolData | null;
  symbol: string;
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;  // Callback to parent - NO FETCHING HERE
}

export default function VolatilityClientView({ 
  data, 
  symbol, 
  loading, 
  error, 
  onRefresh 
}: VolatilityClientViewProps) {
  
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle refresh - just calls parent callback
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();  // Parent does the actual fetch
    setLastUpdated(new Date().toISOString());
    setIsRefreshing(false);
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []); // Empty dependency - doesn't need symbol

  // ---- LOADING STATE ----
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading {symbol.toUpperCase()} volatility analysis...</p>
        </div>
      </div>
    );
  }

  // ---- ERROR STATE ----
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Volatility Data Unavailable</h1>
          <p className="text-zinc-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ---- NO DATA STATE ----
  if (!data || !data.volatility) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400">No volatility data available for {symbol.toUpperCase()}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ---- SUCCESS STATE (with data) ----
  const v = data.volatility;
  const resolvedSymbol = data.symbol || symbol;
  
  // Dynamic Styling Logic
  const isHighRisk = v.volatility_score > 0.6;
  const accentColor = isHighRisk ? "text-amber-500" : "text-blue-400";
  const barColor = isHighRisk ? "bg-amber-500" : "bg-blue-500";
  const glowStyle = isHighRisk 
    ? "bg-gradient-to-br from-amber-900/20 to-black border-amber-900/30" 
    : "bg-gradient-to-br from-blue-900/20 to-black border-blue-900/30";

  // Format function
  const fmt = (num: number) => num.toLocaleString(undefined, { maximumFractionDigits: 10 });

  // Generate report text (moved from generator)
  const isHighVol = v.volatility_level === "high" || v.volatility_score > 0.7;
  
  const text = {
    context: `
      The market state for ${resolvedSymbol} is currently classified as "${v.volatility_regime?.toUpperCase() || 'NEUTRAL'}". 
      The standardized Volatility Score is reading ${v.volatility_score?.toFixed(2) || '0.00'} (Scale 0-1). 
      ${(v.volatility_score || 0) < 0.3 
        ? "This low reading indicates price compression. Often referred to as the 'Calm before the Storm', this state frequently precedes explosive breakouts." 
        : "Elevated readings suggest expanded ranges. Traders should expect wider swings and potentially slippage on market orders."}
    `,
    stats: `
      The Daily Average True Range (ATR) represents the expected move over a 24-hour period. 
      Currently, ${resolvedSymbol} moves approximately ${fmt(v.current_atr || 0)} points per day. 
      Compared to its historical baseline of ${fmt(v.avg_range || 0)}, volatility is ${(v.current_atr || 0) > (v.avg_range || 0) ? "expanding" : "contracting"}.
    `,
    strategy: `
      Risk premiums must be adjusted for this environment. 
      Our AI calculates an optimal Stop Loss multiplier of ${v.optimal_sl_multiplier || 1.5}x ATR to avoid "noise" while protecting capital. 
      In this ${v.volatility_regime || 'neutral'} environment, strictly limit order placement is recommended over market execution.
    `
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-purple-500/30">
      
      {/* --- HERO HEADER --- */}
      <div className="pt-28 pb-10 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
           <BarChart3 size={12} className="text-purple-500" /> Market Physics Engine
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter text-white">
           {resolvedSymbol} <span className={accentColor}>{v.volatility_level || 'MEDIUM'} Vol</span>
        </h1>
        
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

      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-12 gap-8">
        
        {/* --- MAIN DASHBOARD CARD --- */}
        <div className={`md:col-span-8 p-8 rounded-3xl relative overflow-hidden glass-volatility-card ${glowStyle}`}>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <span className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <ShieldAlert size={14} /> Implied Risk Score
                </span>
                <span className="text-xs font-mono font-bold text-white px-2 py-1 rounded bg-white/10">
                    ATR: {(v.current_atr || 0).toFixed(2)}
                </span>
            </div>

            <div className="flex flex-col gap-8">
                
                {/* 1. VOLATILITY BAR METER */}
                <div>
                    <div className="flex justify-between text-sm font-bold text-zinc-400 mb-2 uppercase text-[10px] tracking-wider">
                        <span>Compressed (Safe)</span>
                        <span>Explosive (Risk)</span>
                    </div>
                    
                    {/* The Bar Container */}
                    <div className="w-full h-6 bg-zinc-900 rounded-full border border-zinc-800 relative overflow-hidden">
                        {/* Grid Lines inside bar */}
                        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-white/5"></div>
                        <div className="absolute top-0 bottom-0 left-2/4 w-px bg-white/5"></div>
                        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-white/5"></div>
                        
                        {/* The Fill Animation */}
                        <div 
                            className={`h-full ${barColor} relative vol-bar-glow`} 
                            style={{ width: `${Math.min((v.volatility_score || 0) * 100, 100)}%` }}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-50 shadow-[0_0_10px_white]"></div>
                        </div>
                    </div>
                    
                    <div className="mt-2 text-right">
                        <span className={`text-4xl font-black ${accentColor}`}>{(v.volatility_score || 0).toFixed(2)}</span>
                        <span className="text-sm text-zinc-500 font-medium"> / 1.0 Index</span>
                    </div>
                </div>

                {/* 2. STATS GRID */}
                <div className="grid grid-cols-2 gap-4">
                    
                    {/* Stat A: Daily Range */}
                    <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                            <TrendingUp size={18} className="text-zinc-400" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Avg Range Capability</p>
                            <p className="text-xl font-mono font-bold text-white">{Math.floor(v.avg_range || 0)} <span className="text-xs font-sans font-normal opacity-50">PTS</span></p>
                        </div>
                    </div>

                    {/* Stat B: SL Setting */}
                    <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                            <ShieldAlert size={18} className={accentColor} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Recommended Stop</p>
                            <p className="text-xl font-mono font-bold text-white">{(v.optimal_sl_multiplier || 1.5)}x <span className="text-xs font-sans font-normal opacity-50">ATR</span></p>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        {/* --- SIDEBAR --- */}
        <div className="md:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-center h-full">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isHighRisk ? 'bg-amber-900/20 text-amber-500' : 'bg-blue-900/20 text-blue-500'}`}>
                    <Activity size={24} />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Regime: {(v.volatility_regime || 'NEUTRAL').toUpperCase()}</h4>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed px-4">
                    This market condition requires <strong>{isHighRisk ? "reduced position sizing" : "patience for expansion"}</strong>. Get alerted when conditions shift.
                </p>
                <NotificationButton />
            </div>
        </div>

      </div>

      {/* --- TEXT CONTENT --- */}
      <section className="vol-container">
        <h2 className="vol-header">Volatility Risk Report</h2>
        
        <div>
          {/* 1. Context */}
          <p className="vol-context">
            {text.context}
          </p>
          
          {/* 2. Stats (Simple side note) */}
          <p className="vol-stats">
            DATA: {text.stats}
          </p>
          
          {/* 3. Strategy Card (Protocol) */}
          <div className="vol-strategy-card">
            <span className="vol-strategy-label">Risk Adaptation Protocol</span>
            <p className="vol-strategy-text">
              {text.strategy}
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <SymbolNavigation symbol={resolvedSymbol} />

    </div>
  );
}