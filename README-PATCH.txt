PATCH CONTENTS (drop-in)
========================

1) Added health endpoint:
   - src/app/api/health/route.ts   --> returns 200 for healthcheck

2) Updated deprecated config pattern for one App Router API route:
   - src/app/api/ws/agent/preview/route.ts
     Replaces `export const config = { runtime: 'edge' }` with `export const runtime = 'edge'`.
     This file is a stub handler that returns a simple JSON; replace with your original logic if needed.

3) Next.js config:
   - next.config.mjs  (use this; remove next.config.ts if it exists to avoid build failure)

4) Docker:
   - Dockerfile (multi-stage) compatible with Coolify health checks
   - .dockerignore

HOW TO USE
----------
- Delete any existing `next.config.ts` from your repo.
- Copy these files into the repo root, preserving paths.
- Commit and push.
- Coolify will build, run, and check /api/health.

NOTES
-----
- If you had custom logic in `src/app/api/ws/agent/preview/route.ts`, port it into the stub here
  and keep the top-level `export const runtime = 'edge'` plus any other segment-level exports
  (e.g., preferredRegion, maxDuration).
