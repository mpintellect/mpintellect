#!/bin/bash
echo "🚀 Initializing local database from schema..."
npx wrangler d1 execute mzprimer-db --local --file=./schema.sql --persist-to=./.wrangler/state/v3

echo "📦 Starting local development server..."
npx wrangler pages dev out --d1 DB=mzprimer-db --persist-to=./.wrangler/state/v3 --compatibility-flags=nodejs_compat --port 8788