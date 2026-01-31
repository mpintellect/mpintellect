// functions/api/auth/logout.ts

import { execute } from '@/app/lib/cloudflare/db-simple';

/**
 * FIXED: 
 * 1. Added ': any' type to context
 * 2. Destructured 'request' from context
 */
export async function onRequestPost(context: any) {
  const { request } = context; 

  try {
    // Now 'request' is defined
    const { sessionId } = await request.json();

    if (sessionId) {
      // Delete session from database
      await execute(
        'DELETE FROM sessions WHERE id = ?',
        [sessionId]
      );
    }

    return Response.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error: any) {
    console.error('Logout error:', error);
    
    return Response.json(
      { 
        success: false, 
        error: 'Logout failed' 
      },
      { status: 500 }
    );
  }
}