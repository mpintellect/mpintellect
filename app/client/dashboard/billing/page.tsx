'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import BillingHistory from '@/components/BillingHistory';

export default function BillingPage() {
  const router = useRouter();

  return (
    <div className="billing-container relative">
      
      {/* BACK BUTTON (Matches Referral UI) */}
      <div className="mb-8">
        <button 
          onClick={() => router.push('/client/dashboard')}
          className="btn-billing-back"
        >
          <ArrowLeft size={16} />
          <span className="ml-2">Dashboard</span>
        </button>
      </div>

      {/* HEADER (Institutional Style) */}
      <div className="billing-header">
        <h1 className="billing-title">
          <CreditCard className="text-[#D4AF37]" size={28} /> 
          Billing Hub
        </h1>
        <p className="text-zinc-500 text-sm mt-2">
          Review your institutional setup allocations and subscription status.
        </p>
      </div>

      {/* STATUS CARD */}
      <div className="billing-card-main flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[9px] uppercase tracking-[2px] text-zinc-600 font-bold mb-1">Billing Security</h3>
          <p className="text-zinc-300 text-xs flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#D4AF37]" />
            Transactions encrypted via Stripe-Relay
          </p>
        </div>
        <div className="text-right">
           <span className="status-badge">Account Verified</span>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="billing-card-main">
        <BillingHistory />
      </div>

      <div className="text-center opacity-30 mt-20">
        <p className="text-[9px] uppercase tracking-[3px] text-zinc-500">
          MZPrimer LTD • Institutional Billing System
        </p>
      </div>
    </div>
  );
}