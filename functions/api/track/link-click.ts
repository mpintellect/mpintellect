// app/api/track/link-click/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb, execute } from "@/backend-lib/db-simple";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get('email');
  const url = searchParams.get('url');
  const campaignId = searchParams.get('campaign_id');
  const userId = searchParams.get('user_id');
  
  if (email && url) {
    try {
      const db = getDb();
      if (db) {
        await execute(`
          INSERT INTO link_clicks 
          (email, url, campaign_id, user_id, clicked_at, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          email,
          url,
          campaignId || null,
          userId || null,
          Date.now(),
          Date.now()
        ]);
        
        console.log(`🔗 Link Clicked: ${email} -> ${url}`);
      }
    } catch (e) {
      console.error("Link click tracking error", e);
    }
  }
  
  // Redirect to the actual URL
  if (url) {
    return NextResponse.redirect(url);
  }
  
  return NextResponse.redirect('/');
}