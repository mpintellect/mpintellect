'use client';

import { useState } from 'react';
import type { SearchTermRow } from '../lib/types';
import { formatCurrency, formatNumber, formatPercent } from '../lib/format';

export function SearchTermsTable({
  searchTerms,
  negativeCandidates,
  currency,
}: {
  searchTerms: SearchTermRow[];
  negativeCandidates: SearchTermRow[];
  currency: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const negativeKeys = new Set(negativeCandidates.map((t) => `${t.campaignId}|${t.searchTerm}`));
  const rows = showAll ? searchTerms : searchTerms.slice(0, 20);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Search Terms</h2>
        {negativeCandidates.length > 0 && (
          <span className="text-xs font-medium text-red-600">
            {negativeCandidates.length} negative keyword candidate{negativeCandidates.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {searchTerms.length === 0 ? (
        <div className="text-sm text-slate-400">No search term data for this period (Search campaigns only).</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Search Term</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Campaign</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Spend</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">CTR</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Clicks</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Conv.</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((t) => {
                  const isNegativeCandidate = negativeKeys.has(`${t.campaignId}|${t.searchTerm}`);
                  return (
                    <tr key={`${t.campaignId}-${t.searchTerm}`} className={isNegativeCandidate ? 'bg-red-50' : ''}>
                      <td className="px-2 py-2 font-medium text-slate-800">{t.searchTerm}</td>
                      <td className="px-2 py-2 text-slate-600">{t.campaignName}</td>
                      <td className="px-2 py-2 text-slate-700">{formatCurrency(t.spend, currency)}</td>
                      <td className="px-2 py-2 text-slate-700">{formatPercent(t.ctr)}</td>
                      <td className="px-2 py-2 text-slate-700">{formatNumber(t.clicks)}</td>
                      <td className="px-2 py-2 text-slate-700">{formatNumber(t.conversions)}</td>
                      <td className="px-2 py-2">
                        {isNegativeCandidate && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Suggest negative</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {searchTerms.length > 20 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="mt-3 text-xs font-medium text-[#3B82F6] hover:underline"
            >
              {showAll ? 'Show fewer' : `Show all ${searchTerms.length} search terms`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
