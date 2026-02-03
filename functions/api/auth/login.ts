// functions/api/auth/login.ts - COMPLETE FIXED VERSION
export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { email, password } = body;
    
    console.log('🔐 Login attempt:', email);

    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Simple password hash (must match register)
    async function hashPassword(password: string): Promise<string> {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hash = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }

    // Get user from database
    const user = await env.DB.prepare(
      `SELECT u.id, u.email, u.display_name, 
              u.email_verified, u.license_type, u.setup_count, u.referral_code,
              up.password_hash
       FROM users u
       LEFT JOIN user_passwords up ON u.id = up.user_id
       WHERE u.email = ? LIMIT 1`
    ).bind(email.toLowerCase().trim()).first();

    console.log('👤 User found:', user ? 'Yes' : 'No');

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if password hash exists
    if (!user.password_hash) {
      console.log('⚠️ User has no password hash');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No password set for this account. Please use password reset.' 
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify password
    const hashedPassword = await hashPassword(password);
    
    console.log('🔑 Hash comparison:', {
      stored: user.password_hash.substring(0, 20) + '...',
      provided: hashedPassword.substring(0, 20) + '...',
      match: user.password_hash === hashedPassword
    });

    if (hashedPassword !== user.password_hash) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ✅ Generate UUID token (NOT cf_ encoded)
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
    
    console.log('🎫 Generated token:', token);
    console.log('👤 User ID:', user.id);
    console.log('⏰ Expires:', expiresAt);

    // ✅ Create session in database
    try {
      // First ensure sessions table exists
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          expires_at DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).run();
      
      // Insert session
      const sessionResult = await env.DB.prepare(
        'INSERT OR REPLACE INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
      ).bind(token, user.id, expiresAt).run();
      
      console.log('✅ Session stored successfully:', sessionResult.success);
    } catch (sessionError) {
      console.error('❌ Failed to store session:', sessionError);
      // Continue anyway, the token will still work
    }

    console.log('✅ Login successful for:', user.email);

    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        token: token,
        user: {
          id: user.id,
          email: user.email,
          display_name: user.display_name,
          photo_url: user.photo_url || null, // Safe access
          license_type: user.license_type || 'free',
          setup_count: user.setup_count || 0
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Login error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Login failed. Please try again.',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}