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
 pause: '<path d="M8 5.5v13M16 5.5v13"/>',
 menu: '<path d="M4 7h16M4 12h16M4 17h16"/>'
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
const isMon = s => /^\d{4}-\d{2}$/.test(s || '');
const fmtDate = s => { if (!s) return ''; if (isMon(s)) { const d = dt(s + '-15'); return `${MON()[d.getMonth()]} ${d.getFullYear()}`; } const d = dt(s); if (isNaN(d)) return s; return `${d.getDate()} ${MON()[d.getMonth()]} ${d.getFullYear()}`; };
const fmtDay = s => { if (isMon(s)) return fmtDate(s); const d = dt(s); return EN() ? `${EN_DAYS[d.getDay()]} ${d.getDate()} ${EN_MON[d.getMonth()]}` : `${AR_DAYS[d.getDay()]} ${d.getDate()} ${AR_MON[d.getMonth()]}`; };
const fmtShort = s => { if (isMon(s)) return MON()[dt(s + '-15').getMonth()]; const d = dt(s); return `${d.getDate()} ${MON()[d.getMonth()]}`; };

/* ---------- state ---------- */
const KEY = 'tmr4';
let ST = { days: [], read: [], known: [], saved: [], pick: {}, hl: [], readAt: {}, knownAt: {}, knownFrom: {}, pos: {} };
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
let SITE, LIB, CON, ITEMS, DEALS, ROUNDS, LOGOS = {}, TRACKS = [];
const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, '-').replace(/^-|-$/g, '');
const logoOf = name => LOGOS[slug(name)] || null;
const money = m => m == null || m === '' ? tr('غير معلن', 'Undisclosed') : m >= 1000 ? '$' + (+(m / 1000).toFixed(m >= 10000 ? 0 : 2)).toString() + 'B' : m >= 1 ? '$' + (+m.toFixed(m >= 100 ? 0 : 1)) + 'M' : '$' + Math.round(m * 1000) + 'K';
const itTitle = x => ((x[LANG] && x[LANG].title) || (x.ar && x.ar.title) || (x.en && x.en.title) || x.company || '');
const itF = (x, k) => ((x[LANG] && x[LANG][k]) || (x.ar && x.ar[k]) || (x.en && x.en[k]) || '');

