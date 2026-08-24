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
  classifyCostPerClick,
  classifyReachRatio,
  classifyBudgetUtilizationLow,
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
  computeAverageCpa,
  classifyReachRatio,
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
  FB_WASTED_PLACEMENT_MIN_SPEND_DAILY?: string; // dollars, default 5
  FB_WASTED_PLACEMENT_MIN_SPEND_WEEKLY?: string; // dollars, default 20
  FB_TARGET_CPA_DAILY?: string; // dollars - if unset, falls back to the account's own blended CPA for the period
  FB_TARGET_CPA_WEEKLY?: string; // dollars
  FB_LOW_IMPRESSIONS_THRESHOLD_DAILY?: string; // default 100
  FB_LOW_IMPRESSIONS_THRESHOLD_WEEKLY?: string; // default 700
  FB_EXCLUSION_WASTE_PCT?: string; // 0-1, default 0.05 - see findExclusionGaps for what this estimates
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
// Audience overlap - NOTE: Meta does not expose true audience-to-audience
// overlap size via the Marketing API (the Ads Manager "Audience Overlap"
// tool was pulled from third-party API access years ago for privacy
// reasons - there is no reliable way to compute an actual intersection
// percentage from outside Meta's systems). What IS real and verifiable:
// the exact same custom audience being targeted by 2+ simultaneously-active
// campaigns, which guarantees they're competing in the same auction for the
// same people. That's the only thing findAudienceOverlaps below reports -
// deliberately no fabricated overlap percentages or "wasted spend" figures
// for audience pairs that merely might overlap.
// ---------------------------------------------------------------------------

export interface CustomAudience {
  id: string;
  name: string;
  subtype: string;
  sizeEstimate: number | null; // midpoint of Meta's lower/upper bound, null if unavailable
  deliveryStatus: string | null;
}

export async function fetchCustomAudiences(env: FBEnv): Promise<CustomAudience[]> {
  const json = await graphGet(env, `${adAccountPath(env)}/customaudiences`, {
    fields: 'id,name,subtype,approximate_count_lower_bound,approximate_count_upper_bound,delivery_status',
    limit: '500',
  });
  return (json.data || []).map((a: any) => {
    const lower = a.approximate_count_lower_bound;
    const upper = a.approximate_count_upper_bound;
    const sizeEstimate = lower != null && upper != null ? (Number(lower) + Number(upper)) / 2 : null;
    return {
      id: a.id,
      name: a.name || 'Unnamed audience',
      subtype: a.subtype || 'UNKNOWN',
      sizeEstimate,
      deliveryStatus: a.delivery_status?.description ?? null,
    };
  });
}

export interface AdSetTargeting {
  id: string;
  name: string;
  status: string;
  effectiveStatus: string;
  campaignId: string;
  customAudienceIds: string[];
  excludedCustomAudienceIds: string[];
}

export async function fetchAdSetsWithTargeting(env: FBEnv): Promise<AdSetTargeting[]> {
  const json = await graphGet(env, `${adAccountPath(env)}/adsets`, {
    fields: 'id,name,status,effective_status,campaign_id,targeting',
    limit: '500',
  });
  return (json.data || []).map((a: any) => ({
    id: a.id,
    name: a.name,
    status: a.status,
    effectiveStatus: a.effective_status,
    campaignId: a.campaign_id,
    customAudienceIds: (a.targeting?.custom_audiences || []).map((ca: any) => String(ca.id)),
    excludedCustomAudienceIds: (a.targeting?.excluded_custom_audiences || []).map((ca: any) => String(ca.id)),
  }));
}

export interface AudienceOverlapEntry {
  audience: { id: string; name: string; subtype: string; sizeEstimate: number | null };
  campaigns: Array<{ id: string; name: string; spend: number }>;
  adSets: Array<{ id: string; name: string; campaignId: string }>;
  combinedSpend: number;
  severity: 'warning' | 'urgent';
  recommendation: string;
}

export interface AudienceOverlapSummary {
  totalAudiences: number;
  sharedAudiences: number;
  audiencesWithIssues: number; // severity 'urgent' - shared by 3+ campaigns at once
  combinedAtRiskSpend: number; // deduplicated union of spend across every campaign involved in any overlap
}

