// functions/api/google/audiences/exclusion-gaps.ts
// GET /api/google/audiences/exclusion-gaps
//
// Flags ENABLED campaigns missing exclusions for "conversion audiences" -
// remarketing/Customer Match lists whose own name or description signals
// they're built from people who already purchased/converted (e.g. a
// "Purchasers" remarketing list). See findGoogleExclusionGaps in
// backend-lib/google-ads.ts. Simpler than the Facebook version - no spend/
// savings estimate, just which campaign is missing which exclusion.

import { verifyAdminAuth } from '../../../../backend-lib/ad-shared';
import {
  fetchUserLists,
  fetchUserListCriteria,
  fetchCampaignSummaries,
  findGoogleExclusionGaps,
  GoogleAdsApiError,
} from '../../../../backend-lib/google-ads';

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
    const [campaigns, lists, criteria] = await Promise.all([
      fetchCampaignSummaries(env),
      fetchUserLists(env),
      fetchUserListCriteria(env),
    ]);

    const { summary, gaps } = findGoogleExclusionGaps(campaigns, lists, criteria);

    return new Response(JSON.stringify({ summary, gaps }), { status: 200, headers: CORS_HEADERS });
  } catch (error: any) {
    const status = error instanceof GoogleAdsApiError ? error.status : 500;
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status,
      headers: CORS_HEADERS,
    });
  }
}
