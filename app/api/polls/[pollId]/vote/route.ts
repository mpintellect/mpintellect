import { NextRequest, NextResponse } from "next/server";
import { getDB, queryOne } from "@/app/lib/cloudflare/db-simple";

export async function POST(
  request: NextRequest,
  { params }: { params: { pollId: string } }
) {
  try {
    const pollId = params.pollId;
    const { vote, userId, userName } = await request.json();
    
    if (!pollId || !vote || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!['low', 'medium', 'high'].includes(vote)) {
      return NextResponse.json(
        { success: false, error: "Invalid vote type" },
        { status: 400 }
      );
    }

    const db = getDB();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not available" },
        { status: 500 }
      );
    }

    // Check if user has already voted
    const existingVote = await queryOne(
      `SELECT id FROM poll_votes WHERE poll_id = ? AND user_id = ?`,
      [pollId, userId]
    );

    if (existingVote) {
      return NextResponse.json(
        { success: false, error: "You have already voted on this poll" },
        { status: 400 }
      );
    }

    // Get or create poll
    let poll = await queryOne(
      `SELECT * FROM market_polls WHERE id = ?`,
      [pollId]
    );

    const now = new Date().toISOString();
    
    if (!poll) {
      // Create new poll
      await db.prepare(
        `INSERT INTO market_polls (
          id, votes_low, votes_medium, votes_high, total_votes,
          question, symbol, category, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        pollId,
        vote === 'low' ? 1 : 0,
        vote === 'medium' ? 1 : 0,
        vote === 'high' ? 1 : 0,
        1,
        'Question from news item', // You can pass this from client
        'SYMBOL', // You can pass this from client
        'Category', // You can pass this from client
        now,
        now
      ).run();
    } else {
      // Update existing poll
      const voteColumn = `votes_${vote}`;
      await db.prepare(
        `UPDATE market_polls 
         SET ${voteColumn} = ${voteColumn} + 1, 
             total_votes = total_votes + 1,
             updated_at = ?
         WHERE id = ?`
      ).bind(now, pollId).run();
    }

    // Record user vote
    const voteId = crypto.randomUUID();
    await db.prepare(
      `INSERT INTO poll_votes (id, poll_id, user_id, user_name, vote, voted_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(voteId, pollId, userId, userName || 'Anonymous', vote, now).run();

    // Get updated poll stats
    poll = await queryOne(
      `SELECT * FROM market_polls WHERE id = ?`,
      [pollId]
    );

    return NextResponse.json({
      success: true,
      message: "Vote recorded successfully",
      poll: {
        votes: {
          low: poll?.votes_low || 0,
          medium: poll?.votes_medium || 0,
          high: poll?.votes_high || 0
        },
        total_votes: poll?.total_votes || 0
      }
    });
  } catch (error) {
    console.error("Error recording vote:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record vote" },
      { status: 500 }
    );
  }
}