// backend-lib/facebook.ts
// Shared Facebook Marketing API (Graph API) helpers for the Facebook Ads
// monitoring dashboard (functions/api/facebook/*). Read-only: no campaign
// creation or audience management here.
//
// Period/date-range math, color-flag scoring, and admin auth live in
// ad-shared.ts (used by both this file and backend-lib/google-ads.ts) and
// are re-exported here so functions/api/facebook/*.ts imports don't change.

export type {
  Period,
  DateRange,
  ColorFlag,
} from './ad-shared';

export {
  getDateRange,
  getComparisonDateRange,
  isWeeklyPeriod,
  parsePeriod,
  classifyCtr,
  classifyRoas,
  classifySpend,
  classifyConversions,
  classifyFrequency,
  computeHealth,
  budgetUsedPct,
  verifyAdminAuth,
} from './ad-shared';

import {
  type Period,
  type DateRange,
  type ColorFlag,
  isWeeklyPeriod,
  classifyCpaFromRoas,
} from './ad-shared';

/** Re-exported under its original name - see classifyCpaFromRoas in ad-shared.ts. */
export const classifyCpa = classifyCpaFromRoas;

// ---------------------------------------------------------------------------
// Graph API client
// ---------------------------------------------------------------------------

const DEFAULT_CONVERSION_ACTION_TYPES = [
  'offsite_conversion.fb_pixel_purchase',
  'omni_purchase',
  'purchase',
  'lead',
  'omni_complete_registration',
  'offsite_conversion.fb_pixel_lead',
];

const LINK_CLICK_ACTION_TYPE = 'link_click';

interface FBEnv {
  FB_ACCESS_TOKEN?: string;
  FB_AD_ACCOUNT_ID?: string;
  FB_APP_ID?: string;
  FB_APP_SECRET?: string;
  FB_GRAPH_API_VERSION?: string;
  FB_CONVERSION_ACTION_TYPES?: string; // comma separated override
  FB_DAILY_BUDGET_CAP?: string; // dollars, overrides summed campaign daily_budget
  FB_WEEKLY_BUDGET_CAP?: string;
  FB_CONVERSION_TARGET_DAILY?: string;
  FB_CONVERSION_TARGET_WEEKLY?: string;
  FB_LOW_CTR_THRESHOLD?: string; // percent, default 1
  FB_HIGH_FREQUENCY_THRESHOLD?: string; // default 3
  FB_LOW_REACH_THRESHOLD_DAILY?: string; // default 100
  FB_LOW_REACH_THRESHOLD_WEEKLY?: string; // default 500
  FB_HIGH_SPEND_THRESHOLD_DAILY?: string; // dollars, default 10
  FB_HIGH_SPEND_THRESHOLD_WEEKLY?: string; // dollars, default 50
  FB_LOW_CLICKS_THRESHOLD?: string; // default 5
  ADMIN_PASSWORD?: string;
  ADMIN_KEY?: string;
}

export class FacebookApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function graphVersion(env: FBEnv): string {
  return env.FB_GRAPH_API_VERSION || 'v21.0';
}

function adAccountPath(env: FBEnv): string {
  const id = (env.FB_AD_ACCOUNT_ID || '').replace(/^act_/, '');
  return `act_${id}`;
}

