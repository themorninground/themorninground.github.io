/* The Morning Round — v4 app */
(function () {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- icons (brand set) ---------- */
const P = {
 today: '<path d="M3 18h18"/><path d="M7 18a5 5 0 0 1 10 0"/><path d="M12 7.5V9.5"/><path d="M5.4 11.4l1.4 1.4"/><path d="M18.6 11.4l-1.4 1.4"/>',
 deal: '<circle cx="12" cy="12" r="8.5"/><path d="M12 16.5v-9"/><path d="M8.5 11l3.5-3.5 3.5 3.5"/>',
 news: '<rect x="3.5" y="4.5" width="14" height="15" rx="2"/><path d="M17.5 8.5h2a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2h-1"/><path d="M7 8.5h7M7 12h7M7 15.5h4"/>',
 article: '<path d="M3.5 6.5c3-1.2 5.8-1 8.5.8v12.2c-2.7-1.8-5.5-2-8.5-.8z"/><path d="M20.5 6.5c-3-1.2-5.8-1-8.5.8v12.2c2.7-1.8 5.5-2 8.5-.8z"/>',
 learn: '<path d="M2.5 9.5 12 5l9.5 4.5L12 14z"/><path d="M6.5 11.5v4.5c3 2 8 2 11 0v-4.5"/><path d="M21.5 9.5v5"/>',
 dashboard: '<path d="M4 20h16"/><path d="M7 16.5v-4M12 16.5V7.5M17 16.5v-7"/>',
 save: '<path class="fillp" d="M7 4h10v16l-5-3.6L7 20z"/><path d="M7 4h10v16l-5-3.6L7 20z"/>',
 search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.4-4.4"/>',
 source: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 calendar: '<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M9 3.5v4M15 3.5v4"/>',
 globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.3 3.5 5.1 3.5 8.5s-1.1 6.2-3.5 8.5c-2.4-2.3-3.5-5.1-3.5-8.5s1.1-6.2 3.5-8.5z"/>',
 streak: '<path d="M12 3.5c.8 3.6 5.5 5.6 5.5 10.5a5.5 5.5 0 0 1-11 0c0-2.8 1.8-3.9 1.8-6 1.4 1 2.3 2.4 2.3 3.8 0-3.7 1.4-5.5 1.4-8.3z"/>',
 swap: '<path d="M4 8h13l-3.5-3.5"/><path d="M20 16H7l3.5 3.5"/>',
 clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 check: '<path class="ckp" d="M5 12.5l4.5 4.5L19 7.5"/>',
 close: '<path d="M6 6l12 12M18 6L6 18"/>',
 moon: '<path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5z"/>',
 sunny: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
 back: '<path d="M14 6l6 6-6 6"/><path d="M20 12H4"/>',
 ext: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;

/* ---------- state ---------- */
const KEY = 'tmr4';
let ST = { days: [], read: [], known: [], saved: [], pick: {} };
try { ST = Object.assign(ST, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(ST)); } catch (e) {} };
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const NOW = new Date(); const TODAY = iso(NOW);
const DOW = NOW.getDay(); // 0 Sun .. 6 Sat
const AR_DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const AR_MON = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const arDate = s => { const d = new Date(s + 'T12:00:00'); return `${d.getDate()} ${AR_MON[d.getMonth()]} ${d.getFullYear()}`; };
const arDay = s => { const d = new Date(s + 'T12:00:00'); return `${AR_DAYS[d.getDay()]} ${d.getDate()} ${AR_MON[d.getMonth()]}`; };
function weekDates() { const s = new Date(NOW); s.setDate(NOW.getDate() - DOW); return [0, 1, 2, 3, 4].map(k => { const d = new Date(s); d.setDate(s.getDate() + k); return iso(d); }); }
function streak() {
 const set = new Set(ST.days); let n = 0; const d = new Date(NOW);
 if (!set.has(iso(d))) d.setDate(d.getDate() - 1);
 for (let k = 0; k < 400; k++) { const w = d.getDay(); if (w === 5 || w === 6) { d.setDate(d.getDate() - 1); continue; } if (set.has(iso(d))) { n++; d.setDate(d.getDate() - 1); } else break; }
 return n;
}

/* ---------- data ---------- */
let SITE, LIB, CON, ITEMS, DEALS, LOGOS = {};
const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, '-').replace(/^-|-$/g, '');
const logoOf = name => LOGOS[slug(name)] || null;
const money = m => m == null ? 'غير معلن' : m >= 1000 ? '$' + (+(m / 1000).toFixed(m >= 10000 ? 0 : 2)).toString() + 'B' : m >= 1 ? '$' + (+m.toFixed(m >= 100 ? 0 : 1)) + 'M' : '$' + Math.round(m * 1000) + 'K';
const MKT = { KSA: 'السعودية', UAE: 'الإمارات', Egypt: 'مصر', EGY: 'مصر', Qatar: 'قطر', QAT: 'قطر', Bahrain: 'البحرين', BHR: 'البحرين', Kuwait: 'الكويت', KWT: 'الكويت', Oman: 'عُمان', OMN: 'عُمان', Jordan: 'الأردن', JOR: 'الأردن', Morocco: 'المغرب', MAR: 'المغرب', Syria: 'سوريا', SYR: 'سوريا', Iraq: 'العراق', Global: 'عالمي', GCC: 'الخليج', MENA: 'المنطقة', Lebanon: 'لبنان', Tunisia: 'تونس', Pakistan: 'باكستان', Turkey: 'تركيا' };
const IND = { Fintech: 'التقنية المالية', AI: 'الذكاء الاصطناعي', Proptech: 'التقنية العقارية', Automotive: 'السيارات', 'Construction tech': 'تقنية البناء', Healthtech: 'التقنية الصحية', 'Travel tech': 'تقنية السفر', 'E-commerce': 'التجارة الإلكترونية', SaaS: 'البرمجيات', 'Climate tech': 'تقنية المناخ', Logistics: 'اللوجستيات', Adtech: 'تقنية الإعلان', Cybersecurity: 'الأمن السيبراني', 'E-services': 'الخدمات الإلكترونية', Edtech: 'تقنية التعليم', Foodtech: 'تقنية الغذاء', Deeptech: 'التقنية العميقة', Gaming: 'الألعاب', Other: 'أخرى', Mobility: 'التنقل', Insurtech: 'تقنية التأمين', 'HR tech': 'تقنية الموارد البشرية', Retail: 'التجزئة', Media: 'الإعلام', Agritech: 'التقنية الزراعية', 'Online services': 'الخدمات الرقمية', Biotech: 'التقنية الحيوية', Hardware: 'العتاد', Energy: 'الطاقة', Legaltech: 'التقنية القانونية' };
const ind = s => IND[s] || s || 'أخرى';
const STG = { Undisclosed: 'مرحلة غير معلنة', 'Pre-IPO': 'ما قبل الطرح', Fund: 'صندوق', 'Pre-seed': 'ما قبل البذرية', Seed: 'بذرية', Angel: 'ملائكي', Acquisition: 'استحواذ', IPO: 'طرح عام', Secondary: 'ثانوية', Strategic: 'استراتيجية', Debt: 'دين', Growth: 'نمو', 'New fund': 'صندوق جديد' };
const stg = s => STG[s] || s || '';
const CAT = { vc: 'VC', pm: 'أسواق خاصة', ec: 'اقتصاد وأسواق', id: 'فكرة اقتصادية' };

async function load() {
 const [s, l, c] = await Promise.all([fetch('data/site.json').then(r => r.json()), fetch('app/data/library.json').then(r => r.json()), fetch('app/data/concepts.json').then(r => r.json())]);
 SITE = s; LIB = l; CON = c;
 const items = s.collections.items; ITEMS = Object.entries(items).map(([id, v]) => Object.assign({ id }, v)).filter(x => !x.hidden);
 const meta = s.collections.meta; LOGOS = (meta.logos && meta.logos.map) || {};
 DEALS = ((meta.deals && meta.deals.deals) || []).slice();
}

/* ---------- shared bits ---------- */
const LOGO_LINE = window.TMR_LOGO_LINE || '';
const uniq = (s, p) => s.replace(/id="([^"]+)"/g, 'id="' + p + '$1"').replace(/url\(#([^)]+)\)/g, 'url(#' + p + '$1)');
const stack = p => uniq(window.TMR_LOGO_STACK || '', p);
const lib = id => LIB.find(a => a.id === id);
const con = id => CON.find(c => c.id === id);
function bands() { return '<div class="bands"><i></i><i></i><i></i><i></i></div>'; }
function visOf(a, big) {
 if (a.chart && window.TMR_CHARTS && TMR_CHARTS[a.chart]) return TMR_CHARTS[a.chart];
 if (a.img) return `<img src="img/${a.img}.jpg" alt="" loading="lazy">`;
 return `<div class="typo"><b>${esc(a.pub.toUpperCase())}</b><span>${esc(a.author)}</span><em>${esc(a.en)}</em></div>`;
}
function logoBox(name) { const u = logoOf(name); return u ? `<span class="logo"><img src="${esc(u)}" alt="" loading="lazy"></span>` : `<span class="logo t">${esc((name || '?').slice(0, 2))}</span>`; }
function dealRow(d, k, max, href) {
 const w = d.amount ? Math.max(5, Math.round(Math.log10(Math.max(1.2, d.amount)) / Math.log10(Math.max(2, max)) * 100)) : 4;
 const lead = (d.investors || []).find(i => i.lead || i.role === 'lead');
 const typ = d.stage ? `${stg(d.stage)}${STG[d.stage] ? '' : ''}` : '';
 return `<a class="drow" style="--i:${k};--w:${w}%" ${href ? `href="${href}"` : `href="${esc((d.source && d.source.url) || '#')}" target="_blank" rel="noopener"`}>${logoBox(d.company)}<span class="dname"><b>${esc(d.company)}</b><small>${esc(ind(d.industry))}${typ ? ' · ' + esc(typ) : ''}</small></span><span class="damt"><b>${esc(d.amountLabel || money(d.amount))}</b><span class="dbar"><i></i><i></i><i></i><i></i></span></span><span class="dlead">${esc(lead ? lead.name : '—')}</span><span class="dmkt">${esc(MKT[d.market] || d.market || '')}</span></a>`;
}
function head(title, sub) { return `<header class="phead"><h1><span class="mark"></span>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</header>`; }

