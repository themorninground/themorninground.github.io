#!/usr/bin/env python3
"""Backfill: list Wamda stories from January to June 2026 (headline, link, date, one-line summary)
so the editor can add those months' deals to the tracked deal list, each linked to its own story.
Only metadata is stored. Writes data/backfill/wamda-2026h1.json and a log."""
import json, os, re, time, html, urllib.request, gzip
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'data', 'backfill'); os.makedirs(OUT, exist_ok=True)
LOG = open(os.path.join(OUT, 'log.txt'), 'w')
def log(*a): print(*a); LOG.write(' '.join(map(str, a)) + '\n'); LOG.flush()
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36', 'Accept-Language': 'en'}
def get(u, n=8_000_000):
    r = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=25); b = r.read(n)
    if b[:2] == b'\x1f\x8b': b = gzip.decompress(b)
    return b.decode('utf-8', 'replace')
MON = re.compile(r'wamda\.com/(?:en/)?2026/0[1-6]/[^\s<"\']+')
urls = set(); seen = set()
def sitemap(u, depth=0):
    if u in seen or depth > 3: return
    seen.add(u)
    try: x = get(u)
    except Exception as e: log('fail', u, e); return
    locs = re.findall(r'<loc>\s*([^<\s]+)\s*</loc>', x); log('sitemap', u, len(locs))
    for l in locs:
        l = html.unescape(l)
        if MON.search(l): urls.add(l.split('#')[0])
        elif re.search(r'sitemap|\.xml', l) and ('2026' in l or 'post' in l or 'article' in l or 'news' in l or depth == 0): sitemap(l, depth + 1)
for s in ['https://www.wamda.com/sitemap.xml', 'https://www.wamda.com/sitemap_index.xml', 'https://www.wamda.com/en/sitemap.xml', 'https://www.wamda.com/sitemap-news.xml', 'https://www.wamda.com/robots.txt']:
    if s.endswith('robots.txt'):
        try:
            for l in re.findall(r'(?im)^sitemap:\s*(\S+)', get(s)): sitemap(l)
        except Exception as e: log('robots fail', e)
    else: sitemap(s)
log('from sitemaps', len(urls))
# fallback: walk listing pages (run 2)
if len(urls) < 50:
    for base in ['https://www.wamda.com/en/news?page={}', 'https://www.wamda.com/news?page={}', 'https://www.wamda.com/en/latest?page={}', 'https://www.wamda.com/en/investment?page={}']:
        got = 0
        for p in range(1, 160):
            try: x = get(base.format(p))
            except Exception as e: log('list fail', base, p, e); break
            found = set('https://www.' + m for m in re.findall(r'wamda\.com/(?:en/)?2026/\d\d/[a-z0-9\-]+', x))
            older = re.findall(r'wamda\.com/(?:en/)?(20\d\d)/(\d\d)/', x)
            for f in found:
                if MON.search(f): urls.add(f)
            got += len(found)
            if older and all((y, m) < ('2026', '01') for y, m in older[-5:]): break
            time.sleep(.4)
        log('listing', base, got, len(urls))
        if len(urls) > 50: break
def meta(h, *names):
    for n in names:
        for pat in (r'<meta[^>]+(?:property|name)=["\']%s["\'][^>]*content=["\']([^"\']*)' % re.escape(n), r'<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name)=["\']%s["\']' % re.escape(n)):
            m = re.search(pat, h, re.I)
            if m and m.group(1).strip(): return html.unescape(m.group(1)).strip()
    return ''
out = []; T0 = time.time()
for u in sorted(urls):
    if time.time() - T0 > 33 * 60: log('time budget'); break
    h = None
    for wait in (0, 40, 90):
        if wait: time.sleep(wait)
        try: h = get(u, 1_500_000); break
        except Exception as e: log('retry', u, e)
    if h is None: continue
    try:
        out.append({'url': u, 't': meta(h, 'og:title', 'twitter:title'), 'd': meta(h, 'og:description', 'description'), 'date': meta(h, 'article:published_time', 'date') or re.search(r'/(2026/\d\d)/', u).group(1)})
    except Exception as e: log('page fail', u, e)
    time.sleep(3.5)
json.dump(out, open(os.path.join(OUT, 'wamda-2026h1.json'), 'w'), ensure_ascii=False, indent=0)
log('done', len(out))
