/* The Morning Round — v5 app */
(function () {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const VER = (document.currentScript && (document.currentScript.src.split('v=')[1] || '')) || '';

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
 globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.3 3.5 5.1 3.5 8.5s-1.1 6.2-3.5 8.5c-2.4-2.3-3.5-5.1-3.5-8.5s1.1-6.2 3.5-8.5z"/>',
 streak: '<path d="M12 3.5c.8 3.6 5.5 5.6 5.5 10.5a5.5 5.5 0 0 1-11 0c0-2.8 1.8-3.9 1.8-6 1.4 1 2.3 2.4 2.3 3.8 0-3.7 1.4-5.5 1.4-8.3z"/>',
 swap: '<path d="M4 8h13l-3.5-3.5"/><path d="M20 16H7l3.5 3.5"/>',
 clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 check: '<path class="ckp" d="M5 12.5l4.5 4.5L19 7.5"/>',
 close: '<path d="M6 6l12 12M18 6L6 18"/>',
 moon: '<path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5z"/>',
 sunny: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
 back: '<path d="M14 6l6 6-6 6"/><path d="M20 12H4"/>',
 fwd: '<path d="M10 6l-6 6 6 6"/><path d="M4 12h16"/>',
 ext: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
 star: '<path d="M12 3.5l2.4 5.6 6.1.5-4.6 4 1.4 5.9L12 16.4 6.7 19.5l1.4-5.9-4.6-4 6.1-.5z"/>',
 translate: '<path d="M4 5.5h9M8.5 3.5v2M11 5.5c-1 4-3.5 7-7 8.5"/><path d="M6.5 9c1.2 2 3 3.5 5 4.3"/><path d="M12.5 20.5l4-9 4 9M14 17.5h5"/>',
 lang: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.3 3.5 5.1 3.5 8.5s-1.1 6.2-3.5 8.5c-2.4-2.3-3.5-5.1-3.5-8.5s1.1-6.2 3.5-8.5z"/>',
 quote: '<path d="M6 17c-1.5 0-2.5-1.2-2.5-3 0-3.2 2-6 5-7l.6 1.2C7.4 9 6.6 10.3 6.6 11.5H8.5v5.5z"/><path d="M15 17c-1.5 0-2.5-1.2-2.5-3 0-3.2 2-6 5-7l.6 1.2c-1.7.8-2.5 2.1-2.5 3.3h1.9v5.5z"/>',
 bolt: '<path d="M13 3.5L5.5 13.5h6l-1 7 7.5-10h-6z"/>',
 filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
 bookmark: '<path d="M7 4h10v16l-5-3.6L7 20z"/>',
 pen: '<path d="M4 20l4.5-1 10-10-3.5-3.5-10 10z"/><path d="M13.5 7l3.5 3.5"/>',
 play: '<path d="M8 5.5v13l10-6.5z"/>',
 pause: '<path d="M8 5.5v13M16 5.5v13"/>'
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;

/* ---------- language ---------- */
let LANG = 'ar';
try { LANG = localStorage.getItem('tmr-lang') || (/[?&]lang=en/.test(location.search) ? 'en' : 'ar'); } catch (e) {}
if (/[?&]lang=en/.test(location.search)) LANG = 'en';
const tr = (ar, en) => LANG === 'en' ? en : ar;
const EN = () => LANG === 'en';
/* pick a bilingual field: o.k (Arabic) or o.k_en (English) */
const tx = (o, k) => o ? (EN() ? (o[k + '_en'] != null ? o[k + '_en'] : o[k]) : (o[k] != null ? o[k] : o[k + '_en'])) : '';
const AR_DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const EN_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const AR_MON = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const EN_MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MON = () => EN() ? EN_MON : AR_MON;
const dt = s => new Date((s || '').slice(0, 10) + 'T12:00:00');
const fmtDate = s => { if (!s) return ''; const d = dt(s); if (isNaN(d)) return s; return `${d.getDate()} ${MON()[d.getMonth()]} ${d.getFullYear()}`; };
const fmtDay = s => { const d = dt(s); return EN() ? `${EN_DAYS[d.getDay()]} ${d.getDate()} ${EN_MON[d.getMonth()]}` : `${AR_DAYS[d.getDay()]} ${d.getDate()} ${AR_MON[d.getMonth()]}`; };
const fmtShort = s => { const d = dt(s); return `${d.getDate()} ${MON()[d.getMonth()]}`; };

/* ---------- state ---------- */
const KEY = 'tmr4';
let ST = { days: [], read: [], known: [], saved: [], pick: {}, hl: [] };
try { ST = Object.assign(ST, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
if (!Array.isArray(ST.hl)) ST.hl = [];
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(ST)); } catch (e) {} };
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const NOW = new Date(); const TODAY = iso(NOW);
const DOW = NOW.getDay();
function weekDates() { const s = new Date(NOW); s.setDate(NOW.getDate() - DOW); return [0, 1, 2, 3, 4].map(k => { const d = new Date(s); d.setDate(s.getDate() + k); return iso(d); }); }
function streak() {
 const set = new Set(ST.days); let n = 0; const d = new Date(NOW);
 if (!set.has(iso(d))) d.setDate(d.getDate() - 1);
 for (let k = 0; k < 400; k++) { const w = d.getDay(); if (w === 5 || w === 6) { d.setDate(d.getDate() - 1); continue; } if (set.has(iso(d))) { n++; d.setDate(d.getDate() - 1); } else break; }
 return n;
}

/* ---------- labels ---------- */
const MKT_AR = { KSA: 'السعودية', UAE: 'الإمارات', EGY: 'مصر', QAT: 'قطر', BHR: 'البحرين', KWT: 'الكويت', OMN: 'عُمان', JOR: 'الأردن', MAR: 'المغرب', SYR: 'سوريا', IRQ: 'العراق', LBN: 'لبنان', TUN: 'تونس', PSE: 'فلسطين', DZA: 'الجزائر', LBY: 'ليبيا', SDN: 'السودان', YEM: 'اليمن', PAK: 'باكستان', TUR: 'تركيا', Global: 'عالمي', GCC: 'الخليج', MENA: 'المنطقة' };
const MKT_EN = { KSA: 'Saudi Arabia', UAE: 'UAE', EGY: 'Egypt', QAT: 'Qatar', BHR: 'Bahrain', KWT: 'Kuwait', OMN: 'Oman', JOR: 'Jordan', MAR: 'Morocco', SYR: 'Syria', IRQ: 'Iraq', LBN: 'Lebanon', TUN: 'Tunisia', PSE: 'Palestine', DZA: 'Algeria', LBY: 'Libya', SDN: 'Sudan', YEM: 'Yemen', PAK: 'Pakistan', TUR: 'Türkiye', Global: 'Global', GCC: 'GCC', MENA: 'MENA' };
const MKT_ALIAS = { Egypt: 'EGY', Qatar: 'QAT', Bahrain: 'BHR', Kuwait: 'KWT', Oman: 'OMN', Jordan: 'JOR', Morocco: 'MAR', Syria: 'SYR', Iraq: 'IRQ', Lebanon: 'LBN', Tunisia: 'TUN', Pakistan: 'PAK', Turkey: 'TUR', 'Saudi Arabia': 'KSA' };
const mcode = m => MKT_ALIAS[m] || m;
const mkt = m => { const c = mcode(m); return (EN() ? MKT_EN : MKT_AR)[c] || m || ''; };
const IND_AR = { Fintech: 'التقنية المالية', AI: 'الذكاء الاصطناعي', 'Enterprise AI': 'الذكاء الاصطناعي للشركات', Proptech: 'التقنية العقارية', Automotive: 'السيارات', 'Construction tech': 'تقنية البناء', Healthtech: 'التقنية الصحية', 'Travel tech': 'تقنية السفر', 'E-commerce': 'التجارة الإلكترونية', SaaS: 'البرمجيات', 'Climate tech': 'تقنية المناخ', Logistics: 'اللوجستيات', Adtech: 'تقنية الإعلان', Cybersecurity: 'الأمن السيبراني', 'E-services': 'الخدمات الإلكترونية', Edtech: 'تقنية التعليم', Foodtech: 'تقنية الغذاء', Deeptech: 'التقنية العميقة', Gaming: 'الألعاب', Other: 'أخرى', Mobility: 'التنقل', Insurtech: 'تقنية التأمين', 'HR tech': 'تقنية الموارد البشرية', HRtech: 'تقنية الموارد البشرية', Retail: 'التجزئة', Media: 'الإعلام', Agritech: 'التقنية الزراعية', 'Online services': 'الخدمات الرقمية', Biotech: 'التقنية الحيوية', Hardware: 'العتاد', Energy: 'الطاقة', Legaltech: 'التقنية القانونية', 'VC market': 'سوق الاستثمار الجريء', Web3: 'الويب 3', Govtech: 'التقنية الحكومية', Regtech: 'التقنية التنظيمية', 'Super apps': 'التطبيقات الشاملة' };
const ind = s => EN() ? (s || 'Other') : (IND_AR[s] || s || 'أخرى');
const STG_AR = { Undisclosed: 'مرحلة غير معلنة', 'Pre-IPO': 'ما قبل الطرح', Fund: 'صندوق', 'Pre-seed': 'ما قبل البذرية', Seed: 'بذرية', Angel: 'ملائكي', Acquisition: 'استحواذ', IPO: 'طرح عام', Secondary: 'ثانوية', Strategic: 'استراتيجية', Debt: 'دين', Growth: 'نمو', 'New fund': 'صندوق جديد', Exit: 'تخارج' };
const stg = s => EN() ? (s || '') : (STG_AR[s] || s || '');
const TOPIC = { vc: ['الاستثمار الجريء', 'Venture capital'], pe: ['الملكية الخاصة والائتمان', 'Private equity & credit'], ma: ['الاستحواذات', 'M&A'], mk: ['الأسواق', 'Markets'], ec: ['الاقتصاد', 'Economics'] };
const topic = k => (TOPIC[k] || [k, k])[EN() ? 1 : 0];
/* item kinds and their colour on the sunrise scale */
const KIND = { round: ['جولة', 'Round', 'var(--ember)'], ma: ['استحواذ', 'M&A', 'var(--glow)'], fund: ['صندوق', 'Fund', 'var(--dawn)'], debt: ['تمويل بالدين', 'Debt', 'var(--flame)'], news: ['خبر', 'News', 'var(--sky)'] };
const kindName = k => (KIND[k] || KIND.news)[EN() ? 1 : 0];
const kindCol = k => (KIND[k] || KIND.news)[2];
function kindOf(x) {
 if (x.type === 'news') return 'news';
 const k = x.kind; if (k === 'ma' || k === 'exit') return 'ma'; if (k === 'fund') return 'fund'; if (k === 'debt') return 'debt';
 const s = x.stage || ''; if (/Acquisition|Exit|Merger/i.test(s)) return 'ma'; if (/Fund/i.test(s)) return 'fund'; if (/Debt/i.test(s)) return 'debt';
 return 'round';
}

/* ---------- data ---------- */
let SITE, LIB, CON, ITEMS, DEALS, ROUNDS, LOGOS = {};
const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, '-').replace(/^-|-$/g, '');
const logoOf = name => LOGOS[slug(name)] || null;
const money = m => m == null || m === '' ? tr('غير معلن', 'Undisclosed') : m >= 1000 ? '$' + (+(m / 1000).toFixed(m >= 10000 ? 0 : 2)).toString() + 'B' : m >= 1 ? '$' + (+m.toFixed(m >= 100 ? 0 : 1)) + 'M' : '$' + Math.round(m * 1000) + 'K';
const itTitle = x => ((x[LANG] && x[LANG].title) || (x.ar && x.ar.title) || (x.en && x.en.title) || x.company || '');
const itF = (x, k) => ((x[LANG] && x[LANG][k]) || (x.ar && x.ar[k]) || (x.en && x.en[k]) || '');

