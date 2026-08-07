var paths = [
  {
    id: 'p1', title: 'مسیر رهبر تیمی', goal: 'مدیر الهام‌بخش و مؤثر',
    steps: [
      { type: 'دوره', name: 'مهارت‌های ارتباطی موثر', link: 'courses.html' },
      { type: 'آزمون', name: 'ارزیابی سبک رهبری', link: 'assessments.html' },
      { type: 'دوره', name: 'رهبری تیمی در سازمان', link: 'courses.html' },
      { type: 'کتاب', name: 'رهبران آخر غذا می‌خورند', link: 'library.html' },
      { type: 'Agent', name: 'کوچ رهبری', link: 'agents.html' },
      { type: 'تمرین', name: 'پروژه عملی تیم', link: null }
    ]
  },
  {
    id: 'p2', title: 'مسیر متخصص منابع انسانی', goal: 'چرخه مدیریت استعداد',
    steps: [
      { type: 'دوره', name: 'مدیریت عملکرد کارکنان', link: 'courses.html' },
      { type: 'کتاب', name: 'منابع مطالعاتی HR', link: 'library.html' },
      { type: 'آزمون', name: 'ارزیابی دانش HR', link: 'assessments.html' },
      { type: 'Agent', name: 'مشاور HR', link: 'agents.html' },
      { type: 'دوره', name: 'کوچینگ برای مدیران', link: 'courses.html' }
    ]
  },
  {
    id: 'p3', title: 'مسیر توسعه فردی پایه', goal: 'خودآگاهی و مهارت نرم',
    steps: [
      { type: 'آزمون', name: 'خودارزیابی مهارت نرم', link: 'assessments.html' },
      { type: 'دوره', name: 'هوش هیجانی در محیط کار', link: 'courses.html' },
      { type: 'دوره', name: 'تفکر انتقادی و حل مسئله', link: 'courses.html' },
      { type: 'Agent', name: 'مربی توسعه فردی', link: 'agents.html' }
    ]
  },
  {
    id: 'p4', title: 'مسیر ارتباط مؤثر', goal: 'گفتگوهای سخت را حرفه‌ای مدیریت کنید',
    steps: [
      { type: 'دوره', name: 'مهارت‌های ارتباطی موثر', link: 'courses.html' },
      { type: 'Agent', name: 'تحلیلگر بازخورد', link: 'agents.html' },
      { type: 'آزمون', name: 'خودارزیابی مهارت نرم', link: 'assessments.html' },
      { type: 'تمرین', name: 'یک بازخورد واقعی بنویسید', link: null }
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
      (pct >= 100 ? ' <span class="badge badge-green">تکمیل</span>' : '') +
      '<h2>' + p.title + '</h2><p class="muted">' + p.goal + '</p>' +
      (pct ? '<div class="progress-bar" style="margin-top:10px;max-width:260px"><span style="width:' + pct + '%"></span></div>' : '') +
      '</div><button class="btn btn-primary" onclick="openPath(\'' + p.id + '\')">مشاهده</button></div>';
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
    var current = i === step;
    var link = s.link ? ' <a href="' + s.link + '" style="color:#1d4ed8;font-size:.85rem">باز کردن ←</a>' : '';
    return '<li style="margin:10px 0;padding:8px;border-radius:8px;background:' + (current ? '#eff6ff' : 'transparent') + '">' +
      (done ? '✓ ' : (current ? '→ ' : '')) +
      '<span class="badge">' + s.type + '</span> <strong>' + s.name + '</strong>' + link + '</li>';
  }).join('');
  document.getElementById('pBar').style.width = pct + '%';
  document.getElementById('pPct').textContent = pct + '٪ · ' +
    (step < activePath.steps.length ? 'مرحله بعد: ' + activePath.steps[step].name : 'مسیر تمام شد');
  var btn = document.getElementById('pBtn');
  btn.textContent = step === 0 ? 'شروع مسیر' : (step >= activePath.steps.length ? 'تکمیل شد ✓' : 'علامت‌گذاری مرحله فعلی');
  btn.disabled = step >= activePath.steps.length;
  document.getElementById('pathModal').classList.remove('hidden');
}

function startPath() {
  if (!activePath) return;
  var prog = getStore('aryaz_paths', {}) || {};
  var cur = prog[activePath.id] ? prog[activePath.id].step : 0;
  if (cur >= activePath.steps.length) { toast('مسیر تکمیل شده'); return; }
  cur++;
  prog[activePath.id] = { step: cur, title: activePath.title };
  setStore('aryaz_paths', prog);
  addActivity('مسیر «' + activePath.title + '»: ' + cur + '/' + activePath.steps.length);
  toast(cur >= activePath.steps.length ? 'مسیر تکمیل شد!' : 'مرحله ثبت شد');
  openPath(activePath.id);
  renderPaths();
}

document.addEventListener('DOMContentLoaded', renderPaths);
