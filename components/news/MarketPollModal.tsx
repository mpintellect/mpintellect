'use client';

import { useState, useEffect } from 'react';
import { X, Share2, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MarketPollModal({ data, onClose }: any) {
  const [stats, setStats] = useState({ low: 0, medium: 0, high: 0, total: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const res = await fetch(`/api/polls/${data.id}`);
      const json = await res.json();
      if (json.success) setStats(json.poll);
    }
    init();
    if (localStorage.getItem(`voted_${data.id}`)) setHasVoted(true);
  }, [data.id]);

  const handleVote = async (choice: 'low' | 'medium' | 'high') => {
    if (loading || hasVoted) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('cf_token') || localStorage.getItem('mz_token');
      const userRaw = localStorage.getItem('cf_user') || localStorage.getItem('mz_user');
      
      if (!token || !userRaw) {
        toast.error("Please log in to vote");
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userRaw);

      const res = await fetch(`/api/polls/${data.id}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          vote: choice, 
          userId: user.id, 
          userName: user.display_name || 'Trader' 
        })
      });

      const result = await res.json();
      if (result.success) {
        setStats(result.poll);
        setHasVoted(true);
        localStorage.setItem(`voted_${data.id}`, 'true');
        toast.success("Vote recorded!");
      }
    } catch (e) {
      toast.error("Failed to submit vote");
    } finally {
      setLoading(false);
    }
  };

  const getPercent = (val: number) => stats.total === 0 ? 0 : Math.round((val / stats.total) * 100);

  const handleShare = () => {
    const text = `Market poll: ${data.headline}\n\nHigh: ${getPercent(stats.high)}%\nMedium: ${getPercent(stats.medium)}%\nLow: ${getPercent(stats.low)}%\n\nJoin the discussion at MZPrimer`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Market Poll Results',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Results copied to clipboard");
    }
  };

  return (
    <div className="market-poll-modal">
      <div className="poll-card">
        {/* Header */}
        <div className="poll-header">
          <div className="poll-symbol">{data.symbol || 'MARKET'}</div>
          <button onClick={onClose} className="poll-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="poll-content">
          {/* Headline */}
          <h2 className="poll-headline">{data.headline || data.question}</h2>
          <div className="poll-date">
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span>•</span>
            <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {/* AI Insight */}
          <div className="poll-ai-insight">
            <div className="poll-ai-label">
              <BrainCircuit size={16} />
              News 
            </div>
            <p className="poll-ai-text">
              {data.aiContext || "Market sentiment shows mixed signals with institutional positioning diverging from retail expectations."}
            </p>
          </div> 

          {/* Voting / Results Section */}
          {!hasVoted ? (
            <div className="poll-voting-section">
              <h3 className="poll-voting-title">What's your impact projection on {data.symbol}?</h3>
              
              <div className="poll-options">
                <button
                  onClick={() => handleVote('low')}
                  className={`poll-option low ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  <span className="poll-emoji">📉</span>
                  <span className="poll-option-label">Low Impact</span>
                </button>

                <button
                  onClick={() => handleVote('medium')}
                  className={`poll-option medium ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  <span className="poll-emoji">⚖️</span>
                  <span className="poll-option-label">Moderate</span>
                </button>

                <button
                  onClick={() => handleVote('high')}
                  className={`poll-option high ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  <span className="poll-emoji">📈</span>
                  <span className="poll-option-label">High Impact</span>
                </button>
              </div>

              <p className="poll-note">
                Your vote contributes to real-time market sentiment analysis
              </p>
            </div>
          ) : (
            <div className="poll-results">
              <div className="poll-results-header">
                <h3 className="poll-results-title">Community Sentiment</h3>
                <div className="poll-total-votes">{stats.total} votes</div>
              </div>

              <div className="poll-result-bar">
                <div className="poll-bar-header">
                  <span className="poll-bar-label">High Impact</span>
                  <span className="poll-bar-percent">{getPercent(stats.high)}%</span>
                </div>
                <div className="poll-bar-track">
                  <div 
                    className="poll-bar-fill high"
                    style={{ width: `${getPercent(stats.high)}%` }}
                  />
                </div>
                <div className="poll-bar-count">{stats.high} votes</div>
              </div>

              <div className="poll-result-bar">
                <div className="poll-bar-header">
                  <span className="poll-bar-label">Moderate</span>
                  <span className="poll-bar-percent">{getPercent(stats.medium)}%</span>
                </div>
                <div className="poll-bar-track">
                  <div 
                    className="poll-bar-fill medium"
                    style={{ width: `${getPercent(stats.medium)}%` }}
                  />
                </div>
                <div className="poll-bar-count">{stats.medium} votes</div>
              </div>

              <div className="poll-result-bar">
                <div className="poll-bar-header">
                  <span className="poll-bar-label">Low Impact</span>
                  <span className="poll-bar-percent">{getPercent(stats.low)}%</span>
                </div>
                <div className="poll-bar-track">
                  <div 
                    className="poll-bar-fill low"
                    style={{ width: `${getPercent(stats.low)}%` }}
                  />
                </div>
                <div className="poll-bar-count">{stats.low} votes</div>
              </div>

              <div className="poll-actions">
                <button onClick={handleShare} className="poll-share-btn">
                  <Share2 size={16} />
                  Share Results
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem(`voted_${data.id}`);
                    setHasVoted(false);
                  }}
                  className="poll-change-vote"
                >
                  Change Vote
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}