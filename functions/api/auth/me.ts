// functions/api/auth/me.ts - FIXED (NO atob)
export async function onRequestGet(context: any) {
  const { request, env } = context;

  try {
    const authHeader = request.headers.get('Authorization');
    console.log('🔍 /api/auth/me called, auth header:', authHeader?.substring(0, 30) + '...');

    if (!authHeader) {
      console.log('❌ No auth header');
      return Response.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    let token: string;
    let userId: string | undefined;

    // Extract token
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = authHeader;
    }

    console.log('🔑 Token extracted:', token.substring(0, 20) + '...');

    // Check if token is UUID (not cf_ encoded)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);
    
    if (!isUuid) {
      console.error('❌ Token is not UUID format');
      return Response.json(
        { success: false, error: 'Invalid token format' },
        { status: 401 }
      );
    }

    // Look up session in database
    const session = await env.DB.prepare(
      'SELECT user_id, expires_at FROM sessions WHERE id = ? AND expires_at > datetime("now")'
    ).bind(token).first();

    if (!session) {
      console.log('❌ No valid session found');
      return Response.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    userId = session.user_id;
    console.log('✅ Valid session for user:', userId);

    // Get user data
    const user = await env.DB.prepare(
      'SELECT id, email, display_name, setup_count, license_type, referral_code FROM users WHERE id = ?'
    ).bind(userId).first();

    if (!user) {
      console.error('❌ User not found in database');
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        setup_count: user.setup_count || 0,
        license_type: user.license_type || 'free',
        referral_code: user.referral_code
      }
    });

  } catch (error: any) {
    console.error('❌ /api/auth/me error:', error);
    return Response.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}