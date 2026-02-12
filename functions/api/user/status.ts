import { getDB, queryOne } from '../../../backend-lib/db-simple';

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const email = url.searchParams.get('email');

  if (!userId && !email) {
    return new Response(
      JSON.stringify({ error: 'User ID or email required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const user = await queryOne<any>(
      `SELECT 
        id,
        email,
        license_type,
        license_key,
        license_expires_at,
        setup_count,
        display_name,
        username,
        CASE 
          WHEN license_type = 'pro' 
           AND (license_expires_at IS NULL OR datetime(license_expires_at) > datetime('now'))
          THEN 1
          ELSE 0
        END as has_valid_license
       FROM users 
       WHERE id = ? OR email = ?`,
      [userId || '', email || '']
    );

    if (!user) {
      return new Response(
        JSON.stringify({ 
          license: 'none',
          hasValidLicense: false,
          setupCount: 0
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({
        license: user.license_type || 'basic',
        licenseKey: user.license_key,
        licenseExpiresAt: user.license_expires_at,
        hasValidLicense: user.has_valid_license === 1,
        setupCount: user.setup_count || 0,
        userId: user.id,
        email: user.email,
        name: user.display_name || user.username || user.email
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('User status error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}