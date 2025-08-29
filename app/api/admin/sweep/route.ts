// app/api/admin/sweep/route.ts
import { NextResponse } from 'next/server';
import { getOrder } from '../../../lib/orders';
import { sweepChildToMaster } from '../../../lib/sweep';

const ADMIN_KEY = process.env.ADMIN_API_KEY || '';

export async function POST(req: Request) {
  try {
    if (!ADMIN_KEY || (req.headers.get('x-admin-key') || '') !== ADMIN_KEY) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, amount } = await req.json();
    if (!orderId) return NextResponse.json({ ok: false, error: 'orderId required' }, { status: 400 });

    const order = getOrder(orderId);
    if (!order) return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });
    if (typeof order.depositIndex !== 'number') {
      return NextResponse.json({ ok: false, error: 'Order has no deposit index' }, { status: 400 });
    }

    const r = await sweepChildToMaster(order.depositIndex, amount);
    return NextResponse.json({ ok: true, ...r });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Sweep error' }, { status: 500 });
  }
}