async function load() {
 const v = VER ? '?v=' + VER : '';
 const [s, l, c] = await Promise.all([fetch('data/site.json' + v).then(r => r.json()), fetch('app/data/library.json' + v).then(r => r.json()), fetch('app/data/concepts.json' + v).then(r => r.json())]);
 SITE = s; LIB = l; CON = c;
 const items = s.collections.items; ITEMS = Object.entries(items).map(([id, v]) => Object.assign({ id }, v)).filter(x => !x.hidden);
 const meta = s.collections.meta; LOGOS = (meta.logos && meta.logos.map) || {};
 DEALS = ((meta.deals && meta.deals.deals) || []).slice();
 /* one list of rounds: tracked deals + edited deal stories, linked when they are the same company */
 const story = {}; ITEMS.filter(x => x.type === 'deal').forEach(x => { story[slug(x.company)] = story[slug(x.company)] || x; });
 const seen = new Set();
 ROUNDS = DEALS.map(d => { const st = story[slug(d.company)]; const near = st && Math.abs(dt(st.date) - dt(d.date)) < 864e6 * 1.2; if (near) seen.add(st.id); return Object.assign({}, d, { market: mcode(d.market), story: near ? st.id : null, k: kindOf(d) }); });
 ITEMS.filter(x => x.type === 'deal' && !seen.has(x.id)).forEach(x => ROUNDS.push({ id: x.id, date: x.date, company: x.company, amount: x.amount, amountLabel: x.amountLabel, stage: x.stage, market: mcode(x.market), industry: x.industry, investors: (x.investors || []).map(i => ({ name: i.name, lead: !!(i.lead || i.role === 'lead') })), source: x.source, story: x.id, k: kindOf(x) }));
 ROUNDS.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.amount || 0) - (a.amount || 0));
}

/* ---------- shared bits ---------- */
const LOGO_LINE = window.TMR_LOGO_LINE || '';
const uniq = (s, p) => s.replace(/id="([^"]+)"/g, 'id="' + p + '$1"').replace(/url\(#([^)]+)\)/g, 'url(#' + p + '$1)');
const stack = p => uniq(window.TMR_LOGO_STACK || '', p);
const ARTS = () => LIB.filter(a => a.arabic);
const lib = id => LIB.find(a => a.id === id);
const con = id => CON.find(c => c.id === id);
const bands = () => '<div class="bands"><i></i><i></i><i></i><i></i></div>';
function visOf(a) {
 if (a.chart && window.TMR_CHARTS && TMR_CHARTS[a.chart]) return TMR_CHARTS[a.chart];
 if (a.img) return `<img src="img/${a.img}.jpg" alt="" loading="lazy">`;
 return `<div class="typo"><b>${esc(a.pub.toUpperCase())}</b><span>${esc(tx(a, 'author'))}</span><em>${esc(a.en)}</em></div>`;
}
function logoBox(name, cls = '') { const u = logoOf(name); return u ? `<span class="logo ${cls}"><img src="${esc(u)}" alt="" loading="lazy"></span>` : `<span class="logo t ${cls}">${esc((name || '?').replace(/^(the|al)[\s-]/i, '').slice(0, 2))}</span>`; }
const leadOf = d => { const l = (d.investors || []).find(i => i.lead || i.role === 'lead'); return l ? l.name : ((d.investors || [])[0] || {}).name || ''; };
const roundHref = d => d.story ? `href="#/n/${d.story}"` : `href="${esc((d.source && d.source.url) || '#')}" target="_blank" rel="noopener"`;
function dealRow(d, k, max) {
 const w = d.amount ? Math.max(5, Math.round(Math.log10(Math.max(1.2, d.amount)) / Math.log10(Math.max(2, max)) * 100)) : 4;
 const lead = leadOf(d);
 return `<a class="drow" style="--i:${k};--w:${w}%;--kc:${kindCol(d.k || kindOf(d))}" ${roundHref(d)} data-co="${esc(d.company)}">${logoBox(d.company)}<span class="dname"><b>${esc(d.company)}</b><small>${esc(ind(d.industry))}${d.stage ? ' · ' + esc(stg(d.stage)) : ''} · ${esc(fmtShort(d.date))}</small></span><span class="damt"><b>${esc(d.amountLabel && !EN() && d.amountLabel === 'Undisclosed' ? money(null) : (d.amount ? money(d.amount) : (d.amountLabel || money(null))))}</b><span class="dbar"><i></i><i></i><i></i><i></i></span></span><span class="dlead">${lead ? esc(lead) : '—'}</span><span class="dmkt">${esc(mkt(d.market))}</span></a>`;
}
const head = (title, sub) => `<header class="phead"><h1><span class="mark"></span>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</header>`;
const backLink = (href, label) => `<a href="${href}" class="back">${ic(EN() ? 'fwd' : 'back')} ${label}</a>`;

