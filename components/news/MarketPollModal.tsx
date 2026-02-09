'use client';
import { useState, useEffect } from 'react';
import { X, BarChart2, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MarketPollModal({ data, onClose }: any) {
  const [stats, setStats] = useState({ low: 0, medium: 0, high: 0, total: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Initial Load
  useEffect(() => {
    fetch(`/api/polls/${data.id}`).then(res => res.json()).then(res => {
      if (res.success) setStats(res.poll);
    });
    if (localStorage.getItem(`voted_${data.id}`)) setHasVoted(true);
  }, [data.id]);

  // 2. Voting Logic
  const handleVote = async (choice: 'low' | 'medium' | 'high') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('cf_token') || localStorage.getItem('mz_token');
      const userRaw = localStorage.getItem('cf_user') || localStorage.getItem('mz_user');
      if (!token || !userRaw) {
        toast.error("Please login to vote");
        return;
      }
      const user = JSON.parse(userRaw);

      const res = await fetch(`/api/polls/${data.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote: choice, userId: user.id, userName: user.display_name })
      });

      const result = await res.json();
      if (result.success) {
        // ✅ INSTANT EFFECT: Update stats from server response
        setStats(result.poll);
        setHasVoted(true);
        localStorage.setItem(`voted_${data.id}`, 'true');
        toast.success("Thank you! Your vote has been recorded.");
      }
    } catch (e) {
      toast.error("Vote failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPercent = (val: number) => stats.total === 0 ? 0 : Math.round((val / stats.total) * 100);

  return (
    <div className="poll-overlay fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="poll-card bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="flex gap-2 text-[10px] font-bold text-blue-500 mb-4 uppercase tracking-widest">
            <span className="px-2 py-1 bg-blue-500/10 rounded">{data.symbol}</span>
            <span className="px-2 py-1 bg-zinc-800 rounded">LIVE_CONSENSUS</span>
          </div>

          <h2 className="text-xl font-bold mb-4">{data.question}</h2>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mb-6">
             <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-2 uppercase">
               <BrainCircuit size={14} /> AI Sentiment
             </div>
             <p className="text-sm text-zinc-400 leading-relaxed italic">"{data.aiContext}"</p>
          </div>

          {!hasVoted ? (
            <div className="space-y-4">
              <p className="text-center text-xs font-bold text-zinc-500 uppercase">Rate expected market impact</p>
              <div className="grid grid-cols-3 gap-3">
                {['low', 'medium', 'high'].map((v) => (
                  <button key={v} onClick={() => handleVote(v as any)} disabled={loading}
                    className="py-4 rounded-xl border border-zinc-800 hover:border-blue-500 hover:bg-blue-500/5 font-bold uppercase transition-all">
                    {loading ? '...' : v}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
                <h3 className="text-green-400 font-bold">✓ VOTE_RECORDED</h3>
                <span className="text-[10px] font-mono text-zinc-500">{stats.total} TOTAL_VOTES</span>
              </div>
              
              {['high', 'medium', 'low'].map((label) => (
                <div key={label}>
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase">
                    <span className={label === 'high' ? 'text-red-400' : label === 'medium' ? 'text-yellow-400' : 'text-blue-400'}>{label} Impact</span>
                    <span>{getPercent((stats as any)[label])}%</span>
                  </div>
                  <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-zinc-800">
                    <div className={`h-full transition-all duration-1000 ${label === 'high' ? 'bg-red-500' : label === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                         style={{ width: `${getPercent((stats as any)[label])}%` }} />
                  </div>
                </div>
              ))}
              
              <button onClick={onClose} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold uppercase transition">Return to Intelligence</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}