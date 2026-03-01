'use client';

import { useState, useEffect, useRef } from 'react';
import { useNews, NewsItem } from '../../app/hooks/useNews';
import MarketPollModal from './MarketPollModal';

export default function SlimScrollingTicker() {
  const { news, loading } = useNews();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  
  const [scrollPosition, setScrollPosition] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Handle news item click
  const handleNewsClick = (item: NewsItem) => {
    setSelectedNews(item);
  };

  if (loading) {
    return (
      <div className="feed-container">
        <div className="terminal-scroll-view">
          {[1, 2, 3].map((i) => (
            <div key={i} className="terminal-slat loading-skeleton">
              <div className="slat-timestamp skeleton" />
              <div className="slat-symbol skeleton" />
              <div className="slat-news-headline skeleton" />
              <div className="slat-news-action skeleton" />
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
        className={`feed-container ${isPaused ? 'paused' : ''}`}
        onMouseEnter={() => !isMobile && setIsPaused(true)}
        onMouseLeave={() => !isMobile && setIsPaused(false)}
      >
        <div className="terminal-scroll-view">
          <div 
            ref={trackRef}
            className="scroll-content"
            style={{ transform: `translateX(${scrollPosition}px)`, display: 'flex' }}
          >
            {duplicatedNews.map((item, idx) => (
              <button
                key={`${item.id}-${idx}`}
                onClick={() => handleNewsClick(item)}
                className="terminal-slat news-slat"
              >
                <span className="slat-timestamp">
                  [{new Date().toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit'})}]
                </span>
                <span className="slat-symbol">{item.symbol}</span>
                <span className="slat-news-headline">{item.headline}</span>
                <span className="slat-news-action">READ</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedNews && (
        <MarketPollModal data={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </>
  );
}