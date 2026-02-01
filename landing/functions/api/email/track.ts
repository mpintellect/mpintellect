// app/api/track/email-open/route.ts - CLOUDFLARE VERSION
import { NextRequest, NextResponse } from "next/server";
import { getDb, execute } from "@/landing/backend-lib/db-simple";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get('email');
  const type = searchParams.get('type') || 'daily_signal';
  const campaignId = searchParams.get('campaign_id');
  const userId = searchParams.get('user_id');
  
  if (email) {
    try {
      const db = getDb();
      if (!db) {
        console.warn('Database not available for email tracking');
      } else {
        // Store email open event in D1 database
        const result = await execute(`
          INSERT INTO email_opens 
          (email, type, campaign_id, user_id, user_agent, opened_at, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          email,
          type,
          campaignId || null,
          userId || null,
          req.headers.get("user-agent") || "unknown",
          Date.now(),
          Date.now()
        ]);
        
        if (result.success) {
          console.log(`📧 Email Opened: ${email} (${type})`);
          
          // Optional: Update user's last email engagement
          if (userId) {
            await execute(`
              UPDATE users 
              SET last_email_opened = ?, email_engagement_count = COALESCE(email_engagement_count, 0) + 1
              WHERE id = ?
            `, [Date.now(), userId]);
          }
        }
      }
    } catch (e) {
      console.error("Email tracking error", e);
    }
  }

  // Return a 1x1 transparent GIF (The "Pixel")
  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );

  return new NextResponse(pixel, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}

// Optional: Endpoint to get email open statistics
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, startDate, endDate, campaignId } = body;
    
    const db = getDb();
    if (!db) {
      return Response.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      );
    }
    
    let query = 'SELECT * FROM email_opens WHERE 1=1';
    const params: any[] = [];
    
    if (email) {
      query += ' AND email = ?';
      params.push(email);
    }
    
    if (campaignId) {
      query += ' AND campaign_id = ?';
      params.push(campaignId);
    }
    
    if (startDate) {
      query += ' AND opened_at >= ?';
      params.push(new Date(startDate).getTime());
    }
    
    if (endDate) {
      query += ' AND opened_at <= ?';
      params.push(new Date(endDate).getTime());
    }
    
    query += ' ORDER BY opened_at DESC LIMIT 1000';
    
    const { results } = await db.prepare(query).bind(...params).all();
    
    // Calculate statistics
    const stats = {
      totalOpens: results.length,
      uniqueEmails: [...new Set(results.map((r: any) => r.email))].length,
      opensByType: results.reduce((acc: any, curr: any) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
      }, {}),
      opensByCampaign: results.reduce((acc: any, curr: any) => {
        if (curr.campaign_id) {
          acc[curr.campaign_id] = (acc[curr.campaign_id] || 0) + 1;
        }
        return acc;
      }, {}),
      recentOpens: results.slice(0, 50)
    };
    
    return Response.json({
      success: true,
      stats,
      total: results.length,
      opens: results
    });
  } catch (error) {
    console.error('Error fetching email stats:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}