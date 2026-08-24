// app/admin/monitoring/lib/types.ts

export type Period = 'today' | 'yesterday' | 'last_7_days' | 'this_week' | 'last_week';

export type ColorFlag = 'green' | 'yellow' | 'red' | 'neutral';

export interface Metrics {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  revenue: number;
  cpa: number;
  roas: number;
  reach: number;
  frequency: number;
  linkClicks: number;
  conversionRate: number;
  costPerLinkClick: number; // for Google this equals avgCpc - see backend-lib/google-ads.ts GoogleAggregateMetrics
}

export interface KpiCard {
  value: number;
  previousValue: number;
  changePct: number | null;
  flag: ColorFlag;
  budgetCap?: number | null;
  target?: number | null;
}

export interface InsightsResponse {
  period: Period;
  isWeekly: boolean;
  currency: string; // ISO 4217, e.g. "GBP" / "MAD" - the account's real billing currency, not necessarily USD
  cards: {
    spend: KpiCard;
    impressions: KpiCard;
    conversions: KpiCard;
    ctr: KpiCard;
    cpa: KpiCard;
    roas: KpiCard;
    reach: KpiCard;
    frequency: KpiCard;
    costPerLinkClick: KpiCard;
  };
}

export interface DailyBreakdownRow extends Metrics {
  date?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  effectiveStatus: string;
  dailyBudget: number | null;
  startDate?: string | null; // Google only
  endDate: string | null;
  budgetUsedPct: number | null;
  budgetRemaining: number | null;
  avgCpc?: number; // Google only
  avgCpm?: number; // Google only
  qualityScore?: number | null; // Google only, keyword-level average - null if unavailable
  impressionShareLostBudgetPct?: number | null; // Google only, Search campaigns - null if unavailable
  impressionShareLostRankPct?: number | null; // Google only, Search campaigns - null if unavailable
  metrics: Metrics;
  comparisonMetrics: Metrics;
  vsPrevPct: number | null;
  flags: { ctr: ColorFlag; roas: ColorFlag; cpa: ColorFlag; frequency: ColorFlag };
  health: 'good' | 'warning' | 'bad';
  dailyBreakdown?: DailyBreakdownRow[];
}

export interface CampaignsResponse {
  period: Period;
  currency: string; // ISO 4217, e.g. "GBP" / "MAD" - the account's real billing currency, not necessarily USD
  campaigns: Campaign[];
}

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
    | 'high_cpc'
    | 'low_conversion_rate'
    | 'budget_depleted'
    | 'high_impression_share_lost_budget'
    | 'high_impression_share_lost_rank'
    | 'wasted_search_terms'
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

export interface RecommendationsResponse {
  period: Period;
  scope: 'daily' | 'weekly';
  recommendations: Recommendation[];
}

// ---------------------------------------------------------------------------
// Facebook placement / device breakdown
// ---------------------------------------------------------------------------

export interface PlacementRow {
  publisherPlatform: string;
  platformPosition: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  cpa: number;
}

export interface DeviceRow {
  device: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  cpa: number;
}

export interface PlacementsResponse {
  period: Period;
  currency: string;
  placements: PlacementRow[];
  devices: DeviceRow[];
}

// ---------------------------------------------------------------------------
// Google search terms
// ---------------------------------------------------------------------------

export interface SearchTermRow {
  searchTerm: string;
  campaignId: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
}

export interface SearchTermsResponse {
  period: Period;
  currency: string;
  searchTerms: SearchTermRow[];
  negativeCandidates: SearchTermRow[];
}

// ---------------------------------------------------------------------------
// Audience overlap (Facebook only) - deliberately NOT a true overlap
// percentage (Meta doesn't expose that via the Marketing API). This reports
// the exact same custom audience being targeted by 2+ simultaneously-active
// campaigns - guaranteed auction competition, not an estimate. See
// backend-lib/facebook.ts findAudienceOverlaps for the full rationale.
// ---------------------------------------------------------------------------

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
  audiencesWithIssues: number;
  combinedAtRiskSpend: number;
}

