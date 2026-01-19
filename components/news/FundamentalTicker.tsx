'use client';

import { useState, useEffect, useRef } from 'react';
import { useNews, NewsItem } from '../../app/hooks/useNews';
import MarketPollModal from './MarketPollModal';

export default function SlimScrollingTicker() {
  const { news, loading } = useNews();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const trackRef = useRef<HTMLDivElement>(null);
  // FIX: Added undefined as initial value to satisfy TypeScript
  const animationRef = useRef<number | undefined>(undefined);
  
  const [scrollPosition, setScrollPosition] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    if (!loading && news.length > 0 && trackRef.current) {
      const updateDimensions = () => {
        if (trackRef.current) {
          setTrackWidth(trackRef.current.scrollWidth / 3);
        }
      };
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, [loading, news]);

  useEffect(() => {
    if (loading || news.length === 0 || isPaused || trackWidth === 0) {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

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
  }, [loading, news.length, isPaused, trackWidth]);

  if (loading) {
    return (
      <div className="slim-ticker-container">
        <div className="slim-ticker-track">
          {[1, 2, 3].map((i) => (
            <div key={i} className="slim-news-item loading-skeleton">
              <div className="skeleton-symbol" />
              <div className="skeleton-headline" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!news || news.length === 0) return null;

  const duplicatedNews = [...news, ...news, ...news];

  return (
    <>
      <div 
        className="slim-ticker-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="slim-ticker-bar">
          <div 
            ref={trackRef}
            className="slim-ticker-track"
            style={{ transform: `translateX(${scrollPosition}px)` }}
          >
            {duplicatedNews.map((item, idx) => (
              <button
                key={`${item.id}-${idx}`}
                onClick={() => setSelectedNews(item)}
                className="slim-news-item"
              >
                <span className="slim-symbol">{item.symbol}</span>
                <span className="slim-category">{item.category || 'Market'}</span>
                <span className="slim-headline">{item.headline}</span>
                <span className="slim-hover-indicator">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="slim-arrow">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            ))}
          </div>
          <div className="slim-fade-left" />
          <div className="slim-fade-right" />
        </div>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="slim-pause-btn"
        >
          {isPaused ? 'PLAY' : 'PAUSE'}
        </button>
      </div>

      {selectedNews && (
        <MarketPollModal data={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </>
  );
}