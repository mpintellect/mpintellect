// functions/api/admin/broker/users/detail.ts
// Per-row "Get email/phone" action on app/admin/users/page.tsx - fetches
// (and permanently caches) one user's email/phone. Only hits Investizo at
// all if broker_users.detail_fetched_at is still null for that user; a
// second click for the same user costs zero Investizo requests. Admin-gated
// the same way as the rest of /api/admin/* (Bearer <ADMIN_PASSWORD|ADMIN_KEY>,
// fails closed).

import { fetchAndCacheUserDetail } from '../../../../../backend-lib/investizo-scraper';

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

  const body: any = await request.json().catch(() => ({}));
  const id = String(body.id || '').trim();
  if (!id) {
    return new Response(JSON.stringify({ error: 'id is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await fetchAndCacheUserDetail(env, id);

  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 502,
    headers: { 'Content-Type': 'application/json' },
  });
}
