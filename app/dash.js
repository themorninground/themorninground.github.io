/* The Morning Round — dashboard (D3). Every month a sun, every country a sun, every deal a ray. */
(function () {
'use strict';
const SUNC = ['#3EA6F2', '#FFD45C', '#FFA235', '#FF7A24', '#F2551A'];
const PAL = ['#3EA6F2', '#FFD45C', '#FF7A24', '#1F7FC8', '#FFA235', '#F2551A', '#8DCBF7', '#FFE59A'];
const GEO = { KSA: '682', UAE: '784', EGY: '818', MAR: '504', QAT: '634', SYR: '760', JOR: '400', OMN: '512', BHR: '048', KWT: '414', TUN: '788', LBN: '422', IRQ: '368', PSE: '275', YEM: '887', LBY: '434', DZA: '012', SDN: '729', PAK: '586', TUR: '792' };
const SECT = { 'Enterprise AI': 'AI', HRtech: 'HR tech', 'Online services': 'E-services' };
let X, F, root, M, ALLM, MK, geo, tip, SS = {}, timers = [];

function render(el, ctx) {
 X = ctx; root = el; timers.forEach(clearInterval); timers = [];
 const S = X.SITE.collections.meta.series || {};
 M = (S.months || []).filter(m => m.total != null).map(m => Object.assign({}, m, { countries: norm(m.countries) }));
 const rm = [...new Set(X.ROUNDS.filter(d => GEO[d.market]).map(d => (d.date || '').slice(0, 7)).filter(m => m >= '2026-01'))].sort();
 ALLM = [...new Set(M.map(m => m.m).concat(rm))].sort();
 F = { p: 'ytd', c: 'all', sel: null, inv: null, sec: null, kind: 'all', q: '', sort: 'date', dir: -1, n: 25, mapk: 0 };
 const qq = X.q; if (qq.get('c')) F.c = qq.get('c'); if (qq.get('co')) F.q = qq.get('co');
 tip = document.querySelector('.dtip') || document.body.appendChild(Object.assign(document.createElement('div'), { className: 'dtip' }));
 const T = X.tr;
 el.innerHTML = `${el.querySelector('.phead').outerHTML}
  <div class="dfbar" id="dfbar"><div class="seg" id="dper"><span class="pill"></span>${[['ytd', '2026'], ['q1', T('الربع 1', 'Q1')], ['q2', T('الربع 2', 'Q2')], ['q3', T('الربع 3', 'Q3')], ['q4', T('الربع 4', 'Q4')]].filter(p => periodMonths(p[0]).length).map(([k, l]) => `<button data-p="${k}" aria-pressed="${F.p === k}">${l}</button>`).join('')}</div>
   <div class="cchips" id="dctry"></div></div>
  <section class="kpis5" id="kpis"></section>
  <section class="panel sunrise rv" id="p-sun"><div class="ph"><h3>${T('شروق السوق', 'Market sunrise')}</h3><small>${T('كل شهر شمس: حجمها التمويل، وارتفاعها عدد الصفقات', 'Each month is a sun: its size is funding, its height is the number of deals')}</small><span class="hint">${T('اضغط على شمس لتنطلق صفقاتها', 'Tap a sun to release its deals')}</span></div><div class="chart" id="c-sun"></div><div id="d-sun"></div><div class="srcl" id="s-sun"></div></section>
  <section class="panel maplive rv" id="p-map"><div class="ph"><h3>${T('خريطة المنطقة', 'The region, live')}</h3><small>${T('كل دولة شمس بحجم تمويلها. حرّك الزمن أو شغّله', 'Each country is a sun sized by its funding. Move or play time')}</small></div>
   <div class="mapgrid"><div class="chart" id="c-map"></div><aside class="mside" id="m-side"></aside></div>
   <div class="tline"><button class="play" id="mplay" aria-label="play">${X.ic('play')}</button><input type="range" id="mrange" min="0" value="0" step="1"><span class="tl" id="mlab"></span></div><div class="srcl" id="s-map"></div></section>
  <section class="panel compare rv" id="p-cmp"></section>
  <section class="panel stream rv" id="p-sec"><div class="ph"><h3>${T('القطاعات', 'Sectors')}</h3><small id="sec-sub"></small><span class="hint">${T('اضغط على قطاع لتصفية الجدول', 'Tap a sector to filter the table')}</span></div><div class="chart" id="c-sec"></div><div class="srcl" id="s-sec"></div></section>
  <section class="panel night rv" id="p-inv"><div class="ph"><h3>${T('كوكبة المستثمرين', 'Investor constellation')}</h3><small>${T('كل مستثمر شمس، وشركاته تدور حوله. المستثمرون المشتركون يلتقون عند الشركة نفسها. اسحب أي نقطة', 'Each investor is a sun with its companies in orbit; co-investors meet at the same company. Drag anything')}</small></div><div class="chart" id="c-inv"></div><div class="srcl" id="s-inv"></div></section>
  <section class="panel rounds rv" id="p-tab"><div class="ph"><h3>${T('جدول الجولات', 'Rounds table')}</h3><small id="tab-sub"></small></div><div class="tfil" id="tfil"></div><div id="tab"></div></section>
  <p class="dnote">${T('الإجماليات الشهرية والدول من تقارير ومضة الشهرية، والمقارنة بين المصادر من تقارير ماقنت وبيتشبوك المنشورة. قوائم الصفقات والقطاعات حين تختار دولة، والمستثمرون، من الصفقات التي رصدناها بأسمائها، كل صفقة برابط خبرها.', "Monthly totals and countries come from Wamda's monthly reports; the source comparison uses published MAGNiTT and PitchBook figures. Deal lists, per-country sectors and investors come from the deals we track by name, each linked to its story.")}</p>`;
 fetch('app/data/market.json').then(r => r.json()).then(j => { MK = j; drawCompare(); }).catch(() => {});
 bindBar(); update(true);
 X.reveal();
 if (qq.get('s') === 'rounds') setTimeout(() => document.getElementById('p-tab').scrollIntoView({ behavior: 'smooth' }), 400);
 if (F.q) setTimeout(() => document.getElementById('p-tab').scrollIntoView({ behavior: 'smooth' }), 400);
}
window.TMRDash = { render };

/* ---------- helpers ---------- */
function norm(c) { const o = {}; Object.entries(c || {}).forEach(([k, v]) => { const kk = { Egypt: 'EGY' }[k] || k; o[kk] = v; }); return o; }
function periodMonths(p) {
 const q = { q1: ['01', '02', '03'], q2: ['04', '05', '06'], q3: ['07', '08', '09'], q4: ['10', '11', '12'] }[p];
 const all = ALLM || []; return q ? all.filter(m => q.includes(m.slice(5))) : all;
}
const PM = () => periodMonths(F.p);
const mName = m => X.MON()[+m.slice(5) - 1];
const inP = (d, ms) => ms.includes((d.date || '').slice(0, 7));
function roundsIn(ms, o = {}) {
 return X.ROUNDS.filter(d => inP(d, ms) && GEO[d.market] && (F.c === 'all' || d.market === F.c) && (!o.inv || (d.investors || []).some(i => i.name === o.inv)) && (!o.sec || sec(d.industry) === o.sec) && (!o.kind || o.kind === 'all' || d.k === o.kind));
}
const sec = s => SECT[s] || s || 'Other';
/* a month's value for the current country: Wamda first, tracked deals otherwise */
function mv(m) {
 const S = M.find(x => x.m === m); const tr = roundsIn([m]);
 const trv = [tr.reduce((s, d) => s + (d.amount || 0), 0), tr.length];
 if (S) { if (F.c === 'all') return { v: S.total, n: S.deals, src: 'w' }; const c = S.countries[F.c]; if (c) return { v: c[0], n: c[1], src: 'w' }; }
 return { v: trv[0], n: trv[1], src: 't', partial: true };
}
function tipShow(e, html) { tip.innerHTML = html; tip.classList.add('on'); const w = tip.offsetWidth, h = tip.offsetHeight; let x = e.clientX + 14, y = e.clientY - h - 14; if (x + w > innerWidth - 8) x = e.clientX - w - 14; if (y < 8) y = e.clientY + 18; tip.style.transform = `translate(${x}px,${y}px)`; }
function tipHide() { tip.classList.remove('on'); }
const src = (name, url) => `<a href="${X.esc(url)}" target="_blank" rel="noopener">${X.ic('source')} ${X.esc(name)}</a>`;
function sunDefs(svg, id) {
 const d = svg.append('defs');
 const g = d.append('linearGradient').attr('id', id).attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 1);
 [[0, SUNC[0]], [.5, SUNC[0]], [.5, SUNC[1]], [.625, SUNC[1]], [.625, SUNC[2]], [.75, SUNC[2]], [.75, SUNC[3]], [.875, SUNC[3]], [.875, SUNC[4]], [1, SUNC[4]]].forEach(([o, c]) => g.append('stop').attr('offset', o).attr('stop-color', c));
 const r = d.append('radialGradient').attr('id', id + 'g'); r.append('stop').attr('offset', 0).attr('stop-color', '#FFA235').attr('stop-opacity', .45); r.append('stop').attr('offset', 1).attr('stop-color', '#FFA235').attr('stop-opacity', 0);
 return d;
}
function logoNode(sel, name, s) {
 const u = X.logoOf(name);
 sel.append('rect').attr('x', -s / 2).attr('y', -s / 2).attr('width', s).attr('height', s).attr('rx', s * .28).attr('class', 'lbg');
 if (u) sel.append('image').attr('href', u).attr('x', -s * .38).attr('y', -s * .38).attr('width', s * .76).attr('height', s * .76).attr('preserveAspectRatio', 'xMidYMid meet');
 else sel.append('text').attr('class', 'lt').attr('text-anchor', 'middle').attr('dy', '.35em').text((name || '?').replace(/^(the|al)[\s-]/i, '').slice(0, 2));
}

/* ---------- filter bar ---------- */
function bindBar() {
 const per = document.getElementById('dper');
 requestAnimationFrame(() => X.placePill(per));
 per.querySelectorAll('button').forEach(b => b.onclick = () => { F.p = b.dataset.p; F.sel = null; F.mapk = 0; per.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); X.placePill(per); update(); });
}
function drawCountryChips() {
 const ms = PM(); const tot = {};
 M.filter(m => ms.includes(m.m)).forEach(m => Object.entries(m.countries).forEach(([k, v]) => { tot[k] = (tot[k] || 0) + (v[0] || 0); }));
 X.ROUNDS.filter(d => inP(d, ms) && d.market && d.market !== 'Global').forEach(d => { if (!(d.market in tot)) tot[d.market] = 0; });
 if (F.c !== 'all' && !(F.c in tot)) tot[F.c] = 0;
 const list = Object.keys(tot).filter(k => GEO[k]).sort((a, b) => tot[b] - tot[a]);
 const el = document.getElementById('dctry');
 el.innerHTML = `<button data-c="all" aria-pressed="${F.c === 'all'}">${X.tr('كل المنطقة', 'All MENA')}</button>` + list.map(k => `<button data-c="${k}" aria-pressed="${F.c === k}">${X.esc(X.mkt(k))}</button>`).join('');
 el.querySelectorAll('button').forEach(b => b.onclick = () => setCountry(b.dataset.c));
}
function setCountry(c) { F.c = F.c === c ? 'all' : c; F.sel = null; update(); }
function update(first) {
 drawCountryChips(); drawKPIs(); drawSun(first); drawMap(first); drawStream(); drawInv(); drawTable();
 document.getElementById('d-sun').innerHTML = '';
}

