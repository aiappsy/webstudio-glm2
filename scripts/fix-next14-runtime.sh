#!/usr/bin/env sh
set -e

# Run this from the REPO ROOT.
echo "🔧 Fixing Next.js runtime declarations..."

# 4a) Convert deprecated `export const config = { runtime: "edge" }` to `export const runtime = "edge"`
# Handles both single and double quotes and optional whitespace.
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.mjs" | while read -r f; do
  sed -E -i 's/export\s+const\s+config\s*=\s*\{\s*runtime\s*:\s*"edge"\s*\}\s*;?/export const runtime = "edge";/g' "$f" || true
  sed -E -i "s/export\s+const\s+config\s*=\s*\{\s*runtime\s*:\s*'edge'\s*\}\s*;?/export const runtime = 'edge';/g" "$f" || true
done

# 4b) Replace invalid runtime 'node' with 'nodejs' (Next 14 expects 'nodejs')
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.mjs" | while read -r f; do
  sed -E -i 's/export\s+const\s+runtime\s*=\s*"node"/export const runtime = "nodejs"/g' "$f" || true
  sed -E -i "s/export\s+const\s+runtime\s*=\s*'node'/export const runtime = 'nodejs'/g" "$f" || true
done

echo "✅ Done. Commit the changes and redeploy."
