var assessments = [
  {
    id: 'a1', title: 'خودارزیابی مهارت‌های نرم', type: 'ترکیبی',
    questions: [
      { type: 'mc', q: 'در تعارض تیمی معمولاً چه می‌کنید؟', options: ['اجتناب', 'مذاکره برد-برد', 'تحمیل نظر', 'ارجاع به مدیر'], answer: 1 },
      { type: 'likert', q: 'چقدر در گوش دادن فعال مهارت دارید؟', options: ['خیلی کم', 'کم', 'متوسط', 'زیاد', 'خیلی زیاد'] },
      { type: 'text', q: 'یک موقعیت سخت ارتباطی اخیر خود را شرح دهید.' }
    ],
    suggest: 'مسیر توسعه فردی پایه'
  },
  {
    id: 'a2', title: 'ارزیابی سبک رهبری', type: 'چندگزینه‌ای',
    questions: [
      { type: 'mc', q: 'در تصمیم‌گیری تیمی ترجیح شما چیست؟', options: ['دستوری', 'مشارکتی', 'تفویضی', 'بی‌تفاوت'], answer: 1 },
      { type: 'mc', q: 'بازخورد به همکاران را چگونه می‌دهید؟', options: ['فقط منفی', 'فقط مثبت', 'تعادل سازنده', 'اصلاً نمی‌دهم'], answer: 2 },
      { type: 'likert', q: 'میزان الهام‌بخشی شما برای تیم؟', options: ['خیلی کم', 'کم', 'متوسط', 'زیاد', 'خیلی زیاد'] }
    ],
    suggest: 'مسیر رهبر تیمی'
  }
];
var curA = null, qi = 0, ans = [];

function renderList() {
  document.getElementById('assessList').innerHTML = assessments.map(function (a) {
    return '<div class="card list-item"><div><span class="badge">' + a.type + '</span><h2>' + a.title + '</h2>' +
      '<p class="muted">' + a.questions.length + ' سوال · پیشنهاد مسیر پس از نتیجه</p></div>' +
      '<button class="btn btn-primary" onclick="startA(\'' + a.id + '\')">شروع ارزیابی</button></div>';
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
  html += '<p style="margin-bottom:12px">' + q.q + '</p>';
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
  setStore('aryaz_assess', results.slice(0, 20));
  addActivity('ارزیابی «' + curA.title + '»: ' + percent + '٪ → پیشنهاد: ' + curA.suggest);
  document.getElementById('aArea').innerHTML =
    '<div style="text-align:center;padding:24px">' +
    '<h3>تحلیل نتایج</h3>' +
    '<p style="font-size:2.5rem;font-weight:700;color:#1d4ed8;margin:12px 0">' + percent + '٪</p>' +
    '<p>پیشنهاد مسیر توسعه: <strong>' + curA.suggest + '</strong></p>' +
    '<a href="paths.html" class="btn btn-primary" style="margin-top:16px">مشاهده مسیرها</a></div>';
  toast('نتیجه ذخیره شد');
}

document.addEventListener('DOMContentLoaded', renderList);
