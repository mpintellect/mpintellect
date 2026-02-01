import { query } from '@/app/lib/cloudflare/db-simple';

// Simple token verification
function getUserIdFromToken(token: string): string | null {
  try {
    const cleanToken = token.replace('Bearer ', '').replace('cf_', '');
    const decoded = JSON.parse(atob(cleanToken));
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function onRequestGet(context: any): Promise<Response> {
  try {
    const { request } = context;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Alternative: Get userId from token
    let targetUserId = userId;
    if (!targetUserId) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader) {
        targetUserId = getUserIdFromToken(authHeader);
      }
    }

    if (!targetUserId) {
      return Response.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get setup count from database
    const result = await query<{ setup_count: number }>(
      'SELECT setup_count FROM users WHERE id = ? LIMIT 1',
      [targetUserId]
    );

    if (result.length === 0) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      setupCount: result[0].setup_count || 0
    });

  } catch (error: any) {
    console.error('Get setup count error:', error);
    
    return Response.json(
      { 
        success: false, 
        error: 'Failed to get setup count' 
      },
      { status: 500 }
    );
  }
}