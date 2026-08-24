// functions/api/facebook/audiences/overlap.ts
// GET /api/facebook/audiences/overlap?period=today|yesterday|last_7_days|this_week|last_week
//
// Audience overlap, scoped to what's actually verifiable: Meta doesn't
// expose true audience-to-audience overlap size via the Marketing API (see
// the note in backend-lib/facebook.ts findAudienceOverlaps). This reports
// the same custom audience being targeted by 2+ simultaneously-active
// campaigns - guaranteed auction competition, not an estimate.

import {
  getDateRange,
  parsePeriod,
  verifyAdminAuth,
  fetchInsights,
  fetchCampaignStatuses,
  fetchAccountCurrency,
  fetchCustomAudiences,
  fetchAdSetsWithTargeting,
  aggregateRows,
  findAudienceOverlaps,
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

  const url = new URL(request.url);
  const period = parsePeriod(url.searchParams.get('period'));

  try {
    const range = getDateRange(period);

    const [audiences, adSets, campaigns, campaignRows, currency] = await Promise.all([
      fetchCustomAudiences(env),
      fetchAdSetsWithTargeting(env),
      fetchCampaignStatuses(env),
      fetchInsights(env, { level: 'campaign', range }),
      fetchAccountCurrency(env),
    ]);

    const rowsByCampaign = new Map<string, typeof campaignRows>();
    for (const row of campaignRows) {
      const id = row.campaign_id || 'unknown';
      if (!rowsByCampaign.has(id)) rowsByCampaign.set(id, []);
      rowsByCampaign.get(id)!.push(row);
    }
    const campaignSpendById = new Map<string, number>();
    for (const [id, rows] of rowsByCampaign) {
      campaignSpendById.set(id, aggregateRows(rows, env).spend);
    }

    const { summary, overlaps } = findAudienceOverlaps(audiences, adSets, campaigns, campaignSpendById);

    return new Response(
      JSON.stringify({ period, range, currency, summary, overlaps }),
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
