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
        
        // If target is outside .next directory or doesn't exist, remove it
        const absoluteTarget = path.resolve(path.dirname(fullPath), target);
        if (!absoluteTarget.includes(path.resolve('.next')) || !fs.existsSync(absoluteTarget)) {
          console.log(`Removing broken symlink: ${fullPath} -> ${target}`);
          fs.unlinkSync(fullPath);
        }
      } else if (item.isDirectory()) {
        cleanupSymlinks(fullPath);
      }
    } catch (error) {
      console.warn(`Error processing ${fullPath}:`, error.message);
    }
  }
}

// Clean .next directory
cleanupSymlinks('.next');
console.log('Cleanup complete');