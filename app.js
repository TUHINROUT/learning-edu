/* Aptech Learning Odisha — Platform Demo
   Front-end only demo: data lives in localStorage. See PDF blueprint for the secure production build. */
const KEY = 'aptech_demo_v1';
let DB = load();
const F = { c: 'all' };          // student course filter
const S = { sel: null, q: '', stage: 'all', course: 'all', cid: 'fsd' }; // admin state
let T = null;                    // active test
let PICK = null;                 // course being viewed in onboarding

function seed() {
  return { courses: JSON.parse(JSON.stringify(SEED_COURSES)), users: JSON.parse(JSON.stringify(SEED_USERS)), common: COMMON_Q,
    ...JSON.parse(JSON.stringify(SEED_EXTRA)), session: null };
}
function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.users) return s; } catch (e) {} return seed(); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) {} }

/* ---------- helpers ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = p => p + Math.random().toString(36).slice(2, 9);
const me = () => DB.users.find(u => u.id === DB.session);
const course = id => DB.courses.find(c => c.id === id);
const user = id => DB.users.find(u => u.id === id);
const students = () => DB.users.filter(u => u.role === 'student');
const ini = n => (n || '?').split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase();
const dt = t => new Date(t).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
const dtt = t => new Date(t).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const totalVideos = c => c.modules.reduce((n, m) => n + m.v.length, 0);
const enrolls = uid_ => DB.enrollments.filter(e => e.uid === uid_);
const progress = e => { const c = course(e.courseId); return c ? pct(e.done.length, totalVideos(c)) : 0; };
const attemptsOf = (uid_, type) => DB.attempts.filter(a => a.uid === uid_ && (!type || a.type === type)).sort((a, b) => b.at - a.at);
const band = p => p >= 70 ? { n: 'Advanced starter', lvl: 'Start from Level 2', cls: 'ok' } : p >= 40 ? { n: 'Intermediate', lvl: 'Start from Level 1', cls: 'warn' } : { n: 'Foundation', lvl: 'Start from Level 0 (bridge module)', cls: 'blue' };
const addLog = t => { DB.log.unshift({ id: uid('l'), at: Date.now(), text: t }); };
function toast(t) { const el = document.getElementById('toast'); el.textContent = t; el.classList.add('on'); setTimeout(() => el.classList.remove('on'), 2400); }
const go = h => { location.hash = h; };
const STAGE = { onboarding: 'Welcome', courses: 'Choosing course', interest: 'Course details', assessment: 'Mock pending', review: 'Awaiting review', counselled: 'Counselled', enrolled: 'Enrolled' };
const STAGE_CLS = { onboarding: '', courses: '', interest: '', assessment: 'warn', review: 'warn', counselled: 'blue', enrolled: 'ok' };
const MODE = { online: '💬 Online (in-app)', call: '📞 Phone call', visit: '🏫 Office visit', whatsapp: '🟢 WhatsApp' };

/* ---------- router ---------- */
window.addEventListener('hashchange', render);
function render() {
  const h = location.hash.replace(/^#\/?/, '') || '';
  const [a, b] = h.split('/');
  const u = me();
  const app = document.getElementById('app');
  window.scrollTo(0, 0);
  if (a === 'login') return app.innerHTML = vLogin();
  if (a === 'register') return app.innerHTML = vRegister();
  if (a === 'courses' && !u) return app.innerHTML = vPublicCourses();
  if (a === 'test') { if (!u || !T) return go('/'); return app.innerHTML = vTest(); }
  if (a === 'result') { if (!u || !T || !T.result) return go('/'); return app.innerHTML = vResult(); }
  if (!u) return app.innerHTML = vHome();
  if (u.role === 'admin') return app.innerHTML = vAdmin(a === 'admin' ? (b || 'home') : 'home');
  if (u.stage !== 'enrolled' || a === 'join') {
    if (u.stage === 'enrolled') return app.innerHTML = vStudent(a === 'app' ? (b || 'home') : 'home');
    return app.innerHTML = vJoin();
  }
  return app.innerHTML = vStudent(a === 'app' ? (b || 'home') : 'home');
}

/* ---------- public ---------- */
function nav() {
  return `<div class="nav"><div class="logo" onclick="go('/')"><i>Aptech</i> Learning Odisha</div>
  <div class="links"><a href="#/">Home</a><a href="#/courses">Courses</a><a>Career guidance</a><a>Contact</a></div>
  <div><button class="btn ghost sm" onclick="go('/login')">Login</button> <button class="btn sm" onclick="go('/register')">Register free</button></div></div>`;
}
function courseCard(c, click) {
  return `<div class="card courseCard" ${click ? `onclick="${click}"` : ''}><div class="ico">${c.icon}</div><h3>${esc(c.title)}</h3>
  <p class="mut small" style="margin:6px 0 12px">${esc(c.about)}</p><span class="chip">⏱ ${esc(c.duration)}</span> <span class="chip blue">${esc(c.level)}</span></div>`;
}
function vHome() {
  return nav() + `<div class="banner">Skill is the New Qualification — Lead the Future. Be the first to know about new IT courses!</div>
  <div class="hero"><div><span class="chip warn">India's Leading IT Training · Now with a smart student platform</span>
  <h1 style="margin:16px 0">Make Your Future <span class="y">Mighty</span> in IT.</h1>
  <p class="mut" style="font-size:17px;max-width:520px">Classroom training plus a digital platform: course-wise mock tests, career guidance from Level 0, counsellor review of your mock interview, and your own student dashboard.</p>
  <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap"><button class="btn" onclick="go('/register')">Start as a new student →</button><button class="btn ghost" onclick="go('/login')">I already have an account</button></div></div>
  <div class="art"><b style="font-size:18px">Your journey</b>
  ${['1 · Register & watch the intro', '2 · Explore courses & share your goal', '3 · Take the common mock interview', '4 · Counsellor reviews & calls you', '5 · Course assigned → dashboard unlocks'].map(x => `<div class="mini"><span>${x}</span><span class="y">●</span></div>`).join('')}</div></div>
  <div class="sec"><h2>Our programs <span class="mut small">(classroom / offline)</span></h2><p class="mut" style="margin:6px 0 20px">Training happens at our centre. This platform adds mock tests, guidance and tracking.</p>
  <div class="grid g3">${DB.courses.map(c => courseCard(c, "go('/register')")).join('')}</div></div>`;
}
function vPublicCourses() { return nav() + `<div class="sec"><h2>All courses</h2><div class="grid g3" style="margin-top:18px">${DB.courses.map(c => courseCard(c, "go('/register')")).join('')}</div></div>`; }

function vLogin() {
  return nav() + `<div class="auth"><div class="card"><h2>Welcome back</h2><p class="mut small">Login to your dashboard</p>
  <form onsubmit="return A.login(event)"><label>Email</label><input id="le" type="email" required><label>Password</label><input id="lp" type="password" required>
  <button class="btn" style="margin-top:18px;width:100%;justify-content:center">Login</button></form>
  <div class="demo"><b>Demo accounts (click to fill)</b><br>
  <a href="#" onclick="return A.fill('admin@aptech.demo','admin123')">Admin</a> ·
  <a href="#" onclick="return A.fill('support@aptech.demo','support123')">Support</a> ·
  <a href="#" onclick="return A.fill('ananya@demo.in','demo123')">Student (enrolled)</a> ·
  <a href="#" onclick="return A.fill('rahul@demo.in','demo123')">Student (awaiting review)</a> ·
  <a href="#" onclick="return A.fill('bikash@demo.in','demo123')">Student (2 courses)</a></div></div></div>`;
}
function vRegister() {
  return nav() + `<div class="auth"><div class="card"><h2>Create your account</h2><p class="mut small">Free · takes one minute</p>
  <form onsubmit="return A.register(event)"><label>Full name</label><input id="rn" required><label>Email</label><input id="re" type="email" required>
  <label>Mobile</label><input id="rm" required pattern="[0-9]{10}" placeholder="10-digit number"><label>Password (min 8)</label><input id="rp" type="password" minlength="8" required>
  <label>I am a…</label><select id="rt"><option value="new">New student (exploring courses)</option><option value="existing">Existing Aptech student (need a new course / access)</option></select>
  <button class="btn" style="margin-top:18px;width:100%;justify-content:center">Continue →</button></form>
  <div class="demo">Demo note: passwords are stored in your browser only. Production uses Argon2 hashing + server-side sessions.</div></div></div>`;
}

/* ---------- onboarding (new student journey) ---------- */
function stepsBar(stage) {
  const list = [['onboarding', 'Welcome'], ['courses', 'Courses'], ['interest', 'Your details'], ['assessment', 'Mock interview'], ['review', 'Review'], ['counselled', 'Assigned']];
  const idx = list.findIndex(x => x[0] === stage);
  return `<div class="steps">${list.map((x, i) => `<div class="${i < idx ? 'done' : i === idx ? 'on' : ''}">${i < idx ? '✓ ' : ''}${x[1]}</div>`).join('')}</div>`;
}
function shellTop(u) {
  return `<div class="nav"><div class="logo"><i>Aptech</i> Learning Odisha</div><div><span class="small mut">${esc(u.name)}</span> <button class="btn ghost sm" onclick="A.logout()">Logout</button></div></div>`;
}
function vJoin() {
  const u = me(); const st = u.stage; let body = '';
  if (st === 'onboarding') body = `<h2>Welcome, ${esc(u.name.split(' ')[0])} 👋</h2><p class="mut" style="margin:6px 0 18px">Watch this 2-minute introduction before you explore courses.</p>
    <div class="video" onclick="toast('Demo: intro video plays here (YouTube / Vimeo / self-hosted)')"><div class="play">▶</div><div class="cap">About Aptech Learning Odisha · 2:05</div></div>
    <div class="grid g3" style="margin:22px 0">${[['🏫', 'Classroom training', 'All courses run offline at our centre with expert trainers.'], ['🧪', 'Mock tests & guidance', 'Course-wise tests, level-wise roadmap from zero.'], ['👩‍💼', 'Personal counselling', 'Our team reviews your mock and recommends the right course.']].map(x => `<div class="card"><div class="ico">${x[0]}</div><h3>${x[1]}</h3><p class="mut small">${x[2]}</p></div>`).join('')}</div>
    <button class="btn" onclick="A.stage('courses')">Explore courses →</button>`;
  if (st === 'courses') body = `<h2>Explore our courses</h2><p class="mut" style="margin:6px 0 18px">Open any course to see the roadmap, then tell us about yourself.</p>
    <div class="grid g2">${DB.courses.map(c => courseCard(c, `A.pick('${c.id}')`)).join('')}</div>`;
  if (st === 'interest') { const c = course(PICK || u.interest?.courseId) || DB.courses[0]; const i = u.interest || {};
    body = `<button class="btn ghost sm" onclick="A.stage('courses')">← All courses</button>
    <div class="card" style="margin:16px 0"><div style="display:flex;gap:16px;align-items:center"><div class="ico" style="margin:0">${c.icon}</div><div><h2>${esc(c.title)}</h2><span class="chip">⏱ ${esc(c.duration)}</span> <span class="chip blue">${esc(c.level)}</span></div></div>
    <p class="mut" style="margin:14px 0 6px">${esc(c.about)}</p><b class="small">Your roadmap</b><div class="tl">${c.roadmap.map((r, k) => `<div><i>${k}</i><span>${esc(r)}</span></div>`).join('')}</div></div>
    <div class="card"><h3>Tell us about you</h3><form onsubmit="return A.interest(event,'${c.id}')">
    <div class="row"><div><label>Highest qualification</label><input id="iq" required value="${esc(i.qual || '')}" placeholder="e.g. B.Sc, B.Tech, +2"></div><div><label>College / School</label><input id="ic" required value="${esc(i.college || '')}"></div></div>
    <div class="row"><div><label>Passing year</label><input id="iy" required value="${esc(i.year || '')}" placeholder="2025"></div><div><label>Current experience</label><select id="ie">${['Complete beginner', 'Beginner', 'Some basics', 'Intermediate'].map(x => `<option ${i.exp === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div></div>
    <label>Your career goal</label><textarea id="ig" rows="3" required placeholder="What job / skill do you want?">${esc(i.goal || '')}</textarea>
    <button class="btn" style="margin-top:16px">Save & take the mock interview →</button></form></div>`; }
  if (st === 'assessment') body = `<div class="card" style="text-align:center;padding:40px"><div class="ico" style="margin:0 auto 14px">🎯</div><h2>Common mock interview</h2>
    <p class="mut" style="max-width:480px;margin:10px auto 22px">${DB.common.length} quick questions: aptitude, logic, communication and IT basics. There's no pass/fail — it helps our counsellors place you at the right level.</p>
    <button class="btn" onclick="A.startTest('common')">Start now (≈10 min)</button></div>`;
  if (st === 'review' || st === 'counselled') body = vWaiting(u);
  return shellTop(u) + `<div class="wrap">${stepsBar(st === 'review' || st === 'counselled' ? st : st)}${body}</div>`;
}
function vWaiting(u) {
  const a = attemptsOf(u.id, 'common')[0]; const p = a ? pct(a.score, a.total) : null; const b = p !== null ? band(p) : null;
  const msgs = DB.messages.filter(m => m.uid === u.id).sort((x, y) => x.at - y.at);
  const stepIdx = u.stage === 'counselled' ? 2 : 1;
  const steps = [['Mock interview submitted', a ? dt(a.at) : 'Existing student verification'], ['Counsellor is reviewing your result', 'Usually within 24 hours'], ['Counselling call / visit', 'Our team contacts you'], ['Course assigned → dashboard unlocks', 'You get access to lessons & tests']];
  return `<div class="grid g2"><div class="card"><h2>⏳ Result under review</h2><p class="mut" style="margin:6px 0 16px">Our support team is reviewing your profile${a ? ' and mock result' : ''}. They will contact you and suggest the best course.</p>
  <div class="tl">${steps.map((s, i) => `<div class="${i <= stepIdx - 1 ? 'done' : i === stepIdx ? 'now' : ''}"><i>${i < stepIdx ? '✓' : i + 1}</i><span><b>${s[0]}</b><br><span class="small mut">${s[1]}</span></span></div>`).join('')}</div></div>
  <div class="card">${a ? `<h3>Your provisional result</h3><div class="score" style="--p:${p}"><b>${p}%</b></div><p style="text-align:center"><span class="chip ${b.cls}">${b.n}</span></p><p class="small mut" style="text-align:center;margin-top:6px">${b.lvl}. Final course recommendation comes from your counsellor.</p>` : '<h3>Verification in progress</h3><p class="mut">We are verifying your existing student record.</p>'}</div></div>
  <div class="card" style="margin-top:18px"><h3>Messages from our team</h3>${msgs.length ? msgs.map(m => `<div class="msg ${m.from === 'student' ? 'me' : ''}"><div class="small mut">${m.from === 'admin' ? '👩‍💼 Team' : 'You'} · ${MODE[m.mode] || ''} · ${dtt(m.at)}</div>${esc(m.text)}</div>`).join('') : '<p class="mut small">No messages yet.</p>'}
  <form onsubmit="return A.studentMsg(event)" style="display:flex;gap:10px;margin-top:10px"><input id="sm" placeholder="Write a message to the counsellor…" required><button class="btn">Send</button></form></div>
  ${u.stage === 'review' ? '' : ''}`;
}

/* ---------- test engine ---------- */
function vTest() {
  const q = T.qs[T.i]; const last = T.i === T.qs.length - 1;
  return `<div class="nav"><div class="logo"><i>Aptech</i> ${T.type === 'common' ? 'Common Mock Interview' : esc(course(T.type).title)}</div><button class="btn ghost sm" onclick="A.quit()">Exit</button></div>
  <div class="wrap"><div class="card"><div style="display:flex;justify-content:space-between"><b>Question ${T.i + 1} / ${T.qs.length}</b><span class="chip">${T.type === 'common' ? 'Entry assessment' : 'Course test'}</span></div>
  <div class="bar" style="margin:12px 0 20px"><i style="width:${(T.i) / T.qs.length * 100}%"></i></div>
  <h2 style="font-size:20px;margin-bottom:14px">${esc(q.q)}</h2>
  ${q.o.map((o, k) => `<button class="opt ${T.ans[T.i] === k ? 'sel' : ''}" onclick="A.ans(${k})">${'ABCD'[k]}. ${esc(o)}</button>`).join('')}
  <div style="display:flex;justify-content:space-between;margin-top:18px"><button class="btn ghost" ${T.i === 0 ? 'disabled style="opacity:.4"' : ''} onclick="A.nav(-1)">← Back</button>
  ${last ? `<button class="btn" onclick="A.finish()">Submit</button>` : `<button class="btn dark" onclick="A.nav(1)">Next →</button>`}</div></div></div>`;
}
function vResult() {
  const r = T.result; const p = pct(r.score, r.total); const u = me();
  const review = T.type === 'common' ? '' : `<div class="card" style="margin-top:18px"><h3>Answer review</h3>${T.qs.map((q, i) => `<div style="padding:10px 0;border-bottom:1px solid var(--line)"><b>${i + 1}. ${esc(q.q)}</b><br><span class="small ${T.ans[i] === q.a ? '' : ''}">${T.ans[i] === q.a ? '✅' : '❌'} Your answer: ${esc(q.o[T.ans[i]] ?? '—')}${T.ans[i] === q.a ? '' : ` · Correct: <b>${esc(q.o[q.a])}</b>`}</span></div>`).join('')}</div>`;
  return shellTop(u) + `<div class="wrap"><div class="card" style="text-align:center;padding:36px"><h2>${T.type === 'common' ? 'Mock interview submitted ✅' : 'Test completed'}</h2>
  <div class="score" style="--p:${p}"><b>${r.score}/${r.total}</b></div>
  ${T.type === 'common' ? `<p class="mut" style="max-width:480px;margin:6px auto 14px">Thank you! Your result is now <b>waiting for counsellor review</b>. Our team will contact you and suggest the right course.</p>` : `<p class="mut">Score ${p}% — saved to your results.</p>`}
  <button class="btn" onclick="A.afterResult()">${T.type === 'common' ? 'See my status' : 'Back to dashboard'}</button></div>${review}</div>`;
}

/* ---------- student dashboard ---------- */
const SNAV = [['home', '🏠', 'Overview'], ['courses', '📚', 'My Courses'], ['tests', '🧪', 'Mock Tests'], ['results', '📈', 'Results'], ['guidance', '🧭', 'Career Guidance'], ['messages', '💬', 'Messages'], ['git', '🐙', 'Git Connect'], ['profile', '👤', 'Profile']];
function shell(items, base, page, body, u, title) {
  return `<div class="shell"><aside class="side"><div class="logo"><i>Aptech</i> Odisha</div>
  ${items.map(n => `<a class="${page === n[0] ? 'on' : ''}" href="#/${base}/${n[0]}">${n[1]} ${n[2]}</a>`).join('')}
  <div class="who"><b>${esc(u.name)}</b><br><span class="mut">${u.role === 'admin' ? 'Admin / Support' : 'Student'}</span><br><a style="padding:6px 0;color:var(--y)" onclick="A.logout()">Logout</a><a style="padding:0;font-size:12px" onclick="A.reset()">Reset demo data</a></div></aside>
  <main class="main"><div class="top"><div><h2>${title}</h2></div><span class="chip">${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span></div>${body}</main></div>`;
}
function filterChips(u) {
  const es = enrolls(u.id);
  return `<div class="chips"><span class="chip ${F.c === 'all' ? 'on' : ''}" onclick="A.filter('all')">All courses</span>${es.map(e => `<span class="chip ${F.c === e.courseId ? 'on' : ''}" onclick="A.filter('${e.courseId}')">${course(e.courseId).icon} ${esc(course(e.courseId).title.split(' ').slice(0, 3).join(' '))}</span>`).join('')}</div>`;
}
function vStudent(page) {
  const u = me(); const es = enrolls(u.id).filter(e => F.c === 'all' || e.courseId === F.c); let b = '';
  const T_ = { home: 'Overview', courses: 'My Courses', tests: 'Mock Tests', results: 'Results', guidance: 'Career Guidance', messages: 'Messages', git: 'Git Connect', profile: 'Profile' }[page] || 'Overview';
  if (['home', 'courses', 'tests', 'results', 'guidance'].includes(page)) b += filterChips(u);
  if (page === 'home') {
    const at = attemptsOf(u.id).filter(a => F.c === 'all' || a.type === F.c || a.type === 'common');
    const avg = at.length ? Math.round(at.reduce((s, a) => s + pct(a.score, a.total), 0) / at.length) : 0;
    const prog = es.length ? Math.round(es.reduce((s, e) => s + progress(e), 0) / es.length) : 0;
    const msgs = DB.messages.filter(m => m.uid === u.id).sort((a, b) => b.at - a.at).slice(0, 2);
    const others = DB.courses.filter(c => !enrolls(u.id).some(e => e.courseId === c.id));
    b += `<div class="grid g4"><div class="card kpi"><span>Active courses</span><b>${es.length}</b></div><div class="card kpi"><span>Avg progress</span><b>${prog}%</b></div><div class="card kpi"><span>Tests taken</span><b>${at.length}</b></div><div class="card kpi"><span>Avg score</span><b>${avg}%</b></div></div>
    <div class="grid g2" style="margin-top:18px"><div class="card"><h3>Continue learning</h3>${es.length ? es.map(e => { const c = course(e.courseId); return `<div style="margin:14px 0"><div style="display:flex;justify-content:space-between"><b>${c.icon} ${esc(c.title)}</b><span>${progress(e)}%</span></div><div class="bar" style="margin-top:8px"><i style="width:${progress(e)}%"></i></div></div>`; }).join('') : '<p class="mut">No course in this filter.</p>'}</div>
    <div class="card"><h3>Latest from your team</h3>${msgs.length ? msgs.map(m => `<div class="msg"><div class="small mut">${MODE[m.mode]} · ${dt(m.at)}</div>${esc(m.text)}</div>`).join('') : '<p class="mut">No messages.</p>'}</div></div>
    <div class="card" style="margin-top:18px"><h3>Want another course?</h3><p class="mut small" style="margin:4px 0 12px">Request it — your counsellor will review and assign it to you.</p><div class="grid g3">${others.map(c => `<div class="card lock" style="box-shadow:none"><div class="ico">${c.icon}</div><b>${esc(c.title)}</b><br><button class="btn sm ghost" style="margin-top:10px" onclick="A.request('${c.id}')">🔒 Request access</button></div>`).join('') || '<p class="mut">You have every course 🎉</p>'}</div></div>`;
  }
  if (page === 'courses') b += es.map(e => { const c = course(e.courseId); return `<div class="card" style="margin-bottom:18px"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><h3>${c.icon} ${esc(c.title)}</h3><span class="chip ok">${progress(e)}% complete</span></div>
    <div class="bar" style="margin:10px 0 14px"><i style="width:${progress(e)}%"></i></div>
    ${c.modules.map((m, mi) => `<b class="small mut">MODULE ${mi + 1} · ${esc(m.t)}</b>${m.v.map((v, vi) => { const k = `${c.id}-${mi}-${vi}`; const d = e.done.includes(k); return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)"><span>${d ? '✅' : '▶️'} ${esc(v[0])} <span class="mut small">· ${v[1]} min</span></span><button class="btn sm ${d ? 'ghost' : ''}" onclick="A.toggleVideo('${e.id}','${k}')">${d ? 'Done' : 'Mark watched'}</button></div>`; }).join('')}`).join('')}
    <button class="btn dark" style="margin-top:14px" onclick="A.startTest('${c.id}')">Take ${esc(c.title.split(' ')[0])} mock test →</button></div>`; }).join('') || '<div class="card">No enrolled course for this filter.</div>';
  if (page === 'tests') b += `<div class="grid g2">${es.map(e => { const c = course(e.courseId); const at = attemptsOf(u.id, c.id); return `<div class="card"><div class="ico">${c.icon}</div><h3>${esc(c.title)}</h3><p class="mut small" style="margin:6px 0">${c.questions.length} questions · question bank updated by your trainers</p>
    <p class="small">Attempts: <b>${at.length}</b> · Last: <b>${at[0] ? at[0].score + '/' + at[0].total : '—'}</b></p><button class="btn" style="margin-top:10px" onclick="A.startTest('${c.id}')">Start test</button></div>`; }).join('') || '<div class="card">No tests available.</div>'}</div>`;
  if (page === 'results') {
    const at = attemptsOf(u.id).filter(a => F.c === 'all' || a.type === F.c);
    const rev = at.slice().reverse().slice(-6);
    b += `<div class="card"><h3>Score trend</h3><div class="bars">${rev.map(a => { const p = pct(a.score, a.total); return `<div><span>${p}%</span><i style="height:${p}%"></i><span class="mut">${a.type === 'common' ? 'Mock' : a.type}</span></div>`; }).join('') || '<p class="mut">No attempts yet.</p>'}</div></div>
    <div class="card" style="margin-top:18px"><h3>All attempts</h3><table><tr><th>Date</th><th>Test</th><th>Score</th><th></th></tr>${at.map(a => `<tr><td>${dt(a.at)}</td><td>${a.type === 'common' ? 'Common mock interview' : esc(course(a.type)?.title || a.type)}</td><td><b>${a.score}/${a.total}</b></td><td><span class="chip ${pct(a.score, a.total) >= 60 ? 'ok' : 'warn'}">${pct(a.score, a.total)}%</span></td></tr>`).join('')}</table></div>`;
  }
  if (page === 'guidance') {
    const a = attemptsOf(u.id, 'common')[0]; const bd = a ? band(pct(a.score, a.total)) : null;
    b += (u.review ? `<div class="card" style="margin-bottom:18px;border-left:5px solid var(--y)"><b>👩‍💼 Counsellor note</b><p style="margin-top:6px">${esc(u.review.notes)}</p><span class="small mut">— ${esc(u.review.by)} · ${dt(u.review.at)}${bd ? ' · Entry level: ' + bd.n : ''}</span></div>` : '') +
      es.map(e => { const c = course(e.courseId); const cur = Math.min(c.roadmap.length - 1, Math.floor(progress(e) / 100 * c.roadmap.length)); return `<div class="card" style="margin-bottom:18px"><h3>${c.icon} ${esc(c.title)} — roadmap from zero to job-ready</h3><div class="tl">${c.roadmap.map((r, k) => `<div class="${k < cur ? 'done' : k === cur ? 'now' : ''}"><i>${k < cur ? '✓' : k}</i><span>${esc(r)}${k === cur ? ' <span class="chip warn">You are here</span>' : ''}</span></div>`).join('')}</div></div>`; }).join('') +
      `<div class="card"><h3>Career tips</h3><ul style="margin:10px 0 0 18px;line-height:1.9"><li>Build 2–3 real projects and put them on GitHub (connect it in Git Connect).</li><li>Take the course mock test weekly — track your trend in Results.</li><li>Practice a 60-second self-introduction.</li><li>Ask your counsellor about placement preparation once you reach Level 4.</li></ul></div>`;
  }
  if (page === 'messages') { const ms = DB.messages.filter(m => m.uid === u.id).sort((a, b) => a.at - b.at);
    b += `<div class="card">${ms.map(m => `<div class="msg ${m.from === 'student' ? 'me' : ''}"><div class="small mut">${m.from === 'admin' ? '👩‍💼 Team' : 'You'} · ${MODE[m.mode]} · ${dtt(m.at)}</div>${esc(m.text)}</div>`).join('') || '<p class="mut">No messages yet.</p>'}
    <form onsubmit="return A.studentMsg(event)" style="display:flex;gap:10px;margin-top:14px"><input id="sm" placeholder="Message your counsellor…" required><button class="btn">Send</button></form></div>`; }
  if (page === 'git') {
    const g = u.git; const repos = g ? ['portfolio-site', 'todo-react-app', 'aptech-assignments', 'api-practice'].map((r, i) => [r, ['JavaScript', 'React', 'HTML', 'Node'][i], 3 + i * 4]) : [];
    b += `<div class="card"><h3>🐙 Connect your GitHub</h3><p class="mut small" style="margin:6px 0 14px">Let trainers and counsellors see your projects. Production version uses secure GitHub OAuth with read-only scope — no passwords or tokens are ever typed here.</p>
    ${g ? `<p><span class="chip ok">Connected</span> <b>@${esc(g.user)}</b> <button class="btn danger sm" onclick="A.gitOff()">Disconnect</button></p><table style="margin-top:14px"><tr><th>Repository</th><th>Language</th><th>Commits</th></tr>${repos.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table>` :
      `<form onsubmit="return A.gitOn(event)" style="display:flex;gap:10px;max-width:480px"><input id="gu" placeholder="GitHub username" required><button class="btn dark">Connect (demo)</button></form>`}</div>`;
  }
  if (page === 'profile') { const i = u.interest || {};
    b += `<div class="card"><h3>${esc(u.name)}</h3><p class="mut">${esc(u.email)} · ${esc(u.phone)}</p><div class="grid g2" style="margin-top:14px">${[['Qualification', i.qual], ['College', i.college], ['Passing year', i.year], ['Goal', i.goal], ['Experience', i.exp], ['Joined', dt(u.createdAt)]].map(x => `<div><span class="small mut">${x[0]}</span><br><b>${esc(x[1] || '—')}</b></div>`).join('')}</div></div>`; }
  return shell(SNAV, 'app', page, b, u, T_);
}

/* ---------- admin ---------- */
const ANAV = [['home', '📊', 'Overview'], ['students', '🎓', 'Students'], ['pipeline', '🧭', 'Pipeline'], ['courses', '📚', 'Course Content'], ['messages', '💬', 'Messages'], ['log', '🧾', 'Activity']];
function stageChip(s) { return `<span class="chip ${STAGE_CLS[s] || ''}">${STAGE[s] || s}</span>`; }
function vAdmin(page) {
  const u = me(); const st = students(); let b = '';
  if (page === 'home') {
    const needs = st.filter(s => s.stage === 'review'); const enr = st.filter(s => s.stage === 'enrolled');
    const cm = DB.attempts.filter(a => a.type === 'common'); const avg = cm.length ? Math.round(cm.reduce((s, a) => s + pct(a.score, a.total), 0) / cm.length) : 0;
    const cnt = DB.courses.map(c => [c, DB.enrollments.filter(e => e.courseId === c.id).length]); const mx = Math.max(1, ...cnt.map(x => x[1]));
    b = `<div class="grid g4"><div class="card kpi"><span>Total students</span><b>${st.length}</b></div><div class="card kpi"><span>Awaiting review</span><b style="color:var(--bad)">${needs.length}</b></div><div class="card kpi"><span>Enrolled</span><b>${enr.length}</b></div><div class="card kpi"><span>Avg entry-mock score</span><b>${avg}%</b></div></div>
    <div class="grid g2" style="margin-top:18px"><div class="card"><h3>⚡ Needs your action</h3>${needs.map(s => `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)"><span><span class="av">${ini(s.name)}</span>${esc(s.name)}<br><span class="small mut" style="margin-left:46px">Interested in ${esc(course(s.interest?.courseId)?.title || '—')}</span></span><button class="btn sm" onclick="A.open('${s.id}')">Review</button></div>`).join('') || '<p class="mut">All caught up 🎉</p>'}</div>
    <div class="card"><h3>Enrolments by course</h3><div class="bars">${cnt.map(x => `<div><span>${x[1]}</span><i style="height:${x[1] / mx * 100}%"></i><span class="mut">${x[0].icon}</span></div>`).join('')}</div></div></div>
    <div class="card" style="margin-top:18px"><h3>Recent activity</h3>${DB.log.slice(0, 6).map(l => `<div style="padding:8px 0;border-bottom:1px solid var(--line)"><span class="small mut">${dtt(l.at)}</span> · ${esc(l.text)}</div>`).join('')}</div>`;
  }
  if (page === 'students') b = `<div class="card"><div class="row" style="margin-bottom:12px"><input placeholder="🔎 Search name, email, phone" value="${esc(S.q)}" oninput="A.search(this.value)"><select onchange="S.stage=this.value;A.stTable()"><option value="all">All stages</option>${Object.keys(STAGE).map(k => `<option value="${k}" ${S.stage === k ? 'selected' : ''}>${STAGE[k]}</option>`).join('')}</select><select onchange="S.course=this.value;A.stTable()"><option value="all">All courses</option>${DB.courses.map(c => `<option value="${c.id}" ${S.course === c.id ? 'selected' : ''}>${esc(c.title)}</option>`).join('')}</select></div><div id="stbl" style="overflow:auto">${stTable()}</div></div>`;
  if (page === 'pipeline') { const cols = { Registered: ['onboarding', 'courses', 'interest'], 'Mock pending': ['assessment'], 'Awaiting review': ['review'], Counselled: ['counselled'], Enrolled: ['enrolled'] };
    b = `<div class="kan">${Object.entries(cols).map(([n, ss]) => { const l = st.filter(s => ss.includes(s.stage)); return `<div class="col"><h4>${n} · ${l.length}</h4>${l.map(s => `<div class="it" onclick="A.open('${s.id}')"><b>${esc(s.name)}</b><br><span class="mut">${esc(course(s.interest?.courseId)?.title.split(' ').slice(0, 3).join(' ') || 'No course yet')}</span></div>`).join('')}</div>`; }).join('')}</div>`; }
  if (page === 'courses') { const c = course(S.cid);
    b = `<div class="chips">${DB.courses.map(x => `<span class="chip ${S.cid === x.id ? 'on' : ''}" onclick="S.cid='${x.id}';render()">${x.icon} ${esc(x.title.split(' ').slice(0, 3).join(' '))}</span>`).join('')}</div>
    <div class="grid g2"><div class="card"><h3>${c.icon} Modules & videos <span class="chip">${totalVideos(c)} lessons</span></h3>${c.modules.map((m, mi) => `<div style="margin:12px 0"><b>${esc(m.t)}</b>${m.v.map(v => `<div class="small" style="padding:6px 0;border-bottom:1px solid var(--line)">▶ ${esc(v[0])} · ${v[1]} min</div>`).join('')}</div>`).join('')}
    <form onsubmit="return A.addVideo(event)"><label>Upload new lesson (demo: title only)</label><div class="row"><select id="vm">${c.modules.map((m, i) => `<option value="${i}">${esc(m.t)}</option>`).join('')}</select><input id="vt" placeholder="Lesson title" required><input id="vd" type="number" placeholder="Minutes" value="30"></div><button class="btn dark sm" style="margin-top:10px">+ Publish lesson</button></form>
    <p class="demo">Students enrolled in this course see it instantly on their dashboard.</p></div>
    <div class="card"><h3>🧪 Question bank <span class="chip">${c.questions.length} questions</span></h3><div style="max-height:260px;overflow:auto">${c.questions.map((q, i) => `<div class="small" style="padding:7px 0;border-bottom:1px solid var(--line)">${i + 1}. ${esc(q.q)} <span class="chip ok">${esc(q.o[q.a])}</span></div>`).join('')}</div>
    <form onsubmit="return A.addQ(event)"><label>Add question</label><input id="qq" placeholder="Question" required><div class="row" style="margin-top:8px"><input id="o0" placeholder="Option A" required><input id="o1" placeholder="Option B" required><input id="o2" placeholder="Option C" required><input id="o3" placeholder="Option D" required></div><label>Correct option</label><select id="qa"><option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option></select><button class="btn dark sm" style="margin-top:10px">+ Add to bank</button></form></div></div>`; }
  if (page === 'messages') { const th = students().map(s => [s, DB.messages.filter(m => m.uid === s.id).sort((a, b) => b.at - a.at)[0]]).filter(x => x[1]).sort((a, b) => b[1].at - a[1].at);
    b = `<div class="card">${th.map(([s, m]) => `<div class="hov" style="display:flex;gap:12px;align-items:center;padding:14px 0;border-bottom:1px solid var(--line);cursor:pointer" onclick="A.open('${s.id}')"><span class="av">${ini(s.name)}</span><div style="flex:1"><b>${esc(s.name)}</b> ${m.from === 'student' ? '<span class="chip bad">New reply</span>' : ''}<br><span class="small mut">${MODE[m.mode]} · ${esc(m.text.slice(0, 90))}</span></div><span class="small mut">${dt(m.at)}</span></div>`).join('') || '<p class="mut">No messages.</p>'}</div>`; }
  if (page === 'log') b = `<div class="card">${DB.log.map(l => `<div style="padding:10px 0;border-bottom:1px solid var(--line)"><span class="small mut">${dtt(l.at)}</span> · ${esc(l.text)}</div>`).join('')}</div>`;
  const titles = { home: 'Admin Overview', students: 'Students', pipeline: 'Student Pipeline', courses: 'Course Content & Question Bank', messages: 'Messages', log: 'Activity Log' };
  return shell(ANAV, 'admin', page, b, u, titles[page]) + (S.sel ? vDrawer(S.sel) : '');
}
function stTable() {
  const q = S.q.toLowerCase();
  const l = students().filter(s => (S.stage === 'all' || s.stage === S.stage) && (S.course === 'all' || enrolls(s.id).some(e => e.courseId === S.course) || s.interest?.courseId === S.course) && (!q || (s.name + s.email + s.phone).toLowerCase().includes(q)));
  return `<table><tr><th>Student</th><th>Stage</th><th>Interested</th><th>Enrolled</th><th>Entry mock</th></tr>${l.map(s => { const a = attemptsOf(s.id, 'common')[0]; return `<tr class="hov" onclick="A.open('${s.id}')"><td><span class="av">${ini(s.name)}</span><b>${esc(s.name)}</b><br><span class="small mut" style="margin-left:46px">${esc(s.email)}</span></td><td>${stageChip(s.stage)}</td><td class="small">${esc(course(s.interest?.courseId)?.title.split(' ').slice(0, 3).join(' ') || '—')}</td><td>${enrolls(s.id).map(e => course(e.courseId).icon).join(' ') || '—'}</td><td>${a ? `<b>${pct(a.score, a.total)}%</b>` : '—'}</td></tr>`; }).join('') || '<tr><td colspan="5" class="mut">No students match.</td></tr>'}</table>`;
}
function vDrawer(id) {
  const s = user(id); if (!s) return ''; const i = s.interest || {}; const a = attemptsOf(s.id, 'common')[0]; const p = a ? pct(a.score, a.total) : null; const b = p !== null ? band(p) : null;
  const ms = DB.messages.filter(m => m.uid === s.id).sort((x, y) => x.at - y.at); const es = enrolls(s.id);
  return `<div class="scrim" onclick="A.close()"></div><div class="drawer"><div style="display:flex;justify-content:space-between;align-items:center"><div><span class="av">${ini(s.name)}</span><b style="font-size:18px">${esc(s.name)}</b></div><button class="btn ghost sm" onclick="A.close()">✕</button></div>
  <p class="small mut" style="margin:8px 0">${esc(s.email)} · ${esc(s.phone)} · ${s.type === 'existing' ? 'Existing student' : 'New student'} · ${stageChip(s.stage)}</p>
  <div class="card" style="box-shadow:none;margin:12px 0"><b>Profile</b><div class="small" style="margin-top:6px;line-height:1.9">🎓 ${esc(i.qual || '—')} · ${esc(i.college || '')} (${esc(i.year || '')})<br>🎯 ${esc(i.goal || '—')}<br>⭐ ${esc(i.exp || '—')} · Wants: <b>${esc(course(i.courseId)?.title || '—')}</b><br>🐙 Git: ${s.git ? '@' + esc(s.git.user) : 'not connected'}</div></div>
  <div class="card" style="box-shadow:none;margin:12px 0"><b>Entry mock interview</b>${a ? `<p style="margin-top:6px"><b style="font-size:24px">${p}%</b> (${a.score}/${a.total}) <span class="chip ${b.cls}">${b.n}</span><br><span class="small mut">Suggested: ${b.lvl}</span></p>` : '<p class="small mut" style="margin-top:6px">Not taken yet.</p>'}</div>
  <div class="card" style="box-shadow:none;margin:12px 0"><b>Enrolled courses</b>${es.map(e => `<div class="small" style="padding:6px 0">${course(e.courseId).icon} ${esc(course(e.courseId).title)} · ${progress(e)}% · by ${esc(e.by)}</div>`).join('') || '<p class="small mut">None yet.</p>'}</div>
  <div class="card" style="box-shadow:none;margin:12px 0"><b>Review & assign course</b>
  <label>Counsellor notes</label><textarea id="rv" rows="3" placeholder="Strengths, level, advice…">${esc(s.review?.notes || '')}</textarea>
  <label>Assign course</label><select id="rc">${DB.courses.map(c => `<option value="${c.id}" ${c.id === (s.review?.recommended || i.courseId) ? 'selected' : ''} ${es.some(e => e.courseId === c.id) ? 'disabled' : ''}>${esc(c.title)}${es.some(e => e.courseId === c.id) ? ' (already assigned)' : ''}</option>`).join('')}</select>
  <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap"><button class="btn ghost sm" onclick="A.saveReview('${s.id}')">Save review</button><button class="btn sm" onclick="A.assign('${s.id}')">✅ Assign course now</button></div></div>
  <div class="card" style="box-shadow:none;margin:12px 0"><b>Contact student</b>${ms.map(m => `<div class="msg ${m.from === 'student' ? '' : 'me'}"><div class="small mut">${m.from === 'student' ? esc(s.name) : 'Team'} · ${MODE[m.mode]} · ${dtt(m.at)}</div>${esc(m.text)}</div>`).join('')}
  <label>Channel</label><select id="am">${Object.entries(MODE).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select><label>Message</label><textarea id="at" rows="2" placeholder="e.g. We'll call you tomorrow 11 AM…"></textarea>
  <button class="btn dark sm" style="margin-top:10px" onclick="A.adminMsg('${s.id}')">Send</button></div></div>`;
}

/* ---------- actions ---------- */
const A = {
  fill(e, p) { document.getElementById('le').value = e; document.getElementById('lp').value = p; return false; },
  login(ev) { ev.preventDefault(); const e = le.value.trim().toLowerCase(), p = lp.value; const u = DB.users.find(x => x.email === e && x.pass === p);
    if (!u) { toast('Wrong email or password'); return false; } DB.session = u.id; save(); go(u.role === 'admin' ? '/admin/home' : (u.stage === 'enrolled' ? '/app/home' : '/join')); render(); return false; },
  register(ev) { ev.preventDefault(); const e = re.value.trim().toLowerCase();
    if (DB.users.some(x => x.email === e)) { toast('Email already registered'); return false; }
    const u = { id: uid('u_'), role: 'student', name: rn.value.trim(), email: e, pass: rp.value, phone: rm.value, type: rt.value, stage: rt.value === 'existing' ? 'review' : 'onboarding', createdAt: Date.now(), interest: null, git: null };
    DB.users.push(u); DB.session = u.id; addLog(`${u.name} registered as ${u.type} student`);
    if (u.type === 'existing') DB.messages.push({ id: uid('m'), uid: u.id, from: 'student', mode: 'online', text: 'I am an existing Aptech student. Please verify me and assign my course.', at: Date.now() });
    save(); go('/join'); render(); return false; },
  logout() { DB.session = null; T = null; S.sel = null; save(); go('/'); render(); },
  reset() { if (confirm('Reset all demo data?')) { localStorage.removeItem(KEY); DB = seed(); save(); go('/'); render(); } },
  stage(s) { const u = me(); u.stage = s; save(); render(); },
  pick(id) { PICK = id; const u = me(); u.interest = { ...(u.interest || {}), courseId: id }; u.stage = 'interest'; save(); render(); },
  interest(ev, cid) { ev.preventDefault(); const u = me(); u.interest = { courseId: cid, qual: iq.value, college: ic.value, year: iy.value, goal: ig.value, exp: ie.value }; u.stage = 'assessment'; addLog(`${u.name} chose ${course(cid).title}`); save(); render(); return false; },
  startTest(type) { const qs = type === 'common' ? DB.common : course(type).questions; T = { type, qs, i: 0, ans: [], result: null }; go('/test'); },
  ans(k) { T.ans[T.i] = k; render(); },
  nav(d) { T.i = Math.max(0, Math.min(T.qs.length - 1, T.i + d)); render(); },
  quit() { T = null; const u = me(); go(u.stage === 'enrolled' ? '/app/tests' : '/join'); },
  finish() { if (T.ans.filter(x => x !== undefined).length < T.qs.length && !confirm('Some questions are unanswered. Submit anyway?')) return;
    const u = me(); const score = T.qs.reduce((s, q, i) => s + (T.ans[i] === q.a ? 1 : 0), 0);
    T.result = { score, total: T.qs.length }; DB.attempts.push({ id: uid('a'), uid: u.id, type: T.type, score, total: T.qs.length, at: Date.now() });
    if (T.type === 'common') { u.stage = 'review'; addLog(`${u.name} completed the common mock interview (${score}/${T.qs.length})`); } else addLog(`${u.name} took ${course(T.type).title} test (${score}/${T.qs.length})`);
    save(); go('/result'); },
  afterResult() { const t = T.type; T = null; go(t === 'common' ? '/join' : '/app/results'); render(); },
  filter(c) { F.c = c; render(); },
  toggleVideo(eid, k) { const e = DB.enrollments.find(x => x.id === eid); e.done = e.done.includes(k) ? e.done.filter(x => x !== k) : [...e.done, k]; save(); render(); },
  request(cid) { const u = me(); DB.messages.push({ id: uid('m'), uid: u.id, from: 'student', mode: 'online', text: `I would like to join: ${course(cid).title}`, at: Date.now() }); addLog(`${u.name} requested ${course(cid).title}`); save(); toast('Request sent to your counsellor'); },
  studentMsg(ev) { ev.preventDefault(); const u = me(); DB.messages.push({ id: uid('m'), uid: u.id, from: 'student', mode: 'online', text: sm.value, at: Date.now() }); save(); render(); return false; },
  gitOn(ev) { ev.preventDefault(); me().git = { user: gu.value.trim() }; addLog(`${me().name} connected GitHub`); save(); toast('GitHub connected (demo)'); render(); return false; },
  gitOff() { me().git = null; save(); render(); },
  /* admin */
  open(id) { S.sel = id; if (!location.hash.startsWith('#/admin')) go('/admin/students'); render(); },
  close() { S.sel = null; render(); },
  search(v) { S.q = v; A.stTable(); },
  stTable() { const el = document.getElementById('stbl'); if (el) el.innerHTML = stTable(); },
  saveReview(id) { const s = user(id); s.review = { notes: rv.value, recommended: rc.value, by: me().name, at: Date.now() }; if (s.stage === 'review') s.stage = 'counselled'; addLog(`${me().name} reviewed ${s.name}`); save(); toast('Review saved'); render(); },
  assign(id) { const s = user(id); const cid = rc.value; if (enrolls(id).some(e => e.courseId === cid)) return toast('Already assigned');
    s.review = { notes: rv.value || s.review?.notes || '', recommended: cid, by: me().name, at: Date.now() };
    DB.enrollments.push({ id: uid('e'), uid: id, courseId: cid, at: Date.now(), by: me().name, done: [] }); s.stage = 'enrolled';
    DB.messages.push({ id: uid('m'), uid: id, from: 'admin', mode: 'online', text: `Great news! ${course(cid).title} has been assigned to you. Your dashboard is now unlocked.`, at: Date.now() });
    addLog(`${me().name} assigned ${course(cid).title} to ${s.name}`); save(); toast('Course assigned — student dashboard unlocked'); render(); },
  adminMsg(id) { if (!at.value.trim()) return toast('Write a message first'); DB.messages.push({ id: uid('m'), uid: id, from: 'admin', mode: am.value, text: at.value, at: Date.now() }); addLog(`${me().name} contacted ${user(id).name} via ${am.value}`); save(); toast('Sent'); render(); },
  addVideo(ev) { ev.preventDefault(); course(S.cid).modules[+vm.value].v.push([vt.value, +vd.value || 30]); addLog(`Lesson published: ${vt.value}`); save(); toast('Lesson published to enrolled students'); render(); return false; },
  addQ(ev) { ev.preventDefault(); course(S.cid).questions.push({ q: qq.value, o: [o0.value, o1.value, o2.value, o3.value], a: +qa.value }); save(); toast('Question added to bank'); render(); return false; }
};
window.A = A; window.go = go; window.toast = toast; window.S = S; window.render = render;
if (!location.hash) location.hash = '/';
render();
