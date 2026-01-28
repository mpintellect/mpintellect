const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Copying static assets for Cloudflare Pages...');

// Create necessary directories
const dirs = [
  '.next/_next/static',
  '.next/server/app/_next/static'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Copy static assets to multiple locations so Cloudflare can find them
const sourceStatic = '.next/static';
const targets = [
  '.next/_next/static',
  '.next/server/app/_next/static'
];

if (fs.existsSync(sourceStatic)) {
  targets.forEach(target => {
    // Copy entire static directory
    execSync(`cp -r ${sourceStatic}/* ${target}/ 2>/dev/null || true`);
    console.log(`Copied static assets to: ${target}/`);
  });
  
  // Also check what was copied
  const cssFiles = [];
  function findCSS(dir) {
    if (fs.existsSync(dir)) {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          findCSS(fullPath);
        } else if (fullPath.endsWith('.css')) {
          cssFiles.push(fullPath);
        }
      }
    }
  }
  
  findCSS('.next/_next/static');
  console.log(`✅ Found ${cssFiles.length} CSS files in static assets`);
} else {
  console.log('⚠️ Static directory not found:', sourceStatic);
}

console.log('✅ Static assets copy complete');