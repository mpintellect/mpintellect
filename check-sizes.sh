#!/bin/bash
echo "=== TOP 20 LARGEST FILES ==="
find . -type f -exec du -h {} + 2>/dev/null | sort -rh | head -20

echo -e "\n=== NODE_MODULES LARGEST PACKAGES ==="
du -sh node_modules/* 2>/dev/null | sort -rh | head -10

echo -e "\n=== LARGE JSON FILES (>500K) ==="
find . -name "*.json" -size +500k -exec ls -lh {} \; 2>/dev/null

echo -e "\n=== BUILD DIRECTORIES ==="
[ -d ".next" ] && du -sh .next/
[ -d "dist" ] && du -sh dist/
[ -d "out" ] && du -sh out/
[ -d ".wrangler" ] && du -sh .wrangler/

echo -e "\n=== PUBLIC FOLDER (if exists) ==="
[ -d "public" ] && find public -type f -exec du -h {} + 2>/dev/null | sort -rh | head -10