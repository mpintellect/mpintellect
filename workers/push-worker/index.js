// workers/push-worker/index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
        status: 204,
      });
    }

    try {
      // Route requests
      if (path === '/send' && request.method === 'POST') {
        return await handleSendPush(request, env, ctx);
      } else if (path === '/subscribe' && request.method === 'POST') {
        return await handleSubscribe(request, env);
      } else if (path === '/unsubscribe' && request.method === 'POST') {
        return await handleUnsubscribe(request, env);
      } else if (path === '/broadcast' && request.method === 'POST') {
        return await handleBroadcast(request, env, ctx);
      } else if (path === '/stats' && request.method === 'GET') {
        return await handleGetStats(request, env);
      } else if (path === '/test' && request.method === 'POST') {
        return await handleTestPush(request, env);
      } else {
        return new Response(
          JSON.stringify({
            status: 'ok',
            endpoints: ['/send', '/subscribe', '/unsubscribe', '/broadcast', '/stats', '/test'],
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ error: error.message, success: false }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
  },

  // Scheduled job for sending queued notifications
  async scheduled(event, env, ctx) {
    ctx.waitUntil(processNotificationQueue(env));
  },
};

// ==================== HELPER FUNCTIONS ====================

// Encrypt payload for Web Push
async function encryptPayload(subscription, payload) {
  const encoder = new TextEncoder();
  const payloadBuffer = encoder.encode(JSON.stringify(payload));
  
  // In a real implementation, you would use Web Crypto API
  // to encrypt the payload with the subscription's public key
  // This is a simplified version
  
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(payloadBuffer))),
    encoding: 'base64',
  };
}