/* ---------- KPIs ---------- */
function drawKPIs() {
 const T = X.tr; const ms = PM(); const wm = ms.filter(m => M.some(x => x.m === m));
 const sum = list => list.reduce((s, m) => { const v = mv(m); return [s[0] + (v.v || 0), s[1] + (v.n || 0), s[2] || v.src === 't']; }, [0, 0, false]);
 const cur = sum(wm.length ? wm : ms);
 const order = ['q1', 'q2', 'q3', 'q4']; const pi = order.indexOf(F.p); const prev = pi > 0 ? periodMonths(order[pi - 1]).filter(m => M.some(x => x.m === m)) : [];
 const pv = prev.length ? sum(prev) : null; const ch = (a, b) => b ? Math.round((a - b) / b * 100) : null;
 const c1 = pv && wm.length ? ch(cur[0], pv[0]) : null, c2 = pv && wm.length ? ch(cur[1], pv[1]) : null;
 const tr = roundsIn(ms); const big = tr.filter(d => d.amount).sort((a, b) => b.amount - a.amount)[0];
 const lab = wm.length ? `${mName(wm[0])}${wm.length > 1 ? '–' + mName(wm[wm.length - 1]) : ''} 2026` : T('حتى الآن', 'so far');
 const where = F.c === 'all' ? T('المنطقة', 'MENA') : X.mkt(F.c);
 const spark = (wm.length ? wm : ms).map(m => mv(m).v || 0); const smx = Math.max(...spark, 1);
 const dlt = c => c == null ? '' : `<span class="${c >= 0 ? 'up' : 'dn'}">${c >= 0 ? '▲' : '▼'} <span class="b">${Math.abs(c)}%</span></span> ${T('عن الربع السابق', 'vs previous quarter')}`;
 document.getElementById('kpis').innerHTML = `
  <div class="k5 main"><div class="l">${T('إجمالي التمويل', 'Total funding')} · ${X.esc(where)} · ${X.esc(lab)}</div><div class="v b" data-to="${cur[0]}">${X.money(cur[0])}</div><div class="d">${dlt(c1)}</div><div class="spk">${spark.map((v, k) => `<i style="--h:${Math.max(4, v / smx * 100)}%;--i:${k}"></i>`).join('')}</div><div class="src">${cur[2] ? T('من الصفقات المرصودة', 'From tracked deals') : T('المصدر: تقارير ومضة الشهرية', "Source: Wamda's monthly reports")}</div></div>
  <div class="k5"><div class="l">${T('عدد الصفقات', 'Deals')}</div><div class="v b">${cur[1]}</div><div class="d">${dlt(c2)}</div><div class="src">${cur[2] ? T('من الصفقات المرصودة', 'From tracked deals') : T('المصدر: ومضة', 'Source: Wamda')}</div></div>
  <div class="k5"><div class="l">${T('متوسط الصفقة', 'Average deal')}</div><div class="v b">${cur[1] ? X.money(cur[0] / cur[1]) : '—'}</div><div class="d">${T('الإجمالي ÷ عدد الصفقات', 'Total ÷ deals')}</div><div class="src">${T('محسوب من أرقام ومضة', "Computed from Wamda's figures")}</div></div>
  <div class="k5 bigd">${big ? `<div class="l">${T('أكبر صفقة رصدناها', 'Largest deal we tracked')}</div><a ${big.story ? `href="#/n/${big.story}"` : `href="${X.esc((big.source || {}).url || '#')}" target="_blank" rel="noopener"`} class="bd">${X.logoBox(big.company)}<span><b>${X.esc(big.company)}</b><small>${X.esc(X.stg(big.stage))} · ${X.esc(X.mkt(big.market))}</small></span></a><div class="v b">${X.money(big.amount)}</div>` : `<div class="l">${T('أكبر صفقة', 'Largest deal')}</div><div class="d">${T('لا صفقات مرصودة في هذه الفترة بعد', 'No tracked deals in this period yet')}</div>`}<div class="src">${T('الصفقات المرصودة', 'Tracked deals')}: <span class="b">${tr.length}</span></div></div>`;
}

