var courses = [
  { id: 'c1', title: 'مهارت‌های ارتباطی موثر', cat: 'مهارت نرم', lessons: 8, hours: 6, price: 0,
    chapters: [
      { t: 'مقدمات ارتباط', body: 'ارتباط مؤثر یعنی انتقال پیام به‌گونه‌ای که گیرنده همان معنایی را بفهمد که فرستنده قصد داشته. موانع رایج: فرض‌ها، حواس‌پرتی، برچسب‌زنی.' },
      { t: 'گوش دادن فعال', body: 'تأیید کوتاه، سوال شفاف‌ساز، خلاصه‌سازی و نام‌بردن احساس. هدف فهمیدن است نه آماده کردن جواب.' },
      { t: 'بازخورد سازنده', body: 'مدل SBI: موقعیت، رفتار مشاهده‌شده، تأثیر. از قضاوت شخصیتی پرهیز کنید.' },
      { t: 'زبان بدن', body: 'تماس چشمی مناسب، حالت باز بدن، هم‌ترازی لحن و محتوا اعتماد می‌سازد.' },
      { t: 'ارتباط در تعارض', body: 'مکث هیجانی، جدا کردن فرد از مسئله، یافتن نیاز مشترک، توافق قدم بعدی.' },
      { t: 'ارتباط نوشتاری', body: 'موضوع واضح، درخواست مشخص، لحن محترمانه، مهلت و قدم بعدی.' },
      { t: 'تمرین عملی', body: 'یک گفتگوی سخت این هفته را با مدل SBI بازطراحی کنید و نتیجه را یادداشت کنید.' },
      { t: 'آزمون پایان دوره', body: 'مرور نکات کلیدی و خودارزیابی. با تکمیل این بخش گواهینامه صادر می‌شود.' }
    ]},
  { id: 'c2', title: 'رهبری تیمی در سازمان', cat: 'رهبری', lessons: 6, hours: 10, price: 890000,
    chapters: [
      { t: 'سبک‌های رهبری', body: 'دستوری، مشارکتی، تفویضی — هر سبک در شرایطی مؤثر است. رهبر بالغ سبک را با موقعیت تطبیق می‌دهد.' },
      { t: 'امنیت روانی', body: 'تیم وقتی رشد می‌کند که سوال و اشتباه بدون ترس از تنبیه مطرح شود.' },
      { t: 'تفویض اختیار', body: 'کار + نتیجه + مهلت + سطح اختیار + چک‌پوینت. نه رها کردن، نه میکرو‌مدیریت.' },
      { t: 'انگیزش', body: 'معنا، تسلط، خودمختاری. قدردانی مشخص مؤثرتر از شعار کلی است.' },
      { t: 'جلسه یک‌به‌یک', body: 'ساختار: حال → موانع او → بازخورد → تعهد. او باید بیشتر حرف بزند.' },
      { t: 'گواهینامه', body: 'جمع‌بندی مسیر رهبری تیمی و صدور گواهی تکمیل.' }
    ]},
  { id: 'c3', title: 'مدیریت عملکرد کارکنان', cat: 'منابع انسانی', lessons: 5, hours: 8, price: 750000,
    chapters: [
      { t: 'هدف‌گذاری OKR', body: 'هدف کیفی + نتایج کلیدی کمّی. تعداد کم، شفاف، قابل پیگیری.' },
      { t: 'ارزیابی مستمر', body: 'بازخورد را به ارزیابی سالانه محدود نکنید؛ چرخه کوتاه‌تر اعتماد می‌سازد.' },
      { t: 'جلسه بازخورد', body: 'داده → نیت حمایتی → SBI → توافق → پیگیری.' },
      { t: 'PIP و بهبود', body: 'برنامه بهبود باید شفاف، زمان‌دار و همراه حمایت باشد.' },
      { t: 'پروژه عملی', body: 'برای یک نقش فرضی سه OKR و یک قالب جلسه بازخورد بنویسید.' }
    ]},
  { id: 'c4', title: 'هوش هیجانی در محیط کار', cat: 'توسعه فردی', lessons: 5, hours: 5, price: 0,
    chapters: [
      { t: 'خودآگاهی', body: 'نام‌بردن احساس، محرک‌ها و الگوهای واکنش اولین قدم EQ است.' },
      { t: 'خودتنظیمی', body: 'مکث، تنفس، انتخاب پاسخ به‌جای واکنش خودکار.' },
      { t: 'انگیزش درونی', body: 'اتصال کار روزمره به ارزش شخصی، انرژی پایدار می‌سازد.' },
      { t: 'همدلی', body: 'دیدن دنیا از چشم دیگری بدون لزوماً موافقت کامل.' },
      { t: 'مهارت اجتماعی', body: 'شبکه، اعتماد و مدیریت تعارض روی پایه‌های قبلی سوار می‌شود.' }
    ]},
  { id: 'c5', title: 'تفکر انتقادی و حل مسئله', cat: 'مهارت نرم', lessons: 5, hours: 7, price: 420000,
    chapters: [
      { t: 'تعریف مسئله', body: 'مسئله را از علامت جدا کنید. یک جمله مسئله بنویسید.' },
      { t: 'جمع‌آوری شواهد', body: 'فرض را از داده جدا کنید. منبع و سوگیری را بپرسید.' },
      { t: 'گزینه‌سازی', body: 'حداقل سه گزینه قبل از تصمیم. معیارهای وزن‌دار.' },
      { t: 'تصمیم و بازبینی', body: 'تصمیم را ثبت کنید و نقطه بازبینی بگذارید.' },
      { t: 'مطالعه موردی', body: 'یک مسئله واقعی محل کار را با همین چارچوب حل کنید.' }
    ]},
  { id: 'c6', title: 'کوچینگ برای مدیران', cat: 'رهبری', lessons: 5, hours: 9, price: 980000,
    chapters: [
      { t: 'نقش کوچ', body: 'کوچ جواب آماده نمی‌دهد؛ فضای فکر و مسئولیت می‌سازد.' },
      { t: 'پرسش قدرتمند', body: 'سوالات باز، کوتاه، بدون القای جواب.' },
      { t: 'گوش دادن سطح ۳', body: 'محتوا + احساس + آنچه گفته نمی‌شود.' },
      { t: 'جلسه کوچینگ', body: 'هدف جلسه → اکتشاف → گزینه‌ها → تعهد → پیگیری.' },
      { t: 'گواهینامه', body: 'تمرین نهایی: یک جلسه کوچینگ شبیه‌سازی‌شده.' }
    ]}
];