async function load() {
 const v = VER ? '?v=' + VER : '';
 const [s, l, c, h, tk] = await Promise.all([fetch('data/site.json' + v).then(r => r.json()), fetch('app/data/library.json' + v).then(r => r.json()), fetch('app/data/concepts.json' + v).then(r => r.json()), fetch('app/data/deals-h1.json' + v).then(r => r.json()).catch(() => ({ deals: [] })), fetch('app/data/tracks.json' + v).then(r => r.json()).catch(() => [])]);
 TRACKS = tk || [];
 SITE = s; LIB = l; CON = c;
 const items = s.collections.items; ITEMS = Object.entries(items).map(([id, v]) => Object.assign({ id }, v)).filter(x => !x.hidden);
 const meta = s.collections.meta; LOGOS = (meta.logos && meta.logos.map) || {};
 DEALS = ((meta.deals && meta.deals.deals) || []).concat(h.deals || []);
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


/* ---------- reading progress, concepts per article, tracks, companies ---------- */
function markRead(id) { if (!ST.read.includes(id)) ST.read.push(id); ST.readAt = ST.readAt || {}; if (!ST.readAt[id]) ST.readAt[id] = TODAY; save(); }
const trackOf = id => TRACKS.find(t => t.ids.includes(id));
const coSlug = name => slug(name);
const coHref = name => '#/co/' + encodeURIComponent(coSlug(name));
function prereqBox(a) {
 const cs = (a.concepts || []).map(con).filter(Boolean); if (!cs.length) return '';
 return `<section class="prereq rv"><h4>${tr('تحتاج تعرف قبلها', 'Good to know first')}</h4><div class="pchips">${cs.map(c => { const on = ST.known.includes(c.id); return `<a class="pchip${on ? ' on' : ''}" href="#/c/${c.id}">${on ? '<i class="sunlet"></i>' : `<span class="pst">${ic('star')}</span>`}<span>${esc(EN() ? c.en : c.ar)}</span><small>${on ? tr('أخذته', 'Learned') : tr('افتحه', 'Open it')}</small></a>`; }).join('')}</div></section>`;
}
function artConcepts(a) {
 const cs = (a.concepts || []).map(con).filter(Boolean); if (!cs.length) return '';
 return `<section class="aconc rv"><h3>${tr('مفاهيم هالمقالة', 'Concepts in this article')}</h3><div class="acgrid">${cs.map(c => { const on = ST.known.includes(c.id); return `<div class="acitem${on ? ' on' : ''}"><a href="#/c/${c.id}"><b>${esc(EN() ? c.en : c.ar)}</b><span class="b">${esc(EN() ? c.ar : c.en)}</span><p>${tx(c, 'defn').replace(/<[^>]+>/g, '').slice(0, 120)}…</p></a><button class="btn2 knowb${on ? ' done' : ''}" data-know="${c.id}"><svg class="ic" viewBox="0 0 24 24" style="width:18px;height:18px">${P.check}</svg><span>${on ? tr('أخذته', 'Learned') : tr('تعلمته', 'Got it')}</span></button></div>`; }).join('')}</div></section>`;
}
function readNext(a) {
 const out = []; const add = x => { if (x && x.id !== a.id && x.arabic && !out.includes(x)) out.push(x); };
 const t = trackOf(a.id); if (t) add(lib(t.ids[t.ids.indexOf(a.id) + 1]));
 (a.links || []).forEach(l => add(lib(l.to)));
 LIB.filter(x => (x.links || []).some(l => l.to === a.id)).forEach(add);
 ARTS().filter(x => x.topic === a.topic && !ST.read.includes(x.id)).forEach(add);
 const L = out.slice(0, 3); if (!L.length) return '';
 return `<section class="rnext rv"><h3>${tr('اقرأ بعدها', 'Read next')}</h3><div class="rngrid">${L.map(x => `<a href="#/a/${x.id}" class="rn"><span class="tag t-${x.topic}">${esc(topic(x.topic))}</span><b>${esc(EN() ? x.en : x.ar)}</b><small>${esc(tx(x, 'author'))} · <span class="b">${x.mins}</span> ${tr('دقيقة', 'min')}${ST.read.includes(x.id) ? ' · ' + tr('قرأتها', 'Read') : ''}</small></a>`).join('')}</div></section>`;
}
function trackBar(a) {
 const t = trackOf(a.id); if (!t) return '';
 const k = t.ids.indexOf(a.id); const done = t.ids.filter(i => ST.read.includes(i)).length;
 const nx = lib(t.ids[k + 1]);
 return `<a class="tbar rv" href="#/articles?track=${t.id}"><span class="tbk">${tr('مسار', 'Track')}</span><b>${esc(EN() ? t.en : t.ar)}</b><span class="tpos"><span class="b">${k + 1}</span> ${tr('من', 'of')} <span class="b">${t.ids.length}</span></span><span class="tdots">${t.ids.map(i => `<i class="${ST.read.includes(i) ? 'on' : ''}${i === a.id ? ' now' : ''}"></i>`).join('')}</span>${nx ? `<small>${tr('التالية', 'Next')}: ${esc(EN() ? nx.en : nx.ar)}</small>` : `<small>${done === t.ids.length ? tr('خلصت المسار', 'Track complete') : tr('آخر مقالة في المسار', 'Last in the track')}</small>`}</a>`;
}
function trackCard(t) {
 const done = t.ids.filter(i => ST.read.includes(i)).length; const nx = t.ids.map(lib).find(x => x && !ST.read.includes(x.id));
 return `<a class="trk rv" href="#/a/${(nx || lib(t.ids[0])).id}"><div class="tt"><b>${esc(EN() ? t.en : t.ar)}</b><small><span class="b">${t.ids.length}</span> ${tr('مقالات', 'articles')} · ${tr('نحو', 'about')} <span class="b">${Math.round(t.ids.reduce((s, i) => s + ((lib(i) || {}).mins || 0), 0) / 5) * 5}</span> ${tr('دقيقة', 'min')}</small></div><p>${esc(tx(t, 'about'))}</p><span class="tprog"><i style="width:${Math.round(done / t.ids.length * 100)}%"></i></span><ol>${t.ids.map(lib).filter(Boolean).map(x => `<li class="${ST.read.includes(x.id) ? 'on' : ''}${nx && x.id === nx.id ? ' now' : ''}">${esc(EN() ? x.en : x.ar)}</li>`).join('')}</ol><span class="tgo">${done === t.ids.length ? tr('خلصته', 'Completed') : done ? tr('كمّل المسار', 'Continue') : tr('ابدأ المسار', 'Start')} ${ic(EN() ? 'back' : 'fwd')}</span></a>`;
}

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
  ${DOW >= 4 ? `<section class="sec rv"><div class="sh"><span class="mark"></span><h2>${tr('جولتك الأسبوعية', 'Your week')}</h2></div>${weekCard(false)}</section>` : ''}
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
 ${trackBar(a)}${prereqBox(a)}
 <section id="v-sum" class="sum" ${tab === 'sum' ? '' : 'hidden'}>${summaryHTML(a)}${artConcepts(a)}${doneBtn}${readNext(a)}</section>
 <section id="v-ar" ${tab === 'ar' ? '' : 'hidden'} lang="ar" dir="rtl">${a.arabic ? `<div class="hlhint">${ic('pen')} ${tr('ظلّل أي جملة لتحفظها', 'Select any sentence to save it')}</div><div class="prose" id="prose">${body}</div>
  <div class="ours">
   ${a.market ? `<div class="box dark"><h4>ماذا يعني هذا لسوقنا</h4>${a.market.map(p => `<p>${esc(p)}</p>`).join('')}<div class="src">المصادر: ${a.marketSrc.map(s => `<a href="${esc(s[1])}" target="_blank" rel="noopener">${esc(s[0])}</a>`).join(' · ')}</div></div>` : ''}
   ${a.who ? `<div class="box soft"><h4>من كتبه</h4><p>${esc(a.who)}</p><div class="src">المصدر: <a href="${esc(a.whoSrc[1])}" target="_blank" rel="noopener">${esc(a.whoSrc[0])}</a></div></div>` : ''}
   ${a.match ? `<div class="box soft"><h4>مطابقة مع الأصل</h4><ul>${a.match.map(m => `<li>${esc(m)}</li>`).join('')}</ul></div>` : ''}
  </div>${artConcepts(a)}${doneBtn}${readNext(a)}` : `<div class="empty">النسخة العربية الكاملة لهذه المقالة قيد الإعداد.</div>`}</section>
 <section id="v-orig" class="origwrap" ${tab === 'orig' ? '' : 'hidden'}>${a.embed === false ? `<div class="empty">${tr('موقع الكاتب لا يسمح بعرض المقالة داخل موقعنا.', "The author's site doesn't allow the article to be shown inside ours.")} <a href="${esc(a.url)}" target="_blank" rel="noopener">${tr('افتح الأصل', 'Open the original')}</a></div>` : `<div class="obar">${a.arabic && !EN() ? `<button class="ohint" data-goar>${ic('article')} ${tr('النسخة العربية الكاملة في تبويب «العربية»', 'The full Arabic version is in the Arabic tab')}</button>` : '<span></span>'}<a class="olink" id="olink" href="${esc(a.url)}" target="_blank" rel="noopener">${ic('ext')} ${tr('افتح في صفحة جديدة', 'Open in a new tab')}</a></div><div class="note" id="onote">${ic('source')} ${tr('النص الأصلي كما نشره الكاتب، معروض من موقعه داخل صفحتنا.', 'The original as the author published it, shown from their site inside ours.')}</div><iframe data-src="${esc(a.url)}" title="${esc(a.en)}" loading="lazy" referrerpolicy="no-referrer"></iframe>`}</section>
 </main>`;
}
function placePill(seg) { const pill = $('.pill', seg), on = $('[aria-pressed="true"]', seg); if (!pill || !on) return; const r = on.getBoundingClientRect(), p = seg.getBoundingClientRect(); pill.style.left = '0px'; pill.style.width = r.width + 'px'; pill.style.transform = `translateX(${r.left - p.left}px)`; }
function bindArticle(id) {
 const a = lib(id); const tabs = $('#atabs');
 requestAnimationFrame(() => placePill(tabs));
 const show = t => { $$('button', tabs).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.t === t))); placePill(tabs); ['sum', 'ar', 'orig'].forEach(k => { $('#v-' + k).hidden = k !== t; }); const f = $('#v-orig iframe'); if (t === 'orig' && f && !f.src) f.src = f.dataset.src; if (t === 'sum') dots(); history.replaceState(null, '', `#/a/${id}${t === 'sum' ? '' : '?t=' + t}`); const h = $('.ahead'); if (window.scrollY > h.offsetTop + h.offsetHeight) window.scrollTo({ top: h.offsetTop + h.offsetHeight - 120, behavior: 'smooth' }); };
 $$('button', tabs).forEach(b => b.onclick = () => show(b.dataset.t));
 if (!$('#v-orig').hidden) { const f = $('#v-orig iframe'); if (f) f.src = f.dataset.src; }
 const goar = $('[data-goar]'); if (goar) goar.onclick = () => show('ar');
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
   const t = e.target.closest('.cterm'); if (t) { const c = con(t.dataset.c); const on = c && ST.known.includes(c.id); if (c) pop(t, `<span class="tag cn">${on ? `<i class="sunlet"></i> ${tr('مفهوم أخذته', 'A concept you learned')}` : `${ic('star')} ${tr('مفهوم جديد عليك', 'New concept for you')}`}</span><div style="margin-top:8px"><b>${esc(c.ar)}</b> <span class="b" style="color:var(--ink-2)">${esc(c.en)}</span></div><p>${c.defn}</p><div class="popacts"><a href="#/c/${c.id}">${tr('افتح المفهوم', 'Open the concept')} ←</a>${on ? '' : `<button class="btn2 knowb sm" data-know="${c.id}"><svg class="ic" viewBox="0 0 24 24" style="width:16px;height:16px">${P.check}</svg><span>${tr('تعلمته', 'Got it')}</span></button>`}</div>`); }
  });
  applyHL(pr, id); bindHL(pr, id);
 }
 $$('.readdone').forEach(rd => rd.onclick = () => { markRead(id); $$('.readdone').forEach(x => x.classList.add('done')); burst(rd); });
 if (pr) { crossNotes(pr, a); autoConcepts(pr); resumeReading(pr, id); }
 const rs = document.createElement('div'); rs.className = 'rsun'; rs.innerHTML = '<i></i>'; rs.id = 'rsun'; document.body.appendChild(rs);
}
let AKA = null;
function akaList() {
 if (AKA) return AKA; AKA = [];
 CON.forEach(c => (c.aka || []).forEach(t => { const lat = /^[A-Za-z0-9 &\/.\-]+$/.test(t); const esc2 = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); const caseS = lat && t.length <= 4 && t === t.toUpperCase();
  const re = lat ? new RegExp('(?<![A-Za-z])' + esc2 + '(?![A-Za-z])', caseS ? 'g' : 'gi') : new RegExp('(?<![\\u0621-\\u064A])(?:[وفبلك])?' + esc2, 'g'); AKA.push({ c: c.id, re, len: t.length }); }));
 return AKA;
}
function autoConcepts(pr) {
 const L = akaList(); let used = new Set();
 const walk = el => {
  [...el.childNodes].forEach(n => {
   if (n.nodeType === 1) { if (/^(H2|H3)$/.test(n.tagName)) { used = new Set(); return; } if (n.closest('a,sup,.cterm,mark,figure,svg,.xnote,.foot,math,table,.ournote')) return; walk(n); return; }
   if (n.nodeType !== 3 || !n.data.trim()) return;
   let node = n;
   for (let guard = 0; guard < 6 && node; guard++) {
    let best = null; L.forEach(x => { if (used.has(x.c)) return; x.re.lastIndex = 0; const m = x.re.exec(node.data); if (m && (!best || m.index < best.i || (m.index === best.i && m[0].length > best.l))) best = { i: m.index, l: m[0].length, c: x.c }; });
    if (!best) break; used.add(best.c);
    const r = document.createRange(); r.setStart(node, best.i); r.setEnd(node, best.i + best.l); const sp = document.createElement('span'); sp.className = 'cterm auto' + (ST.known.includes(best.c) ? ' known' : ' new'); sp.dataset.c = best.c; r.surroundContents(sp);
    node = sp.nextSibling && sp.nextSibling.nodeType === 3 ? sp.nextSibling : null;
   }
  });
 };
 walk(pr);
}
function crossNotes(pr, a) {
 const ps = $$('p', pr);
 (a.links || []).forEach(l => { const p = ps[l.p], t = lib(l.to); if (!p || !t) return; const n = document.createElement('a'); n.className = 'xnote'; n.href = '#/a/' + t.id; n.innerHTML = `<span class="xk">${ic('article')} ${tr('كتبنا عن هذا', 'We covered this')}</span><b>${esc(EN() ? t.en : t.ar)}</b><small>${esc(tx(t, 'author'))} · <span class="b">${t.mins}</span> ${tr('دقيقة', 'min')}${ST.read.includes(t.id) ? ' · ' + tr('قرأتها', 'Read') : ''}</small>`; p.after(n); });
}
function resumeReading(pr, id) {
 const ps = $$(':scope > p, :scope > h2', pr).filter(p => p.textContent.trim().length > 40 || p.tagName === 'H2'); if (ps.length < 6) return;
 ST.pos = ST.pos || {}; const prev = ST.pos[id];
 const bar = document.createElement('div'); bar.className = 'rprog'; bar.innerHTML = '<i></i>'; document.body.appendChild(bar); bar.id = 'rprog';
 let last = 0, t0 = 0;
 const tick = () => { const va = $('#v-ar'); if (!va || va.hidden || !document.body.contains(pr)) return; const mid = window.innerHeight * .35; let k = 0; ps.forEach((p, j) => { if (p.getBoundingClientRect().top < mid) k = j; }); const pc = Math.min(1, Math.max(0, (k + 1) / ps.length)); bar.firstChild.style.width = (pc * 100).toFixed(1) + '%'; const now = Date.now(); if (k !== last && now - t0 > 1500) { t0 = now; last = k; ST.pos[id] = { p: k, n: ps.length, d: TODAY }; save(); } if (k >= ps.length - 1 && !ST.read.includes(id)) { markRead(id); $$('.readdone').forEach(x => x.classList.add('done')); toast(tr('وصلت لآخر المقالة، علّمناها إنك خلصتها', 'You reached the end, marked as finished')); } };
 if (window._rtick) window.removeEventListener('scroll', window._rtick); window._rtick = tick; window.addEventListener('scroll', tick, { passive: true });
 if (prev && prev.p > 2 && prev.p < ps.length - 1 && !$('#v-ar').hidden) {
  setTimeout(() => { const tgt = ps[prev.p]; if (!tgt) return; window.scrollTo({ top: window.scrollY + tgt.getBoundingClientRect().top - 140, behavior: 'smooth' }); tgt.classList.add('resumed');
   const b = document.createElement('div'); b.className = 'resume'; b.innerHTML = `<span class="sunlet"></span><span>${tr('رجعناك للفقرة', 'Back to paragraph')} <span class="b">${prev.p + 1}</span> ${tr('من', 'of')} <span class="b">${ps.length}</span></span><button>${tr('من البداية', 'From the start')}</button>`; document.body.appendChild(b);
   $('button', b).onclick = () => { b.remove(); window.scrollTo({ top: 0, behavior: 'smooth' }); }; setTimeout(() => b.classList.add('out'), 6500); setTimeout(() => b.remove(), 7000); }, 450);
 }
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
  btn = document.createElement('div'); btn.className = 'hlbar'; btn.innerHTML = `<button class="hlbtn" data-k="s">${ic('pen')} ${tr('احفظ', 'Save')}</button><button class="hlbtn sh" data-k="q">${ic('ext')} ${tr('شاركها كصورة', 'Share as image')}</button>`;
  btn.style.top = (window.scrollY + r.top - 52) + 'px'; btn.style.left = Math.max(10, Math.min(window.innerWidth - 300, r.left + r.width / 2 - 140)) + 'px';
  btn.onmousedown = e => e.preventDefault();
  $('[data-k="q"]', btn).onclick = () => { const t = text; s.removeAllRanges(); clear(); toast(tr('نجهز البطاقة…', 'Making the card…')); quoteCard(t, lib(id)); };
  $('[data-k="s"]', btn).onclick = () => { const rg = s.getRangeAt(0); try { const m = document.createElement('mark'); m.className = 'hl new'; rg.surroundContents(m); } catch (e) { /* spans several elements: kept in saved list */ }
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
 const ft = q.get('topic') || '', fs = q.get('src') || '', fl = q.get('len') || '', fr = q.get('st') || '', ftk = q.get('track') || '';
 const all = ARTS();
 const tk = TRACKS.find(t => t.id === ftk); const list = (tk ? tk.ids.map(lib).filter(Boolean) : all).filter(a => (!ft || a.topic === ft) && (!fs || a.pub === fs) && (!fl || (a.mins >= LEN[fl][0] && a.mins <= LEN[fl][1])) && (!fr || (fr === 'read') === ST.read.includes(a.id)));
 const pubs = [...new Set(all.map(a => a.pub))];
 const topics = Object.keys(TOPIC).filter(k => all.some(a => a.topic === k));
 const link = (k, v) => { const p = new URLSearchParams({ topic: ft, src: fs, len: fl, st: fr, track: ftk }); if (p.get(k) === v) p.delete(k); else p.set(k, v); [...p.keys()].forEach(x => { if (!p.get(x)) p.delete(x); }); const s = p.toString(); return '#/articles' + (s ? '?' + s : ''); };
 const chip = (k, v, label) => `<a class="chipb" href="${link(k, v)}" aria-pressed="${({ topic: ft, src: fs, len: fl, st: fr, track: ftk })[k] === v}">${label}</a>`;
 const open = ft || fs || fl || fr;
 return `<main class="wrap">${head(tr('المقالات', 'Articles'), tr('مكتبة مفتوحة ومتنوعة: الاستثمار الجريء والملكية الخاصة والائتمان والاستحواذات والأسواق والاقتصاد. كل مقالة هنا كاملة بالعربية، ومعها الأصل والملخص.', 'An open, varied library: venture, private equity and credit, M&A, markets and economics. Every article here is complete in Arabic, with the original and a summary.'))}
  <details class="filters" ${open ? 'open' : ''}><summary>${ic('filter')} ${tr('تصفية', 'Filter')} ${open ? `<a class="clr" href="#/articles">${tr('مسح', 'Clear')}</a>` : ''}</summary>
   <div class="frow"><span>${tr('الموضوع', 'Topic')}</span><div class="chips">${topics.map(k => chip('topic', k, esc(topic(k)))).join('')}</div></div>
   <div class="frow"><span>${tr('المصدر', 'Source')}</span><div class="chips">${pubs.map(p => chip('src', p, esc(p))).join('')}</div></div>
   <div class="frow"><span>${tr('الطول', 'Length')}</span><div class="chips">${Object.keys(LEN).map(k => chip('len', k, LEN[k][2][EN() ? 1 : 0])).join('')}</div></div>
   <div class="frow"><span>${tr('حالتها', 'Status')}</span><div class="chips">${chip('st', 'unread', tr('ما قريتها', 'Not read yet'))}${chip('st', 'read', tr('قريتها', 'Read'))}</div></div></details>
  ${TRACKS.length && !tk ? `<section class="trks"><div class="sh"><span class="mark"></span><h2>${tr('مسارات القراءة', 'Reading tracks')}</h2><span class="aside">${tr('مقالات مرتبة بموضوع واحد', 'Articles in order, one theme')}</span></div><div class="trgrid">${TRACKS.map(trackCard).join('')}</div></section>` : tk ? `<div class="tkhead"><a class="clr" href="#/articles">${ic(EN() ? 'fwd' : 'back')} ${tr('كل المقالات', 'All articles')}</a><h2>${tr('مسار', 'Track')}: ${esc(EN() ? tk.en : tk.ar)}</h2></div>` : ''}
  <div class="lgrid">${list.map((a, k) => `<a class="lcard rv${ST.read.includes(a.id) ? ' isread' : ''}" href="#/a/${a.id}" style="transition-delay:${k * .05}s"><div class="vis">${a.chart && window.TMR_CHARTS ? `<div style="position:absolute;inset:14px 10px 18px">${TMR_CHARTS[a.chart]}</div>` : a.img ? `<img src="img/${a.img}.jpg" alt="" loading="lazy">` : `<div class="typo"><b>${esc(a.pub.toUpperCase())}</b><em>${esc(a.en)}</em></div>`}${bands()}</div><div class="bd"><div class="meta"><span class="tag t-${a.topic}">${esc(topic(a.topic))}</span><span><span class="b">${a.mins}</span> ${tr('دقيقة', 'min')}</span></div><h3>${esc(EN() ? a.en : a.ar)}</h3><p>${esc(tx(a, 'author'))} · ${esc(a.pub)}</p><div class="ft">${ST.read.includes(a.id) ? `<span class="ar-ok">${ic('check')} ${tr('قرأتها', 'Read')}${ST.readAt && ST.readAt[a.id] ? ' · ' + esc(fmtDate(ST.readAt[a.id])) : ''}</span>` : (ST.pos && ST.pos[a.id] ? `<span class="ar-mid">${tr('وصلت للفقرة', 'At paragraph')} <span class="b">${ST.pos[a.id].p + 1}</span> ${tr('من', 'of')} <span class="b">${ST.pos[a.id].n}</span></span>` : `<span>${tr('ملخص · العربية · الأصل', 'Summary · Arabic · Original')}</span>`)}</div></div></a>`).join('')}
  ${list.length ? '' : `<div class="empty">${tr('لا توجد مقالات بهذه التصفية.', 'No articles match.')}</div>`}</div>
  <div class="coming rv">${ic('clock')} <span>${tr('مقالات جديدة كاملة تُضاف كل أسبوع بعد ترجمتها كاملة ومراجعتها.', 'New articles are added every week once they are fully written in Arabic and checked.')}</span></div></main>`;
}

/* ---------- CONCEPTS ---------- */
const CGROUP = { vc: ['أساسيات الاستثمار الجريء', 'Venture basics'], deal: ['هيكلة الصفقات', 'Deal terms'], funds: ['الصناديق والمستثمرون فيها', 'Funds & LPs'], val: ['التقييم والمقاييس', 'Valuation & metrics'], pe: ['الملكية الخاصة والائتمان', 'PE & credit'], mk: ['الأسواق والخروج', 'Markets & exits'] };
function skySVG(W, H) {
 const groups = Object.keys(CGROUP).filter(g => CON.some(c => (c.group || 'vc') === g)); if (!EN()) groups.reverse();
 const pos = {}; const gx = {}; let h = 11; const rnd = () => ((h = (h * 1103515245 + 12345) >>> 0) / 4294967296);
 const top = H * .18, span = H * .6;
 groups.forEach((g, gi) => { const cx = W * (gi + .5) / groups.length; gx[g] = cx; const list = CON.filter(c => (c.group || 'vc') === g); const cols = list.length > 6 ? 2 : 1; const rows = Math.ceil(list.length / cols);
  list.forEach((c, k) => { const col = k % cols, row = Math.floor(k / cols); pos[c.id] = [cx + (col - (cols - 1) / 2) * (W / groups.length * .42) + (rnd() - .5) * 26, top + (row + .5) * span / rows + (rnd() - .5) * 18 + (col ? span / rows / 2 : 0)]; }); });
 const links = []; CON.forEach((c, i) => CON.slice(i + 1).forEach(d => { const shared = (c.related || []).includes(d.id) || (d.related || []).includes(c.id); if (shared) links.push([c.id, d.id]); }));
 const dust = Array.from({ length: 110 }, () => `<circle cx="${(rnd() * W).toFixed(0)}" cy="${(rnd() * H * .8).toFixed(0)}" r="${(rnd() * 1.2 + .3).toFixed(1)}" class="dust" style="--d:${(rnd() * 4).toFixed(1)}s"/>`).join('');
 return `<svg class="sky" viewBox="0 0 ${W} ${H}" role="img" aria-label="${tr('خريطة المفاهيم', 'Concept map')}">
  <defs><radialGradient id="glw"><stop offset="0" stop-color="#FFA235" stop-opacity=".55"/><stop offset="1" stop-color="#FFA235" stop-opacity="0"/></radialGradient></defs>
  ${dust}
  ${links.map(([x, y]) => `<line class="lk${ST.known.includes(x) && ST.known.includes(y) ? ' on' : ''}" data-a="${x}" data-b="${y}" x1="${pos[x][0].toFixed(1)}" y1="${pos[x][1].toFixed(1)}" x2="${pos[y][0].toFixed(1)}" y2="${pos[y][1].toFixed(1)}"/>`).join('')}
  <line class="hz" x1="0" x2="${W}" y1="${H * .86}" y2="${H * .86}"/>
  ${groups.map(g => `<text class="gl" x="${gx[g]}" y="${H * .86 + 26}" text-anchor="middle">${esc(CGROUP[g][EN() ? 1 : 0])}</text>`).join('')}
  ${CON.map((c, k) => { const [x, y] = pos[c.id]; const on = ST.known.includes(c.id); return `<a href="#/c/${c.id}" class="st${on ? ' on' : ''}" data-id="${c.id}" style="--i:${k}"><g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${on ? `<circle r="24" fill="url(#glw)"/><circle r="9" fill="url(#stripes-v)"/>` : `<circle r="11" class="halo"/><path class="star4" d="M0-6 1.4-1.4 6 0 1.4 1.4 0 6-1.4 1.4-6 0-1.4-1.4z"/>`}<text y="${on ? 26 : 23}" text-anchor="middle">${esc(EN() ? c.en.replace(/ \(.*\)/, '') : c.ar.replace(/ \(.*\)/, ''))}</text></g></a>`; }).join('')}
 </svg>`;
}
function renderConcepts() {
 const n = CON.length, k = CON.filter(c => ST.known.includes(c.id)).length;
 return `<main class="wrap">${head(tr('المفاهيم', 'Concepts'), tr('سماء مفاهيمك: كل نجمة مفهوم، وتضيء حين تأخذه. تعريف دقيق بمرجعه، وكيف يشتغل، ومثال حقيقي، وما يختلط معه.', 'Your sky of concepts: each star is a concept and it lights up once you learn it. A precise definition with its reference, how it works, a real example, and what it gets confused with.'))}
  <section class="skywrap rv"><div class="skyhead"><b dir="ltr"><span class="b">${k}</span> / <span class="b">${n}</span></b><span>${tr('مفهوم أضأته', 'concepts lit')}</span></div>${skySVG(1100, 560)}</section>
  ${Object.keys(CGROUP).filter(g => CON.some(c => (c.group || 'vc') === g)).map(g => `<h2 class="cgh">${esc(CGROUP[g][EN() ? 1 : 0])}</h2><div class="cgrid">${CON.filter(c => (c.group || 'vc') === g).map(c => `<a class="cbox rv${ST.known.includes(c.id) ? ' on' : ''}" href="#/c/${c.id}"><span class="cst">${ST.known.includes(c.id) ? '<i class="sunlet"></i>' : ic('star')}</span><b>${esc(EN() ? c.en : c.ar)}</b><span class="b en2">${esc(EN() ? c.ar : c.en)}</span><span>${tx(c, 'defn').replace(/<[^>]+>/g, '').slice(0, 130)}…</span>${ST.known.includes(c.id) ? `<em class="kok">${ic('check')} ${tr('أخذته', 'Learned')}${ST.knownAt && ST.knownAt[c.id] ? ' · ' + esc(fmtDate(ST.knownAt[c.id])) : ''}</em>` : ''}</a>`).join('')}</div>`).join('')}
  <div class="coming rv">${ic('clock')} <span>${tr('تُضاف المفاهيم تباعًا بعد مراجعة كل واحد ومرجعه.', 'Concepts are added as each one and its reference are checked.')}</span></div></main>`;
}
function bindSky() { const sv = $('.sky'); if (!sv) return; $$('.st', sv).forEach(a => { a.addEventListener('pointerenter', () => { sv.classList.add('hov'); a.classList.add('hv'); $$('.lk', sv).forEach(l => l.classList.toggle('hl', l.dataset.a === a.dataset.id || l.dataset.b === a.dataset.id)); }); a.addEventListener('pointerleave', () => { sv.classList.remove('hov'); a.classList.remove('hv'); $$('.lk.hl', sv).forEach(l => l.classList.remove('hl')); }); }); }
function renderConcept(id) {
 const c = con(id); if (!c) return notFound();
 const arts = [...new Set([...(c.articles || []), ...LIB.filter(a => (a.concepts || []).includes(c.id)).map(a => a.id)])].map(lib).filter(a => a && a.arabic); const from = ST.knownFrom && ST.knownFrom[c.id] && lib(ST.knownFrom[c.id]);
 const rel = (c.related || []).map(con).filter(Boolean);
 const confuse = EN() && c.confuse_en ? c.confuse_en : c.confuse;
 return `<main class="wrap"><article class="cpage">${backLink('#/concepts', tr('المفاهيم', 'Concepts'))}
  <div class="chero"><div><span class="tag cn">${esc(tx(c, 'stage'))}</span><h1>${esc(EN() ? c.en : c.ar)}</h1><div class="en">${esc(EN() ? c.ar : c.en)}</div></div><div class="cside">${conceptSide(c)}</div></div>
  ${from ? `<a class="kfrom" href="#/a/${from.id}"><i class="sunlet"></i> ${tr('تعلمته من', 'Learned from')}: <b>${esc(EN() ? from.en : from.ar)}</b>${ST.knownAt && ST.knownAt[c.id] ? ` · ${esc(fmtDate(ST.knownAt[c.id]))}` : ''}</a>` : ''}
  <h2>${tr('التعريف', 'Definition')}</h2><p>${tx(c, 'defn')}</p>
  <h2>${tr('كيف يشتغل', 'How it works')}</h2><p>${esc(tx(c, 'how'))}</p>
  ${tx(c, 'example') ? `<h2>${tr('مثال حقيقي', 'A real example')}</h2><div class="exbox"><p>${esc(tx(c, 'example'))}</p></div>` : ''}
  ${confuse && confuse.length ? `<h2>${tr('ما يختلط معه', 'Often confused with')}</h2><div class="cmp">${confuse.map(x => `<div><b>${esc(x[0])}</b>${esc(x[1])}</div>`).join('')}</div>` : ''}
  ${rel.length ? `<h2>${tr('مفاهيم قريبة', 'Related concepts')}</h2><div class="cl">${rel.map(r => `<a href="#/c/${r.id}">${ic('star')} ${esc(EN() ? r.en : r.ar)}</a>`).join('')}</div>` : ''}
  ${arts.length ? `<h2>${tr('ورد في هذه المقالات', 'Appears in these articles')}</h2><div class="cl">${arts.map(a => `<a href="#/a/${a.id}">${ic('article')} ${esc(EN() ? a.en : a.ar)}</a>`).join('')}</div>` : ''}
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
  ${isDeal ? `<div class="bigfacts rv"><div class="bf main">${logoBox(x.company)}<div><small><a class="colink" href="${coHref(x.company)}">${esc(x.company)} ${ic(EN() ? 'back' : 'fwd')}</a></small><b class="b">${esc(x.amount ? money(x.amount) : (x.amountLabel || money(null)))}</b></div></div>${facts.map(f => `<div class="bf"><small>${esc(f[0])}</small><b>${esc(f[1])}</b></div>`).join('')}</div>` : facts.length ? `<div class="bigfacts rv">${facts.map(f => `<div class="bf"><small>${esc(f[0])}</small><b>${esc(f[1])}</b></div>`).join('')}</div>` : ''}
  ${others.length ? `<div class="invs">${tr('مستثمرون آخرون', 'Also investing')}: ${others.map(n => `<span>${logoOf(n) ? `<img src="${esc(logoOf(n))}" alt="">` : ''}${esc(n)}</span>`).join('')}</div>` : ''}
  <div class="prose sprose">${coLinks(body.map(p => `<p>${esc(typeof p === 'string' ? p : (p.text || ''))}</p>`).join(''), x.company)}</div>
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


/* ---------- company pages ---------- */
function companyData(sl) {
 const rounds = ROUNDS.filter(d => coSlug(d.company) === sl);
 const name = rounds[0] ? rounds[0].company : (ITEMS.find(x => x.company && coSlug(x.company) === sl) || {}).company;
 if (!name) return null;
 const re = new RegExp('(^|[^A-Za-z])' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^A-Za-z]|$)', 'i');
 const txt = x => [x.en && x.en.title, x.en && x.en.dek, ...((x.en && x.en.body) || []).map(b => typeof b === 'string' ? b : (b.text || ''))].join(' ');
 const storyIds = new Set(rounds.map(d => d.story).filter(Boolean));
 const items = ITEMS.filter(x => !storyIds.has(x.id) && ((x.company && coSlug(x.company) === sl) || re.test(txt(x))));
 return { name, rounds, items };
}
function coLinks(html, own) {
 const names = [...new Set(ROUNDS.map(d => d.company))].filter(n => n && n.length >= 4 && /^[A-Za-z0-9][A-Za-z0-9 .&'-]+$/.test(n) && n !== own).sort((a, b) => b.length - a.length);
 const done = new Set();
 names.forEach(n => { if (done.size > 6) return; const re = new RegExp('(^|[^A-Za-z>])(' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?![A-Za-z])'); if (re.test(html) && !done.has(n)) { done.add(n); html = html.replace(re, (m, a, b) => `${a}<a class="colink" href="${coHref(n)}">${b}</a>`); } });
 return html;
}
function renderCompany(sl) {
 const D = companyData(decodeURIComponent(sl)); if (!D) return notFound();
 const { name, rounds, items } = D; const r0 = rounds[0] || {};
 const st = rounds.map(d => d.story && ITEMS.find(i => i.id === d.story)).filter(Boolean);
 const val = [...st, ...items].filter(x => x.valuation).sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];
 const invs = [...new Set(rounds.flatMap(d => (d.investors || []).map(i => i.name)))];
 const total = rounds.reduce((s, d) => s + (d.amount || 0), 0);
 const ev = [...rounds.map(d => ({ d: d.date, c: kindCol(d.k || kindOf(d)), h: d.story ? `#/n/${d.story}` : (d.source && d.source.url) || '#', ext: !d.story, t: `${kindName(d.k || kindOf(d))}${d.stage ? ' · ' + stg(d.stage) : ''}${d.amount ? ' · ' + money(d.amount) : ''}`, s: (d.investors || []).length ? (d.investors.filter(i => i.lead).map(i => i.name).join(EN() ? ', ' : '، ') ? tr('بقيادة ', 'Led by ') + d.investors.filter(i => i.lead).map(i => i.name).join(EN() ? ', ' : '، ') : d.investors.map(i => i.name).slice(0, 3).join(EN() ? ', ' : '، ')) : (d.source && d.source.name) || '' })),
  ...items.map(x => ({ d: x.date, c: x.type === 'report' ? 'var(--glow)' : x.type === 'article' ? 'var(--dawn)' : kindCol(kindOf(x)), h: `#/n/${x.id}`, t: itTitle(x), s: `${x.type === 'report' ? tr('تقرير', 'Report') : x.type === 'article' ? tr('مقالة', 'Article') : kindName(kindOf(x))} · ${(x.source && x.source.name) || ''}` }))].filter(e => e.d).sort((a, b) => b.d.localeCompare(a.d));
 const r1 = rounds.find(d => d.industry) || {};
 return `<main class="wrap"><article class="copage">${backLink('#/news', tr('الأخبار', 'News'))}
  <div class="cohead">${logoBox(name, 'xl')}<div><h1>${esc(name)}</h1><div class="meta">${r1.industry ? `<span>${esc(ind(r1.industry))}</span>` : ''}${r0.market ? `<span>${esc(mkt(r0.market))}</span>` : ''}</div></div></div>
  <div class="cokpi rv">${val ? `<div><b class="b" dir="ltr">${esc(val.valuation)}</b><span>${tr('آخر تقييم معلن', 'Latest reported valuation')} · ${esc(fmtDate(val.date))}</span></div>` : ''}${r0.date ? `<div><b class="b">${esc(r0.amount ? money(r0.amount) : money(null))}</b><span>${tr('آخر جولة', 'Latest round')}${r0.stage ? ': ' + esc(stg(r0.stage)) : ''} · ${esc(fmtDate(r0.date))}</span></div>` : ''}${rounds.length > 1 && total ? `<div><b class="b">${esc(money(total))}</b><span>${tr('مجموع الجولات التي نتابعها', 'Total of rounds we track')}</span></div>` : ''}${invs.length ? `<div><b class="b">${invs.length}</b><span>${tr('مستثمرون في جولاتها', 'Investors in its rounds')}</span></div>` : ''}</div>
  ${invs.length ? `<div class="invs">${tr('المستثمرون', 'Investors')}: ${invs.map(n => `<span>${logoOf(n) ? `<img src="${esc(logoOf(n))}" alt="">` : ''}${esc(n)}</span>`).join('')}</div>` : ''}
  <h2>${tr('الخط الزمني', 'Timeline')}</h2>
  <div class="cotl">${ev.map(e => `<a class="cev rv" href="${esc(e.h)}" ${e.ext ? 'target="_blank" rel="noopener"' : ''} style="--c:${e.c}"><span class="cd">${esc(fmtDate(e.d))}</span><i></i><span class="ct"><b>${esc(e.t)}</b><small>${esc(e.s)}</small></span></a>`).join('')}</div>
  <p class="conote">${tr('نعرض الجولات التي نتابعها منذ يناير 2026، وكل خبر أو تقرير ذكر الشركة. الجولات الأقدم تُضاف تباعًا.', 'We show the rounds we track since January 2026, and every story or report that mentions the company. Older rounds are being added.')}</p>
 </article></main>`;
}

