var videos = [
  { id: '1', title: 'آناتومی قلب — بخش اول', instructor: 'دکتر رضایی', duration: '۴۲:۱۵', views: 5400, category: 'آناتومی', progress: 80 },
  { id: '2', title: 'مبانی الکتروکاردیوگرافی', instructor: 'دکتر کریمی', duration: '۵۸:۳۰', views: 3200, category: 'کاردیولوژی', progress: 35 },
  { id: '3', title: 'تفسیر آزمایش‌های خون', instructor: 'دکتر محمدی', duration: '۳۵:۰۰', views: 7800, category: 'آزمایشگاه', progress: 100 },
  { id: '4', title: 'آناتومی قفسه سینه', instructor: 'دکتر احمدی', duration: '۴۸:۲۰', views: 2100, category: 'آناتومی', progress: 0 },
  { id: '5', title: 'نارسایی قلبی — مرور بالینی', instructor: 'دکتر نوری', duration: '۵۲:۱۰', views: 4100, category: 'کاردیولوژی', progress: 15 }
];

function renderVideos(list) {
  var grid = document.getElementById('videoGrid');
  grid.innerHTML = list.map(function (v) {
    return '<article class="card video-card" data-cat="' + v.category + '">' +
      '<div class="video-thumb" onclick="playDemo(\'' + v.id + '\')"><span class="play-btn">▶</span>' +
      '<span class="duration">' + v.duration + '</span></div>' +
      '<div class="card-body"><span class="badge">' + v.category + '</span>' +
      '<h3>' + v.title + '</h3>' +
      '<p class="muted">' + v.instructor + ' · ' + v.views.toLocaleString('fa-IR') + ' بازدید</p>' +
      (v.progress ? '<div class="progress-bar"><span style="width:' + v.progress + '%"></span></div>' : '') +
      '</div></article>';
  }).join('');
}

function filterVideos() {
  var q = (document.getElementById('videoSearch').value || '').trim();
  var cat = document.getElementById('videoFilter').value;
  var list = videos.filter(function (v) {
    return (!cat || v.category === cat) && (!q || v.title.indexOf(q) !== -1 || v.instructor.indexOf(q) !== -1);
  });
  var uploaded = getStore('med_uploaded_videos', []) || [];
  renderVideos(list.concat(uploaded));
}

function playDemo(id) {
  var v = videos.find(function (x) { return x.id === id; });
  document.getElementById('playerTitle').textContent = v ? v.title : 'ویدیو';
  document.getElementById('playerHint').classList.remove('hidden');
  document.getElementById('localVideo').classList.add('hidden');
  document.getElementById('playerModal').classList.remove('hidden');
  if (v) {
    v.progress = Math.min(100, (v.progress || 0) + 20);
    addActivity('تماشای ویدیو: ' + v.title);
    setStore('med_video_progress', videos.map(function (x) { return { id: x.id, progress: x.progress }; }));
  }
}

function closePlayer() {
  document.getElementById('playerModal').classList.add('hidden');
  var v = document.getElementById('localVideo');
  v.pause(); v.classList.add('hidden');
}

function handleVideoUpload(input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  var url = URL.createObjectURL(file);
  var uploaded = getStore('med_uploaded_videos', []) || [];
  var item = { id: 'u' + Date.now(), title: file.name, instructor: 'شما', duration: 'آپلود', views: 0, category: 'آپلود شما', progress: 0, url: url };
  uploaded.unshift(item);
  setStore('med_uploaded_videos', uploaded.map(function (x) { return { id: x.id, title: x.title, instructor: x.instructor, duration: x.duration, views: 0, category: x.category, progress: 0 }; }));
  addActivity('آپلود ویدیو: ' + file.name);
  toast('ویدیو اضافه شد');
  filterVideos();
  playUploaded(url, file.name);
}

function playUploaded(url, name) {
  document.getElementById('playerTitle').textContent = name || 'ویدیو آپلود‌شده';
  document.getElementById('playerHint').classList.add('hidden');
  document.getElementById('playerModal').classList.remove('hidden');
  var v = document.getElementById('localVideo');
  v.src = url; v.classList.remove('hidden'); v.play();
}

document.addEventListener('DOMContentLoaded', filterVideos);
