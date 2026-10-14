#!/usr/bin/env python3
"""The Morning Round radar. Runs in GitHub Actions every two hours.

1. Reads tools/sources.json (the source registry).
2. Finds each source's RSS/Atom feed (cached in tools/feeds.json) and reads it.
3. Runs Google News searches (English and Arabic) on VC, startup, funding, IPO and
   fintech topics in Saudi Arabia, the GCC, MENA and the world.
4. Keeps headlines that are on-topic, removes duplicates, and writes data/radar.json.
5. Any news outlet seen in Google News that is not in the registry yet is added to
   tools/sources.json automatically (auto: true), so the source list keeps growing.
Only headlines, links, dates and short summaries are stored; every item links to the original story.
"""
import json, os, re, time, hashlib, html, urllib.request, urllib.parse
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from datetime import datetime, timezone, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REG = os.path.join(ROOT, 'tools', 'sources.json')
FEEDS = os.path.join(ROOT, 'tools', 'feeds.json')
OUT = os.path.join(ROOT, 'data', 'radar.json')
UA = {'User-Agent': 'Mozilla/5.0 (compatible; TheMorningRoundRadar/1.0; +https://themorninground.github.io)'}
NOW = datetime.now(timezone.utc)
KEEP_DAYS = 45
START = time.time(); BUDGET = 25 * 60

reg = json.load(open(REG))
feeds = json.load(open(FEEDS)) if os.path.exists(FEEDS) else {}
old = json.load(open(OUT)) if os.path.exists(OUT) else {'items': []}

TOPIC = re.compile(r"(startup|start-up|venture|\bVC\b|funding|raises?|raised|round|seed|series [a-f]|pre-seed|unicorn|valuation|acqui|merger|\bM&A\b|IPO|listing|fintech|investor|invest(s|ment)|fund\b|fund |capital|private equity|accelerator|incubator|"
                   r"شركة ناشئة|الشركات الناشئة|ناشئة|تمويل|جولة|استثمار|الاستثمار الجريء|رأس المال الجريء|مستثمر|استحواذ|اندماج|طرح|اكتتاب|يونيكورن|تقييم|صندوق|التقنية المالية|مسرعة|حاضنة)", re.I)
VC_KINDS = {'vc', 'essays'}
STRICT = re.compile(r"(start-?up|venture|\bVC\b|raises?|raised|funding round|series [a-f]\b|pre-seed|seed round|unicorn|valuation|acquires?|acquisition|IPO|fintech|accelerator|"
                    r"شركة ناشئة|الشركات الناشئة|ناشئة|جولة|تمويل|الاستثمار الجريء|رأس المال الجريء|استحواذ|طرح عام|اكتتاب|يونيكورن|تقنية مالية|التقنية المالية)", re.I)
JUNK = re.compile(r"sport|football|soccer|celebrity|weather|horoscope|gaming news|entertainment|tv guide|recipes|bulletin|daily mail|tabloid", re.I)
PER_SRC = 40

GNEWS = [
    ('en', 'SA', 'Saudi startup raises funding'), ('en', 'SA', 'Saudi Arabia venture capital'),
    ('en', 'AE', 'UAE startup raises'), ('en', 'AE', 'MENA startup funding round'),
    ('en', 'EG', 'Egypt startup raises'), ('en', 'SA', 'Saudi fintech funding'),
    ('en', 'SA', 'Tadawul IPO'), ('en', 'SA', 'PIF venture investment'),
    ('en', 'US', 'startup raises Series A'), ('en', 'US', 'venture capital funding round'),
    ('en', 'US', 'AI startup valuation billion'), ('en', 'US', 'corporate venture capital'),
    ('en', 'GB', 'Europe startup funding round'),
    ('ar', 'SA', 'شركة ناشئة سعودية تجمع'), ('ar', 'SA', 'جولة تمويلية شركة ناشئة'),
    ('ar', 'SA', 'الاستثمار الجريء السعودية'), ('ar', 'SA', 'استحواذ شركة ناشئة'),
    ('ar', 'SA', 'طرح عام أولي تداول'), ('ar', 'AE', 'شركة ناشئة إماراتية تمويل'),
    ('ar', 'EG', 'شركة ناشئة مصرية تمويل'), ('ar', 'SA', 'التقنية المالية السعودية تمويل'),
]

