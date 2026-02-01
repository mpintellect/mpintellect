// functions/api/user/use-setup.ts (Move from app/api/user/use-setup/route.ts)

import { query, execute } from '../../../../landing/backend-lib/db-simple';

// Simple token verification helper
function getUserIdFromToken(token: string): string | null {
  try {
    const cleanToken = token.replace('Bearer ', '').replace('cf_', '');
    const decoded = JSON.parse(atob(cleanToken));
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

/**
 * FIXED: 
 * 1. Added 'const { request } = context' so the request variable is defined.
 * 2. Corrected import paths for the /functions structure.
 */
export async function onRequestPost(context: any) {
  const { request } = context;

  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return Response.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    // FIXED: Safely handle empty bodies to prevent crashes
    const body = await request.json().catch(() => ({}));
    const { userId } = body;
    const tokenUserId = getUserIdFromToken(authHeader);
    
    // Use provided userId or extract from token
    const targetUserId = userId || tokenUserId;
    
    if (!targetUserId) {
      return Response.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Check current setup count in D1
    const currentCount = await query<{ setup_count: number }>(
      'SELECT setup_count FROM users WHERE id = ? LIMIT 1',
      [targetUserId]
    );

    if (currentCount.length === 0) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const setupCount = currentCount[0].setup_count || 0;
    
    if (setupCount <= 0) {
      return Response.json(
        { 
          success: false, 
          error: 'no-credits',
          message: 'No setup credits available' 
        },
        { status: 400 }
      );
    }

    // Deduct one setup from D1 SQL
    const result = await execute(
      'UPDATE users SET setup_count = setup_count - 1 WHERE id = ? AND setup_count > 0',
      [targetUserId]
    );

    if (result.success) {
      return Response.json({
        success: true,
        message: 'Setup used successfully',
        remaining: setupCount - 1
      });
    } else {
      return Response.json(
        { 
          success: false, 
          error: 'Failed to update setup count' 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Use setup error:', error);
    return Response.json(
      { success: false, error: 'Failed to use setup' },
      { status: 500 }
    );
  }
}