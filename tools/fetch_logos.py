#!/usr/bin/env python3
"""Download company/investor logos (site icons) listed in tools/logos.json {slug: domain} into img/logo/<slug>.png.
Runs in GitHub Actions. Skips existing files and generic/tiny icons."""
import json, os, io, urllib.request
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = json.load(open(os.path.join(ROOT, 'tools', 'logos.json')))
os.makedirs(os.path.join(ROOT, 'img', 'logo'), exist_ok=True)
ok = {}
for slug, dom in L.items():
    out = os.path.join(ROOT, 'img', 'logo', slug + '.png')
    if os.path.exists(out):
        ok[slug] = dom; continue
    for url in ['https://www.google.com/s2/favicons?domain=%s&sz=256' % dom, 'https://icons.duckduckgo.com/ip3/%s.ico' % dom]:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (TheMorningRound logo mirror)'})
            raw = urllib.request.urlopen(req, timeout=20).read()
            im = Image.open(io.BytesIO(raw))
            if getattr(im, 'n_frames', 1) > 1:
                im.seek(im.n_frames - 1)
            im = im.convert('RGBA')
            if im.width < 48:
                print('small', slug, url, im.size); continue
            im.thumbnail((256, 256))
            im.save(out, 'PNG', optimize=True)
            ok[slug] = dom
            print('ok', slug, im.size); break
        except Exception as e:
            print('FAIL', slug, url, e)
json.dump(sorted(ok), open(os.path.join(ROOT, 'img', 'logo', 'index.json'), 'w'))
