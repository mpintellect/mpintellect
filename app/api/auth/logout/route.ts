// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { execute } from '@/app/lib/cloudflare/db-simple';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (sessionId) {
      // Delete session from database
      await execute(
        'DELETE FROM sessions WHERE id = ?',
        [sessionId]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error: any) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Logout failed' 
      },
      { status: 500 }
    );
  }
}