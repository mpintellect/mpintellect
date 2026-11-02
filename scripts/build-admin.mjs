// scripts/build-admin.mjs
// Admin-only build, mirrors build-intel.mjs's pattern: full `next build`,
// then prune every page HTML file except the /admin/* tree, and point
// root "/" at /admin/ instead of the marketing homepage. Deployed as its
// own Cloudflare Pages project with the admin.mpintellect.com custom
// domain, kept separate from the mpintellect.com (main) and mzpintel.com
// (intel) builds. functions/api/* is untouched - Cloudflare Pages Functions
// deploy from the repo-root functions/ dir regardless of what's in out/,
// so every admin API route (telegram, ads/render-chart, admin/validate,
// monitoring's google-ads/facebook calls, etc.) still works unchanged.
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 1. Full build
execSync('next build --webpack', { stdio: 'inherit' });

const outDir = path.join(process.cwd(), 'out');

// 2. Remove every HTML file that isn't under /admin/ and isn't the root
//    index.html (which we overwrite below to redirect into /admin/).
function pruneNonAdminHtml(dirPath, isAdminSubtree) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      const nowInAdmin = isAdminSubtree || (dirPath === outDir && item === 'admin');
      pruneNonAdminHtml(itemPath, nowInAdmin);
      if (fs.readdirSync(itemPath).length === 0) fs.rmdirSync(itemPath);
    } else if (stat.isFile() && item.endsWith('.html')) {
      const isRootIndex = dirPath === outDir && item === 'index.html';
      if (!isAdminSubtree && !isRootIndex) {
        fs.unlinkSync(itemPath);
        console.log(`Removed: ${path.relative(outDir, itemPath)}`);
      }
    }
  }
}
pruneNonAdminHtml(outDir, false);

// 3. Root "/" redirects straight into the admin hub.
fs.writeFileSync(
  path.join(outDir, 'index.html'),
  '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/admin/"></head></html>'
);

// 4. This whole domain is internal tooling - keep it out of search entirely,
//    overriding whatever app/robots.ts generated for the main site.
fs.writeFileSync(path.join(outDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

console.log('✅ Admin-only build complete - all assets preserved');