def get(url, n=4_000_000, t=15):
    r = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=t)
    return r.read(n), r.geturl()

def dom(u):
    try: return urllib.parse.urlparse(u).netloc.lower().replace('www.', '')
    except Exception: return ''

def strip(s):
    s = html.unescape(re.sub(r'<[^>]+>', ' ', s or ''))
    return re.sub(r'\s+', ' ', s).strip()

def pdate(s):
    if not s: return None
    try: return parsedate_to_datetime(s).astimezone(timezone.utc)
    except Exception: pass
    try: return datetime.fromisoformat(s.replace('Z', '+00:00')).astimezone(timezone.utc)
    except Exception: return None

def parse_feed(raw):
    out = []
    try: root = ET.fromstring(raw)
    except Exception: return out
    tag = lambda e: e.tag.split('}')[-1]
    for it in root.iter():
        if tag(it) not in ('item', 'entry'): continue
        d = {}
        for c in it:
            k = tag(c)
            if k == 'title': d['t'] = strip(c.text)
            elif k == 'link':
                d['url'] = c.get('href') or (c.text or '').strip() or d.get('url')
            elif k in ('pubDate', 'published', 'updated', 'date') and 'date' not in d: d['date'] = pdate(c.text)
            elif k in ('description', 'summary') and 'sum' not in d: d['sum'] = strip(c.text)[:280]
            elif k == 'source': d['gsrc'] = (strip(c.text), c.get('url'))
        if d.get('t') and d.get('url'): out.append(d)
    return out

def find_feed(src):
    if src['id'] in feeds: return feeds[src['id']]
    base = src['url'].rstrip('/')
    cands = []
    try:
        raw, final = get(base, 600_000)
        h = raw.decode('utf-8', 'ignore')
        for m in re.finditer(r'<link[^>]+>', h, re.I):
            tg = m.group(0)
            if re.search(r'type=["\']application/(rss|atom)\+xml', tg, re.I):
                hr = re.search(r'href=["\']([^"\']+)', tg)
                if hr: cands.append(urllib.parse.urljoin(final, html.unescape(hr.group(1))))
    except Exception as e:
        print('home fail', src['id'], e)
    cands += [base + p for p in ('/feed', '/feed/', '/rss', '/rss.xml', '/feed.xml', '/atom.xml', '/index.xml')]
    for c in cands:
        try:
            raw, _ = get(c, 2_000_000, 10)
            if parse_feed(raw):
                feeds[src['id']] = c; print('feed', src['id'], c); return c
        except Exception:
            continue
    feeds[src['id']] = ''
    return ''

items = {x['id']: x for x in old.get('items', [])}
by_dom = {dom(s['url']): s for s in reg if s.get('url')}
added_sources = []

per_src = {}
def keep(d, src, force=False):
    if not d.get('date'): d['date'] = NOW
    if d['date'] < NOW - timedelta(days=KEEP_DAYS): return
    txt = d['t'] + ' ' + d.get('sum', '')
    rx = STRICT if src.get('kind') in ('discovered', 'media', 'official', 'reports', 'press') or src.get('tier', 2) >= 3 and src.get('kind') != 'essays' else TOPIC
    if not force and not rx.search(txt): return
    per_src[src['id']] = per_src.get(src['id'], 0) + 1
    if per_src[src['id']] > PER_SRC: return
    key = hashlib.sha1(re.sub(r'\W+', '', d['t'].lower())[:90].encode()).hexdigest()[:12]
    if key in items:
        it = items[key]
        if src['id'] not in it.get('also', []) and src['id'] != it['src']: it.setdefault('also', []).append(src['id'])
        return
    ar = bool(re.search(r'[؀-ۿ]', d['t']))
    items[key] = {'id': key, 't': d['t'], 'url': d['url'], 'src': src['id'], 'date': d['date'].strftime('%Y-%m-%dT%H:%M:%SZ'),
                  'lang': 'ar' if ar else 'en', 'sum': d.get('sum', '')[:240], 'kind': src.get('kind', 'media')}