var activeCourse = null;
var activeLesson = 0;

function filterCourses() {
  var q = (document.getElementById('q').value || '').trim();
  var cat = document.getElementById('cat').value;
  var list = courses.filter(function (c) {
    return (!cat || c.cat === cat) && (!q || c.title.indexOf(q) !== -1);
  });
  var enrolled = getStore('aryaz_courses', {}) || {};
  document.getElementById('courseGrid').innerHTML = list.map(function (c) {
    var data = enrolled[c.id] || {};
    var prog = data.progress || 0;
    return '<article class="card" style="cursor:pointer" onclick="openCourse(\'' + c.id + '\')">' +
      '<div class="product-cover" style="font-size:2rem;height:110px">🎓</div>' +
      '<div class="card-body"><span class="badge">' + c.cat + '</span> ' +
      (c.price === 0 ? '<span class="badge badge-green">رایگان</span>' : '') +
      (data.progress >= 100 ? ' <span class="badge badge-amber">گواهینامه</span>' : '') +
      '<h3>' + c.title + '</h3>' +
      '<p class="muted">' + c.chapters.length + ' درس · ' + c.hours + ' ساعت</p>' +
      '<p class="price">' + (c.price ? c.price.toLocaleString('fa-IR') + ' تومان' : 'رایگان') + '</p>' +
      (prog ? '<div class="progress-bar"><span style="width:' + prog + '%"></span></div>' : '') +
      '</div></article>';
  }).join('') || '<p class="muted">دوره‌ای یافت نشد</p>';
}

