var AGENTS = [
  { id: 'leader', name: 'کوچ رهبری', desc: 'سبک رهبری، تفویض، انگیزش تیم', access: 'free', prompts: ['چطور اعتماد تیم را بسازم؟', 'تفویض اختیار را از کجا شروع کنم؟', 'جلسه یک‌به‌یک چگونه باشد؟'], system: 'leadership' },
  { id: 'growth', name: 'مربی توسعه فردی', desc: 'هدف‌گذاری، عادت، خودآگاهی', access: 'free', prompts: ['یک هدف ۳۰ روزه پیشنهاد بده', 'چطور عادت مطالعه بسازم؟', 'مدیریت زمان برای مدیر پرمشغله'], system: 'growth' },
  { id: 'hr', name: 'مشاور HR', desc: 'جذب، عملکرد، تعارض سازمانی', access: 'pro', prompts: ['چارچوب جلسه بازخورد عملکرد', 'چطور استعفای خاموش را تشخیص دهم؟', 'چک‌لیست آنبوردینگ ۳۰ روزه'], system: 'hr' },
  { id: 'feedback', name: 'تحلیلگر بازخورد', desc: 'ساختار بازخورد سازنده (SBI)', access: 'pro', prompts: ['بازخورد تأخیر مکرر را بنویس', 'بازخورد مثبت قوی بساز', 'بازخورد به همکار مقاوم'], system: 'feedback' },
  { id: 'soft', name: 'مربی مهارت نرم', desc: 'ارتباط، مذاکره، هوش هیجانی', access: 'pro', prompts: ['در تعارض تیمی چه بگویم؟', 'مهارت گوش دادن فعال', 'مذاکره حقوق'], system: 'soft' },
  { id: 'org', name: 'مشاور سازمانی', desc: 'فرهنگ، تغییر، تیم‌های چندنقشی', access: 'org', prompts: ['نقشه راه تغییر فرهنگ', 'شاخص‌های سلامت تیم', 'هم‌راستایی استراتژی و افراد'], system: 'org' }
];
var currentAgent = null;
var lastAgentReply = '';
function getPlan() { return getStore('aryaz_plan', 'رایگان') || 'رایگان'; }
function canAccess(agent) {
  var plan = getPlan();
  if (agent.access === 'free') return true;
  if (agent.access === 'pro' && (plan === 'حرفه‌ای' || plan === 'سازمانی')) return true;
  if (agent.access === 'org' && plan === 'سازمانی') return true;
  return false;
}
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
  document.getElementById('agentList').innerHTML = AGENTS.map(function (a) {
    var locked = !canAccess(a);
    var active = currentAgent && currentAgent.id === a.id ? ' active' : '';
    return '<button type="button" class="agent-item' + active + '" onclick="selectAgent(\'' + a.id + '\')"><h4>' + a.name + (locked ? ' <span class="lock-badge">قفل</span>' : '') + '</h4><p>' + a.desc + '</p></button>';
  }).join('');
}
function selectAgent(id) {
  var agent = AGENTS.find(function (a) { return a.id === id; });
  if (!agent) return;
  if (!canAccess(agent)) { toast('این Agent برای پلن شما قفل است.'); return; }
  currentAgent = agent;
  document.getElementById('activeAgentTitle').textContent = agent.name;
  document.getElementById('activeAgentDesc').textContent = agent.desc;
  renderAgentList(); renderQuickPrompts(); renderChat();
  addActivity('انتخاب Agent: ' + agent.name);
}
function renderQuickPrompts() {
  var box = document.getElementById('quickPrompts');
  if (!box || !currentAgent) return;
  box.innerHTML = currentAgent.prompts.map(function (p) {
    return '<button type="button" onclick="usePrompt(\'' + p.replace(/'/g, "\\'") + '\')">' + p + '</button>';
  }).join('');
}
function usePrompt(p) { document.getElementById('chatInput').value = p; sendMessage(); }
function chatKey() { return currentAgent ? 'aryaz_ai_chat_' + currentAgent.id : null; }
function getChat() { var k = chatKey(); return k ? (getStore(k, []) || []) : []; }
function setChat(msgs) { var k = chatKey(); if (k) setStore(k, msgs); }
function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function renderChat() {
  var body = document.getElementById('chatBody');
  if (!currentAgent) {
    body.innerHTML = '<div class="empty-chat"><div style="font-size:2.5rem">🤖</div><p>Agent را انتخاب کنید</p><div class="quick-prompts" id="quickPrompts"></div></div>';
    return;
  }
  var msgs = getChat();
  if (!msgs.length) {
    body.innerHTML = '<div class="empty-chat"><p>گفتگو با <strong>' + currentAgent.name + '</strong></p><div class="quick-prompts" id="quickPrompts"></div></div>';
    renderQuickPrompts(); return;
  }
  body.innerHTML = msgs.map(function (m) {
    return '<div class="msg ' + m.role + '"><div class="msg-bubble">' + escapeHtml(m.text) + '</div><div class="msg-meta">' + (m.role === 'user' ? 'شما' : currentAgent.name) + ' · ' + (m.time || '') + '</div></div>';
  }).join('');
  body.scrollTop = body.scrollHeight;
  var last = msgs.filter(function (m) { return m.role === 'agent'; }).pop();
  lastAgentReply = last ? last.text : '';
}
function generateReply(agent, userText) {
  var blocks = {
    leadership: '✅ چارچوب کوچ رهبری:\n۱) وضعیت تیم را شفاف کنید\n۲) یک رفتار مشخص برای تغییر\n۳) انتظار قابل اندازه‌گیری\n۴) پیگیری هفتگی\n\nروی شفافیت هدف و امنیت روانی تمرکز کنید.',
    growth: '✅ هدف SMART + عادت کوچک روزانه (۱۵ دقیقه).\nمحرک → رفتار → پاداش. امروز فقط شروع ۱۰ دقیقه‌ای کافی است.',
    hr: '✅ بازخورد عملکرد: داده → نیت حمایتی → SBI → توافق قدم بعدی → پیگیری.\nآنبوردینگ ۳۰روزه: نقش، خروجی کوچک، بازخورد، اهداف سه‌ماهه.',
    feedback: '✅ مدل SBI:\nموقعیت + رفتار مشاهده‌شده + تأثیر + درخواست مشخص.\nاز قضاوت شخصیتی پرهیز کنید.',
    soft: '✅ تعارض: مکث هیجانی → گوش دادن → بازنویسی نگرانی → نیاز مشترک → قدم بعدی.',
    org: '✅ تغییر فرهنگ: روایت رهبری + رفتار نمادین + سیستم تشویق + شاخص قابل مشاهده.'
  };
  return (blocks[agent.system] || blocks.growth) + '\n\n—\n📌 در نسخه سروری به API مدل زبانی متصل می‌شود. Agent: «' + agent.name + '»';
}
function sendMessage() {
  if (!currentAgent) { toast('ابتدا Agent را انتخاب کنید'); return; }
  if (!canAccess(currentAgent)) { toast('دسترسی ندارید'); return; }
  var input = document.getElementById('chatInput');
  var text = (input.value || '').trim();
  if (!text) return;
  var msgs = getChat();
  var now = new Date().toLocaleString('fa-IR');
  msgs.push({ role: 'user', text: text, time: now });
  input.value = '';
  setChat(msgs);
  renderChat();
  document.getElementById('chatBody').innerHTML += '<div class="msg agent"><div class="msg-bubble muted">در حال تولید پاسخ...</div></div>';
  setTimeout(function () {
    var reply = generateReply(currentAgent, text);
    lastAgentReply = reply;
    msgs = getChat();
    msgs.push({ role: 'agent', text: reply, time: new Date().toLocaleString('fa-IR') });
    setChat(msgs);
    var log = getStore('aryaz_ai_history', []) || [];
    log.unshift({ agent: currentAgent.name, user: text, reply: reply.slice(0, 200), time: now });
    setStore('aryaz_ai_history', log.slice(0, 50));
    addActivity('گفتگو با ' + currentAgent.name);
    renderChat();
  }, 500);
}
function clearCurrentChat() { if (!currentAgent) return; setChat([]); lastAgentReply = ''; renderChat(); toast('گفتگو پاک شد'); }
function saveLastOutput() {
  if (!lastAgentReply) { toast('پاسخی نیست'); return; }
  var outs = getStore('aryaz_ai_outputs', []) || [];
  outs.unshift({ agent: currentAgent ? currentAgent.name : 'Agent', text: lastAgentReply, time: new Date().toLocaleString('fa-IR') });
  setStore('aryaz_ai_outputs', outs.slice(0, 30));
  addActivity('ذخیره خروجی AI');
  toast('خروجی ذخیره شد');
}
function renderHistory() {
  var log = getStore('aryaz_ai_history', []) || [];
  var el = document.getElementById('historyList');
  if (!log.length) { el.innerHTML = '<p class="muted">تعاملی نیست</p>'; return; }
  el.innerHTML = log.map(function (h) {
    return '<div style="margin-bottom:10px;padding:12px;border:1px solid #e2e8f0;border-radius:12px"><strong>' + escapeHtml(h.agent) + '</strong> <span class="muted">' + h.time + '</span><p style="margin:8px 0;font-size:.9rem"><strong>شما:</strong> ' + escapeHtml(h.user) + '</p><p class="muted" style="font-size:.85rem">' + escapeHtml(h.reply) + '…</p></div>';
  }).join('');
}
function renderOutputs() {
  var outs = getStore('aryaz_ai_outputs', []) || [];
  var el = document.getElementById('outputsList');
  if (!outs.length) { el.innerHTML = '<p class="muted">خروجی‌ای ذخیره نشده</p>'; return; }
  el.innerHTML = outs.map(function (o, i) {
    return '<div style="margin-bottom:10px;padding:12px;border:1px solid #e2e8f0;border-radius:12px"><strong>' + escapeHtml(o.agent) + '</strong> <span class="muted">' + o.time + '</span><pre style="white-space:pre-wrap;font-family:inherit;font-size:.88rem;margin:10px 0">' + escapeHtml(o.text) + '</pre><button type="button" class="btn btn-secondary btn-sm" onclick="deleteOutput(' + i + ')">حذف</button></div>';
  }).join('');
}
function deleteOutput(i) {
  var outs = getStore('aryaz_ai_outputs', []) || [];
  outs.splice(i, 1);
  setStore('aryaz_ai_outputs', outs);
  renderOutputs();
}
document.addEventListener('DOMContentLoaded', function () {
  var badge = document.getElementById('planBadge');
  if (badge) badge.textContent = 'پلن: ' + getPlan();
  renderAgentList();
  var input = document.getElementById('chatInput');
  if (input) input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
});
