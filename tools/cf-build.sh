#!/usr/bin/env bash
# Cloudflare build: copy only the public site into dist/ (tools, docs, logs and drafts stay private).
set -euo pipefail
rm -rf dist && mkdir -p dist/brand dist/data
cp index.html classic.html favicon.svg favicon.ico favicon-32.png dist/
cp -r app fonts img vendor dist/
cp -r brand/pack dist/brand/
cp data/*.json dist/data/
echo "dist ready: $(find dist -type f | wc -l) files"
