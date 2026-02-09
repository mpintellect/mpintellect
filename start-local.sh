#!/bin/bash

echo "🚀 Starting integrated dev server..."

# Kill existing
pkill -f "wrangler" 2>/dev/null
pkill -f "next" 2>/dev/null

# Start the combined server
npx wrangler pages dev ./public \
  --port 8789 \
  --proxy 3000 \
  --compatibility-flags=nodejs_compat \
  --d1 DB=mzprimer-db \
  --persist-to=./.wrangler/state \
  --command "npx next dev" &

# Wait for server to start
sleep 5

# Initialize database
echo "🗄️ Initializing database..."
curl -X POST http://localhost:8789/api/init-db

echo ""
echo "✅ READY!"
echo "👉 Frontend (hot reload): http://localhost:3000"
echo "👉 API server: http://localhost:8789"
echo "👉 Database: Included and persistent"
echo ""
echo "📝 Edit any file and refresh browser!"
echo "🛑 Press Ctrl+C in this terminal to stop"
echo ""

# Keep running
wait