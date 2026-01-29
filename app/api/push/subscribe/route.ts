// app/api/push/subscribe/route.ts - FIXED
import { NextRequest, NextResponse } from 'next/server';
import { getDb, queryOne, execute } from '@/app/lib/cloudflare/db-simple';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription, userData, deviceInfo } = body;
    
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { success: false, error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    const db = getDb();
    const endpoint = subscription.endpoint;
    
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      );
    }
    
    // Check if subscription already exists - use the queryOne helper
    const existing = await queryOne(
      'SELECT id FROM push_subscriptions WHERE endpoint = ?',
      [endpoint]
    );

    const now = Date.now();
    
    if (existing) {
      // Update existing subscription - use the execute helper
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
      // Insert new subscription - use the execute helper
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

    return NextResponse.json({
      success: true,
      message: 'Subscription saved successfully'
    });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}