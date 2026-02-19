// functions/api/download-robot.ts

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  console.log("📥 Download request for session:", sessionId);

  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Missing Session ID" }), { 
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Check if R2 binding exists
    if (!env.VAULT) {
      console.error("❌ R2 binding 'VAULT' is not configured");
      return new Response(JSON.stringify({ 
        error: "Storage not configured",
        details: "R2 bucket binding is missing"
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Check D1 Database
    console.log("🔍 Checking purchase in database...");
    const purchase: any = await env.DB.prepare(
      "SELECT status, price_id, user_id FROM stripe_purchases WHERE stripe_session_id = ?"
    ).bind(sessionId).first();

    console.log("Purchase found:", purchase);

    // 2. Security Check
    const SCALPER_PRICE_ID = "price_1S3JU6DoB4i1qeaLMYVILAMD";
    
    if (!purchase) {
      return new Response(JSON.stringify({ error: "Purchase not found" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (purchase.status !== 'completed') {
      return new Response(JSON.stringify({ error: "Payment not completed" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (purchase.price_id !== SCALPER_PRICE_ID) {
      return new Response(JSON.stringify({ error: "Invalid product" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Update user flag
    if (purchase.user_id) {
      await env.DB.prepare(
        "UPDATE users SET has_scalper_x1 = 1 WHERE id = ? OR email = ?"
      ).bind(purchase.user_id, purchase.user_id).run();
      console.log("✅ Updated user flag for:", purchase.user_id);
    }

    // 4. Try to get the file directly
    const fileName = "MZPrimer_Scalper_X1_V.1.ex5";
    console.log(`📦 Attempting to fetch: ${fileName}`);
    
    const file = await env.VAULT.get(fileName);

    if (!file) {
      console.log("❌ File not found. Listing all files...");
      
      // List all files for debugging
      let fileList: string[] = [];
      try {
        const objects = await env.VAULT.list();
        fileList = objects.objects.map((obj: any) => obj.key);
        console.log("Files in bucket:", fileList);
      } catch (listError: any) {
        console.error("Failed to list bucket:", listError.message);
      }
      
      return new Response(JSON.stringify({ 
        error: "Robot file not found in storage",
        available_files: fileList,
        requested_file: fileName
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log("✅ File found, streaming to client");

    // 5. Log the download
    try {
      await env.DB.prepare(`
        INSERT INTO download_logs (session_id, user_id, robot_name, ip_address, downloaded_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `).bind(
        sessionId,
        purchase.user_id || null,
        fileName,
        request.headers.get('CF-Connecting-IP') || 'unknown'
      ).run();
    } catch (logError: any) {
      console.error('Failed to log download:', logError.message);
    }

    // 6. Stream the file
    const headers = new Headers();
    file.writeHttpMetadata(headers);
    headers.set("Content-Type", "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");

    return new Response(file.body, { headers });

  } catch (error: any) {
    console.error("💥 Download error:", error);
    return new Response(JSON.stringify({ 
      error: "Server Error", 
      message: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}