/* ---------- FOR YOU ---------- */
function todayArticle() {
 const A = ARTS(); const p = ST.pick[TODAY]; if (p && A.find(a => a.id === p)) return lib(p);
 return A.find(a => !ST.read.includes(a.id)) || A[0] || LIB[0];
}
function todayConcept(a) {
 const ids = (a && a.concepts) || [];
 return con(ids.find(i => !ST.known.includes(i)) || ids[0]) || CON.find(c => !ST.known.includes(c.id)) || CON[0];
}
function topStories(n) {
 const list = ITEMS.filter(x => (x.type === 'news' || x.type === 'deal') && x.date && x.date <= TODAY).sort((a, b) => b.date.localeCompare(a.date) || (b.amount || 0) - (a.amount || 0));
 if (!list.length) return [];
 const last = dt(list[0].date); const near = list.filter(x => (last - dt(x.date)) / 864e5 <= 10);
 /* keep a mix: biggest deals first among the most recent, then news */
 return near.slice(0, n);
}
function storyCard(x, k) {
 const kd = kindOf(x); const isDeal = x.type === 'deal';
 return `<a class="tcard rv" href="#/n/${x.id}" style="--kc:${kindCol(kd)};transition-delay:${k * .05}s"><span class="band"></span>
  <div class="th">${isDeal ? logoBox(x.company, 'lg2') : ''}${isDeal && x.amount ? `<b class="amt b">${esc(money(x.amount))}</b>` : x.image && x.image.file ? `<span class="ph"><img src="img/${esc(x.image.file)}" alt="" loading="lazy"></span>` : ''}</div>
  <span class="kd">${esc(kindName(kd))}${x.market ? ' · ' + esc(mkt(x.market)) : ''}</span><h3>${esc(itTitle(x))}</h3><span class="dd">${esc(fmtDay(x.date))}</span></a>`;
}
function wsunSVG() {
 const wk = weekDates(); const set = new Set(ST.days); const bandsY = [[129, 20], [158, 18], [185, 16], [212, 18]];
 const col = ['#3EA6F2', '#FFD45C', '#FFA235', '#FF7A24', '#F2551A'];
 const segs = wk.map((d, k) => { const on = set.has(d); const now = d === TODAY && !on; const attrs = `class="seg${on ? '' : ' off'}${now ? ' now' : ''}" data-d="${d}" ${on ? `fill="${col[k]}"` : ''}`;
  return k === 0 ? `<rect ${attrs} x="0" y="0" width="240" height="120"/>` : `<rect ${attrs} x="0" y="${bandsY[k - 1][0]}" width="240" height="${bandsY[k - 1][1]}"/>`; }).join('');
 return `<svg class="wsun" viewBox="0 0 240 240" aria-label="${tr('أسبوعك', 'Your week')}"><defs><clipPath id="wcl"><circle cx="120" cy="120" r="118"/></clipPath></defs><g clip-path="url(#wcl)">${segs}</g></svg>`;
}
function odo(n) { const s = String(n); return `<span class="n" data-v="${s}">${[...s].map(() => `<span style="transform:translateY(0)"><i>0</i>${'123456789'.split('').map(x => `<i>${x}</i>`).join('')}</span>`).join('')}</span>`; }
function runOdo(root) { $$('.n[data-v]', root).forEach(el => { const s = el.dataset.v; [...el.children].forEach((sp, k) => { const d = +s[k]; requestAnimationFrame(() => { sp.style.transform = `translateY(${-d}em)`; }); }); }); }
function conceptSide(c) {
 if (c.formula) return `<div class="formula">${c.formula}</div><svg class="curve" viewBox="0 0 220 110"><path d="M8 6 C 22 70, 50 92, 212 100" fill="none" stroke="#F2551A" stroke-width="4" stroke-linecap="round"/><path d="M8 102 H212" stroke="currentColor" stroke-opacity=".25" stroke-width="1.5"/></svg>`;
 return `<div class="cglyph"><span class="b">${esc(c.en)}</span>${miniSky(c.id)}</div>`;
}
function miniSky(seed) {
 let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0; const r = () => ((h = (h * 1103515245 + 12345) >>> 0) / 4294967296);
 const pts = Array.from({ length: 6 }, () => [20 + r() * 180, 14 + r() * 70]);
 return `<svg viewBox="0 0 220 100" class="mini"><path d="M${pts.map(p => p.map(v => v.toFixed(1)).join(' ')).join(' L')}" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="1.2"/>${pts.map((p, k) => k === 0 ? `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="url(#stripes-v)"/>` : `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="currentColor"/>`).join('')}</svg>`;
}
function renderForYou() {
 const a = todayArticle(); const c = todayConcept(a); const tops = topStories(8);
 const wk = weekDates(); const doneToday = ST.days.includes(TODAY);
 const tasks = (a && ST.read.includes(a.id) ? 1 : 0) + (c && ST.known.includes(c.id) ? 1 : 0) + (doneToday ? 1 : 0);
 const workday = DOW <= 4;
 const rounds = ROUNDS.filter(d => d.date <= TODAY).slice(0, 8); const rmx = Math.max(...rounds.map(d => d.amount || 1), 2);
 const dl = EN() ? 'SMTWT' : 'حنثرخ';
 return `<section class="hero" id="hero"><span class="light"></span><div class="wrap in">
  <div>
   <div class="hi">${tr('صباح الخير', 'Good morning')} · ${esc(fmtDay(TODAY))}</div>
   <h1>${tr('جولة اليوم', "Today's round")}</h1>
   <div class="week">${wsunSVG()}<div class="wdays"><b>${tr('أسبوعك', 'Your week')}</b><span><span class="b">${wk.filter(d => ST.days.includes(d)).length}</span> ${tr('من 5 أيام', 'of 5 workdays')}</span><span class="dl">${wk.map((d, k) => `<i class="${ST.days.includes(d) ? 'on' : ''}${d === TODAY ? ' now' : ''}">${dl[k]}</i>`).join('')}</span></div></div>
   <div class="stats"><div class="stat">${odo(streak())}<div class="l">${ic('streak')} ${tr('أيام متتالية', 'day streak')}</div></div><div class="stat">${odo(ST.read.length)}<div class="l">${tr('مقالة قرأتها', 'articles read')}</div></div><div class="stat">${odo(ST.known.length)}<div class="l">${tr('مفهوم أخذته', 'concepts learned')}</div></div></div>
  </div>
  <div class="brandcol">${stack('h-')}<div class="slogan">Every page compounds</div></div>
 </div><div class="wrap"><div class="today"><span>${tr('قراءة اليوم', "Today's reading")}</span><span class="tr"><i style="--p:${Math.round(tasks / 3 * 100)}%"></i></span><span class="b">${tasks}/3</span></div></div></section>
 <main class="wrap">
  ${a ? `<section class="sec rv"><div class="sh"><span class="mark"></span><h2>${tr('مقالة اليوم', 'Article of the day')}</h2><span class="aside">${ic('clock')} <span class="b">${a.mins}</span> ${tr('دقيقة', 'min')}</span></div>
   <article class="acard rv" id="acard"><div class="txt">
    <div class="meta"><span class="tag t-${a.topic}">${esc(topic(a.topic))}</span><span>${esc(a.pub)} · ${esc(a.date)}</span></div>
    <h3>${esc(EN() ? a.en : a.ar)}</h3><div class="en">${esc(EN() ? a.ar : a.en)}</div><div class="hzn"></div>
    <div class="by"><b>${esc(tx(a, 'author'))}</b></div><p>${esc(tx(a, 'about'))}</p>
    <div class="why"><b>${tr('ليش تستاهل', 'Why it matters')}</b><span>${esc(tx(a, 'why'))}</span></div>
    <div class="acts"><a class="btn" href="#/a/${a.id}">${ST.read.includes(a.id) ? tr('اقرأها مرة ثانية', 'Read it again') : tr('اقرأ المقالة', 'Read the article')}</a><button class="iconbtn save" data-save="${a.id}" aria-pressed="${ST.saved.includes(a.id)}" aria-label="${tr('حفظ', 'Save')}">${ic('save')}</button><button class="ghost" id="swap">${ic('swap')} ${tr('بدّلها', 'Swap')}</button></div>
   </div><div class="vis"><span class="mins">${ic('clock')}<span class="b">${a.mins}</span> ${tr('دقيقة', 'min')}</span>${visOf(a)}${bands()}</div></article>
  </section>` : ''}
  ${c ? `<section class="sec rv"><div class="sh"><span class="mark"></span><h2>${tr('مفهوم اليوم', 'Concept of the day')}</h2><span class="aside">${a && (a.concepts || []).includes(c.id) ? tr('من مقالة اليوم', "From today's article") : ''}</span></div>
   <div class="ccard rv" id="ccard"><div><span class="tag cn">${ic('learn')} ${esc(tx(c, 'stage'))}</span><h3>${esc(EN() ? c.en : c.ar)}<small>${esc(EN() ? c.ar : c.en)}</small></h3><p>${tx(c, 'defn')}</p>${tx(c, 'example') ? `<div class="ex">${esc(tx(c, 'example'))}</div>` : ''}
    <div class="acts"><a class="btn2" href="#/c/${c.id}">${tr('افتح المفهوم', 'Open the concept')}</a><button class="btn2 knowb${ST.known.includes(c.id) ? ' done' : ''}" data-know="${c.id}"><svg class="ic" viewBox="0 0 24 24" style="width:18px;height:18px">${P.check}</svg><span>${ST.known.includes(c.id) ? tr('أخذته', 'Learned') : tr('أعرفه', 'I know it')}</span></button></div></div>
    <div class="side">${conceptSide(c)}</div></div></section>` : ''}
  ${tops.length ? `<section class="sec"><div class="sh"><span class="mark"></span><h2>${tr('أهم ما صار', 'What mattered')}</h2><span class="aside"><a href="#/news" class="more-l">${tr('كل الأخبار', 'All news')} ${ic(EN() ? 'back' : 'fwd')}</a></span></div>
   <div class="tops">${tops.map(storyCard).join('')}</div></section>` : ''}
  ${rounds.length ? `<section class="sec"><div class="sh"><span class="mark"></span><h2>${tr('آخر الجولات', 'Latest rounds')}</h2><span class="aside"><a href="#/dashboard?s=rounds" class="more-l">${tr('الجدول الكامل', 'Full table')} ${ic(EN() ? 'back' : 'fwd')}</a></span></div>
   <div class="dhead"><span></span><span>${tr('الشركة', 'Company')}</span><span>${tr('المبلغ', 'Amount')}</span><span>${tr('القائد', 'Lead')}</span><span>${tr('السوق', 'Market')}</span></div>
   <div class="deals" id="tdeals">${rounds.map((d, k) => dealRow(d, k, rmx)).join('')}</div></section>` : ''}
  <div class="finish"><button class="big${doneToday ? ' done' : ''}" id="done"><span class="fill"></span><svg class="ic" viewBox="0 0 24 24">${P.check}</svg><span>${workday ? tr('خلصت قراءة اليوم', 'Done for today') : tr('خلصت القراءة', 'Done reading')}</span></button>
   <div class="more"><a href="#/news">${ic('news')} ${tr('الأخبار', 'News')}</a><a href="#/articles">${ic('article')} ${tr('المقالات', 'Articles')}</a><a href="#/concepts">${ic('learn')} ${tr('المفاهيم', 'Concepts')}</a><a href="#/dashboard">${ic('dashboard')} ${tr('الداشبورد', 'Dashboard')}</a><a href="#/saved">${ic('bookmark')} ${tr('محفوظاتك', 'Saved')}</a></div></div>
 </main>`;
}
function bindForYou() {
 runOdo($('#hero'));
 const hero = $('#hero'); hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); const l = hero.querySelector('.light'); l.style.setProperty('--mx', (e.clientX - r.left) + 'px'); l.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
 const sw = $('#swap'); if (sw) sw.onclick = openSwap;
 const dn = $('#done'); dn.onclick = () => { if (!ST.days.includes(TODAY)) { ST.days.push(TODAY); save(); } dn.classList.add('done'); burst(dn); const s = $(`.wsun .seg[data-d="${TODAY}"]`); if (s) { const k = weekDates().indexOf(TODAY); s.classList.remove('off', 'now'); s.setAttribute('fill', ['#3EA6F2', '#FFD45C', '#FFA235', '#FF7A24', '#F2551A'][k]); } refreshStats(); setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 700); setTimeout(() => route(true), 2000); };
 bindRowCards();
}
function refreshStats() { const st = $('.stats'); if (!st) return; const v = [streak(), ST.read.length, ST.known.length]; $$('.stat', st).forEach((el, k) => { const n = el.querySelector('.n'); n.outerHTML = odo(v[k]); }); runOdo(st); }
/* sunrise burst: little stripe-coloured rays from a button */
function burst(el) {
 const r = el.getBoundingClientRect(); const b = document.createElement('div'); b.className = 'burst'; b.style.left = (r.left + r.width / 2) + 'px'; b.style.top = (r.top + r.height / 2) + 'px';
 const cols = ['#3EA6F2', '#FFD45C', '#FFA235', '#FF7A24', '#F2551A'];
 b.innerHTML = Array.from({ length: 18 }, (_, k) => `<i style="--a:${k * 20}deg;--c:${cols[k % 5]};--d:${60 + (k % 3) * 26}px"></i>`).join('');
 document.body.appendChild(b); setTimeout(() => b.remove(), 1200);
}
function openSwap() {
 const cur = todayArticle(); const alts = ARTS().filter(a => a.id !== cur.id);
 const pick = []; ['vc', 'pe', 'ma', 'mk', 'ec'].forEach(c => { const x = alts.find(a => a.topic === c && !ST.read.includes(a.id) && !pick.includes(a)); if (x && pick.length < 3) pick.push(x); }); alts.forEach(a => { if (pick.length < 3 && !pick.includes(a)) pick.push(a); });
 const el = document.createElement('div'); el.className = 'sheet';
 el.innerHTML = `<div class="pane"><div class="grab"></div><h4>${tr('بدّل مقالة اليوم', "Swap today's article")}</h4>${pick.length ? pick.map(a => `<button class="alt" data-id="${a.id}"><span class="th">${a.img ? `<img src="img/${a.img}.jpg" alt="">` : esc(a.pub.slice(0, 7).toUpperCase())}</span><span><span class="tag t-${a.topic}">${esc(topic(a.topic))}</span><b>${esc(EN() ? a.en : a.ar)}</b><small>${esc(tx(a, 'author'))} · ${a.mins} ${tr('دقيقة', 'min')}${ST.read.includes(a.id) ? ' · ' + tr('قرأتها', 'read') : ''}</small></span></button>`).join('') : `<div class="empty">${tr('مقالات جديدة كاملة بالعربية تُضاف تباعًا، وتظهر هنا للتبديل.', 'New full articles are being added and will appear here.')}</div>`}<a class="alt more" href="#/articles">${ic('article')} ${tr('تصفّح المكتبة كاملة', 'Browse the whole library')}</a></div>`;
 document.body.appendChild(el);
 el.onclick = e => { const b = e.target.closest('.alt[data-id]'); if (b) { ST.pick[TODAY] = b.dataset.id; save(); el.remove(); route(true); return; } if (e.target === el || e.target.closest('a.alt')) el.remove(); };
}

