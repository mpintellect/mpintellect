// functions/api/user/use-setup.ts - FIXED (No atob error)
export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const authHeader = request.headers.get('Authorization');
    console.log('🔍 use-setup called, auth header:', authHeader?.substring(0, 30) + '...');

    if (!authHeader) {
      return Response.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    let targetUserId: string | null = null;
    
    // SIMPLIFIED: Just get userId from request body
    try {
      const body = await request.json();
      targetUserId = body.userId;
      console.log('📝 UserId from request body:', targetUserId);
    } catch (error) {
      console.error('❌ Failed to parse request body:', error);
    }

    // If no userId in body, try to extract from token (simple UUID only)
    if (!targetUserId && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log('🔑 Checking session for token:', token.substring(0, 20) + '...');
      
      // Look up session in database
      const session = await env.DB.prepare(
        'SELECT user_id FROM sessions WHERE id = ? AND expires_at > datetime("now")'
      ).bind(token).first();
      
      if (session) {
        targetUserId = session.user_id;
        console.log('✅ Found session for user:', targetUserId);
      } else {
        console.warn('⚠️ No valid session found for token');
      }
    }

    if (!targetUserId) {
      return Response.json(
        { 
          success: false, 
          error: 'User ID required. Please provide userId in request body.' 
        },
        { status: 400 }
      );
    }

    console.log('📊 Using setup for user:', targetUserId);

    // Check current setup count
    const user = await env.DB.prepare(
      'SELECT id, email, setup_count FROM users WHERE id = ?'
    ).bind(targetUserId).first();

    if (!user) {
      console.error('❌ User not found:', targetUserId);
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('👤 User found:', user.email, 'Setup count:', user.setup_count);

    const setupCount = user.setup_count || 0;
    
    if (setupCount <= 0) {
      console.log('❌ User has no setup credits');
      return Response.json(
        { 
          success: false, 
          error: 'no-credits',
          message: 'No setup credits available. Please purchase more setups.' 
        },
        { status: 400 }
      );
    }

    // Deduct one setup
    const result = await env.DB.prepare(
      'UPDATE users SET setup_count = setup_count - 1, updated_at = ? WHERE id = ?'
    ).bind(new Date().toISOString(), targetUserId).run();

    if (result.success) {
      console.log('✅ Setup deducted. Remaining:', setupCount - 1);
      
      return Response.json({
        success: true,
        message: 'Setup used successfully',
        remaining: setupCount - 1,
        user: {
          id: user.id,
          email: user.email,
          setup_count: setupCount - 1
        }
      });
    } else {
      console.error('❌ Database update failed');
      return Response.json(
        { success: false, error: 'Failed to update setup count' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('❌ Use setup error:', error);
    return Response.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}