// functions/api/user/trial-status.ts - FIXED
export async function onRequestGet(context: any) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    console.log('🔍 trial-status called for user:', userId);

    if (!userId) {
      return Response.json({ 
        success: false, 
        error: "User ID is required" 
      }, { status: 400 });
    }

    // Get user data - USING env.DB
    const user = await env.DB.prepare(
      "SELECT setup_count, trial_count, license_type, created_at FROM users WHERE id = ?"
    ).bind(userId).first();

    if (!user) {
      return Response.json({ 
        success: false, 
        error: "User not found" 
      }, { status: 404 });
    }

    const trialCount = user.trial_count || 0;
    const maxTrials = 2;
    const remaining = Math.max(0, maxTrials - trialCount);
    const available = remaining > 0;
    const setupCount = user.setup_count || 0;

    return Response.json({
      success: true,
      available,
      remaining,
      used: trialCount,
      maxTrials,
      licenseType: user.license_type || 'free',
      setup_count: setupCount,
      createdAt: user.created_at
    });
  } catch (error: any) {
    console.error('❌ Trial status error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return Response.json({ 
        success: false, 
        error: "User ID is required" 
      }, { status: 400 });
    }

    // Get current count - USING env.DB
    const user = await env.DB.prepare(
      "SELECT trial_count FROM users WHERE id = ?"
    ).bind(userId).first();

    const currentCount = user?.trial_count || 0;
    
    // Update trial count - USING env.DB
    await env.DB.prepare(
      "UPDATE users SET trial_count = ?, updated_at = ? WHERE id = ?"
    ).bind(currentCount + 1, new Date().toISOString(), userId).run();

    return Response.json({ 
      success: true,
      newCount: currentCount + 1,
      message: "Trial count incremented"
    });
  } catch (error: any) {
    console.error('❌ Increment trial error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}