'use client';

import { useEffect, useState } from 'react';

// Price ID Mapping based on your Webhook DNA
const PRODUCT_MAP: Record<string, string> = {
  "price_1T2EeZDoB4i1qeaLoOlPHUNU": "BASIC PLAN (10 AI Setups)",
  "price_1T2EfODoB4i1qeaLiNO8SKeZ": "PRO PLAN (20 AI Setups)",
  "price_1SSyUORmR6ESDQvo7dzPKmPt": "ELITE PLAN (30 AI Setups)",
  "price_1T2EiJDoB4i1qeaLFXPjBoCY": "AI Assistant Pro (Monthly)"
}; 

export default function BillingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const token = localStorage.getItem('cf_token');
      const res = await fetch('/api/user/billing', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setHistory(data.history);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  if (loading) return <div className="py-10 text-center text-zinc-500 text-[10px] animate-pulse">SYNCING_TRANSACTIONS...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="billing-table w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Purchased Product</th>
            <th className="text-right">Allocation</th>
            <th className="text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? history.map((item: any, i: number) => (
            <tr key={i}>
              <td className="font-mono text-zinc-500 text-[11px]">
                {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </td>
              <td className="font-bold text-white">
                {PRODUCT_MAP[item.price_id] || "MZ Setup Plan"}
              </td>
              <td className="text-right font-mono text-zinc-400">
                {item.setup_count === 999 ? "UNLIMITED" : `+${item.setup_count}`}
              </td>
              <td className="text-right amount-gold">
                ${parseFloat(item.amount_paid).toFixed(2)}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4} className="py-12 text-center text-zinc-600 text-[10px] uppercase tracking-widest">
                Zero Transactions Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}