export function findAudienceOverlaps(
  audiences: CustomAudience[],
  adSets: AdSetTargeting[],
  campaigns: CampaignStatus[],
  campaignSpendById: Map<string, number>
): { summary: AudienceOverlapSummary; overlaps: AudienceOverlapEntry[] } {
  const audienceById = new Map(audiences.map((a) => [a.id, a]));
  const campaignById = new Map(campaigns.map((c) => [c.id, c]));

  // Only currently-delivering ad sets actually compete in the auction right now.
  const activeAdSets = adSets.filter((a) => a.effectiveStatus === 'ACTIVE');

  const adSetsByAudience = new Map<string, AdSetTargeting[]>();
  for (const adSet of activeAdSets) {
    for (const audienceId of adSet.customAudienceIds) {
      const list = adSetsByAudience.get(audienceId) || [];
      list.push(adSet);
      adSetsByAudience.set(audienceId, list);
    }
  }

  const overlaps: AudienceOverlapEntry[] = [];
  const atRiskCampaignIds = new Set<string>();

  for (const [audienceId, sharingAdSets] of adSetsByAudience) {
    const distinctCampaignIds = Array.from(new Set(sharingAdSets.map((a) => a.campaignId)));
    if (distinctCampaignIds.length < 2) continue; // only real competition when 2+ DIFFERENT campaigns share the same audience

    const audience = audienceById.get(audienceId);
    if (!audience) continue; // audience deleted or inaccessible with current token scope, but still referenced by a live ad set

    const campaignsInfo = distinctCampaignIds.map((id) => ({
      id,
      name: campaignById.get(id)?.name || 'Unknown campaign',
      spend: campaignSpendById.get(id) || 0,
    }));
    const combinedSpend = campaignsInfo.reduce((s, c) => s + c.spend, 0);
    const severity: 'warning' | 'urgent' = distinctCampaignIds.length >= 3 ? 'urgent' : 'warning';
    distinctCampaignIds.forEach((id) => atRiskCampaignIds.add(id));

    const campaignNames = campaignsInfo.map((c) => c.name).join(', ');
    const recommendation =
      severity === 'urgent'
        ? `"${audience.name}" is targeted by ${distinctCampaignIds.length} active campaigns at once (${campaignNames}) - they're competing for the exact same people in the same auction. Consolidate into one campaign or split the audience between them.`
        : `"${audience.name}" is targeted by both ${campaignNames} at the same time - they're competing for the same people. Consider consolidating or splitting the audience between them.`;

    overlaps.push({
      audience: { id: audience.id, name: audience.name, subtype: audience.subtype, sizeEstimate: audience.sizeEstimate },
      campaigns: campaignsInfo,
      adSets: sharingAdSets.map((a) => ({ id: a.id, name: a.name, campaignId: a.campaignId })),
      combinedSpend,
      severity,
      recommendation,
    });
  }

  overlaps.sort((a, b) => b.combinedSpend - a.combinedSpend);

  const summary: AudienceOverlapSummary = {
    totalAudiences: audiences.length,
    sharedAudiences: overlaps.length,
    audiencesWithIssues: overlaps.filter((o) => o.severity === 'urgent').length,
    combinedAtRiskSpend: Array.from(atRiskCampaignIds).reduce((s, id) => s + (campaignSpendById.get(id) || 0), 0),
  };

  return { summary, overlaps };
}

// ---------------------------------------------------------------------------
// Audience health - operation/delivery status per audience plus whether it's
// currently targeted by an active ad set. Meta doesn't expose a literal
// "audience last used" timestamp, so lastUsed is derived from ad-set-level
// insights over the trailing 30 days (the most recent date any ad set
// targeting the audience had impressions > 0) - an honest proxy, not a
// fabricated exact value.
// ---------------------------------------------------------------------------

export interface AudienceHealthRaw {
  id: string;
  name: string;
  subtype: string;
  size: number | null; // midpoint of Meta's lower/upper bound, same convention as CustomAudience.sizeEstimate above - approximate_count itself is no longer a reliable field on current Marketing API versions. null when Meta returns -1 (its sentinel for "estimate suppressed", typically very new/small audiences)
  operationStatusCode: number; // Graph API returns a NUMBER here, not the string "READY"/"ERROR" - 200 = Normal/healthy, any other code (e.g. 433 = lookalike creation failed) is a problem
  operationStatusDescription: string;
  deliveryStatusCode: number; // same convention - 200 = "ready for use", any other code (e.g. 300 = "too small to use in campaign creation") means it can't currently be targeted
  deliveryStatusDescription: string;
}

