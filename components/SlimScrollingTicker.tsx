'use client';

import { useState, useEffect, useRef } from 'react';
import { useNews, NewsItem } from '../app/hooks/useNews';
import MarketPollModal from '../components/news/MarketPollModal';

const MARKET_SESSIONS = [
  { name: "SYDNEY", open: 22, close: 7 },
  { name: "TOKYO", open: 0, close: 9 },
  { name: "LONDON", open: 7, close: 16 },
  { name: "NEW YORK", open: 13, close: 22 },
];

export default function SlimScrollingTicker() {
  const { news, loading } = useNews();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  
  const [scrollPosition, setScrollPosition] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);

  // 1. Initial Setup & Scroll Listener
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  // 2. Ticker Animation Logic
  useEffect(() => {
    if (!loading && news.length > 0 && trackRef.current) {
      setTrackWidth(trackRef.current.scrollWidth / 3);
    }
  }, [loading, news]);

  useEffect(() => {
    if (loading || news.length === 0 || trackWidth === 0) return;

    let lastTime = 0;
    const speed = 50;

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setScrollPosition(prev => {
        let newPos = prev - speed * deltaTime;
        if (Math.abs(newPos) >= trackWidth) newPos = 0;
        return newPos;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current !== undefined) cancelAnimationFrame(animationRef.current);
    };
  }, [loading, news, trackWidth]);

  // 3. Session Calculation - Updated to handle multiple sessions
  const getCurrentSessions = () => {
    if (!now) return { sessions: [], isWeekend: false, time: "00:00" };
    
    const hourUTC = now.getUTCHours();
    const dayUTC = now.getUTCDay();
    const isWeekend = (dayUTC === 6) || (dayUTC === 0 && hourUTC < 22) || (dayUTC === 5 && hourUTC >= 22);
    
    const activeSessions = isWeekend ? [] : MARKET_SESSIONS.filter((s) => 
      s.open > s.close ? (hourUTC >= s.open || hourUTC < s.close) : (hourUTC >= s.open && hourUTC < s.close)
    );
    
    return {
      sessions: activeSessions,
      isWeekend,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    };
  };

  const sessionData = getCurrentSessions();
  
  if (loading || !news || news.length === 0) return null;
  const duplicatedNews = [...news, ...news, ...news];

  return (
    <>
      <div className={`slim-ticker-container ${isScrolled ? 'scrolled-mode' : 'ticker-mode'}`}>
        
        {/* --- LAYER 1: THE NEWS TICKER (Visible at top) --- */}
        <div className="ticker-content-wrapper">
          <div className="slim-ticker-bar">
            
            {/* STICKY SESSION BLOCK: Now shows multiple sessions */}
            <div className="ticker-session-block">
              {sessionData.isWeekend ? (
                <>
                  <span className="session-status-dot offline"></span>
                  <span className="session-name-text">HALT</span>
                  <span className="session-time-text">{sessionData.time}</span>
                  <span className="session-badge-text">CLOSED</span>
                </>
              ) : (
                sessionData.sessions.map((session, index) => (
                  <div key={session.name} className="session-item">
                    <span className={`session-status-dot ${session.name === 'LONDON' ? 'high' : session.name === 'NEW YORK' ? 'high' : 'online'}`}></span>
                    <span className="session-name-text">{session.name}</span>
                    {index < sessionData.sessions.length - 1 && <span className="session-separator">+</span>}
                  </div>
                ))
              )}
              {!sessionData.isWeekend && sessionData.sessions.length > 0 && (
                <span className="session-time-text">{sessionData.time}</span>
              )}
            </div>

            {/* MOVING NEWS TRACK */}
            <div 
              ref={trackRef}
              className="slim-ticker-track"
              style={{ transform: `translateX(${scrollPosition}px)` }}
            >
              {duplicatedNews.map((item, idx) => (
                <button key={idx} onClick={() => setSelectedNews(item)} className="ticker-news-item">
                  <span className="news-symbol-badge">{item.symbol}</span>
                  <span className="news-headline-plain">{item.headline}</span>
                </button>
              ))}
            </div>
            
            <div className="slim-fade-right" />
          </div>
        </div>

        {/* --- LAYER 2: THE ACTION RIBBON (Visible on scroll) --- */}
        <div className="action-ribbon-wrapper">
          <div className="action-left">
            {sessionData.isWeekend ? (
              <span className="cta-dot red"></span>
            ) : (
              sessionData.sessions.map((session, index) => (
                <span key={session.name} className={`cta-dot ${session.name === 'LONDON' || session.name === 'NEW YORK' ? 'high' : 'green'}`}></span>
              ))
            )}
            <span className="cta-session-name">
              {sessionData.isWeekend ? 'CLOSED' : sessionData.sessions.map(s => s.name).join(' + ')}
            </span>
            <span className="cta-time">{sessionData.time}</span>
          </div>
          <button 
            className="cta-begin-btn"
            onClick={() => document.getElementById("aiassistant")?.scrollIntoView({ behavior: "smooth" })}
          >
            BEGIN
          </button>
        </div>

      </div>

      {selectedNews && (
        <MarketPollModal data={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </>
  );
}