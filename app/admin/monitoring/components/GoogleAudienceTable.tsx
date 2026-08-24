'use client';

import type { GoogleAudienceRow } from '../lib/types';
import { formatNumber } from '../lib/format';

const HEALTH_STYLES: Record<GoogleAudienceRow['health'], { label: string; className: string }> = {
  good: { label: '🟢 Good', className: 'bg-green-50 text-green-700' },
  warning: { label: '🟡 Warning', className: 'bg-yellow-50 text-yellow-700' },
  issue: { label: '🔴 Issue', className: 'bg-red-50 text-red-700' },
};

function formatMembership(days: number): string {
  if (days <= 0) return '—';
  return `${days} day${days === 1 ? '' : 's'}`;
}

export function GoogleAudienceTable({ audiences }: { audiences: GoogleAudienceRow[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-1 text-base font-semibold text-slate-800">Google Audiences</h2>
      <p className="mb-4 text-xs text-slate-400">
        "Status" reflects Google's own OPEN/CLOSED membership state for the list, not a campaign-style Active/Paused
        toggle — Google has no per-list pause or expiration-date concept.
      </p>

      {audiences.length === 0 ? (
        <div className="text-sm text-slate-400">No remarketing or Customer Match lists found on this account.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">List Name</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Size</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Membership Duration</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Used In Campaigns</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {audiences.map((a) => {
                const style = HEALTH_STYLES[a.health];
                return (
                  <tr key={a.id}>
                    <td className="px-2 py-3 font-medium text-slate-800 align-top">{a.name}</td>
                    <td className="px-2 py-3 text-slate-700 align-top">{a.type}</td>
                    <td className="px-2 py-3 text-slate-700 align-top">{formatNumber(a.size)}</td>
                    <td className="px-2 py-3 text-slate-700 align-top">{formatMembership(a.membershipLifeSpanDays)}</td>
                    <td className="px-2 py-3 text-slate-700 align-top">
                      {a.usedInCampaigns.length > 0 ? (
                        <ul className="space-y-0.5">
                          {a.usedInCampaigns.map((name) => (
                            <li key={name}>{name}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-400">Not used</span>
                      )}
                    </td>
                    <td className="px-2 py-3 align-top">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          a.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {a.status === 'Active' ? '🟢 Active' : '⚪ Closed'}
                      </span>
                    </td>
                    <td className="px-2 py-3 align-top">
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-sm font-medium ${style.className}`}>
                        {style.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