export async function fetchCustomAudienceHealth(env: FBEnv): Promise<AudienceHealthRaw[]> {
  const json = await graphGet(env, `${adAccountPath(env)}/customaudiences`, {
    fields: 'id,name,subtype,approximate_count_lower_bound,approximate_count_upper_bound,operation_status,delivery_status',
    limit: '500',
  });
  return (json.data || []).map((a: any) => {
    const lower = a.approximate_count_lower_bound;
    const upper = a.approximate_count_upper_bound;
    const size = lower != null && upper != null && Number(lower) >= 0 && Number(upper) >= 0 ? (Number(lower) + Number(upper)) / 2 : null;
    return {
      id: a.id,
      name: a.name || 'Unnamed audience',
      subtype: a.subtype || 'UNKNOWN',
      size,
      operationStatusCode: a.operation_status?.code ?? -1,
      operationStatusDescription: a.operation_status?.description || 'Unknown',
      deliveryStatusCode: a.delivery_status?.code ?? -1,
      deliveryStatusDescription: a.delivery_status?.description || 'Unknown',
    };
  });
}

/** Ad-set id -> most recent date (YYYY-MM-DD) it had impressions > 0, over the trailing 30 days. */
export async function fetchAdSetLastDelivery(env: FBEnv): Promise<Map<string, string>> {
  const now = new Date();
  const until = now.toISOString().slice(0, 10);
  const since = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const params: Record<string, string> = {
    level: 'adset',
    fields: 'adset_id,impressions,date_start',
    time_range: JSON.stringify({ since, until }),
    time_increment: '1',
    limit: '500',
  };

  const rows: Array<{ adset_id?: string; date_start?: string; impressions?: string }> = [];
  let json = await graphGet(env, `${adAccountPath(env)}/insights`, params);
  rows.push(...(json.data || []));

  let pageCount = 0;
  while (json?.paging?.next && pageCount < 10) {
    const res = await fetch(json.paging.next);
    json = await res.json().catch(() => ({}));
    if (json?.error) break;
    rows.push(...(json.data || []));
    pageCount++;
  }

  const lastDelivery = new Map<string, string>();
  for (const row of rows) {
    const impressions = parseInt(row.impressions || '0', 10) || 0;
    if (impressions <= 0 || !row.adset_id || !row.date_start) continue;
    const existing = lastDelivery.get(row.adset_id);
    if (!existing || row.date_start > existing) {
      lastDelivery.set(row.adset_id, row.date_start);
    }
  }
  return lastDelivery;
}

export interface AudienceHealthRow {
  id: string;
  name: string;
  subtype: string;
  size: number | null;
  operationStatus: string; // human-readable description, e.g. "Normal" - the raw code is numeric and not meaningful on its own
  deliveryStatus: string;
  lastUsed: string | null; // YYYY-MM-DD, null if not delivered in the trailing 30 days
  usedInCampaign: string | null;
  health: 'good' | 'warning' | 'issue' | 'unused'; // 'unused' = READY but not currently targeted by any active ad set - not one of the 3 tiers in the spec, kept neutral rather than forced into good/warning/issue
}

export interface AudienceHealthSummary {
  total: number;
  ready: number;
  active: number;
  issues: number;
}

