#!/bin/bash

echo "🚀 Setting up Cloudflare Push Worker..."

# 1. Install Wrangler CLI if not installed
if ! command -v wrangler &> /dev/null; then
    echo "Installing Wrangler CLI..."
    npm install -g wrangler
fi

# 2. Login to Cloudflare
wrangler login

# 3. Create D1 database
echo "Creating D1 database..."
wrangler d1 create mpintellect-push-db

# 4. Update wrangler.toml with database ID
echo "Please update workers/push-worker/wrangler.toml with your database ID"
echo "Run: wrangler d1 list"
echo "Copy the database_id and update wrangler.toml"

# 5. Generate VAPID keys
echo "Generating VAPID keys..."
npm install -g web-push
web-push generate-vapid-keys --json > vapid-keys.json

VAPID_PUBLIC_KEY=$(cat vapid-keys.json | jq -r '.publicKey')
VAPID_PRIVATE_KEY=$(cat vapid-keys.json | jq -r '.privateKey')

echo "Add these to your environment variables:"
echo "NEXT_PUBLIC_VAPID_PUBLIC_KEY=$VAPID_PUBLIC_KEY"
echo "VAPID_PRIVATE_KEY=$VAPID_PRIVATE_KEY"
echo "VAPID_SUBJECT=mailto:admin@mpintellect.com"

# 6. Deploy worker
echo "Deploying worker..."
cd workers/push-worker
wrangler deploy

echo "✅ Push Worker setup complete!"
echo "Worker URL: https://push.mpintellect.com"