'use client';

import { usePush } from '@/app/hooks/usePush';
import { useState, useEffect } from 'react';
// Required Icons
import { 
  BellRing, CheckCircle, Loader2, Smartphone, 
  Share, PlusSquare, X, ArrowDown, ArrowUpRight, MessageCircle 
} from 'lucide-react';

const TELEGRAM_LINK = "https://t.me/mpintellect"; 

export default function NotificationButton() {
  const { isSupported, subscription, subscribeToPush, loading } = usePush();
  const [mounted, setMounted] = useState(false);
  
  // Logic State
  const [showIOSMenu, setShowIOSMenu] = useState(false);
  const [isAppMode, setIsAppMode] = useState(false);
  const [iosBrowserType, setIosBrowserType] = useState<'safari' | 'chrome'>('safari');

  // --- DETECTION HELPERS ---
  const getMobileOS = () => {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent || navigator.vendor;
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return 'ios';
    return 'desktop';
  };

  const checkPWA = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches;
  };

  // --- LIFECYCLE ---
  useEffect(() => {
    setMounted(true);
    setIsAppMode(checkPWA());

    // Detect Chrome on iOS
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      if (ua.match('CriOS')) setIosBrowserType('chrome');
      else setIosBrowserType('safari');
    }
  }, []);

  // --- CLICK HANDLER ---
  const handleMainClick = async () => {
    const os = getMobileOS();
    const isInstalled = checkPWA();

    // 1. IOS Browser -> Show Guide Overlay
    if (os === 'ios' && !isInstalled) {
      setShowIOSMenu(true);
      return;
    }

    // 2. Standard -> Subscribe
    await subscribeToPush();
  };

  // Prevent Hydration mismatch
  if (!mounted) return null;

  // --- RENDER IOS OVERLAY (If triggered) ---
  const renderIOSOverlay = () => {
    if (!showIOSMenu) return null;
    return (
      <div className="ios-guide-overlay" onClick={() => setShowIOSMenu(false)}>
        
        {/* MENU CARD */}
        <div className="ios-guide-card" onClick={e => e.stopPropagation()}>
          <button onClick={() => setShowIOSMenu(false)} className="absolute top-4 right-4 text-zinc-600 p-1 hover:text-white">
            <X size={18} />
          </button>

          <div className="p-6">
            <div className="text-center mb-5">
              <h3 className="text-white font-bold text-xl mb-1">Enable Signals</h3>
              <p className="text-zinc-500 text-xs uppercase tracking-wide">Choose a Method</p>
            </div>

            <div className="space-y-4">
              {/* OPTION 1: NATIVE APP */}
              <div className="ios-pwa-box">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Best Performance</span>
                </div>
                <div className="ios-step-row">
                  <div className="ios-icon-circle text-blue-500"><Share size={14}/></div>
                  <span>Tap <strong>Share</strong> {iosBrowserType === 'chrome' ? '(Top Right)' : 'below'}</span>
                </div>
                <div className="ios-step-row">
                  <div className="ios-icon-circle text-zinc-400"><PlusSquare size={14}/></div>
                  <span>Tap <strong>Add to Home Screen</strong></span>
                </div>
              </div>

              <div className="relative flex items-center opacity-50">
                 <div className="flex-grow border-t border-zinc-800"></div>
                 <span className="flex-shrink mx-2 text-[9px] text-zinc-600 uppercase font-bold">OR</span>
                 <div className="flex-grow border-t border-zinc-800"></div>
              </div>

              {/* OPTION 2: TELEGRAM */}
              <a href={TELEGRAM_LINK} target="_blank" className="btn-telegram">
                <MessageCircle size={18} /> Join Telegram
              </a>
            </div>
          </div>
        </div>

        {/* POINTER */}
        {iosBrowserType === 'chrome' ? (
          <div className="ios-pointer-container ios-pos-chrome" onClick={e => e.stopPropagation()}>
            <ArrowUpRight size={48} className="arrow-animated mb-2 text-yellow-500" />
            <div className="arrow-label-capsule">Menu ↑</div>
          </div>
        ) : (
          <div className="ios-pointer-container ios-pos-safari" onClick={e => e.stopPropagation()}>
            <div className="arrow-label-capsule">Browser Menu ↓</div>
            <ArrowDown size={48} className="arrow-animated mt-1 text-yellow-500" />
          </div>
        )}
      </div>
    );
  };

  // --- MAIN BUTTON RENDERING ---
  return (
    <>
      {/* RENDER THE OVERLAY IF ACTIVE */}
      {renderIOSOverlay()}

      <div className="floating-notify-wrapper">
        {subscription ? (
          // STATE: SUBSCRIBED
          <div className="btn-float-bell btn-float-active">
            <CheckCircle size={18} />
            <span>Signals Active</span>
          </div>
        ) : (
          // STATE: NOT SUBSCRIBED (CLICKABLE)
          <button
            onClick={handleMainClick}
            disabled={loading}
            className="btn-float-bell animate-bell-shiver"
            title="Enable AI Signal Alerts"
          >
            <div className="float-icon-box">
                {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <BellRing size={20} />
                )}
            </div>
            
            {/* Show text for clarity */}
            <span>{loading ? 'Connecting...' : 'Get AI Signals'}</span>
          </button>
        )}
      </div>
    </>
  );
}