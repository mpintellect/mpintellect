// scripts/d1-proxy.js - Run this instead of wrangler
import { createServer } from 'http';
import { request } from 'https';

const DB_ID = '074ccc04-d574-4164-8f48-0b6444b9db88';
const ACCOUNT_ID = 'YOUR_CLOUDFLARE_ACCOUNT_ID'; // Get from Cloudflare dashboard
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN; // Create token with D1 read/write

createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/query') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { sql, params } = JSON.parse(body);
        
        // Call Cloudflare D1 REST API directly
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}/query`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${API_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql, params })
          }
        );
        
        const data = await response.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      } catch (e) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  }
}).listen(8789);

console.log('🚀 D1 Proxy running on http://localhost:8789');