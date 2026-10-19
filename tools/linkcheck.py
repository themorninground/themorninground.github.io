#!/usr/bin/env python3
"""Check that every reference link in tools/links.txt opens and is about the right thing (status + page title)."""
import json, os, re, html, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36', 'Accept': 'text/html', 'Accept-Language': 'en'}
out = []
for u in [l.strip() for l in open(os.path.join(ROOT, 'tools', 'links.txt')) if l.strip()]:
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=25); h = r.read(400000).decode('utf-8', 'replace')
        t = re.search(r'<title[^>]*>(.*?)</title>', h, re.S | re.I)
        out.append({'url': u, 'status': r.status, 'final': r.geturl(), 'title': html.unescape(t.group(1)).strip()[:160] if t else ''})
    except Exception as e:
        out.append({'url': u, 'status': getattr(e, 'code', 0), 'error': str(e)[:160]})
json.dump(out, open(os.path.join(ROOT, 'tools', 'links.json'), 'w'), indent=1)