async function graphGet(env: FBEnv, path: string, params: Record<string, string>): Promise<any> {
  if (!env.FB_ACCESS_TOKEN) {
    throw new FacebookApiError('FB_ACCESS_TOKEN is not configured', 500);
  }
  if (!env.FB_AD_ACCOUNT_ID) {
    throw new FacebookApiError('FB_AD_ACCOUNT_ID is not configured', 500);
  }

  const url = new URL(`https://graph.facebook.com/${graphVersion(env)}/${path}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  url.searchParams.set('access_token', env.FB_ACCESS_TOKEN);

  const res = await fetch(url.toString());
  const json: any = await res.json().catch(() => ({}));

  if (!res.ok || json?.error) {
    const msg = json?.error?.message || `Graph API request failed (${res.status})`;
    throw new FacebookApiError(msg, res.status || 502);
  }

  return json;
}

/** ISO 4217 currency code the ad account bills in (e.g. "GBP") - the dashboard must not assume USD. */
export async function fetchAccountCurrency(env: FBEnv): Promise<string> {
  const json = await graphGet(env, adAccountPath(env), { fields: 'currency' });
  return json.currency || 'USD';
}

export interface RawInsightRow {
  campaign_id?: string;
  campaign_name?: string;
  date_start?: string;
  date_stop?: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  ctr?: string;
  reach?: string;
  frequency?: string;
  actions?: Array<{ action_type: string; value: string }>;
  action_values?: Array<{ action_type: string; value: string }>;
  purchase_roas?: Array<{ action_type: string; value: string }>;
}

/**
 * Fetches Insights rows. level='account' for the executive summary,
 * level='campaign' for the campaign table. Pass timeIncrement=1 for a
 * day-by-day breakdown (used for the weekly expand view).
 */
export async function fetchInsights(
  env: FBEnv,
  opts: {
    level: 'account' | 'campaign';
    range: DateRange;
    timeIncrement?: 1;
  }
): Promise<RawInsightRow[]> {
  const fields = [
    'campaign_id',
    'campaign_name',
    'date_start',
    'date_stop',
    'spend',
    'impressions',
    'clicks',
    'ctr',
    'reach',
    'frequency',
    'actions',
    'action_values',
    'purchase_roas',
  ].join(',');

  const params: Record<string, string> = {
    level: opts.level,
    fields,
    time_range: JSON.stringify({ since: opts.range.since, until: opts.range.until }),
    limit: '500',
  };
  if (opts.timeIncrement) params.time_increment = String(opts.timeIncrement);

  const results: RawInsightRow[] = [];
  let json = await graphGet(env, `${adAccountPath(env)}/insights`, params);
  results.push(...(json.data || []));

  // Follow pagination (bounded to avoid runaway loops on a huge account).
  let pageCount = 0;
  while (json?.paging?.next && pageCount < 10) {
    const res = await fetch(json.paging.next);
    json = await res.json().catch(() => ({}));
    if (json?.error) break;
    results.push(...(json.data || []));
    pageCount++;
  }

  return results;
}

export interface CampaignStatus {
  id: string;
  name: string;
  status: string;
  effective_status: string;
  daily_budget?: number; // dollars
  lifetime_budget?: number; // dollars
  stop_time?: string; // ISO datetime; absent for campaigns with no scheduled end
}

export async function fetchCampaignStatuses(env: FBEnv): Promise<CampaignStatus[]> {
  const json = await graphGet(env, `${adAccountPath(env)}/campaigns`, {
    fields: 'id,name,status,effective_status,daily_budget,lifetime_budget,stop_time',
    limit: '500',
  });

  return (json.data || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    effective_status: c.effective_status,
    daily_budget: c.daily_budget ? Number(c.daily_budget) / 100 : undefined,
    lifetime_budget: c.lifetime_budget ? Number(c.lifetime_budget) / 100 : undefined,
    stop_time: c.stop_time || undefined,
  }));
}

// ---------------------------------------------------------------------------
// Normalization / scoring
// ---------------------------------------------------------------------------

export interface NormalizedMetrics {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number; // percentage, e.g. 2.15 == 2.15%
  conversions: number;
  revenue: number;
  cpa: number; // spend / conversions ("cost per result"), 0 if no conversions
  roas: number; // revenue / spend, 0 if no spend
  reach: number; // unique people reached; summing across rows/campaigns overstates true unique reach (no cross-row dedup available from this endpoint) - treat as an approximation
  frequency: number; // impressions / reach
  linkClicks: number; // 'link_click' action type - distinct from total (all) clicks
  conversionRate: number; // conversions / clicks, percentage, 0 if no clicks
}

function sumActionValue(actions: Array<{ action_type: string; value: string }> | undefined, types: string[]): number {
  if (!actions) return 0;
  return actions
    .filter((a) => types.includes(a.action_type))
    .reduce((sum, a) => sum + (parseFloat(a.value) || 0), 0);
}

export function normalizeRow(row: RawInsightRow, env: FBEnv): NormalizedMetrics {
  const conversionTypes = env.FB_CONVERSION_ACTION_TYPES
    ? env.FB_CONVERSION_ACTION_TYPES.split(',').map((s) => s.trim())
    : DEFAULT_CONVERSION_ACTION_TYPES;

  const spend = parseFloat(row.spend || '0') || 0;
  const impressions = parseInt(row.impressions || '0', 10) || 0;
  const clicks = parseInt(row.clicks || '0', 10) || 0;
  const ctr = parseFloat(row.ctr || '0') || 0;
  const reach = parseInt(row.reach || '0', 10) || 0;
  const frequency = parseFloat(row.frequency || '0') || 0;
  const conversions = sumActionValue(row.actions, conversionTypes);
  const revenue = sumActionValue(row.action_values as any, conversionTypes);
  const linkClicks = sumActionValue(row.actions, [LINK_CLICK_ACTION_TYPE]);

  let roas = 0;
  if (row.purchase_roas && row.purchase_roas.length > 0) {
    roas = row.purchase_roas.reduce((sum, r) => sum + (parseFloat(r.value) || 0), 0);
  } else if (spend > 0) {
    roas = revenue / spend;
  }

  const cpa = conversions > 0 ? spend / conversions : 0;
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

  return { spend, impressions, clicks, ctr, conversions, revenue, cpa, roas, reach, frequency, linkClicks, conversionRate };
}

export function aggregateRows(rows: RawInsightRow[], env: FBEnv): NormalizedMetrics {
  const merged = rows.reduce(
    (acc, row) => {
      const m = normalizeRow(row, env);
      acc.spend += m.spend;
      acc.impressions += m.impressions;
      acc.clicks += m.clicks;
      acc.conversions += m.conversions;
      acc.revenue += m.revenue;
      acc.reach += m.reach;
      acc.linkClicks += m.linkClicks;
      return acc;
    },
    { spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0, reach: 0, linkClicks: 0 }
  );

  const ctr = merged.impressions > 0 ? (merged.clicks / merged.impressions) * 100 : 0;
  const cpa = merged.conversions > 0 ? merged.spend / merged.conversions : 0;
  const roas = merged.spend > 0 ? merged.revenue / merged.spend : 0;
  // Recomputed from aggregated totals, not summed per-row - summing per-row frequencies would double count.
  const frequency = merged.reach > 0 ? merged.impressions / merged.reach : 0;
  const conversionRate = merged.clicks > 0 ? (merged.conversions / merged.clicks) * 100 : 0;

  return { ...merged, ctr, cpa, roas, frequency, conversionRate };
}

// ColorFlag and the classify*/computeHealth/budgetUsedPct functions now live
// in ad-shared.ts and are re-exported at the top of this file.

export function budgetCapFor(env: FBEnv, period: Period, campaignDailyBudgetSum: number): number | undefined {
  const weekly = isWeeklyPeriod(period);
  if (weekly) {
    if (env.FB_WEEKLY_BUDGET_CAP) return parseFloat(env.FB_WEEKLY_BUDGET_CAP);
    return campaignDailyBudgetSum > 0 ? campaignDailyBudgetSum * 7 : undefined;
  }
  if (env.FB_DAILY_BUDGET_CAP) return parseFloat(env.FB_DAILY_BUDGET_CAP);
  return campaignDailyBudgetSum > 0 ? campaignDailyBudgetSum : undefined;
}

export function conversionTargetFor(env: FBEnv, period: Period): number | undefined {
  const weekly = isWeeklyPeriod(period);
  const raw = weekly ? env.FB_CONVERSION_TARGET_WEEKLY : env.FB_CONVERSION_TARGET_DAILY;
  return raw ? parseFloat(raw) : undefined;
}

interface RecommendationThresholds {
  lowCtr: number;
  highFrequency: number;
  lowReach: number;
  highSpend: number;
  lowClicks: number;
}

function thresholdsFor(env: FBEnv, period: Period): RecommendationThresholds {
  const weekly = isWeeklyPeriod(period);
  return {
    lowCtr: env.FB_LOW_CTR_THRESHOLD ? parseFloat(env.FB_LOW_CTR_THRESHOLD) : 1,
    highFrequency: env.FB_HIGH_FREQUENCY_THRESHOLD ? parseFloat(env.FB_HIGH_FREQUENCY_THRESHOLD) : 3,
    lowReach: weekly
      ? env.FB_LOW_REACH_THRESHOLD_WEEKLY ? parseFloat(env.FB_LOW_REACH_THRESHOLD_WEEKLY) : 500
      : env.FB_LOW_REACH_THRESHOLD_DAILY ? parseFloat(env.FB_LOW_REACH_THRESHOLD_DAILY) : 100,
    highSpend: weekly
      ? env.FB_HIGH_SPEND_THRESHOLD_WEEKLY ? parseFloat(env.FB_HIGH_SPEND_THRESHOLD_WEEKLY) : 50
      : env.FB_HIGH_SPEND_THRESHOLD_DAILY ? parseFloat(env.FB_HIGH_SPEND_THRESHOLD_DAILY) : 10,
    lowClicks: env.FB_LOW_CLICKS_THRESHOLD ? parseFloat(env.FB_LOW_CLICKS_THRESHOLD) : 5,
  };
}

// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------

export interface Recommendation {
  type:
    | 'increase_budget'
    | 'pause_campaign'
    | 'monitor_closely'
    | 'budget_warning'
    | 'good_performance'
    | 'low_ctr'
    | 'high_frequency'
    | 'low_reach'
    | 'high_spend_low_clicks'
    | 'no_conversion_tracking';
  icon: string;
  campaignId: string;
  campaignName: string;
  message: string;
}

export interface CampaignForRecommendation {
  id: string;
  name: string;
  status: CampaignStatus;
  metrics: NormalizedMetrics;
  comparisonMetrics: NormalizedMetrics;
}

/** Minimal money formatting for recommendation message text - the frontend's formatCurrency (Intl-based) isn't reachable from backend-lib, and this only needs to avoid a hardcoded "$" for non-USD accounts. */
function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function generateRecommendations(
  campaigns: CampaignForRecommendation[],
  period: Period,
  env: FBEnv = {},
  currency: string = 'USD'
): Recommendation[] {
  const weekly = isWeeklyPeriod(period);
  const scopeWord = weekly ? 'this week' : 'today';
  const budgetIncreasePct = weekly ? 25 : 20;
  const dropThresholdPct = weekly ? 25 : 30;
  const thresholds = thresholdsFor(env, period);
  const recs: Recommendation[] = [];

  for (const c of campaigns) {
    if (c.status.effective_status !== 'ACTIVE' && c.status.effective_status !== 'PAUSED') continue;
    const { roas } = c.metrics;
    const prevRoas = c.comparisonMetrics.roas;

    if (c.status.effective_status === 'ACTIVE' && roas > 3) {
      recs.push({
        type: 'increase_budget',
        icon: '💰',
        campaignId: c.id,
        campaignName: c.name,
        message: `${c.name} has ${roas.toFixed(1)}x ROAS ${scopeWord} - increase ${weekly ? 'weekly' : 'daily'} budget by ${budgetIncreasePct}%`,
      });
    } else if (c.status.effective_status === 'ACTIVE' && roas > 0 && roas < 1) {
      recs.push({
        type: 'pause_campaign',
        icon: '🔴',
        campaignId: c.id,
        campaignName: c.name,
        message: `${c.name} has ${roas.toFixed(1)}x ROAS ${scopeWord} - losing money`,
      });
    } else if (c.status.effective_status === 'ACTIVE' && prevRoas > 0 && roas > 0) {
      const dropPct = ((prevRoas - roas) / prevRoas) * 100;
      if (dropPct >= dropThresholdPct) {
        recs.push({
          type: 'monitor_closely',
          icon: '⚠️',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name} ROAS dropped ${dropPct.toFixed(0)}% from ${weekly ? 'last week' : 'yesterday'} - ${weekly ? 'investigate' : 'check targeting'}`,
        });
      } else if (roas >= 1) {
        recs.push({
          type: 'good_performance',
          icon: '✅',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name} is performing well ${weekly ? 'this week' : ''} - maintain`.trim(),
        });
      }
    } else if (c.status.effective_status === 'ACTIVE' && roas >= 1) {
      recs.push({
        type: 'good_performance',
        icon: '✅',
        campaignId: c.id,
        campaignName: c.name,
        message: `${c.name} is performing well ${weekly ? 'this week' : ''} - maintain`.trim(),
      });
    }

    // Budget warning only makes sense for the "today" view against the campaign's own daily cap.
    if (!weekly && c.status.effective_status === 'ACTIVE' && c.status.daily_budget) {
      const pct = (c.metrics.spend / c.status.daily_budget) * 100;
      if (pct >= 80) {
        recs.push({
          type: 'budget_warning',
          icon: '💳',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name} at ${pct.toFixed(0)}% of today's budget cap`,
        });
      }
    }

    // The checks below are independent of ROAS/conversion data and current
    // run-state - they're diagnostic (creative, targeting, tracking gaps)
    // rather than "act on this running campaign right now", so they still
    // apply to PAUSED campaigns with spend in the period (useful when
    // deciding whether to reactivate one).
    {
      const { ctr, frequency, reach, spend, clicks, impressions, conversions } = c.metrics;

      if (impressions > 0 && ctr > 0 && ctr < thresholds.lowCtr) {
        recs.push({
          type: 'low_ctr',
          icon: '🎨',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name} has ${ctr.toFixed(2)}% CTR ${scopeWord} - consider testing new creative`,
        });
      }

      if (frequency > thresholds.highFrequency) {
        recs.push({
          type: 'high_frequency',
          icon: '🔄',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name} has a frequency of ${frequency.toFixed(1)} ${scopeWord} - ad fatigue detected, refresh creative`,
        });
      }

      if (impressions > 0 && reach > 0 && reach < thresholds.lowReach) {
        recs.push({
          type: 'low_reach',
          icon: '📉',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name} only reached ${Math.round(reach)} people ${scopeWord} - audience may be too small, expand targeting`,
        });
      }

      if (spend >= thresholds.highSpend && clicks < thresholds.lowClicks) {
        recs.push({
          type: 'high_spend_low_clicks',
          icon: '🔍',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name} spent ${formatMoney(spend, currency)} ${scopeWord} with only ${clicks} clicks - check ad relevance score`,
        });
      }

      if (spend > 0 && conversions === 0) {
        recs.push({
          type: 'no_conversion_tracking',
          icon: '📊',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name} has spend but 0 recorded conversions ${scopeWord} - set up conversion tracking`,
        });
      }
    }
  }

  return recs;
}

// verifyAdminAuth and parsePeriod now live in ad-shared.ts and are
// re-exported at the top of this file.
