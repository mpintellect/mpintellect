import { Metadata } from 'next';
import { getSymbolData } from '../../lib/fetchData'; 
import { generateVolatilityReport } from '../../lib/seo/volatilityGenerator';
import NotificationButton from '@/components/NotificationButton'; 
import { BarChart3, Activity, ShieldAlert, ArrowRight, TrendingUp, Bot } from 'lucide-react';

// Update Props type to accept Promise
type Props = { 
  params: Promise<{ symbol: string }>;
};

// DYNAMIC SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Unwrap the Promise
  const { symbol } = await params;
  
  const data = await getSymbolData(symbol);
  if (!data) return { title: `Volatility: ${symbol} | MZPrimer ` };
  
  const report = generateVolatilityReport(data);
  return {
    title: report.title + " | MZPrimer ",
    description: report.metaDesc,
  };
}

export default async function VolatilityPage({ params }: Props) {
  // Unwrap the Promise
  const { symbol } = await params;
  
  const data = await getSymbolData(symbol);

  if (!data || !data.volatility) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  const v = data.volatility;
  const text = generateVolatilityReport(data);
  
  // Dynamic Styling Logic
  const isHighRisk = v.volatility_score > 0.6;
  const accentColor = isHighRisk ? "text-amber-500" : "text-blue-400"; // Orange vs Calm Blue
  const barColor = isHighRisk ? "bg-amber-500" : "bg-blue-500";
  const glowStyle = isHighRisk 
    ? "bg-gradient-to-br from-amber-900/20 to-black border-amber-900/30" 
    : "bg-gradient-to-br from-blue-900/20 to-black border-blue-900/30";

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-purple-500/30">
      
      {/* --- HERO HEADER --- */}
      <div className="pt-28 pb-10 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
           <BarChart3 size={12} className="text-purple-500" /> Market Physics Engine
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter text-white">
           {data.symbol} <span className={accentColor}>{v.volatility_level} Vol</span>
        </h1>
        
        <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
           Risk Management Profile & Range Expansion Analysis
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-12 gap-8">
        
        {/* --- MAIN DASHBOARD CARD --- */}
        <div className={`md:col-span-8 p-8 rounded-3xl relative overflow-hidden glass-volatility-card ${glowStyle}`}>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <span className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <ShieldAlert size={14} /> Implied Risk Score
                </span>
                <span className="text-xs font-mono font-bold text-white px-2 py-1 rounded bg-white/10">
                    ATR: {v.current_atr.toFixed(2)}
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
                            style={{ width: `${Math.min(v.volatility_score * 100, 100)}%` }}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-50 shadow-[0_0_10px_white]"></div>
                        </div>
                    </div>
                    
                    <div className="mt-2 text-right">
                        <span className={`text-4xl font-black ${accentColor}`}>{v.volatility_score.toFixed(2)}</span>
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
                            <p className="text-xl font-mono font-bold text-white">{Math.floor(v.avg_range)} <span className="text-xs font-sans font-normal opacity-50">PTS</span></p>
                        </div>
                    </div>

                    {/* Stat B: SL Setting */}
                    <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                            <ShieldAlert size={18} className={accentColor} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Recommended Stop</p>
                            <p className="text-xl font-mono font-bold text-white">{v.optimal_sl_multiplier}x <span className="text-xs font-sans font-normal opacity-50">ATR</span></p>
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
                <h4 className="text-white font-bold text-lg mb-2">Regime: {v.volatility_regime.toUpperCase()}</h4>
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
<section className="mt-24 border-t border-zinc-900 pt-10 pb-20 text-center max-w-4xl mx-auto">
    
    <div className="flex flex-wrap justify-center gap-3 my-6">
        {/* 1. Strategy & Setup */}
        <a href={`/trade/${symbol}`} className="seo-chip-link">
           Trade Setup <ArrowRight size={14} />
        </a>
        
        <a href={`/trend/${symbol}`} className="seo-chip-link">
           Trend Direction <ArrowRight size={14} />
        </a>

        <a href={`/forecast/${symbol}`} className="seo-chip-link">
           AI Forecast <ArrowRight size={14} />
        </a>

        {/* 2. Technical Tools */}
        <a href={`/calculator/${symbol}`} className="seo-chip-link">
           Trade Calculator <ArrowRight size={14} />
        </a>
        
        <a href={`/indicator/${symbol}`} className="seo-chip-link">
           Indicator RSI Score <ArrowRight size={14} />
        </a>

        {/* 3. Deep Analysis */}
        <a href={`/zones/${symbol}`} className="seo-chip-link">
           Liquidity Zones <ArrowRight size={14} />
        </a>

        <a href={`/momentum/${symbol}`} className="seo-chip-link">
           Momentum Score <ArrowRight size={14} />
        </a>

        <a href={`/volatility/${symbol}`} className="seo-chip-link">
           Volatility Risk <ArrowRight size={14} />
        </a>

        <a href={`/analysis/${symbol}`} className="seo-chip-link border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">
           Full Analysis <ArrowRight size={14} />
        </a>
    </div>

    {/* --- NEW AI CHAT CTA --- */}
    <div className="mt-12 mb-8">
        <p className="text-zinc-500 text-xs mb-4">Have specific questions about {symbol}?</p>
        
        <a href="/AIChat" className="btn-ai-chat-pulse">
            <Bot size={20} fill="currentColor" className="text-blue-200" /> 
            Chat with AI Analyst
        </a>
    </div>

</section>

    </div>
  );
}