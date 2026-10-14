#!/usr/bin/env python3
"""Third-pass logo finder with stronger identity checks.
tools/logos3.json maps slug -> {
  "name": display name,
  "wd": Wikidata search label (optional; uses the entity's official logo, P154),
  "wd_must": words that must appear in the Wikidata description (optional),
  "domains": official domains to try first (optional),
  "q": web search query used to discover the official domain (optional),
  "must": words that must appear on the home page besides the name (optional, any of),
  "img": direct image urls (optional), "x": X handle for people (optional)
}
Writes img/logo3/<slug>.png and img/logo3/index.json with where each logo came from (domain, page title,
Wikidata description) so a person can review every logo before it is used."""
import json, os, io, re, sys, urllib.request, urllib.parse
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG = json.load(open(os.path.join(ROOT, 'tools', 'logos3.json')))
OUT = os.path.join(ROOT, 'img', 'logo3'); os.makedirs(OUT, exist_ok=True)
IDX = os.path.join(OUT, 'index.json')
idx = json.load(open(IDX)) if os.path.exists(IDX) else {}
LOG = open(os.path.join(OUT, 'last_run.txt'), 'w')
_print = print
def print(*a):
    _print(*a); LOG.write(' '.join(str(x) for x in a) + '\n'); LOG.flush()
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
      'Accept-Language': 'en,ar;q=0.8'}
WUA = {'User-Agent': 'TheMorningRoundLogoBot/1.0 (https://themorninground.github.io; logo review)'}
BAD = re.compile(r'domain (is )?for sale|buy this domain|parked free|hugedomains|sedo\.com|dan\.com/|this domain may be for sale', re.I)
SKIP = re.compile(r'(wamda|linkedin|crunchbase|facebook|twitter|x\.com|instagram|youtube|wikipedia|wikidata|zawya|magnitt|pitchbook|cbinsights|dealroom|tracxn|bloomberg|reuters|techcrunch|arabnews|gulfnews|thenationalnews|apple\.com|google\.|startupresearcher|fundz|seedtable|cairoscene|entrepreneur|menabytes|enterpriseam|fintechfutures|thepaypers|jawlah|argaam|mubasher|thestartupscene|waya\.media|arabfounders|lucidity|glassdoor|indeed|medium\.com|substack|f6s|owler|zoominfo|rocketreach|craft\.co|wellfound|angel\.co|github|duckduckgo|bing\.com|tiktok|pinterest|dnb\.com|bizapedia|opencorporates|globenewswire|prnewswire|businesswire|yahoo|msn\.com|forbes|gulfbusiness|khaleejtimes|aawsat|agbi|semafor|ft\.com|wsj\.com|cnbc|zoominfo|signalhire|apollo\.io|contactout|leadiq|clay\.com|golden\.com|startupblink|failory|ycombinator\.com/companies)', re.I)

def get(url, n=3_000_000, h=UA):
    r = urllib.request.urlopen(urllib.request.Request(url, headers=h), timeout=20)
    return r.read(n), r.geturl()

def img_from(url, h=UA):
    raw, _ = get(url, 8_000_000, h)
    if raw[:5] == b'<?xml' or b'<svg' in raw[:600]:
        return None
    im = Image.open(io.BytesIO(raw))
    if getattr(im, 'n_frames', 1) > 1:
        try:
            best = max(range(im.n_frames), key=lambda i: (im.seek(i), im.size[0])[1]); im.seek(best)
        except Exception: pass
    return im.convert('RGBA')

def save(slug, im, rec, big=False):
    # trim flat borders so the mark fills its badge
    bg = Image.new('RGBA', im.size, (255, 255, 255, 0))
    im.thumbnail((512, 512) if big else (320, 320))
    im.save(os.path.join(OUT, slug + '.png'), 'PNG', optimize=True)
    idx[slug] = rec
    print('ok', slug, rec)

def icons(html, base):
    out = []
    for m in re.finditer(r'<link[^>]+>', html, re.I):
        tag = m.group(0); rel = re.search(r'rel=["\']([^"\']+)', tag, re.I); href = re.search(r'href=["\']([^"\']+)', tag, re.I)
        if not rel or not href: continue
        rel = rel.group(1).lower(); sz = re.search(r'sizes=["\'](\d+)', tag)
        if 'apple-touch-icon' in rel: out.append((3, int(sz.group(1)) if sz else 180, href.group(1)))
        elif 'icon' in rel: out.append((2, int(sz.group(1)) if sz else 32, href.group(1)))
    for m in re.finditer(r'<meta[^>]+name=["\']msapplication-TileImage["\'][^>]+content=["\']([^"\']+)', html, re.I):
        out.append((2, 144, m.group(1)))
    big = sorted([x for x in out if x[1] >= 120], key=lambda x: (-x[0], -x[1]))
    small = sorted([x for x in out if x[1] < 120], key=lambda x: -x[1])
    return [urllib.parse.urljoin(base, h) for _, _, h in big], [urllib.parse.urljoin(base, h) for _, _, h in small]

