'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc, increment, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/lib/firebaseClient';
import { X, Share2, BarChart2, BrainCircuit } from 'lucide-react';
import { NewsItem } from '../../app/hooks/useNews';
import toast from 'react-hot-toast';

interface Props {
  data: NewsItem;
  onClose: () => void;
}

export default function MarketPollModal({ data, onClose }: Props) {
  const [stats, setStats] = useState({ low: 0, medium: 0, high: 0, total: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Subscribe to Live Votes
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'market_questions', data.id), (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        setStats({
          low: d.votes?.low || 0,
          medium: d.votes?.medium || 0,
          high: d.votes?.high || 0,
          total: d.total_votes || 0
        });
      }
    });

    if (localStorage.getItem(`voted_${data.id}`)) {
      setHasVoted(true);
    }

    return () => unsub();
  }, [data.id]);

  // 2. Handle Voting
  const handleVote = async (vote: 'low' | 'medium' | 'high') => {
    if (!db) return;
    setLoading(true);

    const ref = doc(db, 'market_questions', data.id);
    
    try {
      await updateDoc(ref, {
        [`votes.${vote}`]: increment(1),
        total_votes: increment(1)
      }).catch(async () => {
        await setDoc(ref, {
          votes: { low: 0, medium: 0, high: 0, [vote]: 1 },
          total_votes: 1,
          question: data.question
        });
      });

      localStorage.setItem(`voted_${data.id}`, 'true');
      setHasVoted(true);
      toast.success("Vote recorded!");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 3. Share Function
  const handleShare = () => {
    const text = `📊 MZPrimer Intel: ${data.question}\n\n🤖 AI View: ${data.aiContext}\n\nCheck the stats here: https://mzprimer.com`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
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
            <div>
              <p className="vote-label">What is your impact projection?</p>
              <div className="vote-grid">
                <button onClick={() => handleVote('low')} disabled={loading} className="vote-btn vote-low">Low</button>
                <button onClick={() => handleVote('medium')} disabled={loading} className="vote-btn vote-mid">Medium</button>
                <button onClick={() => handleVote('high')} disabled={loading} className="vote-btn vote-high">High</button>
              </div>
            </div>
          ) : (
            /* --- VIEW B: RESULTS --- */
            <div className="results-container">
              <div className="results-header">
                <span>Community Sentiment</span>
                <span className="flex items-center gap-1"><BarChart2 size={12}/> {stats.total} votes</span>
              </div>
              
              <ResultBar label="High Impact" percent={getPercent(stats.high)} barClass="fill-high" textClass="text-high" />
              <ResultBar label="Medium Impact" percent={getPercent(stats.medium)} barClass="fill-mid" textClass="text-mid" />
              <ResultBar label="Low Impact" percent={getPercent(stats.low)} barClass="fill-low" textClass="text-low" />

              <button onClick={handleShare} className="share-btn">
                <Share2 size={16} /> Share Intel
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Helper Component for Bars
function ResultBar({ label, percent, barClass, textClass }: any) {
  return (
    <div className="bar-wrapper">
      <div className="bar-label-row">
        <span className={textClass}>{label}</span>
        <span className="text-zinc-400">{percent}%</span>
      </div>
      <div className="bar-track">
        <div className={`bar-fill ${barClass}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}