'use client';

import { useState, useEffect } from 'react';
import MarketPollModal from '../../components/news/MarketPollModal';


export default function NewsHubFetcher() {
  const [news, setNews] = useState([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch('https://data.mzprimer.com/news.json')
      .then(res => res.json())
      .then(setNews);
  }, []);

  return (
    <div className="news-container">
      <h1 className="text-2xl font-bold mb-8 border-b border-gray-800 pb-4">LIVE_INTEL_FEED</h1>
      <div className="news-grid">
        {news.map((item: any) => (
          <div key={item.id} className="news-card" onClick={() => setSelected(item)}>
            <div>
              <div className="card-symbol">{item.symbol}</div>
              <h2 className="card-headline">{item.headline}</h2>
            </div>
            <div className="card-meta">
              <span>{item.source || 'Reuters'}</span>
              <span>{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
            </div>
          </div>
        ))}
      </div>

      {selected && <MarketPollModal data={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}