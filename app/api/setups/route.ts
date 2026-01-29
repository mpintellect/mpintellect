// app/api/setups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { execute } from '@/app/lib/cloudflare/db-simple';

// Simple token verification
function getUserIdFromToken(token: string): string | null {
  try {
    const cleanToken = token.replace('Bearer ', '').replace('cf_', '');
    const decoded = JSON.parse(atob(cleanToken));
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const userId = getUserIdFromToken(authHeader);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const {
      symbol,
      entry_price,
      take_profit,
      stop_loss,
      capital,
      lot_size,
      risk_reward
    } = await request.json();

    // Validate required fields
    if (!symbol || !entry_price || !capital) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const setupId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    // Save setup to database
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
      return NextResponse.json({
        success: true,
        setupId,
        message: 'Setup saved successfully'
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to save setup' 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Save setup error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save setup' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve user's setups
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const userId = getUserIdFromToken(authHeader);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Query setups from database
    const { query } = await import('@/app/lib/cloudflare/db-simple');
    const setups = await query(
      `SELECT * FROM setups 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    return NextResponse.json({
      success: true,
      setups,
      count: setups.length
    });

  } catch (error: any) {
    console.error('Get setups error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve setups' 
      },
      { status: 500 }
    );
  }
}