/* ---------- the market sunrise ---------- */
function drawSun(first) {
 const T = X.tr; const wrap = document.getElementById('c-sun');
 const ms = ALLM; const vals = ms.map(m => Object.assign({ m }, mv(m)));
 const mob = wrap.clientWidth < 640; const W = mob ? 620 : 1100, H = mob ? 520 : 470, HZ = mob ? 400 : 360, top = 70;
 d3.select(wrap).selectAll('svg').filter(function () { return +this.dataset.w !== W; }).remove();
 const svg = d3.select(wrap).selectAll('svg').data([0]).join(enter => { const s = enter.append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'sunsvg').attr('data-w', W); sunDefs(s, 'sg'); s.append('defs').append('clipPath').attr('id', 'hzclip').append('rect').attr('x', 0).attr('y', -400).attr('width', W).attr('height', HZ + 400); s.append('g').attr('class', 'grid'); s.append('g').attr('class', 'bands'); s.append('g').attr('class', 'suns').attr('clip-path', 'url(#hzclip)'); s.append('g').attr('class', 'labs'); s.append('g').attr('class', 'rays'); return s; });
 const x = d3.scalePoint().domain(ms).range(mob ? [40, W - 40] : [70, W - 70]).padding(mob ? .2 : .4);
 const vmax = d3.max(vals, d => d.v) || 1, nmax = d3.max(vals, d => d.n) || 1;
 const r = d3.scaleSqrt().domain([0, vmax]).range(mob ? [4, 44] : [4, 60]);
 const y = d => HZ - 6 - (d.n / nmax) * (HZ - top - 20);
 const grid = svg.select('.grid'); const ticks = d3.ticks(0, nmax, 4).filter(t => t > 0);
 grid.selectAll('g').data(ticks, t => t).join(e => { const g = e.append('g'); g.append('line').attr('x1', 30).attr('x2', W - 30); g.append('text').attr('x', 34).attr('dy', -5); return g; }).attr('transform', t => `translate(0,${HZ - 6 - t / nmax * (HZ - top - 20)})`).call(g => { g.select('text').text(t => `${t} ${T('صفقة', 'deals')}`); });
 const bands = svg.select('.bands'); bands.selectAll('rect').data([0, 1, 2, 3]).join('rect').attr('x', 0).attr('width', W).attr('y', k => HZ + 4 + k * 13).attr('height', k => 7 - k).attr('fill', k => SUNC[k + 1]).attr('opacity', .9);
 bands.selectAll('line').data([0]).join('line').attr('x1', 0).attr('x2', W).attr('y1', HZ).attr('y2', HZ).attr('class', 'hzl');
 const sel = F.sel;
 const g = svg.select('.suns').selectAll('g.s').data(vals, d => d.m).join(e => { const s = e.append('g').attr('class', 's').attr('transform', d => `translate(${x(d.m)},${HZ + 80})`); s.append('circle').attr('class', 'glow').attr('r', 0).attr('fill', 'url(#sgg)'); s.append('circle').attr('class', 'disc').attr('r', 0).attr('fill', 'url(#sg)'); return s; });
 g.classed('partial', d => d.partial).classed('dim', d => sel && d.m !== sel).classed('on', d => d.m === sel);
 g.transition().duration(first ? 1600 : 900).delay((d, i) => first ? 200 + i * 110 : 0).ease(d3.easeCubicOut).attr('transform', d => `translate(${x(d.m)},${y(d)})`);
 g.select('.disc').transition().duration(first ? 1600 : 900).delay((d, i) => first ? 200 + i * 110 : 0).attr('r', d => d.v ? r(d.v) : 0);
 g.select('.glow').transition().duration(1200).attr('r', d => d.v ? r(d.v) * 1.9 : 0);
 g.on('pointermove', (e, d) => tipShow(e, `<b>${mName(d.m)} ${d.m.slice(0, 4)}</b><div class="tv b">${X.money(d.v)}</div><div>${d.n} ${T('صفقة', 'deals')}</div><small>${d.src === 'w' ? T('المصدر: ومضة', 'Source: Wamda') : T('من الصفقات المرصودة فقط (لا تقرير بعد)', 'Tracked deals only (no report yet)')}</small>`)).on('pointerleave', tipHide).on('click', (e, d) => { tipHide(); F.sel = F.sel === d.m ? null : d.m; drawSun(); rays(); });
 const labs = svg.select('.labs').selectAll('g.l').data(vals, d => d.m).join(e => { const l = e.append('g').attr('class', 'l'); l.append('text').attr('class', 'mv'); l.append('text').attr('class', 'mn'); l.append('text').attr('class', 'mm'); return l; });
 labs.attr('transform', d => `translate(${x(d.m)},0)`).classed('dim', d => sel && d.m !== sel);
 labs.select('.mv').attr('text-anchor', 'middle').text(d => X.money(d.v)).transition().duration(first ? 1600 : 900).delay((d, i) => first ? 500 + i * 110 : 0).attr('y', d => Math.max(16, y(d) - (d.v ? r(d.v) : 0) - 12)).style('opacity', 1);
 labs.select('.mn').attr('text-anchor', 'middle').attr('y', HZ + 72).text(d => mName(d.m));
 labs.select('.mm').attr('text-anchor', 'middle').attr('y', HZ + 92).text(d => `${d.n} ${T('صفقة', 'deals')}${d.partial ? ' *' : ''}`);
 if (first) labs.select('.mv').style('opacity', 0).attr('y', HZ);
 document.getElementById('s-sun').innerHTML = `${T('حجم الشمس = التمويل، وارتفاعها = عدد الصفقات.', 'Sun size = funding; height = number of deals.')} ${vals.some(v => v.partial) ? T('* شهر بلا تقرير بعد، محسوب من الصفقات التي رصدناها فقط.', '* Month without a report yet, counted from tracked deals only.') : ''} ${T('المصدر', 'Source')}: ${src('Wamda', (X.SITE.collections.meta.series.ytd.source || {}).url || 'https://www.wamda.com')}`;
 if (!sel) svg.select('.rays').selectAll('*').remove();
 SS = { x, y, r, v: vals, dims: [W, H, HZ] };
}
function rays() {
 const T = X.tr; const svg = d3.select('#c-sun svg'); const lay = svg.select('.rays'); lay.selectAll('*').remove();
 const out = document.getElementById('d-sun');
 if (!F.sel) { out.innerHTML = ''; return; }
 const d0 = SS.v.find(v => v.m === F.sel); const cx = SS.x(F.sel), cy = SS.y(d0), R = d0.v ? SS.r(d0.v) : 6; const [W, H, HZ] = SS.dims;
 const list = roundsIn([F.sel]).sort((a, b) => (b.amount || 0) - (a.amount || 0));
 const show = list.slice(0, 14); const n = show.length;
 const nodes = show.map((d, i) => { const a = -Math.PI / 2 + (n === 1 ? 0 : (i / (n - 1) - .5) * Math.PI * 1.55); const rr = R + 62 + (i % 2) * 52; let px = cx + Math.cos(a) * rr * 1.25, py = cy + Math.sin(a) * rr; px = Math.max(30, Math.min(W - 30, px)); py = Math.max(24, Math.min(HZ - 24, py)); return { d, px, py }; });
 const g = lay.selectAll('g.ray').data(nodes).join(e => { const r = e.append('g').attr('class', 'ray'); r.append('line'); const n = r.append('g').attr('class', 'nd').attr('transform', `translate(${cx},${cy}) scale(.2)`); logoNode(n, '', 30); n.append('text').attr('class', 'rn'); n.append('text').attr('class', 'ra'); return r; });
 g.each(function (o) { const nd = d3.select(this).select('.nd'); nd.selectAll('rect,image,text.lt').remove(); logoNode(nd, o.d.company, 30); nd.select('.rn').raise().attr('text-anchor', 'middle').attr('y', 29).text(o.d.company.length > 14 ? o.d.company.slice(0, 13) + '…' : o.d.company); nd.select('.ra').raise().attr('text-anchor', 'middle').attr('y', 43).text(o.d.amount ? X.money(o.d.amount) : ''); });
 g.select('line').attr('x1', cx).attr('y1', cy).attr('x2', cx).attr('y2', cy).attr('stroke', (o, i) => SUNC[1 + i % 4]).transition().duration(700).delay((o, i) => i * 45).ease(d3.easeCubicOut).attr('x2', o => o.px).attr('y2', o => o.py);
 g.select('.nd').transition().duration(800).delay((o, i) => 120 + i * 45).ease(d3.easeBackOut.overshoot(1.4)).attr('transform', o => `translate(${o.px},${o.py}) scale(1)`);
 g.style('cursor', 'pointer').on('click', (e, o) => { if (o.d.story) location.hash = '#/n/' + o.d.story; else window.open((o.d.source || {}).url, '_blank', 'noopener'); }).on('pointermove', (e, o) => tipShow(e, `<b>${X.esc(o.d.company)}</b><div class="tv b">${X.money(o.d.amount)}</div><div>${X.esc(X.stg(o.d.stage))} · ${X.esc(X.ind(o.d.industry))}</div><small>${X.esc((o.d.investors || []).map(i => i.name).slice(0, 3).join(' · '))}</small>`)).on('pointerleave', tipHide);
 const mx = Math.max(...list.map(d => d.amount || 1), 2); const tot = list.reduce((s, d) => s + (d.amount || 0), 0);
 out.innerHTML = `<div class="drill in"><div class="dh"><span class="sunlet"></span><b>${mName(F.sel)} ${F.sel.slice(0, 4)}</b><small><span class="b">${list.length}</span> ${T('صفقة رصدناها', 'tracked deals')} · <span class="b">${X.money(tot)}</span> ${T('معلن', 'disclosed')}${d0.src === 'w' ? ` · ${T('ومضة', 'Wamda')}: <span class="b">${d0.n}</span> ${T('صفقة', 'deals')}` : ''}</small><button id="dclose" aria-label="close">${X.ic('close')}</button></div>${list.length ? `<div class="deals in">${list.slice(0, 12).map((d, k) => X.dealRow(d, k, mx)).join('')}</div>${list.length > 12 ? `<div class="more2"><button class="btn2" id="sunall">${T('عرض الكل', 'Show all')} (<span class="b">${list.length}</span>)</button></div>` : ''}` : `<div class="empty">${T('لم نرصد صفقات هذا الشهر بأسمائها بعد. الرقم أعلاه من ومضة.', "We haven't tracked this month's deals by name yet. The figure above is Wamda's.")}</div>`}</div>`;
 X.bindRowCards();
 document.getElementById('dclose').onclick = () => { F.sel = null; drawSun(); rays(); };
 const sa = document.getElementById('sunall'); if (sa) sa.onclick = () => { out.querySelector('.deals').innerHTML = list.map((d, k) => X.dealRow(d, k, mx)).join(''); sa.remove(); X.bindRowCards(); };
}

