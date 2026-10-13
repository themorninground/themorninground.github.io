#!/usr/bin/env python3
"""Second-pass logo finder. tools/logos2.json maps slug -> {"name": str, "domains": [candidate domains]}.
For each slug without a reviewed logo, try each candidate domain: load the home page, check the page really
belongs to that name (name appears in the HTML, no 'domain for sale' signs), then take the best icon the
page declares (apple-touch-icon, large <link rel=icon>, og:image), falling back to Google's 256px favicon.
Writes img/logo2/<slug>.png and img/logo2/index.json ({slug: {domain, src}}) for human review."""
import json, os, io, re, urllib.request, urllib.parse
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG = json.load(open(os.path.join(ROOT, 'tools', 'logos2.json')))
OUT = os.path.join(ROOT, 'img', 'logo2'); os.makedirs(OUT, exist_ok=True)
IDX = os.path.join(OUT, 'index.json')
idx = json.load(open(IDX)) if os.path.exists(IDX) else {}
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'}
BAD = re.compile(r'domain (is )?for sale|buy this domain|parked|hugedomains|sedo\.com|dan\.com|godaddy', re.I)
def get(url, n=3_000_000):
    r = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=15)
    return r.read(n), r.geturl()
def img_from(url):
    raw, _ = get(url, 8_000_000)
    if raw[:5] == b'<?xml' or b'<svg' in raw[:400]:
        return None
    im = Image.open(io.BytesIO(raw))
    if getattr(im, 'n_frames', 1) > 1:
        try:
            best = max(range(im.n_frames), key=lambda i: (im.seek(i), im.size[0])[1]); im.seek(best)
        except Exception: pass
    im = im.convert('RGBA')
    return im
def icons(html, base):
    out = []
    for m in re.finditer(r'<link[^>]+>', html, re.I):
        tag = m.group(0); rel = re.search(r'rel=["\']([^"\']+)', tag, re.I); href = re.search(r'href=["\']([^"\']+)', tag, re.I)
        if not rel or not href: continue
        rel = rel.group(1).lower(); sz = re.search(r'sizes=["\'](\d+)', tag)
        if 'apple-touch-icon' in rel: out.append((3, int(sz.group(1)) if sz else 180, href.group(1)))
        elif 'icon' in rel: out.append((2, int(sz.group(1)) if sz else 32, href.group(1)))
    og = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)', html, re.I) or re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image', html, re.I)
    if og: out.append((1, 100, og.group(1)))
    big = [x for x in out if x[0] >= 2 and x[1] >= 120]; big.sort(key=lambda x: (-x[0], -x[1]))
    rest = [x for x in out if x not in big and x[0] >= 2]; ogs = [x for x in out if x[0] == 1]
    return [urllib.parse.urljoin(base, h) for _, _, h in big] + ['S2'] + [urllib.parse.urljoin(base, h) for _, _, h in rest + ogs]
for slug, c in CFG.items():
    if slug in idx and os.path.exists(os.path.join(OUT, slug + '.png')): continue
    name = c['name']; key = [w for w in re.split(r'[^a-z0-9]+', name.lower()) if len(w) >= 3] or [name.lower()]
    done = False
    direct = list(c.get('img', []))
    if c.get('book'):
        try:
            q = urllib.parse.urlencode({'title': c['book']['title'], 'author': c['book']['author'], 'limit': 5})
            js = json.loads(get('https://openlibrary.org/search.json?' + q)[0])
            for d in js.get('docs', []):
                if d.get('cover_i'): direct.append('https://covers.openlibrary.org/b/id/%d-L.jpg' % d['cover_i']); break
        except Exception as e: print('book', slug, e)
    for u in direct:
        try:
            im = img_from(u)
            if not im or min(im.size) < 64: continue
            im.thumbnail((400, 400) if c.get('book') else (256, 256)); im.save(os.path.join(OUT, slug + '.png'), 'PNG', optimize=True)
            idx[slug] = {'domain': '', 'src': u}; done = True; print('ok', slug, u, im.size); break
        except Exception as e: print('imgfail', slug, u, e)
    for ap in ([] if done else ([c['app']] if c.get('app') else [])):
        try:
            q = urllib.parse.urlencode({'term': ap['term'], 'country': ap.get('country', 'sa'), 'entity': 'software', 'limit': 15})
            js = json.loads(get('https://itunes.apple.com/search?' + q)[0])
            want = re.compile(r'\b' + re.escape(ap.get('match', ap['term']).lower()) + r'\b')
            for r in js.get('results', []):
                if want.search((r.get('trackName', '') + ' ' + r.get('sellerName', '')).lower()):
                    u = r.get('artworkUrl512') or r.get('artworkUrl100')
                    im = img_from(u); im.thumbnail((256, 256)); im.save(os.path.join(OUT, slug + '.png'), 'PNG', optimize=True)
                    idx[slug] = {'domain': 'appstore:' + r.get('sellerName', ''), 'src': u, 'app': r.get('trackName')}; done = True; print('ok app', slug, r.get('trackName'), r.get('sellerName')); break
        except Exception as e: print('app', slug, e)
    for dom in ([] if done else c.get('domains', [])):
        try:
            raw, final = get('https://' + dom)
            html = raw.decode('utf-8', 'ignore')
            if BAD.search(html[:20000]):
                print('parked', slug, dom); continue
            low = html.lower()
            if not any(k in low for k in key[:2]):
                print('noname', slug, dom); continue
            cands = [('https://www.google.com/s2/favicons?domain=%s&sz=256' % dom) if u == 'S2' else u for u in icons(html, final)]
            for u in cands:
                try:
                    im = img_from(u)
                    if not im or min(im.size) < 64: continue
                    if u.endswith(('.jpg', '.jpeg')) or 'og' in u.lower() and im.size[0] > 2 * im.size[1]: pass
                    im.thumbnail((256, 256)); im.save(os.path.join(OUT, slug + '.png'), 'PNG', optimize=True)
                    idx[slug] = {'domain': dom, 'src': u}; done = True; print('ok', slug, dom, u, im.size); break
                except Exception as e:
                    print('imgfail', slug, u, e)
            if done: break
        except Exception as e:
            print('FAIL', slug, dom, e)
    json.dump(idx, open(IDX, 'w'), indent=1)
