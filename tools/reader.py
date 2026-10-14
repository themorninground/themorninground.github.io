#!/usr/bin/env python3
"""Fetch story pages listed in tools/read.json for the editor to verify facts.
For each {"id", "url"} it saves the title, share image, publish date, site name, outbound links and the
paragraph text. The text is encrypted with the editor's public key (tools/reader_pub.pem) so the
repository never republishes anyone's article; only the editor can read data/read/<id>.bin."""
import json, os, re, io, base64, html as H, urllib.request, urllib.parse
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = serialization.load_pem_public_key(open(os.path.join(ROOT, 'tools', 'reader_pub.pem'), 'rb').read())
OUT = os.path.join(ROOT, 'data', 'read'); os.makedirs(OUT, exist_ok=True)
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
      'Accept-Language': 'en,ar;q=0.8', 'Accept': 'text/html,application/xhtml+xml'}
def meta(h, *names):
    for n in names:
        for pat in (r'<meta[^>]+(?:property|name|itemprop)=["\']%s["\'][^>]*content=["\']([^"\']*)' % re.escape(n),
                    r'<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name|itemprop)=["\']%s["\']' % re.escape(n)):
            m = re.search(pat, h, re.I)
            if m and m.group(1).strip(): return H.unescape(m.group(1)).strip()
    return ''
def clean(s):
    s = re.sub(r'<(script|style|noscript)[^>]*>.*?</\1>', ' ', s, flags=re.S | re.I)
    s = re.sub(r'<br\s*/?>', '\n', s, flags=re.I); s = re.sub(r'<[^>]+>', '', s)
    return re.sub(r'[ \t\r\f\v]+', ' ', H.unescape(s)).strip()
def seal(obj):
    key = AESGCM.generate_key(bit_length=256); nonce = os.urandom(12)
    ct = AESGCM(key).encrypt(nonce, json.dumps(obj, ensure_ascii=False).encode(), None)
    ek = PUB.encrypt(key, padding.OAEP(mgf=padding.MGF1(hashes.SHA256()), algorithm=hashes.SHA256(), label=None))
    return json.dumps({'k': base64.b64encode(ek).decode(), 'n': base64.b64encode(nonce).decode(), 'c': base64.b64encode(ct).decode()})
def gnews(url):
    gid = urllib.parse.urlparse(url).path.rstrip('/').split('/')[-1]
    page = urllib.request.urlopen(urllib.request.Request('https://news.google.com/rss/articles/%s' % gid, headers=UA), timeout=30).read().decode('utf-8', 'ignore')
    sg = re.search(r'data-n-a-sg="([^"]+)"', page).group(1); ts = re.search(r'data-n-a-ts="([^"]+)"', page).group(1)
    inner = '["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"%s",%s,"%s"]' % (gid, ts, sg)
    body = urllib.parse.urlencode({'f.req': json.dumps([[['Fbv4je', inner, None, 'generic']]])}).encode()
    req = urllib.request.Request('https://news.google.com/_/DotsSplashUi/data/batchexecute', data=body, headers=dict(UA, **{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}))
    txt = urllib.request.urlopen(req, timeout=30).read().decode('utf-8', 'ignore')
    arr = json.loads(txt.split('\n\n', 1)[1])
    return json.loads(arr[0][2])[1]
log = []
for it in json.load(open(os.path.join(ROOT, 'tools', 'read.json'))):
    out = os.path.join(OUT, it['id'] + '.bin')
    if os.path.exists(out) and not it.get('force'): continue
    rec = {'id': it['id'], 'url': it['url']}
    try:
        url = it['url']
        if 'news.google.com' in url:
            url = gnews(url); rec['resolved'] = url
        r = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30)
        raw = r.read(6_000_000); rec['final'] = r.geturl(); rec['status'] = r.status
        h = raw.decode(r.headers.get_content_charset() or 'utf-8', 'ignore')
        rec['title'] = meta(h, 'og:title', 'twitter:title') or clean((re.search(r'<title[^>]*>(.*?)</title>', h, re.S | re.I) or [0, ''])[1])
        rec['image'] = urllib.parse.urljoin(rec['final'], meta(h, 'og:image:secure_url', 'og:image', 'twitter:image'))
        rec['site'] = meta(h, 'og:site_name'); rec['desc'] = meta(h, 'og:description', 'description')
        rec['published'] = meta(h, 'article:published_time', 'datePublished', 'pubdate', 'publish-date', 'date') or (re.search(r'"datePublished"\s*:\s*"([^"]+)"', h) or [0, ''])[1]
        rec['author'] = meta(h, 'author', 'article:author') or (re.search(r'"author"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"', h) or [0, ''])[1]
        body = re.search(r'<article[^>]*>(.*?)</article>', h, re.S | re.I)
        scope = body.group(1) if body and len(body.group(1)) > 1500 else h
        paras = [clean(p) for p in re.findall(r'<(?:p|h2|h3|li|blockquote)[^>]*>(.*?)</(?:p|h2|h3|li|blockquote)>', scope, re.S | re.I)]
        rec['text'] = '\n'.join(p for p in paras if len(p) > 25)[:60000]
        rec['links'] = sorted(set(u for u in re.findall(r'href=["\'](https?://[^"\'#]+)', scope) if urllib.parse.urlparse(u).netloc != urllib.parse.urlparse(rec['final']).netloc))[:120]
        log.append('ok %s %s chars %s' % (it['id'], len(rec['text']), rec['final'][:120]))
    except Exception as e:
        rec['error'] = str(e); log.append('FAIL %s %s %s' % (it['id'], it['url'][:120], e))
    open(out, 'w').write(seal(rec))
open(os.path.join(OUT, 'last_run.txt'), 'w').write('\n'.join(log) + '\n')
print('\n'.join(log))
