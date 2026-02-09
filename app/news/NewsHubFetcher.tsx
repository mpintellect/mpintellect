'use client';

import React, { useState } from 'react';
import { Search, Filter, Clock } from 'lucide-react';
import NewsCard from '../../components/NewsCard';
import { useNews } from '../../app/hooks/useNews';

const CATEGORIES = ["ALL", "FOREX", "CRYPTO", "STOCKS", "COMMODITIES"];

export default function NewsHub() {
  const { news, loading } = useNews();
  const [activeCat, setActiveCat] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredNews = news.filter(item => {
    const matchesCat = activeCat === "ALL" || item.category === activeCat;
    const matchesSearch = item.headline.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="news-hub-wrapper">
      <header className="hub-header">
        <div className="hub-title-area">
          <h1 className="hub-title">Market Intelligence</h1>
          <div className="hub-subtitle">
            <span className="live-pulse"></span>
            Real-time Institutional Feed
          </div>
        </div>

        <div className="hub-controls">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Filter intelligence..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="category-strip">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                className={`cat-btn ${activeCat === cat ? 'active' : ''}`}
                onClick={() => setActiveCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="hub-loading">Initialising data stream...</div>
      ) : (
        <div className="news-grid">
          {filteredNews.map(item => (
            <NewsCard key={item.id} data={item} />
          ))}
        </div>
      )}
    </div>
  );
}