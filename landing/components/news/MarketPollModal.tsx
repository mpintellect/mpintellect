'use client';

import { useState, useEffect } from 'react';
import { X, Share2, BarChart2, BrainCircuit } from 'lucide-react';
import { NewsItem } from '../../landing/app/hooks/useNews';
import toast from 'react-hot-toast';

interface Props {
  data: NewsItem;
  onClose: () => void;
}

interface PollStats {
  low: number;
  medium: number;
  high: number;
  total: number;
  question: string;
  symbol: string;
  category: string;
}

export default function MarketPollModal({ data, onClose }: Props) {
  const [stats, setStats] = useState<PollStats>({ 
    low: 0, 
    medium: 0, 
    high: 0, 
    total: 0,
    question: data.question,
    symbol: data.symbol,
    category: data.category
  });
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState<NodeJS.Timeout | null>(null);

  // 1. Fetch and Subscribe to Live Votes
  useEffect(() => {
    // Initial fetch
    fetchPollStats();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchPollStats, 5000);
    setPolling(interval);

    // Check if user has already voted
    if (localStorage.getItem(`voted_${data.id}`)) {
      setHasVoted(true);
    }

    return () => {
      if (polling) {
        clearInterval(polling);
      }
    };
  }, [data.id]);

  const fetchPollStats = async () => {
    try {
      const response = await fetch(`/api/polls/${data.id}`);
      if (response.ok) {
        const pollData = await response.json();
        if (pollData.success) {
          setStats({
            low: pollData.poll.votes?.low || 0,
            medium: pollData.poll.votes?.medium || 0,
            high: pollData.poll.votes?.high || 0,
            total: pollData.poll.total_votes || 0,
            question: pollData.poll.question || data.question,
            symbol: pollData.poll.symbol || data.symbol,
            category: pollData.poll.category || data.category
          });
        }
      }
    } catch (error) {
      console.error('Error fetching poll stats:', error);
    }
  };

  // 2. Handle Voting
  const handleVote = async (vote: 'low' | 'medium' | 'high') => {
    if (hasVoted) {
      toast.error("You've already voted on this poll!");
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('cf_token');
      const userData = localStorage.getItem('cf_user');
      
      if (!token || !userData) {
        toast.error("Please log in to vote");
        return;
      }

      const user = JSON.parse(userData);
      
      const response = await fetch(`/api/polls/${data.id}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vote,
          userId: user.id,
          userName: user.email?.split('@')[0] || 'Anonymous'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to vote');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local stats immediately
        setStats(prev => ({
          ...prev,
          [vote]: prev[vote] + 1,
          total: prev.total + 1
        }));
        
        localStorage.setItem(`voted_${data.id}`, 'true');
        setHasVoted(true);
        toast.success("Vote recorded! Thank you for participating.");
        
        // Refresh stats to get latest from server
        fetchPollStats();
      }
    } catch (error: any) {
      console.error('Voting error:', error);
      toast.error(error.message || "Failed to submit vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Share Function
  const handleShare = () => {
    const text = `📊 MZPrimer Intel: ${data.question}\n\n🤖 AI View: ${data.aiContext}\n\nCheck the stats here: https://mzprimer.com\n\nCurrent Results:\nHigh: ${getPercent(stats.high)}%\nMedium: ${getPercent(stats.medium)}%\nLow: ${getPercent(stats.low)}%`;
    
    if (navigator.share && navigator.canShare?.()) {
      navigator.share({
        title: 'MZPrimer Market Poll',
        text: text,
        url: `https://mzprimer.com/polls/${data.id}`
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  };

  const getPercent = (val: number) => stats.total === 0 ? 0 : Math.round((val / stats.total) * 100);

  return (
    <div className="poll-overlay">
      <div className="poll-card">
        
        {/* Close Button */}
        <button onClick={onClose} className="poll-close">
          <X size={20} />
        </button>

        <div className="poll-content">
          
          {/* Header Metadata */}
          <div className="poll-meta">
             <span className="poll-symbol">{data.symbol}</span>
             <span className="poll-category">{data.category}</span>
             {polling && (
               <span className="poll-live-indicator">
                 <span className="live-dot"></span> LIVE
               </span>
             )}
          </div>

          {/* Question */}
          <h2 className="poll-question">
            {data.question}
          </h2>

          {/* AI Context */}
          <div className="ai-context-box">
             <div className="ai-label">
               <BrainCircuit size={14} /> AI Fundamental Take
             </div>
             <p className="ai-text">
               {data.aiContext}
             </p>
          </div>

          {/* --- VIEW A: VOTING --- */}
          {!hasVoted ? (
            <div className="voting-section">
              <p className="vote-label">What is your impact projection?</p>
              <div className="vote-grid">
                <button 
                  onClick={() => handleVote('low')} 
                  disabled={loading}
                  className="vote-btn vote-low"
                >
                  {loading ? 'Submitting...' : 'Low'}
                </button>
                <button 
                  onClick={() => handleVote('medium')} 
                  disabled={loading}
                  className="vote-btn vote-mid"
                >
                  {loading ? 'Submitting...' : 'Medium'}
                </button>
                <button 
                  onClick={() => handleVote('high')} 
                  disabled={loading}
                  className="vote-btn vote-high"
                >
                  {loading ? 'Submitting...' : 'High'}
                </button>
              </div>
              <p className="vote-note">
                Your vote will be recorded anonymously. One vote per user.
              </p>
            </div>
          ) : (
            /* --- VIEW B: RESULTS --- */
            <div className="results-container">
              <div className="results-header">
                <span>Community Sentiment</span>
                <span className="flex items-center gap-1">
                  <BarChart2 size={12}/> {stats.total} votes
                </span>
              </div>
              
              <ResultBar 
                label="High Impact" 
                percent={getPercent(stats.high)} 
                barClass="fill-high" 
                textClass="text-high" 
                votes={stats.high}
              />
              <ResultBar 
                label="Medium Impact" 
                percent={getPercent(stats.medium)} 
                barClass="fill-mid" 
                textClass="text-mid" 
                votes={stats.medium}
              />
              <ResultBar 
                label="Low Impact" 
                percent={getPercent(stats.low)} 
                barClass="fill-low" 
                textClass="text-low" 
                votes={stats.low}
              />

              <div className="share-section">
                <button onClick={handleShare} className="share-btn">
                  <Share2 size={16} /> Share Intel
                </button>
                <button 
                  onClick={() => {
                    // Allow user to change vote
                    localStorage.removeItem(`voted_${data.id}`);
                    setHasVoted(false);
                  }}
                  className="change-vote-btn"
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

// Helper Component for Bars
function ResultBar({ label, percent, barClass, textClass, votes }: any) {
  return (
    <div className="bar-wrapper">
      <div className="bar-label-row">
        <span className={textClass}>{label}</span>
        <div className="bar-stats">
          <span className="text-zinc-400 mr-2">{votes} votes</span>
          <span className="text-zinc-300 font-medium">{percent}%</span>
        </div>
      </div>
      <div className="bar-track">
        <div className={`bar-fill ${barClass}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}