/* ---------- ARTICLE ---------- */
const TABS = { sum: ['الملخص', 'Summary'], ar: ['العربية', 'Arabic'], orig: ['الأصل', 'Original'] };
function tgURL(u) { try { const x = new URL(u); const h = x.hostname.replace(/-/g, '--').replace(/\./g, '-'); const q = new URLSearchParams(x.search); q.set('_x_tr_sl', 'auto'); q.set('_x_tr_tl', 'ar'); q.set('_x_tr_hl', 'ar'); q.set('_x_tr_pto', 'wapp'); return `https://${h}.translate.goog${x.pathname}?${q.toString()}${x.hash}`; } catch (e) { return u; } }
function summaryHTML(a) {
 const S = a.summary && (a.summary[LANG] || a.summary.ar); if (!S) return `<div class="empty">${tr('الملخص قيد الإعداد.', 'Summary coming soon.')}</div>`;
 const num = (s) => esc(s).replace(/(\d[\d.,–\-x%]*)/g, '<span class="b">$1</span>');
 const pt = (p, k) => `<li style="--i:${k}"><span class="dot"><i></i></span><div><b>${esc(p[0])}</b><p>${esc(p[1]).replace(/(p\(x\) = Cx\^−α|1\/\(gi\) \+ 1)/g, '<bdi dir="ltr" class="b">$1</bdi>').replace('Cx^−α', 'Cx<sup>−α</sup>')}</p></div></li>`;
 const chunks = []; for (let i = 0; i < S.points.length; i += 3) chunks.push(S.points.slice(i, i + 3));
 const cards = [
  `<div class="scard core"><span class="k">${ic('bolt')} ${tr('الفكرة الأساسية', 'The core idea')}</span><p class="lead2">${esc(S.core)}</p><span class="swipe">${tr('اسحب للنقاط', 'Swipe for the points')} ${ic(EN() ? 'back' : 'fwd')}</span></div>`,
  `<div class="scard pts desk"><span class="k">${ic('filter')} ${tr('كل النقاط بترتيب المقالة', 'Every point, in the order of the article')}</span><ol class="tl">${S.points.map(pt).join('')}</ol></div>`,
  ...chunks.map((ch, j) => `<div class="scard pts mob"><span class="k">${ic('filter')} ${tr('النقاط', 'Points')} <span class="b">${j * 3 + 1}–${j * 3 + ch.length}</span> / <span class="b">${S.points.length}</span></span><ol class="tl" start="${j * 3 + 1}">${ch.map((p, k) => pt(p, j * 3 + k)).join('')}</ol></div>`),
  `<div class="scard nums"><span class="k">${ic('dashboard')} ${tr('أرقام مهمة', 'Key numbers')}</span><div class="numg">${S.numbers.map((n, k) => `<div class="nm" style="--i:${k}"><b class="b">${esc(n[0])}</b><span>${esc(n[1])}</span></div>`).join('')}</div></div>`,
  `<div class="scard must"><span class="k">${ic('star')} ${tr('لازم تفهم', 'What you must understand')}</span><p>${esc(S.must)}</p></div>`
 ];
 const quiz = (a.quiz || []).length ? `<details class="quiz"><summary>${ic('learn')} ${tr('تحقق من فهمك', 'Check yourself')} <small>${tr('اختياري · 3 أسئلة', 'optional · 3 questions')}</small></summary>${a.quiz.map((q, k) => `<div class="qq" data-a="${q.a}"><b><span class="b">${k + 1}</span>. ${esc(q.q[LANG] || q.q.ar)}</b><div class="qo">${(q.o[LANG] || q.o.ar).map((o, j) => `<button data-j="${j}">${esc(o)}</button>`).join('')}</div><p class="qw" hidden>${esc(q.why[LANG] || q.why.ar)}</p></div>`).join('')}</details>` : '';
 return `<div class="sdeck" id="sdeck">${cards.join('')}</div><div class="sdots" id="sdots"></div>${quiz}`;
}
async function renderArticle(id, q) {
 const a = lib(id); if (!a) return notFound();
 let body = '';
 if (a.arabic) { try { body = await fetch(`app/articles/${a.id}.html${VER ? '?v=' + VER : ''}`).then(r => r.text()); } catch (e) {} }
 const order = EN() ? ['sum', 'orig', 'ar'] : ['sum', 'ar', 'orig'];
 const tab = q.get('t') && order.includes(q.get('t')) ? q.get('t') : (a.summary ? 'sum' : a.arabic ? 'ar' : 'orig');
 const read = ST.read.includes(a.id);
 const doneBtn = `<div class="finish"><button class="big readdone${read ? ' done' : ''}"><span class="fill"></span><svg class="ic" viewBox="0 0 24 24">${P.check}</svg><span>${tr('خلصتها', 'Finished')}</span></button></div>`;
 return `<main class="wrap"><article class="ahead">${backLink('#/', tr('لك', 'For You'))}
  <div class="meta" style="margin-top:18px"><span class="tag t-${a.topic}">${esc(topic(a.topic))}</span><span>${ic('clock')}</span><span><span class="b">${a.mins}</span> ${tr('دقيقة', 'min')}</span><span>·</span><span>${esc(a.date)}</span></div>
  <h1>${esc(EN() ? a.en : a.ar)}</h1><div class="en">${esc(EN() ? a.ar : a.en)}</div>
  <div class="by"><b>${esc(tx(a, 'author'))}</b> · ${esc(a.pub)} · <a href="${esc(a.url)}" target="_blank" rel="noopener">${tr('المصدر', 'Source')} ${ic('ext')}</a></div>
  <div class="atools"><div class="seg" id="atabs"><span class="pill"></span>${order.map(k => `<button data-t="${k}" aria-pressed="${tab === k}">${TABS[k][EN() ? 1 : 0]}</button>`).join('')}</div><button class="iconbtn save" data-save="${a.id}" aria-pressed="${ST.saved.includes(a.id)}" aria-label="${tr('حفظ', 'Save')}" style="background:var(--paper-2)">${ic('save')}</button></div>
 </article>
 <section id="v-sum" class="sum" ${tab === 'sum' ? '' : 'hidden'}>${summaryHTML(a)}${doneBtn}</section>
 <section id="v-ar" ${tab === 'ar' ? '' : 'hidden'} lang="ar" dir="rtl">${a.arabic ? `<div class="hlhint">${ic('pen')} ${tr('ظلّل أي جملة لتحفظها', 'Select any sentence to save it')}</div><div class="prose" id="prose">${body}</div>
  <div class="ours">
   ${a.market ? `<div class="box dark"><h4>ماذا يعني هذا لسوقنا</h4>${a.market.map(p => `<p>${esc(p)}</p>`).join('')}<div class="src">المصادر: ${a.marketSrc.map(s => `<a href="${esc(s[1])}" target="_blank" rel="noopener">${esc(s[0])}</a>`).join(' · ')}</div></div>` : ''}
   ${a.concepts ? `<div class="box soft"><h4>المفاهيم في هذه المقالة</h4><div class="cl">${a.concepts.map(cid => { const c = con(cid); return c ? `<a href="#/c/${c.id}">${ic('learn')} ${esc(c.ar)}</a>` : ''; }).join('')}</div></div>` : ''}
   ${a.who ? `<div class="box soft"><h4>من كتبه</h4><p>${esc(a.who)}</p><div class="src">المصدر: <a href="${esc(a.whoSrc[1])}" target="_blank" rel="noopener">${esc(a.whoSrc[0])}</a></div></div>` : ''}
   ${a.match ? `<div class="box soft"><h4>مطابقة مع الأصل</h4><ul>${a.match.map(m => `<li>${esc(m)}</li>`).join('')}</ul></div>` : ''}
  </div>${doneBtn}` : `<div class="empty">النسخة العربية الكاملة لهذه المقالة قيد الإعداد.</div>`}</section>
 <section id="v-orig" class="origwrap" ${tab === 'orig' ? '' : 'hidden'}>${a.embed === false ? `<div class="empty">${tr('موقع الكاتب لا يسمح بعرض المقالة داخل موقعنا.', "The author's site doesn't allow the article to be shown inside ours.")} <a href="${esc(a.url)}" target="_blank" rel="noopener">${tr('افتح الأصل', 'Open the original')}</a></div>` : `<div class="obar">${EN() ? '' : `<div class="seg sm" id="otabs"><span class="pill"></span><button data-o="o" aria-pressed="true">${tr('النص الأصلي', 'Original')}</button><button data-o="t" aria-pressed="false">${ic('translate')} ${tr('مترجم آليًا', 'Machine-translated')}</button></div>`}<a class="olink" id="olink" href="${esc(a.url)}" target="_blank" rel="noopener">${ic('ext')} ${tr('افتح في صفحة جديدة', 'Open in a new tab')}</a></div><div class="note" id="onote">${ic('source')} ${tr('النص الأصلي كما نشره الكاتب، معروض من موقعه داخل صفحتنا.', 'The original as the author published it, shown from their site inside ours.')}</div><iframe data-src="${esc(a.url)}" data-tg="${esc(tgURL(a.url))}" title="${esc(a.en)}" loading="lazy" referrerpolicy="no-referrer"></iframe>`}</section>
 </main>`;
}
function placePill(seg) { const pill = $('.pill', seg), on = $('[aria-pressed="true"]', seg); if (!pill || !on) return; const r = on.getBoundingClientRect(), p = seg.getBoundingClientRect(); pill.style.left = '0px'; pill.style.width = r.width + 'px'; pill.style.transform = `translateX(${r.left - p.left}px)`; }
function bindArticle(id) {
 const a = lib(id); const tabs = $('#atabs');
 requestAnimationFrame(() => placePill(tabs));
 const show = t => { $$('button', tabs).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.t === t))); placePill(tabs); ['sum', 'ar', 'orig'].forEach(k => { $('#v-' + k).hidden = k !== t; }); const f = $('#v-orig iframe'); if (t === 'orig' && f && !f.src) f.src = f.dataset.src; if (t === 'sum') dots(); history.replaceState(null, '', `#/a/${id}${t === 'sum' ? '' : '?t=' + t}`); const h = $('.ahead'); if (window.scrollY > h.offsetTop + h.offsetHeight) window.scrollTo({ top: h.offsetTop + h.offsetHeight - 120, behavior: 'smooth' }); };
 $$('button', tabs).forEach(b => b.onclick = () => show(b.dataset.t));
 if (!$('#v-orig').hidden) { const f = $('#v-orig iframe'); if (f) f.src = f.dataset.src; }
 const ot = $('#otabs'); if (ot) { requestAnimationFrame(() => placePill(ot)); $$('button', ot).forEach(b => b.onclick = () => { $$('button', ot).forEach(x => x.setAttribute('aria-pressed', String(x === b))); placePill(ot); const f = $('#v-orig iframe'); const tgm = b.dataset.o === 't'; f.src = tgm ? f.dataset.tg : f.dataset.src; $('#olink').href = tgm ? f.dataset.tg : f.dataset.src; $('#onote').innerHTML = tgm ? `${ic('translate')} ترجمة آلية من Google للصفحة الأصلية كما هي، قد تحتوي أخطاء. النسخة العربية المحررة في تبويب «العربية».` : `${ic('source')} النص الأصلي كما نشره الكاتب، معروض من موقعه داخل صفحتنا.`; }); }
 /* summary deck dots (mobile swipe) */
 const deck = $('#sdeck'), dd = $('#sdots');
 function dots() { if (!deck || !dd) return; const cs = $$('.scard', deck).filter(c => getComputedStyle(c).display !== 'none'); dd.innerHTML = cs.map(() => '<i></i>').join(''); const upd = () => { const w = deck.getBoundingClientRect(); let k = 0, best = 1e9; cs.forEach((c, j) => { const r = c.getBoundingClientRect(); const d = Math.abs((r.left + r.width / 2) - (w.left + w.width / 2)); if (d < best) { best = d; k = j; } }); $$('i', dd).forEach((x, j) => x.classList.toggle('on', j === k)); }; deck.onscroll = upd; upd(); }
 dots();
 $$('.qq').forEach(qq => $$('button', qq).forEach(b => b.onclick = () => { if (qq.classList.contains('done')) return; qq.classList.add('done'); const ok = +b.dataset.j === +qq.dataset.a; b.classList.add(ok ? 'ok' : 'no'); $$('button', qq)[+qq.dataset.a].classList.add('ok'); $('.qw', qq).hidden = false; }));
 const pr = $('#prose');
 if (pr) {
  /* footnotes become tap-to-show popovers; the long list at the bottom goes */
  const notes = {}; $$('.foot li[id]', pr).forEach(li => { const c = li.cloneNode(true); $$('.up', c).forEach(x => x.remove()); notes[li.id] = c.innerHTML.trim(); }); const ft = $('.foot', pr); if (ft) ft.remove();
  $$('.term', pr).forEach(t => { const cc = CON.find(c => (c.en || '').toLowerCase() === (t.dataset.en || '').toLowerCase()); if (cc) { t.className = 'cterm'; t.dataset.c = cc.id; } else t.onclick = () => t.classList.toggle('on'); });
  pr.addEventListener('click', e => {
   const f = e.target.closest('sup.fn a'); if (f) { e.preventDefault(); const k = f.getAttribute('href').slice(1); pop(f, `<span class="tag fnt">${tr('هامش', 'Note')} <span class="b">${esc(f.textContent)}</span></span><p class="fnp">${notes[k] || tr('هذا الهامش فارغ في الأصل.', 'This note is empty in the original.')}</p>`); return; }
   const t = e.target.closest('.cterm'); if (t) { const c = con(t.dataset.c); if (c) pop(t, `<span class="tag cn">${tr('مفهوم', 'Concept')}</span><div style="margin-top:8px"><b>${esc(c.ar)}</b> <span class="b" style="color:var(--ink-2)">${esc(c.en)}</span></div><p>${c.defn}</p><a href="#/c/${c.id}">${tr('افتح المفهوم', 'Open the concept')} ←</a>`); }
  });
  applyHL(pr, id); bindHL(pr, id);
 }
 $$('.readdone').forEach(rd => rd.onclick = () => { if (!ST.read.includes(id)) { ST.read.push(id); save(); } $$('.readdone').forEach(x => x.classList.add('done')); burst(rd); });
 const rs = document.createElement('div'); rs.className = 'rsun'; rs.innerHTML = '<i></i>'; rs.id = 'rsun'; document.body.appendChild(rs);
}
function pop(t, html) {
 $$('.pop').forEach(p => p.remove());
 const p = document.createElement('div'); p.className = 'pop'; p.innerHTML = `<button class="px" aria-label="close">${ic('close')}</button>${html}`;
 document.body.appendChild(p); const r = t.getBoundingClientRect();
 const below = r.bottom + p.offsetHeight + 20 < window.innerHeight;
 p.style.top = (window.scrollY + (below ? r.bottom + 10 : r.top - p.offsetHeight - 10)) + 'px'; p.style.left = Math.max(12, Math.min(window.innerWidth - p.offsetWidth - 12, r.left + r.width / 2 - p.offsetWidth / 2)) + 'px';
 $('.px', p).onclick = () => p.remove();
 setTimeout(() => document.addEventListener('click', function f(e) { if (!p.contains(e.target) && e.target !== t && !t.contains(e.target)) { p.remove(); document.removeEventListener('click', f); } }), 0);
}
/* highlights */
function wrapText(root, text) {
 const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
 while ((n = w.nextNode())) { const i = n.data.indexOf(text); if (i >= 0 && !n.parentNode.closest('mark.hl')) { const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + text.length); const m = document.createElement('mark'); m.className = 'hl'; r.surroundContents(m); return m; } }
 return null;
}
function applyHL(pr, id) { ST.hl.filter(h => h.a === id).forEach(h => wrapText(pr, h.t)); }
function bindHL(pr, id) {
 let btn = null;
 const clear = () => { if (btn) { btn.remove(); btn = null; } };
 const check = () => setTimeout(() => {
  const s = window.getSelection(); if (!s || s.isCollapsed) return clear();
  const text = s.toString().trim(); if (text.length < 6 || text.length > 700 || !pr.contains(s.anchorNode)) return clear();
  const r = s.getRangeAt(0).getBoundingClientRect(); clear();
  btn = document.createElement('button'); btn.className = 'hlbtn'; btn.innerHTML = `${ic('pen')} ${tr('احفظ الجملة', 'Save sentence')}`;
  btn.style.top = (window.scrollY + r.top - 50) + 'px'; btn.style.left = Math.max(10, Math.min(window.innerWidth - 170, r.left + r.width / 2 - 80)) + 'px';
  btn.onmousedown = e => e.preventDefault();
  btn.onclick = () => { const rg = s.getRangeAt(0); try { const m = document.createElement('mark'); m.className = 'hl new'; rg.surroundContents(m); } catch (e) { /* spans several elements: kept in saved list */ }
   ST.hl.push({ a: id, t: text, d: TODAY }); save(); s.removeAllRanges(); clear(); toast(tr('حُفظت في محفوظاتك', 'Saved to your list')); };
  document.body.appendChild(btn);
 }, 10);
 pr.addEventListener('mouseup', check); pr.addEventListener('touchend', check); document.addEventListener('selectionchange', () => { const s = window.getSelection(); if (btn && (!s || s.isCollapsed)) setTimeout(() => { const s2 = window.getSelection(); if (!s2 || s2.isCollapsed) clear(); }, 200); });
 pr.addEventListener('click', e => { const m = e.target.closest('mark.hl'); if (!m) return; pop(m, `<span class="tag fnt">${tr('جملة محفوظة', 'Saved sentence')}</span><p>${esc(m.textContent)}</p><button class="btn2" id="unhl">${tr('احذفها', 'Remove')}</button>`); $('#unhl').onclick = () => { ST.hl = ST.hl.filter(h => !(h.a === id && h.t === m.textContent)); save(); m.replaceWith(...m.childNodes); $$('.pop').forEach(p => p.remove()); }; });
}
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `<span class="sunlet"></span>${esc(msg)}`; document.body.appendChild(t); setTimeout(() => t.classList.add('out'), 1800); setTimeout(() => t.remove(), 2400); }

