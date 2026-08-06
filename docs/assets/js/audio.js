var tracks = [
  { id: '1', title: 'مروری بر سیستم ایمنی', instructor: 'دکتر نوری', duration: '۲۸:۴۰', category: 'ایمونولوژی' },
  { id: '2', title: 'اصول تجویز آنتی‌بیوتیک', instructor: 'دکتر حسینی', duration: '۴۵:۱۲', category: 'فارماکولوژی' },
  { id: '3', title: 'فیزیولوژی خواب', instructor: 'دکتر رضایی', duration: '۳۲:۰۰', category: 'فیزیولوژی' }
];

function renderAudio() {
  var list = document.getElementById('audioList');
  var extra = getStore('med_uploaded_audio', []) || [];
  var all = tracks.concat(extra);
  list.innerHTML = all.map(function (a) {
    return '<div class="card list-item audio-item">' +
      '<div class="audio-icon">🎧</div>' +
      '<div class="flex-1"><span class="badge">' + a.category + '</span>' +
      '<h2>' + a.title + '</h2>' +
      '<p class="muted">' + a.instructor + ' · ' + a.duration + '</p></div>' +
      (a.url
        ? '<button class="btn btn-secondary" onclick="playLocal(\'' + a.url + '\', \'' + a.title.replace(/'/g, '') + '\')">پخش</button>'
        : '<button class="btn btn-secondary" onclick="playDemo(\'' + a.title.replace(/'/g, '') + '\')">پخش</button>') +
      '</div>';
  }).join('');
}

function playDemo(title) {
  toast('برای پخش واقعی، فایل صوتی آپلود کنید');
  addActivity('پخش صوت (دمو): ' + title);
}

function handleAudioUpload(input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  var url = URL.createObjectURL(file);
  var extra = getStore('med_uploaded_audio', []) || [];
  extra.unshift({ title: file.name, instructor: 'شما', duration: 'آپلود', category: 'آپلود شما', url: url });
  // urls can't persist in localStorage meaningfully across sessions as blob; keep in memory session only
  window._sessionAudio = window._sessionAudio || [];
  window._sessionAudio.unshift({ title: file.name, instructor: 'شما', duration: 'آپلود', category: 'آپلود شما', url: url });
  addActivity('آپلود صوت: ' + file.name);
  toast('فایل صوتی اضافه شد');
  renderAudioSession();
  playLocal(url, file.name);
}

function renderAudioSession() {
  var list = document.getElementById('audioList');
  var session = window._sessionAudio || [];
  var all = session.concat(tracks);
  list.innerHTML = all.map(function (a) {
    return '<div class="card list-item audio-item">' +
      '<div class="audio-icon">🎧</div>' +
      '<div class="flex-1"><span class="badge">' + a.category + '</span>' +
      '<h2>' + a.title + '</h2>' +
      '<p class="muted">' + a.instructor + ' · ' + a.duration + '</p></div>' +
      (a.url
        ? '<button class="btn btn-secondary" onclick="playLocal(\'' + a.url + '\', \'' + String(a.title).replace(/'/g, '') + '\')">پخش</button>'
        : '<button class="btn btn-secondary" onclick="playDemo(\'' + String(a.title).replace(/'/g, '') + '\')">پخش</button>') +
      '</div>';
  }).join('');
}

function playLocal(url, title) {
  var player = document.getElementById('audioPlayer');
  var bar = document.getElementById('audioBar');
  document.getElementById('nowPlaying').textContent = title || 'در حال پخش';
  player.src = url;
  bar.classList.add('show');
  player.play();
  addActivity('پخش صوت: ' + (title || ''));
}

function stopAudio() {
  var player = document.getElementById('audioPlayer');
  player.pause();
  document.getElementById('audioBar').classList.remove('show');
}

document.addEventListener('DOMContentLoaded', renderAudio);
