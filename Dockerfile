# path: Dockerfile
FROM node:20-alpine

WORKDIR /app

# For HEALTHCHECK
RUN apk add --no-cache curl

# Copy manifest(s) first for better caching
COPY package.json package-lock.json* ./

# Install deps (prefer lockfile)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy the rest of the project
COPY . .

# Build only if a build script exists (works for Next.js/Vite/Express)
RUN node -e "const p=require('./package.json'); process.exit(!(p.scripts && p.scripts.build));" || npm run build

# Keep only production deps
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --prefer-offline --no-audit --no-fund; else npm install --omit=dev --prefer-offline --no-audit --no-fund; fi

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000

# App must return 200 on /api/health
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1

# Run as non-root
USER node

# Start via package.json "start" script
CMD ["npm", "start"]
