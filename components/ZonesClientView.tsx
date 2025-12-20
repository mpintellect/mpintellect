// components/ZonesClientView.tsx
'use client';

import { useState, useEffect } from 'react';
import { BoxSelect, Minimize2, Target } from 'lucide-react';
import NotificationButton from '@/components/NotificationButton';
import SymbolNavigation from '@/components/SymbolNavigation';
import { formatPriceForSymbol, getSymbolDecimals } from '../app/lib/formatting';

interface ZoneData {
  support_zone: number;
  resistance_zone: number;
  zone_strength: string;
  support_quality: number;
  resistance_quality: number;
  zone_width_pips: number;
  current_price_position: string;
  zone_clarity: string;
  trend_alignment: string;
  order_placement_context: string;
  zone_confidence: string;
  component_quality: number;
}

interface TrendData {
  current_price: number;
  [key: string]: any;
}

interface ZonesClientViewProps {
  data: {
    zones: ZoneData;
    trend: TrendData;
    symbol: string;
  };
  symbol: string;
}

export default function ZonesClientView({ data, symbol }: ZonesClientViewProps) {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const z = data.zones;
  const currentPrice = data.trend?.current_price || 0;
  const resolvedSymbol = data.symbol || symbol;

  // Calculate price percentage in range
  const rangeSpan = z.resistance_zone - z.support_zone;
  let pricePct = 50;
  if (rangeSpan > 0) {
    pricePct = ((currentPrice - z.support_zone) / rangeSpan) * 100;
    pricePct = Math.max(0, Math.min(100, pricePct));
  }

  // Format numbers
  const formatNumber = (num: number) => {
  return formatPriceForSymbol(symbol, num);
};
  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/data-proxy?symbol=${symbol}`);
      if (res.ok) {
        const newData = await res.json();
        // Update state or trigger parent refresh
        setLastUpdated(new Date().toISOString());
        // Note: In real implementation, you'd lift state up or use context
      }
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-orange-500/30">
      
      {/* HEADER */}
      <div className="pt-28 pb-10 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-orange-500/30 bg-orange-900/10 text-orange-300 text-[10px] uppercase font-bold tracking-widest">
          <BoxSelect size={12} /> Institutional Levels
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter text-white">
          {resolvedSymbol} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">ZONES</span>
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
        
        {/* MAIN GLASS CARD */}
        <div className="md:col-span-8 p-8 rounded-3xl relative overflow-hidden glass-trend-card bg-gradient-to-b from-zinc-900 to-black">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-10">
                <span className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Target size={14} /> RANGE MAP
                </span>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest px-2 py-1 rounded bg-orange-900/20 border border-orange-900/50">
                    Quality: {(z.component_quality).toFixed(0)}/100
                </span>
            </div>

            <div className="flex flex-col gap-12">
                
                {/* VISUAL ZONE MAP (Vertical Bar) */}
                <div className="flex items-stretch gap-6 h-64 md:h-80">
                    
                    {/* The Scale */}
                    <div className="flex flex-col justify-between text-xs font-mono text-zinc-500 py-1">
                        <div className="flex items-center gap-2">
                            <span className="text-red-400 font-bold">{formatNumber(z.resistance_zone)}</span> 
                            <span>RES</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">{formatNumber(z.support_zone)}</span>
                            <span>SUP</span>
                        </div>
                    </div>

                    {/* The Bar */}
                    <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800 relative w-12 md:w-20 mx-auto">
                        
                        {/* Red Zone (Top) */}
                        <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-red-500/20 to-transparent border-t-2 border-red-500/50 rounded-t-xl"></div>
                        
                        {/* Green Zone (Bottom) */}
                        <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-emerald-500/20 to-transparent border-b-2 border-emerald-500/50 rounded-b-xl"></div>

                        {/* PRICE MARKER (Moves dynamically) */}
                        <div 
                            className="absolute left-0 right-0 h-0.5 bg-white shadow-[0_0_15px_white] flex items-center transition-all duration-1000"
                            style={{ bottom: `${pricePct}%` }}
                        >
                            {/* Dotted Line */}
                            <div className="absolute w-full border-t border-dashed border-zinc-500"></div>
                            {/* Tag */}
                            <div className="absolute right-[-80px] bg-white text-black font-bold text-[10px] px-2 py-1 rounded flex items-center gap-1 shadow-lg">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                {formatNumber(currentPrice)}
                            </div>
                        </div>

                    </div>

                    {/* The Status Side */}
                    <div className="flex flex-col justify-center gap-4 text-xs">
                        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                            <span className="block text-zinc-500 uppercase text-[9px] font-bold mb-1">Status</span>
                            <span className="block text-white font-bold capitalize">
                                {z.current_price_position?.replace(/_/g, ' ') || 'Unknown'}
                            </span>
                        </div>
                        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                            <span className="block text-zinc-500 uppercase text-[9px] font-bold mb-1">Spread</span>
                            <span className="block text-white font-bold">{z.zone_width_pips} Pips</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>

        {/* SIDEBAR */}
        <div className="md:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-center h-full">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-orange-600/10 text-orange-500 border border-orange-500/20">
                    <Minimize2 size={24} />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">
                    Strategy: {z.order_placement_context === 'limit_at_resistance' ? "SHORT Limit" : "LONG Limit"}
                </h4>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed px-2">
                    Current AI confidence is <strong>{z.zone_confidence?.toUpperCase() || 'MEDIUM'}</strong>. 
                    Price is testing critical structural integrity.
                </p>
                <NotificationButton />
            </div>
        </div>

      </div>

      {/* CONTENT SEO */}
      <section className="inst-container">
        <h2 className="inst-header">Institutional Levels Breakdown</h2>
        
        <div>
            {/* Context Analysis */}
            <p className="inst-context">
                Liquidity scans show the trading range for {resolvedSymbol}.
                Resistance ceiling detected at <strong>{formatNumber(z.resistance_zone)}</strong>.
                Support floor holding at <strong>{formatNumber(z.support_zone)}</strong>.
                Structure Strength: <strong>{z.zone_strength?.toUpperCase() || 'NEUTRAL'}</strong>.
            </p>
            
            {/* Position Status Block */}
            <div className="inst-position-box">
                <span className="inst-position-label">Current Price Location</span>
                <p className="inst-position-text">
                    Current price ({formatNumber(currentPrice)}) is {z.current_price_position?.replace(/_/g, ' ') || 'mid-range'}. 
                    Compression spread: {(z.zone_width_pips || 0).toFixed(1)} pips.
                    Setup Clarity: <strong>{z.component_quality}/100</strong>.
                </p>
            </div>
            
            {/* Trading Directive Alert Card */}
            <div className="inst-directive-card">
                <span className="inst-directive-label">Trading Directive</span>
                <p className="inst-directive-text">
                    Context Signal: {z.order_placement_context || 'neutral'}.
                    Aggressive: <strong>
                        {z.order_placement_context === 'limit_at_resistance' ? 'Limit Sell Order' : 
                         z.order_placement_context === 'limit_at_support' ? 'Limit Buy Order' : 
                         'Stand Aside'}
                    </strong> on rejection.
                    Conservative: Wait for confirm.
                </p>
            </div>
        </div>
      </section>

      {/* FOOTER */}
      <SymbolNavigation symbol={resolvedSymbol} />

    </div>
  );
}