export interface AudienceOverlapResponse {
  period: Period;
  currency: string;
  summary: AudienceOverlapSummary;
  overlaps: AudienceOverlapEntry[];
}

// ---------------------------------------------------------------------------
// Audience health (Facebook only) - snapshot of every custom/lookalike
// audience's operation/delivery status and whether it's currently used by an
// active ad set. Not period-scoped like the rest of this file - see
// backend-lib/facebook.ts computeAudienceHealth for the health-tier logic.
// ---------------------------------------------------------------------------

export type AudienceHealthTier = 'good' | 'warning' | 'issue' | 'unused';

export interface AudienceHealthRow {
  id: string;
  name: string;
  subtype: string;
  size: number | null;
  operationStatus: string;
  deliveryStatus: string;
  lastUsed: string | null; // YYYY-MM-DD, null if not delivered in the trailing 30 days
  usedInCampaign: string | null;
  health: AudienceHealthTier;
}

export interface AudienceHealthSummary {
  total: number;
  ready: number;
  active: number;
  issues: number;
}

export interface AudienceHealthResponse {
  summary: AudienceHealthSummary;
  audiences: AudienceHealthRow[];
}

// ---------------------------------------------------------------------------
// Exclusion gaps (Facebook only) - active campaigns missing standard
// exclusions (existing customers / past purchasers / a Lookalike's own
// source audience). "Estimated Savings" is a disclosed estimate, not a
// measured value - see backend-lib/facebook.ts findExclusionGaps.
// Not period-scoped (always evaluates the last 7 days).
// ---------------------------------------------------------------------------

export interface ExclusionGap {
  campaignId: string;
  campaignName: string;
  status: string;
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

export interface ExclusionGapsResponse {
  currency: string;
  summary: ExclusionGapsSummary;
  gaps: ExclusionGap[];
}

// ---------------------------------------------------------------------------
// Google Audiences - user_list (Remarketing / Customer Match / Similar /
// rule-based / combined lists), the closest Google equivalent to Facebook's
// Custom Audiences. Not period-scoped. See backend-lib/google-ads.ts
// computeGoogleAudienceHealth / findGoogleExclusionGaps for the exact logic
// and the real API constraints behind each field (e.g. "status" is Active/
// Closed, not Active/Paused/Expiring - Google has no per-list Paused or
// expiration-date concept).
// ---------------------------------------------------------------------------

export type GoogleAudienceHealthTier = 'good' | 'warning' | 'issue';

export interface GoogleAudienceRow {
  id: string;
  name: string;
  type: string;
  size: number;
  membershipLifeSpanDays: number;
  usedInCampaigns: string[];
  usedInActiveCampaign: boolean;
  usedInLast30Days: boolean;
  status: 'Active' | 'Closed';
  health: GoogleAudienceHealthTier;
}

export interface GoogleAudienceSummary {
  totalLists: number;
  activeLists: number;
  listsWithSize: number;
  listsWithIssues: number;
}

export interface GoogleAudienceHealthResponse {
  summary: GoogleAudienceSummary;
  audiences: GoogleAudienceRow[];
}

export interface GoogleExclusionGap {
  campaignId: string;
  campaignName: string;
  status: string;
  missingExclusion: string;
  recommendation: string;
}

export interface GoogleExclusionGapsSummary {
  campaignsChecked: number;
  campaignsWithGaps: number;
}

export interface GoogleExclusionGapsResponse {
  summary: GoogleExclusionGapsSummary;
  gaps: GoogleExclusionGap[];
}

export const PERIOD_LABELS: Record<Period, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  last_7_days: 'Last 7 Days',
  this_week: 'This Week',
  last_week: 'Last Week',
};

export const COMPARISON_LABELS: Record<Period, string> = {
  today: 'vs Yesterday',
  yesterday: 'vs Day Before',
  last_7_days: 'vs Previous 7 Days',
  this_week: 'vs Last Week',
  last_week: 'vs Week Before',
};