export function computeAudienceHealth(
  audiences: AudienceHealthRaw[],
  adSets: AdSetTargeting[],
  campaigns: CampaignStatus[],
  lastDeliveryByAdSet: Map<string, string>
): { summary: AudienceHealthSummary; audiences: AudienceHealthRow[] } {
  const campaignById = new Map(campaigns.map((c) => [c.id, c]));

  const adSetsByAudience = new Map<string, AdSetTargeting[]>();
  for (const adSet of adSets) {
    for (const audienceId of adSet.customAudienceIds) {
      const list = adSetsByAudience.get(audienceId) || [];
      list.push(adSet);
      adSetsByAudience.set(audienceId, list);
    }
  }

  let ready = 0;
  let active = 0;
  let issues = 0;

  const rows: AudienceHealthRow[] = audiences.map((a) => {
    const targeting = adSetsByAudience.get(a.id) || [];
    const activeAdSets = targeting.filter((t) => t.effectiveStatus === 'ACTIVE');
    const isActive = activeAdSets.length > 0;

    const representative = activeAdSets[0] || targeting[0];
    const usedInCampaign = representative ? campaignById.get(representative.campaignId)?.name || null : null;

    let lastUsed: string | null = null;
    for (const t of targeting) {
      const d = lastDeliveryByAdSet.get(t.id);
      if (d && (!lastUsed || d > lastUsed)) lastUsed = d;
    }

    // Graph API convention: code 200 = healthy for both fields; any other
    // code is a problem (creation failure, too-small-to-use, pending review,
    // etc) - see fetchCustomAudienceHealth's field comments for real examples.
    const isReady = a.operationStatusCode === 200;
    const isDeliverable = a.deliveryStatusCode === 200;
    const hasIssue = !isReady || !isDeliverable;

    let health: AudienceHealthRow['health'];
    if (hasIssue) health = 'issue';
    else if (isActive && lastUsed !== null) health = 'good';
    else if (isActive) health = 'warning';
    else health = 'unused';

    if (isReady) ready++;
    if (isActive) active++;
    if (hasIssue) issues++;

    return {
      id: a.id,
      name: a.name,
      subtype: a.subtype,
      size: a.size,
      operationStatus: a.operationStatusDescription,
      deliveryStatus: a.deliveryStatusDescription,
      lastUsed,
      usedInCampaign,
      health,
    };
  });

  return {
    summary: { total: audiences.length, ready, active, issues },
    audiences: rows,
  };
}

// ---------------------------------------------------------------------------
// Exclusion gaps - flags active (or recently-active) campaigns that don't
// exclude audiences they normally should: existing customers, past website
// purchasers, and (for Lookalike-targeting ad sets) the Lookalike's own
// source audience. None of "Existing Customers" / "Website Purchasers" /
// "Lookalike Source" are literal Graph API fields - they're inferred from
// real, verifiable signals:
//   - Existing Customers: a CUSTOM-subtype audience with a customer_file_source
//     other than NOT_APPLICABLE, i.e. actually built from an uploaded/CRM
//     customer file (see fetchAudienceExclusionProfiles).
//   - Website Purchasers: a WEBSITE-subtype (pixel) audience whose rule JSON
//     mentions "purchase" - a plain "all visitors" pixel audience does not
//     qualify, so accounts with no purchase-event audience configured
//     correctly report zero gaps of this type rather than a fabricated one.
//   - Lookalike Source: lookalike_spec.origin on a LOOKALIKE audience names
//     its exact source audience id - fully verifiable, no heuristic needed.
// If an account has no audience matching a given role, that check simply
// never fires for any campaign - there's nothing to recommend excluding.
// ---------------------------------------------------------------------------

export interface AudienceExclusionProfile {
  id: string;
  name: string;
  subtype: string;
  isCustomerList: boolean;
  isPurchaserAudience: boolean;
  lookalikeSourceId: string | null; // set when subtype === 'LOOKALIKE' and Meta reports an origin audience
}

export async function fetchAudienceExclusionProfiles(env: FBEnv): Promise<AudienceExclusionProfile[]> {
  const json = await graphGet(env, `${adAccountPath(env)}/customaudiences`, {
    fields: 'id,name,subtype,customer_file_source,rule,lookalike_spec',
    limit: '500',
  });
  return (json.data || []).map((a: any) => {
    const subtype = a.subtype || 'UNKNOWN';
    const isCustomerList = subtype === 'CUSTOM' && !!a.customer_file_source && a.customer_file_source !== 'NOT_APPLICABLE';
    const isPurchaserAudience = subtype === 'WEBSITE' && /purchas/i.test(a.rule || '');
    const origin = a.lookalike_spec?.origin?.[0];
    return {
      id: a.id,
      name: a.name || 'Unnamed audience',
      subtype,
      isCustomerList,
      isPurchaserAudience,
      lookalikeSourceId: subtype === 'LOOKALIKE' && origin?.id ? String(origin.id) : null,
    };
  });
}