/* ---------- FOR YOU ---------- */
function todayArticle() {
 const p = ST.pick[TODAY]; if (p && lib(p)) return lib(p);
 return LIB.find(a => a.arabic && !ST.read.includes(a.id)) || LIB.find(a => !ST.read.includes(a.id)) || LIB[0];
}
function todayConcept(a) {
 const ids = (a && a.concepts) || [];
 return con(ids.find(i => !ST.known.includes(i)) || ids[0]) || CON.find(c => !ST.known.includes(c.id)) || CON[0];
}
function latestDeals() {
 const ds = ITEMS.filter(x => x.type === 'deal' && x.date <= TODAY);
 const last = ds.map(x => x.date).sort().pop();
 return { date: last, list: ds.filter(x => x.date === last).sort((a, b) => (b.amount || 0) - (a.amount || 0)) };
}
function wsunSVG() {
 const wk = weekDates(); const set = new Set(ST.days); const bandsY = [[129, 20], [158, 18], [185, 16], [212, 18]];
 const col = ['#3EA6F2', '#FFD45C', '#FFA235', '#FF7A24', '#F2551A'];
 const segs = wk.map((d, k) => { const on = set.has(d); const now = d === TODAY && !on; const attrs = `class="seg${on ? '' : ' off'}${now ? ' now' : ''}" data-d="${d}" ${on ? `fill="${col[k]}"` : ''}`;
  return k === 0 ? `<rect ${attrs} x="0" y="0" width="240" height="120"/>` : `<rect ${attrs} x="0" y="${bandsY[k - 1][0]}" width="240" height="${bandsY[k - 1][1]}"/>`; }).join('');
 return `<svg class="wsun" viewBox="0 0 240 240" aria-label="أسبوعك"><defs><clipPath id="wcl"><circle cx="120" cy="120" r="118"/></clipPath></defs><g clip-path="url(#wcl)">${segs}</g></svg>`;
}
function odo(n) { const s = String(n); return `<span class="n" data-v="${s}">${[...s].map(ch => `<span style="transform:translateY(0)"><i>0</i>${'123456789'.split('').map(x => `<i>${x}</i>`).join('')}</span>`).join('')}</span>`; }
function runOdo(root) { $$('.n[data-v]', root).forEach(el => { const s = el.dataset.v; [...el.children].forEach((sp, k) => { const d = +s[k]; requestAnimationFrame(() => { sp.style.transform = `translateY(${-d}em)`; }); }); }); }
function renderForYou() {
 const a = todayArticle(); const c = todayConcept(a); const ld = latestDeals();
 const wk = weekDates(); const doneToday = ST.days.includes(TODAY);
 const mx = Math.max(...ld.list.map(d => d.amount || 1), 2);
 const tasks = (ST.read.includes(a.id) ? 1 : 0) + (c && ST.known.includes(c.id) ? 1 : 0) + (doneToday ? 1 : 0);
 const total = ld.list.reduce((s, d) => s + (d.amount || 0), 0);
 const workday = DOW <= 4;
 return `<section class="hero" id="hero"><span class="light"></span><div class="wrap in">
  <div>
   <div class="hi">صباح الخير · ${esc(arDay(TODAY))}</div>
   <h1>جولة اليوم</h1>
   <div class="week">${wsunSVG()}<div class="wdays"><b>أسبوعك</b><span><span class="b">${wk.filter(d => ST.days.includes(d)).length}</span> من 5 أيام</span><span class="dl">${wk.map((d, k) => `<i class="${ST.days.includes(d) ? 'on' : ''}${d === TODAY ? ' now' : ''}">${'حنثرخ'[k]}</i>`).join('')}</span></div></div>
   <div class="stats"><div class="stat">${odo(streak())}<div class="l">${ic('streak')} أيام متتالية</div></div><div class="stat">${odo(ST.read.length)}<div class="l">مقالة قرأتها</div></div><div class="stat">${odo(ST.known.length)}<div class="l">مفهوم أخذته</div></div></div>
  </div>
  <div class="brandcol">${stack('h-')}<div class="slogan">Every page compounds</div></div>
 </div><div class="wrap"><div class="today"><span>قراءة اليوم</span><span class="tr"><i style="--p:${Math.round(tasks / 3 * 100)}%"></i></span><span class="b">${tasks}/3</span></div></div></section>
 <main class="wrap">
  <section class="sec rv"><div class="sh"><span class="mark"></span><h2>مقالة اليوم</h2><span class="aside">${ic('clock')} <span class="b">${a.mins}</span> دقيقة</span></div>
   <article class="acard rv" id="acard"><div class="txt">
    <div class="meta"><span class="tag ${a.cat}">${CAT[a.cat]}</span><span>${esc(a.pub)} · ${esc(a.date)}</span></div>
    <h3>${esc(a.ar)}</h3><div class="en">${esc(a.en)}</div><div class="hzn"></div>
    <div class="by"><b>${esc(a.author)}</b></div><p>${esc(a.about)}</p>
    <div class="why"><b>ليش تستاهل</b><span>${esc(a.why)}</span></div>
    <div class="acts"><a class="btn" href="#/a/${a.id}">${ST.read.includes(a.id) ? 'اقرأها مرة ثانية' : 'اقرأ المقالة'}</a><button class="iconbtn save" data-save="${a.id}" aria-pressed="${ST.saved.includes(a.id)}" aria-label="حفظ">${ic('save')}</button><button class="ghost" id="swap">${ic('swap')} بدّلها</button></div>
   </div><div class="vis"><span class="mins">${ic('clock')}<span class="b">${a.mins}</span> دقيقة</span>${visOf(a)}${bands()}</div></article>
  </section>
  ${c ? `<section class="sec rv"><div class="sh"><span class="mark"></span><h2>مفهوم اليوم</h2><span class="aside">من مقالة اليوم</span></div>
   <div class="ccard rv" id="ccard"><div><span class="tag cn">${ic('learn')} مفهوم</span><h3>${esc(c.ar)}<small>${esc(c.en)}</small></h3><p>${c.defn}</p><div class="ex">${esc(c.example)}</div>
    <div class="acts"><a class="btn2" href="#/c/${c.id}">افتح المفهوم</a><button class="btn2${ST.known.includes(c.id) ? ' done' : ''}" id="know" data-c="${c.id}"><svg class="ic" viewBox="0 0 24 24" style="width:18px;height:18px">${P.check}</svg>${ST.known.includes(c.id) ? 'أخذته' : 'أعرفه'}</button></div></div>
    <div class="side"><div class="formula">p(x) = Cx<sup>−α</sup></div><svg class="curve" viewBox="0 0 220 110"><path d="M8 6 C 22 70, 50 92, 212 100" fill="none" stroke="#F2551A" stroke-width="4" stroke-linecap="round"/><path d="M8 102 H212" stroke="currentColor" stroke-opacity=".25" stroke-width="1.5"/></svg></div></div></section>` : ''}
  <section class="sec"><div class="sh"><span class="mark"></span><h2>صفقات ${ld.date === TODAY ? 'اليوم' : 'آخر يوم'}</h2><span class="aside">${esc(arDay(ld.date))} · <span class="b">${ld.list.length}</span> صفقات ${total ? ` · <span class="b">${money(total)}</span>` : ''}</span></div>
   <div class="deals" id="tdeals">${ld.list.map((d, k) => dealRow(d, k, mx, '#/n/' + d.id)).join('')}</div></section>
  <div class="finish"><button class="big${doneToday ? ' done' : ''}" id="done"><span class="fill"></span><svg class="ic" viewBox="0 0 24 24">${P.check}</svg><span>${doneToday ? 'خلصت قراءة اليوم' : (workday ? 'خلصت قراءة اليوم' : 'خلصت القراءة')}</span></button>
   <div class="more"><a href="#/news">${ic('news')} الأخبار</a><a href="#/articles">${ic('article')} المقالات</a><a href="#/concepts">${ic('learn')} المفاهيم</a><a href="#/dashboard">${ic('dashboard')} الداشبورد</a></div></div>
 </main>`;
}
function bindForYou() {
 runOdo($('#hero'));
 const hero = $('#hero'); hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); hero.querySelector('.light').style.setProperty('--mx', (e.clientX - r.left) + 'px'); hero.querySelector('.light').style.setProperty('--my', (e.clientY - r.top) + 'px'); });
 const sw = $('#swap'); if (sw) sw.onclick = openSwap;
 const kn = $('#know'); if (kn) kn.onclick = () => { const id = kn.dataset.c; if (!ST.known.includes(id)) { ST.known.push(id); save(); } kn.classList.add('done'); kn.lastChild.textContent = 'أخذته'; refreshStats(); };
 const dn = $('#done'); dn.onclick = () => { if (!ST.days.includes(TODAY)) { ST.days.push(TODAY); save(); } dn.classList.add('done'); const s = $(`.wsun .seg[data-d="${TODAY}"]`); if (s) { const k = weekDates().indexOf(TODAY); s.classList.remove('off', 'now'); s.setAttribute('fill', ['#3EA6F2', '#FFD45C', '#FFA235', '#FF7A24', '#F2551A'][k]); } refreshStats(); window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => route(true), 1600); };
}
function refreshStats() { const st = $('.stats'); if (!st) return; const v = [streak(), ST.read.length, ST.known.length]; $$('.stat', st).forEach((el, k) => { const n = el.querySelector('.n'); n.outerHTML = odo(v[k]); }); runOdo(st); }
function openSwap() {
 const cur = todayArticle(); const alts = LIB.filter(a => a.id !== cur.id && !ST.read.includes(a.id));
 const pick = []; ['vc', 'pm', 'ec', 'id'].forEach(c => { const x = alts.find(a => a.cat === c && !pick.includes(a)); if (x && pick.length < 3) pick.push(x); }); alts.forEach(a => { if (pick.length < 3 && !pick.includes(a)) pick.push(a); });
 const el = document.createElement('div'); el.className = 'sheet';
 el.innerHTML = `<div class="pane"><div class="grab"></div><h4>بدّل مقالة اليوم</h4>${pick.map(a => `<button class="alt" data-id="${a.id}"><span class="th">${a.img ? `<img src="img/${a.img}.jpg" alt="">` : esc(a.pub.slice(0, 7).toUpperCase())}</span><span><span class="tag ${a.cat}">${CAT[a.cat]}</span><b>${esc(a.ar)}</b><small>${esc(a.author)} · ${a.mins} دقيقة${a.arabic ? '' : ' · الأصل فقط حاليًا'}</small></span></button>`).join('')}</div>`;
 document.body.appendChild(el);
 el.onclick = e => { const b = e.target.closest('.alt'); if (b) { ST.pick[TODAY] = b.dataset.id; save(); el.remove(); route(true); return; } if (e.target === el) el.remove(); };
}

