// components/AnalysisClientView.tsx
'use client';

import { 
  Activity, ArrowRight, Gauge, Layers, 
  Cpu, Thermometer, Box, LineChart, Bot,
  Link
} from 'lucide-react';
import NotificationButton from '@/components/NotificationButton'; 
import LiveSeoSchema from '@/components/LiveSeoSchema';
import SymbolNavigation from '@/components/SymbolNavigation';
import { formatPriceForSymbol } from '../landing/app/lib/formatting';

interface AnalysisClientViewProps {
  data: any;
  symbol: string;
}

export default function AnalysisClientView({ data, symbol }: AnalysisClientViewProps) {
  if (!data || !data.trend) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-gray-200">
        <h1 className="text-2xl font-semibold mb-2">
          Analysis not available
        </h1>
        <p className="text-sm text-gray-400">
          We couldn&apos;t load analysis data for{" "}
          <span className="font-mono font-bold">
            {symbol?.toUpperCase() || "this symbol"}
          </span>
          . Please try another symbol or refresh the page.
        </p>
      </div>
    );
  }

  const { trend, momentum, volatility, zones } = data;
  const report = generateAnalysisReport(data, symbol);

  // Derived Values
  const volatilityPercent = Math.min(100, Math.round((volatility?.volatility_score || 0) * 100));
  const trendPercent = trend.trend_strength_score || 0;
  const isHighRisk = volatility?.volatility_level === 'high';

  return (
    <main className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-blue-500/30">
      
      {/* SEO Schema */}
      <LiveSeoSchema data={data} />
      
      {/* 1. TICKER TAPE HEADER */}
      <div className="pt-28 pb-8 px-6 border-b border-zinc-900 bg-gradient-to-b from-zinc-900/50 to-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <div className="inline-flex items-center gap-2 px-2 py-1 mb-3 rounded border border-blue-500/30 bg-blue-900/20 text-blue-400 text-[10px] uppercase font-bold tracking-widest font-mono">
                    <Cpu size={12} /> System Status: Online
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                    {data.symbol} <span className="text-zinc-600">Matrix</span>
                </h1>
                <p className="text-zinc-400 text-sm mt-2 max-w-lg">
                    Full Market Structure Deconstruction
                </p>
            </div>
            
            <div className="text-right">
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Current Price Action</p>
                <p className="text-4xl font-mono font-bold text-white tracking-tight">
                  {formatPriceForSymbol(symbol, trend.current_price)}
                </p>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10">
        
        {/* --- 2. BENTO GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* BLOCK A: TREND ARCHITECTURE (Wide) */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 relative overflow-hidden group hover:border-blue-900/50 transition duration-500">
                <div className="absolute top-0 right-0 p-32 bg-blue-600/5 blur-3xl rounded-full"></div>
                
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Layers size={20} /></div>
                    <h3 className="text-lg font-bold text-white">Trend Architecture</h3>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <span className="text-xs text-zinc-500 uppercase font-bold">Structure Mode</span>
                        <p className="text-2xl font-bold text-white mt-1 capitalize">{(trend.trend || 'NEUTRAL').replace(/_/g, ' ')}</p>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                            Price is currently positioned <strong>{(trend.price_position?.vs_ema50 || 'NEAR').toUpperCase()}</strong> the baseline institutional MA (EMA50), signaling dominance by {(trend.trend || '').includes('bull') ? 'Buyers' : 'Sellers'}.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="flex justify-between text-xs font-bold text-zinc-500 mb-2">
                            <span>Strength</span>
                            <span>{trendPercent}/100</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-3 bg-black rounded-full overflow-hidden border border-zinc-800">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000"
                                style={{ width: `${trendPercent}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BLOCK B: MOMENTUM THERMAL (Tall) */}
            <div className="md:row-span-2 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Thermometer size={20} /></div>
                    <h3 className="text-lg font-bold text-white">Market Thermal</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center">
                    <div className="w-full relative h-40 bg-zinc-950 rounded-xl border border-zinc-800 flex items-end px-8 overflow-hidden mb-6">
                        {/* Fake Wave Animation */}
                        <div 
                            className={`w-full transition-all duration-1000 opacity-60 ${(momentum.rsi_latest || 50) > 60 ? 'bg-purple-500' : 'bg-emerald-500'}`}
                            style={{ height: `${momentum.rsi_latest || 50}%`, filter: 'blur(20px)' }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-black text-white">{(momentum.rsi_latest || 50).toFixed(1)}</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">RSI Oscillator</span>
                        </div>
                    </div>

                    <div className="w-full text-left space-y-3">
                        <MetricRow 
                          label="Velocity Bias" 
                          value={(momentum.momentum_bias || 'NEUTRAL').toUpperCase()} 
                        />
                        <MetricRow 
                          label="Divergence" 
                          value={(momentum.divergence_detected || 'none').toUpperCase()} 
                          highlight={momentum.divergence_detected !== 'none'} 
                        />
                        <MetricRow 
                          label="Slope Angle" 
                          value={(momentum.rsi_slope || 0).toFixed(4)} 
                        />
                    </div>
                </div>
            </div>

            {/* BLOCK C: VOLATILITY ENGINE (Wide) */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><Activity size={20} /></div>
                        <h3 className="text-lg font-bold text-white">Volatility Regime</h3>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${isHighRisk ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {(volatility?.volatility_level || 'medium')} Risk
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatBox 
                      label="ATR (Daily)" 
                      value={formatPriceForSymbol(symbol, volatility?.current_atr)} 
                    />
                    <StatBox 
                      label="Historical Avg" 
                      value={formatPriceForSymbol(symbol, volatility?.avg_range)} 
                    />
                    <StatBox 
                      label="Range Status" 
                      value={volatility?.volatility_regime || 'neutral'} 
                      capitalize 
                    />
                    <StatBox 
                      label="Rec. Stop" 
                      value={`${volatility?.optimal_sl_multiplier || 1.5}x ATR`} 
                      highlight 
                    />
                </div>
            </div>

        </div>

        {/* Optional: Add speakable summary for Google Voice */}
        <p className="summary text-zinc-400 mt-6 mb-4 text-center text-sm">
          Latest analysis: {data.final_decision || 'HOLD'} signal at {formatPriceForSymbol(symbol, trend.current_price)}. 
          {(trend.trend || '').includes('bull') ? ' Bullish' : ' Bearish'} momentum with {volatility?.volatility_level || 'medium'} volatility.
        </p>

        <div className="ai-validation-box flex items-start gap-4">
          <div className="ai-icon-container">
            <Bot size={24} />
          </div>
          <div className="ai-validation-content">
            <h4 className="ai-validation-title">
              Is this setup confirmed right now?
            </h4>
            <p className="ai-validation-description">
              This report is based on H1/H4 market structure. 
              For <strong>Scalping entries (M5/M15)</strong> or News validation, 
              you need real-time confirmation.
            </p>
            <a href="/AIChat" className="ai-validation-link">
              Validate this trade with AI Analyst
            </a>
          </div>
        </div>
        
        {/* --- 3. WRITTEN ANALYSIS & REPORT --- */}
        <div className="dash-grid-container">
          {/* Left Panel: The Diagnosis */}
          <div className="dash-card-left">
            <span className="dash-label">Diagnostic System Report</span>
            
            <div>
              <p className="dash-health-text">{report.health_check}</p>
              
              {/* Embedded Liquidity Note */}
              <div className="dash-liquidity-box">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Liquidity Status</span>
                {report.liquidity}
              </div>
            </div>
          </div>

          {/* Right Panel: The Verdict & Action */}
          <div className="dash-card-right">
            <span className="dash-label">Algorithm Final Verdict</span>
            
            <p className="dash-verdict-text">
              "{report.verdict}"
            </p>
            
            {/* Action Button & Disclaimer */}
            <div className="mt-auto">
              <NotificationButton />
              <p className="dash-subtext">Receive live updates when market structure shifts.</p>
            </div>
          </div>
        </div>

      </div>

      {/* --- FOOTER --- */}
      <SymbolNavigation symbol={symbol} />
    </main>
  );
}

// --- HELPER COMPONENTS ---

function MetricRow({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-xs text-zinc-500 uppercase font-semibold">{label}</span>
      <span className={`text-sm font-mono font-bold ${highlight ? 'text-yellow-400' : 'text-white'}`}>{value}</span>
    </div>
  );
}

function StatBox({ label, value, capitalize = false, highlight = false }: { 
  label: string, 
  value: string, 
  capitalize?: boolean, 
  highlight?: boolean 
}) {
  return (
    <div className="p-4 bg-black/40 rounded-xl border border-zinc-800/50">
      <span className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">{label}</span>
      <span className={`block text-lg font-bold ${highlight ? 'text-amber-400' : 'text-white'} ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </span>
    </div>
  );
}

// Helper function for analysis report generation
function generateAnalysisReport(data: any, symbol: string) {
  const sym = data.symbol?.toUpperCase() || symbol.toUpperCase();
  const t = data.trend || {};
  const m = data.momentum || {};
  const v = data.volatility || {};
  const z = data.zones || {};

  // 1. STRUCTURE ANALYSIS
  let structure = "Neutral / Ranging";
  if (t.ema_alignment === 'bullish' && (m.rsi_latest || 50) > 50) structure = "Constructive Bullish Structure";
  if (t.ema_alignment === 'bearish' && (m.rsi_latest || 50) < 50) structure = "Deteriorating Bearish Structure";

  // 2. CONFLUENCE SCORE (How many indicators agree?)
  let confluenceCount = 0;
  if (t.trend_strength === 'strong') confluenceCount++;
  if (m.momentum_strength !== 'weak') confluenceCount++;
  if (z.zone_strength === 'strong') confluenceCount++;
  
  const confluenceText = confluenceCount === 3 
    ? "High Confluence (Institutions Active)" 
    : confluenceCount === 2 
        ? "Moderate Confluence (Standard Market)" 
        : "Low Confluence (Retail Noise)";

  // Format prices
  const supportZone = formatPriceForSymbol(symbol, z.support_zone);
  const resistanceZone = formatPriceForSymbol(symbol, z.resistance_zone);

  return {
    health_check: `
      Price action for ${sym} is exhibiting a **${structure}**. 
      The correlation between Trend Flow and Momentum is currently **${m.trend_alignment || 'neutral'}**, which confirms ${m.trend_alignment === 'aligned' ? 'movement authenticity' : 'potential divergence'}.
    `,
    liquidity: `
      Order flow analysis identifies specific activity near the **${supportZone}** (Demand) and **${resistanceZone}** (Supply) pools.
      Volatility metrics suggest a **${v.volatility_regime || 'neutral'}** environment, requiring ${v.volatility_level === 'high' ? 'loose stops' : 'standard position sizing'}.
    `,
    verdict: `
      Market Reality: ${confluenceText}.
      Primary Driver: ${(t.trend_strength_score || 0) > ((m.momentum_strength?.length || 0) * 10) ? "Trend Following" : "Mean Reversion"}
    `
  };
}