export interface ExclusionGap {
  campaignId: string;
  campaignName: string;
  status: string; // effective_status
  spendLast7Days: number;
  missingExclusion: string;
  recommendation: string;
  estimatedSavings: number;
}

export interface ExclusionGapsSummary {
  campaignsChecked: number;
  campaignsWithGaps: number;
  estimatedWastedSpend: number;
}

function exclusionWastePct(env: FBEnv): number {
  const raw = env.FB_EXCLUSION_WASTE_PCT ? parseFloat(env.FB_EXCLUSION_WASTE_PCT) : NaN;
  return Number.isFinite(raw) && raw > 0 ? raw : 0.05;
}

/**
 * campaignSpendLast7Days keyed by campaign id - caller fetches this via
 * fetchInsights({level: 'campaign', range: getDateRange('last_7_days')}) +
 * aggregateRows, same pattern as findAudienceOverlaps.
 */
export function findExclusionGaps(
  campaigns: CampaignStatus[],
  adSets: AdSetTargeting[],
  audiences: AudienceExclusionProfile[],
  campaignSpendLast7Days: Map<string, number>,
  env: FBEnv = {}
): { summary: ExclusionGapsSummary; gaps: ExclusionGap[] } {
  const audienceById = new Map(audiences.map((a) => [a.id, a]));
  const customerListAudiences = audiences.filter((a) => a.isCustomerList);
  const purchaserAudiences = audiences.filter((a) => a.isPurchaserAudience);
  const wastePct = exclusionWastePct(env);

  const adSetsByCampaign = new Map<string, AdSetTargeting[]>();
  for (const adSet of adSets) {
    const list = adSetsByCampaign.get(adSet.campaignId) || [];
    list.push(adSet);
    adSetsByCampaign.set(adSet.campaignId, list);
  }

  // Active campaigns, plus paused ones that still spent in the last 7 days -
  // same "still worth checking" convention as the recommendation checks in
  // generateRecommendations (useful when deciding whether to reactivate one).
  const evaluated = campaigns.filter(
    (c) => c.effective_status === 'ACTIVE' || (c.effective_status === 'PAUSED' && (campaignSpendLast7Days.get(c.id) || 0) > 0)
  );

  const gaps: ExclusionGap[] = [];
  const campaignsWithGaps = new Set<string>();

  for (const campaign of evaluated) {
    const campaignAdSets = adSetsByCampaign.get(campaign.id) || [];
    const includedIds = new Set(campaignAdSets.flatMap((a) => a.customAudienceIds));
    const excludedIds = new Set(campaignAdSets.flatMap((a) => a.excludedCustomAudienceIds));
    const spend = campaignSpendLast7Days.get(campaign.id) || 0;

    const addGap = (missingExclusion: string, recommendation: string) => {
      campaignsWithGaps.add(campaign.id);
      gaps.push({
        campaignId: campaign.id,
        campaignName: campaign.name,
        status: campaign.effective_status,
        spendLast7Days: spend,
        missingExclusion,
        recommendation,
        estimatedSavings: Math.round(spend * wastePct * 100) / 100,
      });
    };

    if (customerListAudiences.length > 0 && !customerListAudiences.some((a) => excludedIds.has(a.id))) {
      const names = customerListAudiences.map((a) => a.name).join('", "');
      addGap('Existing Customers', `Add "${names}" to exclusions so existing customers aren't targeted again`);
    }

    if (purchaserAudiences.length > 0 && !purchaserAudiences.some((a) => excludedIds.has(a.id))) {
      const names = purchaserAudiences.map((a) => a.name).join('", "');
      addGap('Website Purchasers', `Add "${names}" to exclusions so past purchasers aren't targeted again`);
    }

    const lookalikesInUse = Array.from(includedIds)
      .map((id) => audienceById.get(id))
      .filter((a): a is AudienceExclusionProfile => !!a && a.subtype === 'LOOKALIKE' && !!a.lookalikeSourceId);

    for (const lal of lookalikesInUse) {
      if (excludedIds.has(lal.lookalikeSourceId!)) continue;
      const source = audienceById.get(lal.lookalikeSourceId!);
      const sourceName = source?.name || 'its source audience';
      addGap(
        `Lookalike Source: ${sourceName}`,
        `"${lal.name}" is a lookalike of "${sourceName}" - add "${sourceName}" to exclusions so people already in the source list aren't shown the lookalike ad`
      );
    }
  }

  gaps.sort((a, b) => b.estimatedSavings - a.estimatedSavings);

  const summary: ExclusionGapsSummary = {
    campaignsChecked: evaluated.length,
    campaignsWithGaps: campaignsWithGaps.size,
    estimatedWastedSpend: Math.round(gaps.reduce((s, g) => s + g.estimatedSavings, 0) * 100) / 100,
  };

  return { summary, gaps };
}

