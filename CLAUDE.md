# The Morning Round — public site

Static site served by GitHub Pages at https://themorninground.github.io

## Files
- `src/paper.html` — the paper itself (same source as the owner's private Claude artifact https://claude.ai/artifact/BNCXwxrGk6bjAtwkR5KVyh).
- `src/paper-v1.html` — the previous design, kept for reference only.
- `src/public-adapter.js` — makes the paper read `data/site.json` and keep each visitor's follows and filters in their own browser.
- `index.html` — built output. Never edit by hand; run `python3 tools/build.py page`.
- `data/site.json` — all shared content: `items` (news, deals, articles, reports) and `meta/market` (ticker). Built with `python3 tools/build.py data EXPORT_DIR` from an export of the artifact database (EXPORT_DIR holds `items/` and `meta/`).
- `img/` — photos for items, mirrored by the "Mirror news images" GitHub Action from `tools/images.json`.

## Daily update
1. Write each item to the private artifact database (collection `items`), the source of truth.
2. For every item with a photo, add `{"id": "<file stem>", "url": "<source image url>"}` to `tools/images.json` and push; the Action saves `img/<id>.jpg`. Pull, then upload that file as an asset to the artifact and store its url in `image.asset`.
3. Export `items` and `meta` to a folder, run `python3 tools/build.py data <folder>`, commit and push.

## Source rule
Every item links to the exact story (open it to verify), never a site homepage or a monthly roundup. Nothing is published without a direct source. Text is written fresh in our own words (Arabic and English); the photo keeps its credit.
