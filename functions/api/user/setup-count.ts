// functions/api/user/setup-count.ts - FIXED
export async function onRequestGet(context: any): Promise<Response> {
  const { request, env } = context;

  try {
    console.log('🔍 setup-count called');
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Try to get userId from token
    let targetUserId = userId;
    if (!targetUserId) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader) {
        console.log('🔑 Auth header found, extracting userId...');
        
        if (authHeader.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1];
          // Check sessions table
          const session = await env.DB.prepare(
            'SELECT user_id FROM sessions WHERE id = ? AND expires_at > datetime("now")'
          ).bind(token).first();
          if (session) {
            targetUserId = session.user_id;
          }
        } else if (authHeader.startsWith('cf_')) {
          try {
            const decoded = atob(authHeader.substring(3));
            const payload = JSON.parse(decoded);
            targetUserId = payload.userId;
          } catch (error) {
            console.error('Failed to decode cf_ token:', error);
          }
        }
      }
    }

    if (!targetUserId) {
      console.error('❌ No user ID found');
      return Response.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    console.log('📊 Getting setup count for user:', targetUserId);

    // Get setup count - USING env.DB
    const user = await env.DB.prepare(
      'SELECT setup_count, license_type FROM users WHERE id = ?'
    ).bind(targetUserId).first();

    if (!user) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ Setup count:', user.setup_count || 0);

    return Response.json({
      success: true,
      setupCount: user.setup_count || 0,
      licenseType: user.license_type || 'free'
    });

  } catch (error: any) {
    console.error('❌ Get setup count error:', error);
    
    return Response.json(
      { 
        success: false, 
        error: 'Failed to get setup count' 
      },
      { status: 500 }
    );
  }
}