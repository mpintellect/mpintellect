// functions/api/facebook/audiences/exclusion-gaps.ts
// GET /api/facebook/audiences/exclusion-gaps
//
// Flags active (or recently-active) campaigns missing standard exclusions:
// existing customers, past website purchasers, and - for ad sets targeting a
// Lookalike - that Lookalike's own source audience. "Estimated Savings" is a
// disclosed estimate (spend_last_7_days * FB_EXCLUSION_WASTE_PCT, default
// 5%), not a measured value - Meta doesn't expose how much spend actually
// reached an audience that should've been excluded. See findExclusionGaps in
// backend-lib/facebook.ts for exactly how each gap is detected.

import {
  getDateRange,
  verifyAdminAuth,
  fetchCampaignStatuses,
  fetchAdSetsWithTargeting,
  fetchAudienceExclusionProfiles,
  fetchInsights,
  fetchAccountCurrency,
  aggregateRows,
  findExclusionGaps,
  FacebookApiError,
} from '../../../../backend-lib/facebook';

const CORS_HEADERS = { 'Content-Type': 'application/json' };

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export async function onRequestGet(context: any) {
  const { request, env } = context;

  if (!verifyAdminAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS_HEADERS });
  }

  try {
    const range = getDateRange('last_7_days');

    const [campaigns, adSets, audiences, campaignRows, currency] = await Promise.all([
      fetchCampaignStatuses(env),
      fetchAdSetsWithTargeting(env),
      fetchAudienceExclusionProfiles(env),
      fetchInsights(env, { level: 'campaign', range }),
      fetchAccountCurrency(env),
    ]);

    const rowsByCampaign = new Map<string, typeof campaignRows>();
    for (const row of campaignRows) {
      const id = row.campaign_id || 'unknown';
      if (!rowsByCampaign.has(id)) rowsByCampaign.set(id, []);
      rowsByCampaign.get(id)!.push(row);
    }
    const campaignSpendLast7Days = new Map<string, number>();
    for (const [id, rows] of rowsByCampaign) {
      campaignSpendLast7Days.set(id, aggregateRows(rows, env).spend);
    }

    const { summary, gaps } = findExclusionGaps(campaigns, adSets, audiences, campaignSpendLast7Days, env);

    return new Response(JSON.stringify({ currency, summary, gaps }), { status: 200, headers: CORS_HEADERS });
  } catch (error: any) {
    const status = error instanceof FacebookApiError ? error.status : 500;
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status,
      headers: CORS_HEADERS,
    });
  }
}
