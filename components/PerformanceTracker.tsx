"use client";

import { useEffect, useState } from "react";
import {
  fetchPerformanceSummary,
  PerformanceSummary,
} from "../app/lib/fetchPerformance";

export default function PerformanceTracker() {
  const [data, setData] = useState<PerformanceSummary | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const summary = await fetchPerformanceSummary();
      setData(summary);
    };
    fetchData();
  }, []);

  const scrollToAIAssistant = () => {
    const aiSection = document.getElementById("aiassistant");
    if (aiSection) {
      aiSection.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    scrollToAIAssistant();
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    // Pause animation when clicking on the track itself
    const loop = e.currentTarget.querySelector('.scroll-loop') as HTMLElement;
    if (loop) {
      loop.style.animationPlayState = 'paused';
      // Resume after 3 seconds
      setTimeout(() => {
        loop.style.animationPlayState = 'running';
      }, 3000);
    }
  };

  if (!data) return null;

  const renderCard = (
    symbol: string,
    grade: string,
    winRate: number,
    tp: number,
    sl: number
  ) => (
    <div 
      key={symbol + grade} 
      className="scroll-card"
      onClick={handleCardClick}
      onTouchStart={(e) => {
        // Pause animation on touch start for mobile
        const loop = e.currentTarget.closest('.scroll-track')?.querySelector('.scroll-loop') as HTMLElement;
        if (loop) {
          loop.style.animationPlayState = 'paused';
        }
      }}
      onTouchEnd={(e) => {
        // Resume animation after 2 seconds on touch end
        setTimeout(() => {
          const loop = e.currentTarget.closest('.scroll-track')?.querySelector('.scroll-loop') as HTMLElement;
          if (loop) {
            loop.style.animationPlayState = 'running';
          }
        }, 2000);
      }}
    >
      <div className="symbol-title">
        {symbol} <span className="symbol-grade">({grade})</span>
      </div>
      <div className="scroll-stats">
        ✅ WIN RATE: {winRate.toFixed(1)}% | 🎯 TP: {tp} | ❌ SL: {sl}
      </div>
    </div>
  );

  return (
    <div className="performance-tracker-wrapper">
      <div className="scroll-section">
        <h3 className="scroll-title">📈 Top Performing Symbols</h3>
        <div className="scroll-track" onClick={handleTrackClick}>
          <div className="scroll-loop">
            {[...data.topPerformers, ...data.topPerformers].map((s, i) =>
              renderCard(s.symbol, s.grade, s.winRate, s.tp, s.sl)
            )}
          </div>
        </div>
      </div>

      <div className="scroll-section">
        <h3 className="scroll-title">📉 Worst Performing Symbols</h3>
        <div className="scroll-track" onClick={handleTrackClick}>
          <div className="scroll-loop">
            {[...data.worstPerformers, ...data.worstPerformers].map((s, i) =>
              renderCard(s.symbol, s.grade, s.winRate, s.tp, s.sl)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}