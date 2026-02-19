// functions/api/referral/redeem.ts
export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json();
    // FIX: The frontend sends { userId, code } not { userId, referralCode }
    const { userId, code } = body;
    
    console.log("🎁 Redeem request:", { userId, code });

    if (!userId || !code) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing userId or code" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if user is trying to use their own code
    const user = await env.DB.prepare(
      "SELECT referral_code FROM users WHERE id = ?"
    ).bind(userId).first();

    if (user && user.referral_code === code) {
      return new Response(
        JSON.stringify({ success: false, error: "You cannot use your own referral code" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the referrer
    const referrer = await env.DB.prepare(
      "SELECT id FROM users WHERE referral_code = ?"
    ).bind(code).first();

    if (!referrer) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid referral code" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if this referral was already used
    const existing = await env.DB.prepare(
      "SELECT id FROM referrals WHERE referred_id = ?"
    ).bind(userId).first();

    if (existing) {
      return new Response(
        JSON.stringify({ success: false, error: "Referral already used" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const now = new Date().toISOString().replace('T', ' ').replace('Z', '');

    // Create referral record
    await env.DB.prepare(
      `INSERT INTO referrals (referrer_id, referred_id, status, created_at)
       VALUES (?, ?, 'completed', ?)`
    ).bind(referrer.id, userId, now).run();

    // Give referrer +5 setups
    await env.DB.prepare(
      "UPDATE users SET setup_count = setup_count + 5, updated_at = ? WHERE id = ?"
    ).bind(now, referrer.id).run();

    // Give user +5 setups
    await env.DB.prepare(
      "UPDATE users SET setup_count = setup_count + 5, updated_at = ? WHERE id = ?"
    ).bind(now, userId).run();

    // Get updated setup count
    const updatedUser = await env.DB.prepare(
      "SELECT setup_count FROM users WHERE id = ?"
    ).bind(userId).first();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Referral code redeemed successfully! You received 5 setup credits.",
        newSetupCount: updatedUser.setup_count
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("💥 Referral redemption error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to redeem referral code" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}