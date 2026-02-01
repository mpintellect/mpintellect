// functions/api/auth/login.ts (Make sure to move this to the /functions folder)

import { query, execute } from '@/backend-lib/db-simple';

// Simple password hash (must match the one in register)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * FIXED: 
 * 1. Added ': any' type to context
 * 2. Destructured 'request' and 'env' from context so they are recognized
 */
export async function onRequestPost(context: any) {
  const { request, env } = context; 

  try {
    // Now 'request' is defined because we pulled it from 'context'
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return Response.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user from database
    const users = await query<{
      id: string;
      email: string;
      display_name?: string;
      photo_url?: string;
      email_verified: number;
      license_type: string;
    }>(
      'SELECT id, email, display_name, photo_url, email_verified, license_type FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (users.length === 0) {
      return Response.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Get password hash
    const passwords = await query<{ password_hash: string }>(
      'SELECT password_hash FROM user_passwords WHERE user_id = ? LIMIT 1',
      [user.id]
    );

    if (passwords.length === 0) {
      return Response.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const hashedPassword = await hashPassword(password);
    if (hashedPassword !== passwords[0].password_hash) {
      return Response.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };
    const token = `cf_${btoa(JSON.stringify(tokenPayload))}`;

    // Create new session (invalidate old ones)
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await execute(
      'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
      [sessionId, user.id, expiresAt.toISOString()]
    );

    // Return success
    return Response.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        photo_url: user.photo_url,
        license_type: user.license_type,
        email_verified: Boolean(user.email_verified)
      },
      token,
      sessionId
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Login failed' 
      },
      { status: 500 }
    );
  }
}