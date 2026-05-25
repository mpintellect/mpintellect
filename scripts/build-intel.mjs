// scripts/build-intel.mjs
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// First, do a full build
execSync('next build --webpack', { stdio: 'inherit' });

// Then, remove all static pages except intel
const outDir = path.join(process.cwd(), 'out');
const keepPages = ['intel.html', 'intel', 'index.html'];

function cleanDirectory(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      if (!keepPages.includes(item)) {
        fs.rmSync(itemPath, { recursive: true, force: true });
      } else {
        cleanDirectory(itemPath);
      }
    } else if (stat.isFile()) {
      const fileName = path.basename(itemPath);
      if (!keepPages.some(keep => fileName.includes(keep))) {
        fs.unlinkSync(itemPath);
      }
    }
  }
}

cleanDirectory(outDir);

// Ensure index.html points to intel
const indexPath = path.join(outDir, 'index.html');
if (fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath, 
    '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/intel"></head></html>'
  );
}

console.log('✅ Intel-only build complete');