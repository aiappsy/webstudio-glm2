# path: Dockerfile
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

# install deps
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# copy source
COPY . .

# build if script exists
RUN node -e "const p=require('./package.json'); process.exit(!(p.scripts && p.scripts.build));" || npm run build

# keep only prod deps
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --prefer-offline --no-audit --no-fund; else npm install --omit=dev --prefer-offline --no-audit --no-fund; fi

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1

USER node
CMD ["npm", "start"]
