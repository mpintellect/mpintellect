// functions/api/facebook/audiences/health.ts
// GET /api/facebook/audiences/health
//
// Audience Health Overview: every custom/lookalike audience on the account,
// its Graph API operation/delivery status, and whether it's currently
// targeted by an active ad set. "Last used" is derived from ad-set-level
// insights over the trailing 30 days (Meta doesn't expose a literal
// "audience last used" timestamp) - see computeAudienceHealth in
// backend-lib/facebook.ts for the exact health-tier logic.

import {
  verifyAdminAuth,
  fetchCustomAudienceHealth,
  fetchAdSetsWithTargeting,
  fetchCampaignStatuses,
  fetchAdSetLastDelivery,
  computeAudienceHealth,
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
    const [audiences, adSets, campaigns, lastDelivery] = await Promise.all([
      fetchCustomAudienceHealth(env),
      fetchAdSetsWithTargeting(env),
      fetchCampaignStatuses(env),
      fetchAdSetLastDelivery(env),
    ]);

    const { summary, audiences: rows } = computeAudienceHealth(audiences, adSets, campaigns, lastDelivery);

    return new Response(JSON.stringify({ summary, audiences: rows }), { status: 200, headers: CORS_HEADERS });
  } catch (error: any) {
    const status = error instanceof FacebookApiError ? error.status : 500;
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status,
      headers: CORS_HEADERS,
    });
  }
}
