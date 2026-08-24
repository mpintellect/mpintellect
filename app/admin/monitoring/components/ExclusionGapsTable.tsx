'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ExclusionGap } from '../lib/types';
import { formatCurrency } from '../lib/format';
import { StatusBadge } from './StatusBadge';

type SortKey = 'campaignName' | 'status' | 'spendLast7Days' | 'missingExclusion' | 'estimatedSavings';

const COLUMNS: Array<{ key: SortKey; label: string }> = [
  { key: 'campaignName', label: 'Campaign Name' },
  { key: 'status', label: 'Status' },
  { key: 'spendLast7Days', label: 'Spend (Last 7 Days)' },
  { key: 'missingExclusion', label: 'Missing Exclusion' },
  { key: 'estimatedSavings', label: 'Estimated Savings' },
];

export function ExclusionGapsTable({ gaps, currency }: { gaps: ExclusionGap[]; currency: string }) {
  const [sortKey, setSortKey] = useState<SortKey>('estimatedSavings');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = useMemo(() => {
    const copy = [...gaps];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [gaps, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-1 text-base font-semibold text-slate-800">Exclusion Gaps</h2>
      <p className="mb-4 text-xs text-slate-400">
        "Estimated Savings" is a disclosed estimate (a share of the campaign's last-7-day spend), not a measured
        value — Meta doesn't expose how much spend actually reached an audience that should have been excluded.
      </p>

      {gaps.length === 0 ? (
        <div className="text-sm text-slate-400">No exclusion gaps found across the checked campaigns.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="cursor-pointer select-none px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-[#3B82F6]"
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key &&
                        (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                    </span>
                  </th>
                ))}
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((g, i) => (
                <tr key={`${g.campaignId}-${g.missingExclusion}-${i}`}>
                  <td className="px-2 py-3 font-medium text-slate-800 align-top">{g.campaignName}</td>
                  <td className="px-2 py-3 align-top">
                    <StatusBadge status={g.status} />
                  </td>
                  <td className="px-2 py-3 text-slate-700 align-top">{formatCurrency(g.spendLast7Days, currency)}</td>
                  <td className="px-2 py-3 align-top">
                    <span className="inline-flex items-center rounded px-2 py-0.5 text-sm font-medium bg-red-50 text-red-700">
                      🔴 {g.missingExclusion}
                    </span>
                  </td>
                  <td className="px-2 py-3 align-top font-semibold text-[#3B82F6]">{formatCurrency(g.estimatedSavings, currency)}</td>
                  <td className="px-2 py-3 text-slate-700 align-top">{g.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
