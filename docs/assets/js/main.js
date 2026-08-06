document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () { nav.classList.toggle('open'); });
  }
});

function toast(msg) {
  var t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 2800);
}

function getStore(key, fallback) {
  try {
    var v = localStorage.getItem(key);
    return v ? JSON.parse(v) : (fallback || null);
  } catch (e) { return fallback || null; }
}

function setStore(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}

function addActivity(text) {
  var list = getStore('med_activity', []) || [];
  list.unshift({ text: text, time: new Date().toLocaleString('fa-IR') });
  if (list.length > 30) list = list.slice(0, 30);
  setStore('med_activity', list);
}
