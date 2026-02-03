// functions/api/setups.ts

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    // 1. Get the token from the header
    const authHeader = request.headers.get('Authorization') || "";
    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    // 2. Verify Session in D1
    const session = await env.DB.prepare(
      "SELECT user_id FROM sessions WHERE id = ? AND expires_at > datetime('now')"
    ).bind(token).first();

    if (!session) {
      console.log('❌ Setups API: Session not found or expired');
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // 3. Parse the setup data from the body
    const body = await request.json();
    const { symbol, entry_price, take_profit, stop_loss, capital, lot_size, risk_reward } = body;

    const setupId = crypto.randomUUID();
    const now = new Date().toISOString();

    // 4. INSERT into D1 - Matches your schema exactly
    await env.DB.prepare(`
      INSERT INTO setups (
        id, user_id, symbol, entry_price, take_profit, stop_loss, 
        lot_size, capital, risk_reward, status, created_at, generated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `).bind(
      setupId, 
      session.user_id, 
      symbol, 
      entry_price || 0, 
      take_profit || 0, 
      stop_loss || 0, 
      lot_size || 0.01, 
      capital || 1000, 
      risk_reward || 1.5, 
      now, 
      now
    ).run();

    console.log(`✅ Setup saved for user: ${session.user_id}`);

    return new Response(JSON.stringify({ success: true, id: setupId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('💥 Setups API Crash:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}