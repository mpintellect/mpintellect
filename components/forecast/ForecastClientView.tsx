// components/forecast/ForecastClientView.tsx

'use client';

import { useState, useEffect } from 'react';
import { BrainCircuit, Radar, ShieldCheck, TrendingUp, Bot } from 'lucide-react';
import NotificationButton from '@/components/NotificationButton';
import SymbolNavigation from '@/components/SymbolNavigation';
import LiveSeoSchema from '@/components/LiveSeoSchema';
import { commonTranslations, Locale } from '@/app/lib/translations';
import { unifiedGenerator } from '@/app/lib/unifiedGenerator';

interface ForecastClientViewProps {
  data: any;
  symbol: string;
  locale: Locale;
  onRefresh: () => Promise<void>;
}

export default function ForecastClientView({ data, symbol, locale, onRefresh }: ForecastClientViewProps) {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const t = commonTranslations[locale];
  const isRtl = locale === 'ar';

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

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center text-zinc-500 font-mono gap-4">
        <div className="w-10 h-10 border-t-2 border-purple-500 rounded-full animate-spin"></div>
        <p>Loading forecast data...</p>
      </div>
    );
  }

  // Generate report with locale
  const report = unifiedGenerator({ data, symbol, locale, tool: 'forecast' });
  
  // Safely extract forecast-specific properties
  const executive = (report as any).executive || '';
  const riskAnalysis = (report as any).risk_analysis || '';
  const conclusion = (report as any).conclusion || '';

  // Extract data with proper fallbacks
  const accuracy = data.analysis_accuracy || 75;
  const qualityScores = data.component_scores || {
    trend: data.trend?.component_quality || 50,
    volatility: data.volatility?.component_quality || 50,
    momentum: data.momentum?.component_quality || 50,
    zones: data.zones?.component_quality || 50
  };

  const qualityLabel = data.quality_indicator || "Standard Grade";
  const finalDecision = data.final_decision || "HOLD";
  const confidence = data.risk_score?.confidence_score || 50;

  // Date Formatting
  const rawDate = data.generated_at || data.trend?.timestamp;
  const dateObj = new Date(rawDate || Date.now());
  const formattedDate = dateObj.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });

  // Grade Color Logic
  let gradeColor = "text-amber-500";
  let gradeBg = "from-amber-900/20";
  if (accuracy > 70) { 
    gradeColor = "text-purple-400"; 
    gradeBg = "from-purple-900/20"; 
  }
  if (accuracy > 85) { 
    gradeColor = "text-emerald-400"; 
    gradeBg = "from-emerald-900/20"; 
  }

  // Decision Color
  let decisionColor = "text-amber-400";
  if (finalDecision === "BUY") decisionColor = "text-emerald-400";
  if (finalDecision === "SELL") decisionColor = "text-red-400";

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-purple-500/30" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* SEO Schema */}
      <LiveSeoSchema data={data} locale={locale} tool="forecast" />
      
      {/* HEADER */}
      <div className="pt-28 pb-10 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-purple-500/20 bg-purple-900/10 text-purple-300 text-[10px] uppercase font-bold tracking-widest">
          <BrainCircuit size={12} className="text-purple-400" /> AI Predictive Model
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter text-white">
          {data.symbol} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Forecast</span>
        </h1>
        
        <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto opacity-70">
          Price Prediction for {formattedDate}
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

      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-12 gap-8">
        
        {/* MAIN CARD */}
        <div className={`md:col-span-8 p-8 rounded-3xl relative overflow-hidden glass-trend-card bg-gradient-to-br ${gradeBg} to-black`}>
            
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-10">
            <span className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
              <Radar size={14} /> Probability Matrix
            </span>
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 bg-white/5 uppercase ${gradeColor}`}>
              {qualityLabel}
            </span>
          </div>

          <div className="flex flex-col gap-10">
            {/* CONFIDENCE & DECISION */}
            <div className="flex items-center gap-6 justify-center md:justify-start" style={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <div className="relative w-32 h-32 flex items-center justify-center border-[6px] border-zinc-800 rounded-full shrink-0">
                <svg className="absolute w-full h-full -rotate-90 transform">
                  <circle 
                    cx="64" cy="64" r="58" 
                    fill="transparent" 
                    stroke="currentColor" 
                    strokeWidth="6"
                    className={gradeColor}
                    strokeDasharray={`${accuracy * 3.65}, 1000`} 
                    strokeLinecap="round"
                  />
                </svg>
                <span className={`text-3xl font-black tracking-tight ${gradeColor}`}>
                  {accuracy.toFixed(0)}<span className="text-sm">%</span>
                </span>
              </div>
              
              <div>
                <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">AI Decision</h2>
                <p className={`text-2xl md:text-3xl font-black mb-2 ${decisionColor}`}>
                  {finalDecision}
                </p>
                <p className="text-sm text-zinc-400">
                  Confidence: <span className="text-white font-semibold">{confidence}%</span>
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {data.risk_score?.risk_category || "Medium Risk"}
                </p>
              </div>
            </div>

            {/* TEXT REPORT */}
            <div className="space-y-6 text-lg text-zinc-300 font-light leading-relaxed">
              <p>{executive}</p>
              <p className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-500/5 text-sm rounded-r-lg text-zinc-400">
                {riskAnalysis}
              </p>
            </div>
          </div>
        </div>

        {/* SIDEBAR - QUALITY METRICS */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/30 h-full flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm flex items-center gap-2 mb-2">
              <ShieldCheck size={16} className="text-zinc-500" /> Data Integrity
            </h4>
            
            <div className="space-y-4">
              <QualityRow label="Trend Quality" score={qualityScores.trend} />
              <QualityRow label="Volatility" score={qualityScores.volatility} />
              <QualityRow label="Momentum Bias" score={qualityScores.momentum} />
              <QualityRow label="Zone Clarity" score={qualityScores.zones} />
            </div>

            <div className="validation-container">
              <h5 className="validation-header">Validation</h5>
              <div className="validation-status">
                <div className={`status-indicator ${data.validation?.is_valid ? 'valid' : 'invalid'}`}></div>
                <span className="status-text">
                  {data.validation?.is_valid ? 'Validated' : 'Needs Review'}
                </span>
              </div>
              <p className="validation-score">
                Score: <span className="score-value">{data.validation?.validation_score || 'N/A'}%</span>
              </p>
              
              <div className="validation-score-bar" 
                   style={{ '--score': `${data.validation?.validation_score || 0}%` } as React.CSSProperties}>
                <div className="score-bar-fill"></div>
              </div>
            </div>

            <div className="mt-auto border-t border-zinc-800 pt-6">
              <NotificationButton />
            </div>
          </div>
        </div>
      </div>

      {/* FINAL VERDICT */}
      <section className="algo-section">
        <div className="algo-card">
          <span className="algo-label">
            Final Algorithm Decision
          </span>
          
          <p className="algo-text">
            "{conclusion}"
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <SymbolNavigation symbol={symbol} />
    </div>
  );
}

// Quality Row Component
function QualityRow({ label, score }: { label: string, score: number }) {
  const s = score || 0;
  const w = Math.min(100, Math.max(5, s));
  
  let bg = 'bg-zinc-700'; 
  if (s > 80) bg = 'bg-emerald-500';
  else if (s > 60) bg = 'bg-purple-500';
  else if (s > 40) bg = 'bg-amber-500';

  return (
    <div>
      <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-1 uppercase">
        <span>{label}</span>
        <span>{s}%</span>
      </div>
      <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-zinc-800/50">
        <div 
          className={`h-full ${bg} rounded-full transition-all duration-1000 ease-out`} 
          style={{ width: `${w}%` }}
        ></div>
      </div>
    </div>
  );
}