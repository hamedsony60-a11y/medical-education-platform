var paths = [
  {
    id: 'p1',
    title: 'مسیر رهبر تیمی',
    goal: 'تبدیل شدن به مدیر الهام‌بخش و موثر',
    steps: [
      { type: 'دوره', name: 'مهارت‌های ارتباطی موثر' },
      { type: 'آزمون', name: 'ارزیابی سبک رهبری' },
      { type: 'دوره', name: 'رهبری تیمی در سازمان' },
      { type: 'کتاب', name: 'رهبران آخر غذا می‌خورند' },
      { type: 'Agent', name: 'کوچ رهبری' },
      { type: 'تمرین', name: 'پروژه عملی تیم' }
    ]
  },
  {
    id: 'p2',
    title: 'مسیر متخصص منابع انسانی',
    goal: 'تسلط بر چرخه مدیریت استعداد',
    steps: [
      { type: 'دوره', name: 'مدیریت عملکرد کارکنان' },
      { type: 'کتاب', name: 'HRBP در عمل' },
      { type: 'آزمون', name: 'ارزیابی دانش HR' },
      { type: 'ابزار', name: 'چک‌لیست جذب' },
      { type: 'دوره', name: 'کوچینگ برای مدیران' }
    ]
  },
  {
    id: 'p3',
    title: 'مسیر توسعه فردی پایه',
    goal: 'تقویت خودآگاهی و مهارت‌های نرم',
    steps: [
      { type: 'آزمون', name: 'خودارزیابی مهارت نرم' },
      { type: 'دوره', name: 'هوش هیجانی در محیط کار' },
      { type: 'دوره', name: 'تفکر انتقادی و حل مسئله' },
      { type: 'Agent', name: 'مربی توسعه فردی' }
    ]
  }
];
var activePath = null;

function renderPaths() {
  var prog = getStore('aryaz_paths', {}) || {};
  document.getElementById('pathList').innerHTML = paths.map(function (p) {
    var step = prog[p.id] ? prog[p.id].step : 0;
    var pct = Math.round((step / p.steps.length) * 100);
    return '<div class="card list-item"><div>' +
      '<span class="badge">' + p.steps.length + ' مرحله</span>' +
      '<h2>' + p.title + '</h2>' +
      '<p class="muted">' + p.goal + '</p>' +
      (pct ? '<div class="progress-bar" style="margin-top:10px;max-width:240px"><span style="width:' + pct + '%"></span></div>' : '') +
      '</div><button class="btn btn-primary" onclick="openPath(\'' + p.id + '\')">مشاهده مسیر</button></div>';
  }).join('');
}

function openPath(id) {
  activePath = paths.find(function (p) { return p.id === id; });
  if (!activePath) return;
  var prog = getStore('aryaz_paths', {}) || {};
  var step = prog[id] ? prog[id].step : 0;
  var pct = Math.round((step / activePath.steps.length) * 100);
  document.getElementById('pTitle').textContent = activePath.title;
  document.getElementById('pGoal').textContent = 'هدف: ' + activePath.goal;
  document.getElementById('pSteps').innerHTML = activePath.steps.map(function (s, i) {
    var done = i < step;
    return '<li style="margin:8px 0;opacity:' + (done ? '0.6' : '1') + '">' +
      (done ? '✓ ' : (i === step ? '→ ' : '')) +
      '<span class="badge">' + s.type + '</span> ' + s.name + '</li>';
  }).join('');
  document.getElementById('pBar').style.width = pct + '%';
  document.getElementById('pPct').textContent = pct + '٪ تکمیل · مرحله بعد: ' +
    (step < activePath.steps.length ? activePath.steps[step].name : 'پایان مسیر');
  document.getElementById('pBtn').textContent = step === 0 ? 'شروع مسیر' : (step >= activePath.steps.length ? 'مسیر تکمیل شد ✓' : 'ادامه از محل توقف');
  document.getElementById('pathModal').classList.remove('hidden');
}

function startPath() {
  if (!activePath) return;
  var prog = getStore('aryaz_paths', {}) || {};
  var cur = prog[activePath.id] ? prog[activePath.id].step : 0;
  if (cur >= activePath.steps.length) { toast('مسیر قبلاً تکمیل شده'); return; }
  cur++;
  prog[activePath.id] = { step: cur, title: activePath.title };
  setStore('aryaz_paths', prog);
  addActivity('مسیر «' + activePath.title + '»: مرحله ' + cur + '/' + activePath.steps.length);
  toast(cur >= activePath.steps.length ? 'مسیر تکمیل شد!' : 'مرحله ثبت شد');
  openPath(activePath.id);
  renderPaths();
}

document.addEventListener('DOMContentLoaded', renderPaths);
