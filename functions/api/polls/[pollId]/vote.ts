const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export async function onRequest(context: any) {
  const { request, env, params } = context;
  const pollId = params.pollId;

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: HEADERS });

  try {
    const { vote, userId, userName } = await request.json();

    const voteCol = `votes_${vote}`; // matches votes_high, votes_medium, votes_low
    const now = new Date().toISOString();

    await env.DB.batch([
      // 1. Create poll row if missing
      env.DB.prepare(`
        INSERT OR IGNORE INTO market_polls (id, created_at, updated_at, total_votes, votes_low, votes_medium, votes_high) 
        VALUES (?, ?, ?, 0, 0, 0, 0)
      `).bind(pollId, now, now),
      
      // 2. Increment count
      env.DB.prepare(`
        UPDATE market_polls 
        SET ${voteCol} = ${voteCol} + 1, total_votes = total_votes + 1, updated_at = ? 
        WHERE id = ?
      `).bind(now, pollId),
      
      // 3. Record individual vote (Public or Member)
      env.DB.prepare(`
        INSERT INTO poll_votes (id, poll_id, user_id, user_name, vote, voted_at) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(crypto.randomUUID(), pollId, userId, userName, vote, now)
    ]);

    const poll: any = await env.DB.prepare("SELECT * FROM market_polls WHERE id = ?").bind(pollId).first();

    return new Response(JSON.stringify({
      success: true,
      poll: {
        votes: { low: poll.votes_low, medium: poll.votes_medium, high: poll.votes_high },
        total_votes: poll.total_votes
      }
    }), { status: 200, headers: HEADERS });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: HEADERS });
  }
}