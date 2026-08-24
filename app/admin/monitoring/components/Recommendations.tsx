'use client';

import type { Recommendation } from '../lib/types';

const TYPE_STYLES: Record<Recommendation['type'], { border: string; bg: string; label: string }> = {
  increase_budget: { border: 'border-l-green-500', bg: 'bg-green-50', label: 'Increase Budget' },
  pause_campaign: { border: 'border-l-red-500', bg: 'bg-red-50', label: 'Pause Campaign' },
  monitor_closely: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', label: 'Monitor Closely' },
  budget_warning: { border: 'border-l-blue-500', bg: 'bg-blue-50', label: 'Budget Warning' },
  good_performance: { border: 'border-l-green-500', bg: 'bg-green-50', label: 'Good Performance' },
  low_ctr: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', label: 'Low CTR' },
  high_frequency: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', label: 'Ad Fatigue' },
  low_reach: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', label: 'Low Reach' },
  high_spend_low_clicks: { border: 'border-l-red-500', bg: 'bg-red-50', label: 'Low Relevance' },
  no_conversion_tracking: { border: 'border-l-blue-500', bg: 'bg-blue-50', label: 'Tracking Gap' },
  high_cpc: { border: 'border-l-red-500', bg: 'bg-red-50', label: 'High CPC' },
  low_conversion_rate: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', label: 'Low Conversion Rate' },
  budget_depleted: { border: 'border-l-blue-500', bg: 'bg-blue-50', label: 'Budget Depleted' },
  high_impression_share_lost_budget: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', label: 'Impression Share Lost (Budget)' },
  high_impression_share_lost_rank: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', label: 'Impression Share Lost (Rank)' },
  wasted_search_terms: { border: 'border-l-red-500', bg: 'bg-red-50', label: 'Wasted Search Terms' },
  wasted_placement: { border: 'border-l-red-500', bg: 'bg-red-50', label: 'Wasted Placement' },
  high_cpa: { border: 'border-l-red-500', bg: 'bg-red-50', label: 'High CPA' },
  efficient_cpa: { border: 'border-l-green-500', bg: 'bg-green-50', label: 'Efficient CPA' },
  low_impressions: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', label: 'Low Delivery' },
  high_cost_per_click: { border: 'border-l-red-500', bg: 'bg-red-50', label: 'High Cost / Click' },
  low_budget_utilization: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', label: 'Underspending' },
  low_reach_ratio: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', label: 'Repeat Audience' },
  reach_declining: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', label: 'Reach Declining' },
};

/**
 * Until conversion tracking (Pixel / GAQL conversion action) is actually
 * set up, every conversions/CPA/ROAS-derived recommendation is either
 * permanently silent (good, no noise) or - worse - telling the user
 * something they already know ("no conversions tracked"). Filtering the
 * feed down to signals that are meaningful on delivery/engagement data
 * alone keeps it "only what I can act on right now". Widen this list once
 * conversion tracking is live.
 */
const ACTIONABLE_WITHOUT_CONVERSION_TRACKING: ReadonlySet<Recommendation['type']> = new Set([
  'low_ctr',
  'high_frequency',
  'low_reach',
  'low_reach_ratio',
  'reach_declining',
  'high_cost_per_click',
  'low_budget_utilization',
  'low_impressions',
]);

export function Recommendations({ scope, recommendations }: { scope: 'daily' | 'weekly'; recommendations: Recommendation[] }) {
  const filtered = recommendations.filter((r) => ACTIONABLE_WITHOUT_CONVERSION_TRACKING.has(r.type));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-800">
        {scope === 'daily' ? 'Daily Recommendations — what to do today' : 'Weekly Recommendations — what to do this week'}
      </h2>

      {filtered.length === 0 ? (
        <div className="text-sm text-slate-400">No recommendations yet — not enough data for this period.</div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((r, i) => {
            const style = TYPE_STYLES[r.type];
            return (
              <li key={`${r.campaignId}-${r.type}-${i}`} className={`flex items-start gap-3 rounded-r-lg border-l-4 ${style.border} ${style.bg} px-4 py-3`}>
                <span className="text-lg leading-none">{r.icon}</span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{style.label}</div>
                  <div className="text-sm text-slate-700">{r.message}</div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
