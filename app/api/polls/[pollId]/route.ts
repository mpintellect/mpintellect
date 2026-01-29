import { NextRequest, NextResponse } from "next/server";
import { getDB, queryOne } from "@/app/lib/cloudflare/db-simple";

export async function GET(
  request: NextRequest,
  { params }: { params: { pollId: string } }
) {
  try {
    const pollId = params.pollId;
    
    if (!pollId) {
      return NextResponse.json(
        { success: false, error: "Poll ID is required" },
        { status: 400 }
      );
    }

    // Get poll from D1
    const poll = await queryOne(
      `SELECT * FROM market_polls WHERE id = ?`,
      [pollId]
    );

    if (!poll) {
      // Create default poll if doesn't exist
      return NextResponse.json({
        success: true,
        poll: {
          id: pollId,
          votes: { low: 0, medium: 0, high: 0 },
          total_votes: 0,
          created_at: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({
      success: true,
      poll: {
        id: poll.id,
        votes: {
          low: poll.votes_low || 0,
          medium: poll.votes_medium || 0,
          high: poll.votes_high || 0
        },
        total_votes: poll.total_votes || 0,
        question: poll.question,
        symbol: poll.symbol,
        category: poll.category,
        created_at: poll.created_at,
        updated_at: poll.updated_at
      }
    });
  } catch (error) {
    console.error("Error fetching poll:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch poll" },
      { status: 500 }
    );
  }
}