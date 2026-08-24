'use client';

import type { DeviceRow, PlacementRow } from '../lib/types';
import { formatCurrency, formatNumber, formatPercent } from '../lib/format';

const PLATFORM_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  audience_network: 'Audience Network',
  messenger: 'Messenger',
};

const POSITION_LABELS: Record<string, string> = {
  feed: 'Feed',
  story: 'Stories',
  reels: 'Reels',
  instream_video: 'In-Stream Video',
  video_feeds: 'Video Feeds',
  marketplace: 'Marketplace',
  search: 'Search',
  right_hand_column: 'Right Column',
  classic: 'Classic',
  instant_article: 'Instant Article',
};

const DEVICE_LABELS: Record<string, string> = {
  mobile_app: 'Mobile App',
  mobile_web: 'Mobile Web',
  desktop: 'Desktop',
  tablet: 'Tablet',
  other: 'Other',
};

function label(map: Record<string, string>, key: string): string {
  return map[key] || key.replace(/_/g, ' ');
}

export function PlacementBreakdown({
  placements,
  devices,
  currency,
}: {
  placements: PlacementRow[];
  devices: DeviceRow[];
  currency: string;
}) {
  const totalSpend = placements.reduce((sum, p) => sum + p.spend, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-slate-800">Spend by Placement</h2>
        {placements.length === 0 ? (
          <div className="text-sm text-slate-400">No placement data for this period.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Placement</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Spend</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">% of Spend</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">CTR</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Conv.</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">CPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {placements.map((p) => {
                  const share = totalSpend > 0 ? (p.spend / totalSpend) * 100 : 0;
                  const wasteful = p.spend > 0 && p.conversions === 0 && p.impressions >= 500;
                  return (
                    <tr key={`${p.publisherPlatform}-${p.platformPosition}`} className={wasteful ? 'bg-red-50' : ''}>
                      <td className="px-2 py-2 text-slate-700">
                        {label(PLATFORM_LABELS, p.publisherPlatform)} — {label(POSITION_LABELS, p.platformPosition)}
                      </td>
                      <td className="px-2 py-2 text-slate-700">{formatCurrency(p.spend, currency)}</td>
                      <td className="px-2 py-2 text-slate-700">{formatPercent(share)}</td>
                      <td className="px-2 py-2 text-slate-700">{formatPercent(p.ctr)}</td>
                      <td className="px-2 py-2 text-slate-700">{formatNumber(p.conversions)}</td>
                      <td className="px-2 py-2 text-slate-700">{p.conversions > 0 ? formatCurrency(p.cpa, currency) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-slate-800">Spend by Device</h2>
        {devices.length === 0 ? (
          <div className="text-sm text-slate-400">No device data for this period.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Device</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Spend</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">CTR</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Conv.</th>
                  <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">CPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {devices.map((d) => (
                  <tr key={d.device}>
                    <td className="px-2 py-2 text-slate-700">{label(DEVICE_LABELS, d.device)}</td>
                    <td className="px-2 py-2 text-slate-700">{formatCurrency(d.spend, currency)}</td>
                    <td className="px-2 py-2 text-slate-700">{formatPercent(d.ctr)}</td>
                    <td className="px-2 py-2 text-slate-700">{formatNumber(d.conversions)}</td>
                    <td className="px-2 py-2 text-slate-700">{d.conversions > 0 ? formatCurrency(d.cpa, currency) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
