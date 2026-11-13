// scripts/build-accountant.mjs
// Accountant-only build, mirrors build-admin.mjs's pattern exactly: full
// `next build`, then prune every page HTML file except the /accountant/*
// tree, and point root "/" at /accountant/ instead of the marketing
// homepage. Deployed as its own Cloudflare Pages project with the
// accountant.mpintellect.com custom domain. functions/api/* is untouched -
// Cloudflare Pages Functions deploy from the repo-root functions/ dir
// regardless of what's in out/, so every /api/admin/accountant/* route (and
// the shared /api/admin/validate.ts login) still works unchanged.
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 1. Full build
execSync('next build --webpack', { stdio: 'inherit' });

const outDir = path.join(process.cwd(), 'out');

// 2. Remove every HTML file that isn't under /accountant/ and isn't the root
//    index.html (which we overwrite below to redirect into /accountant/).
function pruneNonAccountantHtml(dirPath, isAccountantSubtree) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      const nowInAccountant = isAccountantSubtree || (dirPath === outDir && item === 'accountant');
      pruneNonAccountantHtml(itemPath, nowInAccountant);
      if (fs.readdirSync(itemPath).length === 0) fs.rmdirSync(itemPath);
    } else if (stat.isFile() && item.endsWith('.html')) {
      const isRootIndex = dirPath === outDir && item === 'index.html';
      if (!isAccountantSubtree && !isRootIndex) {
        fs.unlinkSync(itemPath);
        console.log(`Removed: ${path.relative(outDir, itemPath)}`);
      }
    }
  }
}
pruneNonAccountantHtml(outDir, false);

// 3. Root "/" redirects straight into the accountant hub.
fs.writeFileSync(
  path.join(outDir, 'index.html'),
  '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/accountant/"></head></html>'
);

// 4. This whole domain is internal tooling - keep it out of search entirely,
//    overriding whatever app/robots.ts generated for the main site.
fs.writeFileSync(path.join(outDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

console.log('✅ Accountant-only build complete - all assets preserved');
