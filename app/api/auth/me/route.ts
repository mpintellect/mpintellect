// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/app/lib/cloudflare/db-simple';

// Simple JWT verification (in production use a proper JWT library)
function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    // Remove 'cf_' prefix if present
    const cleanToken = token.replace('cf_', '');
    const decoded = JSON.parse(atob(cleanToken));
    
    // Check expiration
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return { userId: decoded.userId, email: decoded.email };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await query<{
      id: string;
      email: string;
      display_name?: string;
      photo_url?: string;
      email_verified: number;
      license_type: string;
      referral_code?: string;
      setup_count: number;
      created_at: string;
    }>(
      'SELECT id, email, display_name, photo_url, email_verified, license_type, referral_code, created_at FROM users WHERE id = ? LIMIT 1',
      [payload.userId]
    );

    if (user.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get setup count
    const setupCountResult = await query<{ setup_count: number }>(
      'SELECT setup_count FROM users WHERE id = ? LIMIT 1',
      [payload.userId]
    );

    const setupCount = setupCountResult[0]?.setup_count || 0;

    return NextResponse.json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        display_name: user[0].display_name,
        photo_url: user[0].photo_url,
        email_verified: Boolean(user[0].email_verified),
        license_type: user[0].license_type,
        referral_code: user[0].referral_code,
        setup_count: setupCount,
        created_at: user[0].created_at
      }
    });

  } catch (error: any) {
    console.error('Get user error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get user info' 
      },
      { status: 500 }
    );
  }
}