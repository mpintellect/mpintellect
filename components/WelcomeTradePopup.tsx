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
  const [showIOSMenu, setShowIOSMenu] = useState(false);
  const [bestTrade, setBestTrade] = useState<TradeSignal | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isAppMode, setIsAppMode] = useState(false);
  const [iosBrowserType, setIosBrowserType] = useState<'safari' | 'chrome'>('safari');

  // --- PWA DETECTION ---
  const checkPWA = () => {
    if (typeof window === 'undefined') return false;
    const isStandard = window.matchMedia('(display-mode: standalone)').matches;
    const isApple = (window.navigator as any).standalone === true;
    return isStandard || isApple;
  };

  // --- BROWSER OS DETECTION ---
  const getMobileOS = () => {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent || navigator.vendor;
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
    return 'desktop';
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

    const inApp = checkPWA();
    setIsAppMode(inApp);

    // DETECT IOS BROWSER TYPE
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      if (ua.match('CriOS')) {
        setIosBrowserType('chrome');
      } else {
        setIosBrowserType('safari');
      }
    }

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
        const delay = inApp ? 50 : 7000; 
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
    const os = getMobileOS();
    const isInstalled = checkPWA();

    // If in installed app, allow push notifications
    if (isInstalled) {
      const targetId = type === 'prop' ? 'propfirm' : 'aiassistant';
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      await subscribeToPush();
      setIsVisible(false);
      return;
    }

    // iOS browser handling
    if (os === 'ios' && !isInstalled) {
      setShowIOSMenu(true);
      // Store the selected type for later use
      sessionStorage.setItem('selectedAssistantType', type);
      return;
    }

    // Everyone else
    const targetId = type === 'prop' ? 'propfirm' : 'aiassistant';
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    await subscribeToPush();
    setIsVisible(false);
  };

  // --- IOS MENU HANDLER ---
  const forceAppMode = async (type?: 'prop' | 'trader') => {
    setIsAppMode(true);
    setShowIOSMenu(false);
    await subscribeToPush();
    
    // Navigate if type is provided
    if (type) {
      const targetId = type === 'prop' ? 'propfirm' : 'aiassistant';
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // RENDER SAFEGUARD
  if (!mounted || !isVisible || subscription || !bestTrade) return null;

  // ===============================================================
  // 1. IOS "CHOICE MENU"
  // ===============================================================
  if (showIOSMenu) {
    const selectedType = sessionStorage.getItem('selectedAssistantType') as 'prop' | 'trader' || 'trader';
    
    return (
      <div className="ios-guide-overlay" onClick={() => setShowIOSMenu(false)}>
        <div className="ios-guide-card" onClick={e => e.stopPropagation()}>
          <button onClick={() => setShowIOSMenu(false)} className="absolute top-4 right-4 text-zinc-600 p-1 hover:text-white">
            <X size={18} />
          </button>

          <div className="p-6">
            <div className="text-center mb-5">
              <h3 className="text-white font-bold text-xl mb-1">Choose Alert Method</h3>
              <p className="text-zinc-500 text-xs uppercase tracking-wide font-semibold">
                {iosBrowserType === 'chrome' ? 'Chrome detected' : 'Instant AI Signals'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="ios-pwa-box">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Option A: Native Web App</span>
                </div>
                <div className="ios-step-row">
                  <div className="ios-icon-circle text-blue-500"><Share size={14}/></div>
                  <span>Tap <strong>Share</strong> {iosBrowserType === 'chrome' ? '(Top Right)' : 'in toolbar'}</span>
                </div>
                <div className="ios-step-row">
                  <div className="ios-icon-circle text-zinc-400"><PlusSquare size={14}/></div>
                  <span>Tap <strong>Add to Home Screen</strong></span>
                </div>
              </div>

              <div className="relative flex items-center opacity-50">
                <div className="flex-grow border-t border-zinc-800"></div>
                <span className="flex-shrink mx-2 text-[9px] text-zinc-600 uppercase font-bold">Fast Alternative</span>
                <div className="flex-grow border-t border-zinc-800"></div>
              </div>

              <a href={TELEGRAM_LINK} target="_blank" className="btn-telegram">
                <MessageCircle size={18} /> Join Telegram Channel
              </a>

              <button 
                onClick={() => forceAppMode(selectedType)}
                className="w-full text-[10px] text-zinc-600 text-center mt-2 underline hover:text-zinc-400 transition-colors"
              >
                I am already using the App
              </button>
            </div>
          </div>
        </div>

        {iosBrowserType === 'chrome' ? (
          <div className="ios-pointer-container ios-pos-chrome" onClick={e => e.stopPropagation()}>
            <ArrowUpRight size={48} className="arrow-animated mb-2 text-yellow-500" />
            <div className="arrow-label-capsule">Tap Share Button</div>
          </div>
        ) : (
          <div className="ios-pointer-container ios-pos-safari" onClick={e => e.stopPropagation()}>
            <div className="arrow-label-capsule">Browser Menu</div>
            <ArrowDown size={48} className="arrow-animated mt-1 text-yellow-500" />
          </div>
        )}
      </div>
    );
  }

  // ===============================================================
  // 2. MAIN POPUP WITH TRADING TYPE SELECTION
  // ===============================================================
  return (
    <div className="popup-container">
      <div className={`popup-card ${isAppMode ? 'ring-2 ring-green-500/50' : ''}`}>
        {/* HEADER - KEEP ORIGINAL STYLING */}
        <div className="popup-header">
          <div className="popup-header-title">
            {isAppMode ? (
               <span className="text-green-400 flex items-center gap-2 font-bold animate-pulse">
                  <BellRing size={16} /> SELECT TRADING ASSISTANT
               </span>
            ) : (
               <>
                 <span className="live-dot" /> <span className="text-zinc-400">AI TRADING SIGNAL</span>
                 <span className="w-px h-3 bg-white/10 mx-2"></span> <span className="text-yellow-500 font-bold">LIVE</span>
               </>
            )}
          </div>
          <div className="flex items-center gap-3">
             <span className="header-time-text">{getTimeAgo(bestTrade.timestamp)}</span>
             <button onClick={handleClose} className="btn-popup-close"><X size={14} /></button>
          </div>
        </div>

        {/* BODY - SIMPLIFIED */}
        <div className="popup-body">
          {/* SYMBOL - KEEP ORIGINAL */}
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
          {!isAppMode && (
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