'use client';

import { useState, useEffect } from 'react';
import { X, Share2, BarChart2, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MarketPollModal({ data, onClose }: any) {
  const [stats, setStats] = useState({ low: 0, medium: 0, high: 0, total: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPollStats();
    if (localStorage.getItem(`voted_${data.id}`)) setHasVoted(true);
    // Polling for live updates every 10 seconds
    const interval = setInterval(fetchPollStats, 10000);
    return () => clearInterval(interval);
  }, [data.id]);

  const fetchPollStats = async () => {
    try {
      const response = await fetch(`/api/polls/${data.id}`);
      const result = await response.json();
      if (result.success) {
        setStats({
          low: result.poll.votes?.low || 0,
          medium: result.poll.votes?.medium || 0,
          high: result.poll.votes?.high || 0,
          total: result.poll.total_votes || 0
        });
      }
    } catch (e) { console.error("Fetch error", e); }
  };

  const handleVote = async (choice: 'low' | 'medium' | 'high') => {
    if (hasVoted || loading) return;
    setLoading(true);

    try {
      // 1. Identify User (Member or Visitor)
      const userData = localStorage.getItem('cf_user');
      let userId = '';
      let userName = 'Anonymous';

      if (userData) {
        const user = JSON.parse(userData);
        userId = user.id;
        userName = user.display_name || user.email?.split('@')[0];
      } else {
        // Generate/Use a Visitor ID for public users
        userId = localStorage.getItem('mz_visitor_id') || 'v_' + Math.random().toString(36).substring(2, 12);
        localStorage.setItem('mz_visitor_id', userId);
      }

      // 2. Submit to API
      const response = await fetch(`/api/polls/${data.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote: choice, userId, userName })
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem(`voted_${data.id}`, 'true');
        setHasVoted(true);
        // Refresh with real data from DB
        setStats({
          low: result.poll.votes.low,
          medium: result.poll.votes.medium,
          high: result.poll.votes.high,
          total: result.poll.total_votes
        });
        toast.success("Vote recorded! Thank you.");
      } else {
        toast.error(result.error || "Failed to vote");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const getPercent = (val: number) => stats.total === 0 ? 0 : Math.round((val / stats.total) * 100);

  return (
    <div className="poll-overlay">
      <div className="poll-card">
        <button onClick={onClose} className="poll-close"><X size={20} /></button>
        <div className="poll-content">
          <div className="poll-meta">
             <span className="poll-symbol">{data.symbol}</span>
             <span className="poll-category">Impact Analysis</span>
          </div>

          <h2 className="poll-question">{data.question}</h2>

          <div className="ai-context-box">
             <div className="ai-label"><BrainCircuit size={14} /> AI Perspective</div>
             <p className="ai-text">{data.aiContext}</p>
          </div>

          {!hasVoted ? (
            <div className="voting-section">
              <div className="vote-grid">
                <button onClick={() => handleVote('low')} className="vote-btn vote-low" disabled={loading}>Low</button>
                <button onClick={() => handleVote('medium')} className="vote-btn vote-mid" disabled={loading}>Medium</button>
                <button onClick={() => handleVote('high')} className="vote-btn vote-high" disabled={loading}>High</button>
              </div>
            </div>
          ) : (
            <div className="results-container">
              <div className="results-header">
                <span>Community Sentiment</span>
                <span className="flex items-center gap-1"><BarChart2 size={12}/> {stats.total} votes</span>
              </div>
              <ResultBar label="High Impact" percent={getPercent(stats.high)} barClass="fill-high" votes={stats.high} />
              <ResultBar label="Moderate" percent={getPercent(stats.medium)} barClass="fill-mid" votes={stats.medium} />
              <ResultBar label="Low Impact" percent={getPercent(stats.low)} barClass="fill-low" votes={stats.low} />
              <div className="thank-you-note">✓ Thank you for participating!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultBar({ label, percent, barClass, votes }: any) {
  return (
    <div className="bar-wrapper">
      <div className="bar-label-row">
        <span>{label}</span>
        <div className="bar-stats"><span>{votes} votes</span><span className="ml-2 font-bold">{percent}%</span></div>
      </div>
      <div className="bar-track"><div className={`bar-fill ${barClass}`} style={{ width: `${percent}%` }} /></div>
    </div>
  );
}