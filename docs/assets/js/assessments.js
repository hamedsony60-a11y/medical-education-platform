var assessments = [
  {
    id: 'a1', title: 'خودارزیابی مهارت‌های نرم', type: 'ترکیبی',
    questions: [
      { type: 'mc', q: 'در تعارض تیمی معمولاً چه می‌کنید؟', options: ['اجتناب', 'مذاکره برد-برد', 'تحمیل نظر', 'ارجاع فوری به مدیر'], answer: 1 },
      { type: 'likert', q: 'چقدر در گوش دادن فعال مهارت دارید؟', options: ['خیلی کم', 'کم', 'متوسط', 'زیاد', 'خیلی زیاد'] },
      { type: 'mc', q: 'بازخورد مؤثر بیشتر بر کدام متمرکز است؟', options: ['شخصیت', 'رفتار قابل مشاهده', 'شایعه', 'مقایسه با دیگران'], answer: 1 },
      { type: 'likert', q: 'توانایی «نه گفتن» محترمانه شما؟', options: ['خیلی کم', 'کم', 'متوسط', 'زیاد', 'خیلی زیاد'] },
      { type: 'text', q: 'یک موقعیت سخت ارتباطی اخیر را در یک پاراگراف بنویسید.' }
    ],
    suggest: 'مسیر توسعه فردی پایه',
    tips: ['روی گوش دادن فعال تمرین کنید', 'مدل SBI را برای بازخورد به کار ببرید', 'دوره مهارت‌های ارتباطی را بگذرانید']
  },
  {
    id: 'a2', title: 'ارزیابی سبک رهبری', type: 'چندگزینه‌ای',
    questions: [
      { type: 'mc', q: 'در تصمیم‌گیری تیمی ترجیح شما؟', options: ['دستوری', 'مشارکتی', 'تفویضی کامل', 'بی‌تفاوت'], answer: 1 },
      { type: 'mc', q: 'بازخورد به همکاران را چگونه می‌دهید؟', options: ['فقط منفی', 'فقط مثبت', 'تعادل سازنده', 'اصلاً'], answer: 2 },
      { type: 'likert', q: 'میزان الهام‌بخشی شما برای تیم؟', options: ['خیلی کم', 'کم', 'متوسط', 'زیاد', 'خیلی زیاد'] },
      { type: 'mc', q: 'تفویض را چطور انجام می‌دهید؟', options: ['همه کارها را خودم', 'با اختیار و چک‌پوینت', 'بدون پیگیری', 'فقط به افراد نزدیک'], answer: 1 },
      { type: 'text', q: 'بزرگ‌ترین چالش رهبری فعلی شما چیست؟' }
    ],
    suggest: 'مسیر رهبر تیمی',
    tips: ['تفویض با سطح اختیار مشخص', 'جلسات یک‌به‌یک منظم', 'دوره رهبری تیمی آریاز']
  },
  {
    id: 'a3', title: 'آمادگی مدیریت عملکرد (HR)', type: 'ترکیبی',
    questions: [
      { type: 'mc', q: 'بهترین زمان بازخورد عملکرد؟', options: ['فقط پایان سال', 'مستمر و نزدیک به رویداد', 'فقط وقتی مشکل حاد شد', 'هرگز'], answer: 1 },
      { type: 'mc', q: 'OKR شامل چیست؟', options: ['فقط وظیفه روزانه', 'هدف + نتایج کلیدی', 'فقط نمره انضباط', 'لیست شکایت'], answer: 1 },
      { type: 'likert', q: 'آمادگی شما برای جلسه بازخورد سخت؟', options: ['خیلی کم', 'کم', 'متوسط', 'زیاد', 'خیلی زیاد'] },
      { type: 'text', q: 'یک شاخص عملکرد خوب برای نقش دلخواه‌تان بنویسید.' }
    ],
    suggest: 'مسیر متخصص منابع انسانی',
    tips: ['چارچوب SBI را تمرین کنید', 'دوره مدیریت عملکرد', 'مشاوره با Agent منابع انسانی']
  }
];

var curA = null, qi = 0, ans = [];

