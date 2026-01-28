const fs = require('fs');
const path = require('path');

console.log('Cleaning up symlinks for Cloudflare Pages...');

function cleanupSymlinks(dir) {
  if (!fs.existsSync(dir)) return;
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    try {
      // Check if it's a symlink
      const stat = fs.lstatSync(fullPath);
      if (stat.isSymbolicLink()) {
        console.log(`Found symlink: ${fullPath}`);
        
        // Get the target
        const target = fs.readlinkSync(fullPath);
        console.log(`  → Points to: ${target}`);
        
        // Check if it's a CSS or JS file symlink - DON'T DELETE THESE
        if (fullPath.includes('.css') || fullPath.includes('.js')) {
          console.log(`  ⚠️  Preserving asset symlink: ${fullPath}`);
          continue; // Skip, don't delete
        }
        
        // If target is outside .next directory or doesn't exist, remove it
        const absoluteTarget = path.resolve(path.dirname(fullPath), target);
        if (!absoluteTarget.includes(path.resolve('.next')) || !fs.existsSync(absoluteTarget)) {
          console.log(`  🗑️  Removing broken symlink: ${fullPath}`);
          fs.unlinkSync(fullPath);
        } else {
          console.log(`  ✓ Keeping valid symlink: ${fullPath}`);
        }
      } else if (item.isDirectory() && !stat.isSymbolicLink()) {
        cleanupSymlinks(fullPath);
      }
    } catch (error) {
      console.warn(`Error processing ${fullPath}:`, error.message);
    }
  }
}

// Clean .next directory
cleanupSymlinks('.next');

// Also check for and preserve static assets
console.log('\nChecking static assets...');
const staticDir = '.next/static';
if (fs.existsSync(staticDir)) {
  console.log(`Static directory exists: ${staticDir}`);
  
  // Check for CSS files
  const cssFiles = [];
  function findCSS(dir) {
    if (!fs.existsSync(dir)) return;
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
  
  findCSS(staticDir);
  console.log(`Found ${cssFiles.length} CSS files`);
  if (cssFiles.length > 0) {
    console.log('CSS files preserved ✓');
  }
}

console.log('✅ Cleanup complete');