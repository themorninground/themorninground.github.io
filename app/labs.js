/* The Morning Round — interactive concept labs (loaded with the app) */
(function () {
 const C = { sky: '#3EA6F2', dawn: '#FFD45C', glow: '#FFA235', flame: '#FF7A24', ember: '#F2551A', rise: '#1E9E6A', fall: '#D9483B' };
 const T = (a, e) => (window.TMR_EN && window.TMR_EN() ? e : a);
 const fm = m => m >= 1000 ? '$' + (+(m / 1000).toFixed(2)) + 'B' : m >= 1 ? '$' + (+m.toFixed(m >= 100 ? 0 : 1)) + 'M' : '$' + Math.round(m * 1000) + 'K';
 const fmh = m => `<bdi>${fm(m)}</bdi>`, pch = x => `<bdi>${pc(x)}</bdi>`;
 const pc = x => (x * 100).toFixed(1).replace(/\.0$/, '') + '%';
 const slider = (id, label, min, max, step, val, fmt) => `<label class="lsl"><span>${label}</span><b id="${id}-v"></b><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" data-fmt="${fmt || ''}"></label>`;
 const toggle = (id, label, on) => `<label class="ltg"><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><span>${label}</span></label>`;
 const val = (root, id) => +root.querySelector('#' + id).value;
 const chk = (root, id) => root.querySelector('#' + id).checked;
 function showVals(root) { root.querySelectorAll('input[type=range]').forEach(i => { const f = i.dataset.fmt; const v = +i.value; root.querySelector('#' + i.id + '-v').textContent = f === 'm' ? fm(v) : f === 'x' ? v + 'x' : f === 'y' ? v + ' ' + T('سنة', 'yrs') : f === 'p' ? v + '%' : v; }); }
 function wire(root, draw) { const go = () => { showVals(root); draw(); }; root.querySelectorAll('input').forEach(i => i.addEventListener('input', go)); go(); }

 /* 1. dilution / cap table / pre-post money */
 const dilution = {
  html: () => `<p class="lintro">${T('شركة سعودية تأسست بمؤسسَين، وجمعت ثلاث جولات. حرّك مبلغ كل جولة وتقييمها قبل التمويل، وشوف كيف تتقسم الملكية.', 'A Saudi startup with two founders raises three rounds. Move each round\'s size and pre-money valuation and watch ownership split.')}</p>
   <div class="lgrid2"><div class="lctl">
    <h5>${T('البذرة', 'Seed')}</h5>${slider('d-s', T('المبلغ', 'Raise'), 0.5, 8, 0.5, 2, 'm')}${slider('d-sp', T('التقييم قبل', 'Pre-money'), 2, 30, 1, 8, 'm')}
    <h5>Series A</h5>${slider('d-a', T('المبلغ', 'Raise'), 3, 40, 1, 13, 'm')}${slider('d-ap', T('التقييم قبل', 'Pre-money'), 15, 150, 5, 45, 'm')}${toggle('d-pool', T('إضافة مجمع خيارات للموظفين 10% قبل الجولة', 'Add a 10% employee option pool before the round'), true)}
    <h5>Series B</h5>${slider('d-b', T('المبلغ', 'Raise'), 10, 80, 5, 25, 'm')}${slider('d-bp', T('التقييم قبل', 'Pre-money'), 50, 400, 10, 120, 'm')}
   </div><div class="lout" id="d-out"></div></div>
   <p class="lsrc">${T('المبالغ الافتراضية قريبة من وسيط الجولات في بياناتنا للسعودية والإمارات في 2026 (البذرة نحو 2 مليون، وSeries A نحو 13 مليون). التقييمات توضيحية لأنها غالبًا لا تُعلن.', 'Default sizes sit near the median rounds in our 2026 Saudi and UAE data (seed about $2M, Series A about $13M). Valuations are illustrative because they are rarely disclosed.')}</p>`,
  bind(root) {
   wire(root, () => {
    const st = [{ n: T('المؤسسون', 'Founders'), c: C.sky, v: 1 }];
    const snaps = [[T('التأسيس', 'Founding'), st.map(x => ({ ...x }))]];
    const round = (name, raise, pre, col) => { const post = pre + raise; st.forEach(x => x.v *= pre / post); st.push({ n: name, c: col, v: raise / post }); return post; };
    const ps = round(T('مستثمرو البذرة', 'Seed investors'), val(root, 'd-s'), val(root, 'd-sp'), C.dawn); snaps.push([T('بعد البذرة', 'After seed'), st.map(x => ({ ...x }))]);
    if (chk(root, 'd-pool')) { st.forEach(x => x.v *= 0.9); st.push({ n: T('مجمع الموظفين', 'Employee pool'), c: '#9AA1AE', v: 0.1 }); }
    const pa = round(T('مستثمرو A', 'Series A investors'), val(root, 'd-a'), val(root, 'd-ap'), C.glow); snaps.push([T('بعد A', 'After A'), st.map(x => ({ ...x }))]);
    const pb = round(T('مستثمرو B', 'Series B investors'), val(root, 'd-b'), val(root, 'd-bp'), C.ember); snaps.push([T('بعد B', 'After B'), st.map(x => ({ ...x }))]);
    const W = 560, bh = 34, gap = 26;
    const bars = snaps.map(([lab, xs], k) => { let x0 = 0; const y = k * (bh + gap) + 22; return `<text x="0" y="${y - 7}" class="lt">${lab}</text>` + xs.map(s => { const w = s.v * W; const r = `<rect x="${x0}" y="${y}" width="${Math.max(0, w - 1.5)}" height="${bh}" rx="6" fill="${s.c}"><title>${s.n}: ${pc(s.v)}</title></rect>${w > 46 ? `<text x="${x0 + w / 2}" y="${y + 22}" text-anchor="middle" class="lv">${pc(s.v)}</text>` : ''}`; x0 += w; return r; }).join(''); }).join('');
    const f = st[0].v, fv = f * pb;
    root.querySelector('#d-out').innerHTML = `<div class="lbig"><div><b style="color:${C.sky}">${pch(f)}</b><span>${T('حصة المؤسسين بعد B', 'Founders after B')}</span></div><div><b>${fmh(pb)}</b><span>${T('تقييم الشركة بعد B', 'Post-money after B')}</span></div><div><b style="color:${C.rise}">${fmh(fv)}</b><span>${T('قيمة حصة المؤسسين على الورق', 'Founders\' stake on paper')}</span></div></div>
     <svg viewBox="-4 0 ${W + 8} ${snaps.length * (bh + gap) + 10}" class="lsvg" style="direction:ltr">${bars}</svg>
     <div class="llegend">${st.map(s => `<span><i style="background:${s.c}"></i>${s.n} ${pch(s.v)}</span>`).join('')}</div>
     <p class="lread">${T(`الحصة نزلت من 100% إلى ${pch(f)}، لكن قيمتها على الورق صارت ${fmh(fv)}. كل جولة تكبّر الكعكة وتصغّر نصيبك منها، والسؤال هل تكبر الكعكة أسرع.`, `The stake fell from 100% to ${pch(f)}, but on paper it is now worth ${fmh(fv)}. Each round grows the pie and shrinks your slice; the question is whether the pie grows faster.`)}</p>`;
   });
  }
 };

 /* 2. liquidation preference */
 const liq = {
  html: () => `<p class="lintro">${T('مستثمر حط 20 مليون دولار في شركة بتقييم 80 مليون بعد الجولة، فصار يملك 25%. الشركة انباعت. حرّك سعر البيع وشوف مين ياخذ كم.', 'An investor put $20M into a company at an $80M post-money valuation, owning 25%. The company is sold. Move the sale price and see who gets what.')}</p>
   <div class="lgrid2"><div class="lctl">${slider('l-x', T('سعر البيع', 'Sale price'), 5, 400, 5, 60, 'm')}${slider('l-m', T('مضاعف الأفضلية', 'Preference multiple'), 1, 3, 0.5, 1, 'x')}${toggle('l-p', T('أسهم مشاركة (ياخذ أفضليته ثم يشارك في الباقي)', 'Participating (takes the preference, then shares the rest)'), false)}</div><div class="lout" id="l-out"></div></div>
   <p class="lsrc">${T('الأرقام توضيحية بحجم جولات Series A في السوق. الحساب: المستثمر يختار الأكبر بين أفضليته (المبلغ × المضاعف) أو تحويل أسهمه إلى عادية وأخذ 25% من السعر.', 'Illustrative numbers at Series A scale. The math: the investor takes the larger of the preference (amount × multiple) or converting to common for 25% of the price.')}</p>`,
  bind(root) {
   const inv = 20, own = 0.25;
   const pay = (X, m, part) => { const pref = Math.min(X, inv * m); if (part) { const i = pref + (X - pref) * own; return i; } return Math.max(pref, X * own); };
   wire(root, () => {
    const X = val(root, 'l-x'), m = val(root, 'l-m'), part = chk(root, 'l-p');
    const i = pay(X, m, part), f = X - i;
    const W = 560, H = 220, mx = 400;
    const xs = Array.from({ length: 81 }, (_, k) => 5 + k * (mx - 5) / 80);
    const sx = v => 40 + v / mx * (W - 50), sy = v => H - 24 - v / mx * (H - 40);
    const path = fn => xs.map((v, k) => `${k ? 'L' : 'M'}${sx(v).toFixed(1)} ${sy(fn(v)).toFixed(1)}`).join(' ');
    const conv = part ? null : inv * m / own;
    root.querySelector('#l-out').innerHTML = `<div class="lbig"><div><b style="color:${C.ember}">${fmh(i)}</b><span>${T('للمستثمر', 'Investor')} (${pch(i / X)})</span></div><div><b style="color:${C.sky}">${fmh(Math.max(0, f))}</b><span>${T('للمؤسسين والموظفين', 'Founders and staff')} (${pch(Math.max(0, f) / X)})</span></div></div>
     <div class="lsplit"><i style="width:${(i / X * 100).toFixed(1)}%;background:${C.ember}"></i><i style="width:${(Math.max(0, f) / X * 100).toFixed(1)}%;background:${C.sky}"></i></div>
     <svg viewBox="0 0 ${W} ${H}" class="lsvg" style="direction:ltr"><line x1="40" x2="${W - 10}" y1="${H - 24}" y2="${H - 24}" stroke="currentColor" stroke-opacity=".25"/>
      <path d="${path(v => pay(v, m, part))}" fill="none" stroke="${C.ember}" stroke-width="3"/><path d="${path(v => v - pay(v, m, part))}" fill="none" stroke="${C.sky}" stroke-width="3"/>
      ${conv && conv < mx ? `<line x1="${sx(conv)}" x2="${sx(conv)}" y1="12" y2="${H - 24}" stroke="currentColor" stroke-dasharray="3 4" stroke-opacity=".5"/><text x="${sx(conv) + 4}" y="22" class="lt">${T('يحوّل فوق', 'converts above')} ${fm(conv)}</text>` : ''}
      <line x1="${sx(X)}" x2="${sx(X)}" y1="12" y2="${H - 24}" stroke="${C.dawn}" stroke-width="2"/><circle cx="${sx(X)}" cy="${sy(i)}" r="5" fill="${C.ember}"/><circle cx="${sx(X)}" cy="${sy(Math.max(0, f))}" r="5" fill="${C.sky}"/>
      <text x="40" y="${H - 6}" class="lt">$0</text><text x="${W - 10}" y="${H - 6}" text-anchor="end" class="lt">${fm(mx)}</text></svg>
     <div class="llegend"><span><i style="background:${C.ember}"></i>${T('المستثمر', 'Investor')}</span><span><i style="background:${C.sky}"></i>${T('المؤسسون والموظفون', 'Founders and staff')}</span></div>
     <p class="lread">${X <= inv * m ? T(`عند ${fmh(X)} المستثمر ياخذ كل شي تقريبًا لأن أفضليته ${fmh(inv * m)}، والمؤسسين يطلعون بلا شي حتى لو الشركة انباعت بسعر يبدو كبير.`, `At ${fmh(X)} the investor takes almost everything because the preference is ${fmh(inv * m)}; founders get nothing even though the sale sounds big.`) : part ? T('بالأسهم المشاركة ياخذ المستثمر أفضليته ثم 25% من الباقي، فيبقى نصيبه أكبر من حصته في كل الأسعار.', 'With participating shares the investor takes the preference and then 25% of the rest, so it always gets more than its ownership.') : X * own > inv * m ? T('السعر عالي بما يكفي، فالمستثمر يحوّل أسهمه ويأخذ 25% مثل الباقين. الأفضلية ما لها أثر هنا.', 'The price is high enough that the investor converts and takes 25% like everyone else. The preference no longer matters.') : T('المستثمر ياخذ أفضليته كاملة، لأنها أكبر من 25% من السعر.', 'The investor takes the full preference, because it is more than 25% of the price.')}</p>`;
   });
  }
 };

 /* 3. power law */
 const power = {
  html: () => `<p class="lintro">${T('صندوق يستثمر مليون دولار في كل شركة من 30 شركة. اضغط «سوِّ صندوق» وشوف من وين تجي الفلوس فعلًا.', 'A fund puts $1M into each of 30 startups. Press "Build a fund" and see where the money actually comes from.')}</p>
   <div class="lrow"><button class="btn" id="p-go">${T('سوِّ صندوق', 'Build a fund')}</button><span class="lhint" id="p-n"></span></div><div class="lout" id="p-out"></div>
   <p class="lsrc">${T('التوزيع توضيحي، قريب مما تنشره دراسات عوائد الاستثمار الجريء: قرابة نصف الاستثمارات ترجع أقل من رأس مالها، وقلة نادرة ترجع عشرات المرات.', 'An illustrative distribution, close to what venture return studies publish: about half of investments return less than their cost, and a rare few return tens of times.')}</p>`,
  bind(root) {
   let n = 0;
   const draw = () => {
    n++; const r = () => Math.random();
    const outs = Array.from({ length: 30 }, () => { const u = r(); return u < .5 ? 0 : u < .7 ? .2 + r() * .8 : u < .85 ? 1 + r() * 2 : u < .95 ? 3 + r() * 7 : u < .99 ? 10 + r() * 20 : 40 + r() * 60; }).sort((a, b) => b - a);
    const tot = outs.reduce((s, x) => s + x, 0), top = outs[0], top3 = outs.slice(0, 3).reduce((s, x) => s + x, 0), zero = outs.filter(x => x < 1).length;
    const W = 560, H = 210, mx = Math.max(10, top), bw = W / 30;
    root.querySelector('#p-n').textContent = T(`صندوق رقم ${n}`, `Fund #${n}`);
    root.querySelector('#p-out').innerHTML = `<div class="lbig"><div><b style="color:${tot / 30 >= 3 ? C.rise : tot / 30 >= 1 ? C.glow : C.fall}">${(tot / 30).toFixed(2)}x</b><span>${T('مضاعف الصندوق', 'Fund multiple')}</span></div><div><b>${pch(top / tot)}</b><span>${T('من العائد جاء من أفضل شركة', 'of returns from the best company')}</span></div><div><b>${zero}/30</b><span>${T('شركة رجعت أقل من رأس مالها', 'returned less than cost')}</span></div></div>
     <svg viewBox="0 0 ${W} ${H}" class="lsvg" style="direction:ltr">${outs.map((x, k) => { const h = Math.max(2, x / mx * (H - 30)); return `<rect x="${k * bw + 2}" y="${H - 20 - h}" width="${bw - 4}" height="${h}" rx="3" fill="${k === 0 ? C.ember : k < 3 ? C.glow : x >= 1 ? C.dawn : '#9AA1AE'}"><title>${x.toFixed(1)}x</title></rect>`; }).join('')}<line x1="0" x2="${W}" y1="${H - 20 - 1 / mx * (H - 30)}" y2="${H - 20 - 1 / mx * (H - 30)}" stroke="currentColor" stroke-dasharray="3 4" stroke-opacity=".5"/><text x="4" y="${H - 24 - 1 / mx * (H - 30)}" class="lt">1x</text><text x="${W}" y="${H - 4}" text-anchor="end" class="lt">${T('الشركات مرتبة من الأعلى عائدًا', 'Companies sorted by return')}</text></svg>
     <p class="lread">${T(`أفضل 3 شركات جابت ${pch(top3 / tot)} من كل العائد. لو شلت أفضل شركة وحدها، مضاعف الصندوق يصير ${((tot - top) / 30).toFixed(2)}x. اضغط مرة ثانية وشوف كيف تتغير النتيجة كلها بحسب وجود شركة استثنائية أو غيابها.`, `The top 3 companies produced ${pch(top3 / tot)} of all returns. Remove only the best one and the fund drops to ${((tot - top) / 30).toFixed(2)}x. Press again and watch the whole result swing on one outlier.`)}</p>`;
   };
   root.querySelector('#p-go').onclick = draw; draw();
  }
 };

 /* 4. J-curve */
 const jcurve = {
  html: () => `<p class="lintro">${T('صندوق حجمه 100 مليون دولار على 10 سنوات. الفلوس تطلع أول، والعوائد ترجع بعدين. حرّك الافتراضات وشوف شكل المنحنى.', 'A $100M fund over 10 years. Money goes out first, returns come back later. Move the assumptions and watch the curve.')}</p>
   <div class="lgrid2"><div class="lctl">${slider('j-d', T('سنوات الاستثمار', 'Years to invest'), 2, 6, 1, 4, 'y')}${slider('j-e', T('أول تخارج في السنة', 'First exit in year'), 3, 8, 1, 5, '')}${slider('j-m', T('المضاعف النهائي', 'Final multiple'), 0.5, 3.5, 0.1, 2, 'x')}</div><div class="lout" id="j-out"></div></div>
   <p class="lsrc">${T('توضيحي: رسوم إدارة 2% سنويًا، والتخارجات موزعة على أربع سنوات بعد أول تخارج. الأرقام صافية للمستثمر في الصندوق.', 'Illustrative: a 2% annual management fee, exits spread over four years after the first. Net figures for the fund investor.')}</p>`,
  bind(root) {
   wire(root, () => {
    const d = val(root, 'j-d'), e = val(root, 'j-e'), m = val(root, 'j-m'), Y = 12;
    const flows = Array(Y + 1).fill(0); for (let y = 1; y <= d; y++) flows[y] -= 90 / d; for (let y = 1; y <= 10; y++) flows[y] -= 1; const back = 90 * m; const ex = [0.15, 0.3, 0.35, 0.2]; ex.forEach((w, k) => { if (e + k <= Y) flows[e + k] += back * w; });
    let c = 0; const cum = flows.map(f => (c += f)); const lo = Math.min(...cum), loY = cum.indexOf(lo), be = cum.findIndex((v, k) => k > loY && v >= 0);
    const W = 560, H = 230, mn = Math.min(-100, lo - 10), mxv = Math.max(60, Math.max(...cum) + 10);
    const sx = k => 30 + k / Y * (W - 40), sy = v => 10 + (mxv - v) / (mxv - mn) * (H - 40);
    const pts = cum.map((v, k) => `${sx(k).toFixed(1)},${sy(v).toFixed(1)}`).join(' ');
    root.querySelector('#j-out').innerHTML = `<div class="lbig"><div><b style="color:${C.fall}">${fmh(-lo)}</b><span>${T('أعمق نقطة، في السنة', 'Deepest point, year')} ${loY}</span></div><div><b style="color:${be > 0 ? C.rise : C.fall}">${be > 0 ? T('السنة ', 'Year ') + be : T('ما يرجع', 'Never')}</b><span>${T('يرجع المستثمر رأس ماله', 'Investor breaks even')}</span></div><div><b>${(cum[Y] / 100 + 1).toFixed(2)}x</b><span>${T('صافي المضاعف', 'Net multiple')}</span></div></div>
     <svg viewBox="0 0 ${W} ${H}" class="lsvg" style="direction:ltr"><line x1="30" x2="${W - 10}" y1="${sy(0)}" y2="${sy(0)}" stroke="currentColor" stroke-opacity=".35"/>
      ${flows.map((f, k) => k ? `<rect x="${sx(k) - 7}" y="${Math.min(sy(0), sy(f))}" width="14" height="${Math.abs(sy(f) - sy(0))}" rx="3" fill="${f < 0 ? C.fall : C.rise}" opacity=".35"/>` : '').join('')}
      <polyline points="${pts}" fill="none" stroke="${C.sky}" stroke-width="3.5" stroke-linejoin="round"/>${cum.map((v, k) => `<circle cx="${sx(k)}" cy="${sy(v)}" r="${k === loY ? 6 : 3}" fill="${k === loY ? C.fall : C.sky}"/>`).join('')}
      ${cum.map((v, k) => k % 2 === 0 ? `<text x="${sx(k)}" y="${H - 6}" text-anchor="middle" class="lt">${k}</text>` : '').join('')}</svg>
     <p class="lread">${T(`في أول ${loY} سنوات المستثمر يشوف فلوسه تطلع بس: استثمارات ورسوم. هذا الجزء النازل من حرف J. ولو جاءت التخارجات متأخرة، المنحنى يبقى تحت الصفر أطول.`, `For the first ${loY} years the investor only sees money going out: investments and fees. That is the down-stroke of the J. If exits come late, the curve stays below zero longer.`)}</p>`;
   });
  }
 };

 /* 5. IRR vs TVPI */
 const irr = {
  html: () => `<p class="lintro">${T('صندوقين، كل واحد استثمر 100 مليون ورجّع 250 مليون، يعني نفس المضاعف 2.5x. الفرق الوحيد متى رجعت الفلوس.', 'Two funds each invested $100M and returned $250M: the same 2.5x. The only difference is when the money came back.')}</p>
   <div class="lgrid2"><div class="lctl">${slider('i-a', T('الصندوق الأول: الفلوس رجعت بعد', 'Fund 1: money back after'), 2, 14, 1, 4, 'y')}${slider('i-b', T('الصندوق الثاني: الفلوس رجعت بعد', 'Fund 2: money back after'), 2, 14, 1, 10, 'y')}${slider('i-m', T('المضاعف للاثنين', 'Multiple for both'), 1.2, 5, 0.1, 2.5, 'x')}</div><div class="lout" id="i-out"></div></div>
   <p class="lsrc">${T('الحساب: معدل العائد الداخلي = المضاعف أس (1 ÷ عدد السنوات) ناقص 1، بافتراض دفعة واحدة في البداية ودفعة واحدة في النهاية.', 'Math: IRR = multiple^(1 ÷ years) − 1, assuming one payment in and one payment out.')}</p>`,
  bind(root) {
   wire(root, () => {
    const a = val(root, 'i-a'), b = val(root, 'i-b'), m = val(root, 'i-m');
    const ir = y => Math.pow(m, 1 / y) - 1; const W = 560, H = 220;
    const ys = Array.from({ length: 13 }, (_, k) => k + 2); const mx = Math.max(.6, ir(2));
    const sx = y => 34 + (y - 2) / 12 * (W - 44), sy = v => 12 + (1 - v / mx) * (H - 40);
    root.querySelector('#i-out').innerHTML = `<div class="lbig"><div><b style="color:${C.sky}">${pch(ir(a))}</b><span>IRR ${T('للأول', 'Fund 1')}</span></div><div><b style="color:${C.glow}">${pch(ir(b))}</b><span>IRR ${T('للثاني', 'Fund 2')}</span></div><div><b>${m}x</b><span>TVPI ${T('للاثنين', 'both')}</span></div></div>
     <svg viewBox="0 0 ${W} ${H}" class="lsvg" style="direction:ltr"><polyline points="${ys.map(y => `${sx(y).toFixed(1)},${sy(ir(y)).toFixed(1)}`).join(' ')}" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/>
      <circle cx="${sx(a)}" cy="${sy(ir(a))}" r="8" fill="${C.sky}"/><circle cx="${sx(b)}" cy="${sy(ir(b))}" r="8" fill="${C.glow}"/>
      ${ys.filter(y => y % 2 === 0).map(y => `<text x="${sx(y)}" y="${H - 6}" text-anchor="middle" class="lt">${y}</text>`).join('')}<text x="${W - 10}" y="${H - 22}" text-anchor="end" class="lt">${T('سنوات حتى رجوع الفلوس', 'years until money returns')}</text></svg>
     <p class="lread">${T(`نفس المضاعف ${m}x، لكن الأول عائده السنوي ${pch(ir(a))} والثاني ${pch(ir(b))}. المضاعف يقول كم رجع، والعائد الداخلي يقول بأي سرعة. لهذا يطلب المستثمرون الاثنين، ومعهما DPI: كم رجع فعلًا نقدًا.`, `Same ${m}x, but Fund 1 earns ${pch(ir(a))} a year and Fund 2 ${pch(ir(b))}. The multiple says how much came back; IRR says how fast. That is why investors ask for both, plus DPI: how much came back in cash.`)}</p>`;
   });
  }
 };

 const LABS = { dilution, 'cap-table': dilution, 'pre-post-money': dilution, 'liquidation-preference': liq, 'participating-preferred': liq, 'power-law': power, 'j-curve': jcurve, irr, 'tvpi-dpi': irr };
 window.TMR_LABS = {
  has: id => !!LABS[id],
  html: id => LABS[id] ? `<section class="lab rv" data-lab="${id}"><div class="labh"><span class="labk">${T('جرّبها بنفسك', 'Try it yourself')}</span></div>${LABS[id].html()}</section>` : '',
  bind: id => { const el = document.querySelector(`.lab[data-lab="${id}"]`); if (el && LABS[id]) LABS[id].bind(el); }
 };
})();
