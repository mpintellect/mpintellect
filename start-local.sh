#!/bin/bash
# start-dev.sh

# Watch for changes and rebuild
echo "🏗️ Watching for changes and rebuilding..."
npm run pages:build -- --watch &

# Store the watch process ID
WATCH_PID=$!

# Serve with live reload
echo "🚀 Starting local development server on http://localhost:8788..."
npx wrangler pages dev out --d1 DB=mzprimer-db --persist-to=./.wrangler/state/v3 --compatibility-flags=nodejs_compat --port 8788 --live-reload

# Kill the watch process when done
kill $WATCH_PID