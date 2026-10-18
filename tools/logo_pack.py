"""Build The Morning Round logo pack: text converted to outlines from Bricolage Grotesque."""
import io, json, os, subprocess, urllib.request
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

OUT = 'brand/pack'; os.makedirs(OUT, exist_ok=True)
def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'tmr-pack'})
    return urllib.request.urlopen(req, timeout=60).read()
lst = json.loads(get('https://api.github.com/repos/google/fonts/contents/ofl/bricolagegrotesque'))
ttf = [x for x in lst if x['name'].endswith('.ttf') and 'Italic' not in x['name']][0]
print('font', ttf['name'])
raw = get(ttf['download_url'])
os.makedirs('brand/fonts', exist_ok=True)
open('brand/fonts/BricolageGrotesque-Variable.ttf', 'wb').write(raw)
try:
    open('brand/fonts/OFL-Bricolage.txt', 'wb').write(get('https://raw.githubusercontent.com/google/fonts/main/ofl/bricolagegrotesque/OFL.txt'))
except Exception as e:
    print('ofl', e)
f = TTFont(io.BytesIO(raw))
axes = {a.axisTag for a in f['fvar'].axes}
loc = {k: v for k, v in {'wght': 700, 'opsz': 36, 'wdth': 100}.items() if k in axes}
inst = instancer.instantiateVariableFont(f, loc)
buf = io.BytesIO(); inst.save(buf); data = buf.getvalue()
inst = TTFont(io.BytesIO(data))
upem = inst['head'].unitsPerEm
os2 = inst['OS/2']
if os2.fsSelection & (1 << 7):
    ASC, DESC = os2.sTypoAscender, -os2.sTypoDescender
else:
    ASC, DESC = inst['hhea'].ascent, -inst['hhea'].descent
gs = inst.getGlyphSet(); order = inst.getGlyphOrder()
hbfont = hb.Font(hb.Face(hb.Blob(data)))

def shape(text):
    b = hb.Buffer(); b.add_str(text); b.guess_segment_properties()
    hb.shape(hbfont, b, {'kern': True, 'liga': True})
    return [(order[i.codepoint], p.x_advance, p.x_offset, p.y_offset) for i, p in zip(b.glyph_infos, b.glyph_positions)]

def glyph_bounds(name):
    bp = BoundsPen(gs); gs[name].draw(bp); return bp.bounds

class Run:
    def __init__(self): self.paths = []; self.box = [1e9, 1e9, -1e9, -1e9]
    def ink(self, x0, y0, x1, y1):
        b = self.box; b[0] = min(b[0], x0); b[1] = min(b[1], y0); b[2] = max(b[2], x1); b[3] = max(b[3], y1)
    def text(self, txt, x, base, size, ls, fill):
        s = size / upem; d = []
        for name, adv, xo, yo in shape(txt):
            pen = SVGPathPen(gs)
            gs[name].draw(TransformPen(pen, (s, 0, 0, -s, x + xo * s, base - yo * s)))
            cmd = pen.getCommands()
            if cmd:
                d.append(cmd); bb = glyph_bounds(name)
                if bb: self.ink(x + bb[0] * s, base - bb[3] * s, x + bb[2] * s, base - bb[1] * s)
            x += adv * s + ls
        self.paths.append(f'<path fill="{fill}" d="{" ".join(d)}"/>')
        return x
    def ink_top(self, txt, base, size):
        s = size / upem; return base - max(glyph_bounds(n)[3] for n, *_ in shape(txt) if glyph_bounds(n)) * s

SKY = '#3EA6F2'
BANDS = [(0, 50, SKY), (54, 63, '#FFD45C'), (67.5, 75.5, '#FFA235'), (80.5, 87.5, '#FF7A24'), (93, 100, '#F2551A')]
SMALL = [(0, 50, SKY), (57, 71, '#FFA235'), (79, 100, '#F2551A')]
STEPS = [(0, .5, SKY), (.5, .625, '#FFD45C'), (.625, .75, '#FFA235'), (.75, .875, '#FF7A24'), (.875, 1, '#F2551A')]
uid = [0]
def sun_svg(x, y, d, mono=None, bands=BANDS):
    uid[0] += 1; cid = f'c{uid[0]}'
    k = d / 100
    rects = ''.join(f'<rect x="{x:.3f}" y="{y + a * k:.3f}" width="{d:.3f}" height="{(b - a) * k:.3f}" fill="{mono or c}"/>' for a, b, c in bands)
    return f'<clipPath id="{cid}"><circle cx="{x + d / 2:.3f}" cy="{y + d / 2:.3f}" r="{d / 2:.3f}"/></clipPath><g clip-path="url(#{cid})">{rects}</g>'
def grad(top, base, mono=None):
    if mono: return mono, ''
    uid[0] += 1; gid = f'g{uid[0]}'
    stops = ''.join(f'<stop offset="{a}" stop-color="{c}"/><stop offset="{b}" stop-color="{c}"/>' for a, b, c in STEPS)
    return f'url(#{gid})', f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="0" y1="{top:.3f}" x2="0" y2="{base:.3f}">{stops}</linearGradient>'

