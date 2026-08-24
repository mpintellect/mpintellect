#!/bin/bash
# dev.sh - One command to rule them all

echo "🚀 Starting development environment..."

# Kill anything already running on ports 8788 and 3000
lsof -ti:8788,3000 | xargs kill -9 2>/dev/null

# Step 1: Start Next.js in dev mode
echo "📦 Starting Next.js dev server on port 3000..."
LOCAL_API=true npm run dev &
NEXT_PID=$!

# Wait for Next.js to start
sleep 5

# Step 2: Start Wrangler in LOCAL mode (no Cloudflare API call)
# `wrangler pages dev` rejects --config with a custom path ("Pages does not
# support custom paths for the Wrangler configuration file"), so instead of
# pointing at a separate wrangler.local.json we swap the real wrangler.json
# in place for the duration of this script: drop the BROWSER binding and
# the KV namespace's remote:true flag, both of which force a remote proxy
# session even with --local and crash the dev server if that session can't
# be established. Restored via the EXIT trap below no matter how this
# script ends (Ctrl+C included).
cp wrangler.json wrangler.json.bak
node -e "
  const fs = require('fs');
  const cfg = JSON.parse(fs.readFileSync('wrangler.json', 'utf8'));
  delete cfg.browser;
  (cfg.kv_namespaces || []).forEach((kv) => delete kv.remote);
  fs.writeFileSync('wrangler.json', JSON.stringify(cfg, null, 2) + '\n');
"

cleanup() {
  kill $NEXT_PID 2>/dev/null
  mv wrangler.json.bak wrangler.json
}
trap cleanup EXIT

echo "⚡ Starting Wrangler on port 8788..."
npx wrangler pages dev ./functions --port 8788 --local --compatibility-flags=nodejs_compat