/* ---------- live map ---------- */
async function drawMap(first) {
 const T = X.tr; const el = document.getElementById('c-map');
 if (!geo) { try { geo = await fetch('app/data/mena.geo.json').then(r => r.json()); } catch (e) { el.innerHTML = '<div class="empty">—</div>'; return; } }
 const W = 820, H = 560;
 const ms = PM(); const rng = document.getElementById('mrange'); rng.max = ms.length; if (+rng.value > ms.length) rng.value = 0; F.mapk = +rng.value;
 const act = F.mapk ? [ms[F.mapk - 1]] : ms;
 document.getElementById('mlab').textContent = F.mapk ? `${mName(act[0])} ${act[0].slice(0, 4)}` : T('كل الفترة', 'Whole period');
 const val = {};
 act.forEach(m => { const S = M.find(x => x.m === m); if (S) Object.entries(S.countries).forEach(([k, v]) => { val[k] = val[k] || { v: 0, n: 0, w: true }; val[k].v += v[0] || 0; val[k].n += v[1] || 0; }); });
 X.ROUNDS.filter(d => inP(d, act) && GEO[d.market]).forEach(d => { if (!val[d.market]) val[d.market] = { v: 0, n: 0, w: false, t: true }; if (!val[d.market].w) { val[d.market].v += d.amount || 0; val[d.market].n++; } });
 const proj = d3.geoMercator().fitExtent([[10, 10], [W - 10, H - 10]], { type: 'Feature', geometry: { type: 'MultiPoint', coordinates: [[-10, 15.5], [59, 37.5]] } });
 const path = d3.geoPath(proj);
 const svg = d3.select(el).selectAll('svg').data([0]).join(e => { const s = e.append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'mapsvg'); sunDefs(s, 'mg'); const p = s.select('defs').append('pattern').attr('id', 'sea').attr('width', 8).attr('height', 8).attr('patternUnits', 'userSpaceOnUse'); p.append('line').attr('x1', 0).attr('x2', 8).attr('y1', 4).attr('y2', 4).attr('class', 'seal'); s.append('rect').attr('width', W).attr('height', H).attr('fill', 'url(#sea)'); s.append('g').attr('class', 'land'); s.append('g').attr('class', 'suns'); s.append('g').attr('class', 'mlabs'); return s; });
 const ids = new Set(Object.values(GEO)); const code = Object.fromEntries(Object.entries(GEO).map(([k, v]) => [v, k]));
 svg.select('.land').selectAll('path').data(geo.features, f => f.id).join('path').attr('d', path).attr('class', f => ids.has(f.id) ? 'mena' + (code[f.id] === F.c ? ' on' : '') + (val[code[f.id]] ? ' has' : '') : 'oth')
  .on('click', (e, f) => { if (code[f.id] && val[code[f.id]]) setCountry(code[f.id]); });
 const pts = Object.entries(val).filter(([k, v]) => v.v > 0 || v.n > 0).map(([k, v]) => { const f = geo.features.find(x => x.id === GEO[k]); if (!f) return null; let c = proj(d3.geoCentroid(f)); if (k === 'KSA') c = proj([44.5, 23.8]); if (k === 'MAR') c = proj([-6.5, 32]); return { k, v, x: c[0], y: c[1] }; }).filter(Boolean);
 const vmax = d3.max(pts, p => p.v.v) || 1; const r = d3.scaleSqrt().domain([0, vmax]).range([5, 54]);
 const g = svg.select('.suns').selectAll('g.cs').data(pts, p => p.k).join(e => { const s = e.append('g').attr('class', 'cs').attr('transform', p => `translate(${p.x},${p.y})`); s.append('circle').attr('class', 'glow').attr('r', 0).attr('fill', 'url(#mgg)'); s.append('circle').attr('class', 'disc').attr('r', 0).attr('fill', 'url(#mg)'); s.append('circle').attr('class', 'ring').attr('r', 0); return s; }, u => u, x => x.transition().duration(500).style('opacity', 0).remove());
 g.classed('on', p => p.k === F.c).classed('dim', p => F.c !== 'all' && p.k !== F.c).classed('tr', p => !p.v.w);
 g.transition().duration(first ? 1200 : 700).attr('transform', p => `translate(${p.x},${p.y})`);
 g.select('.disc').transition().duration(first ? 1400 : 700).delay((p, i) => first ? 300 + i * 80 : 0).attr('r', p => r(p.v.v));
 g.select('.glow').transition().duration(900).attr('r', p => r(p.v.v) * 2);
 g.select('.ring').transition().duration(700).attr('r', p => r(p.v.v) + 5);
 g.on('pointermove', (e, p) => tipShow(e, `<b>${X.esc(X.mkt(p.k))}</b><div class="tv b">${X.money(p.v.v)}</div><div>${p.v.n} ${T('صفقة', 'deals')}</div><small>${p.v.w ? T('المصدر: ومضة', 'Source: Wamda') : T('من الصفقات المرصودة (ومضة لا تذكرها منفصلة)', 'Tracked deals (Wamda does not break it out)')}</small>`)).on('pointerleave', tipHide).on('click', (e, p) => { tipHide(); setCountry(p.k); });
 const lb = svg.select('.mlabs').selectAll('g').data(pts.filter(p => r(p.v.v) > 12 || p.k === F.c), p => p.k).join(e => { const l = e.append('g'); l.append('text').attr('class', 'cn'); l.append('text').attr('class', 'cv'); return l; });
 lb.attr('transform', p => `translate(${p.x},${p.y + r(p.v.v) + 16})`); lb.select('.cn').attr('text-anchor', 'middle').text(p => X.mkt(p.k)); lb.select('.cv').attr('text-anchor', 'middle').attr('y', 15).text(p => X.money(p.v.v));
 /* side list */
 const side = document.getElementById('m-side');
 const rank = pts.slice().sort((a, b) => b.v.v - a.v.v); const tot = rank.reduce((s, p) => s + p.v.v, 0) || 1;
 if (F.c === 'all') side.innerHTML = `<h4>${T('ترتيب الدول', 'Country ranking')}</h4>${rank.map((p, i) => `<button class="cr2" data-c="${p.k}" style="--w:${Math.max(3, p.v.v / rank[0].v.v * 100)}%"><span class="nm">${X.esc(X.mkt(p.k))}${p.v.w ? '' : ' °'}</span><span class="vv b">${X.money(p.v.v)}</span><span class="sh b">${Math.round(p.v.v / tot * 100)}%</span><i></i></button>`).join('')}<small class="ms">${T('° من الصفقات المرصودة فقط', '° tracked deals only')}</small>`;
 else { const list = X.ROUNDS.filter(d => inP(d, act) && d.market === F.c).sort((a, b) => (b.amount || 0) - (a.amount || 0)); const v = val[F.c] || { v: 0, n: 0 }; const mx = Math.max(...list.map(d => d.amount || 1), 2);
  side.innerHTML = `<div class="mh"><b>${X.esc(X.mkt(F.c))}</b><button class="x" id="mclr">${X.ic('close')}</button></div><div class="mk"><span class="b">${X.money(v.v)}</span><small>${v.n} ${T('صفقة', 'deals')}</small></div><div class="mlist">${list.length ? list.slice(0, 10).map((d, k) => X.dealRow(d, k, mx)).join('') : `<div class="empty">${T('لا صفقات مرصودة بأسمائها هنا بعد.', 'No deals tracked by name here yet.')}</div>`}</div>`;
  document.getElementById('mclr').onclick = () => setCountry(F.c); side.querySelector('.mlist').classList.add('in'); X.bindRowCards(); }
 side.querySelectorAll('.cr2').forEach(b => b.onclick = () => setCountry(b.dataset.c));
 document.getElementById('s-map').innerHTML = `${T('قيم الدول من تقارير ومضة الشهرية حين تذكرها، وإلا من الصفقات التي رصدناها.', "Country values come from Wamda's monthly reports where they are given, otherwise from the deals we track.")} ${src('Wamda', 'https://www.wamda.com')}`;
 rng.oninput = () => { F.mapk = +rng.value; drawMap(); };
 const pb = document.getElementById('mplay');
 pb.onclick = () => { if (timers.length) { timers.forEach(clearInterval); timers = []; pb.innerHTML = X.ic('play'); return; } pb.innerHTML = X.ic('pause'); let k = 1; rng.value = k; F.mapk = k; drawMap(); timers.push(setInterval(() => { k++; if (k > ms.length) { timers.forEach(clearInterval); timers = []; pb.innerHTML = X.ic('play'); rng.value = 0; F.mapk = 0; drawMap(); return; } rng.value = k; F.mapk = k; drawMap(); }, 1100)); };
 rng.style.setProperty('--p', (ms.length ? +rng.value / ms.length * 100 : 0) + '%');
}

