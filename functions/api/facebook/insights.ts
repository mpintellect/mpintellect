// functions/api/facebook/insights.ts
// GET /api/facebook/insights?period=today|yesterday|last_7_days|this_week|last_week
// Account-level executive summary: Spend, Conversions, CTR, CPA, ROAS,
// each with a comparison to the previous equivalent period.

import {
  getDateRange,
  getComparisonDateRange,
  isWeeklyPeriod,
  parsePeriod,
  verifyAdminAuth,
  fetchInsights,
  fetchCampaignStatuses,
  fetchAccountCurrency,
  aggregateRows,
  classifyCtr,
  classifyRoas,
  classifyCpa,
  classifySpend,
  classifyConversions,
  classifyFrequency,
  budgetCapFor,
  conversionTargetFor,
  FacebookApiError,
} from '../../../backend-lib/facebook';

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

    const [mainRows, comparisonRows, statuses, currency] = await Promise.all([
      fetchInsights(env, { level: 'account', range }),
      fetchInsights(env, { level: 'account', range: comparisonRange }),
      fetchCampaignStatuses(env),
      fetchAccountCurrency(env),
    ]);

    const main = aggregateRows(mainRows, env);
    const previous = aggregateRows(comparisonRows, env);

    const dailyBudgetSum = statuses
      .filter((s) => s.effective_status === 'ACTIVE')
      .reduce((sum, s) => sum + (s.daily_budget || 0), 0);
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
        flag: classifyCpa(main.roas),
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
      JSON.stringify({
        period,
        range,
        comparisonRange,
        isWeekly: isWeeklyPeriod(period),
        currency,
        cards,
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    const status = error instanceof FacebookApiError ? error.status : 500;
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status,
      headers: CORS_HEADERS,
    });
  }
}
