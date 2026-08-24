'use client';

import type { AudienceHealthSummary } from '../lib/types';

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

export function AudienceOverviewCards({ summary }: { summary: AudienceHealthSummary }) {
  const cards: CardDef[] = [
    { label: 'Total Audiences', value: summary.total, tone: 'neutral' },
    { label: 'Ready Audiences', value: summary.ready, tone: 'good' },
    { label: 'Active Audiences', value: summary.active, tone: 'neutral' },
    { label: 'Audiences With Issues', value: summary.issues, tone: summary.issues > 0 ? 'urgent' : 'neutral' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const style = CARD_STYLES[c.tone];
        return (
          <div key={c.label} className={`rounded-xl border border-slate-200 p-4 ${style.bg}`}>
            <div className="text-sm font-medium text-slate-500">{c.label}</div>
            <div className={`mt-1 text-2xl font-semibold ${style.text}`}>{c.value.toLocaleString('en-US')}</div>
          </div>
        );
      })}
    </div>
  );
}
