var defaultExams = [
  { id: '1', title: 'آزمون فیزیولوژی سیستم قلبی-عروقی', specialty: 'فیزیولوژی', questions: 40, duration: 60, participants: 1280 },
  { id: '2', title: 'آزمون پاتولوژی عمومی', specialty: 'پاتولوژی', questions: 50, duration: 75, participants: 890 },
  { id: '3', title: 'آزمون فارماکولوژی پایه', specialty: 'فارماکولوژی', questions: 35, duration: 50, participants: 2100 },
  { id: '4', title: 'آناتومی اندام فوقانی', specialty: 'آناتومی', questions: 30, duration: 45, participants: 640 },
  { id: '5', title: 'فیزیولوژی تنفس', specialty: 'فیزیولوژی', questions: 25, duration: 40, participants: 520 }
];

var questions = [
  { q: 'کدام دریچه بین دهلیز و بطن چپ قرار دارد؟', options: ['دریچه میترال', 'دریچه سه‌لختی', 'دریچه آئورت', 'دریچه پولمونر'], answer: 0 },
  { q: 'ضربان‌ساز طبیعی قلب کجاست؟', options: ['گره AV', 'گره SA', 'دسته هیس', 'الیاف پورکنژ'], answer: 1 },
  { q: 'کدام هورمون توسط غده تیروئید ترشح می‌شود؟', options: ['انسولین', 'کورتیزول', 'تیروکسین (T4)', 'آدرنالین'], answer: 2 },
  { q: 'واحد عملکردی کلیه چیست؟', options: ['نفرون', 'گلومرول', 'لوله جمع‌کننده', 'حالب'], answer: 0 },
  { q: 'کدام ویتامین برای انعقاد خون ضروری است؟', options: ['ویتامین A', 'ویتامین C', 'ویتامین K', 'ویتامین D'], answer: 2 }
];

var current = 0, answers = [], timerInterval, activeExam = null;

function getExams() {
  var custom = getStore('med_custom_exams', []) || [];
  return defaultExams.concat(custom);
}

function renderExamList(list) {
  var el = document.getElementById('examList');
  if (!list.length) {
    el.innerHTML = '<div class="card list-item"><p class="muted">آزمونی یافت نشد.</p></div>';
    return;
  }
  el.innerHTML = list.map(function (exam) {
    return '<div class="card list-item" data-spec="' + exam.specialty + '" data-title="' + exam.title + '">' +
      '<div><span class="badge">' + exam.specialty + '</span>' +
      '<h2>' + exam.title + '</h2>' +
      '<div class="meta"><span>' + exam.questions + ' سوال</span><span>' + exam.duration + ' دقیقه</span>' +
      '<span>' + (exam.participants || 0).toLocaleString('fa-IR') + ' شرکت‌کننده</span></div></div>' +
      '<button class="btn btn-primary" onclick="startExamById(\'' + exam.id + '\')">شروع آزمون</button></div>';
  }).join('');
}

function filterExams() {
  var q = (document.getElementById('examSearch').value || '').trim();
  var spec = document.getElementById('examFilter').value;
  var list = getExams().filter(function (e) {
    var okSpec = !spec || e.specialty === spec;
    var okQ = !q || e.title.indexOf(q) !== -1 || e.specialty.indexOf(q) !== -1;
    return okSpec && okQ;
  });
  renderExamList(list);
}

function startExamById(id) {
  var exam = getExams().find(function (e) { return e.id === id; });
  if (!exam) return;
  activeExam = exam;
  document.getElementById('examTitle').textContent = exam.title;
  document.getElementById('examBox').classList.remove('hidden');
  document.getElementById('examBox').scrollIntoView({ behavior: 'smooth' });
  current = 0; answers = [];
  renderQ();
  startTimer((exam.duration || 60) * 60);
}

function renderQ() {
  var q = questions[current];
  var pct = Math.round(((current + 1) / questions.length) * 100);
  document.getElementById('examProgressBar').style.width = pct + '%';
  var html = '<p style="font-weight:600;margin:16px 0">سوال ' + (current + 1) + ' از ' + questions.length + '</p>';
  html += '<p style="margin-bottom:12px;font-size:1.05rem">' + q.q + '</p>';
  q.options.forEach(function (opt, i) {
    var sel = answers[current] === i ? ' selected' : '';
    html += '<label class="q-option' + sel + '" onclick="selectOpt(' + i + ')">' +
      '<input type="radio" name="q" ' + (answers[current] === i ? 'checked' : '') + ' /> ' + opt + '</label>';
  });
  document.getElementById('questionArea').innerHTML = html;
}

function selectOpt(i) { answers[current] = i; renderQ(); }
function nextQ() { if (current < questions.length - 1) { current++; renderQ(); } }
function prevQ() { if (current > 0) { current--; renderQ(); } }

function submitExam() {
  clearInterval(timerInterval);
  var score = 0;
  questions.forEach(function (q, i) { if (answers[i] === q.answer) score++; });
  var percent = Math.round((score / questions.length) * 100);
  var results = getStore('med_exam_results', []) || [];
  results.unshift({
    title: activeExam ? activeExam.title : 'آزمون',
    score: percent,
    correct: score,
    total: questions.length,
    time: new Date().toLocaleString('fa-IR')
  });
  setStore('med_exam_results', results.slice(0, 20));
  addActivity('آزمون «' + (activeExam ? activeExam.title : '') + '» — نمره ' + percent + '٪');
  document.getElementById('questionArea').innerHTML =
    '<div style="text-align:center;padding:28px">' +
    '<h3>نتیجه آزمون</h3>' +
    '<p style="font-size:2.8rem;font-weight:700;color:#059669;margin:16px 0">' + percent + '٪</p>' +
    '<p>' + score + ' از ' + questions.length + ' پاسخ صحیح</p>' +
    '<p class="muted" style="margin-top:12px">نتیجه در داشبورد ذخیره شد</p></div>';
  toast('نتیجه ذخیره شد: ' + percent + '٪');
}

function startTimer(seconds) {
  clearInterval(timerInterval);
  var left = seconds;
  timerInterval = setInterval(function () {
    left--;
    var m = Math.floor(left / 60), s = left % 60;
    document.getElementById('examTimer').textContent = 'زمان باقی‌مانده: ' + m + ':' + (s < 10 ? '0' : '') + s;
    if (left <= 0) { clearInterval(timerInterval); submitExam(); }
  }, 1000);
}

function openCreateExam() { document.getElementById('createModal').classList.remove('hidden'); }
function closeCreateExam() { document.getElementById('createModal').classList.add('hidden'); }

function saveNewExam() {
  var title = document.getElementById('newTitle').value.trim();
  if (!title) { toast('عنوان را وارد کنید'); return; }
  var custom = getStore('med_custom_exams', []) || [];
  custom.push({
    id: 'c' + Date.now(),
    title: title,
    specialty: document.getElementById('newSpec').value,
    questions: parseInt(document.getElementById('newQ').value, 10) || 20,
    duration: parseInt(document.getElementById('newDur').value, 10) || 30,
    participants: 0
  });
  setStore('med_custom_exams', custom);
  addActivity('آزمون جدید ساخته شد: ' + title);
  closeCreateExam();
  filterExams();
  toast('آزمون ذخیره شد');
}

document.addEventListener('DOMContentLoaded', function () { filterExams(); });
