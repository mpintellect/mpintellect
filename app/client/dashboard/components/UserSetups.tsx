"use client";

import { useEffect, useState } from "react";

interface Setup {
  id: string;
  symbol: string;
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  generatedAt: string;
  status: "pending" | "hit_tp" | "hit_sl" | "expired";
  lotSize: number;
  capital: number;
  riskReward: number;
}

export default function UserSetups() {
  const [userId, setUserId] = useState<string | null>(null);
  const [setups, setSetups] = useState<Setup[]>([]);
  const [loading, setLoading] = useState(true);

  // Get user from localStorage (Cloudflare auth)
  useEffect(() => {
    const token = localStorage.getItem('cf_token');
    const userData = localStorage.getItem('cf_user');
    
    if (!token || !userData) {
      console.log("❌ No user authenticated");
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUserId(user.id);
      
      fetchSetups(user.id);
    } catch (error) {
      console.error("❌ Error parsing user data:", error);
      setLoading(false);
    }
  }, []);

  // Fetch setups from Cloudflare API
  const fetchSetups = async (userId: string) => {
    try {
      console.log("🔍 Fetching setups for user:", userId);
      
      const response = await fetch(`/api/setups?userId=${userId}&limit=20`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.setups) {
        console.log("🔍 Fetched setups:", data.setups.length);
        
        // Transform the data to match our interface
        const transformedSetups: Setup[] = data.setups.map((setup: any) => ({
          id: setup.id,
          symbol: setup.symbol,
          entryPrice: parseFloat(setup.entry_price),
          takeProfit: parseFloat(setup.take_profit),
          stopLoss: parseFloat(setup.stop_loss),
          generatedAt: setup.generated_at || setup.created_at,
          status: setup.status,
          lotSize: parseFloat(setup.lot_size) || 0.01,
          capital: parseFloat(setup.capital) || 1000,
          riskReward: parseFloat(setup.risk_reward) || 1.5
        }));
        
        setSetups(transformedSetups);
      } else {
        throw new Error(data.error || "Failed to fetch setups");
      }
    } catch (error: any) {
      console.error("❌ Error fetching setups:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-700';
      case 'hit_tp':
        return 'bg-green-700';
      case 'hit_sl':
        return 'bg-red-700';
      case 'expired':
        return 'bg-gray-700';
      default:
        return 'bg-gray-700';
    }
  };

  // Get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'hit_tp':
        return 'Hit TP';
      case 'hit_sl':
        return 'Hit SL';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };

  // =============================
  //   UI SECTION
  // =============================
  if (loading) {
    return (
      <div className="setup-history mt-6 p-4 rounded-lg bg-[#1b1b1b]">
        <h3 className="text-lg font-semibold text-white mb-4">
          📈 My Trade Setups
        </h3>
        <p className="text-center text-sm text-gray-400">Loading setups...</p>
      </div>
    );
  }

  if (setups.length === 0) {
    return (
      <div className="setup-history mt-6 p-4 rounded-lg bg-[#1b1b1b]">
        <h3 className="text-lg font-semibold text-white mb-4">
          📈 My Trade Setups
        </h3>
        <p className="text-center text-sm text-gray-400">
          No setups found yet. Start analyzing to see your trade history.
        </p>
      </div>
    );
  }

  return (
    <div className="setup-history mt-6 p-4 rounded-lg bg-[#1b1b1b]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">
          📈 My Trade Setups ({setups.length})
        </h3>
        <button 
          onClick={() => userId && fetchSetups(userId)}
          className="text-xs text-gray-400 hover:text-white px-3 py-1 border border-gray-700 rounded hover:bg-gray-800 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b border-gray-600 text-gray-300">
            <tr>
              <th className="px-2 py-1">Symbol</th>
              <th className="px-2 py-1">Entry</th>
              <th className="px-2 py-1">TP</th>
              <th className="px-2 py-1">SL</th>
              <th className="px-2 py-1">RR</th>
              <th className="px-2 py-1">Date</th>
              <th className="px-2 py-1">Status</th>
            </tr>
          </thead>

          <tbody>
            {setups.map((setup) => (
              <tr key={setup.id} className="border-b border-gray-800 text-white hover:bg-gray-900 transition-colors">
                <td className="px-2 py-2 font-medium">
                  <div className="font-bold">{setup.symbol}</div>
                  <div className="text-xs text-gray-400">Lot: {setup.lotSize}</div>
                </td>
                <td className="px-2 py-2 font-mono">
                  {setup.entryPrice.toFixed(5)}
                </td>
                <td className="px-2 py-2 font-mono text-green-400">
                  {setup.takeProfit.toFixed(5)}
                </td>
                <td className="px-2 py-2 font-mono text-red-400">
                  {setup.stopLoss.toFixed(5)}
                </td>
                <td className="px-2 py-2">
                  <span className="text-xs bg-blue-900 px-2 py-1 rounded">
                    {setup.riskReward.toFixed(1)}:1
                  </span>
                </td>
                <td className="px-2 py-2 text-gray-300 text-xs">
                  {formatDate(setup.generatedAt)}
                </td>
                <td className="px-2 py-2">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(setup.status)}`}>
                    {getStatusText(setup.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Showing {setups.length} most recent setups
      </div>
    </div>
  );
}