/* ---------- LIBRARY ---------- */
const LEN = { s: [0, 10, ['حتى 10 دقائق', 'Up to 10 min']], m: [11, 20, ['10 إلى 20', '10–20 min']], l: [21, 999, ['أطول من 20', 'Over 20 min']] };
function renderLibrary(q) {
 const ft = q.get('topic') || '', fs = q.get('src') || '', fl = q.get('len') || '';
 const all = ARTS();
 const list = all.filter(a => (!ft || a.topic === ft) && (!fs || a.pub === fs) && (!fl || (a.mins >= LEN[fl][0] && a.mins <= LEN[fl][1])));
 const pubs = [...new Set(all.map(a => a.pub))];
 const topics = Object.keys(TOPIC).filter(k => all.some(a => a.topic === k));
 const link = (k, v) => { const p = new URLSearchParams({ topic: ft, src: fs, len: fl }); if (p.get(k) === v) p.delete(k); else p.set(k, v); [...p.keys()].forEach(x => { if (!p.get(x)) p.delete(x); }); const s = p.toString(); return '#/articles' + (s ? '?' + s : ''); };
 const chip = (k, v, label) => `<a class="chipb" href="${link(k, v)}" aria-pressed="${({ topic: ft, src: fs, len: fl })[k] === v}">${label}</a>`;
 const open = ft || fs || fl;
 return `<main class="wrap">${head(tr('المقالات', 'Articles'), tr('مكتبة مفتوحة ومتنوعة: الاستثمار الجريء والملكية الخاصة والائتمان والاستحواذات والأسواق والاقتصاد. كل مقالة هنا كاملة بالعربية، ومعها الأصل والملخص.', 'An open, varied library: venture, private equity and credit, M&A, markets and economics. Every article here is complete in Arabic, with the original and a summary.'))}
  <details class="filters" ${open ? 'open' : ''}><summary>${ic('filter')} ${tr('تصفية', 'Filter')} ${open ? `<a class="clr" href="#/articles">${tr('مسح', 'Clear')}</a>` : ''}</summary>
   <div class="frow"><span>${tr('الموضوع', 'Topic')}</span><div class="chips">${topics.map(k => chip('topic', k, esc(topic(k)))).join('')}</div></div>
   <div class="frow"><span>${tr('المصدر', 'Source')}</span><div class="chips">${pubs.map(p => chip('src', p, esc(p))).join('')}</div></div>
   <div class="frow"><span>${tr('الطول', 'Length')}</span><div class="chips">${Object.keys(LEN).map(k => chip('len', k, LEN[k][2][EN() ? 1 : 0])).join('')}</div></div></details>
  <div class="lgrid">${list.map((a, k) => `<a class="lcard rv" href="#/a/${a.id}" style="transition-delay:${k * .05}s"><div class="vis">${a.chart && window.TMR_CHARTS ? `<div style="position:absolute;inset:14px 10px 18px">${TMR_CHARTS[a.chart]}</div>` : a.img ? `<img src="img/${a.img}.jpg" alt="" loading="lazy">` : `<div class="typo"><b>${esc(a.pub.toUpperCase())}</b><em>${esc(a.en)}</em></div>`}${bands()}</div><div class="bd"><div class="meta"><span class="tag t-${a.topic}">${esc(topic(a.topic))}</span><span><span class="b">${a.mins}</span> ${tr('دقيقة', 'min')}</span></div><h3>${esc(EN() ? a.en : a.ar)}</h3><p>${esc(tx(a, 'author'))} · ${esc(a.pub)}</p><div class="ft">${ST.read.includes(a.id) ? `<span class="ar-ok">${ic('check')} ${tr('قرأتها', 'Read')}</span>` : `<span>${tr('ملخص · العربية · الأصل', 'Summary · Arabic · Original')}</span>`}</div></div></a>`).join('')}
  ${list.length ? '' : `<div class="empty">${tr('لا توجد مقالات بهذه التصفية.', 'No articles match.')}</div>`}</div>
  <div class="coming rv">${ic('clock')} <span>${tr('مقالات جديدة كاملة تُضاف كل أسبوع بعد ترجمتها كاملة ومراجعتها.', 'New articles are added every week once they are fully written in Arabic and checked.')}</span></div></main>`;
}

