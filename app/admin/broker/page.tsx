'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import InvestizoPanel from './InvestizoPanel';
import LiteFinancePanel from './LiteFinancePanel';

// ----------------------------------------------------------------------------
// Single "Broker" admin hub for both broker integrations - Investizo
// (invest-panel.com, backend-lib/investizo-scraper.ts) and LiteFinance
// (admin.litefinance.com, tampermonkey/litefinance-sync.user.js). Each
// keeps its own data, sync mechanism, and D1 tables entirely separate
// (broker_* vs litefinance_*) - this page only merges the UI entry point so
// there's one "Broker" card in the admin hub instead of two, with a
// Broker 1 / Broker 2 switch at the top. See InvestizoPanel.tsx and
// LiteFinancePanel.tsx for each broker's actual dashboard.
// ----------------------------------------------------------------------------

export default function BrokerAdminHub() {
  const [broker, setBroker] = useState<'investizo' | 'litefinance'>('investizo');

  return (
    <div className="min-h-screen bg-white text-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-2">
            <ArrowLeft size={14} /> Admin
          </Link>
          <h1 className="text-2xl font-bold">Broker</h1>
        </div>

        <div className="flex gap-6 border-b border-slate-200 mb-8">
          <button
            onClick={() => setBroker('investizo')}
            className={`pb-3 text-base font-semibold border-b-2 -mb-px ${
              broker === 'investizo' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Broker 1 (Investizo)
          </button>
          <button
            onClick={() => setBroker('litefinance')}
            className={`pb-3 text-base font-semibold border-b-2 -mb-px ${
              broker === 'litefinance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Broker 2 (LiteFinance)
          </button>
        </div>

        {broker === 'investizo' ? <InvestizoPanel /> : <LiteFinancePanel />}
      </div>
    </div>
  );
}
