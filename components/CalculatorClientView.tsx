'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, ArrowDown, ArrowUp, Calculator, ArrowRight, Zap, Bot } from 'lucide-react';
import SymbolNavigation from '@/components/SymbolNavigation';
import { formatPriceForSymbol } from '../app/lib/formatting';

interface CalculatorClientViewProps {
  data: any;
  symbol: string;
  onRefresh: () => Promise<void>;
}

export default function CalculatorClientView({ data, symbol, onRefresh }: CalculatorClientViewProps) {
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

  // Extract data with safety checks
  const v = data?.volatility;
  const currentPrice = data?.trend?.current_price || 0;
  const atr = v?.current_atr || 0;
  
  // Generate calculations with proper formatting
  const { atrString, calculations } = generateCalculatorReport(data, symbol);

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      
      {/* HEADER */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 text-orange-500 font-bold uppercase text-xs tracking-widest mb-4 border border-orange-500/30 px-3 py-1 rounded-full bg-orange-500/10">
            <Calculator size={14} /> Intelligent Risk
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
          <span className="text-orange-500">{data.symbol}</span> Safety Stops
        </h1>
        <p className="text-zinc-400 max-w-xl mx-auto text-lg">
            Calculated live using institutional volatility data. Current Market Volatility (ATR): <span className="text-white font-mono font-bold">{atrString}</span>
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

      <div className="max-w-5xl mx-auto">
        
        {/* CALCULATOR DASHBOARD */}
        <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="h-1 w-full bg-gradient-to-r from-green-500 via-orange-500 to-red-500" />
            
            <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-12 relative">
                    
                    {/* CENTER DIVIDER (Visual Only) */}
                    <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-zinc-800/50 -translate-x-1/2" />

                    {/* LONG (BUY) COLUMN */}
                    <div>
                        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-zinc-800/50">
                            <div className="bg-green-900/20 p-3 rounded-xl text-green-500 border border-green-900/50">
                                <ArrowUp size={28}/>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-2xl">Buying {data.symbol}</h3>
                                <p className="text-xs text-green-400 font-bold uppercase tracking-wider">Stop Loss Below</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Scalp - Free */}
                            <RiskRow 
                              type="Scalp" 
                              desc="Tight Protection" 
                              label={calculations.long.scalp.label} 
                              value={calculations.long.scalp.level} 
                              isFree={true}
                            />
                            
                            {/* Day Trade - Blurred Premium */}
                            <PremiumRiskRow 
                              type="Day Trade" 
                              desc="Standard Risk" 
                              label={calculations.long.day.label} 
                              value={calculations.long.day.level} 
                              highlight={true}
                              color="green"
                              isPremium={true}
                              originalValue={calculations.long.day.level}
                            />
                            
                            {/* Swing - Blurred Premium */}
                            <PremiumRiskRow 
                              type="Swing" 
                              desc="Deep Protection" 
                              label={calculations.long.swing.label} 
                              value={calculations.long.swing.level} 
                              highlight={false}
                              color="green"
                              isPremium={true}
                              originalValue={calculations.long.swing.level}
                            />
                        </div>
                    </div>

                    {/* SHORT (SELL) COLUMN */}
                    <div>
                        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-zinc-800/50">
                            <div className="bg-red-900/20 p-3 rounded-xl text-red-500 border border-red-900/50">
                                <ArrowDown size={28}/>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-2xl">Selling {data.symbol}</h3>
                                <p className="text-xs text-red-400 font-bold uppercase tracking-wider">Stop Loss Above</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Scalp - Free */}
                            <RiskRow 
                              type="Scalp" 
                              desc="Tight Protection" 
                              label={calculations.short.scalp.label} 
                              value={calculations.short.scalp.level} 
                              isFree={true}
                            />
                            
                            {/* Day Trade - Blurred Premium */}
                            <PremiumRiskRow 
                              type="Day Trade" 
                              desc="Standard Risk" 
                              label={calculations.short.day.label} 
                              value={calculations.short.day.level} 
                              highlight={true}
                              color="red"
                              isPremium={true}
                              originalValue={calculations.short.day.level}
                            />
                            
                            {/* Swing - Blurred Premium */}
                            <PremiumRiskRow 
                              type="Swing" 
                              desc="Deep Protection" 
                              label={calculations.short.swing.label} 
                              value={calculations.short.swing.level} 
                              highlight={false}
                              color="red"
                              isPremium={true}
                              originalValue={calculations.short.swing.level}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* FOOTER NOTICE */}
            <div className="bg-zinc-900/40 p-4 text-center border-t border-zinc-800">
                <p className="text-xs text-zinc-500 font-medium flex justify-center gap-2 items-center">
                    <ShieldAlert size={12} className="text-orange-500" />
                    Values update dynamically. Recheck before entering.
                </p>
            </div>
        </div>

        {/* --- FOOTER --- */}
        <SymbolNavigation symbol={symbol} />
      </div>
    </div>
  );
}

