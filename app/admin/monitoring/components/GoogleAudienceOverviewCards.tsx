'use client';

import type { GoogleAudienceSummary } from '../lib/types';
import { formatNumber } from '../lib/format';

interface CardDef {
  label: string;
  value: number;
  tone: 'neutral' | 'good' | 'urgent';
}

const CARD_STYLES: Record<CardDef['tone'], { bg: string; text: string }> = {
  neutral: { bg: 'bg-slate-50', text: 'text-slate-700' },
  good: { bg: 'bg-green-50', text: 'text-green-700' },
  urgent: { bg: 'bg-red-50', text: 'text-red-700' },
};

export function GoogleAudienceOverviewCards({ summary }: { summary: GoogleAudienceSummary }) {
  const cards: CardDef[] = [
    { label: 'Total Lists', value: summary.totalLists, tone: 'neutral' },
    { label: 'Active Lists', value: summary.activeLists, tone: summary.activeLists > 0 ? 'good' : 'neutral' },
    { label: 'Lists with Size (>1,000)', value: summary.listsWithSize, tone: 'neutral' },
    {
      label: 'Lists with Issues',
      value: summary.listsWithIssues,
      tone: summary.listsWithIssues > 0 ? 'urgent' : 'good',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const style = CARD_STYLES[c.tone];
        return (
          <div key={c.label} className={`rounded-xl border border-slate-200 p-4 ${style.bg}`}>
            <div className="text-sm font-medium text-slate-500">{c.label}</div>
            <div className={`mt-1 text-2xl font-semibold ${style.text}`}>{formatNumber(c.value)}</div>
          </div>
        );
      })}
    </div>
  );
}
