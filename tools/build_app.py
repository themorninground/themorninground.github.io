"""Builds index.html for the v4 site (The Morning Round) from app/ and brand/pack."""
import re, json, os, sys, urllib.parse
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def rd(p): return open(os.path.join(R, p)).read()
line = re.sub(r'<title>.*?</title>', '', rd('brand/pack/tmr-logo-line-color.svg')).replace('fill="#0B0D12"', 'fill="currentColor"')
line = re.sub(r' width="[\d.]+" height="[\d.]+"', '', line, count=1).replace('<svg ', '<svg aria-hidden="true" ', 1)
line = re.sub(r'<g clip-path="url\(#(c\d+)\)">', r'<g class="sun-g" clip-path="url(#\1)">', line)
st = re.sub(r'<title>.*?</title>', '', rd('brand/pack/tmr-logo-stacked-color-on-dark.svg')).replace('fill="#F2F3F5"', 'fill="currentColor"')
st = re.sub(r' width="[\d.]+" height="[\d.]+"', '', st, count=1).replace('<svg ', '<svg class="lg" aria-label="The Morning Round" ', 1)
m = re.search(r'<clipPath id="(c\d+)"><circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/></clipPath>(<g clip-path="url\(#c\d+\)">.*?</g>)', st)
cid, cx, cy, r, g = m.group(1), float(m.group(2)), float(m.group(3)), float(m.group(4)), m.group(5)
base = cy + r + 0.3
sun = f'<clipPath id="{cid}"><circle cx="{cx}" cy="{cy}" r="{r}"/></clipPath><clipPath id="hzc"><rect x="0" y="0" width="400" height="{base:.2f}"/></clipPath><g clip-path="url(#hzc)"><g class="sunrise">{g}</g></g>'
st = st[:m.start()] + sun + st[m.end():]
k = [0]
def wcls(mm):
    k[0] += 1
    return f'<path class="w w{k[0]}" ' + mm.group(1)
st = re.sub(r'<path (fill=)', wcls, st)
sys.path.insert(0, '/tmp/claude-0/-home-claude/afce4adc-5ec0-5c8a-9b96-7f7bb3828fbd/scratchpad/article')
charts = {}
cf = os.path.join(R, 'app/data/charts.json')
try:
    from charts import build
    charts = {'nvp': build('ar')['nvp']}
    json.dump(charts, open(cf, 'w'), ensure_ascii=False)
except Exception:
    charts = json.load(open(cf))
sunsvg = re.sub(r'<title>.*?</title>', '', rd('brand/pack/tmr-sun-small.svg'))
fav = 'data:image/svg+xml,' + urllib.parse.quote(sunsvg, safe=" =:/'\"")
html = f'''<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>The Morning Round</title>
<meta name="description" content="جولة الصباح: مقالة ومفهوم وصفقات اليوم في الاستثمار الجريء والأسواق الخاصة. Every page compounds.">
<meta property="og:title" content="The Morning Round">
<meta property="og:description" content="Every page compounds.">
<meta property="og:image" content="https://themorninground.github.io/brand/pack/png/tmr-avatar-1080.png">
<meta name="theme-color" content="#0B0D12">
<link rel="icon" href="favicon.ico?v=3" sizes="48x48">
<link rel="icon" href="favicon.svg?v=3" type="image/svg+xml">
<link rel="icon" href="favicon-32.png?v=3" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="brand/pack/png/tmr-app-icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Newsreader:opsz,wght@6..72,400..700&display=swap">
<link rel="stylesheet" href="app/app.css?v=VER">
</head>
<body>
<script>window.TMR_LOGO_LINE={json.dumps(line)};window.TMR_LOGO_STACK={json.dumps(st)};window.TMR_CHARTS={json.dumps(charts, ensure_ascii=False)};</script>
<script src="app/labs.js?v=VER" defer></script>
<script src="app/app.js?v=VER" defer></script>
</body>
</html>
'''
import time
html = html.replace('VER', str(int(time.time())))
out = sys.argv[1] if len(sys.argv) > 1 else 'index.html'
open(os.path.join(R, out), 'w').write(html)
print(out, len(html))
