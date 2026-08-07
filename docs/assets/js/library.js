var books = [
  { id: 'b1', title: 'هوش هیجانی', author: 'دانیل گولمن', cat: 'توسعه فردی',
    summary: 'هوش هیجانی شامل خودآگاهی، خودتنظیمی، انگیزش، همدلی و مهارت اجتماعی است. در محیط کار، EQ اغلب پیش‌بینی‌کننده بهتری برای موفقیت رهبری نسبت به IQ خام است.',
    chapters: ['خودآگاهی هیجانی', 'مدیریت هیجان در فشار', 'همدلی عملی', 'مهارت اجتماعی در تیم'],
    related: 'دوره هوش هیجانی در محیط کار' },
  { id: 'b2', title: 'رهبران آخر غذا می‌خورند', author: 'سایمون سینک', cat: 'رهبری',
    summary: 'رهبری واقعی یعنی ایجاد دایره امن برای تیم. وقتی افراد احساس امنیت کنند، انرژی‌شان صرف دفاع از خود نمی‌شود و صرف پیشرفت کار می‌شود.',
    chapters: ['دایره امنیت', 'اعتماد و همکاری', 'رهبری از انتهای صف', 'فرهنگ سازمانی'],
    related: 'مسیر رهبر تیمی' },
  { id: 'b3', title: 'عادت‌های اتمی', author: 'جیمز کلیر', cat: 'توسعه فردی',
    summary: 'تغییر بزرگ از عادت‌های بسیار کوچک ساخته می‌شود. هویت، سیستم و محیط مهم‌تر از انگیزه لحظه‌ای هستند.',
    chapters: ['هویت و عادت', 'قانون ۱٪', 'محرک-رفتار-پاداش', 'محیط را طراحی کنید'],
    related: 'مربی توسعه فردی (AI)' },
  { id: 'b4', title: 'گفتگوهای حیاتی', author: 'پترسون و همکاران', cat: 'مهارت نرم',
    summary: 'گفتگوی حیاتی وقتی است که سهم بالا، نظرات متفاوت و احساس قوی وجود دارد. مهارت کلیدی: امنیت گفتگو را حفظ کنید.',
    chapters: ['شروع با قلب', 'ایجاد امنیت', 'تسلط بر داستان‌ها', 'عمل کردن روی نتیجه'],
    related: 'دوره مهارت‌های ارتباطی' },
  { id: 'b5', title: 'سنجش آنچه مهم است', author: 'جان دور', cat: 'مدیریت',
    summary: 'OKR چارچوبی برای تمرکز، هم‌راستایی و پیگیری جاه‌طلبی است. هدف کیفی + نتایج کلیدی کمّی.',
    chapters: ['چرا OKR', 'نوشتن هدف خوب', 'هم‌راستایی تیمی', 'بازنگری دوره‌ای'],
    related: 'دوره مدیریت عملکرد' },
  { id: 'b6', title: 'پنج اختلال کار تیمی', author: 'پاتریک لنچیونی', cat: 'تیم',
    summary: 'اختلالات: نبود اعتماد، ترس از تعارض، کمبود تعهد، اجتناب از پاسخگویی، بی‌توجهی به نتایج. از پایه تعمیر کنید.',
    chapters: ['اعتماد آسیب‌پذیر', 'تعارض سازنده', 'تعهد', 'پاسخگویی', 'نتایج'],
    related: 'مسیر رهبر تیمی' }
];
var activeBook = null;

function renderBooks() {
  var read = getStore('aryaz_books', {}) || {};
  var favs = getStore('aryaz_favs', []) || [];
  var q = ((document.getElementById('bookSearch') || {}).value || '').trim();
  var list = books.filter(function (b) {
    return !q || b.title.indexOf(q) !== -1 || b.author.indexOf(q) !== -1 || b.cat.indexOf(q) !== -1;
  });
  document.getElementById('bookGrid').innerHTML = list.map(function (b) {
    var pct = read[b.id] || 0;
    var fav = favs.indexOf(b.id) !== -1;
    return '<article class="card" style="cursor:pointer" onclick="openBook(\'' + b.id + '\')">' +
      '<div class="product-cover">📘</div><div class="card-body">' +
      '<span class="badge">' + b.cat + '</span> ' + (fav ? '<span class="badge badge-amber">★</span>' : '') +
      '<h3>' + b.title + '</h3><p class="muted">' + b.author + '</p>' +
      (pct ? '<div class="progress-bar"><span style="width:' + pct + '%"></span></div><p class="muted" style="font-size:.8rem;margin-top:4px">' + pct + '٪ مطالعه</p>' : '') +
      '</div></article>';
  }).join('') || '<p class="muted">موردی یافت نشد</p>';
}

function openBook(id) {
  activeBook = books.find(function (b) { return b.id === id; });
  if (!activeBook) return;
  var read = getStore('aryaz_books', {}) || {};
  var pct = read[id] || 0;
  var chIdx = getStore('aryaz_book_ch', {}) || {};
  var idx = chIdx[id] || 0;
  if (idx >= activeBook.chapters.length) idx = activeBook.chapters.length - 1;

  document.getElementById('bTitle').textContent = activeBook.title;
  document.getElementById('bAuthor').textContent = activeBook.author + ' · ' + activeBook.cat;
  document.getElementById('bSummary').innerHTML =
    '<p style="margin-bottom:12px">' + activeBook.summary + '</p>' +
    '<p><strong>فصل فعلی (' + (idx + 1) + '/' + activeBook.chapters.length + '):</strong> ' + activeBook.chapters[idx] + '</p>' +
    '<p class="muted" style="margin-top:10px">مرتبط: ' + activeBook.related + '</p>';
  document.getElementById('bBar').style.width = pct + '%';
  document.getElementById('bPct').textContent = pct + '٪ مطالعه';
  document.getElementById('bookModal').classList.remove('hidden');
}

function readMore() {
  if (!activeBook) return;
  var read = getStore('aryaz_books', {}) || {};
  var chIdx = getStore('aryaz_book_ch', {}) || {};
  var idx = (chIdx[activeBook.id] || 0) + 1;
  if (idx >= activeBook.chapters.length) idx = activeBook.chapters.length - 1;
  chIdx[activeBook.id] = idx;
  setStore('aryaz_book_ch', chIdx);
  var pct = Math.min(100, Math.round(((idx + 1) / activeBook.chapters.length) * 100));
  read[activeBook.id] = pct;
  setStore('aryaz_books', read);
  addActivity('مطالعه: ' + activeBook.title + ' (' + pct + '٪)');
  toast(pct >= 100 ? 'کتاب تکمیل شد' : 'فصل بعد باز شد');
  openBook(activeBook.id);
  renderBooks();
}

function toggleFav() {
  if (!activeBook) return;
  var favs = getStore('aryaz_favs', []) || [];
  var i = favs.indexOf(activeBook.id);
  if (i === -1) { favs.push(activeBook.id); toast('به علاقه‌مندی اضافه شد'); }
  else { favs.splice(i, 1); toast('حذف از علاقه‌مندی'); }
  setStore('aryaz_favs', favs);
  renderBooks();
}

document.addEventListener('DOMContentLoaded', function () {
  renderBooks();
  var s = document.getElementById('bookSearch');
  if (s) s.addEventListener('input', renderBooks);
});
