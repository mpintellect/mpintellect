// scripts/build-intel.mjs
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 1. Full build
execSync('next build --webpack', { stdio: 'inherit' });

const outDir = path.join(process.cwd(), 'out');

// 2. Remove all HTML files EXCEPT intel.html and index.html
const files = fs.readdirSync(outDir);
for (const file of files) {
  const filePath = path.join(outDir, file);
  const stat = fs.statSync(filePath);
  
  if (stat.isFile() && file.endsWith('.html')) {
    if (file !== 'intel.html' && file !== 'index.html') {
      fs.unlinkSync(filePath);
      console.log(`Removed: ${file}`);
    }
  }
}

// 3. Also clean any nested HTML files inside subdirectories (e.g., /about/index.html)
function cleanNestedHtml(dirPath) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      cleanNestedHtml(itemPath);
      // Optionally remove empty directories
      if (fs.readdirSync(itemPath).length === 0) {
        fs.rmdirSync(itemPath);
      }
    } else if (stat.isFile() && item.endsWith('.html') && item !== 'intel.html' && item !== 'index.html') {
      fs.unlinkSync(itemPath);
      console.log(`Removed nested: ${itemPath}`);
    }
  }
}
cleanNestedHtml(outDir);

// 4. Overwrite index.html to redirect to /intel
const indexPath = path.join(outDir, 'index.html');
fs.writeFileSync(indexPath, 
  '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/intel"></head></html>'
);

console.log('✅ Intel-only build complete - all assets preserved');