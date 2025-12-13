# Dockerfile (root)
# Multi-stage: build → slim runtime
FROM node:20-alpine AS builder
WORKDIR /app

# Tools for health/debug (optional)
RUN apk add --no-cache curl

# 1) Install deps (tolerant to lockfile drift)
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

# 2) Copy source and build (Next.js App Router under src/)
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3) Prune dev deps; keep only production deps to copy over
RUN npm prune --omit=dev

# ------------------ RUNTIME ------------------
FROM node:20-alpine AS runner
WORKDIR /app

# curl is required by Coolify's healthcheck
RUN apk add --no-cache curl

# Copy only what's needed to run
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public 2>/dev/null || true
# copy config if present
COPY --from=builder /app/next.config.* ./ 2>/dev/null || true

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000

# Healthcheck must return 200 at /api/health
HEALTHCHECK --interval=30s --timeout=3s --retries=3   CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1

USER node
CMD ["npm", "start"]
