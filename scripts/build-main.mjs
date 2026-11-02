// scripts/build-main.mjs
// Main (mpintellect.com) build. Same full site as before, minus the /admin
// page tree - admin now lives entirely on its own build/deploy/domain
// (see scripts/build-admin.mjs, deploy:admin -> mpintellect-admin project,
// admin.mpintellect.com). functions/api/* is untouched here: Cloudflare
// Pages Functions deploy from the repo-root functions/ dir regardless of
// what's pruned from out/, so nothing admin-related calls into those
// routes from this site's own pages anymore, but the routes themselves
// still exist (unchanged scope - only the page tree was asked to go).
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 1. Full build
execSync('next build --webpack', { stdio: 'inherit' });

const outDir = path.join(process.cwd(), 'out');
const adminDir = path.join(outDir, 'admin');

// 2. Drop the whole /admin page tree.
if (fs.existsSync(adminDir)) {
  fs.rmSync(adminDir, { recursive: true, force: true });
  console.log('Removed: admin/ (now served only from admin.mpintellect.com)');
}

console.log('✅ Main build complete - /admin page tree excluded');