def ddg(q):
    try:
        raw, _ = get('https://html.duckduckgo.com/html/?' + urllib.parse.urlencode({'q': q}))
        html = raw.decode('utf-8', 'ignore')
        doms = []
        for u in re.findall(r'uddg=([^&"\']+)', html):
            u = urllib.parse.unquote(u); d = urllib.parse.urlparse(u).netloc.lower().removeprefix('www.')
            if d and not SKIP.search(d) and d not in doms: doms.append(d)
        return doms[:4]
    except Exception as e:
        print('ddg fail', q, e); return []

def wikidata(label, must):
    js = json.loads(get('https://www.wikidata.org/w/api.php?' + urllib.parse.urlencode({'action': 'wbsearchentities', 'search': label, 'language': 'en', 'format': 'json', 'limit': 5}), h=WUA)[0])
    for r in js.get('search', []):
        desc = (r.get('description') or '').lower()
        if must and not any(w.lower() in desc for w in must): continue
        ent = json.loads(get('https://www.wikidata.org/wiki/Special:EntityData/%s.json' % r['id'], h=WUA)[0])['entities'][r['id']]
        cl = ent.get('claims', {})
        site = ''
        try: site = cl['P856'][0]['mainsnak']['datavalue']['value']
        except Exception: pass
        for p in ('P154', 'P8972', 'P41'):
            if p in cl:
                try: fn = cl[p][0]['mainsnak']['datavalue']['value']
                except Exception: continue
                url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(fn.replace(' ', '_')) + '?width=512'
                return url, {'wd': r['id'], 'label': r.get('label'), 'desc': r.get('description'), 'file': fn, 'prop': p, 'site': site}
        return None, {'wd': r['id'], 'label': r.get('label'), 'desc': r.get('description'), 'site': site}
    return None, None

only = set(sys.argv[1:])
for slug, c in CFG.items():
    if only and slug not in only: continue
    if not only and slug in idx and os.path.exists(os.path.join(OUT, slug + '.png')): continue
    name = c['name']; key = [w for w in re.split(r'[^a-z0-9]+', name.lower()) if len(w) >= 3] or [name.lower()]
    must = [w.lower() for w in c.get('must', [])]
    done = False
    for u in c.get('img', []):
        try:
            im = img_from(u, WUA if 'wikimedia' in u else UA)
            if im and min(im.size) >= 48: save(slug, im, {'src': u, 'how': 'direct'}); done = True; break
        except Exception as e: print('imgfail', slug, u, e)
    if not done and c.get('x'):
        try:
            u = 'https://unavatar.io/x/' + c['x']; im = img_from(u)
            if im: save(slug, im, {'src': u, 'how': 'x'}); done = True
        except Exception as e: print('x fail', slug, e)
    if not done and c.get('wd'):
        try:
            u, rec = wikidata(c['wd'], c.get('wd_must', []))
            print('wd', slug, rec)
            if u:
                im = img_from(u, WUA)
                if im: rec.update(src=u, how='wikidata'); save(slug, im, rec, big=True); done = True
            elif rec and rec.get('site'):
                d = urllib.parse.urlparse(rec['site']).netloc.removeprefix('www.')
                c.setdefault('domains', []).insert(0, d)
        except Exception as e: print('wd fail', slug, e)
    doms = list(c.get('domains', []))
    if not done and c.get('q'):
        for d in ddg(c['q']):
            if d not in doms: doms.append(d)
    for dom in ([] if done else doms):
        try:
            raw, final = get('https://' + dom)
            html = raw.decode('utf-8', 'ignore'); low = html.lower()
            title = (re.search(r'<title[^>]*>(.*?)</title>', html, re.I | re.S) or [None, ''])[1].strip()[:120]
            if BAD.search(html[:30000]): print('parked', slug, dom); continue
            if not any(k in low for k in key[:2]): print('noname', slug, dom, title); continue
            if must and not any(w in low for w in must): print('nocontext', slug, dom, title); continue
            big, small = icons(html, final)
            cands = big + ['https://www.google.com/s2/favicons?domain=%s&sz=256' % urllib.parse.urlparse(final).netloc] + small
            for u in cands:
                try:
                    im = img_from(u)
                    if not im or min(im.size) < 64: continue
                    # Google returns a generic globe for unknown sites; reject near-empty icons
                    if len(set(im.convert('L').resize((32, 32)).getdata())) < 4: continue
                    save(slug, im, {'domain': dom, 'final': final, 'title': title, 'src': u, 'how': 'site'}); done = True; break
                except Exception as e: print('imgfail', slug, u, e)
            if done: break
        except Exception as e:
            print('FAIL', slug, dom, e)
    if not done: print('NONE', slug, doms)
    json.dump(idx, open(IDX, 'w'), indent=1, ensure_ascii=False)
