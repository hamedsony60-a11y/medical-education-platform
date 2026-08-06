function playAudioDemo(btn) {
  alert('برای دمو فایل خود را آپلود کنید.');
}
function handleAudioUpload(input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  var url = URL.createObjectURL(file);
  var list = document.getElementById('audioList');
  var item = document.createElement('div');
  item.className = 'card list-item audio-item';
  item.innerHTML = '<div class="audio-icon">🎧</div><div class="flex-1"><span class="badge">آپلود شما</span><h2>' + file.name + '</h2><p class="muted">همین الان</p></div><button class="btn btn-secondary" onclick="playLocal(\'' + url + '\')">پخش</button>';
  list.prepend(item);
  playLocal(url);
}
function playLocal(url) {
  var player = document.getElementById('audioPlayer');
  player.src = url; player.classList.remove('hidden'); player.play();
}
