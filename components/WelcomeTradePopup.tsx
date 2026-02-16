// components/TradingAssistantBridge.tsx
'use client';
import { useState, useEffect } from 'react';
import { usePush } from '@/app/hooks/usePush';
import {
  X, TrendingUp, Bot, Zap, Activity,
  Share, PlusSquare, ArrowDown, ArrowUpRight,
  Smartphone, BellRing, MessageCircle, CheckCircle,
  Building, Target, Shield, Award,
  User, Building2, Wallet, Trophy
} from 'lucide-react';

// --- LINKS ---
const TELEGRAM_LINK = "https://t.me/mzprimer";

// CONFIG
const CACHE_KEY = 'mz_popup_market_data';
const CACHE_DURATION_MS = 5 * 60 * 10000;
const API_URL = '/api/livemarketfeed';

// INTERFACES
interface TrendInfo { trend: string; }
interface TradeSignal { 
  symbol: string; 
  action: string; 
  entry: number; 
  tp: number; 
  sl: number; 
  trend: TrendInfo; 
  confidence: number; 
  timestamp: string; 
}
interface MarketIntelligenceResponse { 
  generated_at: string; 
  signals: TradeSignal[]; 
}

export default function TradingAssistantBridge() {
  const { subscription, subscribeToPush, loading } = usePush();
  const [isVisible, setIsVisible] = useState(false);
  const [bestTrade, setBestTrade] = useState<TradeSignal | null>(null);
  const [mounted, setMounted] = useState(false);

  // --- PWA DETECTION ---
  const checkPWA = () => {
    if (typeof window === 'undefined') return false;
    const isStandard = window.matchMedia('(display-mode: standalone)').matches;
    const isApple = (window.navigator as any).standalone === true;
    return isStandard || isApple;
  };

  // --- TIME FORMATTING ---
  function getTimeAgo(dateString: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    if (date > now) return 'Just now';
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    const min = Math.floor(diff / 60);
    if (min < 60) return `${min}m ago`;
    return '1d ago';
  }

  // --- LOAD LOGIC ---
  useEffect(() => {
    setMounted(true);
    
    if (subscription) return;

    const loadData = async () => {
      let activeSignal: TradeSignal | null = null;
      const cached = localStorage.getItem(CACHE_KEY);
      
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION_MS) {
            activeSignal = getBestSignal(data);
          }
        } catch (e) { localStorage.removeItem(CACHE_KEY); }
      }

      if (!activeSignal) {
        try {
          const res = await fetch(API_URL);
          if (res.ok) {
            const rawData = await res.json();
            localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: rawData }));
            activeSignal = getBestSignal(rawData);
          }
        } catch (error) { console.error(error); }
      }
      
      if (activeSignal) {
        setBestTrade(activeSignal);
        const delay = checkPWA() ? 50 : 7000; 
        setTimeout(() => setIsVisible(true), delay);
      }
    };

    loadData();
  }, [subscription]);

  const getBestSignal = (data: MarketIntelligenceResponse) => {
    if (!data.signals || data.signals.length === 0) return null;
    return data.signals.sort((a, b) => b.confidence - a.confidence)[0];
  };

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('tradePopupClosed', 'true');
  };

  // --- NAVIGATE TO SPECIFIC ASSISTANT ---
  const navigateToAssistant = async (type: 'prop' | 'trader') => {
    const isInstalled = checkPWA();
    
    // Redirect to specific pages
    const targetPath = type === 'prop' ? '/prop-firm' : '/AIChat';
    window.location.href = targetPath;
    
    // Subscribe to push notifications
    await subscribeToPush();
    setIsVisible(false);
  };

  // RENDER SAFEGUARD
  if (!mounted || !isVisible || subscription || !bestTrade) return null;

  // ===============================================================
  // MAIN POPUP WITH TRADING TYPE SELECTION
  // ===============================================================
  return (
    <div className="popup-container">
      <div className={`popup-card ${checkPWA() ? 'ring-2 ring-green-500/50' : ''}`}>
        {/* HEADER */}
        <div className="popup-header">
          <div className="popup-header-title">
            {checkPWA() ? (
               <span className="text-green-400 flex items-center gap-2 font-bold animate-pulse">
                  <BellRing size={16} /> SELECT TRADING ASSISTANT
               </span>
            ) : (
               <>
                 <span className="live-dot" /> <span className="text-zinc-400">AI ASSISTANT</span>
                 <span className="w-px h-3 bg-white/10 mx-2"></span> <span className="text-yellow-500 font-bold">LIVE</span>
               </>
            )}
          </div>
          <div className="flex items-center gap-3">
             <span className="header-time-text">{getTimeAgo(bestTrade.timestamp)}</span>
             <button onClick={handleClose} className="btn-popup-close"><X size={14} /></button>
          </div>
        </div>

        {/* BODY */}
        <div className="popup-body">
          {/* SYMBOL */}
          <div className="popup-symbol-row">
            <h3 className="popup-symbol flex items-center gap-2">
                {bestTrade.symbol}
                {bestTrade.action === 'BUY' ? <TrendingUp size={20} className="text-emerald-400 drop-shadow-md"/> : <TrendingUp size={20} className="text-red-400 rotate-180 drop-shadow-md"/>}
            </h3>
            <span className={`popup-badge ${bestTrade.action === 'BUY' ? 'popup-badge-buy' : 'popup-badge-sell'}`}>
               {bestTrade.action}
            </span>
          </div>
          
          {/* SIMPLIFIED STATS - ONLY PRICE */}
          <div className="mb-6 mt-4">
            <div className="text-center">
              <p className="popup-label mb-1">Entry Price</p>
              <p className="effect-price-glow text-2xl font-bold">
                {bestTrade.entry.toLocaleString(undefined, { maximumFractionDigits: 5 })}
              </p>
            </div>
          </div>

          {/* SIMPLE QUESTION */}
          <div className="mb-6 text-center">
            <h3 className="text-white font-bold text-lg mb-2">
              Which AI Assistant do you need?
            </h3>
            <p className="text-zinc-400 text-sm">
              Choose based on your account type
            </p>
          </div>

          {/* TWO CTA BUTTONS */}
          <div className="space-y-3 mb-4">
            {/* PROP FIRM BUTTON */}
            <button 
              onClick={() => navigateToAssistant('prop')}
              disabled={loading}
              className="btn-cta btn-cta-prop"
            >
              <div className="btn-content">
                <div className="icon-container">
                  <Trophy size={18} className="text-white" />
                </div>
                <div className="text-container">
                  <div className="btn-title">PROP FIRM</div>
                  <div className="btn-subtitle">FTMO, FundedNext, MFF, The5%ers</div>
                </div>
              </div>
              <div className="checkmark">
                <CheckCircle size={20} />
              </div>
            </button>

            {/* TRADER BUTTON */}
            <button 
              onClick={() => navigateToAssistant('trader')}
              disabled={loading}
              className="btn-cta btn-cta-trader"
            >
              <div className="btn-content">
                <div className="icon-container">
                  <User size={18} className="text-white" />
                </div>
                <div className="text-container">
                  <div className="btn-title">TRADER</div>
                  <div className="btn-subtitle">Personal account, investor</div>
                </div>
              </div>
              <div className="checkmark">
                <CheckCircle size={20} />
              </div>
            </button>
          </div>

          {/* TELEGRAM LINK */}
          {!checkPWA() && (
            <a 
              href={TELEGRAM_LINK} 
              target="_blank" 
              className="block text-center mt-3 text-[10px] text-zinc-500 hover:text-blue-400 transition"
            >
              Or join <span className="underline">Telegram Channel</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}