/* ---------- sources compared ---------- */
function drawCompare() {
 const T = X.tr; const el = document.getElementById('p-cmp'); if (!MK) return;
 const L = X.EN() ? 'en' : 'ar'; const S = MK.sources; const keys = ['wamda', 'magnitt', 'pitchbook'];
 const mx = d3.max(MK.rows, r => d3.max(Object.values(r.v), v => v[0]));
 const sc = v => Math.max(1.5, Math.sqrt(v / mx) * 100);
 el.innerHTML = `<div class="ph"><h3>${T('مصدر مختلف، رقم مختلف', 'Different source, different number')}</h3><small>${X.esc(MK.period[L])} · ${T('نفس الفترة كما يعدّها كل مصدر', 'The same period as each source counts it')}</small></div>
  <div class="srcleg">${keys.map((k, i) => `<span><i style="background:${['#3EA6F2', '#FF7A24', '#FFD45C'][i]}"></i>${X.esc(X.EN() ? S[k].name : S[k].ar)} <small>${X.esc(S[k].note[L])}</small></span>`).join('')}</div>
  <div class="cmpg">${MK.rows.map((r, ri) => `<div class="crow"><b class="ck">${r.k === 'MENA' ? T('المنطقة', 'MENA') : X.esc(X.mkt(r.k))}</b><div class="cb">${keys.filter(k => r.v[k]).map(k => `<div class="cbar" style="--w:${sc(r.v[k][0])}%;--c:${['#3EA6F2', '#FF7A24', '#FFD45C'][keys.indexOf(k)]};--i:${ri}"><i></i><span class="b">${X.money(r.v[k][0])}</span>${r.v[k][1] ? `<small>${r.v[k][1]} ${T('صفقة', 'deals')}</small>` : ''}</div>`).join('')}</div></div>`).join('')}</div>
  <div class="facts2">${MK.facts.map(f => `<div class="f2"><span class="sb" style="--c:${['#3EA6F2', '#FF7A24', '#FFD45C'][keys.indexOf(f.s)]}">${X.esc(S[f.s].name)}</span><p>${X.esc(f[L])}</p></div>`).join('')}</div>
  <div class="why3">${X.ic('bolt')} <span>${X.esc(MK.why[L])}</span></div>
  <div class="srcl">${keys.map(k => src(S[k].name, S[k].url)).join(' ')} ${S.magnitt.via ? src('Enterprise', S.magnitt.via) : ''} <small>${T('أطوال الأعمدة بمقياس الجذر التربيعي حتى تظهر الأرقام الصغيرة.', 'Bar lengths use a square-root scale so small values stay visible.')}</small></div>`;
 const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { el.classList.add('go'); io.disconnect(); } }), { threshold: .2 }); io.observe(el);
}

