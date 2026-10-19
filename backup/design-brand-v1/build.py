#!/usr/bin/env python3
"""Build the public site.

  python3 tools/build.py page            -> index.html from src/paper.html + src/public-adapter.js
  python3 tools/build.py data EXPORT_DIR -> data/site.json from an export of the Claude artifact database
                                            (EXPORT_DIR holds items/ and meta/ JSON files)
"""
import re, json, os, sys, glob, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PERSONAL = {'status', 'notes', 'answer', 'feedback', 'chat', 'advanced', 'completedAt', 'labState', 'version', 'updatedAt'}

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The Morning Round</title>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="A daily paper on venture capital, startups and the Saudi and GCC markets. Every page compounds.">
<meta property="og:title" content="The Morning Round">
<meta property="og:description" content="A daily paper on venture capital, startups and the Saudi and GCC markets. Every page compounds.">
<meta property="og:type" content="website">
<meta name="theme-color" content="#0B0D12">
<link rel="apple-touch-icon" href="brand/pack/png/tmr-app-icon-180.png">
<meta property="og:image" content="https://themorninground.github.io/brand/pack/png/tmr-avatar-1080.png">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"%3E%3CclipPath id="c14"%3E%3Ccircle cx="50.000" cy="50.000" r="50.000"/%3E%3C/clipPath%3E%3Cg clip-path="url%28%23c14%29"%3E%3Crect x="0.000" y="0.000" width="100.000" height="50.000" fill="%233EA6F2"/%3E%3Crect x="0.000" y="57.000" width="100.000" height="14.000" fill="%23FFA235"/%3E%3Crect x="0.000" y="79.000" width="100.000" height="21.000" fill="%23F2551A"/%3E%3C/g%3E%3C/svg%3E">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-size:14px}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
"""

def build_page():
    paper = open(os.path.join(ROOT, 'src', 'paper.html'), encoding='utf-8').read()
    adapter = open(os.path.join(ROOT, 'src', 'public-adapter.js'), encoding='utf-8').read()
    out = HEAD + "<script>window.MR_IMG_BASE='img/';</script>\n<script>\n" + adapter + '</script>\n' + paper + '\n</body>\n</html>\n'
    open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(out)
    print('index.html', len(out))

def load_dir(d):
    out = {}
    for f in sorted(glob.glob(os.path.join(d, '*.json'))):
        doc = json.load(open(f, encoding='utf-8'))
        if isinstance(doc, dict) and 'data' in doc and isinstance(doc['data'], dict) and len(doc) <= 4:
            doc = doc['data']
        out[os.path.splitext(os.path.basename(f))[0]] = doc
    return out

INTERNAL = re.compile(r'(?<![\u0600-\u06FF])تالي(?![\u0600-\u06FF])|\btali\b|\bstc\b', re.I)

def build_data(export_dir):
    cols = {c: load_dir(os.path.join(export_dir, c)) for c in ['items', 'meta']}
    cols['meta'] = {k: v for k, v in cols['meta'].items() if k in ('market', 'series', 'plan', 'checks', 'deals', 'profiles', 'concepts', 'econ', 'world', 'library', 'logos', 'learn', 'glossary', 'sources')}
    for k, d in cols['items'].items():
        d.pop('version', None); d.pop('updatedAt', None)
        if isinstance(d.get('image'), dict):
            d['image'].pop('asset', None)
        # the public site carries no internal team notes: drop the private lens and study notes
        for f in ('lens', 'question', 'tali', 'note', 'internal'):
            d.pop(f, None)
        if isinstance(d.get('explain'), list):
            d['explain'] = ['' if isinstance(x, str) and INTERNAL.search(x) else x for x in d['explain']]
        for lang in ('ar', 'en'):
            w = (d.get(lang) or {}).get('why')
            if isinstance(w, str) and INTERNAL.search(w):
                raise SystemExit('internal reference in public "why" of %s (%s): %s' % (k, lang, w))
    site = {'updated': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'), 'collections': cols}
    os.makedirs(os.path.join(ROOT, 'data'), exist_ok=True)
    json.dump(site, open(os.path.join(ROOT, 'data', 'site.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print('data/site.json', {c: len(v) for c, v in cols.items()})

if __name__ == '__main__':
    if sys.argv[1] == 'page':
        build_page()
    else:
        build_data(sys.argv[2])
