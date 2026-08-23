'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { InsightsResponse, Period } from '../lib/types';
import { COMPARISON_LABELS } from '../lib/types';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatRoas,
  formatFrequency,
  formatChangePct,
  FLAG_STYLES,
} from '../lib/format';

interface CardDef {
  key: keyof InsightsResponse['cards'];
  label: string;
  format: (v: number) => string;
}

const CARD_DEFS: CardDef[] = [
  { key: 'spend', label: 'Spend', format: formatCurrency },
  { key: 'conversions', label: 'Conversions', format: formatNumber },
  { key: 'ctr', label: 'CTR', format: formatPercent },
  { key: 'cpa', label: 'Cost Per Result', format: formatCurrency },
  { key: 'roas', label: 'ROAS', format: formatRoas },
  { key: 'reach', label: 'Reach', format: formatNumber },
  { key: 'frequency', label: 'Frequency', format: formatFrequency },
];

export function OverviewCards({ data, period }: { data: InsightsResponse; period: Period }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {CARD_DEFS.map((def) => {
        const card = data.cards[def.key];
        const style = FLAG_STYLES[card.flag];
        const trendUp = (card.changePct ?? 0) > 0;
        const trendDown = (card.changePct ?? 0) < 0;

        return (
          <div key={def.key} className={`rounded-xl border border-slate-200 p-4 ${style.bg}`}>
            <div className="text-sm font-medium text-slate-500">{def.label}</div>
            <div className={`mt-1 text-2xl font-semibold ${style.text}`}>{def.format(card.value)}</div>
            <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
              {trendUp && <TrendingUp size={14} className="text-green-600" />}
              {trendDown && <TrendingDown size={14} className="text-red-600" />}
              {!trendUp && !trendDown && <Minus size={14} className="text-slate-400" />}
              <span>{formatChangePct(card.changePct)}</span>
              <span className="text-slate-400">{COMPARISON_LABELS[period]}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
