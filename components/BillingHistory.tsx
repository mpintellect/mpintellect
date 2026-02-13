'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Download, CheckCircle2 } from 'lucide-react';

export default function BillingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBilling() {
      const token = localStorage.getItem('cf_token');
      try {
        const res = await fetch('/api/user/billing', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setHistory(data.history);
      } catch (e) {
        console.error("Billing load failed", e);
      } finally {
        setLoading(false);
      }
    }
    fetchBilling();
  }, []);

  if (loading) return <div className="text-zinc-500 text-[10px] animate-pulse">LOADING_FINANCIAL_RECORDS...</div>;

  return (
    <div className="billing-section">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard size={14} className="text-[#D4AF37]" />
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-white">Billing History</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900">
              <th className="py-3 text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Date</th>
              <th className="py-3 text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Product ID</th>
              <th className="py-3 text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Amount</th>
              <th className="py-3 text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Status</th>
              <th className="py-3 text-[9px] uppercase tracking-wider text-zinc-500 font-bold text-right">Reference</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? history.map((item: any, i) => (
              <tr key={i} className="border-b border-zinc-900/50 hover:bg-zinc-900/30 transition-colors">
                <td className="py-4 text-[11px] text-zinc-300 font-mono">
                  {new Date(item.created_at * 1000).toLocaleDateString()}
                </td>
                <td className="py-4 text-[11px] text-white font-bold">
                  {item.price_id.includes('monthly') ? 'AI PRO SUBSCRIPTION' : 'SETUP CREDITS'}
                </td>
                <td className="py-4 text-[11px] text-[#D4AF37] font-bold">
                  ${parseFloat(item.amount_paid).toFixed(2)}
                </td>
                <td className="py-4">
                  <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase">
                    <CheckCircle2 size={10} /> {item.status}
                  </span>
                </td>
                <td className="py-4 text-right text-[10px] text-zinc-600 font-mono">
                  {item.stripe_session_id.substring(0, 12)}...
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-zinc-600 text-[10px] uppercase tracking-widest">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}