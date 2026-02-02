// functions/api/auth/login.ts

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

export async function onRequestPost(context: any) {
  const { request } = context;

  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email and password are required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
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
      setup_count: number;
    }>(
      'SELECT id, email, display_name, photo_url, email_verified, license_type, setup_count FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (users.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid credentials' }),
        { 
          status: 401, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }

    const user = users[0];

    // Get password hash
    const passwords = await query<{ password_hash: string }>(
      'SELECT password_hash FROM user_passwords WHERE user_id = ? LIMIT 1',
      [user.id]
    );

    if (passwords.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid credentials' }),
        { 
          status: 401, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }

    // Verify password
    const hashedPassword = await hashPassword(password);
    if (hashedPassword !== passwords[0].password_hash) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid credentials' }),
        { 
          status: 401, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
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
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          display_name: user.display_name,
          photo_url: user.photo_url,
          license_type: user.license_type,
          email_verified: Boolean(user.email_verified),
          setup_count: user.setup_count || 0
        },
        token,
        sessionId
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );

  } catch (error: any) {
    console.error('Login error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Login failed' 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }
}