function openCourse(id) {
  activeCourse = courses.find(function (c) { return c.id === id; });
  if (!activeCourse) return;
  var enrolled = getStore('aryaz_courses', {}) || {};
  var data = enrolled[id] || { progress: 0, enrolled: false, lesson: 0, notes: '' };
  activeLesson = data.lesson || 0;

  document.getElementById('cTitle').textContent = activeCourse.title;
  document.getElementById('cMeta').textContent = activeCourse.cat + ' · ' + activeCourse.chapters.length + ' درس · ' + activeCourse.hours + ' ساعت';

  renderLessonUI(data);
  document.getElementById('courseModal').classList.remove('hidden');
}

function renderLessonUI(data) {
  var ch = activeCourse.chapters;
  var html = '';
  if (!data.enrolled) {
    html = '<strong>سرفصل‌ها:</strong><ol style="padding-right:20px;margin:10px 0">' +
      ch.map(function (c) { return '<li style="margin:6px 0">' + c.t + '</li>'; }).join('') + '</ol>' +
      '<p class="muted">پس از ثبت‌نام می‌توانید درس‌ها را یکی‌یکی مطالعه کنید.</p>';
    document.getElementById('cChapters').innerHTML = html;
    document.getElementById('cProgress').style.width = '0%';
    document.getElementById('cPct').textContent = 'ثبت‌نام نشده';
    var btn = document.getElementById('cEnrollBtn');
    btn.textContent = activeCourse.price === 0 ? 'ثبت‌نام رایگان' : 'ثبت‌نام / خرید';
    btn.onclick = enrollCourse;
    btn.disabled = false;
    return;
  }

  var idx = Math.min(activeLesson, ch.length - 1);
  var lesson = ch[idx];
  var pct = Math.round(((data.completed || 0) / ch.length) * 100);
  if (data.progress >= 100) pct = 100;

  html = '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
    '<span class="badge">درس ' + (idx + 1) + ' از ' + ch.length + '</span>' +
    (pct >= 100 ? '<span class="badge badge-green">تکمیل شده</span>' : '') + '</div>' +
    '<h3 style="margin-bottom:10px">' + lesson.t + '</h3>' +
    '<div style="background:#f8fafc;border-radius:12px;padding:16px;line-height:1.85;margin-bottom:14px">' + lesson.body + '</div>' +
    '<div class="form-group"><label>یادداشت شما برای این دوره</label>' +
    '<textarea id="courseNote" rows="3" placeholder="نکته یا اقدام شخصی...">' + (data.notes || '') + '</textarea></div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">' +
    '<button type="button" class="btn btn-secondary btn-sm" onclick="prevLesson()" ' + (idx === 0 ? 'disabled' : '') + '>درس قبل</button>' +
    '<button type="button" class="btn btn-primary btn-sm" onclick="completeLesson()">تکمیل این درس</button>' +
    '<button type="button" class="btn btn-secondary btn-sm" onclick="nextLesson()" ' + (idx >= ch.length - 1 ? 'disabled' : '') + '>درس بعد</button>' +
    '<button type="button" class="btn btn-secondary btn-sm" onclick="saveNote()">ذخیره یادداشت</button>' +
    '</div>';

  if (pct >= 100) {
    html += '<div style="margin-top:18px;padding:16px;border-radius:12px;background:#ecfdf5;border:1px solid #a7f3d0">' +
      '<strong>گواهینامه آماده است</strong><p class="muted" style="margin:8px 0">دوره «' + activeCourse.title + '» را با موفقیت تکمیل کردید.</p>' +
      '<button type="button" class="btn btn-green btn-sm" onclick="showCert()">مشاهده گواهینامه</button></div>';
  }

  document.getElementById('cChapters').innerHTML = html;
  document.getElementById('cProgress').style.width = pct + '%';
  document.getElementById('cPct').textContent = pct + '٪ پیشرفت';
  var btn = document.getElementById('cEnrollBtn');
  btn.textContent = pct >= 100 ? 'تکمیل شد ✓' : 'در حال یادگیری';
  btn.disabled = true;
}

