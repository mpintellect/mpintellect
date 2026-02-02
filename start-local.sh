#!/bin/bash
# start-local.sh - Complete local development setup

echo "🚀 Starting MZPrimer Local Development..."

# 1. Clean everything
echo "🧹 Cleaning previous builds..."
rm -rf .next out .wrangler/state/v3

# 2. Build the app
echo "🔨 Building application..."
npm run build

# 3. Start Wrangler with D1
echo "🌐 Starting Wrangler Pages Dev Server on port 8788..."
echo ""
echo "⚠️  IMPORTANT: When server starts, open a NEW terminal and run:"
echo "   curl -X POST http://localhost:8788/init-db"
echo ""
echo "Then you can register at: http://localhost:8788/client/register"
echo ""

# Start the server (foreground, so you see logs)
npx wrangler pages dev out \
  --d1 DB=mzprimer-db \
  --compatibility-flags=nodejs_compat \
  --port 8788