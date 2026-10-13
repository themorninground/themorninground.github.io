# The Morning Round — public site

Static site served by GitHub Pages at https://themorninground.github.io

## Files
- `src/paper.html` — the paper itself (same source as the owner's private Claude artifact).
- `src/public-adapter.js` — makes the paper read `data/site.json` and keep each visitor's progress in their own browser.
- `index.html` — built output. Never edit by hand; run `python3 tools/build.py page`.
- `data/site.json` — all shared content (rounds, stories, news, watchlist, meta/plan, meta/market). Built with `python3 tools/build.py data EXPORT_DIR` from an export of the artifact database.

## Daily update
1. Write the day's content to the private artifact database (the source of truth).
2. Export the collections `rounds`, `stories`, `news`, `watchlist`, `meta` to a folder (one JSON file per document, folder per collection).
3. `python3 tools/build.py data <folder>` then commit and push `data/site.json`.

Personal fields (status, notes, answers, feedback, chat, lab values) are stripped from the public file.

## Source rule
Every news item links to the exact story (open it to verify), never a site homepage or a monthly roundup.
If no direct story exists, keep the item, link the best page, and set `linkType: "roundup"` so the paper labels it.