function getCourseData() {
  var enrolled = getStore('aryaz_courses', {}) || {};
  return enrolled[activeCourse.id] || { progress: 0, enrolled: false, lesson: 0, completed: 0, notes: '' };
}

function saveCourseData(data) {
  var enrolled = getStore('aryaz_courses', {}) || {};
  enrolled[activeCourse.id] = data;
  setStore('aryaz_courses', enrolled);
}

function enrollCourse() {
  if (!activeCourse) return;
  var data = { progress: 0, enrolled: true, title: activeCourse.title, lesson: 0, completed: 0, notes: '', cert: false };
  saveCourseData(data);
  activeLesson = 0;
  addActivity('ثبت‌نام: ' + activeCourse.title);
  toast('ثبت‌نام شد — درس اول باز است');
  openCourse(activeCourse.id);
  filterCourses();
}

function completeLesson() {
  var data = getCourseData();
  if (!data.enrolled) return;
  var total = activeCourse.chapters.length;
  var done = Math.max(data.completed || 0, activeLesson + 1);
  data.completed = done;
  data.lesson = Math.min(activeLesson + 1, total - 1);
  data.progress = Math.round((done / total) * 100);
  if (data.progress >= 100) {
    data.cert = true;
    data.certDate = new Date().toLocaleDateString('fa-IR');
    addActivity('گواهینامه: ' + activeCourse.title);
    toast('دوره تکمیل شد');
  } else {
    activeLesson = data.lesson;
    addActivity('درس ' + done + '/' + total + ' — ' + activeCourse.title);
    toast('درس تکمیل شد');
  }
  saveCourseData(data);
  openCourse(activeCourse.id);
  filterCourses();
}

function nextLesson() {
  if (activeLesson < activeCourse.chapters.length - 1) {
    activeLesson++;
    var data = getCourseData();
    data.lesson = activeLesson;
    saveCourseData(data);
    renderLessonUI(data);
  }
}

function prevLesson() {
  if (activeLesson > 0) {
    activeLesson--;
    var data = getCourseData();
    data.lesson = activeLesson;
    saveCourseData(data);
    renderLessonUI(data);
  }
}

function saveNote() {
  var data = getCourseData();
  var el = document.getElementById('courseNote');
  data.notes = el ? el.value : '';
  saveCourseData(data);
  toast('یادداشت ذخیره شد');
}

function showCert() {
  var data = getCourseData();
  var box = document.getElementById('cChapters');
  box.innerHTML = '<div style="text-align:center;padding:20px;border:2px dashed #059669;border-radius:16px;background:#f0fdf4">' +
    '<p style="font-size:.85rem;color:#059669">گواهینامه تکمیل دوره</p>' +
    '<h2 style="margin:12px 0">' + activeCourse.title + '</h2>' +
    '<p class="muted">پلتفرم آریاز</p>' +
    '<p style="margin-top:16px">تاریخ: ' + (data.certDate || '—') + '</p>' +
    '<button type="button" class="btn btn-secondary btn-sm" style="margin-top:16px" onclick="openCourse(\'' + activeCourse.id + '\')">بازگشت به درس‌ها</button></div>';
}

function closeCourse() { document.getElementById('courseModal').classList.add('hidden'); }

document.addEventListener('DOMContentLoaded', filterCourses);
