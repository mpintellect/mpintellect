// app/api/user/referral-stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../../../app/lib/cloudflare/db-simple';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get referral count
    const referralCount = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ?',
      [userId]
    );

    // Get user's referral code
    const userCode = await query<{ referral_code: string }>(
      'SELECT referral_code FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    return NextResponse.json({
      success: true,
      referralCount: referralCount[0]?.count || 0,
      referralCode: userCode[0]?.referral_code || null
    });

  } catch (error: any) {
    console.error('Get referral stats error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get referral stats' 
      },
      { status: 500 }
    );
  }
}