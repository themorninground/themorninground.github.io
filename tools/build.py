#!/usr/bin/env python3
"""Build the public site.

  python3 tools/build.py page            -> index.html from src/paper.html + src/public-adapter.js
  python3 tools/build.py data EXPORT_DIR -> data/site.json from an export of the Claude artifact database
                                            (EXPORT_DIR holds items/ and meta/ JSON files)
"""
import json, os, sys, glob, datetime

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
<meta name="theme-color" content="#0B1424">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='96' fill='%2314233D'/%3E%3Ctext x='100' y='128' text-anchor='middle' font-family='Georgia,serif' font-weight='800' font-size='80' fill='%23F2EADC'%3EMR%3C/text%3E%3C/svg%3E">
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

def build_data(export_dir):
    cols = {c: load_dir(os.path.join(export_dir, c)) for c in ['items', 'meta']}
    cols['meta'] = {k: v for k, v in cols['meta'].items() if k in ('market', 'series', 'plan', 'checks', 'deals', 'profiles', 'concepts', 'econ', 'world', 'library', 'logos', 'learn', 'glossary')}
    for k, d in cols['items'].items():
        d.pop('version', None); d.pop('updatedAt', None)
        if isinstance(d.get('image'), dict):
            d['image'].pop('asset', None)
    site = {'updated': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'), 'collections': cols}
    os.makedirs(os.path.join(ROOT, 'data'), exist_ok=True)
    json.dump(site, open(os.path.join(ROOT, 'data', 'site.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print('data/site.json', {c: len(v) for c, v in cols.items()})

if __name__ == '__main__':
    if sys.argv[1] == 'page':
        build_page()
    else:
        build_data(sys.argv[2])
