#!/bin/bash
# dev.sh - One command to rule them all

echo "🚀 Starting development environment..."

# Kill anything already running on ports 8788 and 3000
lsof -ti:8788,3000 | xargs kill -9 2>/dev/null

# Step 1: Start Next.js in dev mode (for CSS hot reload)
echo "📦 Starting Next.js dev server on port 3000..."
npm run dev &
NEXT_PID=$!

# Wait for Next.js to start
sleep 5

# Step 2: Start Wrangler as a proxy to Next.js with D1 support
echo "⚡ Starting Wrangler with D1 on port 8788..."
npx wrangler pages dev --proxy 3000 \
  --d1 DB=mpintellect-db \
  --persist-to=./.wrangler/state \
  --compatibility-flags=nodejs_compat \
  --port 8788

# Cleanup on exit
kill $NEXT_PID 2>/dev/null