// ---------------------------------------------------------------------------
// Placement / device breakdown - account-wide (not per-campaign: placement
// exclusion is an ad-set-level lever, so this is a diagnostic overview
// rather than something tied to one campaign's recommendations).
// ---------------------------------------------------------------------------

export interface PlacementRow {
  publisherPlatform: string; // e.g. "facebook" | "instagram" | "audience_network" | "messenger"
  platformPosition: string; // e.g. "feed" | "story" | "reels" | "instream_video"
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  cpa: number;
}

export interface DeviceRow {
  device: string; // Facebook's impression_device values, e.g. "mobile_app" | "desktop" | "tablet"
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  cpa: number;
}

const BREAKDOWN_FIELDS = ['spend', 'impressions', 'clicks', 'ctr', 'actions', 'action_values'].join(',');

export async function fetchPlacementBreakdown(env: FBEnv, range: DateRange): Promise<PlacementRow[]> {
  try {
    const json = await graphGet(env, `${adAccountPath(env)}/insights`, {
      level: 'account',
      fields: BREAKDOWN_FIELDS,
      breakdowns: 'publisher_platform,platform_position',
      time_range: JSON.stringify({ since: range.since, until: range.until }),
      limit: '200',
    });
    return (json.data || []).map((row: any) => {
      const m = normalizeRow(row, env);
      return {
        publisherPlatform: row.publisher_platform || 'unknown',
        platformPosition: row.platform_position || 'unknown',
        spend: m.spend,
        impressions: m.impressions,
        clicks: m.clicks,
        ctr: m.ctr,
        conversions: m.conversions,
        cpa: m.cpa,
      };
    });
  } catch {
    // Some ad account/campaign-objective combinations reject breakdowns entirely - fail soft.
    return [];
  }
}

export async function fetchDeviceBreakdown(env: FBEnv, range: DateRange): Promise<DeviceRow[]> {
  try {
    const json = await graphGet(env, `${adAccountPath(env)}/insights`, {
      level: 'account',
      fields: BREAKDOWN_FIELDS,
      breakdowns: 'impression_device',
      time_range: JSON.stringify({ since: range.since, until: range.until }),
      limit: '200',
    });
    return (json.data || []).map((row: any) => {
      const m = normalizeRow(row, env);
      return {
        device: row.impression_device || 'unknown',
        spend: m.spend,
        impressions: m.impressions,
        clicks: m.clicks,
        ctr: m.ctr,
        conversions: m.conversions,
        cpa: m.cpa,
      };
    });
  } catch {
    return [];
  }
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
  cpa: number; // spend / conversions ("cost per result"), 0 if no conversions - 0 here means "no data", not "free", see conversions before trusting it
  roas: number; // revenue / spend, 0 if no spend
  reach: number; // unique people reached; summing across rows/campaigns overstates true unique reach (no cross-row dedup available from this endpoint) - treat as an approximation
  frequency: number; // impressions / reach
  linkClicks: number; // 'link_click' action type - distinct from total (all) clicks
  conversionRate: number; // conversions / clicks, percentage, 0 if no clicks
  /** spend / linkClicks - a cost-efficiency fallback for Traffic/Engagement-objective campaigns that have no purchase/lead conversion events configured at all (cpa above will be permanently 0 for those). 0 if no link clicks. */
  costPerLinkClick: number;
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
  const costPerLinkClick = linkClicks > 0 ? spend / linkClicks : 0;

  return { spend, impressions, clicks, ctr, conversions, revenue, cpa, roas, reach, frequency, linkClicks, conversionRate, costPerLinkClick };
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
  const costPerLinkClick = merged.linkClicks > 0 ? merged.spend / merged.linkClicks : 0;

  return { ...merged, ctr, cpa, roas, frequency, conversionRate, costPerLinkClick };
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
  lowImpressions: number;
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
    lowImpressions: weekly
      ? env.FB_LOW_IMPRESSIONS_THRESHOLD_WEEKLY ? parseFloat(env.FB_LOW_IMPRESSIONS_THRESHOLD_WEEKLY) : 700
      : env.FB_LOW_IMPRESSIONS_THRESHOLD_DAILY ? parseFloat(env.FB_LOW_IMPRESSIONS_THRESHOLD_DAILY) : 100,
  };
}

