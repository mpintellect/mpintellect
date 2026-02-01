// functions/api/user/referral-stats.ts (Move from app/api/user/referral-stats/route.ts)

import { query } from '../../../landing/backend-lib/db-simple';

/**
 * FIXED: 
 * 1. Removed double parenthesis '))' error.
 * 2. Destructured 'request' from 'context'.
 * 3. Corrected import path (Functions are at project root).
 */
export async function onRequestGet(context: any) {
  const { request } = context;

  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return Response.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get referral count from D1
    const referralCount = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ?',
      [userId]
    );

    // Get user's referral code from D1
    const userCode = await query<{ referral_code: string }>(
      'SELECT referral_code FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    return Response.json({
      success: true,
      referralCount: referralCount[0]?.count || 0,
      referralCode: userCode[0]?.referral_code || null
    });

  } catch (error: any) {
    console.error('Get referral stats error:', error);
    
    return Response.json(
      { 
        success: false, 
        error: 'Failed to get referral stats' 
      },
      { status: 500 }
    );
  }
}