export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const { email, password, displayName } = await request.json();

    const cleanEmail = email.toLowerCase().trim();
    const userId = crypto.randomUUID();
    const token = crypto.randomUUID(); // Session ID

    const now = new Date().toISOString().replace('T', ' ').replace('Z', '');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '');

    console.log(`📝 [REG] Registering user: ${cleanEmail}`);
    console.log(`🎫 [REG] Creating Token: ${token.substring(0, 8)}...`);

    // 1. Save User
    await env.DB.prepare(
      "INSERT INTO users (id, email, display_name, setup_count, created_at, updated_at) VALUES (?, ?, ?, 2, ?, ?)"
    ).bind(userId, cleanEmail, displayName || null, now, now).run();

    // 2. Save Password
    const encoder = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(password));
    const passwordHash = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    await env.DB.prepare(
      "INSERT INTO user_passwords (user_id, password_hash) VALUES (?, ?)"
    ).bind(userId, passwordHash).run();

    // 3. Save Session
    await env.DB.prepare(
      "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
    ).bind(token, userId, expiresAt).run();

    console.log(`✅ [REG] Session saved to DB for: ${cleanEmail}`);

    return new Response(
      JSON.stringify({
        success: true,         // ⭐ ALWAYS returned
        token,
        sessionId: token,      // ⭐ ALWAYS included
        user: {
          id: userId,
          email: cleanEmail,
          display_name: displayName,
          setup_count: 2
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );

  } catch (error: any) {
    console.error('💥 [REG] Crash:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}