/* ---------- sectors streamgraph ---------- */
function drawStream() {
 const T = X.tr; const el = document.getElementById('c-sec'); el.innerHTML = '';
 const ms = PM().filter(m => F.c !== 'all' || M.some(x => x.m === m));
 const useW = F.c === 'all';
 const rows = ms.map(m => { const o = { m }; if (useW) { const S = M.find(x => x.m === m); let s = 0; Object.entries(S.sectors || {}).forEach(([k, v]) => { const kk = sec(k); o[kk] = (o[kk] || 0) + v; s += v; }); o.Other = Math.max(0, (S.total || 0) - s); } else roundsIn([m]).forEach(d => { const kk = sec(d.industry); o[kk] = (o[kk] || 0) + (d.amount || 0); }); return o; });
 const tot = {}; rows.forEach(r => Object.entries(r).forEach(([k, v]) => { if (k !== 'm') tot[k] = (tot[k] || 0) + v; }));
 let keys = Object.keys(tot).filter(k => k !== 'Other' && tot[k] > 0).sort((a, b) => tot[b] - tot[a]);
 const rest = keys.slice(7); keys = keys.slice(0, 7); rows.forEach(r => { rest.forEach(k => { r.Other = (r.Other || 0) + (r[k] || 0); }); keys.concat(['Other']).forEach(k => { r[k] = r[k] || 0; }); });
 if (tot.Other || rest.length) keys.push('Other');
 document.getElementById('sec-sub').textContent = useW ? T('التمويل حسب القطاع شهريًا. ومضة تذكر أكبر القطاعات فقط، والباقي في «أخرى»', 'Funding by sector each month. Wamda names only the top sectors; the rest is in "Other"') : T(`قطاعات الصفقات المرصودة في ${X.mkt(F.c)}`, `Sectors of tracked deals in ${X.mkt(F.c)}`);
 document.getElementById('s-sec').innerHTML = useW ? `${T('المصدر', 'Source')}: ${src('Wamda', 'https://www.wamda.com')}` : T('من الصفقات التي رصدناها بأسمائها', 'From the deals we track by name');
 if (rows.length < 2 || !keys.length) { el.innerHTML = `<div class="empty">${T('لا تكفي البيانات لهذه الفترة.', 'Not enough data for this period.')}</div>`; return; }
 const mob = el.clientWidth < 640; const W = mob ? 600 : 1100, H = mob ? 420 : 380, mb = 34;
 const svg = d3.select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'strsvg');
 const st = d3.stack().keys(keys).offset(d3.stackOffsetWiggle).order(d3.stackOrderInsideOut)(rows);
 const x = d3.scalePoint().domain(ms).range([30, W - 30]);
 const y = d3.scaleLinear().domain([d3.min(st, s => d3.min(s, d => d[0])), d3.max(st, s => d3.max(s, d => d[1]))]).range([H - mb, 16]);
 const area = d3.area().x(d => x(d.data.m)).y0(d => y(d[0])).y1(d => y(d[1])).curve(d3.curveMonotoneX);
 const col = k => k === 'Other' ? 'var(--paper-3)' : PAL[keys.indexOf(k) % PAL.length];
 const clip = svg.append('defs').append('clipPath').attr('id', 'stclip').append('rect').attr('x', 0).attr('y', 0).attr('height', H).attr('width', 0);
 clip.transition().duration(1600).ease(d3.easeCubicInOut).attr('width', W);
 svg.append('g').selectAll('line').data(ms).join('line').attr('class', 'mgl').attr('x1', m => x(m)).attr('x2', m => x(m)).attr('y1', 10).attr('y2', H - mb);
 const lay = svg.append('g').attr('clip-path', 'url(#stclip)').selectAll('path').data(st).join('path').attr('class', s => 'lay' + (F.sec && F.sec !== s.key ? ' dim' : '')).attr('d', area).attr('fill', s => col(s.key));
 const lab = svg.append('g').attr('class', 'slabs');
 st.forEach(s => { let best = -1, bi = 0; s.forEach((d, i) => { const t = y(d[0]) - y(d[1]); if (t > best) { best = t; bi = i; } }); if (best > 24) { const d = s[bi]; lab.append('text').attr('x', Math.min(W - 60, Math.max(60, x(d.data.m)))).attr('y', (y(d[0]) + y(d[1])) / 2).attr('dy', '.35em').attr('text-anchor', 'middle').attr('class', s.key === 'Other' ? 'o' : '').text(s.key === 'Other' ? T('أخرى', 'Other') : X.ind(s.key)); } });
 svg.append('g').selectAll('text').data(ms).join('text').attr('class', 'mt').attr('x', m => x(m)).attr('y', H - 10).attr('text-anchor', 'middle').text(m => mName(m));
 const cur = svg.append('line').attr('class', 'scur').attr('y1', 10).attr('y2', H - mb).style('opacity', 0);
 lay.on('pointermove', function (e, s) { const [px] = d3.pointer(e); const m = ms.reduce((a, b) => Math.abs(x(b) - px) < Math.abs(x(a) - px) ? b : a); const r = rows.find(r => r.m === m); cur.attr('x1', x(m)).attr('x2', x(m)).style('opacity', 1); lay.classed('hl', l => l === s); tipShow(e, `<b>${s.key === 'Other' ? T('أخرى', 'Other') : X.esc(X.ind(s.key))}</b><div class="tv b">${X.money(r[s.key])}</div><small>${mName(m)} · ${T('المجموع في الفترة', 'Period total')} ${X.money(tot[s.key] || rest.reduce((a, k) => a + tot[k], 0))}</small>`); })
  .on('pointerleave', () => { cur.style('opacity', 0); lay.classed('hl', false); tipHide(); })
  .on('click', (e, s) => { if (s.key === 'Other') return; F.sec = F.sec === s.key ? null : s.key; drawStream(); drawTable(); document.getElementById('p-tab').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
}

/* ---------- investor constellation ---------- */
function drawInv() {
 const T = X.tr; const el = document.getElementById('c-inv'); el.innerHTML = '';
 const list = roundsIn(PM());
 const inv = {}; list.forEach(d => (d.investors || []).forEach(i => { const o = inv[i.name] = inv[i.name] || { id: 'i:' + i.name, name: i.name, n: 0, v: 0, lead: 0, cos: new Set() }; o.n++; o.v += d.amount || 0; if (i.lead) o.lead++; o.cos.add(d.company); }));
 const top = Object.values(inv).sort((a, b) => b.n - a.n || b.v - a.v).slice(0, 26);
 document.getElementById('s-inv').innerHTML = `${T('من الصفقات التي رصدناها بأسمائها', 'From the deals we track by name')} · <span class="b">${list.length}</span> ${T('صفقة', 'deals')} · <span class="b">${Object.keys(inv).length}</span> ${T('مستثمر', 'investors')}`;
 if (!top.length) { el.innerHTML = `<div class="empty dk">${T('لا صفقات مرصودة بمستثمريها في هذه الفترة بعد.', 'No tracked deals with investors in this period yet.')}</div>`; return; }
 const cos = {}; top.forEach(i => i.cos.forEach(c => { cos[c] = cos[c] || { id: 'c:' + c, name: c, co: true, n: 0, d: list.find(d => d.company === c) }; cos[c].n++; }));
 const nodes = top.map(i => Object.assign(i, { inv: true })).concat(Object.values(cos));
 const links = []; top.forEach(i => i.cos.forEach(c => links.push({ source: i.id, target: 'c:' + c })));
 const mob = el.clientWidth < 640; const W = mob ? 600 : 1100, H = mob ? 820 : 620;
 const svg = d3.select(el).append('svg').attr('viewBox', `0 0 ${W} ${H}`).attr('class', 'invsvg'); sunDefs(svg, 'ig');
 let h = 3; const rnd = () => ((h = (h * 1103515245 + 12345) >>> 0) / 4294967296);
 svg.append('g').selectAll('circle').data(d3.range(120)).join('circle').attr('class', 'dust').attr('cx', () => rnd() * W).attr('cy', () => rnd() * H).attr('r', () => rnd() * 1.3 + .2).style('animation-delay', () => (rnd() * 4).toFixed(1) + 's');
 const rs = d3.scaleSqrt().domain([1, d3.max(top, i => i.n)]).range([9, 26]);
 const sim = d3.forceSimulation(nodes).force('link', d3.forceLink(links).id(d => d.id).distance(l => 34 + rs(l.source.n || 1)).strength(.7)).force('charge', d3.forceManyBody().strength(d => d.inv ? -260 : -40)).force('center', d3.forceCenter(W / 2, H / 2)).force('collide', d3.forceCollide(d => d.inv ? rs(d.n) + 14 : 15)).force('x', d3.forceX(W / 2).strength(.04)).force('y', d3.forceY(H / 2).strength(.07));
 const lk = svg.append('g').attr('class', 'lks').selectAll('line').data(links).join('line');
 const nd = svg.append('g').selectAll('g').data(nodes).join('g').attr('class', d => d.inv ? 'ni' : 'nc');
 nd.filter(d => d.inv).append('circle').attr('class', 'glow').attr('r', d => rs(d.n) * 2).attr('fill', 'url(#igg)');
 nd.filter(d => d.inv).append('circle').attr('r', d => rs(d.n)).attr('fill', 'url(#ig)');
 nd.filter(d => d.inv).append('text').attr('class', 'il').attr('text-anchor', 'middle').attr('y', d => rs(d.n) + 15).text(d => d.name.length > 22 ? d.name.slice(0, 21) + '…' : d.name);
 nd.filter(d => d.co).each(function (d) { logoNode(d3.select(this), d.name, 22); });
 nd.filter(d => d.co).append('text').attr('class', 'cl2').attr('text-anchor', 'middle').attr('y', 23).text(d => d.name);
 const nb = new Map(); links.forEach(l => { const s = typeof l.source === 'object' ? l.source.id : l.source, t = typeof l.target === 'object' ? l.target.id : l.target; (nb.get(s) || nb.set(s, new Set()).get(s)).add(t); (nb.get(t) || nb.set(t, new Set()).get(t)).add(s); });
 const focus = d => { const ns = nb.get(d.id) || new Set(); const second = new Set(); if (d.co) ns.forEach(i => second.add(i)); else ns.forEach(c => (nb.get(c) || []).forEach(i => second.add(i))); nd.classed('fade', o => o !== d && !ns.has(o.id) && !second.has(o.id)).classed('lit', o => o === d || ns.has(o.id)); lk.classed('lit', l => l.source === d || l.target === d).classed('fade', l => !(l.source === d || l.target === d)); };
 const unfocus = () => { nd.classed('fade', false).classed('lit', false); lk.classed('lit', false).classed('fade', false); };
 nd.on('pointerenter', (e, d) => focus(d)).on('pointermove', (e, d) => tipShow(e, d.inv ? `<b>${X.esc(d.name)}</b><div class="tv">${d.n} ${T('صفقة', 'deals')}${d.lead ? ` · ${T('قاد', 'led')} ${d.lead}` : ''}</div><small class="b">${X.money(d.v)}</small>` : `<b>${X.esc(d.name)}</b><div class="tv b">${X.money(d.d && d.d.amount)}</div><small>${X.esc(X.stg(d.d && d.d.stage))}</small>`)).on('pointerleave', () => { unfocus(); tipHide(); })
  .on('click', (e, d) => { if (e.defaultPrevented) return; if (d.inv) { F.inv = F.inv === d.name ? null : d.name; drawTable(); document.getElementById('p-tab').scrollIntoView({ behavior: 'smooth' }); } else if (d.d && d.d.story) location.hash = '#/n/' + d.d.story; });
 nd.call(d3.drag().on('start', (e, d) => { if (!e.active) sim.alphaTarget(.25).restart(); d.fx = d.x; d.fy = d.y; }).on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; }).on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));
 sim.on('tick', () => { nodes.forEach(d => { d.x = Math.max(30, Math.min(W - 30, d.x)); d.y = Math.max(24, Math.min(H - 30, d.y)); }); lk.attr('x1', l => l.source.x).attr('y1', l => l.source.y).attr('x2', l => l.target.x).attr('y2', l => l.target.y); nd.attr('transform', d => `translate(${d.x},${d.y})`); });
}

