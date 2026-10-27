/* The Morning Round — optional accounts (Firebase Auth + Firestore).
   Does nothing unless window.TMR_FB holds a Firebase web config. */
(function () {
 const V = '10.12.2', B = `https://www.gstatic.com/firebasejs/${V}/`;
 let fb = null, user = null, profile = null, timer = null, ready = false;
 const H = window.TMR_HOOKS = window.TMR_HOOKS || {};
 const T = (a, e) => (window.TMR_EN && window.TMR_EN() ? e : a);
 function mergeState(a, b) {
  const out = Object.assign({}, a);
  ['days', 'read', 'known', 'saved'].forEach(k => { out[k] = [...new Set([...(a[k] || []), ...(b[k] || [])])]; });
  const hl = [...(a.hl || [])]; (b.hl || []).forEach(h => { if (!hl.some(x => x.a === h.a && x.t === h.t)) hl.push(h); }); out.hl = hl;
  ['readAt', 'knownAt'].forEach(k => { out[k] = Object.assign({}, b[k] || {}); Object.entries(a[k] || {}).forEach(([i, d]) => { if (!out[k][i] || d < out[k][i]) out[k][i] = d; }); });
  ['knownFrom', 'pick'].forEach(k => { out[k] = Object.assign({}, b[k] || {}, a[k] || {}); });
  out.pos = Object.assign({}, b.pos || {}); Object.entries(a.pos || {}).forEach(([i, p]) => { const q = out.pos[i]; if (!q || (p.d || '') >= (q.d || '')) out.pos[i] = p; });
  return out;
 }
 async function load() {
  const [app, auth, fs] = await Promise.all([import(B + 'firebase-app.js'), import(B + 'firebase-auth.js'), import(B + 'firebase-firestore.js')]);
  const a = app.initializeApp(window.TMR_FB); fb = { auth: auth.getAuth(a), db: fs.getFirestore(a), A: auth, F: fs };
  auth.onAuthStateChanged(fb.auth, async u => {
   user = u; profile = null;
   if (u) {
    const ref = fs.doc(fb.db, 'users', u.uid); const snap = await fs.getDoc(ref);
    const remote = snap.exists() ? snap.data() : {}; profile = { name: remote.name || u.displayName || '' };
    const merged = mergeState(H.getState(), remote.st || {}); H.setState(merged);
    const doc = { st: merged, updated: fs.serverTimestamp() }; if (profile.name) doc.name = profile.name; await fs.setDoc(ref, doc, { merge: true });
   }
   ready = true; H.refresh && H.refresh();
  });
  H.refresh && H.refresh();
 }
 function push() { if (!user || !fb) return; clearTimeout(timer); timer = setTimeout(() => { fb.F.setDoc(fb.F.doc(fb.db, 'users', user.uid), { st: H.getState(), updated: fb.F.serverTimestamp() }, { merge: true }).catch(() => {}); }, 1500); }
 function modal() {
  const el = document.createElement('div'); el.className = 'authm';
  el.innerHTML = `<div class="authp"><button class="ax" aria-label="close">×</button><h3>${T('سجّل دخولك', 'Sign in')}</h3><p>${T('حسابك يحفظ تقدمك ويلحقك على أي جهاز: المقالات اللي خلصتها، ومفاهيمك، ومحفوظاتك. كل حساب مستقل تمامًا.', 'Your account keeps your progress on any device: articles finished, concepts, saved items. Every account is fully separate.')}</p>
   <button class="btn agoogle">${T('الدخول بحساب Google', 'Continue with Google')}</button>
   <div class="aor">${T('أو بالإيميل', 'or with email')}</div>
   <input class="ain" id="a-name" placeholder="${T('اسمك (للحساب الجديد)', 'Your name (new account)')}">
   <input class="ain" id="a-mail" type="email" placeholder="${T('الإيميل', 'Email')}" dir="ltr"><input class="ain" id="a-pass" type="password" placeholder="${T('كلمة السر (6 أحرف أو أكثر)', 'Password (6+ characters)')}" dir="ltr">
   <div class="arow"><button class="btn2" id="a-in">${T('دخول', 'Sign in')}</button><button class="btn2" id="a-up">${T('حساب جديد', 'Create account')}</button></div><p class="aerr" id="a-err"></p>
   <p class="apriv">${T('نحفظ اسمك وإيميلك وتقدمك في القراءة فقط، ولا نشاركها مع أحد. وتقدر تحذف حسابك متى ما تبي من القائمة.', 'We keep only your name, email and reading progress, and never share them. You can delete your account any time from the menu.')}</p></div>`;
  document.body.appendChild(el);
  const close = () => el.remove(); el.querySelector('.ax').onclick = close; el.onclick = e => { if (e.target === el) close(); };
  const err = m => { el.querySelector('#a-err').textContent = m; };
  const msg = e => ({ 'auth/invalid-credential': T('الإيميل أو كلمة السر غلط.', 'Wrong email or password.'), 'auth/email-already-in-use': T('هذا الإيميل له حساب، سجّل دخول.', 'This email already has an account; sign in.'), 'auth/weak-password': T('كلمة السر قصيرة.', 'Password too short.'), 'auth/invalid-email': T('الإيميل غير صحيح.', 'Invalid email.') })[e.code] || T('ما قدرنا نكمل، جرّب مرة ثانية.', 'Could not continue; try again.');
  el.querySelector('.agoogle').onclick = async () => { try { await fb.A.signInWithPopup(fb.auth, new fb.A.GoogleAuthProvider()); close(); } catch (e) { err(msg(e)); } };
  el.querySelector('#a-in').onclick = async () => { try { await fb.A.signInWithEmailAndPassword(fb.auth, el.querySelector('#a-mail').value.trim(), el.querySelector('#a-pass').value); close(); } catch (e) { err(msg(e)); } };
  el.querySelector('#a-up').onclick = async () => { const name = el.querySelector('#a-name').value.trim(); if (!name) return err(T('اكتب اسمك أول.', 'Enter your name first.')); try { const c = await fb.A.createUserWithEmailAndPassword(fb.auth, el.querySelector('#a-mail').value.trim(), el.querySelector('#a-pass').value); await fb.A.updateProfile(c.user, { displayName: name }); await fb.F.setDoc(fb.F.doc(fb.db, 'users', c.user.uid), { name }, { merge: true }); profile = { name }; H.setState && push(); close(); H.refresh && H.refresh(); } catch (e) { err(msg(e)); } };
 }
 async function remove() {
  if (!user || !confirm(T('متأكد تبي تحذف حسابك وكل تقدمك المحفوظ فيه؟', 'Delete your account and all saved progress?'))) return;
  try { await fb.F.deleteDoc(fb.F.doc(fb.db, 'users', user.uid)); await fb.A.deleteUser(user); } catch (e) { alert(T('لأمان حسابك، سجّل خروج ثم دخول ثم احذف.', 'For security, sign out, sign in again, then delete.')); }
 }
 window.TMR_AUTH = {
  on: () => !!fb,
  ready: () => ready, user: () => user, name: () => (profile && profile.name) || (user && user.displayName) || '',
  open: () => fb && modal(), out: () => fb && fb.A.signOut(fb.auth), remove, push
 };
 if (window.TMR_FB) load().catch(e => console.warn('auth off', e));
})();
