// app/api/push/unsubscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb, execute } from '@/app/lib/cloudflare/db-simple';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { endpoint } = body;
    
    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: 'Missing endpoint' },
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
    
    const now = Date.now();
    
    // Mark subscription as inactive
    const result = await execute(`
      UPDATE push_subscriptions 
      SET status = 'inactive', updated_at = ?
      WHERE endpoint = ?
    `, [now, endpoint]);

    if (!result.success) {
      throw new Error('Failed to unsubscribe');
    }

    return NextResponse.json({
      success: true,
      message: 'Unsubscribed successfully'
    });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}