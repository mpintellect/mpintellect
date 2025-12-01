import { Metadata } from 'next';
import { getSymbolData } from '../../lib/fetchData'; 
import { generateTrendReport } from '../../lib/seo/trendGenerator';
import NotificationButton from '@/components/NotificationButton';
import { TrendingUp, Activity, Layers, ArrowRight, Gauge, Zap, Bot } from 'lucide-react';

type Props = { params: { symbol: string } };

// 1. DYNAMIC SEO METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getSymbolData(params.symbol);
  
  if (!data || !data.trend) {
    return { title: `Trend Analysis: ${params.symbol.toUpperCase()} | MZPrimer ` };
  }

  const report = generateTrendReport(data);
  return {
    title: `${report.title} | MZPrimer  AI`,
    description: report.metaDesc,
  };
}

export default async function TrendPage({ params }: Props) {
  // 2. FETCH DATA
  const data = await getSymbolData(params.symbol);

  // Loading/Error State
  if (!data || !data.trend) {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
            <div className="text-center">
                <div className="w-12 h-12 border-t-2 border-yellow-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
                <p className="opacity-50 text-sm">Syncing live data for {params.symbol}...</p>
            </div>
        </div>
    )
  }

  // 3. VARIABLES & STYLES
  const text = generateTrendReport(data);
  const t = data.trend;
  
  const isBullish = t.trend.toLowerCase() === 'bullish';
  
  // Colors based on logic
  const accentColor = isBullish ? "text-emerald-400" : "text-rose-400";
  const strokeColor = isBullish ? "#34d399" : "#fb7185"; 
  
  // Dynamic gradient tint for the glass card
  const bgTint = isBullish 
    ? "bg-gradient-to-br from-emerald-900/20 to-transparent" 
    : "bg-gradient-to-br from-rose-900/20 to-transparent";

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-yellow-500/30">
      
      {/* --- 1. HERO HEADER --- */}
      <div className="pt-28 pb-10 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
           <Activity size={12} className="text-yellow-500" /> Algo Trend Engine
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter text-white">
           {data.symbol} <span className={accentColor}>{t.trend}</span>
        </h1>
        
        <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
           Institutional Directional Bias & Structure Analysis
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-12 gap-8">
        
        {/* --- 2. MAIN DASHBOARD GLASS CARD --- */}
        <div className={`md:col-span-8 p-8 rounded-3xl relative overflow-hidden glass-trend-card ${bgTint}`}>
            
            {/* Visual Header within card */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <span className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Gauge size={14} /> Strength Meter
                </span>
                <span className={`text-xs font-black uppercase px-2 py-1 rounded bg-white/5 border border-white/10 ${accentColor}`}>
                    {t.trend_strength.replace(/_/g, " ")}
                </span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                
                {/* GAUGE CHART (SVG) */}
                <div className="relative w-64 h-64 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        {/* Background Track */}
                        <path className="text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
                        {/* Active Value Ring with Glow */}
                        <path 
                            className="filter-glow transition-all duration-1000 ease-out"
                            stroke={strokeColor}
                            strokeDasharray={`${t.trend_strength_score}, 100`} 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            fill="none" strokeWidth="2" strokeLinecap="round"
                        />
                    </svg>
                    {/* Centered Number */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-black tracking-tighter text-white">{t.trend_strength_score}</span>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">/ 100 Score</span>
                    </div>
                </div>

                {/* METRICS COLUMN */}
                <div className="w-full space-y-6">
                    <div>
                        <h3 className="text-[10px] text-zinc-500 font-bold uppercase mb-3 flex items-center gap-2">
                            <Layers size={12} /> EMA Structure
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col">
                                <span className="text-[9px] text-zinc-500 uppercase font-bold">Structure</span>
                                <span className="text-sm font-bold text-white capitalize mt-1">
                                    {t.ema_alignment.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col">
                                <span className="text-[9px] text-zinc-500 uppercase font-bold">Position</span>
                                <span className="text-sm font-bold text-white mt-1">
                                    {t.price_position.vs_ema50.replace('_', ' ').toUpperCase()} EMA 50
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg border border-white/5">
                            <span className="text-xs font-medium text-emerald-400">EMA 8 (Fast)</span>
                            <span className="text-sm font-mono text-white font-bold">{t.current_emas.ema_8}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg border border-white/5">
                            <span className="text-xs font-medium text-blue-400">EMA 21 (Baseline)</span>
                            <span className="text-sm font-mono text-white font-bold">{t.current_emas.ema_21}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg border border-white/5">
                            <span className="text-xs font-medium text-yellow-500">EMA 50 (Macro)</span>
                            <span className="text-sm font-mono text-white font-bold">{t.current_emas.ema_50}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- 3. SIDEBAR / NOTIFICATIONS --- */}
        <div className="md:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-center h-full">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 mb-4">
                    <Zap size={20} />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Track {data.symbol}</h4>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed px-2">
                    Our AI monitors trend strength shifts 24/7. Get instant alerts when market structure flips.
                </p>
                {/* CTA BUTTON */}
                <NotificationButton />
            </div>
        </div>

      </div>

      {/* --- 4. SEO CONTENT (Using 'prose' class from global CSS) --- */}
      <section className="report-container">
    {/* Clean Header */}
    <h2 className="report-header">Technical Analysis Report</h2>
    
    <div>
       {/* 1. Context - The Story */}
       <p className="report-context">
          {text.context}
       </p>
       
       {/* 2. Technicals - The Data Evidence */}
       <div className="report-technicals-box">
          {text.technicals}
       </div>
       
       {/* 3. Verdict - The Final Decision */}
       <div className="report-verdict-card">
           <span className="report-verdict-label">FINAL VERDICT</span>
           <p className="report-verdict-text">
               {text.verdict}
           </p>
       </div>
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