/* ---------- ARTICLE ---------- */
async function renderArticle(id) {
 const a = lib(id); if (!a) return notFound();
 let body = '';
 if (a.arabic) { try { body = await fetch(`app/articles/${a.id}.html`).then(r => r.text()); } catch (e) {} }
 const tab = a.arabic ? 'ar' : 'orig';
 return `<main class="wrap"><article class="ahead"><a href="#/" class="ghost" style="margin:0;height:auto;padding:0">${ic('back')} لك</a>
  <div class="meta" style="margin-top:18px"><span class="tag ${a.cat}">${CAT[a.cat]}</span><span>${ic('clock')}</span><span><span class="b">${a.mins}</span> دقيقة</span><span>·</span><span>${esc(a.date)}</span></div>
  <h1>${esc(a.ar)}</h1><div class="en">${esc(a.en)}</div>
  <div class="by"><b>${esc(a.author)}</b> · ${esc(a.pub)} · <a href="${esc(a.url)}" target="_blank" rel="noopener">المصدر</a></div>
  <div class="atools"><div class="seg" id="atabs"><span class="pill"></span><button data-t="ar" aria-pressed="${tab === 'ar'}">العربية</button><button data-t="orig" aria-pressed="${tab === 'orig'}">الأصل · English</button></div><button class="iconbtn save" data-save="${a.id}" aria-pressed="${ST.saved.includes(a.id)}" aria-label="حفظ" style="background:var(--paper-2)">${ic('save')}</button></div>
 </article>
 <section class="brief" ${tab === 'ar' ? '' : 'hidden'} id="v-brief"><div class="k">نبذة</div><p>${esc(a.about)}</p>${a.takeaways ? `<div class="k">الخلاصة</div><ol>${a.takeaways.map(t => `<li>${esc(t).replace('α = 1/(gi) + 1', '<bdi dir="ltr" class="b">α = 1/(gi) + 1</bdi>')}</li>`).join('')}</ol>` : ''}</section>
 <section id="v-ar" ${tab === 'ar' ? '' : 'hidden'}>${a.arabic ? `<div class="prose" id="prose">${body}</div>
  <div class="ours">
   ${a.market ? `<div class="box dark"><h4>ماذا يعني هذا لسوقنا</h4>${a.market.map(p => `<p>${esc(p)}</p>`).join('')}<div class="src">المصادر: ${a.marketSrc.map(s => `<a href="${esc(s[1])}" target="_blank" rel="noopener">${esc(s[0])}</a>`).join(' · ')}</div></div>` : ''}
   ${a.concepts ? `<div class="box soft"><h4>المفاهيم في هذه المقالة</h4><div class="cl">${a.concepts.map(cid => { const c = con(cid); return c ? `<a href="#/c/${c.id}">${ic('learn')} ${esc(c.ar)}</a>` : ''; }).join('')}</div></div>` : ''}
   ${a.who ? `<div class="box soft"><h4>من كتبه</h4><p>${esc(a.who)}</p><div class="src">المصدر: <a href="${esc(a.whoSrc[1])}" target="_blank" rel="noopener">${esc(a.whoSrc[0])}</a></div></div>` : ''}
   ${a.match ? `<div class="box soft"><h4>مطابقة مع الأصل</h4><ul>${a.match.map(m => `<li>${esc(m)}</li>`).join('')}</ul></div>` : ''}
  </div>
  <div class="finish"><button class="big${ST.read.includes(a.id) ? ' done' : ''}" id="readdone"><span class="fill"></span><svg class="ic" viewBox="0 0 24 24">${P.check}</svg><span>خلصتها</span></button></div>` : `<div class="empty">النسخة العربية الكاملة لهذه المقالة قيد الإعداد. اقرأ الأصل في التبويب الآخر.</div>`}</section>
 <section id="v-orig" class="origwrap" ${tab === 'orig' ? '' : 'hidden'}>${a.embed === false ? `<div class="empty">موقع الكاتب لا يسمح بعرض المقالة داخل موقعنا. <a href="${esc(a.url)}" target="_blank" rel="noopener">افتح الأصل</a></div>` : `<div class="note">${ic('source')} النص الأصلي كما نشره الكاتب، معروض من موقعه داخل صفحتنا.</div><iframe data-src="${esc(a.url)}" title="${esc(a.en)}" loading="lazy" referrerpolicy="no-referrer"></iframe>`}</section>
 </main>`;
}
function bindArticle(id) {
 const a = lib(id); const tabs = $('#atabs'); const pill = $('.pill', tabs);
 const place = () => { const on = $('[aria-pressed="true"]', tabs); const r = on.getBoundingClientRect(), p = tabs.getBoundingClientRect(); pill.style.width = r.width + 'px'; pill.style.transform = `translateX(${r.left - p.left - 5}px)`; pill.style.left = '5px'; };
 requestAnimationFrame(place);
 $$('button', tabs).forEach(b => b.onclick = () => { $$('button', tabs).forEach(x => x.setAttribute('aria-pressed', String(x === b))); place(); const t = b.dataset.t; $('#v-ar').hidden = t !== 'ar'; $('#v-brief').hidden = t !== 'ar'; $('#v-orig').hidden = t !== 'orig'; const f = $('#v-orig iframe'); if (t === 'orig' && f && !f.src) f.src = f.dataset.src; });
 if (!a.arabic) { const f = $('#v-orig iframe'); if (f) f.src = f.dataset.src; }
 const pr = $('#prose');
 if (pr) {
  $$('.term', pr).forEach(t => { if (t.dataset.en === 'power law') { t.className = 'cterm'; t.dataset.c = 'power-law'; } else t.onclick = () => t.classList.toggle('on'); });
  pr.addEventListener('click', e => { const t = e.target.closest('.cterm'); if (!t) return; showPop(t, con(t.dataset.c)); });
 }
 const rd = $('#readdone'); if (rd) rd.onclick = () => { if (!ST.read.includes(id)) { ST.read.push(id); save(); } rd.classList.add('done'); };
 const rs = document.createElement('div'); rs.className = 'rsun'; rs.innerHTML = '<i></i>'; rs.id = 'rsun'; document.body.appendChild(rs);
}
function showPop(t, c) {
 $$('.pop').forEach(p => p.remove()); if (!c) return;
 const p = document.createElement('div'); p.className = 'pop';
 p.innerHTML = `<span class="tag cn">مفهوم</span><div style="margin-top:8px"><b>${esc(c.ar)}</b> <span class="b" style="color:var(--ink-2)">${esc(c.en)}</span></div><p>${c.defn}</p><a href="#/c/${c.id}">افتح المفهوم ←</a>`;
 document.body.appendChild(p); const r = t.getBoundingClientRect();
 p.style.top = (window.scrollY + r.bottom + 10) + 'px'; p.style.left = Math.max(12, Math.min(window.innerWidth - p.offsetWidth - 12, r.left + r.width / 2 - p.offsetWidth / 2)) + 'px';
 setTimeout(() => document.addEventListener('click', function f(e) { if (!p.contains(e.target) && e.target !== t) { p.remove(); document.removeEventListener('click', f); } }), 0);
}

