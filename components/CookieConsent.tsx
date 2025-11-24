'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Cookie } from 'lucide-react'; 

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user choice exists
    const choice = localStorage.getItem('mz_cookie_consent');
    if (!choice) {
      setTimeout(() => setIsVisible(true), 1500);
    } else {
      // Re-apply if previously granted
      applyConsentMode(choice === 'granted');
    }
  }, []);

  const applyConsentMode = (granted: boolean) => {
    const consentState = granted ? 'granted' : 'denied';
    if (typeof window !== 'undefined') {
       // @ts-ignore
       window.dataLayer = window.dataLayer || [];
       // @ts-ignore
       function gtag(){dataLayer.push(arguments);}
       // @ts-ignore
       gtag('consent', 'update', {
         'ad_storage': consentState,
         'ad_user_data': consentState,
         'ad_personalization': consentState,
         'analytics_storage': consentState
       });
    }
  };

  const handleAccept = () => {
    localStorage.setItem('mz_cookie_consent', 'granted');
    applyConsentMode(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('mz_cookie_consent', 'denied');
    applyConsentMode(false);
    setIsVisible(false);
  };

  if (!mounted || !isVisible) return null;

  return (
    // Uses global 'cookie-strip-container'
    <div className="cookie-strip-container">
        
        <div className="cookie-strip-inner">
            
            {/* Left: Icon & Text */}
            <div className="cookie-text-group">
                <div className="cookie-icon-wrapper">
                    <Cookie size={16} />
                </div>
                <p className="cookie-text">
                   This site uses cookies to enhance your AI trading experience and analyze traffic.
                </p>
            </div>

            {/* Right: Actions */}
            <div className="cookie-actions">
                <button onClick={handleDecline} className="btn-cookie-link">
                    Necessary Only
                </button>
                <button onClick={handleAccept} className="btn-cookie-accept-sm">
                    <ShieldCheck size={14} />
                    <span>Accept</span>
                </button>
            </div>

        </div>
    </div>
  );
}