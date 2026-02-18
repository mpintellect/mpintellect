// functions/api/push/subscribe.ts

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { subscription, userData, deviceInfo } = body;
    
    if (!subscription?.endpoint) {
      return new Response(JSON.stringify({ error: 'Invalid subscription' }), { status: 400, headers: HEADERS });
    }

    const endpoint = subscription.endpoint;
    const now = Date.now();
    const subData = JSON.stringify(subscription);
    
    // 1. Check if exists
    const existing = await env.DB.prepare('SELECT id FROM push_subscriptions WHERE endpoint = ?').bind(endpoint).first();

    if (existing) {
      await env.DB.prepare(`
        UPDATE push_subscriptions 
        SET subscription_data = ?, user_id = ?, email = ?, 
            display_name = ?, device_info = ?, updated_at = ?, status = 'active'
        WHERE endpoint = ?
      `).bind(
        subData,
        userData?.userId || null,
        userData?.email || null,
        userData?.displayName || null,
        deviceInfo || null,
        now,
        endpoint
      ).run();
    } else {
      await env.DB.prepare(`
        INSERT INTO push_subscriptions 
        (endpoint, subscription_data, user_id, email, display_name, device_info, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)
      `).bind(
        endpoint,
        subData,
        userData?.userId || null,
        userData?.email || null,
        userData?.displayName || null,
        deviceInfo || null,
        now,
        now
      ).run();
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: HEADERS });
  } catch (error: any) {
    console.error('Push Subscribe Error:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Error' }), { status: 500, headers: HEADERS });
  }
}