/* ---------- CONCEPTS ---------- */
const CGROUP = { vc: ['أساسيات الاستثمار الجريء', 'Venture basics'], funds: ['الصناديق والمستثمرون فيها', 'Funds & LPs'], deal: ['هيكلة الصفقات', 'Deal terms'], val: ['التقييم', 'Valuation'], pe: ['الملكية الخاصة والائتمان', 'PE & credit'], mk: ['الأسواق والاقتصاد', 'Markets & economics'] };
function skySVG(W, H, small) {
 const groups = Object.keys(CGROUP).filter(g => CON.some(c => (c.group || 'vc') === g));
 const pos = {}; const gx = {};
 groups.forEach((g, gi) => { const cx = W * (gi + .5) / groups.length; gx[g] = cx; const list = CON.filter(c => (c.group || 'vc') === g);
  list.forEach((c, k) => { const ang = k * 2.39996; const rad = 26 * Math.sqrt(k + .6) * (small ? .8 : 1); pos[c.id] = [cx + Math.cos(ang) * rad * 1.25, H * .44 + Math.sin(ang) * rad * .85]; }); });
 const links = []; CON.forEach((c, i) => CON.slice(i + 1).forEach(d => { const shared = (c.articles || []).some(x => (d.articles || []).includes(x)) || (c.related || []).includes(d.id) || (d.related || []).includes(c.id); if (shared) links.push([c.id, d.id]); }));
 let h = 7; const rnd = () => ((h = (h * 1103515245 + 12345) >>> 0) / 4294967296);
 const dust = Array.from({ length: small ? 40 : 90 }, () => `<circle cx="${(rnd() * W).toFixed(0)}" cy="${(rnd() * H * .8).toFixed(0)}" r="${(rnd() * 1.2 + .3).toFixed(1)}" class="dust" style="--d:${(rnd() * 4).toFixed(1)}s"/>`).join('');
 return `<svg class="sky" viewBox="0 0 ${W} ${H}" role="img" aria-label="${tr('خريطة المفاهيم', 'Concept map')}">
  <defs><radialGradient id="glw"><stop offset="0" stop-color="#FFA235" stop-opacity=".55"/><stop offset="1" stop-color="#FFA235" stop-opacity="0"/></radialGradient></defs>
  ${dust}
  ${links.map(([x, y]) => `<line class="lk${ST.known.includes(x) && ST.known.includes(y) ? ' on' : ''}" x1="${pos[x][0].toFixed(1)}" y1="${pos[x][1].toFixed(1)}" x2="${pos[y][0].toFixed(1)}" y2="${pos[y][1].toFixed(1)}"/>`).join('')}
  <line class="hz" x1="0" x2="${W}" y1="${H * .86}" y2="${H * .86}"/>
  ${groups.map(g => `<text class="gl" x="${gx[g]}" y="${H * .86 + 22}" text-anchor="middle">${esc(CGROUP[g][EN() ? 1 : 0])}</text>`).join('')}
  ${CON.map((c, k) => { const [x, y] = pos[c.id]; const on = ST.known.includes(c.id); return `<a href="#/c/${c.id}" class="st${on ? ' on' : ''}" style="--i:${k}"><g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${on ? `<circle r="26" fill="url(#glw)"/><circle r="10" fill="url(#stripes-v)"/>` : `<circle r="12" class="halo"/><path class="star4" d="M0-7 1.6-1.6 7 0 1.6 1.6 0 7-1.6 1.6-7 0-1.6-1.6z"/>`}<text y="${on ? 28 : 24}" text-anchor="middle">${esc(EN() ? c.en : c.ar)}</text></g></a>`; }).join('')}
 </svg>`;
}
function renderConcepts() {
 const n = CON.length, k = CON.filter(c => ST.known.includes(c.id)).length;
 return `<main class="wrap">${head(tr('المفاهيم', 'Concepts'), tr('سماء مفاهيمك: كل نجمة مفهوم، وتضيء حين تأخذه. تعريف دقيق بمرجعه، وكيف يشتغل، ومثال حقيقي، وما يختلط معه.', 'Your sky of concepts: each star is a concept and it lights up once you learn it. A precise definition with its reference, how it works, a real example, and what it gets confused with.'))}
  <section class="skywrap rv"><div class="skyhead"><b dir="ltr"><span class="b">${k}</span> / <span class="b">${n}</span></b><span>${tr('مفهوم أضأته', 'concepts lit')}</span></div>${skySVG(1100, 420)}</section>
  ${Object.keys(CGROUP).filter(g => CON.some(c => (c.group || 'vc') === g)).map(g => `<h2 class="cgh">${esc(CGROUP[g][EN() ? 1 : 0])}</h2><div class="cgrid">${CON.filter(c => (c.group || 'vc') === g).map(c => `<a class="cbox rv${ST.known.includes(c.id) ? ' on' : ''}" href="#/c/${c.id}"><span class="cst">${ST.known.includes(c.id) ? '<i class="sunlet"></i>' : ic('star')}</span><b>${esc(EN() ? c.en : c.ar)}</b><span class="b en2">${esc(EN() ? c.ar : c.en)}</span><span>${tx(c, 'defn').replace(/<[^>]+>/g, '').slice(0, 130)}…</span></a>`).join('')}</div>`).join('')}
  <div class="coming rv">${ic('clock')} <span>${tr('تُضاف المفاهيم تباعًا بعد مراجعة كل واحد ومرجعه.', 'Concepts are added as each one and its reference are checked.')}</span></div></main>`;
}
function renderConcept(id) {
 const c = con(id); if (!c) return notFound();
 const arts = (c.articles || []).map(lib).filter(a => a && a.arabic);
 const rel = (c.related || []).map(con).filter(Boolean);
 const confuse = EN() && c.confuse_en ? c.confuse_en : c.confuse;
 return `<main class="wrap"><article class="cpage">${backLink('#/concepts', tr('المفاهيم', 'Concepts'))}
  <div class="chero"><div><span class="tag cn">${esc(tx(c, 'stage'))}</span><h1>${esc(EN() ? c.en : c.ar)}</h1><div class="en">${esc(EN() ? c.ar : c.en)}</div></div><div class="cside">${conceptSide(c)}</div></div>
  <h2>${tr('التعريف', 'Definition')}</h2><p>${tx(c, 'defn')}</p>
  <h2>${tr('كيف يشتغل', 'How it works')}</h2><p>${esc(tx(c, 'how'))}</p>
  ${tx(c, 'example') ? `<h2>${tr('مثال حقيقي', 'A real example')}</h2><div class="exbox"><p>${esc(tx(c, 'example'))}</p></div>` : ''}
  ${confuse && confuse.length ? `<h2>${tr('ما يختلط معه', 'Often confused with')}</h2><div class="cmp">${confuse.map(x => `<div><b>${esc(x[0])}</b>${esc(x[1])}</div>`).join('')}</div>` : ''}
  ${rel.length ? `<h2>${tr('مفاهيم قريبة', 'Related concepts')}</h2><div class="cl">${rel.map(r => `<a href="#/c/${r.id}">${ic('star')} ${esc(EN() ? r.en : r.ar)}</a>`).join('')}</div>` : ''}
  ${arts.length ? `<h2>${tr('مقالات تتناوله', 'Articles that cover it')}</h2><div class="cl">${arts.map(a => `<a href="#/a/${a.id}">${ic('article')} ${esc(EN() ? a.en : a.ar)}</a>`).join('')}</div>` : ''}
  <h2>${tr('المرجع', 'Reference')}</h2><div class="srcs">${c.refs.map(r => `<a href="${esc(r[1])}" target="_blank" rel="noopener">${ic('source')} ${esc(r[0])}</a>`).join('')}</div>
  <div class="finish"><button class="btn2 knowb big2${ST.known.includes(c.id) ? ' done' : ''}" data-know="${c.id}"><svg class="ic" viewBox="0 0 24 24">${P.check}</svg><span>${ST.known.includes(c.id) ? tr('أخذته', 'Learned') : tr('أعرفه', 'I know it')}</span></button></div></article></main>`;
}

