'use client';

import type { ExclusionGapsSummary } from '../lib/types';
import { formatCurrency, formatNumber } from '../lib/format';

interface CardDef {
  label: string;
  value: string;
  tone: 'neutral' | 'good' | 'urgent';
}

const CARD_STYLES: Record<CardDef['tone'], { bg: string; text: string }> = {
  neutral: { bg: 'bg-slate-50', text: 'text-slate-700' },
  good: { bg: 'bg-green-50', text: 'text-green-700' },
  urgent: { bg: 'bg-red-50', text: 'text-red-700' },
};

export function ExclusionGapsCards({ summary, currency }: { summary: ExclusionGapsSummary; currency: string }) {
  const cards: CardDef[] = [
    { label: 'Campaigns Checked', value: formatNumber(summary.campaignsChecked), tone: 'neutral' },
    {
      label: 'Campaigns with Gaps',
      value: formatNumber(summary.campaignsWithGaps),
      tone: summary.campaignsWithGaps > 0 ? 'urgent' : 'good',
    },
    {
      label: 'Estimated Wasted Spend (Last 7 Days)',
      value: formatCurrency(summary.estimatedWastedSpend, currency),
      tone: summary.estimatedWastedSpend > 0 ? 'urgent' : 'good',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => {
        const style = CARD_STYLES[c.tone];
        return (
          <div key={c.label} className={`rounded-xl border border-slate-200 p-4 ${style.bg}`}>
            <div className="text-sm font-medium text-slate-500">{c.label}</div>
            <div className={`mt-1 text-2xl font-semibold ${style.text}`}>{c.value}</div>
          </div>
        );
      })}
    </div>
  );
}
