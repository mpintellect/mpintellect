'use client';

import { useEffect, useState } from 'react';

export default function BillingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const token = localStorage.getItem('cf_token');
      try {
        const res = await fetch('/api/user/billing', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setHistory(data.history);
      } catch (e) {
        console.error("Billing fetch error", e);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) return <div className="py-10 text-center text-zinc-500 text-[10px] animate-pulse">SYNCING_LEDGER...</div>;

  if (history.length === 0) {
    return (
      <div className="py-10 text-center border border-dashed border-zinc-900 rounded-lg">
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest">No transaction records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="billing-table w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Reference</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item: any, i) => (
            <tr key={i}>
              <td className="font-mono text-zinc-400">
                {new Date(item.created_at * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </td>
              <td className="font-bold text-white">
                {item.price_id.includes('monthly') ? 'AI Assistant PRO' : 'MZ Setup Bundle'}
              </td>
              <td className="text-[10px] text-zinc-600 font-mono">
                {item.stripe_session_id.substring(0, 14)}...
              </td>
              <td className="text-right amount-gold">
                ${parseFloat(item.amount_paid).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}