/* Aryaz AI Agents v3 */
var AGENTS = [
  { id: 'leader', name: 'کوچ رهبری', desc: 'سبک رهبری، تفویض، انگیزش تیم', access: 'free', prompts: ['چطور اعتماد تیم را بسازم؟', 'تفویض اختیار', 'جلسه یک‌به‌یک'], system: 'leadership' },
  { id: 'growth', name: 'مربی توسعه فردی', desc: 'هدف‌گذاری و عادت', access: 'free', prompts: ['هدف ۳۰ روزه', 'عادت مطالعه', 'مدیریت زمان'], system: 'growth' },
  { id: 'hr', name: 'مشاور HR', desc: 'عملکرد و منابع انسانی', access: 'free', prompts: ['بازخورد عملکرد', 'آنبوردینگ', 'استعفای خاموش'], system: 'hr' },
  { id: 'feedback', name: 'تحلیلگر بازخورد', desc: 'مدل SBI', access: 'free', prompts: ['بازخورد تأخیر', 'بازخورد مثبت', 'همکار مقاوم'], system: 'feedback' },
  { id: 'soft', name: 'مربی مهارت نرم', desc: 'ارتباط و تعارض', access: 'free', prompts: ['تعارض تیمی', 'گوش دادن فعال'], system: 'soft' },
  { id: 'org', name: 'مشاور سازمانی', desc: 'فرهنگ سازمانی', access: 'free', prompts: ['تغییر فرهنگ', 'سلامت تیم'], system: 'org' }
];
var currentAgent = null;
var lastAgentReply = '';
function getPlan() { return getStore('aryaz_plan', 'رایگان') || 'رایگان'; }
function canAccess() { return true; }
function showTab(name) {
  document.getElementById('panelChat').classList.toggle('hidden', name !== 'chat');
  document.getElementById('panelHistory').classList.toggle('hidden', name !== 'history');
  document.getElementById('panelOutputs').classList.toggle('hidden', name !== 'outputs');
  document.getElementById('tabChat').classList.toggle('active', name === 'chat');
  document.getElementById('tabHistory').classList.toggle('active', name === 'history');
  document.getElementById('tabOutputs').classList.toggle('active', name === 'outputs');
  if (name === 'history') renderHistory();
  if (name === 'outputs') renderOutputs();
}
function renderAgentList() {
  var el = document.getElementById('agentList');
  if (!el) return;
  el.innerHTML = AGENTS.map(function (a) {
    var active = currentAgent && currentAgent.id === a.id ? ' active' : '';
    return '<button type="button" class="agent-item' + active + '" onclick="selectAgent(\'' + a.id + '\')"><h4>' + a.name + '</h4><p>' + a.desc + '</p></button>';
  }).join('');
}
function selectAgent(id) {
  currentAgent = AGENTS.find(function (a) { return a.id === id; });
  if (!currentAgent) return;
  document.getElementById('activeAgentTitle').textContent = currentAgent.name;
  document.getElementById('activeAgentDesc').textContent = currentAgent.desc;
  renderAgentList(); renderQuickPrompts(); renderChat();
}
function renderQuickPrompts() {
  var box = document.getElementById('quickPrompts');
  if (!box || !currentAgent) return;
  box.innerHTML = currentAgent.prompts.map(function (p) {
    return '<button type="button" onclick=\'usePrompt(' + JSON.stringify(p) + ')\'>' + p + '</button>';
  }).join('');
}
function usePrompt(p) { document.getElementById('chatInput').value = p; sendMessage(); }
function chatKey() { return currentAgent ? 'aryaz_ai_v3_' + currentAgent.id : null; }
function getChat() { var k = chatKey(); return k ? (getStore(k, []) || []) : []; }
function setChat(msgs) { var k = chatKey(); if (k) setStore(k, msgs); }
function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function renderChat() {
  var body = document.getElementById('chatBody');
  if (!currentAgent) { body.innerHTML = '<div class="empty-chat"><p>Agent را انتخاب کنید</p></div>'; return; }
  var msgs = getChat();
  if (!msgs.length) {
    body.innerHTML = '<div class="empty-chat"><p>گفتگو با <strong>' + currentAgent.name + '</strong></p><div class="quick-prompts" id="quickPrompts"></div></div>';
    renderQuickPrompts(); return;
  }
  body.innerHTML = msgs.map(function (m) {
    return '<div class="msg ' + m.role + '"><div class="msg-bubble">' + escapeHtml(m.text) + '</div><div class="msg-meta">' + (m.role === 'user' ? 'شما' : currentAgent.name) + '</div></div>';
  }).join('');
  body.scrollTop = body.scrollHeight;
  var last = msgs.filter(function (m) { return m.role === 'agent'; }).pop();
  lastAgentReply = last ? last.text : '';
}
function generateReply(agent, userText) {
  var text = (userText || '').trim();
  if (/^(سلام|درود|hi|hello)/i.test(text) || text.length < 4) {
    var g = {
      leadership: 'سلام! من کوچ رهبری هستم. درباره اعتماد تیم، تفویض و جلسات یک‌به‌یک بپرسید.',
      growth: 'سلام! من مربی توسعه فردی هستم. هدف‌گذاری و عادت‌سازی تخصص من است.',
      hr: 'سلام! من مشاور HR هستم. بازخورد عملکرد، آنبوردینگ و تعارض سازمانی را پوشش می‌دهم. چه چالشی دارید؟',
      feedback: 'سلام! بازخورد سازنده با مدل SBI می‌سازم. موقعیت را بگویید.',
      soft: 'سلام! روی ارتباط مؤثر و مدیریت تعارض کار می‌کنیم.',
      org: 'سلام! مشاور فرهنگ و تغییر سازمانی هستم.'
    };
    return g[agent.system] || g.growth;
  }
  if (/بازخورد|عملکرد/.test(text)) return 'چارچوب بازخورد:\n۱) داده مشخص\n۲) نیت حمایتی\n۳) SBI (موقعیت-رفتار-تأثیر)\n۴) درخواست + پیگیری\n\nمثال: «در گزارش هفته قبل بخش تحلیل ناقص بود؛ تیم عقب افتاد. از این هفته چک‌لیست را قبل از ارسال کامل کنید.»';
  if (/اعتماد|تیم/.test(text)) return 'اعتماد تیم:\n• قول کوچک و اجرا\n• پذیرش اشتباه\n• شفافیت اطلاعات\n• گوش دادن در یک‌به‌یک\n• تشویق عمومی، نقد خصوصی';
  if (/عادت|هدف/.test(text)) return 'هدف SMART + عادت ۱۵ دقیقه‌ای روزانه.\nمحرک → رفتار کوچک → پاداش. امروز فقط ۱۰ دقیقه شروع کنید.';
  if (/تعارض/.test(text)) return 'تعارض: مکث → گوش دادن → بازنویسی نگرانی → نیاز مشترک → قدم بعدی.';
  var d = {
    leadership: '۱) وضعیت را شفاف کنید ۲) یک رفتار مشخص برای تغییر ۳) انتظار قابل اندازه‌گیری ۴) پیگیری هفتگی.',
    growth: 'یک هدف ۷ روزه بنویسید و هر روز ۱۵ دقیقه برایش وقت بگذارید.',
    hr: 'ترتیب پیشنهادی: داده → گفتگوی محترمانه → توافق کوتاه → پیگیری.',
    feedback: 'SBI: موقعیت + رفتار + تأثیر + درخواست مشخص.',
    soft: 'قبل از پاسخ یک سوال شفاف‌ساز بپرسید و احساس طرف مقابل را نام ببرید.',
    org: 'روایت رهبری + رفتار نمادین + سیستم تشویق + شاخص قابل مشاهده.'
  };
  return d[agent.system] || d.growth;
}
function sendMessage() {
  if (!currentAgent) { toast('Agent را انتخاب کنید'); return; }
  var input = document.getElementById('chatInput');
  var text = (input.value || '').trim();
  if (!text) return;
  var msgs = getChat();
  msgs.push({ role: 'user', text: text, time: new Date().toLocaleString('fa-IR') });
  input.value = '';
  setChat(msgs);
  renderChat();
  setTimeout(function () {
    var reply = generateReply(currentAgent, text);
    lastAgentReply = reply;
    msgs = getChat();
    msgs.push({ role: 'agent', text: reply, time: new Date().toLocaleString('fa-IR') });
    setChat(msgs);
    var log = getStore('aryaz_ai_history', []) || [];
    log.unshift({ agent: currentAgent.name, user: text, reply: reply.slice(0, 180), time: new Date().toLocaleString('fa-IR') });
    setStore('aryaz_ai_history', log.slice(0, 50));
    renderChat();
  }, 350);
}
function clearCurrentChat() { if (!currentAgent) return; setChat([]); lastAgentReply = ''; renderChat(); toast('گفتگو پاک شد'); }
function saveLastOutput() {
  if (!lastAgentReply) { toast('پاسخی نیست'); return; }
  var outs = getStore('aryaz_ai_outputs', []) || [];
  outs.unshift({ agent: currentAgent.name, text: lastAgentReply, time: new Date().toLocaleString('fa-IR') });
  setStore('aryaz_ai_outputs', outs.slice(0, 30));
  toast('ذخیره شد');
}
function renderHistory() {
  var log = getStore('aryaz_ai_history', []) || [];
  var el = document.getElementById('historyList');
  if (!log.length) { el.innerHTML = '<p class="muted">خالی</p>'; return; }
  el.innerHTML = log.map(function (h) {
    return '<div style="padding:12px;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:8px"><strong>' + escapeHtml(h.agent) + '</strong><p>' + escapeHtml(h.user) + '</p><p class="muted">' + escapeHtml(h.reply) + '</p></div>';
  }).join('');
}
function renderOutputs() {
  var outs = getStore('aryaz_ai_outputs', []) || [];
  var el = document.getElementById('outputsList');
  if (!outs.length) { el.innerHTML = '<p class="muted">خالی</p>'; return; }
  el.innerHTML = outs.map(function (o, i) {
    return '<div style="padding:12px;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:8px"><strong>' + escapeHtml(o.agent) + '</strong><pre style="white-space:pre-wrap;font-family:inherit">' + escapeHtml(o.text) + '</pre><button class="btn btn-sm btn-secondary" onclick="deleteOutput(' + i + ')">حذف</button></div>';
  }).join('');
}
function deleteOutput(i) { var o = getStore('aryaz_ai_outputs', []) || []; o.splice(i, 1); setStore('aryaz_ai_outputs', o); renderOutputs(); }
document.addEventListener('DOMContentLoaded', function () {
  var b = document.getElementById('planBadge');
  if (b) b.textContent = 'پلن: ' + getPlan();
  renderAgentList();
  var input = document.getElementById('chatInput');
  if (input) input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
});