# 1. registry feeds
for s in reg:
    if time.time() - START > BUDGET: break
    if not s.get('url'): continue
    f = s.get('feed') or find_feed(s)
    if not f: continue
    try:
        raw, _ = get(f)
        n = 0
        for d in parse_feed(raw)[:60]:
            keep(d, s, force=s.get('kind') in VC_KINDS); n += 1
        s['last_ok'] = NOW.strftime('%Y-%m-%d')
    except Exception as e:
        print('feed fail', s['id'], e)

# 2a. sources without a readable feed are read through Google News 'site:' searches
for s_ in reg:
    if time.time() - START > BUDGET: break
    if s_.get('auto') or not s_.get('url') or feeds.get(s_['id']): continue
    d0 = dom(s_['url'])
    if not d0: continue
    lang = 'ar' if s_.get('lang') == ['ar'] else 'en'
    q = 'site:' + d0 + ' when:14d'
    url = 'https://news.google.com/rss/search?' + urllib.parse.urlencode({'q': q, 'hl': 'ar' if lang == 'ar' else 'en-US', 'gl': 'SA' if lang == 'ar' else 'US', 'ceid': 'SA:ar' if lang == 'ar' else 'US:en'})
    try:
        raw, _ = get(url)
        for d in parse_feed(raw)[:40]:
            name = (d.get('gsrc') or ('', ''))[0]
            if name: d['t'] = re.sub(r'\s+-\s+' + re.escape(name) + r'$', '', d['t'])
            keep(d, s_, force=s_.get('kind') in VC_KINDS)
        s_['via'] = 'gnews'; s_['last_ok'] = NOW.strftime('%Y-%m-%d')
    except Exception as e:
        print('site fail', s_['id'], e)

# 2b. Google News topic searches, with automatic discovery of new outlets
cand = {}
for lang, gl, q in GNEWS:
    if time.time() - START > BUDGET: break
    hl = 'ar' if lang == 'ar' else 'en-US'
    url = 'https://news.google.com/rss/search?' + urllib.parse.urlencode({'q': q + ' when:7d', 'hl': hl, 'gl': gl, 'ceid': '%s:%s' % (gl, 'ar' if lang == 'ar' else 'en')})
    try:
        raw, _ = get(url)
    except Exception as e:
        print('gnews fail', q, e); continue
    for d in parse_feed(raw):
        name, surl = d.get('gsrc') or ('', '')
        dd = dom(surl)
        src = by_dom.get(dd)
        if not src and dd:
            if JUNK.search(name + ' ' + dd) or not STRICT.search(d['t']): continue
            cand.setdefault(dd, {'name': name or dd, 'lang': lang, 'gl': gl, 'items': []})['items'].append(d)
            continue
        if not src: continue
        t = re.sub(r'\s+-\s+' + re.escape(name) + r'$', '', d['t']) if name else d['t']
        d['t'] = t
        keep(d, src)

for dd, c in cand.items():
    if len(c['items']) < 2: continue
    sid = re.sub(r'[^a-z0-9]+', '', dd.split('.')[0])[:24] or dd
    while any(x['id'] == sid for x in reg): sid += 'x'
    src = {'id': sid, 'name': c['name'], 'ar': c['name'], 'url': 'https://' + dd, 'tier': 4, 'kind': 'discovered',
           'lang': [c['lang']], 'region': c['gl'], 'auto': True, 'found': NOW.strftime('%Y-%m-%d')}
    reg.append(src); by_dom[dd] = src; added_sources.append(src['name'])
    for d in c['items']:
        d['t'] = re.sub(r'\s+-\s+' + re.escape(c['name']) + r'$', '', d['t']); keep(d, src)

lst = sorted(items.values(), key=lambda x: x['date'], reverse=True)
lst = [x for x in lst if x['date'] >= (NOW - timedelta(days=KEEP_DAYS)).strftime('%Y-%m-%dT%H:%M:%SZ')][:2000]
counts = {}
for x in lst: counts[x['src']] = counts.get(x['src'], 0) + 1
json.dump({'updated': NOW.strftime('%Y-%m-%dT%H:%M:%SZ'), 'n': len(lst), 'counts': counts, 'items': lst}, open(OUT, 'w'), ensure_ascii=False)
json.dump(feeds, open(FEEDS, 'w'), indent=1)
json.dump(reg, open(REG, 'w'), indent=1, ensure_ascii=False)
print('radar items', len(lst), 'sources', len(reg), 'new sources', added_sources[:50])
