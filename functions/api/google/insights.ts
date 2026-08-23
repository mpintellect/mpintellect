// functions/api/google/insights.ts
// GET /api/google/insights?period=today|yesterday|last_7_days|this_week|last_week
// Account-level executive summary, mirroring functions/api/facebook/insights.ts's shape.

import {
  getDateRange,
  getComparisonDateRange,
  isWeeklyPeriod,
  parsePeriod,
  verifyAdminAuth,
  classifyCtr,
  classifyRoas,
  classifyCpaFromRoas,
  classifySpend,
  classifyConversions,
  classifyFrequency,
} from '../../../backend-lib/ad-shared';
import {
  fetchCampaignRows,
  fetchReachByCampaign,
  aggregateCampaignRows,
  budgetCapFor,
  conversionTargetFor,
  GoogleAdsApiError,
} from '../../../backend-lib/google-ads';

const CORS_HEADERS = { 'Content-Type': 'application/json' };

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export async function onRequestGet(context: any) {
  const { request, env } = context;

  if (!verifyAdminAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const period = parsePeriod(url.searchParams.get('period'));

  try {
    const range = getDateRange(period);
    const comparisonRange = getComparisonDateRange(period);

    const [mainRows, comparisonRows, reachByCampaign, comparisonReachByCampaign] = await Promise.all([
      fetchCampaignRows(env, range, false),
      fetchCampaignRows(env, comparisonRange, false),
      fetchReachByCampaign(env, range),
      fetchReachByCampaign(env, comparisonRange),
    ]);

    const main = aggregateCampaignRows(mainRows, reachByCampaign);
    const previous = aggregateCampaignRows(comparisonRows, comparisonReachByCampaign);

    const dailyBudgetSum = mainRows
      .filter((r) => r.status === 'ENABLED')
      .reduce((sum, r) => sum + (r.dailyBudget || 0), 0);
    const cap = budgetCapFor(env, period, dailyBudgetSum);
    const conversionTarget = conversionTargetFor(env, period);

    const cards = {
      spend: {
        value: main.spend,
        previousValue: previous.spend,
        changePct: pctChange(main.spend, previous.spend),
        flag: classifySpend(main.spend, cap),
        budgetCap: cap ?? null,
      },
      conversions: {
        value: main.conversions,
        previousValue: previous.conversions,
        changePct: pctChange(main.conversions, previous.conversions),
        flag: classifyConversions(main.conversions, conversionTarget),
        target: conversionTarget ?? null,
      },
      ctr: {
        value: main.ctr,
        previousValue: previous.ctr,
        changePct: pctChange(main.ctr, previous.ctr),
        flag: classifyCtr(main.ctr),
      },
      cpa: {
        value: main.cpa,
        previousValue: previous.cpa,
        changePct: pctChange(main.cpa, previous.cpa),
        flag: classifyCpaFromRoas(main.roas),
      },
      roas: {
        value: main.roas,
        previousValue: previous.roas,
        changePct: pctChange(main.roas, previous.roas),
        flag: classifyRoas(main.roas),
      },
      reach: {
        value: main.reach,
        previousValue: previous.reach,
        changePct: pctChange(main.reach, previous.reach),
        flag: 'neutral' as const,
      },
      frequency: {
        value: main.frequency,
        previousValue: previous.frequency,
        changePct: pctChange(main.frequency, previous.frequency),
        flag: classifyFrequency(main.frequency, 3),
      },
    };

    return new Response(
      JSON.stringify({ period, range, comparisonRange, isWeekly: isWeeklyPeriod(period), cards }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    const status = error instanceof GoogleAdsApiError ? error.status : 500;
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status,
      headers: CORS_HEADERS,
    });
  }
}
