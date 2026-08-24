// app/admin/facebook-ads/lib/types.ts

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
    conversions: KpiCard;
    ctr: KpiCard;
    cpa: KpiCard;
    roas: KpiCard;
    reach: KpiCard;
    frequency: KpiCard;
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
    | 'high_impression_share_lost';
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
