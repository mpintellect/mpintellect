// app/api/user/use-setup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/app/lib/cloudflare/db-simple';

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

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const { userId } = await request.json();
    const tokenUserId = getUserIdFromToken(authHeader);
    
    // Use provided userId or extract from token
    const targetUserId = userId || tokenUserId;
    
    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Check current setup count
    const currentCount = await query<{ setup_count: number }>(
      'SELECT setup_count FROM users WHERE id = ? LIMIT 1',
      [targetUserId]
    );

    if (currentCount.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const setupCount = currentCount[0].setup_count || 0;
    
    if (setupCount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'no-credits',
          message: 'No setup credits available' 
        },
        { status: 400 }
      );
    }

    // Deduct one setup
    const result = await execute(
      'UPDATE users SET setup_count = setup_count - 1 WHERE id = ? AND setup_count > 0',
      [targetUserId]
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Setup used successfully',
        remaining: setupCount - 1
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update setup count' 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Use setup error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to use setup' 
      },
      { status: 500 }
    );
  }
}