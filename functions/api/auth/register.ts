export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const { email, password, displayName } = await request.json();

    const cleanEmail = email.toLowerCase().trim();
    const token = crypto.randomUUID(); // Session ID

    const now = new Date().toISOString().replace('T', ' ').replace('Z', '');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '');

    console.log(`📝 [REG] Registering user: ${cleanEmail}`);

    // 🔍 CHECK IF USER ALREADY EXISTS (from guest purchase)
    const existingUser = await env.DB.prepare(
      "SELECT id, display_name FROM users WHERE email = ?"
    ).bind(cleanEmail).first();

    let userId;

    // Hash password (same for both insert and update)
    const encoder = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(password));
    const passwordHash = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    if (existingUser) {
      // ✅ CASE 1: User exists (from guest purchase) - UPDATE their record
      console.log(`✅ [REG] User exists from guest purchase, updating record...`);
      userId = existingUser.id;

      // Update user with registration data
      await env.DB.prepare(`
        UPDATE users 
        SET 
          display_name = COALESCE(?, display_name),
          updated_at = ?
        WHERE id = ?
      `).bind(displayName || existingUser.display_name, now, userId).run();

      // Update or insert password
      await env.DB.prepare(`
        INSERT OR REPLACE INTO user_passwords (user_id, password_hash)
        VALUES (?, ?)
      `).bind(userId, passwordHash).run();

      console.log(`✅ [REG] User updated: ${userId}`);

    } else {
      // ✅ CASE 2: New user - INSERT fresh record
      console.log(`✅ [REG] New user, creating record...`);
      userId = crypto.randomUUID();

      // Insert new user
      await env.DB.prepare(
        "INSERT INTO users (id, email, display_name, setup_count, created_at, updated_at) VALUES (?, ?, ?, 2, ?, ?)"
      ).bind(userId, cleanEmail, displayName || null, now, now).run();

      // Insert password
      await env.DB.prepare(
        "INSERT INTO user_passwords (user_id, password_hash) VALUES (?, ?)"
      ).bind(userId, passwordHash).run();

      console.log(`✅ [REG] New user created: ${userId}`);
    }

    // 3. Save Session (always create new session)
    await env.DB.prepare(
      "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
    ).bind(token, userId, expiresAt).run();

    console.log(`✅ [REG] Session saved to DB for: ${cleanEmail}`);
    console.log(`🎫 [REG] Token: ${token.substring(0, 8)}...`);

    // Get updated user data
    const user = await env.DB.prepare(
      "SELECT id, email, display_name, setup_count FROM users WHERE id = ?"
    ).bind(userId).first();

    return new Response(
      JSON.stringify({
        success: true,
        token,
        sessionId: token,
        user: {
          id: user.id,
          email: user.email,
          display_name: user.display_name,
          setup_count: user.setup_count
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
    
    // Check for unique constraint error (email already exists)
    if (error.message.includes('UNIQUE constraint failed')) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "This email is already registered. Please login instead." 
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}