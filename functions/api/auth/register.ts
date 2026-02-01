// functions/api/auth/register.ts (Move from app/api/auth/register/route.ts)

import { query, execute } from '@/backend-lib/db-simple';

// Generate random referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Simple password hash
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
 * 2. Destructured 'request' to solve the "Cannot find name request" error
 */
export async function onRequestPost(context: any) {
  const { request } = context;

  try {
    const { email, password, displayName, referralCode } = await request.json();

    // Validation
    if (!email || !password) {
      return Response.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (existingUser.length > 0) {
      return Response.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user
    const userId = crypto.randomUUID();
    const referralCodeGenerated = generateReferralCode();
    const now = new Date().toISOString();
    
    // Insert user with setup_count = 1 (free setup on registration)
    await execute(
      `INSERT INTO users (
        id, email, display_name, email_verified, license_type, 
        referral_code, setup_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, 
        email, 
        displayName || null, 
        0, // email_verified
        'free', 
        referralCodeGenerated,
        1, // setup_count (1 free setup)
        now, 
        now
      ]
    );

    // Hash and store password
    const passwordHash = await hashPassword(password);
    
    // Ensure passwords table exists
    await execute(
      `CREATE TABLE IF NOT EXISTS user_passwords (
        user_id TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      []
    );

    await execute(
      'INSERT INTO user_passwords (user_id, password_hash) VALUES (?, ?)',
      [userId, passwordHash]
    );

    // Handle referral if provided
    if (referralCode) {
      const referrerResult = await query<{id: string}>(
        'SELECT id FROM users WHERE referral_code = ? LIMIT 1',
        [referralCode]
      );
      
      if (referrerResult.length > 0) {
        // Ensure referrals table exists
        await execute(
          `CREATE TABLE IF NOT EXISTS referrals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            referrer_id TEXT,
            referred_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )`, []
        );

        // Create referral record
        await execute(
          'INSERT INTO referrals (referrer_id, referred_id) VALUES (?, ?)',
          [referrerResult[0].id, userId]
        );
        
        // Give referrer +5 setups
        await execute(
          'UPDATE users SET setup_count = setup_count + 5 WHERE id = ?',
          [referrerResult[0].id]
        );
      }
    }

    // Create token
    const tokenPayload = {
      userId,
      email,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };
    const token = `cf_${btoa(JSON.stringify(tokenPayload))}`;

    // Create session
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    // Ensure sessions table exists
    await execute(
      `CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        expires_at TEXT
      )`, []
    );

    await execute(
      'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
      [sessionId, userId, expiresAt.toISOString()]
    );

    // Return success
    return Response.json({
      success: true,
      user: {
        id: userId,
        email,
        display_name: displayName,
        license_type: 'free',
        email_verified: false,
        referral_code: referralCodeGenerated,
        setup_count: 1
      },
      token,
      sessionId
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    return Response.json(
      { 
        success: false, 
        error: error.message || 'Registration failed' 
      },
      { status: 500 }
    );
  }
}