/* ---------- NEWS ---------- */
function newsCard(x, k, feat) {
 const kd = kindOf(x); const isDeal = x.type === 'deal'; const img = x.image && x.image.file;
 return `<a class="ncard rv${feat ? ' feat' : ''}" href="#/n/${x.id}" style="--kc:${kindCol(kd)};transition-delay:${(k % 6) * .05}s">
  <div class="nv">${img ? `<img src="img/${esc(x.image.file)}" alt="" loading="lazy" ${x.image.fit === 'contain' ? 'class="ct"' : ''}>` : `<div class="nlogo">${isDeal ? logoBox(x.company, 'xl') : `<span class="nsun"></span>`}</div>`}${isDeal && x.amount ? `<b class="namt b">${esc(money(x.amount))}</b>` : ''}<span class="nhz"></span></div>
  <span class="band"></span>
  <div class="nb"><div class="meta"><span class="kd">${esc(kindName(kd))}</span>${x.market ? `<span>${esc(mkt(x.market))}</span>` : ''}<span>${esc(fmtShort(x.date))}</span></div><h3>${esc(itTitle(x))}</h3>${feat && itF(x, 'dek') ? `<p>${esc(itF(x, 'dek'))}</p>` : ''}<div class="sub">${esc((x.source && x.source.name) || '')}</div></div></a>`;
}
function renderNews(q) {
 const ty = q.get('t') || 'all';
 const list = ITEMS.filter(x => (x.type === 'news' || x.type === 'deal') && (ty === 'all' || kindOf(x) === ty)).sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.amount || 0) - (a.amount || 0));
 const groups = []; list.slice(0, 150).forEach(x => { const g = groups[groups.length - 1]; if (g && g.d === x.date) g.l.push(x); else groups.push({ d: x.date, l: [x] }); });
 const kinds = ['round', 'ma', 'fund', 'news'].filter(k => ITEMS.some(x => (x.type === 'news' || x.type === 'deal') && kindOf(x) === k));
 let n = 0;
 return `<main class="wrap">${head(tr('الأخبار', 'News'), tr('الأخبار والصفقات المحررة، كل خبر بمصدره المباشر.', 'Edited news and deals, each with its direct source.'))}
  <div class="chips kinds"><a class="chipb" href="#/news" aria-pressed="${ty === 'all'}">${tr('الكل', 'All')}</a>${kinds.map(k => `<a class="chipb" href="#/news?t=${k}" aria-pressed="${ty === k}" style="--kc:${kindCol(k)}"><i class="kdot"></i>${esc(kindName(k))}</a>`).join('')}</div>
  ${groups.map(g => `<section class="nday"><h2 class="dayh"><span class="sunlet"></span>${esc(fmtDay(g.d))}<small><span class="b">${g.l.length}</span></small></h2><div class="ngrid">${g.l.map(x => newsCard(x, n++, n === 1)).join('')}</div></section>`).join('')}</main>`;
}
function renderStory(id) {
 const x = ITEMS.find(i => i.id === id); if (!x) return notFound();
 const kd = kindOf(x); const isDeal = x.type === 'deal'; const img = x.image && x.image.file;
 const lead = (x.investors || []).filter(i => i.lead || i.role === 'lead').map(i => i.name);
 const facts = [];
 if (x.stage) facts.push([tr('المرحلة', 'Stage'), stg(x.stage)]);
 if (x.valuation) facts.push([tr('التقييم', 'Valuation'), x.valuation]);
 if (x.market) facts.push([tr('السوق', 'Market'), mkt(x.market)]);
 if (x.industry) facts.push([tr('القطاع', 'Sector'), ind(x.industry)]);
 if (lead.length) facts.push([tr('قاد الجولة', 'Led by'), lead.join(EN() ? ', ' : '، ')]);
 const others = (x.investors || []).filter(i => !(i.lead || i.role === 'lead')).map(i => i.name);
 const sim = ROUNDS.filter(d => d.story !== x.id && slug(d.company) !== slug(x.company) && ((x.industry && d.industry === x.industry) || (x.market && d.market === mcode(x.market)))).sort((a, b) => ((b.industry === x.industry) - (a.industry === x.industry)) || (b.date || '').localeCompare(a.date || '')).slice(0, 5);
 const smx = Math.max(...sim.map(d => d.amount || 1), 2);
 const body = itF(x, 'body') || [];
 const tile = img && x.image.fit === 'contain';
 return `<div class="shero${img && !tile ? '' : ' noimg'}" style="--kc:${kindCol(kd)}">${img && !tile ? `<img src="img/${esc(x.image.file)}" alt="">` : `<div class="slogo">${tile ? `<span class="logo xxl tile"><img src="img/${esc(x.image.file)}" alt=""></span>` : isDeal ? logoBox(x.company, 'xxl') : ''}</div>`}<span class="shade"></span><span class="shz"><i></i></span>
  <div class="wrap sin">${backLink('#/news', tr('الأخبار', 'News'))}<div class="meta"><span class="kd">${esc(kindName(kd))}</span><span>${esc(fmtDate(x.date))}</span><span>${esc((x.source && x.source.name) || '')}</span></div><h1>${esc(itTitle(x))}</h1></div></div>
  ${img && x.image.credit ? `<div class="wrap"><div class="cred">${tr('الصورة', 'Photo')}: ${esc(x.image.credit)}</div></div>` : ''}
  <main class="wrap"><article class="story">
  ${itF(x, 'dek') ? `<div class="dek">${esc(itF(x, 'dek'))}</div>` : ''}
  ${isDeal ? `<div class="bigfacts rv"><div class="bf main">${logoBox(x.company)}<div><small>${esc(x.company)}</small><b class="b">${esc(x.amount ? money(x.amount) : (x.amountLabel || money(null)))}</b></div></div>${facts.map(f => `<div class="bf"><small>${esc(f[0])}</small><b>${esc(f[1])}</b></div>`).join('')}</div>` : facts.length ? `<div class="bigfacts rv">${facts.map(f => `<div class="bf"><small>${esc(f[0])}</small><b>${esc(f[1])}</b></div>`).join('')}</div>` : ''}
  ${others.length ? `<div class="invs">${tr('مستثمرون آخرون', 'Also investing')}: ${others.map(n => `<span>${logoOf(n) ? `<img src="${esc(logoOf(n))}" alt="">` : ''}${esc(n)}</span>`).join('')}</div>` : ''}
  <div class="prose sprose">${body.map(p => `<p>${esc(typeof p === 'string' ? p : (p.text || ''))}</p>`).join('')}</div>
  ${itF(x, 'why') ? `<div class="box dark why2 rv"><h4>${ic('bolt')} ${tr('ليش هذا مهم', 'Why it matters')}</h4><p>${esc(itF(x, 'why'))}</p></div>` : ''}
  <div class="srcs">${(x.sources && x.sources.length ? x.sources : [x.source]).filter(Boolean).map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${ic('source')} ${esc(s.name)}</a>`).join('')}<button class="iconbtn save sm" data-save="${x.id}" aria-pressed="${ST.saved.includes(x.id)}" aria-label="${tr('حفظ', 'Save')}">${ic('save')}</button></div>
  ${sim.length ? `<section class="sec"><div class="sh"><span class="mark"></span><h2>${tr('صفقات مشابهة', 'Similar deals')}</h2><span class="aside">${x.industry ? esc(ind(x.industry)) : ''}${x.industry && x.market ? ' · ' : ''}${x.market ? esc(mkt(x.market)) : ''}</span></div><div class="deals">${sim.map((d, k) => dealRow(d, k, smx)).join('')}</div></section>` : ''}
 </article></main>`;
}
function bindStory() { bindRowCards(); const h = $('.shero img'); if (h) { const f = () => { const y = window.scrollY; h.style.transform = `translateY(${Math.min(120, y * .25)}px) scale(1.06)`; }; window.addEventListener('scroll', f, { passive: true }); f(); } }

/* hover company card on deal rows */
function bindRowCards() {
 $$('.drow[data-co]').forEach(r => {
  r.addEventListener('pointerenter', e => { if (e.pointerType !== 'mouse') return; const d = ROUNDS.find(x => x.company === r.dataset.co); if (!d) return; coCard(r, d); });
  r.addEventListener('pointerleave', () => $$('.cocard').forEach(c => c.remove()));
 });
}
function coCard(el, d) {
 $$('.cocard').forEach(c => c.remove());
 const all = ROUNDS.filter(x => x.company === d.company);
 const c = document.createElement('div'); c.className = 'cocard';
 c.innerHTML = `<div class="ch">${logoBox(d.company, 'lg2')}<div><b>${esc(d.company)}</b><small>${esc(ind(d.industry))} · ${esc(mkt(d.market))}</small></div></div>${all.map(x => `<div class="cr"><span class="b">${esc(x.amount ? money(x.amount) : money(null))}</span><span>${esc(stg(x.stage))}</span><span>${esc(fmtDate(x.date))}</span></div>`).join('')}${(d.investors || []).length ? `<div class="ci">${d.investors.slice(0, 6).map(i => `<span class="${i.lead ? 'ld' : ''}">${esc(i.name)}</span>`).join('')}</div>` : ''}<div class="cs">${ic('source')} ${esc((d.source && d.source.name) || '')}</div>`;
 document.body.appendChild(c); const r = el.getBoundingClientRect();
 c.style.top = (window.scrollY + r.top - c.offsetHeight - 10 > window.scrollY + 70 ? window.scrollY + r.top - c.offsetHeight - 10 : window.scrollY + r.bottom + 10) + 'px';
 c.style.left = Math.max(12, Math.min(window.innerWidth - c.offsetWidth - 12, r.left + (EN() ? 40 : r.width - c.offsetWidth - 40))) + 'px';
}

/* ---------- SAVED ---------- */
function renderSaved() {
 const arts = ST.saved.map(lib).filter(Boolean); const its = ST.saved.map(id => ITEMS.find(x => x.id === id)).filter(Boolean);
 const hl = {}; ST.hl.forEach(h => { (hl[h.a] = hl[h.a] || []).push(h); });
 const known = ST.known.map(con).filter(Boolean);
 const none = !arts.length && !its.length && !ST.hl.length && !known.length;
 return `<main class="wrap">${head(tr('محفوظاتك', 'Saved'), tr('ما حفظته من مقالات وأخبار وجمل، والمفاهيم التي أخذتها. محفوظ في هذا المتصفح.', 'Articles, news and sentences you saved, and concepts you learned. Stored in this browser.'))}
  ${none ? `<div class="empty big">${ic('bookmark')}<br>${tr('ما حفظت شيئًا بعد. اضغط رمز الحفظ على أي مقالة أو خبر، أو ظلّل جملة في مقالة.', "Nothing saved yet. Tap the save icon on any article or story, or select a sentence in an article.")}</div>` : ''}
  ${arts.length ? `<h2 class="cgh">${tr('مقالات', 'Articles')}</h2><div class="slist">${arts.map(a => `<a href="#/a/${a.id}">${ic('article')}<b>${esc(EN() ? a.en : a.ar)}</b><small>${esc(tx(a, 'author'))}</small></a>`).join('')}</div>` : ''}
  ${Object.keys(hl).length ? `<h2 class="cgh">${tr('جمل حفظتها', 'Saved sentences')}</h2>${Object.entries(hl).map(([aid, hs]) => { const a = lib(aid); return `<div class="hlgroup"><a href="#/a/${aid}?t=ar"><b>${esc(a ? (EN() ? a.en : a.ar) : aid)}</b></a>${hs.map(h => `<blockquote lang="ar" dir="rtl">${esc(h.t)}</blockquote>`).join('')}</div>`; }).join('')}` : ''}
  ${its.length ? `<h2 class="cgh">${tr('أخبار', 'News')}</h2><div class="ngrid">${its.map((x, k) => newsCard(x, k)).join('')}</div>` : ''}
  ${known.length ? `<h2 class="cgh">${tr('مفاهيم أخذتها', 'Concepts learned')}</h2><div class="cl">${known.map(c => `<a href="#/c/${c.id}"><i class="sunlet"></i> ${esc(EN() ? c.en : c.ar)}</a>`).join('')}</div>` : ''}</main>`;
}

/* ---------- DASHBOARD (lazy D3 module) ---------- */
const loaded = {};
function script(src) { if (loaded[src]) return loaded[src]; return (loaded[src] = new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); })); }
async function d3Ready() { await script('vendor/d3.min.js'); await script('vendor/topojson-client.min.js'); }
function renderDashShell() { return `<main class="wrap" id="dash">${head(tr('الداشبورد', 'Dashboard'), tr('سوق الاستثمار الجريء في المنطقة كما يرسمه شروق الشمس: كل شهر شمس، وكل دولة شمس، وكل صفقة شعاع.', 'The MENA venture market drawn as a sunrise: every month a sun, every country a sun, every deal a ray.'))}<div class="loader"><i></i></div></main>`; }
async function bindDash(q) {
 try { await d3Ready(); await script('app/dash.js' + (VER ? '?v=' + VER : '')); } catch (e) { $('#dash .loader').outerHTML = `<div class="empty">${tr('تعذر تحميل الرسوم.', 'Could not load the charts.')}</div>`; return; }
 window.TMRDash.render($('#dash'), { SITE, ROUNDS, ITEMS, LANG, tr, esc, ic, money, mkt, ind, stg, fmtDate, fmtShort, MON, logoOf, logoBox, dealRow, kindName, kindCol, bindRowCards, coCard, slug, q, reveal, placePill, EN });
}

/* ---------- SEARCH PALETTE ---------- */
let SIDX = null;
function searchIndex() {
 if (SIDX) return SIDX;
 const norm = s => String(s || '').toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[ًٌٍَُِّْـ]/g, '');
 const L = [];
 ROUTES.forEach(r => L.push({ g: 'page', t: tr(r[1], r[3]), s: '', h: '#' + r[0], i: r[2] }));
 L.push({ g: 'page', t: tr('محفوظاتك', 'Saved'), s: '', h: '#/saved', i: 'bookmark' });
 ARTS().forEach(a => L.push({ g: 'article', t: EN() ? a.en : a.ar, s: `${tx(a, 'author')} · ${a.pub}`, h: '#/a/' + a.id, i: 'article', k: [a.ar, a.en, a.author, a.author_en, a.pub, a.about, a.about_en].join(' ') }));
 CON.forEach(c => L.push({ g: 'concept', t: EN() ? c.en : c.ar, s: EN() ? c.ar : c.en, h: '#/c/' + c.id, i: 'learn', k: [c.ar, c.en].join(' ') }));
 const cos = new Set();
 ROUNDS.forEach(d => { if (cos.has(d.company)) return; cos.add(d.company); L.push({ g: 'company', t: d.company, s: `${d.amount ? money(d.amount) : ''} · ${stg(d.stage)} · ${mkt(d.market)}`, h: d.story ? '#/n/' + d.story : '#/dashboard?co=' + encodeURIComponent(d.company), i: 'deal', logo: d.company, k: [d.company, (d.investors || []).map(i => i.name).join(' '), d.industry].join(' ') }); });
 ITEMS.filter(x => x.type === 'news' || x.type === 'deal').forEach(x => L.push({ g: 'news', t: itTitle(x), s: fmtDate(x.date), h: '#/n/' + x.id, i: 'news', k: [x.ar && x.ar.title, x.en && x.en.title, x.company].join(' ') }));
 L.forEach(x => { x.n = norm((x.k || '') + ' ' + x.t + ' ' + x.s); });
 SIDX = { L, norm }; return SIDX;
}
function openSearch() {
 if ($('.palette')) return;
 const { L, norm } = searchIndex(); const GN = { page: tr('صفحات', 'Pages'), article: tr('مقالات', 'Articles'), concept: tr('مفاهيم', 'Concepts'), company: tr('شركات', 'Companies'), news: tr('أخبار', 'News') };
 const el = document.createElement('div'); el.className = 'palette';
 el.innerHTML = `<div class="pbox"><div class="pin">${ic('search')}<input id="pq" placeholder="${tr('ابحث عن مقالة، مفهوم، شركة، مستثمر…', 'Search articles, concepts, companies, investors…')}" autocomplete="off"><kbd>Esc</kbd></div><div class="pres" id="pres"></div><div class="pft"><span><kbd>↑</kbd><kbd>↓</kbd> ${tr('تنقل', 'move')}</span><span><kbd>↵</kbd> ${tr('افتح', 'open')}</span><span class="pl">${stack('p-')}</span></div></div>`;
 document.body.appendChild(el); const inp = $('#pq', el); const res = $('#pres', el); let sel = 0, cur = [];
 const draw = () => {
  const qv = norm(inp.value.trim()); const words = qv.split(/\s+/).filter(Boolean);
  cur = words.length ? L.filter(x => words.every(w => x.n.includes(w))).slice(0, 40) : L.filter(x => x.g === 'page' || x.g === 'article' || x.g === 'concept').slice(0, 14);
  const by = {}; cur.forEach(x => (by[x.g] = by[x.g] || []).push(x)); cur = Object.values(by).flat(); sel = Math.min(sel, cur.length - 1);
  let k = 0; res.innerHTML = cur.length ? Object.entries(by).map(([g, xs]) => `<div class="pg">${esc(GN[g])}</div>${xs.map(x => `<a class="pr${k === sel ? ' on' : ''}" data-k="${k++}" href="${x.h}">${x.logo ? logoBox(x.logo, 'sm') : `<span class="pic">${ic(x.i)}</span>`}<span><b>${esc(x.t)}</b>${x.s ? `<small>${esc(x.s)}</small>` : ''}</span></a>`).join('')}`).join('') : `<div class="empty">${tr('لا نتائج', 'No results')}</div>`;
 };
 const close = () => { el.classList.add('out'); setTimeout(() => el.remove(), 250); };
 inp.oninput = () => { sel = 0; draw(); };
 inp.onkeydown = e => { if (e.key === 'ArrowDown') { sel = Math.min(cur.length - 1, sel + 1); draw(); e.preventDefault(); const o = $('.pr.on', res); if (o) o.scrollIntoView({ block: 'nearest' }); } else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); const o = $('.pr.on', res); if (o) o.scrollIntoView({ block: 'nearest' }); } else if (e.key === 'Enter') { const x = cur[sel]; if (x) { location.hash = x.h.slice(1); close(); } } else if (e.key === 'Escape') close(); };
 el.onclick = e => { if (e.target === el) close(); if (e.target.closest('.pr')) close(); };
 draw(); setTimeout(() => inp.focus(), 30);
}

/* ---------- misc ---------- */
function notFound() { return `<main class="wrap">${head(tr('الصفحة غير موجودة', 'Page not found'), `<a href="#/">${tr('ارجع لصفحة لك', 'Back to For You')}</a>`)}</main>`; }

/* ---------- shell ---------- */
const ROUTES = [['/', 'لك', 'today', 'For You'], ['/news', 'الأخبار', 'news', 'News'], ['/articles', 'المقالات', 'article', 'Articles'], ['/concepts', 'المفاهيم', 'learn', 'Concepts'], ['/dashboard', 'الداشبورد', 'dashboard', 'Dashboard']];
function setLangAttrs() { document.documentElement.lang = LANG; document.documentElement.dir = EN() ? 'ltr' : 'rtl'; document.title = EN() ? 'The Morning Round' : 'The Morning Round · جولة الصباح'; }
function chrome() {
 $('#nav').innerHTML = ROUTES.map(r => `<a href="#${r[0]}" data-r="${r[0]}">${ic(r[2])}${tr(r[1], r[3])}</a>`).join('') + '<span class="ind" id="navind"></span>';
 $('#dock').innerHTML = '<span class="ind" id="dockind"></span>' + ROUTES.map(r => `<a href="#${r[0]}" data-r="${r[0]}">${ic(r[2])}<span>${tr(r[1], r[3])}</span></a>`).join('');
 $('#langb').innerHTML = `<span class="${EN() ? 'ar' : 'b'}">${EN() ? 'ع' : 'EN'}</span>`; $('#langb').setAttribute('aria-label', tr('English', 'العربية'));
 $('#srch').setAttribute('aria-label', tr('بحث', 'Search'));
 $('#footl').innerHTML = `<i>Every page compounds</i><span>${tr('الاستثمار الجريء · الأسواق الخاصة · السعودية والخليج · الرياض', 'Venture · Private markets · Saudi & GCC · Riyadh')}</span>`;
}
function shell() {
 setLangAttrs();
 document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="stripes-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3EA6F2"/><stop offset=".5" stop-color="#3EA6F2"/><stop offset=".5" stop-color="#FFD45C"/><stop offset=".625" stop-color="#FFD45C"/><stop offset=".625" stop-color="#FFA235"/><stop offset=".75" stop-color="#FFA235"/><stop offset=".75" stop-color="#FF7A24"/><stop offset=".875" stop-color="#FF7A24"/><stop offset=".875" stop-color="#F2551A"/><stop offset="1" stop-color="#F2551A"/></linearGradient></defs></svg>
 <header class="hdr" id="hdr"><div class="bar"><div class="wrap in"><a class="brand" href="#/" aria-label="The Morning Round">${LOGO_LINE}</a>
  <nav class="nav" id="nav"></nav>
  <div class="tools"><button class="tbtn sbtn" id="srch">${ic('search')}<kbd class="b">⌘K</kbd></button><button class="tbtn" id="langb"></button><button class="tbtn" id="theme">${ic('moon')}</button></div></div></div><div class="skyline" id="skyline"></div></header>
 <div id="view"></div>
 <footer class="foot"><div class="wrap in"><div id="footl"></div>${stack('f-')}</div></footer>
 <nav class="dock" id="dock"></nav>`);
 chrome();
 const h = NOW.getHours() + NOW.getMinutes() / 60; const sky = h < 5 ? ['#1B2A4A', '#3EA6F2'] : h < 7 ? ['#FFD45C', '#FF7A24'] : h < 9 ? ['#FFD45C', '#3EA6F2'] : h < 16 ? ['#3EA6F2', '#8DCBF7'] : h < 19 ? ['#FFA235', '#F2551A'] : ['#1B2A4A', '#3EA6F2'];
 document.documentElement.style.setProperty('--sky1', sky[0]); document.documentElement.style.setProperty('--sky2', sky[1]);
 const tb = $('#theme'); const setT = t => { if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; tb.innerHTML = ic((t || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark' ? 'sunny' : 'moon'); };
 let th = null; try { th = localStorage.getItem('tmr-theme'); } catch (e) {} setT(th);
 tb.onclick = () => { const curr = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); const n = curr === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('tmr-theme', n); } catch (e) {} const go = () => setT(n); if (document.startViewTransition) document.startViewTransition(go); else go(); };
 $('#langb').onclick = () => { LANG = EN() ? 'ar' : 'en'; try { localStorage.setItem('tmr-lang', LANG); } catch (e) {} SIDX = null; const go = () => { setLangAttrs(); chrome(); route(true); }; if (document.startViewTransition) document.startViewTransition(go); else go(); };
 $('#srch').onclick = openSearch;
 document.addEventListener('keydown', e => { if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName))) { e.preventDefault(); openSearch(); } });
 let ly = 0; window.addEventListener('scroll', () => { const y = window.scrollY; const down = y > ly && y > 140; $('#hdr').classList.toggle('hide', down); $('#dock').classList.toggle('hide', down && y > 300); ly = y;
  const rs = $('#rsun'); const pr = $('#prose'); const sm = $('#sdeck'); const tgt = pr && pr.offsetParent ? pr : (sm && sm.offsetParent ? sm : null); if (rs && tgt) { const r = tgt.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (window.innerHeight * .6 - r.top) / r.height)); rs.style.setProperty('--r', p.toFixed(3)); } }, { passive: true });
 document.addEventListener('click', e => { const b = e.target.closest('[data-save]'); if (!b) return; const id = b.dataset.save; const i = ST.saved.indexOf(id); if (i < 0) ST.saved.push(id); else ST.saved.splice(i, 1); save(); b.setAttribute('aria-pressed', String(i < 0)); if (i < 0) toast(tr('حُفظت في محفوظاتك', 'Saved to your list')); });
 document.addEventListener('click', e => { const b = e.target.closest('[data-know]'); if (!b) return; const id = b.dataset.know; if (!ST.known.includes(id)) { ST.known.push(id); save(); burst(b); } $$(`[data-know="${id}"]`).forEach(x => { x.classList.add('done'); x.lastChild.textContent = tr('أخذته', 'Learned'); }); refreshStats(); });
}
function navSync(path) {
 const base = '/' + (path.split('/')[1] || '');
 const key = { '/': '/', '/a': '/articles', '/c': '/concepts', '/n': '/news' }[base] || base;
 $$('#nav a,#dock a').forEach(a => a.classList.toggle('on', a.dataset.r === key));
 const place = (wrap, ind, dock) => { const on = $('a.on', wrap); if (!on) { ind.style.opacity = 0; return; } ind.style.opacity = 1; const r = on.getBoundingClientRect(), p = wrap.getBoundingClientRect(); const x = r.left - p.left + (dock ? 0 : r.width / 2 - 12); ind.style.transform = `translateX(${x}px)`; };
 requestAnimationFrame(() => { place($('#nav'), $('#navind')); place($('#dock'), $('#dockind'), true); });
}
let io;
function reveal() { if (io) io.disconnect(); io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .08, rootMargin: '0px 0px -30px 0px' }); $$('.rv,.deals,#acard,#ccard').forEach(el => io.observe(el)); }
async function route(fresh) {
 $$('.rsun,.pop,.hlbtn,.cocard,.dtip').forEach(x => x.remove());
 const raw = (location.hash || '#/').slice(1); const [path, qs] = raw.split('?'); const q = new URLSearchParams(qs || '');
 const parts = path.split('/').filter(Boolean);
 let html, bind = () => {};
 if (!parts.length) { html = renderForYou(); bind = bindForYou; }
 else if (parts[0] === 'a') { html = await renderArticle(parts[1], q); bind = () => bindArticle(parts[1]); }
 else if (parts[0] === 'articles') html = renderLibrary(q);
 else if (parts[0] === 'concepts') html = renderConcepts();
 else if (parts[0] === 'c') html = renderConcept(parts[1]);
 else if (parts[0] === 'news') html = renderNews(q);
 else if (parts[0] === 'n') { html = renderStory(parts[1]); bind = bindStory; }
 else if (parts[0] === 'saved') html = renderSaved();
 else if (parts[0] === 'dashboard') { html = renderDashShell(); bind = () => bindDash(q); }
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
 el.innerHTML = `<span class="glow"></span><span class="rays"></span><div class="box"><span class="lgw"><span class="hz"></span>${stack('i-')}</span><span class="slogan">Every page compounds</span></div><div class="date">${esc(fmtDay(TODAY))}</div>`;
 document.body.appendChild(el);
 return new Promise(res => { requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('go'))); const end = () => { el.classList.add('out'); setTimeout(() => el.remove(), 900); res(); }; const t = setTimeout(end, 3900); el.onclick = () => { clearTimeout(t); end(); }; });
}

/* ---------- boot ---------- */
(async function boot() {
 shell();
 $('#view').innerHTML = '<div class="loader"><i></i></div>';
 const ip = intro();
 try { await load(); } catch (e) { $('#view').innerHTML = `<main class="wrap"><div class="empty">${tr('تعذر تحميل البيانات.', 'Could not load the data.')}</div></main>`; return; }
 await route(true);
 window.addEventListener('hashchange', () => route(false));
 window.addEventListener('resize', () => { navSync((location.hash || '#/').slice(1).split('?')[0]); const t = $('#atabs'); if (t) placePill(t); });
 await ip;
})();
})();
