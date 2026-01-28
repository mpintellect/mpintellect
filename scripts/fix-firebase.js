const fs = require('fs');
const path = require('path');

console.log('Fixing Firebase imports...');

const filesToUpdate = [
  // List all files that import { auth, db }
  'app/client/Dashboard/components/UserSetups.tsx',
  'app/client/dashboard/page.tsx',
  'app/client/dashboard/refer/page.tsx',
  'app/client/login/page.tsx',
  'app/client/register/page.tsx',
  // Add all other files that use Firebase
];

filesToUpdate.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace import { auth, db } with { getAuthInstance, getDbInstance }
    content = content.replace(
      /import\s*{\s*(?:auth|db)(?:\s*,\s*(?:auth|db))*\s*}\s*from\s*["']@\/app\/lib\/firebaseClient["']/g,
      'import { getAuthInstance, getDbInstance } from "@/app/lib/firebaseClient"'
    );
    
    // Replace usage of auth with getAuthInstance()
    content = content.replace(/\bauth\b(?![A-Za-z])/g, 'getAuthInstance()');
    
    // Replace usage of db with getDbInstance()
    content = content.replace(/\bdb\b(?![A-Za-z])/g, 'getDbInstance()');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
  } else {
    console.log(`⚠️ Not found: ${filePath}`);
  }
});

console.log('✅ Firebase imports fixed');