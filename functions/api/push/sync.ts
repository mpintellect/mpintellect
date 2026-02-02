// functions/api/push/sync.ts (Move from app/api/push/sync/route.ts)

import { getDb, execute } from '../../../backend-lib/db-simple';

/**
 * FIXED: 
 * 1. Removed 'NextRequest' (Next.js specific).
 * 2. Changed to 'onRequestPost' (Cloudflare naming).
 * 3. Extracted 'request' from the 'context' object.
 */
export async function onRequestPost(context: any) {
  const { request } = context;

  try {
    // FIXED: Now using the extracted 'request' variable
    const body = await request.json();
    const { userId, subscription, userData } = body;
    
    if (!userId || !subscription?.endpoint) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = getDb();
    if (!db) {
      return Response.json(
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

    return Response.json({
      success: true,
      message: 'Subscription synced with user account'
    });
  } catch (error) {
    console.error('Error syncing push subscription:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}