/* ---------- LIBRARY ---------- */
function renderLibrary(q) {
 const f = q.get('c') || 'all';
 const list = LIB.filter(a => f === 'all' || a.cat === f);
 return `<main class="wrap">${head('المقالات', 'مكتبة مختارة بعناية: VC، والأسواق الخاصة، والاقتصاد. كل مقالة كاملة داخل الموقع.')}
  <div class="chips">${[['all', 'الكل'], ['vc', 'VC'], ['pm', 'أسواق خاصة'], ['ec', 'اقتصاد وأسواق'], ['id', 'فكرة اقتصادية']].map(([k, l]) => `<a class="chipb" href="#/articles?c=${k}" aria-pressed="${f === k}" style="display:inline-grid;place-items:center;text-decoration:none">${l}</a>`).join('')}</div>
  <div class="lgrid">${list.map((a, k) => `<a class="lcard rv" href="#/a/${a.id}" style="transition-delay:${k * .05}s"><div class="vis">${a.chart && window.TMR_CHARTS ? `<div style="position:absolute;inset:14px 10px 18px">${TMR_CHARTS[a.chart]}</div>` : a.img ? `<img src="img/${a.img}.jpg" alt="" loading="lazy">` : `<div class="typo"><b>${esc(a.pub.toUpperCase())}</b><em>${esc(a.en)}</em></div>`}${bands()}</div><div class="bd"><div class="meta"><span class="tag ${a.cat}">${CAT[a.cat]}</span><span>${a.mins} دقيقة</span></div><h3>${esc(a.ar)}</h3><p>${esc(a.author)} · ${esc(a.pub)}</p><div class="ft">${a.arabic ? '<span class="ar-ok">● العربية كاملة</span>' : '<span>الأصل · العربية قيد الإعداد</span>'}${ST.read.includes(a.id) ? ' · قرأتها' : ''}</div></div></a>`).join('')}</div></main>`;
}

