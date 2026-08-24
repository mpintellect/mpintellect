'use client';

import type { AudienceOverlapResponse } from '../lib/types';
import { formatCurrency, formatNumber } from '../lib/format';

function SeverityBadge({ severity }: { severity: 'warning' | 'urgent' }) {
  const style = severity === 'urgent' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700';
  const label = severity === 'urgent' ? '🔴 Urgent' : '⚠️ Warning';
  return <span className={`inline-flex items-center rounded px-2 py-0.5 text-sm font-medium ${style}`}>{label}</span>;
}

interface CardDef {
  label: string;
  value: string;
  tone: 'neutral' | 'warning' | 'urgent';
}

export function AudienceOverlap({ data }: { data: AudienceOverlapResponse }) {
  const { summary, overlaps, currency } = data;

  const cards: CardDef[] = [
    { label: 'Total Audiences', value: formatNumber(summary.totalAudiences), tone: 'neutral' },
    { label: 'Shared Audiences', value: formatNumber(summary.sharedAudiences), tone: summary.sharedAudiences > 0 ? 'warning' : 'neutral' },
    {
      label: 'Combined At-Risk Spend',
      value: formatCurrency(summary.combinedAtRiskSpend, currency),
      tone: summary.combinedAtRiskSpend > 0 ? 'warning' : 'neutral',
    },
    { label: 'Audiences With Issues', value: formatNumber(summary.audiencesWithIssues), tone: summary.audiencesWithIssues > 0 ? 'urgent' : 'neutral' },
  ];

  const CARD_STYLES: Record<CardDef['tone'], { bg: string; text: string }> = {
    neutral: { bg: 'bg-slate-50', text: 'text-slate-700' },
    warning: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
    urgent: { bg: 'bg-red-50', text: 'text-red-700' },
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Meta doesn't expose true audience-to-audience overlap via the Marketing API, so this isn't an estimated overlap
        percentage. It's the one thing that <em>is</em> verifiable: the exact same custom audience being targeted by 2+
        campaigns running at the same time - guaranteed competition for the same people in the same auction.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const style = CARD_STYLES[c.tone];
          return (
            <div key={c.label} className={`rounded-xl border border-slate-200 p-4 ${style.bg}`}>
              <div className="text-sm font-medium text-slate-500">{c.label}</div>
              <div className={`mt-1 text-2xl font-semibold ${style.text}`}>{c.value}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-slate-800">Shared Audiences</h2>

        {overlaps.length === 0 ? (
          <div className="text-sm text-slate-400">
            No shared audiences found — each of your {summary.totalAudiences} custom audience{summary.totalAudiences === 1 ? '' : 's'} is
            used by at most one active campaign right now.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Audience</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Size</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Campaigns Competing</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Combined Spend</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overlaps.map((o) => (
                  <tr key={o.audience.id}>
                    <td className="px-2 py-3 font-medium text-slate-800 align-top">
                      {o.audience.name}
                      <div className="mt-1 text-xs font-normal text-slate-400">{o.audience.subtype.replace(/_/g, ' ')}</div>
                    </td>
                    <td className="px-2 py-3 text-slate-700 align-top">
                      {o.audience.sizeEstimate !== null ? `~${formatNumber(o.audience.sizeEstimate)}` : '—'}
                    </td>
                    <td className="px-2 py-3 text-slate-700 align-top">
                      <ul className="space-y-0.5">
                        {o.campaigns.map((c) => (
                          <li key={c.id}>
                            {c.name} <span className="text-slate-400">({formatCurrency(c.spend, currency)})</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-2 py-3 text-slate-700 align-top">{formatCurrency(o.combinedSpend, currency)}</td>
                    <td className="px-2 py-3 align-top">
                      <SeverityBadge severity={o.severity} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {overlaps.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-base font-semibold text-slate-800">Recommendations</h2>
          <ul className="space-y-2">
            {overlaps.map((o) => {
              const border = o.severity === 'urgent' ? 'border-l-red-500' : 'border-l-yellow-500';
              const bg = o.severity === 'urgent' ? 'bg-red-50' : 'bg-yellow-50';
              return (
                <li key={o.audience.id} className={`flex items-start gap-3 rounded-r-lg border-l-4 ${border} ${bg} px-4 py-3`}>
                  <span className="text-lg leading-none">{o.severity === 'urgent' ? '🔴' : '⚠️'}</span>
                  <div className="text-sm text-slate-700">{o.recommendation}</div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
