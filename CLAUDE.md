# The Morning Round — public site

Static site served by GitHub Pages at https://themorninground.github.io

## Files
- `app/app.js`, `app/app.css` — the v5 site (Oct 2026): Arabic/English toggle, For You (لك) home, articles (tabs Summary / Arabic / Original + machine translation), concepts sky, news, saved, search palette (⌘K). Hash routes: `#/`, `#/a/<id>?t=sum|ar|orig`, `#/articles`, `#/concepts`, `#/c/<id>`, `#/news`, `#/n/<id>`, `#/saved`, `#/dashboard`.
- `app/dash.js` — D3 dashboard (lazy; uses `vendor/d3.min.js`, `app/data/mena.geo.json`, `app/data/market.json` for the cross-source comparison, each figure with its source).
- Library entries need `summary.ar/en` (core, points in article order, numbers, must), `about_en`, `why_en`, `topic` (vc, pe, ma, mk, ec), optional `quiz`. Only `arabic: true` articles are shown. Concepts take `group` and `*_en` fields.
- `app/data/library.json` — the article library (cards, summaries, market notes, embed flag). `app/articles/<id>.html` — the full Arabic version of an article (paragraph by paragraph). `app/data/concepts.json` — reviewed concepts. `app/data/charts.json` — charts used on cards. `app/data/deals-h1.json` — Jan–Apr 2026 deals from Wamda listing pages (month-level dates), merged into the tracked rounds.
- `index.html` — built output. Never edit by hand; run `python3 tools/build.py page` (calls `tools/build_app.py`).
- `classic.html` — the previous design (built with `python3 tools/build.py classic` from `src/paper.html` + `src/public-adapter.js`). Backups: branches `design-classic`, `design-brand-v1`; folder `backup/`.
- `data/site.json` — all shared content: `items` (types deal, news, article, report) and `meta/market` (ticker), `meta/series` (dashboard monthly and quarterly figures), `meta/plan` (reading tracks), `meta/checks` (last watchlist check per company). Built with `python3 tools/build.py data EXPORT_DIR` from an export of the artifact database (EXPORT_DIR holds `items/` and `meta/`).
- `vendor/` — d3 and d3-sankey copies (the page loads them from cdnjs and jsdelivr).
- `img/` — photos for items, mirrored by the "Mirror news images" GitHub Action from `tools/images.json`.

## Daily update
1. Write each item to the private artifact database (collection `items`), the source of truth.
2. For every item with a photo, add `{"id": "<file stem>", "url": "<source image url>"}` to `tools/images.json` and push; the Action saves `img/<id>.jpg`. Pull, then upload that file as an asset to the artifact and store its url in `image.asset`.
3. Export `items` and `meta` to a folder, run `python3 tools/build.py data <folder>`, commit and push.

## Article rule
Every library article: check the source allows embedding (`tools/frame_urls.txt` + the "Check embedding rules" Action) so the original shows inside the site; the Arabic version covers every paragraph, chart, formula, table and footnote of the original in our own words; no invented headings.

## Source rule
Every item links to the exact story (open it to verify), never a site homepage or a monthly roundup. Nothing is published without a direct source. Text is written fresh in our own words (Arabic and English); the photo keeps its credit.
