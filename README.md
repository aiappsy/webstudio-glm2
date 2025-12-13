# WebStudio GLM2 – Deploy Fix Pack (Coolify/Next.js 14)

This pack contains **only the files you need to add/overwrite** to get builds green on Coolify:

## Included
- `Dockerfile` – multi-stage build with App Router + Coolify healthcheck
- `next.config.mjs` – replaces any `next.config.ts` (unsupported by Next 14 build)
- `src/app/api/health/route.ts` – `/api/health` endpoint returns 200
- `scripts/fix-next14-runtime.sh` – converts deprecated `export const config = { runtime: ... }` and invalid `runtime = "node"` -> `runtime = "nodejs"`
- `.dockerignore`

## How to apply

1. **At your repo root**, unzip these files so that paths line up exactly.
2. If your repo has a `next.config.ts`, **delete it** (Next 14 build does not accept TS config). You now have `next.config.mjs` here.
3. Ensure your API health route exists at:
   ```
   src/app/api/health/route.ts
   ```
   (Provided in this pack.)
4. Run the runtime fix script once from repo root:
   ```bash
   bash scripts/fix-next14-runtime.sh
   ```
   This will:
   - Convert any `export const config = { runtime: "edge" }` to `export const runtime = "edge"` (required by Next 14).
   - Replace `export const runtime = "node"` with `export const runtime = "nodejs"`.
5. Commit and push:
   ```bash
   git add -A
   git commit -m "Fix: Next 14 build config, health endpoint, runtime declarations"
   git push
   ```
6. Redeploy in Coolify.

## Notes
- We are targeting the **main service (webstudio app)**, not the engine.
- If you still see build errors mentioning a specific file (e.g. `src/app/api/ws/agent/preview/route.ts`), open that file and verify it uses:
  - `export const runtime = "edge"` **or** `export const runtime = "nodejs"`
  - **Do not** use `export const config = { runtime: ... }` in Next 14 App Router.
