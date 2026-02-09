'use client';

import React, { useState } from 'react';
import { Calendar, Activity, TrendingUp, ChevronRight } from 'lucide-react';
import MarketPollModal from '../components/news/MarketPollModal';

export default function NewsCard({ data }: any) {
  const [showPoll, setShowPoll] = useState(false);
  const symbols = data.symbol?.split(',') || ['MARKET'];

  return (
    <>
      <div className={`news-terminal-card impact-${data.impact?.toLowerCase()}`} onClick={() => setShowPoll(true)}>
        <div className="card-top">
          <div className="card-symbols">
            {symbols.slice(0, 2).map((s: string) => (
              <span key={s} className="sym-tag">{s.trim()}</span>
            ))}
          </div>
          <div className="card-time">
            
            {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <h3 className="card-headline">{data.headline}</h3>
        <p className="card-excerpt">{data.content}</p>

        <div className="card-footer">
          <div className="footer-stat">
            <Activity size={12} className="gold-icon" />
            <span>Impact {data.impact}</span>
          </div>
          <div className="footer-stat">
            <TrendingUp size={12} className="gold-icon" />
            <span>{data.sentiment_score || 50}% Sentiment</span>
          </div>
          <div className="card-arrow">
            <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {showPoll && <MarketPollModal data={data} onClose={() => setShowPoll(false)} />}
    </>
  );
}