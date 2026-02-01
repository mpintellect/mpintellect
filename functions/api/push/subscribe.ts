// functions/api/push/subscribe.ts (Move from app/api/push/subscribe/route.ts)

import { getDb, queryOne, execute } from '@/backend-lib/db-simple';

/**
 * FIXED: 
 * 1. Removed Next.js specific 'NextRequest' type.
 * 2. Changed to 'onRequestPost' for Cloudflare Functions.
 * 3. Extracted 'request' from the 'context' argument.
 */
export async function onRequestPost(context: any) {
  const { request } = context;

  try {
    // FIXED: Use the extracted 'request' object
    const body = await request.json();
    const { subscription, userData, deviceInfo } = body;
    
    if (!subscription || !subscription.endpoint) {
      return Response.json(
        { success: false, error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    const db = getDb();
    const endpoint = subscription.endpoint;
    
    if (!db) {
      return Response.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      );
    }
    
    // Check if subscription already exists
    const existing = await queryOne(
      'SELECT id FROM push_subscriptions WHERE endpoint = ?',
      [endpoint]
    );

    const now = Date.now();
    
    if (existing) {
      // Update existing subscription
      const updateResult = await execute(`
        UPDATE push_subscriptions 
        SET subscription_data = ?, user_id = ?, email = ?, 
            display_name = ?, device_info = ?, updated_at = ?
        WHERE endpoint = ?
      `, [
        JSON.stringify(subscription),
        userData?.userId || null,
        userData?.email || null,
        userData?.displayName || null,
        deviceInfo || null,
        now,
        endpoint
      ]);
      
      if (!updateResult.success) {
        throw new Error('Failed to update subscription');
      }
    } else {
      // Insert new subscription
      const insertResult = await execute(`
        INSERT INTO push_subscriptions 
        (endpoint, subscription_data, user_id, email, display_name, 
         device_info, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)
      `, [
        endpoint,
        JSON.stringify(subscription),
        userData?.userId || null,
        userData?.email || null,
        userData?.displayName || null,
        deviceInfo || null,
        now,
        now
      ]);
      
      if (!insertResult.success) {
        throw new Error('Failed to insert subscription');
      }
    }

    return Response.json({
      success: true,
      message: 'Subscription saved successfully'
    });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}