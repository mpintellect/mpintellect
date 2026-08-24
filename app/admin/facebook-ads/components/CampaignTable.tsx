'use client';

import { Fragment, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import type { Campaign, Period } from '../lib/types';
import { COMPARISON_LABELS } from '../lib/types';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatRoas,
  formatFrequency,
  formatChangePct,
  formatDate,
} from '../lib/format';
import { StatusBadge, ColorFlagBadge, HealthBadge } from './StatusBadge';

type SortKey = 'spend' | 'ctr' | 'cpa' | 'roas';

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  DELETED: 'Deleted',
  ARCHIVED: 'Archived',
  PENDING_REVIEW: 'Pending Review',
  DISAPPROVED: 'Disapproved',
  PREAPPROVED: 'Preapproved',
  PENDING_BILLING_INFO: 'Pending Billing',
  CAMPAIGN_PAUSED: 'Paused (Campaign)',
  ADSET_PAUSED: 'Paused (Ad Set)',
  IN_PROCESS: 'In Process',
  WITH_ISSUES: 'With Issues',
};

function statusLabel(status: string): string {
  return STATUS_LABELS[status] || status.replace(/_/g, ' ');
}

export function CampaignTable({ campaigns, period, currency }: { campaigns: Campaign[]; period: Period; currency: string }) {
  const [sortKey, setSortKey] = useState<SortKey>('spend');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const statusCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of campaigns) {
      counts.set(c.effectiveStatus, (counts.get(c.effectiveStatus) || 0) + 1);
    }
    return counts;
  }, [campaigns]);

  const statusOptions = useMemo(() => Array.from(statusCounts.keys()).sort(), [statusCounts]);

  const filtered = useMemo(() => {
    if (statusFilter === 'ALL') return campaigns;
    return campaigns.filter((c) => c.effectiveStatus === statusFilter);
  }, [campaigns, statusFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = a.metrics[sortKey];
      const bv = b.metrics[sortKey];
      return sortDir === 'desc' ? bv - av : av - bv;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function sortHeader(key: SortKey, label: string) {
    const active = sortKey === key;
    return (
      <th
        onClick={() => toggleSort(key)}
        className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-[#3B82F6]"
      >
        {label} {active ? (sortDir === 'desc' ? '▼' : '▲') : ''}
      </th>
    );
  }

  if (campaigns.length === 0) {
    return <div className="rounded-xl border border-slate-200 p-8 text-center text-slate-400">No campaigns found for this period.</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Status:</span>
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            statusFilter === 'ALL'
              ? 'bg-[#3B82F6] text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-[#3B82F6] hover:text-[#3B82F6]'
          }`}
        >
          All ({campaigns.length})
        </button>
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === s
                ? 'bg-[#3B82F6] text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#3B82F6] hover:text-[#3B82F6]'
            }`}
          >
            {statusLabel(s)} ({statusCounts.get(s)})
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-slate-200 p-8 text-center text-slate-400">
          No campaigns match the "{statusLabel(statusFilter)}" filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Campaign</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
            {sortHeader('spend', 'Spend')}
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Impressions</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Clicks</th>
            {sortHeader('ctr', 'CTR')}
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Conversions</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Reach</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Frequency</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Link Clicks</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Conv. Rate</th>
            {sortHeader('cpa', 'CPA')}
            {sortHeader('roas', 'ROAS')}
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Budget Used</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{COMPARISON_LABELS[period]}</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Health</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {sorted.map((c) => {
            const expanded = expandedId === c.id;
            const trendUp = (c.vsPrevPct ?? 0) > 0;
            return (
              <Fragment key={c.id}>
                <tr
                  onClick={() => setExpandedId(expanded ? null : c.id)}
                  className="cursor-pointer hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.effectiveStatus} />
                  </td>
                  <td className="px-4 py-3 text-slate-700">{formatCurrency(c.metrics.spend, currency)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatNumber(c.metrics.impressions)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatNumber(c.metrics.clicks)}</td>
                  <td className="px-4 py-3">
                    <ColorFlagBadge flag={c.flags.ctr} label={formatPercent(c.metrics.ctr)} />
                  </td>
                  <td className="px-4 py-3 text-slate-700">{formatNumber(c.metrics.conversions)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatNumber(c.metrics.reach)}</td>
                  <td className="px-4 py-3">
                    <ColorFlagBadge flag={c.flags.frequency} label={formatFrequency(c.metrics.frequency)} />
                  </td>
                  <td className="px-4 py-3 text-slate-700">{formatNumber(c.metrics.linkClicks)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatPercent(c.metrics.conversionRate)}</td>
                  <td className="px-4 py-3">
                    <ColorFlagBadge flag={c.flags.cpa} label={formatCurrency(c.metrics.cpa, currency)} />
                  </td>
                  <td className="px-4 py-3">
                    <ColorFlagBadge flag={c.flags.roas} label={formatRoas(c.metrics.roas)} />
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {c.budgetUsedPct !== null ? formatPercent(c.budgetUsedPct) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {formatChangePct(c.vsPrevPct)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <HealthBadge health={c.health} />
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </td>
                </tr>
                {expanded && (
                  <tr>
                    <td colSpan={17} className="bg-slate-50 px-4 py-4">
                      <CampaignDetails campaign={c} currency={currency} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CampaignDetails({ campaign, currency }: { campaign: Campaign; currency: string }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <Detail label="Revenue" value={formatCurrency(campaign.metrics.revenue, currency)} />
        <Detail label="Daily Budget" value={campaign.dailyBudget ? formatCurrency(campaign.dailyBudget, currency) : '—'} />
        <Detail
          label="Budget Remaining"
          value={campaign.budgetRemaining !== null ? formatCurrency(campaign.budgetRemaining, currency) : '—'}
        />
        {campaign.startDate !== undefined && <Detail label="Start Date" value={formatDate(campaign.startDate ?? null)} />}
        <Detail label="End Date" value={formatDate(campaign.endDate)} />
        {campaign.avgCpc !== undefined && <Detail label="Avg. CPC" value={formatCurrency(campaign.avgCpc, currency)} />}
        {campaign.avgCpm !== undefined && <Detail label="Avg. CPM" value={formatCurrency(campaign.avgCpm, currency)} />}
        {campaign.qualityScore !== undefined && (
          <Detail label="Quality Score" value={campaign.qualityScore !== null ? `${campaign.qualityScore.toFixed(1)}/10` : '—'} />
        )}
        <Detail label="Status" value={campaign.status} />
        <Detail label="Health" value={campaign.health} />
      </div>

      {campaign.dailyBreakdown && campaign.dailyBreakdown.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Day-by-day breakdown</div>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Spend</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">CTR</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Reach</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Frequency</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Link Clicks</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Conversions</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Conv. Rate</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaign.dailyBreakdown.map((day) => (
                  <tr key={day.date}>
                    <td className="px-3 py-2 text-slate-600">{day.date}</td>
                    <td className="px-3 py-2 text-slate-700">{formatCurrency(day.spend, currency)}</td>
                    <td className="px-3 py-2 text-slate-700">{formatPercent(day.ctr)}</td>
                    <td className="px-3 py-2 text-slate-700">{formatNumber(day.reach)}</td>
                    <td className="px-3 py-2 text-slate-700">{formatFrequency(day.frequency)}</td>
                    <td className="px-3 py-2 text-slate-700">{formatNumber(day.linkClicks)}</td>
                    <td className="px-3 py-2 text-slate-700">{formatNumber(day.conversions)}</td>
                    <td className="px-3 py-2 text-slate-700">{formatPercent(day.conversionRate)}</td>
                    <td className="px-3 py-2 text-slate-700">{formatRoas(day.roas)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="font-medium text-slate-700">{value}</div>
    </div>
  );
}
