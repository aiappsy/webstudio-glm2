// src/app/api/ws/agent/preview/route.ts
// Temporary stub to satisfy Next.js 14 build by using modern route-segment config.
// Replace this handler with your original implementation if needed.

import { NextResponse } from 'next/server';

// Old: export const config = { runtime: 'edge' }
// New (supported): use separate top-level exports
export const runtime = 'edge';
// export const preferredRegion = ['iad1', 'cdg1']; // uncomment if you used regions
// export const maxDuration = 60;                   // uncomment if you used maxDuration

export async function GET() {
  return NextResponse.json({ ok: true, note: 'stub preview route — replace with your original logic' });
}

export async function POST() {
  return NextResponse.json({ ok: true, note: 'stub preview route — replace with your original logic' });
}
