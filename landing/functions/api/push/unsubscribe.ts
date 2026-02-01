// functions/api/push/unsubscribe.ts (Move from app/api/push/unsubscribe/route.ts)

import { getDb, execute } from '../../../landing/backend-lib/db-simple';

/**
 * FIXED: 
 * 1. Removed 'NextRequest' (Next.js specific).
 * 2. Changed to 'onRequestPost' (Cloudflare convention).
 * 3. Destructured 'request' from the 'context' argument.
 */
export async function onRequestPost(context: any) {
  const { request } = context;

  try {
    // FIXED: Use the extracted 'request' variable
    const body = await request.json();
    const { endpoint } = body;
    
    if (!endpoint) {
      return Response.json(
        { success: false, error: 'Missing endpoint' },
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
    
    const now = Date.now();
    
    // Mark subscription as inactive in Cloudflare D1
    const result = await execute(`
      UPDATE push_subscriptions 
      SET status = 'inactive', updated_at = ?
      WHERE endpoint = ?
    `, [now, endpoint]);

    if (!result.success) {
      throw new Error('Failed to unsubscribe');
    }

    return Response.json({
      success: true,
      message: 'Unsubscribed successfully'
    });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}