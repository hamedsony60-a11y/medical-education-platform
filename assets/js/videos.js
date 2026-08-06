function playDemo(el) {
  var title = el.parentElement.querySelector('h3').textContent;
  document.getElementById('playerTitle').textContent = title;
  document.getElementById('playerModal').classList.remove('hidden');
  document.getElementById('localVideo').classList.add('hidden');
}

function closePlayer() {
  document.getElementById('playerModal').classList.add('hidden');
  var v = document.getElementById('localVideo');
  v.pause();
  v.classList.add('hidden');
}

function handleVideoUpload(input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  var url = URL.createObjectURL(file);
  var grid = document.getElementById('videoGrid');
  var card = document.createElement('article');
  card.className = 'card video-card';
  card.innerHTML =
    '<div class="video-thumb" onclick="playUploaded(this, \'' + url + '\')">' +
    '<span class="play-btn">▶</span><span class="duration">آپلود شده</span></div>' +
    '<div class="card-body"><span class="badge">آپلود شما</span>' +
    '<h3>' + file.name + '</h3><p class="muted">همین الان</p></div>';
  grid.prepend(card);
  alert('ویدیو «' + file.name + '» اضافه شد. روی آن کلیک کنید تا پخش شود.');
}

function playUploaded(el, url) {
  document.getElementById('playerTitle').textContent = 'ویدیو آپلود‌شده';
  document.getElementById('playerModal').classList.remove('hidden');
  var v = document.getElementById('localVideo');
  v.src = url;
  v.classList.remove('hidden');
  v.play();
}
