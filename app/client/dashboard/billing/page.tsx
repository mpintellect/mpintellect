'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Receipt, ShieldCheck } from 'lucide-react';
import BillingHistory from '@/components/BillingHistory';

export default function BillingPage() {
  const router = useRouter();

  return (
    <div className="billing-container relative">
      
      {/* BACK BUTTON */}
      <div className="mb-8">
        <button 
          onClick={() => router.push('/client/dashboard')}
          className="btn-billing-back"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* HEADER */}
      <div className="billing-header">
        <h1 className="billing-title">
          <CreditCard className="text-[#D4AF37]" size={28} /> 
          Billing & Invoices
        </h1>
        <p className="text-zinc-500 text-sm mt-2">
          Manage your subscriptions, view receipts, and monitor your credits.
        </p>
      </div>

      {/* ACTIVE STATUS CARD */}
      <div className="billing-card-main flex justify-between items-center">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Account Security</h3>
          <p className="text-white text-sm flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            Verified Secure via Stripe Intelligence
          </p>
        </div>
        <div className="text-right">
           <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">System Status</span>
           <span className="status-badge">Active</span>
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="billing-card-main">
        <div className="flex items-center gap-2 mb-6">
            <Receipt size={16} className="text-[#D4AF37]" />
            <h2 className="text-xs uppercase font-bold tracking-widest text-white">Transaction History</h2>
        </div>
        <BillingHistory />
      </div>

      <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest mt-12">
        MZPrimer Intelligence LTD • London • secure checkout
      </p>
    </div>
  );
}