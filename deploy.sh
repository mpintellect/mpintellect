#!/bin/bash
git add -A
git commit -m "Update changes"
git push origin main
vercel --prod
