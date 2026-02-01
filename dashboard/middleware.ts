import { NextResponse } from '@/landing/node_modules/next/server';

// NEXT.JS 16 FIX: Changed from 'edge' to 'experimental-edge'
export const runtime = 'experimental-edge';

export function middleware() {
  return NextResponse.next();
}