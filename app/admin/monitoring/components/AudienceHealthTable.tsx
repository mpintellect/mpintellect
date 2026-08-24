'use client';

import type { AudienceHealthRow } from '../lib/types';

const HEALTH_STYLES: Record<AudienceHealthRow['health'], { label: string; className: string }> = {
  good: { label: '🟢 Good', className: 'bg-green-50 text-green-700' },
  warning: { label: '🟡 Warning', className: 'bg-yellow-50 text-yellow-700' },
  issue: { label: '🔴 Issue', className: 'bg-red-50 text-red-700' },
  unused: { label: '⚪ Unused', className: 'bg-slate-50 text-slate-500' },
};

function formatSize(size: number | null): string {
  if (size === null) return '—';
  return `~${size.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function formatLastUsed(value: string | null): string {
  if (!value) return 'Not used recently';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function AudienceHealthTable({ audiences }: { audiences: AudienceHealthRow[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-800">Audience Health</h2>

      {audiences.length === 0 ? (
        <div className="text-sm text-slate-400">No custom or lookalike audiences found on this ad account.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Audience Name</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Size</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Operation Status</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Delivery Status</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Last Used</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {audiences.map((a) => {
                const style = HEALTH_STYLES[a.health];
                return (
                  <tr key={a.id}>
                    <td className="px-2 py-3 font-medium text-slate-800 align-top">
                      {a.name}
                      {a.usedInCampaign && <div className="mt-1 text-xs font-normal text-slate-400">{a.usedInCampaign}</div>}
                    </td>
                    <td className="px-2 py-3 text-slate-700 align-top">{a.subtype.replace(/_/g, ' ')}</td>
                    <td className="px-2 py-3 text-slate-700 align-top">{formatSize(a.size)}</td>
                    <td className="px-2 py-3 text-slate-700 align-top">{a.operationStatus}</td>
                    <td className="px-2 py-3 text-slate-700 align-top">{a.deliveryStatus}</td>
                    <td className="px-2 py-3 text-slate-700 align-top">{formatLastUsed(a.lastUsed)}</td>
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