function renderList() {
  document.getElementById('assessList').innerHTML = assessments.map(function (a) {
    return '<div class="card list-item"><div><span class="badge">' + a.type + '</span><h2>' + a.title + '</h2>' +
      '<p class="muted">' + a.questions.length + ' سوال · پیشنهاد مسیر پس از نتیجه</p></div>' +
      '<button class="btn btn-primary" onclick="startA(\'' + a.id + '\')">شروع</button></div>';
  }).join('');
}

function startA(id) {
  curA = assessments.find(function (x) { return x.id === id; });
  qi = 0; ans = [];
  document.getElementById('aTitle').textContent = curA.title;
  document.getElementById('assessBox').classList.remove('hidden');
  document.getElementById('assessBox').scrollIntoView({ behavior: 'smooth' });
  renderQ();
}

function renderQ() {
  var q = curA.questions[qi];
  var html = '<p style="font-weight:600;margin:12px 0">سوال ' + (qi + 1) + ' از ' + curA.questions.length + '</p>';
  html += '<div class="progress-bar" style="margin-bottom:14px"><span style="width:' + Math.round(((qi + 1) / curA.questions.length) * 100) + '%"></span></div>';
  html += '<p style="margin-bottom:12px;font-size:1.05rem">' + q.q + '</p>';
  if (q.type === 'mc' || q.type === 'likert') {
    q.options.forEach(function (opt, i) {
      var sel = ans[qi] === i ? ' selected' : '';
      html += '<label class="q-option' + sel + '" onclick="pick(' + i + ')"><input type="radio" name="aq" ' + (ans[qi] === i ? 'checked' : '') + ' /> ' + opt + '</label>';
    });
  } else {
    html += '<textarea id="textAns" rows="4" style="width:100%;padding:12px;border-radius:10px;border:1px solid #e2e8f0;font-family:inherit">' + (ans[qi] || '') + '</textarea>';
  }
  document.getElementById('aArea').innerHTML = html;
}

function pick(i) { ans[qi] = i; renderQ(); }
function nextA() {
  var q = curA.questions[qi];
  if (q.type === 'text') ans[qi] = (document.getElementById('textAns') || {}).value || '';
  if (qi < curA.questions.length - 1) { qi++; renderQ(); }
}
function prevA() {
  var q = curA.questions[qi];
  if (q.type === 'text') ans[qi] = (document.getElementById('textAns') || {}).value || '';
  if (qi > 0) { qi--; renderQ(); }
}

function submitA() {
  var q = curA.questions[qi];
  if (q.type === 'text') ans[qi] = (document.getElementById('textAns') || {}).value || '';
  var score = 0, scored = 0;
  curA.questions.forEach(function (qq, i) {
    if (qq.type === 'mc' && qq.answer !== undefined) {
      scored++;
      if (ans[i] === qq.answer) score++;
    }
    if (qq.type === 'likert' && typeof ans[i] === 'number') {
      scored++;
      score += ans[i] / 4;
    }
  });
  var percent = scored ? Math.round((score / scored) * 100) : 70;
  var results = getStore('aryaz_assess', []) || [];
  results.unshift({ title: curA.title, score: percent, suggest: curA.suggest, time: new Date().toLocaleString('fa-IR') });
  setStore('aryaz_assess', results.slice(0, 30));
  addActivity('ارزیابی «' + curA.title + '»: ' + percent + '٪');

  var tips = (curA.tips || []).map(function (t) { return '<li style="margin:6px 0">' + t + '</li>'; }).join('');
  document.getElementById('aArea').innerHTML =
    '<div style="text-align:center;padding:20px">' +
    '<h3>نتیجه و تحلیل</h3>' +
    '<p style="font-size:2.6rem;font-weight:700;color:#1d4ed8;margin:12px 0">' + percent + '٪</p>' +
    '<p>پیشنهاد مسیر: <strong>' + curA.suggest + '</strong></p>' +
    '<ul style="text-align:right;max-width:400px;margin:16px auto;padding-right:20px">' + tips + '</ul>' +
    '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px">' +
    '<a href="paths.html" class="btn btn-primary">مشاهده مسیرها</a>' +
    '<a href="agents.html" class="btn btn-secondary">مشاوره با AI</a></div></div>';
  toast('نتیجه ذخیره شد');
}

document.addEventListener('DOMContentLoaded', renderList);