/* ---------- CONCEPTS ---------- */
function renderConcepts() {
 return `<main class="wrap">${head('المفاهيم', 'كل مفهوم يمر في مقالة يُضاف هنا: تعريف دقيق بمرجعه، وكيف يشتغل، ومثال حقيقي حين ينطبق.')}
  <div class="cgrid">${CON.map((c, k) => `<a class="cbox rv" href="#/c/${c.id}"><span class="tag cn">${esc(c.stage)}</span><b>${esc(c.ar)}</b><span class="b" style="color:var(--ink-2)">${esc(c.en)}</span><span>${c.defn.replace(/<[^>]+>/g, '').slice(0, 120)}…</span></a>`).join('')}
  <div class="cbox soon"><b>قيد المراجعة</b><span>المفاهيم السابقة تُراجع واحدًا واحدًا على المعيار الجديد، وتظهر هنا تباعًا.</span></div></div></main>`;
}
function renderConcept(id) {
 const c = con(id); if (!c) return notFound();
 const arts = (c.articles || []).map(lib).filter(Boolean);
 return `<main class="wrap"><article class="cpage"><a href="#/concepts" class="ghost" style="margin:0;height:auto;padding:0">${ic('back')} المفاهيم</a>
  <div style="margin-top:20px"><span class="tag cn">${esc(c.stage)}</span></div><h1>${esc(c.ar)}</h1><div class="en">${esc(c.en)}</div>
  <h2>التعريف</h2><p>${c.defn}</p><h2>كيف يشتغل</h2><p>${esc(c.how)}</p><h2>مثال حقيقي</h2><p>${esc(c.example)}</p>
  <h2>ما يختلط معه</h2><div class="cmp">${c.confuse.map(x => `<div><b>${esc(x[0])}</b>${esc(x[1])}</div>`).join('')}</div>
  ${arts.length ? `<h2>مقالات تتناوله</h2><div class="cl">${arts.map(a => `<a href="#/a/${a.id}">${ic('article')} ${esc(a.ar)}</a>`).join('')}</div>` : ''}
  <h2>المرجع</h2><div class="srcs">${c.refs.map(r => `<a href="${esc(r[1])}" target="_blank" rel="noopener">${ic('source')} ${esc(r[0])}</a>`).join('')}</div>
  <div class="finish"><button class="btn2${ST.known.includes(c.id) ? ' done' : ''}" id="know" data-c="${c.id}" style="height:54px;padding:0 28px;font-size:17px"><svg class="ic" viewBox="0 0 24 24">${P.check}</svg>${ST.known.includes(c.id) ? 'أخذته' : 'أعرفه'}</button></div></article></main>`;
}

