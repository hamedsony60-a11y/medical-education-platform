var questions = [
  { q: 'کدام دریچه بین دهلیز و بطن چپ قرار دارد؟', options: ['دریچه میترال', 'دریچه سه‌لختی', 'دریچه آئورت', 'دریچه پولمونر'], answer: 0 },
  { q: 'ضربان‌ساز طبیعی قلب کجاست؟', options: ['گره AV', 'گره SA', 'دسته هیس', 'الیاف پورکنژ'], answer: 1 },
  { q: 'کدام هورمون توسط غده تیروئید ترشح می‌شود؟', options: ['انسولین', 'کورتیزول', 'تیروکسین (T4)', 'آدرنالین'], answer: 2 }
];
var current = 0;
var answers = [];
var timerInterval;
function startExam(btn) {
  var title = btn.parentElement.querySelector('h2').textContent;
  document.getElementById('examTitle').textContent = title;
  document.getElementById('examBox').classList.remove('hidden');
  document.getElementById('examBox').scrollIntoView({ behavior: 'smooth' });
  current = 0; answers = []; renderQ(); startTimer(60 * 60);
}
function renderQ() {
  var q = questions[current];
  var html = '<p style="font-weight:600;margin:16px 0">سوال ' + (current + 1) + ' از ' + questions.length + '</p>';
  html += '<p style="margin-bottom:12px">' + q.q + '</p>';
  q.options.forEach(function (opt, i) {
    var sel = answers[current] === i ? ' selected' : '';
    html += '<label class="q-option' + sel + '" onclick="selectOpt(' + i + ')"><input type="radio" name="q" ' + (answers[current] === i ? 'checked' : '') + ' /> ' + opt + '</label>';
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
  document.getElementById('questionArea').innerHTML = '<div style="text-align:center;padding:24px"><h3>نتیجه آزمون</h3><p style="font-size:2.5rem;font-weight:700;color:#059669;margin:16px 0">' + percent + '٪</p><p>' + score + ' از ' + questions.length + ' پاسخ صحیح</p></div>';
}
function startTimer(seconds) {
  clearInterval(timerInterval);
  var left = seconds;
  timerInterval = setInterval(function () {
    left--;
    var m = Math.floor(left / 60); var s = left % 60;
    document.getElementById('examTimer').textContent = 'زمان باقی‌مانده: ' + m + ':' + (s < 10 ? '0' : '') + s;
    if (left <= 0) { clearInterval(timerInterval); submitExam(); }
  }, 1000);
}
