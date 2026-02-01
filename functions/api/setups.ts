// functions/api/setups.ts (Move from app/api/setups/route.ts)

import { query, execute } from '../../backend-lib/db-simple';

// Simple token verification helper
function getUserIdFromToken(token: string): string | null {
  try {
    const cleanToken = token.replace('Bearer ', '').replace('cf_', '');
    const decoded = JSON.parse(atob(cleanToken));
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

/**
 * POST: Save a new trading setup
 */
export async function onRequestPost(context: any) {
  const { request } = context; // FIXED: request is part of context

  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return Response.json({ success: false, error: 'No token provided' }, { status: 401 });
    }

    const userId = getUserIdFromToken(authHeader);
    if (!userId) {
      return Response.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const {
      symbol,
      entry_price,
      take_profit,
      stop_loss,
      capital,
      lot_size,
      risk_reward
    } = body;

    // Validation
    if (!symbol || !entry_price || !capital) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const setupId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    // Save to D1 SQL
    const result = await execute(
      `INSERT INTO setups (
        id, user_id, symbol, entry_price, take_profit, stop_loss,
        capital, lot_size, risk_reward, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        setupId,
        userId,
        symbol,
        entry_price,
        take_profit || null,
        stop_loss || null,
        capital,
        lot_size || null,
        risk_reward || 1.0,
        'active',
        now,
        now
      ]
    );

    if (result.success) {
      return Response.json({ success: true, setupId, message: 'Setup saved' });
    } else {
      throw new Error("D1 execution failed");
    }

  } catch (error: any) {
    console.error('Save setup error:', error);
    return Response.json({ success: false, error: 'Failed to save setup' }, { status: 500 });
  }
}

/**
 * GET: Retrieve user's setups
 */
export async function onRequestGet(context: any) {
  const { request } = context; // FIXED: request is part of context

  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return Response.json({ success: false, error: 'No token provided' }, { status: 401 });
    }

    const userId = getUserIdFromToken(authHeader);
    if (!userId) {
      return Response.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Query from D1 SQL
    const setups = await query(
      `SELECT * FROM setups 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    return Response.json({
      success: true,
      setups,
      count: setups.length
    });

  } catch (error: any) {
    console.error('Get setups error:', error);
    return Response.json({ success: false, error: 'Failed to retrieve setups' }, { status: 500 });
  }
}