// Send a single push notification
async function sendPushNotification(subscription, payload, vapidDetails) {
  try {
    const encryptedPayload = await encryptPayload(subscription, payload);
    
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'TTL': '2419200', // 4 weeks
        'Urgency': 'normal',
        'Authorization': `vapid t=${vapidDetails.publicKey}, k=${subscription.keys?.p256dh || ''}`,
      },
      body: encryptedPayload.ciphertext,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Push service returned ${response.status}: ${errorText}`);
    }

    return { success: true, status: response.status };
  } catch (error) {
    console.error('Push notification error:', error);
    return { success: false, error: error.message };
  }
}

// ==================== REQUEST HANDLERS ====================

async function handleSendPush(request, env, ctx) {
  const body = await request.json();
  const { subscription, payload, vapidPublicKey, vapidPrivateKey } = body;

  if (!subscription || !subscription.endpoint) {
    return new Response(
      JSON.stringify({ error: 'Missing subscription', success: false }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  const vapidDetails = {
    publicKey: vapidPublicKey || env.VAPID_PUBLIC_KEY,
    privateKey: vapidPrivateKey || env.VAPID_PRIVATE_KEY,
    subject: env.VAPID_SUBJECT || 'mailto:admin@mpintellect.com',
  };

  const result = await sendPushNotification(subscription, payload, vapidDetails);
  
  // Log the attempt
  if (env.DB) {
    await env.DB.prepare(
      `INSERT INTO push_logs (endpoint, success, error, sent_at)
       VALUES (?, ?, ?, ?)`
    ).bind(
      subscription.endpoint.substring(0, 100),
      result.success ? 1 : 0,
      result.error || null,
      new Date().toISOString()
    ).run();
  }

  return new Response(
    JSON.stringify(result),
    { headers: { 'Content-Type': 'application/json' }, status: result.success ? 200 : 500 }
  );
}

async function handleSubscribe(request, env) {
  const body = await request.json();
  const { subscription, userId, email } = body;

  if (!subscription || !subscription.endpoint) {
    return new Response(
      JSON.stringify({ error: 'Invalid subscription', success: false }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  try {
    // Store subscription in D1
    const result = await env.DB.prepare(
      `INSERT OR REPLACE INTO push_subscriptions 
       (endpoint, user_id, email, subscription_data, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      subscription.endpoint,
      userId || null,
      email || null,
      JSON.stringify(subscription),
      'active',
      new Date().toISOString(),
      new Date().toISOString()
    ).run();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Subscription saved',
        subscriptionId: result.meta.last_row_id 
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save subscription', success: false }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

async function handleUnsubscribe(request, env) {
  const body = await request.json();
  const { endpoint } = body;

  if (!endpoint) {
    return new Response(
      JSON.stringify({ error: 'Missing endpoint', success: false }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  try {
    // Mark subscription as inactive
    await env.DB.prepare(
      `UPDATE push_subscriptions 
       SET status = 'inactive', updated_at = ?
       WHERE endpoint = ?`
    ).bind(new Date().toISOString(), endpoint).run();

    return new Response(
      JSON.stringify({ success: true, message: 'Unsubscribed successfully' }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to unsubscribe', success: false }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

async function handleBroadcast(request, env, ctx) {
  const body = await request.json();
  const { 
    title, 
    message, 
    url = 'https://mpintellect.com',
    type = 'broadcast',
    icon = '/logos/mzlogo.webp'
  } = body;

  if (!title || !message) {
    return new Response(
      JSON.stringify({ error: 'Missing title or message', success: false }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  const payload = {
    title: title.startsWith("🚀") ? title : `🚀 ${title}`,
    body: message,
    icon: icon,
    badge: '/logos/mzlogo.webp',
    url: url,
    vibrate: [200, 100, 200],
    tag: type,
    timestamp: Date.now(),
    actions: [
      { action: 'open', title: '⚡ Open App' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  // Get all active subscriptions
  const { results: subscriptions } = await env.DB.prepare(
    `SELECT endpoint, subscription_data FROM push_subscriptions WHERE status = 'active'`
  ).all();

  if (subscriptions.length === 0) {
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'No active subscriptions found',
        sent: 0,
        total: 0 
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  }

  console.log(`Starting broadcast to ${subscriptions.length} subscriptions...`);

  // Process in batches
  const BATCH_SIZE = 5;
  let successful = 0;
  let failed = 0;

  for (let i = 0; i < subscriptions.length; i += BATCH_SIZE) {
    const batch = subscriptions.slice(i, i + BATCH_SIZE);
    
    const batchPromises = batch.map(async (sub) => {
      try {
        const subscription = JSON.parse(sub.subscription_data);
        const result = await sendPushNotification(
          subscription, 
          payload, 
          {
            publicKey: env.VAPID_PUBLIC_KEY,
            privateKey: env.VAPID_PRIVATE_KEY,
            subject: env.VAPID_SUBJECT
          }
        );

        // Log result
        await env.DB.prepare(
          `INSERT INTO broadcast_logs 
           (endpoint, title, message, success, error, sent_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(
          sub.endpoint.substring(0, 100),
          title,
          message,
          result.success ? 1 : 0,
          result.error || null,
          new Date().toISOString()
        ).run();

        return result.success;
      } catch (error) {
        console.error(`Failed to send to ${sub.endpoint}:`, error);
        return false;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    successful += batchResults.filter(r => r).length;
    failed += batchResults.filter(r => !r).length;

    // Small delay between batches
    if (i + BATCH_SIZE < subscriptions.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `Broadcast completed`,
      stats: {
        total: subscriptions.length,
        successful,
        failed,
        percentage: Math.round((successful / subscriptions.length) * 100)
      }
    }),
    { headers: { 'Content-Type': 'application/json' }, status: 200 }
  );
}

async function handleGetStats(request, env) {
  try {
    // Get subscription stats
    const subscriptionStats = await env.DB.prepare(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive
       FROM push_subscriptions`
    ).first();

    // Get recent broadcast stats
    const broadcastStats = await env.DB.prepare(
      `SELECT 
        COUNT(*) as total_broadcasts,
        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed,
        MAX(sent_at) as last_broadcast
       FROM broadcast_logs`
    ).first();

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          subscriptions: subscriptionStats,
          broadcasts: broadcastStats,
          timestamp: new Date().toISOString()
        }
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Stats error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get stats', success: false }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

async function handleTestPush(request, env) {
  const body = await request.json();
  const { endpoint } = body;

  if (!endpoint) {
    // Get first active subscription for testing
    const subscription = await env.DB.prepare(
      `SELECT subscription_data FROM push_subscriptions WHERE status = 'active' LIMIT 1`
    ).first();

    if (!subscription) {
      return new Response(
        JSON.stringify({ error: 'No active subscriptions found', success: false }),
        { headers: { 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    const subData = JSON.parse(subscription.subscription_data);
    
    const result = await sendPushNotification(
      subData,
      {
        title: '🚀 Test Push Notification',
        body: 'This is a test notification from MPIntellect Push Worker',
        icon: '/logos/mzlogo.webp',
        url: 'https://mpintellect.com',
        timestamp: Date.now()
      },
      {
        publicKey: env.VAPID_PUBLIC_KEY,
        privateKey: env.VAPID_PRIVATE_KEY,
        subject: env.VAPID_SUBJECT
      }
    );

    return new Response(
      JSON.stringify(result),
      { headers: { 'Content-Type': 'application/json' }, status: result.success ? 200 : 500 }
    );
  }

  return new Response(
    JSON.stringify({ error: 'Specify endpoint for test', success: false }),
    { headers: { 'Content-Type': 'application/json' }, status: 400 }
  );
}

async function processNotificationQueue(env) {
  console.log('Processing notification queue...');
  
  // Get queued notifications
  const { results: queued } = await env.DB.prepare(
    `SELECT * FROM notification_queue WHERE status = 'pending' LIMIT 10`
  ).all();

  for (const notification of queued) {
    try {
      const subscription = JSON.parse(notification.subscription_data);
      
      const result = await sendPushNotification(
        subscription,
        JSON.parse(notification.payload),
        {
          publicKey: env.VAPID_PUBLIC_KEY,
          privateKey: env.VAPID_PRIVATE_KEY,
          subject: env.VAPID_SUBJECT
        }
      );

      // Update notification status
      await env.DB.prepare(
        `UPDATE notification_queue 
         SET status = ?, processed_at = ?, error = ?
         WHERE id = ?`
      ).bind(
        result.success ? 'sent' : 'failed',
        new Date().toISOString(),
        result.error || null,
        notification.id
      ).run();

    } catch (error) {
      console.error(`Failed to process notification ${notification.id}:`, error);
    }
  }
}