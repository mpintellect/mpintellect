'use client';

import { useState, useEffect } from 'react';
import { Search, Globe, ArrowRight } from 'lucide-react';
import MarketPollModal from '../../components/news/MarketPollModal';

export default function FundamentalNewsHub() {
  const [news, setNews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => {
        const newsArray = Array.isArray(data) ? data : (data.news || []);
        
        // Sort: Newest date first
        const sortedData = newsArray.sort((a: any, b: any) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setNews(sortedData);
        setFiltered(sortedData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFiltered(news.filter((n: any) => 
      n.symbol?.toLowerCase().includes(q) || n.headline?.toLowerCase().includes(q)
    ));
  }, [searchQuery, news]);

  // EXACT DATE FORMATTER
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""; 
    const date = new Date(dateStr);
    // Returns exactly: "JAN 15, 2026"
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).toUpperCase();
  };

  const getCategoryClass = (category: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('forex')) return 'cat-forex';
    if (cat.includes('crypto')) return 'cat-crypto';
    if (cat.includes('commodities') || cat.includes('gold') || cat.includes('oil')) return 'cat-commodities';
    if (cat.includes('macro') || cat.includes('geopolitics')) return 'cat-macro';
    if (cat.includes('stock') || cat.includes('equities')) return 'cat-stocks';
    return 'cat-tag';
  };

  if (loading) return <div className="news-page-wrapper pt-40 text-center text-zinc-500 uppercase tracking-widest">Loading Intelligence...</div>;

  return (
    <div className="news-page-wrapper">
      <header className="news-header-section">
        <span className="news-sub-label">Fundamental Analysis</span>
        <h1 className="news-main-title">Intelligence Feed</h1>
      </header>

      <div className="news-search-container">
        <Search size={18} className="text-zinc-600 ml-2" />
        <input 
          type="text" 
          placeholder="Filter intel feed..." 
          className="news-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="news-grid-layout">
        {filtered.map((item: any) => (
          <div key={item.id} className="pro-news-card" onClick={() => setSelected(item)}>
            
            <div className="pro-card-header">
              <div className={`pro-card-symbol ${getCategoryClass(item.category)}`}>
                <Globe size={10} />
                {item.symbol}
              </div>
              
              {/* EXACT DATE SHOWN HERE */}
              {item.date && (
                <div className="pro-card-date">
                  {formatDate(item.date)}
                </div>
              )}
            </div>
            
            <h2 className="pro-card-headline">
              {item.headline}
            </h2>
            
            <div className="pro-card-footer">
              <div className="pro-card-meta">
                {item.category || 'MARKET'}
              </div>
              <div className="pro-card-action flex items-center gap-1 uppercase">
                Analysis <ArrowRight size={12} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <MarketPollModal 
          data={selected} 
          onClose={() => setSelected(null)} 
        />
      )}
    </div>
  );
}