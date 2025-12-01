import { Metadata } from 'next';
import { getSymbolData } from '../../lib/fetchData'; 
import { generateMomentumReport } from '../../lib/seo/momentumGenerator';
import NotificationButton from '@/components/NotificationButton'; 
import { Zap, Activity, Waves, ArrowRight, GaugeCircle, Bot } from 'lucide-react';

type Props = { params: { symbol: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getSymbolData(params.symbol);
  
  if (!data || !data.momentum) {
      return { title: `Momentum: ${params.symbol} | MZPrimer ` };
  }
  
  const report = generateMomentumReport(data);
  return {
    title: report.title,
    description: report.metaDesc,
  };
}

export default async function MomentumPage({ params }: Props) {
  const data = await getSymbolData(params.symbol);

  // Guard Clause for Loading/Error
  if (!data || !data.momentum) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Syncing Market Data...</div>;
  }

  const m = data.momentum;
  const text = generateMomentumReport(data);
  const rsiVal = m.rsi_latest; // 0-100 range

  // Visual Logic
  const isHot = rsiVal > 65; // Overbought territory
  const isCold = rsiVal < 35; // Oversold territory
  
  // Dynamic Coloring
  const rsiColor = isHot ? "text-rose-400" : isCold ? "text-emerald-400" : "text-purple-400";
  const glowClass = isHot 
    ? "shadow-[0_0_20px_-5px_rgba(244,63,94,0.6)]" // Red glow
    : isCold 
      ? "shadow-[0_0_20px_-5px_rgba(16,185,129,0.6)]" // Green glow
      : "shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]"; // Purple glow

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-purple-500/30">
      
      {/* HEADER SECTION */}
      <div className="pt-28 pb-10 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-purple-500/30 bg-purple-900/10 text-purple-300 text-[10px] uppercase font-bold tracking-widest">
           <Zap size={12} className="fill-current" /> Kinetic Energy
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter text-white">
           {data.symbol} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Momentum</span>
        </h1>
        
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
           Oscillator Health & Buying Velocity Analysis
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-12 gap-8">
        
        {/* --- THE MAIN DASHBOARD (Glass Card) --- */}
        <div className="md:col-span-8 p-8 rounded-3xl relative overflow-hidden glass-momentum-card">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <span className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Waves size={14} /> RSI Heatmap
                </span>
                <span className={`text-xs font-mono font-bold px-2 py-1 rounded bg-white/5 border border-white/10 ${rsiColor}`}>
                    READING: {rsiVal.toFixed(2)}
                </span>
            </div>

            <div className="flex flex-col gap-10">
                
                {/* 1. RSI LINEAR METER */}
                <div className="relative pt-4 pb-2">
                    <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-2 tracking-widest uppercase">
                        <span>Oversold (30)</span>
                        <span>Equilibrium (50)</span>
                        <span>Overbought (70)</span>
                    </div>
                    
                    {/* The Meter Track */}
                    <div className="w-full h-8 bg-zinc-900 rounded-lg border border-zinc-800 relative overflow-hidden">
                        {/* Zone Markers */}
                        <div className="absolute left-0 w-[30%] h-full bg-emerald-900/20 border-r border-dashed border-white/10"></div>
                        <div className="absolute right-0 w-[30%] h-full bg-rose-900/20 border-l border-dashed border-white/10"></div>
                        
                        {/* The Indicator Needle */}
                        <div 
                            className={`absolute top-0 bottom-0 w-1.5 h-full bg-white transition-all duration-700 ease-out z-10 ${glowClass}`}
                            style={{ left: `${Math.min(Math.max(rsiVal, 0), 100)}%` }}
                        >
                            {/* Floating Bubble Value */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] font-bold px-3 py-1.5 rounded border border-white/10 whitespace-nowrap shadow-lg">
                                {Math.round(rsiVal)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. KEY METRICS GRID */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-2xl flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <Activity size={14} className="text-purple-400" />
                            <span className="text-[10px] uppercase text-zinc-400 font-bold">Trend Alignment</span>
                        </div>
                        <p className="text-lg font-bold text-white capitalize">{m.trend_alignment.replace(/_/g, " ")}</p>
                    </div>

                    <div className="bg-cyan-900/10 border border-cyan-500/20 p-4 rounded-2xl flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <GaugeCircle size={14} className="text-cyan-400" />
                            <span className="text-[10px] uppercase text-zinc-400 font-bold">Slope Velocity</span>
                        </div>
                        <p className="text-lg font-bold text-white font-mono">{m.rsi_slope.toFixed(4)}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- SIDEBAR ACTION --- */}
        <div className="md:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-center h-full">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isHot ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    <Zap size={24} fill="currentColor" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">{isHot ? "Hot" : isCold ? "Cool" : "Neutral"}</h4>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed px-2">
                    Current momentum implies a <strong>{m.momentum_strength}</strong> strength rating. 
                    {m.divergence_detected !== 'none' && <span className="text-yellow-500 block mt-2">⚠️ Divergence Spotted</span>}
                </p>
                <NotificationButton />
            </div>
        </div>

      </div>

      {/* --- WRITTEN CONTENT (SEO) --- */}
      <section className="velo-container">
    <h2 className="velo-header">Velocity Analysis Report</h2>
    
    <div>
       {/* 1. Context */}
       <p className="velo-context">
          {text.context}
       </p>
       
       {/* 2. Stats (The Terminal Card) */}
       <div className="velo-terminal-card">
          <p className="velo-terminal-text">
              {text.stats}
          </p>
       </div>
       
       {/* 3. Verdict (The Kinetic Summary) */}
       <p className="velo-verdict">
           "{text.verdict}"
       </p>
    </div>
</section>

      {/* --- FOOTER --- */}
<section className="mt-24 border-t border-zinc-900 pt-10 pb-20 text-center max-w-4xl mx-auto">
    
    <div className="flex flex-wrap justify-center gap-3 my-6">
        {/* 1. Strategy & Setup */}
        <a href={`/trade/${params.symbol}`} className="seo-chip-link">
           Trade Setup <ArrowRight size={14} />
        </a>
        
        <a href={`/trend/${params.symbol}`} className="seo-chip-link">
           Trend Direction <ArrowRight size={14} />
        </a>

        <a href={`/forecast/${params.symbol}`} className="seo-chip-link">
           AI Forecast <ArrowRight size={14} />
        </a>

        {/* 2. Technical Tools */}
        <a href={`/calculator/${params.symbol}`} className="seo-chip-link">
           Trade Calculator <ArrowRight size={14} />
        </a>
        
        <a href={`/indicator/${params.symbol}`} className="seo-chip-link">
           Indicator RSI Score <ArrowRight size={14} />
        </a>

        {/* 3. Deep Analysis */}
        <a href={`/zones/${params.symbol}`} className="seo-chip-link">
           Liquidity Zones <ArrowRight size={14} />
        </a>

        <a href={`/momentum/${params.symbol}`} className="seo-chip-link">
           Momentum Score <ArrowRight size={14} />
        </a>

        <a href={`/volatility/${params.symbol}`} className="seo-chip-link">
           Volatility Risk <ArrowRight size={14} />
        </a>

        <a href={`/analysis/${params.symbol}`} className="seo-chip-link border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">
           Full Analysis <ArrowRight size={14} />
        </a>
    </div>

    {/* --- NEW AI CHAT CTA --- */}
    <div className="mt-12 mb-8">
        <p className="text-zinc-500 text-xs mb-4">Have specific questions about {params.symbol}?</p>
        
        <a href="/AIChat" className="btn-ai-chat-pulse">
            <Bot size={20} fill="currentColor" className="text-blue-200" /> 
            Chat with AI Analyst
        </a>
    </div>

</section>

    </div>
  );
}