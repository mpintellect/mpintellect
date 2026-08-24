'use client';

import type { GoogleExclusionGap } from '../lib/types';

function StatusPill({ status }: { status: string }) {
  const isActive = status === 'ENABLED';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
      }`}
    >
      {isActive ? '🟢 Active' : '🔴 Paused'}
    </span>
  );
}

export function GoogleExclusionGapsTable({ gaps }: { gaps: GoogleExclusionGap[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-1 text-base font-semibold text-slate-800">Exclusion Gaps</h2>
      <p className="mb-4 text-xs text-slate-400">
        Checks ENABLED campaigns against remarketing/Customer Match lists whose name or description signals they're
        built from people who already purchased or converted.
      </p>

      {gaps.length === 0 ? (
        <div className="text-sm text-slate-400">No exclusion gaps found across the checked campaigns.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Campaign Name</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Missing Exclusion</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gaps.map((g, i) => (
                <tr key={`${g.campaignId}-${g.missingExclusion}-${i}`}>
                  <td className="px-2 py-3 font-medium text-slate-800 align-top">{g.campaignName}</td>
                  <td className="px-2 py-3 align-top">
                    <StatusPill status={g.status} />
                  </td>
                  <td className="px-2 py-3 align-top">
                    <span className="inline-flex items-center rounded px-2 py-0.5 text-sm font-medium bg-red-50 text-red-700">
                      🔴 {g.missingExclusion}
                    </span>
                  </td>
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
