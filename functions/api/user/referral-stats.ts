// functions/api/user/referral-stats.ts - FIXED
export async function onRequestGet(context: any) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    console.log('🔍 referral-stats called for user:', userId);

    if (!userId) {
      return Response.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get referral count - USING env.DB
    const referralResult = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ?'
    ).bind(userId).first();

    // Get user's referral code - USING env.DB
    const userResult = await env.DB.prepare(
      'SELECT referral_code FROM users WHERE id = ?'
    ).bind(userId).first();

    const stats = {
      success: true,
      referralCount: referralResult?.count || 0,
      referralCode: userResult?.referral_code || null,
      referralLink: userResult?.referral_code 
        ? `https://mpintellect.com/client/register?ref=${userResult.referral_code}`
        : null
    };

    console.log('✅ Referral stats:', stats);

    return Response.json(stats);

  } catch (error: any) {
    console.error('❌ Get referral stats error:', error);
    
    return Response.json(
      { 
        success: false, 
        error: 'Failed to get referral stats' 
      },
      { status: 500 }
    );
  }
}