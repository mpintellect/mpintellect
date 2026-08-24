'use client';

import type { Period } from '../lib/types';
import { PERIOD_LABELS } from '../lib/types';

const PERIODS: Period[] = ['today', 'yesterday', 'last_7_days', 'this_week', 'last_week'];

export function DateFilter({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PERIODS.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            value === p
              ? 'bg-[#3B82F6] text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-[#3B82F6] hover:text-[#3B82F6]'
          }`}
        >
          {PERIOD_LABELS[p]}
        </button>
      ))}
    </div>
  );
}
