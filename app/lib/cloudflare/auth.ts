// app/lib/cloudflare/auth.ts
export async function verifyCloudflareToken(token: string): Promise<any> {
  try {
    // Check if it's a JWT token from Cloudflare
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      return userData;
    }
    
    // Fallback: Check if it's a simple user ID (for backward compatibility)
    if (token.length === 36 || token.length === 28) { // UUID or short ID
      const { queryOne } = await import('../../../backend-lib/db-simple');
      const user = await queryOne(
        'SELECT * FROM users WHERE id = ? LIMIT 1',
        [token]
      );
      
      if (user) {
        return {
          id: user.id,
          email: user.email,
          displayName: user.display_name,
          email_verified: user.email_verified
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}