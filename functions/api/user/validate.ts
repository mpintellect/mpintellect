// functions/api/user/validate.ts - Helper function
export async function validateUserToken(request: Request, env: any): Promise<{success: boolean, userId?: string, error?: string}> {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return { success: false, error: 'No authorization header' };
    }

    console.log('🔑 Validating token:', authHeader.substring(0, 30) + '...');

    let userId: string | undefined;

    // Handle Bearer token (UUID)
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const session = await env.DB.prepare(
        'SELECT user_id FROM sessions WHERE id = ? AND expires_at > datetime("now")'
      ).bind(token).first();
      
      if (session) {
        userId = session.user_id;
        console.log('✅ Validated via session token');
      }
    }
    // Handle cf_ encoded token
    else if (authHeader.startsWith('cf_')) {
      try {
        const decoded = atob(authHeader.substring(3));
        const payload = JSON.parse(decoded);
        userId = payload.userId;
        
        // Verify user exists
        const user = await env.DB.prepare(
          'SELECT id FROM users WHERE id = ?'
        ).bind(userId).first();
        
        if (!user) {
          return { success: false, error: 'Invalid user in token' };
        }
        
        console.log('✅ Validated via cf_ token');
      } catch (error) {
        console.error('❌ Failed to decode cf_ token:', error);
        return { success: false, error: 'Invalid token format' };
      }
    }
    // Handle raw token (UUID without Bearer)
    else {
      const token = authHeader;
      const session = await env.DB.prepare(
        'SELECT user_id FROM sessions WHERE id = ? AND expires_at > datetime("now")'
      ).bind(token).first();
      
      if (session) {
        userId = session.user_id;
        console.log('✅ Validated via raw token');
      }
    }

    if (!userId) {
      return { success: false, error: 'Invalid or expired token' };
    }

    return { success: true, userId };
  } catch (error) {
    console.error('❌ Token validation error:', error);
    return { success: false, error: 'Token validation failed' };
  }
}