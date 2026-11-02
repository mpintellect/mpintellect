// functions/api/admin/broker/users/sync.ts
// "Seed users" button on app/admin/users/page.tsx - walks the Users list
// only as far as the newest reg_date already in broker_users, so this only
// ever pulls genuinely new registrations (typically 1-2), email/phone
// included. Caps at 10 new users per click and warns rather than pulling
// more - see backend-lib/investizo-scraper.ts's syncNewUsers() and
// MAX_NEW_USERS_PER_SYNC. Admin-gated the same way as the rest of
// /api/admin/* (Bearer <ADMIN_PASSWORD|ADMIN_KEY>, fails closed).

import { syncNewUsers } from '../../../../../backend-lib/investizo-scraper';

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

  const result = await syncNewUsers(env);

  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 502,
    headers: { 'Content-Type': 'application/json' },
  });
}