def o_metrics(size):
    s = size / upem; name, adv, *_ = shape('o')[0]; b = glyph_bounds(name)
    h = (b[3] - b[1]) * s * 1.04; desc = -b[1] * s
    return adv * s, h, desc

F = 100.0; LS = -0.022 * F
def base_in(box_h, size): return (box_h - (ASC + DESC) * size / upem) / 2 + ASC * size / upem

def morning(run, x, base, size, ink, mono):
    ls = -0.022 * size
    x = run.text('m', x, base, size, ls, ink)
    adv, h, desc = o_metrics(size)
    bottom = base + desc + 0.02 * h
    sx = x + (adv - h) / 2
    run.paths.append(sun_svg(sx, bottom - h, h, mono)); run.ink(sx, bottom - h, sx + h, bottom)
    x += adv
    return run.text('rning', x, base, size, ls, ink)

def stacked(ink, mono=None):
    run = Run(); ts = 0.34 * F
    tb = base_in(ts, ts); tx = 0.06 * ts
    top1 = ts * 1.0 + 0.04 * ts + 0.16 * ts
    b1 = top1 + base_in(0.86 * F, F); b2 = b1 + 0.86 * F
    gfill, gdef = grad(run.ink_top('the', tb, ts), tb, mono)
    run.text('the', tx, tb, ts, -0.01 * ts, gfill)
    morning(run, 0, b1, F, ink, mono)
    run.text('round', 0, b2, F, LS, ink)
    return run, gdef
def oneline(ink, mono=None):
    run = Run(); b = base_in(F, F)
    gfill, gdef = grad(run.ink_top('the', b, F), b, mono)
    x = run.text('the', 0, b, F, LS, gfill)
    sp = shape(' ')[0][1] * F / upem
    x = morning(run, x + sp, b, F, ink, mono)
    run.text('round', x + sp, b, F, LS, ink)
    return run, gdef
def write(name, run, gdef, pad=0):
    x0, y0, x1, y1 = run.box; x0 -= pad; y0 -= pad; x1 += pad; y1 += pad
    w, h = x1 - x0, y1 - y0
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.2f} {y0:.2f} {w:.2f} {h:.2f}" width="{w:.1f}" height="{h:.1f}">'
           f'<title>The Morning Round</title><defs>{gdef}</defs>{"".join(run.paths)}</svg>')
    open(f'{OUT}/{name}.svg', 'w').write(svg); return name, w, h

CARBON, LIGHT = '#0B0D12', '#F2F3F5'
made = []
for kind, fn in (('stacked', stacked), ('line', oneline)):
    made.append(write(f'tmr-logo-{kind}-color', *fn(CARBON)))
    made.append(write(f'tmr-logo-{kind}-color-on-dark', *fn(LIGHT)))
    made.append(write(f'tmr-logo-{kind}-black', *fn(CARBON, CARBON)))
    made.append(write(f'tmr-logo-{kind}-white', *fn('#FFFFFF', '#FFFFFF')))
def icon_file(name, body, size=100):
    open(f'{OUT}/{name}.svg', 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}"><title>The Morning Round</title>{body}</svg>')
icon_file('tmr-sun', sun_svg(0, 0, 100))
icon_file('tmr-sun-small', sun_svg(0, 0, 100, bands=SMALL))
icon_file('tmr-sun-black', sun_svg(0, 0, 100, CARBON))
icon_file('tmr-sun-white', sun_svg(0, 0, 100, '#FFFFFF'))
icon_file('tmr-app-icon', f'<rect width="100" height="100" rx="22" fill="{CARBON}"/>' + sun_svg(21, 21, 58))
icon_file('tmr-app-icon-small', f'<rect width="100" height="100" rx="22" fill="{CARBON}"/>' + sun_svg(18, 18, 64, bands=SMALL))
icon_file('tmr-avatar', f'<circle cx="50" cy="50" r="50" fill="{CARBON}"/>' + sun_svg(22, 22, 56))

def png(svg, out, w=None, h=None):
    cmd = ['rsvg-convert', svg, '-o', out]
    if w: cmd += ['-w', str(w)]
    if h: cmd += ['-h', str(h)]
    subprocess.run(cmd, check=True)
os.makedirs(f'{OUT}/png', exist_ok=True)
for name, w, h in made:
    png(f'{OUT}/{name}.svg', f'{OUT}/png/{name}.png', h=600 if 'stacked' in name else 240)
for n, sizes in (('tmr-app-icon', [180, 512, 1024]), ('tmr-app-icon-small', [16, 32, 48]), ('tmr-avatar', [400, 1080]), ('tmr-sun', [512])):
    for s in sizes: png(f'{OUT}/{n}.svg', f'{OUT}/png/{n}-{s}.png', w=s, h=s)
json.dump({'font': ttf['name'], 'location': loc, 'upem': upem, 'files': sorted(os.listdir(OUT)) + sorted('png/' + x for x in os.listdir(OUT + '/png'))}, open(f'{OUT}/manifest.json', 'w'), indent=1)
print('done', len(made))
