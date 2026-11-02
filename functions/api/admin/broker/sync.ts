// functions/api/admin/broker/sync.ts
// Manual "Refresh" button on app/admin/broker/page.tsx - the only way
// Investizo data gets pulled (no background cron). Admin-gated the same
// way as telegram/publish.ts and send-message.ts
// (Bearer <ADMIN_PASSWORD|ADMIN_KEY>, fails closed - see
// functions/api/admin/validate.ts).

import { syncInvestizoData } from '../../../../backend-lib/investizo-scraper';

export async function onRequestPost(context: any) {
  const { request, env } = context;

  const authHeader = request.headers.get('Authorization');
  const expectedSecret = env.ADMIN_PASSWORD || env.ADMIN_KEY;
  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await syncInvestizoData(env, 'manual');

  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 502,
    headers: { 'Content-Type': 'application/json' },
  });
}