/* ---------- NEWS ---------- */
function renderNews(q) {
 const ty = q.get('t') || 'all';
 const list = ITEMS.filter(x => (x.type === 'news' || x.type === 'deal') && (ty === 'all' || x.type === ty)).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
 return `<main class="wrap">${head('الأخبار', 'الأخبار والصفقات المحررة، كل خبر بمصدره.')}
  <div class="chips">${[['all', 'الكل'], ['deal', 'الصفقات'], ['news', 'الأخبار']].map(([k, l]) => `<a class="chipb" href="#/news?t=${k}" aria-pressed="${ty === k}" style="display:inline-grid;place-items:center;text-decoration:none">${l}</a>`).join('')}</div>
  <div class="nlist">${list.slice(0, 120).map(x => { const t = (x.ar && x.ar.title) || (x.en && x.en.title) || ''; return `<a class="nrow rv" href="#/n/${x.id}"><div><div class="meta"><span class="tag ${x.type}">${x.type === 'deal' ? 'صفقة' : 'خبر'}</span>${x.type === 'deal' && x.amount ? `<b class="b">${esc(x.amountLabel || money(x.amount))}</b>` : ''}<span>${esc(arDate(x.date))}</span></div><h3>${esc(t)}</h3><div class="sub">${esc((x.source && x.source.name) || '')}${x.market ? ' · ' + esc(MKT[x.market] || x.market) : ''}</div></div><div class="th">${x.image && x.image.file ? `<img src="img/${esc(x.image.file)}" alt="" loading="lazy">` : ''}</div></a>`; }).join('')}</div></main>`;
}
function renderStory(id) {
 const x = ITEMS.find(i => i.id === id); if (!x) return notFound();
 const A = x.ar || {};
 const facts = [];
 if (x.type === 'deal') { facts.push(['المبلغ', x.amountLabel || money(x.amount)]); if (x.stage) facts.push(['المرحلة', stg(x.stage) + (STG[x.stage] ? '' : '')]); }
 if (x.industry) facts.push(['القطاع', ind(x.industry)]); if (x.market) facts.push(['السوق', MKT[x.market] || x.market]);
 const lead = (x.investors || []).filter(i => i.lead).map(i => i.name); if (lead.length) facts.push(['قاد الجولة', lead.join('، ')]);
 return `<main class="wrap"><article class="story"><a href="#/news" class="ghost" style="margin:0;height:auto;padding:0">${ic('back')} الأخبار</a>
  <div class="meta" style="margin-top:18px"><span class="tag ${x.type}">${x.type === 'deal' ? 'صفقة' : 'خبر'}</span><span>${esc(arDate(x.date))}</span><span>·</span><span>${esc((x.source && x.source.name) || '')}</span></div>
  <h1>${esc(A.title || '')}</h1>${A.dek ? `<div class="dek">${esc(A.dek)}</div>` : ''}
  ${x.image && x.image.file ? `<div class="pic"><img src="img/${esc(x.image.file)}" alt=""></div><div class="cred">الصورة: ${esc(x.image.credit || '')}</div>` : ''}
  ${facts.length ? `<div class="facts">${facts.map(f => `<div class="fact"><small>${esc(f[0])}</small><b>${esc(f[1])}</b></div>`).join('')}</div>` : ''}
  <div class="prose">${(A.body || []).map(p => `<p>${esc(typeof p === 'string' ? p : (p.ar || p.text || ''))}</p>`).join('')}
  ${A.why ? `<div class="box soft" style="margin-top:10px"><h4>ليش هذا مهم</h4><p>${esc(A.why)}</p></div>` : ''}</div>
  <div class="srcs">${(x.sources || [x.source]).filter(Boolean).map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${ic('source')} ${esc(s.name)}</a>`).join('')}</div></article></main>`;
}

/* ---------- DASHBOARD ---------- */
const DQ = { p: 'year', r: 'all', open: null };
const RC = { all: null, KSA: ['KSA'], UAE: ['UAE'], EGY: ['EGY', 'Egypt'] };
function months() { return ((SITE.collections.meta.series || {}).months || []).filter(m => m.total != null); }
function periodMonths() { const M = months(); if (DQ.p === 'month') return M.slice(-1); if (DQ.p === 'q') return M.slice(-3); return M; }
function mval(m) { if (DQ.r === 'all') return [m.total, m.deals]; const c = m.countries || {}; const k = DQ.r === 'EGY' ? (c.EGY || c.Egypt) : c[DQ.r]; return k ? [k[0], k[1]] : [0, 0]; }
function dealsIn(ms, extra) {
 const keys = new Set(ms.map(m => m.m));
 return DEALS.filter(d => keys.has((d.date || '').slice(0, 7)) && (DQ.r === 'all' || (RC[DQ.r] || []).includes(d.market)) && (!extra || extra(d))).sort((a, b) => (b.amount || 0) - (a.amount || 0));
}
function renderDash() {
 const M = months(); const PM = periodMonths(); const prev = DQ.p === 'year' ? [] : DQ.p === 'q' ? M.slice(-6, -3) : M.slice(-2, -1);
 const sum = ms => ms.reduce((s, m) => { const v = mval(m); return [s[0] + (v[0] || 0), s[1] + (v[1] || 0)]; }, [0, 0]);
 const cur = sum(PM), pv = sum(prev);
 const chg = (a, b) => b ? Math.round((a - b) / b * 100) : null;
 const c1 = chg(cur[0], pv[0]), c2 = chg(cur[1], pv[1]);
 const per = { year: 'من يناير إلى ' + (PM.length ? AR_MON[+PM[PM.length - 1].m.slice(5) - 1] : ''), q: 'آخر 3 أشهر', month: PM.length ? AR_MON[+PM[0].m.slice(5) - 1] : '' }[DQ.p];
 const regionName = { all: 'المنطقة', KSA: 'السعودية', UAE: 'الإمارات', EGY: 'مصر' }[DQ.r];
 const mxv = Math.max(...M.map(m => mval(m)[0] || 0), 1);
 const cols = M.map((m, k) => { const v = mval(m); const h = Math.max(2, (v[0] || 0) / mxv * 100); const inP = PM.includes(m);
  return `<div class="mcol${DQ.open && DQ.open.t === 'm' && DQ.open.v === m.m ? ' on' : ''}" data-m="${m.m}" style="--i:${k};--h:${h}%;opacity:${inP ? 1 : .38}"><span class="val">${money(v[0])}</span><span class="stack" style="--h:${h}%"><i style="flex:1;background:linear-gradient(180deg,#3EA6F2,#6CBEF7)"></i></span><span class="cnt">${v[1] || 0}</span><span class="lab">${AR_MON[+m.m.slice(5) - 1].slice(0, 3)}</span></div>`; }).join('');
 // countries from series
 const cmap = {}; PM.forEach(m => Object.entries(m.countries || {}).forEach(([k, v]) => { const kk = k === 'Egypt' ? 'EGY' : k; cmap[kk] = cmap[kk] || [0, 0]; cmap[kk][0] += v[0] || 0; cmap[kk][1] += v[1] || 0; }));
 const ctot = PM.reduce((s, m) => s + (m.total || 0), 0) || 1;
 const crow = Object.entries(cmap).sort((a, b) => b[1][0] - a[1][0]).slice(0, 7); const cmx = Math.max(...crow.map(c => c[1][0]), 1);
 // sectors & investors from tracked deals
 const TD = dealsIn(PM);
 const sec = {}; TD.forEach(d => { const k = d.industry || 'Other'; sec[k] = sec[k] || [0, 0]; sec[k][0] += d.amount || 0; sec[k][1]++; });
 const srow = Object.entries(sec).sort((a, b) => b[1][0] - a[1][0]).slice(0, 8); const smx = Math.max(...srow.map(s => s[1][0]), 1);
 const inv = {}; TD.forEach(d => (d.investors || []).forEach(i => { inv[i.name] = inv[i.name] || [0, 0, 0]; inv[i.name][0]++; inv[i.name][1] += d.amount || 0; if (i.lead) inv[i.name][2]++; }));
 const irow = Object.entries(inv).sort((a, b) => b[1][0] - a[1][0] || b[1][1] - a[1][1]).slice(0, 10); const imx = Math.max(...irow.map(i => i[1][0]), 1);
 const mk = (rows, type, mx, fmt, nm) => `<div class="hbars">${rows.map(([k, v], i) => `<button class="hb${DQ.open && DQ.open.t === type && DQ.open.v === k ? ' on' : ''}" data-t="${type}" data-v="${esc(k)}" style="--i:${i}"><span class="nm">${nm(k)}</span><span class="tr"><i style="--w:${Math.max(3, Math.round(v[0] / mx * 100))}%"></i></span><span class="num">${fmt(v)}</span></button>`).join('')}</div>`;
 const src = ((SITE.collections.meta.series || {}).sources) ? 'Wamda' : 'Wamda';
 const drill = t => DQ.open && DQ.open.t === t ? drillHTML() : '';
 return `<main class="wrap">${head('الداشبورد', 'وين رايح سوق الاستثمار الجريء في المنطقة: الإجمالي، والتوقيت، والدول، والقطاعات، والمستثمرين.')}
  <div class="dfilters"><div class="seg" id="dper"><span class="pill"></span>${[['year', '2026'], ['q', 'آخر 3 أشهر'], ['month', 'آخر شهر']].map(([k, l]) => `<button data-p="${k}" aria-pressed="${DQ.p === k}">${l}</button>`).join('')}</div>
   <div class="seg" id="dreg"><span class="pill"></span>${[['all', 'المنطقة'], ['KSA', 'السعودية'], ['UAE', 'الإمارات'], ['EGY', 'مصر']].map(([k, l]) => `<button data-r="${k}" aria-pressed="${DQ.r === k}">${l}</button>`).join('')}</div></div>
  <div class="kpis"><div class="kpi rv"><div class="l">إجمالي التمويل · ${esc(regionName)} · ${esc(per)}</div><div class="v">${money(cur[0])}</div><div class="d">${c1 == null ? '' : `<span class="${c1 >= 0 ? 'up' : 'dn'}">${c1 >= 0 ? '▲' : '▼'} ${Math.abs(c1)}%</span> عن الفترة السابقة`}</div><div class="src">أرقام السوق من Wamda الشهرية</div></div>
   <div class="kpi rv"><div class="l">عدد الصفقات · ${esc(regionName)} · ${esc(per)}</div><div class="v">${cur[1]}</div><div class="d">${c2 == null ? '' : `<span class="${c2 >= 0 ? 'up' : 'dn'}">${c2 >= 0 ? '▲' : '▼'} ${Math.abs(c2)}%</span> عن الفترة السابقة`}</div><div class="src">أرقام السوق من Wamda الشهرية</div></div></div>
  <section class="panel rv"><div class="ph"><h3>التوقيت</h3><small>التمويل وعدد الصفقات شهريًا · ${esc(regionName)}</small><span class="hint">اضغط على شهر لترى صفقاته</span></div><div class="months" id="months">${cols}</div>${drill('m')}</section>
  ${DQ.r === 'all' ? `<section class="panel rv"><div class="ph"><h3>الدول</h3><small>${esc(per)} · القيمة وعدد الصفقات وحصة كل دولة</small><span class="hint">اضغط على دولة</span></div>${mk(crow, 'c', cmx, v => `${money(v[0])}<small><span dir="ltr">${Math.round(v[0] / ctot * 100)}%</span> · ${v[1]} صفقة</small>`, k => esc(MKT[k] || k))}${drill('c')}</section>` : ''}
  <section class="panel rv"><div class="ph"><h3>القطاعات</h3><small>من الصفقات التي رصدناها · ${esc(per)}</small><span class="hint">اضغط على قطاع</span></div>${srow.length ? mk(srow, 's', smx, v => `${money(v[0])}<small>${v[1]} صفقة</small>`, k => esc(ind(k))) : '<div class="empty">لا توجد صفقات مرصودة في هذه الفترة.</div>'}${drill('s')}</section>
  <section class="panel rv"><div class="ph"><h3>أنشط المستثمرين</h3><small>من الصفقات التي رصدناها · ${esc(per)}</small><span class="hint">اضغط على مستثمر</span></div>${irow.length ? mk(irow, 'i', imx, v => `${v[0]} صفقة<small>${money(v[1])}${v[2] ? ` · قاد ${v[2]}` : ''}</small>`, k => `${logoOf(k) ? `<img src="${esc(logoOf(k))}" alt="">` : ''}${esc(k)}`) : '<div class="empty">لا توجد صفقات مرصودة في هذه الفترة.</div>'}${drill('i')}</section>
  <p style="font-size:13px;color:var(--ink-3);margin-top:18px">الإجماليات والتوقيت والدول من تقارير Wamda الشهرية. القطاعات والمستثمرون وقوائم الصفقات من الصفقات التي رصدها الموقع بمصادرها (من يوليو 2026).</p></main>`;
}
function drillHTML() {
 const o = DQ.open; const PM = periodMonths(); let list = [], title = '';
 if (o.t === 'm') { const m = months().find(x => x.m === o.v); list = dealsIn([m]); title = AR_MON[+o.v.slice(5) - 1] + ' ' + o.v.slice(0, 4); }
 if (o.t === 'c') { list = DEALS.filter(d => PM.some(m => (d.date || '').startsWith(m.m)) && (d.market === o.v || (o.v === 'EGY' && d.market === 'Egypt'))).sort((a, b) => (b.amount || 0) - (a.amount || 0)); title = MKT[o.v] || o.v; }
 if (o.t === 's') { list = dealsIn(PM, d => (d.industry || 'Other') === o.v); title = ind(o.v); }
 if (o.t === 'i') { list = dealsIn(PM, d => (d.investors || []).some(i => i.name === o.v)); title = o.v; }
 const mx = Math.max(...list.map(d => d.amount || 1), 2); const tot = list.reduce((s, d) => s + (d.amount || 0), 0);
 return `<div class="drill in"><div class="dh"><b>${esc(title)}</b><small><span class="b">${list.length}</span> صفقة · <span class="b">${money(tot)}</span> معلن</small><button id="dclose" aria-label="إغلاق">${ic('close')}</button></div>${list.length ? `<div class="deals in">${list.slice(0, DQ.all ? 999 : 12).map((d, k) => dealRow(d, k, mx)).join('')}</div>${list.length > 12 && !DQ.all ? `<div style="text-align:center;margin-top:12px"><button class="btn2" id="dall">عرض كل الصفقات (<span class="b">${list.length}</span>)</button></div>` : ''}` : `<div class="empty">لم نرصد صفقات هذه الفترة بالتفصيل، والأرقام أعلاه من Wamda.</div>`}</div>`;
}
function bindDash() {
 const placeSeg = seg => { const pill = $('.pill', seg), on = $('[aria-pressed="true"]', seg); const r = on.getBoundingClientRect(), p = seg.getBoundingClientRect(); pill.style.left = '5px'; pill.style.width = r.width + 'px'; pill.style.transform = `translateX(${r.left - p.left - 5}px)`; };
 $$('#dper,#dreg').forEach(s => requestAnimationFrame(() => placeSeg(s)));
 $$('#dper button').forEach(b => b.onclick = () => { DQ.p = b.dataset.p; DQ.open = null; rerender(); });
 $$('#dreg button').forEach(b => b.onclick = () => { DQ.r = b.dataset.r; DQ.open = null; rerender(); });
 $$('.mcol').forEach(c => c.onclick = () => { DQ.all = false; DQ.open = DQ.open && DQ.open.v === c.dataset.m ? null : { t: 'm', v: c.dataset.m }; rerender(true); });
 $$('.hb').forEach(b => b.onclick = () => { DQ.all = false; DQ.open = DQ.open && DQ.open.t === b.dataset.t && DQ.open.v === b.dataset.v ? null : { t: b.dataset.t, v: b.dataset.v }; rerender(true); });
 const dc = $('#dclose'); if (dc) dc.onclick = () => { DQ.open = null; DQ.all = false; rerender(true); };
 const da = $('#dall'); if (da) da.onclick = () => { DQ.all = true; rerender(true); };
 const ms = $('#months'); if (ms) requestAnimationFrame(() => requestAnimationFrame(() => ms.classList.add('in')));
}
function rerender(keep) { const y = window.scrollY; $('#view').innerHTML = renderDash(); bindDash(); reveal(true); if (keep) window.scrollTo(0, y); }

/* ---------- misc ---------- */
function notFound() { return `<main class="wrap">${head('الصفحة غير موجودة', '<a href="#/">ارجع لصفحة لك</a>')}</main>`; }

/* ---------- shell ---------- */
const ROUTES = [['/', 'لك', 'today'], ['/news', 'الأخبار', 'news'], ['/articles', 'المقالات', 'article'], ['/concepts', 'المفاهيم', 'learn'], ['/dashboard', 'الداشبورد', 'dashboard']];
function shell() {
 document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="stripes-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3EA6F2"/><stop offset=".5" stop-color="#3EA6F2"/><stop offset=".5" stop-color="#FFD45C"/><stop offset=".625" stop-color="#FFD45C"/><stop offset=".625" stop-color="#FFA235"/><stop offset=".75" stop-color="#FFA235"/><stop offset=".75" stop-color="#FF7A24"/><stop offset=".875" stop-color="#FF7A24"/><stop offset=".875" stop-color="#F2551A"/><stop offset="1" stop-color="#F2551A"/></linearGradient></defs></svg>
 <header class="hdr" id="hdr"><div class="bar"><div class="wrap in"><a class="brand" href="#/" aria-label="The Morning Round">${LOGO_LINE}</a>
  <nav class="nav" id="nav">${ROUTES.map(r => `<a href="#${r[0]}" data-r="${r[0]}">${ic(r[2])}${r[1]}</a>`).join('')}<span class="ind" id="navind"></span></nav>
  <div class="tools"><button class="tbtn" id="theme" aria-label="الوضع">${ic('moon')}</button></div></div></div><div class="skyline" id="skyline"></div></header>
 <div id="view"></div>
 <footer class="foot"><div class="wrap in"><div><i>Every page compounds</i><span>VC · Private markets · Saudi &amp; GCC · Riyadh</span></div>${stack('f-')}</div></footer>
 <nav class="dock" id="dock"><span class="ind" id="dockind"></span>${ROUTES.map(r => `<a href="#${r[0]}" data-r="${r[0]}">${ic(r[2])}<span>${r[1]}</span></a>`).join('')}</nav>`);
 // time-of-day sky
 const h = NOW.getHours() + NOW.getMinutes() / 60; const sky = h < 5 ? ['#1B2A4A', '#3EA6F2'] : h < 7 ? ['#FFD45C', '#FF7A24'] : h < 9 ? ['#FFD45C', '#3EA6F2'] : h < 16 ? ['#3EA6F2', '#8DCBF7'] : h < 19 ? ['#FFA235', '#F2551A'] : ['#1B2A4A', '#3EA6F2'];
 document.documentElement.style.setProperty('--sky1', sky[0]); document.documentElement.style.setProperty('--sky2', sky[1]);
 // theme
 const tb = $('#theme'); const setT = t => { if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; tb.innerHTML = ic((t || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark' ? 'sunny' : 'moon'); };
 let th = null; try { th = localStorage.getItem('tmr-theme'); } catch (e) {} setT(th);
 tb.onclick = () => { const curr = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); const n = curr === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('tmr-theme', n); } catch (e) {} setT(n); };
 // hide header on scroll down
 let ly = 0; window.addEventListener('scroll', () => { const y = window.scrollY; const down = y > ly && y > 140; $('#hdr').classList.toggle('hide', down); $('#dock').classList.toggle('hide', down && y > 300); ly = y;
  const rs = $('#rsun'); const pr = $('#prose'); if (rs && pr) { const r = pr.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (window.innerHeight * .6 - r.top) / r.height)); rs.style.setProperty('--r', p.toFixed(3)); } }, { passive: true });
 // save buttons (delegated)
 document.addEventListener('click', e => { const b = e.target.closest('[data-save]'); if (!b) return; const id = b.dataset.save; const i = ST.saved.indexOf(id); if (i < 0) ST.saved.push(id); else ST.saved.splice(i, 1); save(); b.setAttribute('aria-pressed', String(i < 0)); });
 document.addEventListener('click', e => { const b = e.target.closest('#know'); if (!b || b.closest('.ccard')) return; const id = b.dataset.c; if (!ST.known.includes(id)) { ST.known.push(id); save(); } b.classList.add('done'); b.lastChild.textContent = 'أخذته'; });
}
function navSync(path) {
 const base = '/' + (path.split('/')[1] || '');
 const key = { '/': '/', '/a': '/articles', '/c': '/concepts', '/n': '/news' }[base] || base;
 $$('#nav a,#dock a').forEach(a => a.classList.toggle('on', a.dataset.r === key));
 const place = (wrap, ind, dock) => { const on = $(`a.on`, wrap); if (!on) { ind.style.opacity = 0; return; } ind.style.opacity = 1; const r = on.getBoundingClientRect(), p = wrap.getBoundingClientRect(); const x = r.left - p.left + (dock ? 0 : r.width / 2 - 12); ind.style.transform = `translateX(${x}px)`; };
 requestAnimationFrame(() => { place($('#nav'), $('#navind')); place($('#dock'), $('#dockind'), true); });
}
let io;
function reveal(now) { if (io) io.disconnect(); io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' }); $$('.rv,.deals,#acard,#ccard').forEach(el => io.observe(el)); }
async function route(fresh) {
 $$('.rsun,.pop').forEach(x => x.remove());
 const raw = (location.hash || '#/').slice(1); const [path, qs] = raw.split('?'); const q = new URLSearchParams(qs || '');
 const parts = path.split('/').filter(Boolean);
 let html, bind = () => {};
 if (!parts.length) { html = renderForYou(); bind = bindForYou; }
 else if (parts[0] === 'a') { html = await renderArticle(parts[1]); bind = () => bindArticle(parts[1]); }
 else if (parts[0] === 'articles') html = renderLibrary(q);
 else if (parts[0] === 'concepts') html = renderConcepts();
 else if (parts[0] === 'c') html = renderConcept(parts[1]);
 else if (parts[0] === 'news') html = renderNews(q);
 else if (parts[0] === 'n') html = renderStory(parts[1]);
 else if (parts[0] === 'dashboard') { html = renderDash(); bind = bindDash; }
 else html = notFound();
 const apply = () => { $('#view').innerHTML = `<div class="page">${html}</div>`; bind(); navSync(path || '/'); reveal(); if (!fresh) window.scrollTo(0, 0); };
 if (document.startViewTransition && !fresh) document.startViewTransition(apply); else apply();
}

/* ---------- intro ---------- */
function intro() {
 let seen = null; try { seen = localStorage.getItem('tmr-intro'); } catch (e) {}
 const force = /[?&]intro/.test(location.search);
 if (seen === TODAY && !force) return Promise.resolve();
 try { localStorage.setItem('tmr-intro', TODAY); } catch (e) {}
 const el = document.createElement('div'); el.id = 'intro';
 el.innerHTML = `<span class="glow"></span><span class="rays"></span><div class="box"><span class="lgw"><span class="hz"></span>${stack('i-')}</span><span class="slogan">Every page compounds</span></div><div class="date">${esc(arDay(TODAY))}</div>`;
 document.body.appendChild(el);
 return new Promise(res => { requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('go'))); const end = () => { el.classList.add('out'); setTimeout(() => el.remove(), 900); res(); }; const t = setTimeout(end, 3900); el.onclick = () => { clearTimeout(t); end(); }; });
}

/* ---------- boot ---------- */
(async function boot() {
 shell();
 $('#view').innerHTML = '<div class="loader"><i></i></div>';
 const ip = intro();
 try { await load(); } catch (e) { $('#view').innerHTML = `<main class="wrap"><div class="empty">تعذر تحميل البيانات.</div></main>`; return; }
 await route(true);
 window.addEventListener('hashchange', () => route(false));
 window.addEventListener('resize', () => navSync((location.hash || '#/').slice(1).split('?')[0]));
 await ip;
})();
})();
