#!/usr/bin/env python3
"""Download every image listed in tools/images.json into img/<id>.jpg (max 1400px wide).
Each entry is {"id", "url"} for a direct image, or {"id", "page"} for a story page: the page's own
share image (og:image / twitter:image) is used. img/index.json records where each image came from
(page, image url, site name) so the credit is kept. Runs in GitHub Actions; skips ids already present."""
import json, os, io, re, sys, html as H, urllib.request, urllib.parse
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
items = json.load(open(os.path.join(ROOT, 'tools', 'images.json'), encoding='utf-8'))
os.makedirs(os.path.join(ROOT, 'img'), exist_ok=True)
IDX = os.path.join(ROOT, 'img', 'index.json')
idx = json.load(open(IDX)) if os.path.exists(IDX) else {}
LOG = open(os.path.join(ROOT, 'img', 'last_run.txt'), 'w')
_print = print
def print(*a):
    _print(*a); LOG.write(' '.join(str(x) for x in a) + '\n')
GENERIC = re.compile(r'(logo|default|placeholder|social[-_]?share|social1|fallback|og-default|brand)', re.I)
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
      'Accept-Language': 'en,ar;q=0.8'}
WUA = {'User-Agent': 'TheMorningRoundImageBot/1.0 (https://themorninground.github.io)'}
def get(url, n=8_000_000):
    url = urllib.parse.quote(url, safe=':/?&=%#+,;@!$~*()')
    h = WUA if 'wikimedia.org' in url or 'wikipedia.org' in url else UA
    r = urllib.request.urlopen(urllib.request.Request(url, headers=h), timeout=30)
    return r.read(n), r.geturl()
def meta(html, *names):
    for n in names:
        for pat in (r'<meta[^>]+(?:property|name)=["\']%s["\'][^>]*content=["\']([^"\']+)' % re.escape(n),
                    r'<meta[^>]+content=["\']([^"\']+)["\'][^>]*(?:property|name)=["\']%s["\']' % re.escape(n)):
            m = re.search(pat, html, re.I)
            if m: return H.unescape(m.group(1)).strip()
    return ''
for it in items:
    out = os.path.join(ROOT, 'img', it['id'] + '.jpg')
    if os.path.exists(out) and not it.get('force'):
        continue
    try:
        rec = {}
        url = it.get('url')
        for pg in ([] if url else (it.get('pages') or [it.get('page')])):
            try:
                raw, final = get(pg, 3_000_000)
                page = raw.decode('utf-8', 'ignore')
                u = meta(page, 'og:image:secure_url', 'og:image', 'twitter:image', 'twitter:image:src')
                if not u: print('no share image', pg); continue
                if GENERIC.search(u.split('?')[0].rsplit('/', 1)[-1]): print('generic share image', pg, u); continue
                url = urllib.parse.urljoin(final, u)
                rec = {'page': pg, 'site': meta(page, 'og:site_name'), 'title': meta(page, 'og:title')[:140]}
                break
            except Exception as e:
                print('page fail', pg, e)
        if not url: raise Exception('no image found')
        raw, _ = get(url)
        im = Image.open(io.BytesIO(raw)).convert('RGB')
        if im.width < 300: raise Exception('image too small %s' % (im.size,))
        if im.width > 1400:
            im = im.resize((1400, round(im.height * 1400 / im.width)))
        im.save(out, 'JPEG', quality=84, optimize=True, progressive=True)
        rec.update(src=url, size=list(im.size)); idx[it['id']] = rec
        print('ok', it['id'], im.size, url)
    except Exception as e:
        print('FAIL', it['id'], it.get('url') or it.get('page'), e)
json.dump(idx, open(IDX, 'w'), indent=1, ensure_ascii=False)
LOG.close()
