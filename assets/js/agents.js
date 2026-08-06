var currentAgent = null;

function selectAgent(name) {
  currentAgent = name;
  document.getElementById('agentName').textContent = 'Agent فعال: ' + name;
  var hist = getStore('aryaz_chat_' + name, []) || [];
  renderChat(hist);
  if (typeof addActivity === 'function') addActivity('انتخاب Agent: ' + name);
  if (typeof toast === 'function') toast(name + ' فعال شد');
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
  if (!currentAgent) {
    if (typeof toast === 'function') toast('ابتدا یک Agent انتخاب کنید');
    else alert('ابتدا یک Agent انتخاب کنید');
    return;
  }
  var input = document.getElementById('chatInput');
  var text = (input.value || '').trim();
  if (!text) return;
  var key = 'aryaz_chat_' + currentAgent;
  var hist = getStore(key, []) || [];
  hist.push({ role: 'user', text: text });
  hist.push({ role: 'agent', text: demoReply(currentAgent, text) });
  setStore(key, hist.slice(-40));
  input.value = '';
  renderChat(hist);
  if (typeof addActivity === 'function') addActivity('گفتگو با ' + currentAgent);
}

function demoReply(agent, text) {
  var tips = {
    'کوچ رهبری': 'برای رهبری موثر: ۱) هدف را شفاف بگویید ۲) گوش دهید ۳) مسئولیت را تفویض کنید با پیگیری منظم.',
    'مربی توسعه فردی': 'یک هدف کوچک برای ۷ روز آینده بنویسید و هر روز فقط ۱۵ دقیقه روی آن کار کنید.',
    'مشاور HR': 'در مسائل HR ابتدا سیاست سازمان، مستندسازی و گفتگوی محترمانه را در اولویت بگذارید.',
    'تحلیلگر بازخورد': 'بازخورد را با موقعیت مشخص + رفتار مشاهده‌شده + تأثیر + درخواست شروع کنید (مدل SBI).'
  };
  var tip = tips[agent] || 'پاسخ ساختاریافته در نسخه متصل به API ارائه می‌شود.';
  return '[' + agent + '] ' + tip + ' (در پاسخ به: «' + text.slice(0, 50) + (text.length > 50 ? '…' : '') + '»)';
}

document.addEventListener('DOMContentLoaded', function () {
  var input = document.getElementById('chatInput');
  if (input) input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') sendChat();
  });
});