/** Explicit CPA target if configured, else undefined (caller falls back to the account's own blended CPA). */
function cpaTargetFor(env: FBEnv, period: Period): number | undefined {
  const weekly = isWeeklyPeriod(period);
  const raw = weekly ? env.FB_TARGET_CPA_WEEKLY : env.FB_TARGET_CPA_DAILY;
  return raw ? parseFloat(raw) : undefined;
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
    | 'no_conversion_tracking'
    | 'wasted_placement'
    | 'high_cpa'
    | 'efficient_cpa'
    | 'low_impressions'
    | 'high_cost_per_click'
    | 'low_budget_utilization'
    | 'low_reach_ratio'
    | 'reach_declining';
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
  /** Reach per day, oldest first - weekly periods only, used for the reach_declining trend check. Omit/empty for daily periods. */
  dailyReach?: number[];
}

/** True if the second half of the period averaged reach.dropPct% or more below the first half - a simple two-bucket trend, not a full regression (7 data points don't warrant one). */
function isReachDeclining(dailyReach: number[] | undefined, dropPct: number): boolean {
  if (!dailyReach || dailyReach.length < 4) return false;
  const mid = Math.ceil(dailyReach.length / 2);
  const firstHalf = dailyReach.slice(0, mid);
  const secondHalf = dailyReach.slice(mid);
  const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;
  const firstAvg = avg(firstHalf);
  const secondAvg = avg(secondHalf);
  if (firstAvg <= 0) return false;
  return (firstAvg - secondAvg) / firstAvg >= dropPct / 100;
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

  // Self-calibrating CPA baseline - see computeAverageCpa's doc comment.
  const cpaTarget = cpaTargetFor(env, period) || computeAverageCpa(campaigns.map((c) => c.metrics));
  // Cost-per-link-click baseline - the fallback efficiency signal for
  // campaigns with zero purchase/lead conversions (e.g. Traffic/Engagement
  // objective with no Pixel configured), where cpa above is permanently 0.
  const avgCostPerClick = computeAverageCpa(campaigns.map((c) => ({ spend: c.metrics.spend, conversions: c.metrics.linkClicks })));

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

    // CPA (cost per result) vs. the account's own blended CPA (or an explicit
    // env target) - the most direct "is this campaign worth the spend"
    // signal, especially for accounts where purchase_roas/revenue isn't set
    // up but conversions are (see no_conversion_tracking below for the case
    // where neither is tracked).
    if (c.status.effective_status === 'ACTIVE' && c.metrics.conversions > 0 && cpaTarget > 0) {
      const { cpa } = c.metrics;
      if (cpa > cpaTarget * 1.3) {
        const pctAbove = ((cpa - cpaTarget) / cpaTarget) * 100;
        recs.push({
          type: 'high_cpa',
          icon: '🧯',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name} has a CPA of ${formatMoney(cpa, currency)} ${scopeWord} - ${pctAbove.toFixed(0)}% above the account average, review targeting or creative`,
        });
      } else if (cpa < cpaTarget * 0.7) {
        recs.push({
          type: 'efficient_cpa',
          icon: '🎯',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name} has a CPA of ${formatMoney(cpa, currency)} ${scopeWord} - well below the account average, a good candidate to scale`,
        });
      }
    } else if (
      c.status.effective_status === 'ACTIVE' &&
      c.metrics.conversions === 0 &&
      c.metrics.linkClicks > 0 &&
      avgCostPerClick > 0
    ) {
      // No purchase/lead conversions tracked at all for this campaign, so
      // fall back to cost-per-link-click as the only available efficiency signal.
      const { costPerLinkClick } = c.metrics;
      if (costPerLinkClick > avgCostPerClick * 1.3) {
        const pctAbove = ((costPerLinkClick - avgCostPerClick) / avgCostPerClick) * 100;
        recs.push({
          type: 'high_cost_per_click',
          icon: '🧯',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name} is paying ${formatMoney(costPerLinkClick, currency)}/link click ${scopeWord} - ${pctAbove.toFixed(0)}% above the account average, and no conversions are tracked to judge it by anything else`,
        });
      }
    }

    // Budget checks only make sense for the "today" view against the campaign's own daily cap.
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
      } else if (pct < 50) {
        recs.push({
          type: 'low_budget_utilization',
          icon: '🐌',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name} has only spent ${pct.toFixed(0)}% of today's budget - if this is late in the day, the bid may be too low to compete; consider raising it`,
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

      let fatigueFlagged = false;
      if (frequency > thresholds.highFrequency) {
        fatigueFlagged = true;
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

      // Same underlying issue as high_frequency (the same people seeing the ad
      // repeatedly) viewed from the reach side - skip if already flagged above to avoid duplicate noise.
      if (!fatigueFlagged && classifyReachRatio(reach, impressions) === 'red') {
        const reachPct = (reach / impressions) * 100;
        recs.push({
          type: 'low_reach_ratio',
          icon: '🔁',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name}: only ${reachPct.toFixed(0)}% of impressions ${scopeWord} reached new people - the same audience is seeing this ad repeatedly, check frequency`,
        });
      }

      if (weekly && isReachDeclining(c.dailyReach, 20)) {
        recs.push({
          type: 'reach_declining',
          icon: '📉',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name}: reach has been dropping through the week - audience may be exhausted, expand targeting`,
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

      // Active-only: a paused campaign having few/no impressions is expected, not a delivery problem.
      if (c.status.effective_status === 'ACTIVE' && spend > 0 && impressions < thresholds.lowImpressions) {
        recs.push({
          type: 'low_impressions',
          icon: '📡',
          campaignId: c.id,
          campaignName: c.name,
          message: `${c.name} only got ${Math.round(impressions).toLocaleString('en-US')} impressions ${scopeWord} despite active spend - check for a disapproved ad, learning-limited status, or a bid too low to compete`,
        });
      }
    }
  }

  return recs;
}

/** Placements below this many impressions are too small a sample to judge (a single fluke conversion or two can swing CTR/CPA wildly). */
const MIN_PLACEMENT_IMPRESSIONS = 500;

function wastedPlacementMinSpend(env: FBEnv, period: Period): number {
  const weekly = isWeeklyPeriod(period);
  if (weekly) return env.FB_WASTED_PLACEMENT_MIN_SPEND_WEEKLY ? parseFloat(env.FB_WASTED_PLACEMENT_MIN_SPEND_WEEKLY) : 20;
  return env.FB_WASTED_PLACEMENT_MIN_SPEND_DAILY ? parseFloat(env.FB_WASTED_PLACEMENT_MIN_SPEND_DAILY) : 5;
}

/**
 * Flags placements (publisher_platform x platform_position, e.g.
 * "audience_network / classic") that are burning meaningful spend with
 * zero conversions - candidates for excluding at the ad-set level.
 * Account-wide rather than per-campaign, so these use a synthetic
 * campaignId of 'account' to fit the existing Recommendation shape.
 */
export function generatePlacementRecommendations(
  placements: PlacementRow[],
  period: Period,
  env: FBEnv = {},
  currency: string = 'USD'
): Recommendation[] {
  const scopeWord = isWeeklyPeriod(period) ? 'this week' : 'today';
  const minSpend = wastedPlacementMinSpend(env, period);
  const recs: Recommendation[] = [];

  for (const p of placements) {
    if (p.impressions < MIN_PLACEMENT_IMPRESSIONS) continue;
    if (p.spend >= minSpend && p.conversions === 0) {
      recs.push({
        type: 'wasted_placement',
        icon: '🚫',
        campaignId: 'account',
        campaignName: 'Account-wide',
        message: `${p.publisherPlatform} / ${p.platformPosition} spent ${formatMoney(p.spend, currency)} ${scopeWord} across ${Math.round(p.impressions).toLocaleString('en-US')} impressions with 0 conversions - consider excluding this placement`,
      });
    }
  }

  return recs;
}

// verifyAdminAuth and parsePeriod now live in ad-shared.ts and are
// re-exported at the top of this file.
