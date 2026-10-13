#!/usr/bin/env python3
"""Download every image listed in tools/images.json into img/<id>.jpg (max 1400px wide).
Runs in GitHub Actions; skips ids already present."""
import json, os, io, urllib.request
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
items = json.load(open(os.path.join(ROOT, 'tools', 'images.json'), encoding='utf-8'))
os.makedirs(os.path.join(ROOT, 'img'), exist_ok=True)
for it in items:
    out = os.path.join(ROOT, 'img', it['id'] + '.jpg')
    if os.path.exists(out):
        continue
    try:
        req = urllib.request.Request(it['url'], headers={'User-Agent': 'Mozilla/5.0 (TheMorningRound image mirror)'})
        raw = urllib.request.urlopen(req, timeout=30).read()
        im = Image.open(io.BytesIO(raw)).convert('RGB')
        if im.width > 1400:
            im = im.resize((1400, round(im.height * 1400 / im.width)))
        im.save(out, 'JPEG', quality=82, optimize=True, progressive=True)
        print('ok', it['id'], im.size)
    except Exception as e:
        print('FAIL', it['id'], it['url'], e)
