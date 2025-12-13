// src/app/api/health/route.ts
import { NextResponse } from 'next/server';

// Use Node runtime here; you can switch to 'edge' if preferred
export const runtime = 'node';

export async function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
