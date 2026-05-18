// functions/api/telegram/cron-check.ts

import { shouldPostNow, getCurrentScheduleTime, isFirstPostOfDay } from '../../utils/telegram-scheduler';

export async function onRequestGet(context: any): Promise<Response> {
  const { env } = context;
  
  // Verify cron secret
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const now = new Date();
  
  // Check if we should post at this time
  if (!shouldPostNow(now)) {
    return new Response(JSON.stringify({ message: 'No post scheduled at this time' }), { status: 200 });
  }
  
  const scheduleTime = getCurrentScheduleTime(now);
  const isFirst = isFirstPostOfDay(now);
  
  // Trigger the smart post
  const postRes = await fetch(`${env.API_URL}/api/telegram/smart-post`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.ADMIN_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  
  const result = await postRes.json();
  
  return new Response(JSON.stringify({
    success: result.success,
    scheduleTime,
    isFirstOfDay: isFirst,
    result,
  }), { status: 200 });
}