import { getSymbolData } from '@/app/lib/fetchData';
import { getAvailableSetupSymbols } from '@/app/lib/fetchSetup';
import { generateIndicatorReport } from '@/app/lib/seo/indicatorGenerator';
import { notFound } from 'next/navigation';
import { Activity, Zap, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Gauge, Bot } from 'lucide-react';

export const revalidate = 60;
export const dynamicParams = true;

// Update Props type to accept Promise
type Props = {
  params: Promise<{ symbol: string }>;
};

// 1. Static Paths
export async function generateStaticParams() {
  const symbols = await getAvailableSetupSymbols();
  return symbols.map((sym) => ({ symbol: sym.toLowerCase().replace('/', '-') }));
}

// 2. Metadata - unwrap the Promise
export async function generateMetadata({ params }: Props) {
  // Unwrap the Promise
  const { symbol } = await params;
  
  const data = await getSymbolData(symbol);
  if (!data) return { title: 'Indicator Not Found' };
  
  const report = generateIndicatorReport(data);
  return {
    title: report.title,
    description: report.desc,
  };
}

export default async function IndicatorPage({ params }: Props) {
  // Unwrap the Promise
  const { symbol } = await params;
  
  const data = await getSymbolData(symbol);
  if (!data) notFound();

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
                    <span className="text-white font-mono">{data.momentum.momentum_bias.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                    <span className="text-zinc-500 text-xs uppercase font-bold">Velocity Strength</span>
                    <span className="text-white font-mono">{data.momentum.momentum_strength}</span>
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