import { Metadata } from 'next';
import { getSymbolData } from '../../lib/fetchData'; 
import { generateAnalysisReport } from '../../lib/seo/analysisGenerator';
import NotificationButton from '@/components/NotificationButton'; 
import { 
  Activity, ArrowRight, Gauge, Layers, 
  Cpu, Thermometer, Box, LineChart 
} from 'lucide-react';

type Props = { params: { symbol: string } };

// --- METADATA ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getSymbolData(params.symbol);
  if (!data) return { title: `Technical Analysis: ${params.symbol} | MZPrimer ` };
  
  const report = generateAnalysisReport(data);
  return {
    title: report.title,
    description: report.metaDesc,
  };
}

// --- MAIN PAGE ---
export default async function AnalysisPage({ params }: Props) {
  const data = await getSymbolData(params.symbol);

  // Guard
  if (!data || !data.trend) {
    return (
        <div className="min-h-screen bg-black flex justify-center items-center text-zinc-500 font-mono">
            Loading System Architecture...
        </div>
    )
  }

  const report = generateAnalysisReport(data);
  const { trend, momentum, volatility } = data;

  // Derived Values
  const volatilityPercent = Math.min(100, Math.round(volatility.volatility_score * 100));
  const trendPercent = trend.trend_strength_score;
  const isHighRisk = volatility.volatility_level === 'high';

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-blue-500/30">
      
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
                    {trend.current_price}
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
                        <p className="text-2xl font-bold text-white mt-1 capitalize">{trend.trend.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                            Price is currently positioned <strong>{trend.price_position.vs_ema50.toUpperCase()}</strong> the baseline institutional MA (EMA50), signaling dominance by {trend.trend.includes('bull') ? 'Buyers' : 'Sellers'}.
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
                            className={`w-full transition-all duration-1000 opacity-60 ${momentum.rsi_latest > 60 ? 'bg-purple-500' : 'bg-emerald-500'}`}
                            style={{ height: `${momentum.rsi_latest}%`, filter: 'blur(20px)' }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-black text-white">{momentum.rsi_latest.toFixed(1)}</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">RSI Oscillator</span>
                        </div>
                    </div>

                    <div className="w-full text-left space-y-3">
                        <MetricRow label="Velocity Bias" value={momentum.momentum_bias.toUpperCase()} />
                        <MetricRow label="Divergence" value={momentum.divergence_detected.toUpperCase()} highlight={momentum.divergence_detected !== 'none'} />
                        <MetricRow label="Slope Angle" value={momentum.rsi_slope.toFixed(4)} />
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
                        {volatility.volatility_level} Risk
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatBox label="ATR (Daily)" value={volatility.current_atr.toFixed(1)} />
                    <StatBox label="Historical Avg" value={volatility.avg_range.toFixed(1)} />
                    <StatBox label="Range Status" value={volatility.volatility_regime} capitalize />
                    <StatBox label="Rec. Stop" value={`${volatility.optimal_sl_multiplier}x ATR`} highlight />
                </div>
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
      <section className="mt-24 border-t border-zinc-900 pt-10 text-center max-w-4xl mx-auto">
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

    {/* 2. Technical Levels */}
    <a href={`/zones/${params.symbol}`} className="seo-chip-link">
       Liquidity Zones <ArrowRight size={14} />
    </a>

    <a href={`/momentum/${params.symbol}`} className="seo-chip-link">
       Momentum Score <ArrowRight size={14} />
    </a>

    {/* 3. Risk & Overview */}
    <a href={`/volatility/${params.symbol}`} className="seo-chip-link">
       Volatility Risk <ArrowRight size={14} />
    </a>

    <a href={`/analysis/${params.symbol}`} className="seo-chip-link border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">
       Full Analysis <ArrowRight size={14} />
    </a>
</div>
      </section>

    </div>
  );
}

// --- HELPER COMPONENTS ---

function MetricRow({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-xs text-zinc-500 uppercase font-semibold">{label}</span>
            <span className={`text-sm font-mono font-bold ${highlight ? 'text-yellow-400' : 'text-white'}`}>{value}</span>
        </div>
    )
}

function StatBox({ label, value, capitalize = false, highlight = false }: { label: string, value: string, capitalize?: boolean, highlight?: boolean }) {
    return (
        <div className="p-4 bg-black/40 rounded-xl border border-zinc-800/50">
            <span className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">{label}</span>
            <span className={`block text-lg font-bold ${highlight ? 'text-amber-400' : 'text-white'} ${capitalize ? 'capitalize' : ''}`}>
                {value}
            </span>
        </div>
    )
}