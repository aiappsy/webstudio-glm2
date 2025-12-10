# path: Dockerfile
FROM node:20-alpine

WORKDIR /app

# Needed for HEALTHCHECK (previously missing)
RUN apk add --no-cache curl

# Install deps first for better caching
COPY package.json package-lock.json* ./
# Full install (includes dev deps for build)
RUN npm ci

# Copy the rest of the app
COPY . .

# Build only if a build script exists (keeps Express apps working)
# Why: some apps don't have a build step; this won't fail them.
RUN node -e "const p=require('./package.json'); process.exit(!(p.scripts && p.scripts.build));" || npm run build

# Reinstall prod-only deps after build to slim image
RUN npm ci --omit=dev --prefer-offline --no-audit --no-fund

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000

# Healthcheck: expects your app to serve 200 OK here
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1

# Drop privileges
USER node

# Start via package.json "start" script
CMD ["npm", "start"]
