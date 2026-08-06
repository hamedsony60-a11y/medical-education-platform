var books = [
  { id: 'b1', title: 'هوش هیجانی', author: 'دانیل گولمن', summary: 'خلاصه‌ای از اهمیت خودآگاهی، مدیریت هیجان و مهارت‌های اجتماعی در موفقیت حرفه‌ای و شخصی.' },
  { id: 'b2', title: 'رهبران آخر غذا می‌خورند', author: 'سایمون سینک', summary: 'چارچوب رهبری مبتنی بر اعتماد، امنیت روانی تیم و اولویت دادن به افراد.' },
  { id: 'b3', title: 'عادت‌های اتمی', author: 'جیمز کلیر', summary: 'تغییر تدریجی رفتار از طریق سیستم‌های کوچک و هویت‌محور.' },
  { id: 'b4', title: 'گفتگوهای حیاتی', author: 'پترسون و همکاران', summary: 'مهارت گفتگو در شرایط پرتنش برای حفظ رابطه و رسیدن به نتیجه.' }
];
var activeBook = null;

function renderBooks() {
  var read = getStore('aryaz_books', {}) || {};
  var favs = getStore('aryaz_favs', []) || [];
  document.getElementById('bookGrid').innerHTML = books.map(function (b) {
    var pct = read[b.id] ? read[b.id] : 0;
    var fav = favs.indexOf(b.id) !== -1;
    return '<article class="card" style="cursor:pointer" onclick="openBook(\'' + b.id + '\')">' +
      '<div class="product-cover">📘</div><div class="card-body">' +
      (fav ? '<span class="badge badge-amber">علاقه‌مندی</span> ' : '') +
      '<h3>' + b.title + '</h3><p class="muted">' + b.author + '</p>' +
      (pct ? '<div class="progress-bar"><span style="width:' + pct + '%"></span></div>' : '') +
      '</div></article>';
  }).join('');
}

function openBook(id) {
  activeBook = books.find(function (b) { return b.id === id; });
  if (!activeBook) return;
  var read = getStore('aryaz_books', {}) || {};
  var pct = read[id] || 0;
  document.getElementById('bTitle').textContent = activeBook.title;
  document.getElementById('bAuthor').textContent = activeBook.author;
  document.getElementById('bSummary').textContent = activeBook.summary;
  document.getElementById('bBar').style.width = pct + '%';
  document.getElementById('bPct').textContent = pct + '٪ مطالعه';
  document.getElementById('bookModal').classList.remove('hidden');
}

function readMore() {
  if (!activeBook) return;
  var read = getStore('aryaz_books', {}) || {};
  var pct = Math.min(100, (read[activeBook.id] || 0) + 25);
  read[activeBook.id] = pct;
  setStore('aryaz_books', read);
  addActivity('مطالعه کتاب: ' + activeBook.title + ' (' + pct + '٪)');
  toast('پیشرفت مطالعه ذخیره شد');
  openBook(activeBook.id);
  renderBooks();
}

function toggleFav() {
  if (!activeBook) return;
  var favs = getStore('aryaz_favs', []) || [];
  var i = favs.indexOf(activeBook.id);
  if (i === -1) favs.push(activeBook.id); else favs.splice(i, 1);
  setStore('aryaz_favs', favs);
  toast(i === -1 ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد');
  renderBooks();
}

document.addEventListener('DOMContentLoaded', renderBooks);
