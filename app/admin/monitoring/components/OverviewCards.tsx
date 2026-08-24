'use client';

import type { InsightsResponse } from '../lib/types';
import { formatCurrency, formatNumber, formatPercent, formatFrequency, FLAG_STYLES } from '../lib/format';

interface CardDef {
  key: keyof InsightsResponse['cards'];
  label: string;
  format: (v: number) => string;
}

/**
 * Deliberately just the 6 signals that are meaningful without conversion
 * tracking set up: Spend, Impressions, Reach, CTR, Frequency, Cost Per Link
 * Click. Conversions/CPA/ROAS/Cost Per Result are still fetched (see
 * InsightsResponse) and will be worth surfacing again once a Pixel/GAQL
 * conversion action is actually configured - for now they're 100% noise.
 */
export function OverviewCards({ data }: { data: InsightsResponse }) {
  const CARD_DEFS: CardDef[] = [
    { key: 'spend', label: 'Spend', format: (v) => formatCurrency(v, data.currency) },
    { key: 'impressions', label: 'Impressions', format: formatNumber },
    { key: 'reach', label: 'Reach', format: formatNumber },
    { key: 'ctr', label: 'CTR', format: formatPercent },
    { key: 'frequency', label: 'Frequency', format: formatFrequency },
    { key: 'costPerLinkClick', label: 'Cost / Link Click', format: (v) => formatCurrency(v, data.currency) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {CARD_DEFS.map((def) => {
        const card = data.cards[def.key];
        const style = FLAG_STYLES[card.flag];

        return (
          <div key={def.key} className={`rounded-xl border border-slate-200 p-4 ${style.bg}`}>
            <div className="text-sm font-medium text-slate-500">{def.label}</div>
            <div className={`mt-1 text-2xl font-semibold ${style.text}`}>{def.format(card.value)}</div>
          </div>
        );
      })}
    </div>
  );
}
