// app/api/push/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb, execute } from '@/app/lib/cloudflare/db-simple';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, subscription, userData } = body;
    
    if (!userId || !subscription?.endpoint) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      );
    }
    
    const endpoint = subscription.endpoint;
    const now = Date.now();
    
    // Find existing subscription by endpoint and update user info
    const result = await execute(`
      UPDATE push_subscriptions 
      SET user_id = ?, email = ?, display_name = ?, updated_at = ?
      WHERE endpoint = ?
    `, [
      userId,
      userData?.email || null,
      userData?.displayName || null,
      now,
      endpoint
    ]);

    if (!result.success) {
      throw new Error('Failed to sync subscription');
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription synced with user account'
    });
  } catch (error) {
    console.error('Error syncing push subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}