/* ---------- rounds table ---------- */
function drawTable() {
 const T = X.tr; const ms = PM();
 let list = roundsIn(ms, { inv: F.inv, sec: F.sec, kind: F.kind });
 if (F.q) { const q = F.q.toLowerCase(); list = list.filter(d => [d.company, d.industry, (d.investors || []).map(i => i.name).join(' ')].join(' ').toLowerCase().includes(q)); }
 const key = { date: d => d.date || '', amount: d => d.amount || -1, company: d => d.company.toLowerCase() }[F.sort];
 list.sort((a, b) => { const x = key(a), y = key(b); return (x > y ? 1 : x < y ? -1 : 0) * F.dir; });
 const kinds = ['all', 'round', 'ma', 'fund', 'debt'];
 const fil = document.getElementById('tfil');
 if (!fil.dataset.on) { fil.dataset.on = 1; fil.innerHTML = `<label class="tq">${X.ic('search')}<input id="tq" placeholder="${T('شركة، مستثمر، قطاع…', 'Company, investor, sector…')}" value="${X.esc(F.q)}"></label><div class="seg sm" id="tkind"><span class="pill"></span>${kinds.map(k => `<button data-k="${k}" aria-pressed="${F.kind === k}">${k === 'all' ? T('الكل', 'All') : X.esc(X.kindName(k))}</button>`).join('')}</div><div class="act" id="tact"></div>`;
  document.getElementById('tq').oninput = e => { F.q = e.target.value; F.n = 25; drawTable(); };
  const tk = document.getElementById('tkind'); requestAnimationFrame(() => X.placePill(tk)); tk.querySelectorAll('button').forEach(b => b.onclick = () => { F.kind = b.dataset.k; tk.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); X.placePill(tk); F.n = 25; drawTable(); }); }
 const act = []; if (F.c !== 'all') act.push(['c', X.mkt(F.c)]); if (F.sec) act.push(['sec', X.ind(F.sec)]); if (F.inv) act.push(['inv', F.inv]);
 document.getElementById('tact').innerHTML = act.map(([k, l]) => `<button class="achip" data-k="${k}">${X.esc(l)} ${X.ic('close')}</button>`).join('');
 document.querySelectorAll('#tact .achip').forEach(b => b.onclick = () => { if (b.dataset.k === 'c') { setCountry(F.c); return; } F[b.dataset.k] = null; if (b.dataset.k === 'sec') drawStream(); drawTable(); });
 const tot = list.reduce((s, d) => s + (d.amount || 0), 0); const mx = Math.max(...list.map(d => d.amount || 1), 2);
 document.getElementById('tab-sub').innerHTML = `<span class="b">${list.length}</span> ${T('صفقة', 'deals')} · <span class="b">${X.money(tot)}</span> ${T('معلن', 'disclosed')}`;
 const th = (k, l) => `<button class="th${F.sort === k ? ' on' : ''}" data-s="${k}">${l}${F.sort === k ? `<span class="ar">${F.dir < 0 ? '↓' : '↑'}</span>` : ''}</button>`;
 const bar = d => d.amount ? Math.max(5, Math.round(Math.log10(Math.max(1.2, d.amount)) / Math.log10(mx) * 100)) : 0;
 document.getElementById('tab').innerHTML = list.length ? `<div class="rt"><div class="rh">${th('company', T('الشركة', 'Company'))}<span>${T('النوع', 'Type')}</span>${th('amount', T('المبلغ', 'Amount'))}<span>${T('المستثمرون', 'Investors')}</span><span>${T('السوق', 'Market')}</span>${th('date', T('التاريخ', 'Date'))}</div>
  ${list.slice(0, F.n).map((d, i) => `<a class="rr" ${d.story ? `href="#/n/${d.story}"` : `href="${X.esc((d.source || {}).url || '#')}" target="_blank" rel="noopener"`} data-co="${X.esc(d.company)}" style="--i:${i % 25};--kc:${X.kindCol(d.k)}"><span class="co">${X.logoBox(d.company)}<span><b>${X.esc(d.company)}</b><small>${X.esc(X.ind(d.industry))}</small></span></span><span class="ty"><i></i>${X.esc(X.stg(d.stage) || X.kindName(d.k))}</span><span class="am"><b class="b">${d.amount ? X.money(d.amount) : X.money(null)}</b><span class="dbar" style="--w:${bar(d)}%"><i></i><i></i><i></i><i></i></span></span><span class="iv">${(d.investors || []).slice(0, 3).map(i => `<em class="${i.lead ? 'ld' : ''}">${X.esc(i.name)}</em>`).join('')}${(d.investors || []).length > 3 ? `<em class="mo">+${d.investors.length - 3}</em>` : ''}</span><span class="mk">${X.esc(X.mkt(d.market))}</span><span class="dt">${X.esc(X.fmtShort(d.date))}</span></a>`).join('')}</div>
  ${list.length > F.n ? `<div class="more2"><button class="btn2" id="tmore">${T('عرض المزيد', 'Show more')} (<span class="b">${list.length - F.n}</span>)</button></div>` : ''}` : `<div class="empty">${T('لا صفقات مرصودة بهذه التصفية. الصفقات المرصودة بأسمائها تبدأ من يوليو 2026، ونضيف ما قبله تباعًا.', 'No tracked deals match. Named tracking starts in July 2026; earlier months are being added.')}</div>`;
 document.querySelectorAll('#tab .th').forEach(b => b.onclick = () => { const s = b.dataset.s; if (F.sort === s) F.dir *= -1; else { F.sort = s; F.dir = s === 'company' ? 1 : -1; } drawTable(); });
 const tm = document.getElementById('tmore'); if (tm) tm.onclick = () => { F.n += 50; drawTable(); };
 document.querySelectorAll('#tab .rr').forEach(r => { r.addEventListener('pointerenter', e => { if (e.pointerType !== 'mouse') return; const d = X.ROUNDS.find(x => x.company === r.dataset.co); if (d) X.coCard(r.querySelector('.co'), d); }); r.addEventListener('pointerleave', () => document.querySelectorAll('.cocard').forEach(c => c.remove())); });
 requestAnimationFrame(() => document.querySelector('#tab .rt') && document.querySelector('#tab .rt').classList.add('in'));
}
})();