/* ---------- images: quote card and weekly card ---------- */
function loadImg(src) { return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; }); }
async function brandFonts() { try { await Promise.all(["900 60px 'Thmanyah Serif Display'", "400 30px 'Thmanyah Sans'", "700 30px 'Thmanyah Sans'", "800 60px 'Bricolage Grotesque'"].map(f => document.fonts.load(f))); } catch (e) {} }
function wrapLines(ctx, text, maxW) { const w = text.split(/\s+/); const L = []; let cur = ''; w.forEach(x => { const t = cur ? cur + ' ' + x : x; if (ctx.measureText(t).width > maxW && cur) { L.push(cur); cur = x; } else cur = t; }); if (cur) L.push(cur); return L; }
function drawSun(ctx, cx, cy, r) { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip(); const d = 2 * r, top = cy - r; [[0, 50, '#3EA6F2'], [54, 63, '#FFD45C'], [67.5, 75.5, '#FFA235'], [80.5, 87.5, '#FF7A24'], [93, 100, '#F2551A']].forEach(([a, b, c]) => { ctx.fillStyle = c; ctx.fillRect(cx - r, top + a / 100 * d, d, (b - a) / 100 * d); }); ctx.restore(); }
async function saveCanvas(cv, name) {
 const blob = await new Promise(r => cv.toBlob(r, 'image/png')); if (!blob) return;
 try { const f = new File([blob], name, { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [f] }) && /Mobi|Android|iPhone/i.test(navigator.userAgent)) { await navigator.share({ files: [f] }); return; } } catch (e) {}
 const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 3000);
}
async function quoteCard(text, a) {
 await brandFonts(); const W = 1080, H = 1350; const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
 ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);
 const lg = await loadImg('brand/pack/tmr-logo-line-color.svg'); if (lg) ctx.drawImage(lg, 80, 80, 400, 400 * lg.height / lg.width);
 ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.fillStyle = '#0B0D12';
 let fs = 78; let lines; do { ctx.font = `900 ${fs}px 'Thmanyah Serif Display'`; lines = wrapLines(ctx, '«' + text.replace(/\s+/g, ' ').trim() + '»', W - 180); fs -= 4; } while (lines.length * fs * 1.5 > 700 && fs > 36);
 const lh = (fs + 4) * 1.5; let y = 260 + Math.max(0, (720 - lines.length * lh) / 2) + lh * .8; lines.forEach(l => { ctx.fillText(l, W - 90, y); y += lh; });
 ctx.font = "700 34px 'Thmanyah Sans'"; ctx.fillText(EN() ? a.en : a.ar, W - 90, H - 250, W - 180); ctx.fillStyle = '#5D6370'; ctx.font = "400 30px 'Thmanyah Sans'"; ctx.fillText(`${tx(a, 'author')} · ${a.pub}`, W - 90, H - 200, W - 180);
 [['#FFD45C', 0], ['#FFA235', 1], ['#FF7A24', 2], ['#F2551A', 3]].forEach(([c, k]) => { ctx.fillStyle = c; ctx.fillRect(0, H - 140 + k * 35, W, 35); });
 await saveCanvas(cv, `the-morning-round-${a.id}.png`);
}
function weekRange() { const wk = weekDates(); const s = wk[0]; const e = new Date(dt(s)); e.setDate(e.getDate() + 6); const ei = `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, '0')}-${String(e.getDate()).padStart(2, '0')}`; return [s, ei]; }
function weekStats() {
 const [s, e] = weekRange(); const inR = d => d && d >= s && d <= e;
 const reads = Object.entries(ST.readAt || {}).filter(([, d]) => inR(d)).map(([id]) => lib(id)).filter(Boolean);
 const knows = Object.entries(ST.knownAt || {}).filter(([, d]) => inR(d)).map(([id]) => con(id)).filter(Boolean);
 const days = ST.days.filter(inR).length; const longest = reads.slice().sort((a, b) => b.mins - a.mins)[0];
 return { s, e, reads, knows, days, longest };
}
function weekCard(big) {
 const W = weekStats(); const s = dt(W.s), e = dt(W.e);
 const rng = `${s.getDate()} ${MON()[s.getMonth()]} ${tr('إلى', 'to')} ${e.getDate()} ${MON()[e.getMonth()]}`;
 return `<div class="wkcard${big ? ' wkbig' : ''}"><div class="wk1">${tr('جولتك الأسبوعية', 'Your week')} · ${esc(rng)}</div><h2>${W.reads.length + W.knows.length ? tr('أسبوعك في سطور', 'Your week in brief') : tr('أسبوعك ما بدأ بعد', 'Your week has not started')}</h2>
  <div class="wkst"><div><b class="b">${W.reads.length}</b><span>${tr('مقالات خلصتها', 'articles finished')}</span></div><div><b class="b">${W.knows.length}</b><span>${tr('مفاهيم تعلمتها', 'concepts learned')}</span></div><div><b class="b">${streak()}</b><span>${tr('أيام ورا بعض', 'day streak')}</span></div></div>
  ${W.longest ? `<div class="wkbest">${tr('أطول مقالة خلصتها', 'Longest article you finished')}<strong>${esc(EN() ? W.longest.en : W.longest.ar)} · <span class="b">${W.longest.mins}</span> ${tr('دقيقة', 'min')}</strong></div>` : ''}
  <span class="wksun"></span><span class="wklogo">${LOGO_LINE}</span>${big ? '' : `<a class="wkmore" href="#/week">${tr('افتحها', 'Open it')} ${ic(EN() ? 'back' : 'fwd')}</a>`}</div>`;
}
async function weekImage() {
 await brandFonts(); const Wk = weekStats(); const W = 1080, H = 1080; const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
 ctx.fillStyle = '#0B0D12'; ctx.fillRect(0, 0, W, H); drawSun(ctx, EN() ? W - 250 : 250, H - 110, 180);
 ctx.direction = EN() ? 'ltr' : 'rtl'; ctx.textAlign = EN() ? 'left' : 'right'; const X = EN() ? 80 : W - 80;
 const s = dt(Wk.s), e = dt(Wk.e); ctx.fillStyle = '#A3AAB6'; ctx.font = "400 34px 'Thmanyah Sans'"; ctx.fillText(`${tr('جولتك الأسبوعية', 'Your week')} · ${s.getDate()} ${MON()[s.getMonth()]} ${tr('إلى', 'to')} ${e.getDate()} ${MON()[e.getMonth()]}`, X, 130);
 ctx.fillStyle = '#EEF0F4'; ctx.font = `900 92px ${EN() ? "'Bricolage Grotesque'" : "'Thmanyah Serif Display'"}`; ctx.fillText(tr('أسبوعك في سطور', 'Your week in brief'), X, 250);
 const st = [[Wk.reads.length, tr('مقالات خلصتها', 'articles finished')], [Wk.knows.length, tr('مفاهيم تعلمتها', 'concepts learned')], [streak(), tr('أيام ورا بعض', 'day streak')]];
 st.forEach(([n, l], k) => { const x = EN() ? 80 + k * 320 : W - 80 - k * 320; ctx.fillStyle = '#FFD45C'; ctx.font = "800 150px 'Bricolage Grotesque'"; ctx.fillText(String(n), x, 460); ctx.fillStyle = '#A3AAB6'; ctx.font = "400 32px 'Thmanyah Sans'"; ctx.fillText(l, x, 520); });
 if (Wk.longest) { ctx.fillStyle = '#A3AAB6'; ctx.font = "400 30px 'Thmanyah Sans'"; ctx.fillText(tr('أطول مقالة خلصتها', 'Longest article you finished'), X, 620); ctx.fillStyle = '#FFFFFF'; ctx.font = "700 40px 'Thmanyah Sans'"; ctx.fillText(`${EN() ? Wk.longest.en : Wk.longest.ar} · ${Wk.longest.mins} ${tr('دقيقة', 'min')}`, X, 680, W - 160); }
 const lg = await loadImg('brand/pack/tmr-logo-line-color-on-dark.svg'); if (lg) ctx.drawImage(lg, EN() ? 80 : W - 80 - 360, H - 120, 360, 360 * lg.height / lg.width);
 await saveCanvas(cv, `the-morning-round-week-${Wk.s}.png`);
}
function renderWeek() { return `<main class="wrap">${head(tr('جولتك الأسبوعية', 'Your week'), tr('كل خميس: وش قريت ووش تعلمت هالأسبوع. تنحسب المقالات اللي علّمتها «خلصتها» والمفاهيم اللي أخذتها.', 'Every Thursday: what you read and learned this week. Counts articles you marked finished and concepts you learned.'))}<div class="wkwrap">${weekCard(true)}<button class="btn" id="wksave">${ic('ext')} ${tr('احفظها كصورة', 'Save as image')}</button></div></main>`; }
function bindWeek() { const b = $('#wksave'); if (b) b.onclick = () => weekImage(); }

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
 ROUNDS.forEach(d => { if (cos.has(d.company)) return; cos.add(d.company); L.push({ g: 'company', t: d.company, s: `${d.amount ? money(d.amount) : ''} · ${stg(d.stage)} · ${mkt(d.market)}`, h: coHref(d.company), i: 'deal', logo: d.company, k: [d.company, (d.investors || []).map(i => i.name).join(' '), d.industry].join(' ') }); });
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