// Cleaner Sub-Component for UI - Free version
function RiskRow({ type, desc, label, value, highlight, color, isFree = true }: any) {
    const activeColor = color === 'green' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30';
    
    return (
        <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${highlight ? activeColor : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold text-sm">{type}</span>
                    <span className="text-[9px] bg-black/40 px-2 py-0.5 rounded text-zinc-400 uppercase font-bold tracking-wide">{desc}</span>
                </div>
                <span className="text-xs text-zinc-500 font-mono pl-1">{label}</span>
            </div>
            <div className="text-right">
                <span className="block font-mono text-xl font-black text-white tracking-tighter drop-shadow-md">
                    {value}
                </span>
            </div>
        </div>
    )
}

// Premium Sub-Component with Blur and Unlock Logic
function PremiumRiskRow({ type, desc, label, value, highlight, color, isPremium = false, originalValue }: any) {
    const activeColor = color === 'green' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30';
    
    return (
        <div className={`target-level-premium group relative p-4 rounded-xl border transition-all cursor-pointer ${highlight ? activeColor : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
            <div className="flex items-center justify-between z-10 relative">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-bold text-sm">{type}</span>
                        <span className="text-[9px] bg-black/40 px-2 py-0.5 rounded text-zinc-400 uppercase font-bold tracking-wide">{desc}</span>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono pl-1">{label}</span>
                </div>
                <div className="text-right">
                    <div className="target-level-blurred font-mono text-xl font-black tracking-tighter drop-shadow-md">
                        {value}
                    </div>
                </div>
            </div>
            
            {/* Hover Reveal Overlay */}
            <div className="target-level-premium-overlay">
                <a href="/client/login" className="target-level-unlock-link">
                    <Zap size={12} className="inline mr-1" />
                    UNLOCK PREMIUM
                </a>
            </div>
        </div>
    )
}

// Helper function for calculator logic (replaces server-side generator)
function generateCalculatorReport(data: any, symbol: string) {
  const v = data?.volatility;
  const currentPrice = data?.trend?.current_price || 0;
  const atr = v?.current_atr || 0;
  
  // Format with proper decimals for symbol
  const fmt = (n: number) => formatPriceForSymbol(symbol, n);
  
  // Calculate stop loss levels
  const calculations = {
    long: {
      scalp: { 
        level: fmt(currentPrice - atr), 
        label: "1.0x ATR" 
      },
      day: { 
        level: fmt(currentPrice - (atr * 1.5)), 
        label: "1.5x ATR" 
      },
      swing: { 
        level: fmt(currentPrice - (atr * 2.5)), 
        label: "2.5x ATR" 
      }
    },
    short: {
      scalp: { 
        level: fmt(currentPrice + atr), 
        label: "1.0x ATR" 
      },
      day: { 
        level: fmt(currentPrice + (atr * 1.5)), 
        label: "1.5x ATR" 
      },
      swing: { 
        level: fmt(currentPrice + (atr * 2.5)), 
        label: "2.5x ATR" 
      }
    }
  };

  return {
    atrString: fmt(atr),
    calculations
  };
}