var currentAgent = null;

function selectAgent(name) {
  currentAgent = name;
  document.getElementById('agentName').textContent = 'Agent فعال: ' + name;
  var hist = getStore('aryaz_chat_' + name, []) || [];
  renderChat(hist);
  addActivity('انتخاب Agent: ' + name);
}

function renderChat(hist) {
  var log = document.getElementById('chatLog');
  if (!hist.length) {
    log.innerHTML = '<p class="muted">گفتگو را شروع کنید...</p>';
    return;
  }
  log.innerHTML = hist.map(function (m) {
    return '<div style="margin:8px 0;text-align:' + (m.role === 'user' ? 'left' : 'right') + '">' +
      '<span style="display:inline-block;padding:8px 12px;border-radius:12px;background:' +
      (m.role === 'user' ? '#dbeafe' : '#e2e8f0') + ';max-width:85%;font-size:.9rem">' + m.text + '</span></div>';
  }).join('');
  log.scrollTop = log.scrollHeight;
}

function sendChat() {
  if (!currentAgent) { toast('ابتدا یک Agent انتخاب کنید'); return; }
  var input = document.getElementById('chatInput');
  var text = (input.value || '').trim();
  if (!text) return;
  var key = 'aryaz_chat_' + currentAgent;
  var hist = getStore(key, []) || [];
  hist.push({ role: 'user', text: text });
  var reply = demoReply(currentAgent, text);
  hist.push({ role: 'agent', text: reply });
  setStore(key, hist.slice(-40));
  input.value = '';
  renderChat(hist);
  addActivity('گفتگو با ' + currentAgent);
}

function demoReply(agent, text) {
  return '[' + agent + '] در نسخه کامل به API مدل زبانی متصل می‌شود. برای پیام شما («' +
    text.slice(0, 40) + (text.length > 40 ? '…' : '') +
    '») پیشنهادی ساختاریافته و مبتنی بر چارچوب‌های توسعه فردی/سازمانی ارائه خواهد شد.';
}

document.getElementById('chatInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') sendChat();
});