function openMenu() {
 if ($('.menu')) return;
 const n = ST.saved.length + ST.hl.length;
 const el = document.createElement('div'); el.className = 'menu';
 const cur = '#' + ((location.hash || '#/').slice(1).split('?')[0] || '/');
 el.innerHTML = `<div class="mpane"><div class="mtop"><span class="mlogo">${LOGO_LINE}</span><button class="mx" aria-label="close">${ic('close')}</button></div>
  <nav class="mlinks">${ROUTES.map((r, k) => `<a href="#${r[0]}" class="${cur === '#' + r[0] ? 'on' : ''}" style="--i:${k}">${ic(r[2])}<span>${tr(r[1], r[3])}</span></a>`).join('')}
  <a href="#/week" class="${cur === '#/week' ? 'on' : ''}" style="--i:5">${ic('streak')}<span>${tr('جولتك الأسبوعية', 'Your week')}</span></a>
  <a href="#/saved" class="sv${cur === '#/saved' ? ' on' : ''}" style="--i:6">${ic('bookmark')}<span>${tr('محفوظاتك', 'Saved')}</span>${n ? `<b class="b">${n}</b>` : ''}</a></nav>
  <div class="mtools"><button id="m-s">${ic('search')} ${tr('بحث', 'Search')}</button><button id="m-l">${ic('lang')} ${tr('English', 'العربية')}</button><button id="m-t">${ic('moon')} ${tr('الوضع الليلي', 'Dark mode')}</button></div>
  <div class="mby" dir="ltr">© ${new Date().getFullYear()} The Morning Round · by Meshal Alkanhal</div></div>`;
 document.body.appendChild(el);
 const close = () => { el.classList.add('out'); setTimeout(() => el.remove(), 350); };
 el.onclick = e => { if (e.target === el || e.target.closest('.mx') || e.target.closest('.mlinks a')) close(); };
 $('#m-s', el).onclick = () => { close(); setTimeout(openSearch, 200); };
 $('#m-l', el).onclick = () => { close(); $('#langb').click(); };
 $('#m-t', el).onclick = () => { close(); $('#theme').click(); };
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
 $('#footl').innerHTML = `<i>Every page compounds</i><span>${tr('الاستثمار الجريء · الأسواق الخاصة · السعودية والخليج · الرياض', 'Venture · Private markets · Saudi & GCC · Riyadh')}</span><span class="byl" dir="ltr">© ${new Date().getFullYear()} The Morning Round · by Meshal Alkanhal</span>`;
}
function shell() {
 setLangAttrs();
 document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="stripes-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3EA6F2"/><stop offset=".5" stop-color="#3EA6F2"/><stop offset=".5" stop-color="#FFD45C"/><stop offset=".625" stop-color="#FFD45C"/><stop offset=".625" stop-color="#FFA235"/><stop offset=".75" stop-color="#FFA235"/><stop offset=".75" stop-color="#FF7A24"/><stop offset=".875" stop-color="#FF7A24"/><stop offset=".875" stop-color="#F2551A"/><stop offset="1" stop-color="#F2551A"/></linearGradient></defs></svg>
 <header class="hdr" id="hdr"><div class="bar"><div class="wrap in"><a class="brand" href="#/" aria-label="The Morning Round">${LOGO_LINE}</a>
  <nav class="nav" id="nav"></nav>
  <div class="tools"><button class="tbtn sbtn" id="srch">${ic('search')}<kbd class="b">⌘K</kbd></button><button class="tbtn" id="langb"></button><button class="tbtn" id="theme">${ic('moon')}</button><button class="tbtn" id="menub" aria-label="menu">${ic('menu')}</button></div></div></div><div class="skyline" id="skyline"></div></header>
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
 $('#menub').onclick = openMenu;
 document.addEventListener('keydown', e => { if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName))) { e.preventDefault(); openSearch(); } });
 let ly = 0; window.addEventListener('scroll', () => { const y = window.scrollY; const down = y > ly && y > 140 && /^#\/a\//.test(location.hash); $('#hdr').classList.toggle('hide', down); ly = y;
  const rs = $('#rsun'); const pr = $('#prose'); const sm = $('#sdeck'); const tgt = pr && pr.offsetParent ? pr : (sm && sm.offsetParent ? sm : null); if (rs && tgt) { const r = tgt.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (window.innerHeight * .6 - r.top) / r.height)); rs.style.setProperty('--r', p.toFixed(3)); } }, { passive: true });
 document.addEventListener('click', e => { const b = e.target.closest('[data-save]'); if (!b) return; const id = b.dataset.save; const i = ST.saved.indexOf(id); if (i < 0) ST.saved.push(id); else ST.saved.splice(i, 1); save(); b.setAttribute('aria-pressed', String(i < 0)); if (i < 0) toast(tr('حُفظت في محفوظاتك', 'Saved to your list')); });
 document.addEventListener('click', e => { const b = e.target.closest('[data-know]'); if (!b) return; const id = b.dataset.know; if (!ST.known.includes(id)) { ST.known.push(id); ST.knownAt = ST.knownAt || {}; ST.knownAt[id] = TODAY; const am = (location.hash || '').match(/^#\/a\/([^?]+)/); if (am) { ST.knownFrom = ST.knownFrom || {}; ST.knownFrom[id] = am[1]; } save(); burst(b); } $$(`[data-know="${id}"]`).forEach(x => { x.classList.add('done'); x.lastChild.textContent = tr('أخذته', 'Learned'); }); $$(`.cterm[data-c="${id}"]`).forEach(x => { x.classList.remove('new'); x.classList.add('known'); }); refreshStats(); });
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
 $$('.rsun,.pop,.hlbtn,.hlbar,.cocard,.dtip,.rprog,.resume').forEach(x => x.remove()); if (window._rtick) { window.removeEventListener('scroll', window._rtick); window._rtick = null; }
 const raw = (location.hash || '#/').slice(1); const [path, qs] = raw.split('?'); const q = new URLSearchParams(qs || '');
 const parts = path.split('/').filter(Boolean);
 let html, bind = () => {};
 if (!parts.length) { html = renderForYou(); bind = bindForYou; }
 else if (parts[0] === 'a') { html = await renderArticle(parts[1], q); bind = () => bindArticle(parts[1]); }
 else if (parts[0] === 'articles') html = renderLibrary(q);
 else if (parts[0] === 'concepts') { html = renderConcepts(); bind = bindSky; }
 else if (parts[0] === 'c') html = renderConcept(parts[1]);
 else if (parts[0] === 'news') html = renderNews(q);
 else if (parts[0] === 'n') { html = renderStory(parts[1]); bind = bindStory; }
 else if (parts[0] === 'saved') html = renderSaved();
 else if (parts[0] === 'dashboard') { html = renderDashShell(); bind = () => bindDash(q); }
 else if (parts[0] === 'co') { html = renderCompany(parts[1] || ''); bind = bindRowCards; }
 else if (parts[0] === 'week') { html = renderWeek(); bind = bindWeek; }
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
