#!/bin/bash

# First, build the Next.js app to the 'out' directory
echo "🏗️ Building Next.js application..."
npm run pages:build

# Then serve it with wrangler
echo "🚀 Starting local development server on http://localhost:8788..."
npx wrangler pages dev out --d1 DB=mzprimer-db --persist-to=./.wrangler/state/v3 --compatibility-flags=nodejs_compat --port 8788