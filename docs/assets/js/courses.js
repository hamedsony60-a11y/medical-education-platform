var courses = [
  { id: 'c1', title: 'مهارت‌های ارتباطی موثر', cat: 'مهارت نرم', lessons: 12, hours: 6, price: 0, chapters: ['مقدمات ارتباط', 'گوش دادن فعال', 'بازخورد سازنده', 'آزمون پایان دوره'] },
  { id: 'c2', title: 'رهبری تیمی در سازمان', cat: 'رهبری', lessons: 18, hours: 10, price: 890000, chapters: ['سبک‌های رهبری', 'انگیزش تیم', 'تفویض اختیار', 'آزمون و گواهینامه'] },
  { id: 'c3', title: 'مدیریت عملکرد کارکنان', cat: 'منابع انسانی', lessons: 15, hours: 8, price: 750000, chapters: ['هدف‌گذاری OKR', 'ارزیابی عملکرد', 'جلسه بازخورد', 'پروژه عملی'] },
  { id: 'c4', title: 'هوش هیجانی در محیط کار', cat: 'توسعه فردی', lessons: 10, hours: 5, price: 0, chapters: ['خودآگاهی', 'مدیریت هیجان', 'همدلی', 'آزمون'] },
  { id: 'c5', title: 'تفکر انتقادی و حل مسئله', cat: 'مهارت نرم', lessons: 14, hours: 7, price: 420000, chapters: ['چارچوب حل مسئله', 'تصمیم‌گیری', 'مطالعه موردی', 'آزمون'] },
  { id: 'c6', title: 'کوچینگ برای مدیران', cat: 'رهبری', lessons: 16, hours: 9, price: 980000, chapters: ['نقش کوچ', 'پرسش قدرتمند', 'جلسه کوچینگ', 'گواهینامه'] }
];
var activeCourse = null;

function filterCourses() {
  var q = (document.getElementById('q').value || '').trim();
  var cat = document.getElementById('cat').value;
  var list = courses.filter(function (c) {
    return (!cat || c.cat === cat) && (!q || c.title.indexOf(q) !== -1);
  });
  var enrolled = getStore('aryaz_courses', {}) || {};
  document.getElementById('courseGrid').innerHTML = list.map(function (c) {
    var prog = enrolled[c.id] ? enrolled[c.id].progress : 0;
    return '<article class="card" style="cursor:pointer" onclick="openCourse(\'' + c.id + '\')">' +
      '<div class="product-cover" style="font-size:2rem;height:120px">🎓</div>' +
      '<div class="card-body"><span class="badge">' + c.cat + '</span>' +
      (c.price === 0 ? '<span class="badge badge-green" style="margin-right:6px">رایگان</span>' : '') +
      '<h3>' + c.title + '</h3>' +
      '<p class="muted">' + c.lessons + ' درس · ' + c.hours + ' ساعت</p>' +
      (c.price ? '<p class="price">' + c.price.toLocaleString('fa-IR') + ' تومان</p>' : '<p class="price">رایگان</p>') +
      (prog ? '<div class="progress-bar"><span style="width:' + prog + '%"></span></div>' : '') +
      '</div></article>';
  }).join('');
}

function openCourse(id) {
  activeCourse = courses.find(function (c) { return c.id === id; });
  if (!activeCourse) return;
  var enrolled = getStore('aryaz_courses', {}) || {};
  var data = enrolled[id] || { progress: 0, enrolled: false };
  document.getElementById('cTitle').textContent = activeCourse.title;
  document.getElementById('cMeta').textContent = activeCourse.cat + ' · ' + activeCourse.lessons + ' درس · ' + activeCourse.hours + ' ساعت';
  document.getElementById('cChapters').innerHTML = '<strong>سرفصل‌ها:</strong><ol style="padding-right:20px;margin-top:8px">' +
    activeCourse.chapters.map(function (ch) { return '<li style="margin:6px 0">' + ch + '</li>'; }).join('') + '</ol>';
  document.getElementById('cProgress').style.width = data.progress + '%';
  document.getElementById('cPct').textContent = data.progress + '٪ پیشرفت';
  var btn = document.getElementById('cEnrollBtn');
  if (data.enrolled) {
    btn.textContent = data.progress >= 100 ? 'گواهینامه آماده است ✓' : 'ادامه یادگیری (+۲۰٪)';
    btn.onclick = function () { advanceCourse(id); };
  } else {
    btn.textContent = activeCourse.price === 0 ? 'ثبت‌نام رایگان' : 'ثبت‌نام / خرید';
    btn.onclick = enrollCourse;
  }
  document.getElementById('courseModal').classList.remove('hidden');
}

function closeCourse() { document.getElementById('courseModal').classList.add('hidden'); }

function enrollCourse() {
  if (!activeCourse) return;
  var enrolled = getStore('aryaz_courses', {}) || {};
  enrolled[activeCourse.id] = { progress: 0, enrolled: true, title: activeCourse.title };
  setStore('aryaz_courses', enrolled);
  addActivity('ثبت‌نام دوره: ' + activeCourse.title);
  toast('ثبت‌نام انجام شد');
  openCourse(activeCourse.id);
  filterCourses();
}

function advanceCourse(id) {
  var enrolled = getStore('aryaz_courses', {}) || {};
  if (!enrolled[id]) return;
  enrolled[id].progress = Math.min(100, (enrolled[id].progress || 0) + 20);
  setStore('aryaz_courses', enrolled);
  addActivity('پیشرفت دوره: ' + enrolled[id].title + ' → ' + enrolled[id].progress + '٪');
  if (enrolled[id].progress >= 100) toast('دوره تکمیل شد — گواهینامه صادر می‌شود');
  else toast('پیشرفت ذخیره شد');
  openCourse(id);
  filterCourses();
}

document.addEventListener('DOMContentLoaded', filterCourses);
