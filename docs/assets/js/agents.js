var AGENTS = [
  {
    id: 'leader',
    name: 'کوچ رهبری',
    desc: 'سبک رهبری، تفویض، انگیزش تیم',
    access: 'free',
    prompts: ['چطور اعتماد تیم را بسازم؟', 'تفویض اختیار را از کجا شروع کنم؟', 'جلسه یک‌به‌یک چگونه باشد؟'],
    system: 'leadership'
  },
  {
    id: 'growth',
    name: 'مربی توسعه فردی',
    desc: 'هدف‌گذاری، عادت، خودآگاهی',
    access: 'free',
    prompts: ['یک هدف ۳۰ روزه پیشنهاد بده', 'چطور عادت مطالعه بسازم؟', 'مدیریت زمان برای مدیر پرمشغله'],
    system: 'growth'
  },
  {
    id: 'hr',
    name: 'مشاور HR',
    desc: 'جذب، عملکرد، تعارض سازمانی',
    access: 'pro',
    prompts: ['چارچوب جلسه بازخورد عملکرد', 'چطور استعفای خاموش را تشخیص دهم؟', 'چک‌لیست آنبوردینگ ۳۰ روزه'],
    system: 'hr'
  },
  {
    id: 'feedback',
    name: 'تحلیلگر بازخورد',
    desc: 'ساختار بازخورد سازنده (SBI)',
    access: 'pro',
    prompts: ['بازخورد تأخیر مکرر را بنویس', 'بازخورد مثبت قوی بساز', 'بازخورد به همکار مقاوم'],
    system: 'feedback'
  },
  {
    id: 'soft',
    name: 'مربی مهارت نرم',
    desc: 'ارتباط، مذاکره، هوش هیجانی',
    access: 'pro',
    prompts: ['در تعارض تیمی چه بگویم؟', 'مهارت گوش دادن فعال', 'مذاکره حقوق'],
    system: 'soft'
  },
  {
    id: 'org',
    name: 'مشاور سازمانی',
    desc: 'فرهنگ، تغییر، تیم‌های چندنقشی',
    access: 'org',
    prompts: ['نقشه راه تغییر فرهنگ', 'شاخص‌های سلامت تیم', 'هم‌راستایی استراتژی و افراد'],
    system: 'org'
  }
];

var currentAgent = null;
var lastAgentReply = '';

function getPlan() {
  return getStore('aryaz_plan', 'رایگان') || 'رایگان';
}

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
  var el = document.getElementById('agentList');
  el.innerHTML = AGENTS.map(function (a) {
    var locked = !canAccess(a);
    var active = currentAgent && currentAgent.id === a.id ? ' active' : '';
    return '<button type="button" class="agent-item' + active + '" onclick="selectAgent(\'' + a.id + '\')">' +
      '<h4>' + a.name + (locked ? ' <span class="lock-badge">قفل</span>' : '') + '</h4>' +
      '<p>' + a.desc + '</p></button>';
  }).join('');
}

function selectAgent(id) {
  var agent = AGENTS.find(function (a) { return a.id === id; });
  if (!agent) return;
  if (!canAccess(agent)) {
    toast('این Agent برای پلن شما قفل است. به عضویت حرفه‌ای ارتقا دهید.');
    return;
  }
  currentAgent = agent;
  document.getElementById('activeAgentTitle').textContent = agent.name;
  document.getElementById('activeAgentDesc').textContent = agent.desc;
  renderAgentList();
  renderQuickPrompts();
  renderChat();
  addActivity('انتخاب Agent: ' + agent.name);
}

function renderQuickPrompts() {
  var box = document.getElementById('quickPrompts');
  if (!currentAgent) { box.innerHTML = ''; return; }
  box.innerHTML = currentAgent.prompts.map(function (p) {
    return '<button type="button" onclick="usePrompt(\'' + p.replace(/'/g, "\\'") + '\')">' + p + '</button>';
  }).join('');
}

function usePrompt(p) {
  document.getElementById('chatInput').value = p;
  sendMessage();
}

function chatKey() {
  return currentAgent ? 'aryaz_ai_chat_' + currentAgent.id : null;
}

function getChat() {
  var k = chatKey();
  return k ? (getStore(k, []) || []) : [];
}

function setChat(msgs) {
  var k = chatKey();
  if (k) setStore(k, msgs);
}

function renderChat() {
  var body = document.getElementById('chatBody');
  if (!currentAgent) {
    body.innerHTML = '<div class="empty-chat"><div style="font-size:2.5rem">🤖</div><p>Agent را انتخاب کنید</p><div class="quick-prompts" id="quickPrompts"></div></div>';
    return;
  }
  var msgs = getChat();
  if (!msgs.length) {
    body.innerHTML = '<div class="empty-chat"><p>گفتگو با <strong>' + currentAgent.name + '</strong> را شروع کنید</p><div class="quick-prompts" id="quickPrompts"></div></div>';
    renderQuickPrompts();
    return;
  }
  body.innerHTML = msgs.map(function (m) {
    return '<div class="msg ' + m.role + '"><div class="msg-bubble">' + escapeHtml(m.text) + '</div>' +
      '<div class="msg-meta">' + (m.role === 'user' ? 'شما' : currentAgent.name) + ' · ' + (m.time || '') + '</div></div>';
  }).join('');
  body.scrollTop = body.scrollHeight;
  var last = msgs.filter(function (m) { return m.role === 'agent'; }).pop();
  lastAgentReply = last ? last.text : '';
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateReply(agent, userText) {
  var t = userText.toLowerCase();
  var blocks = {
    leadership: [
      '✅ چارچوب پیشنهادی کوچ رهبری:\n۱) وضعیت فعلی تیم را در یک جمله تعریف کنید.\n۲) یک رفتار مشخص برای تغییر انتخاب کنید (نه شخصیت).\n۳) انتظار را شفاف و قابل اندازه‌گیری بگویید.\n۴) پشتیبانی و پیگیری هفتگی تعیین کنید.\n\nبرای پیام شما: روی شفافیت هدف و امنیت روانی تیم تمرکز کنید.',
      '✅ تفویض مؤثر:\n• کار + نتیجه مورد انتظار + مهلت\n• سطح اختیار را مشخص کنید\n• نقطه بررسی میانی بگذارید\n• بعد از اتمام، بازخورد یادگیری بدهید.'
    ],
    growth: [
      '✅ هدف ۳۰ روزه (SMART):\n• مشخص: یک مهارت واحد\n• قابل اندازه‌گیری: مثلاً ۳ جلسه تمرین در هفته\n• دست‌یافتنی: ۱۵–۲۰ دقیقه در روز\n• مرتبط با نقش فعلی\n• زمان‌دار: مرور در روز ۳۰\n\nقدم اول امروز: فقط ۱۰ دقیقه شروع کنید.',
      '✅ ساخت عادت:\nمحرک → رفتار کوچک → پاداش.\nعادت را به روال موجود وصل کنید (بعد از چای صبحگاهی / پایان جلسه اول).'
    ],
    hr: [
      '✅ جلسه بازخورد عملکرد:\n۱) آماده‌سازی با داده\n۲) باز کردن با نیت حمایتی\n۳) مدل SBI (موقعیت-رفتار-تأثیر)\n۴) درخواست تغییر + توافق روی قدم بعدی\n۵) زمان پیگیری',
      '✅ آنبوردینگ ۳۰ روزه:\nهفته ۱: نقش، افراد، ابزار\nهفته ۲: اولین خروجی کوچک\nهفته ۳: بازخورد دو طرفه\nهفته ۴: هدف‌های سه‌ماهه'
    ],
    feedback: [
      '✅ بازخورد به سبک SBI:\n• موقعیت: در جلسه دیروز پروژه X\n• رفتار: موعد گزارش را بدون اطلاع جابه‌جا کردید\n• تأثیر: تیم نتوانست تصمیم بگیرد و یک روز عقب افتادیم\n• درخواست: از این به بعد تغییر زمان را ۲۴ ساعت زودتر اعلام کنید.',
      '✅ بازخورد مثبت قوی: رفتار مشخص + تأثیر روی تیم/نتیجه + تشویق به ادامه.'
    ],
    soft: [
      '✅ در تعارض:\n۱) مکث و تنظیم هیجان\n۲) گوش دادن بدون دفاع\n۳) بازنویسی نگرانی طرف مقابل\n۴) یافتن نیاز مشترک\n۵) توافق روی قدم بعدی',
      '✅ گوش دادن فعال: تماس چشمی، تأیید کوتاه، سوال شفاف‌ساز، خلاصه‌سازی.'
    ],
    org: [
      '✅ تغییر فرهنگ: روایت رهبری + رفتارهای نمادین + سیستم تشویق + شاخص‌های قابل مشاهده.\nبدون هم‌راستایی این چهار لایه، تغییر پایدار نمی‌ماند.',
      '✅ سلامت تیم: وضوح نقش، اعتماد، تعارض سازنده، تعهد، پاسخگویی، نتایج (مدل Lencioni).'
    ]
  };
  var pool = blocks[agent.system] || blocks.growth;
  var base = pool[Math.floor(Math.random() * pool.length)];
  return base + '\n\n—\n📌 نسخه کامل پلتفرم به API مدل زبانی متصل می‌شود؛ این پاسخ، نمونه ساختاریافته Agent «' + agent.name + '» است.';
}

function sendMessage() {
  if (!currentAgent) { toast('ابتدا یک Agent انتخاب کنید'); return; }
  if (!canAccess(currentAgent)) { toast('دسترسی ندارید'); return; }
  var input = document.getElementById('chatInput');
  var text = (input.value || '').trim();
  if (!text) return;

  var msgs = getChat();
  var now = new Date().toLocaleString('fa-IR');
  msgs.push({ role: 'user', text: text, time: now });

  // simulate API latency
  input.value = '';
  setChat(msgs);
  renderChat();
  bodyTyping();

  setTimeout(function () {
    var reply = generateReply(currentAgent, text);
    lastAgentReply = reply;
    msgs = getChat();
    msgs.push({ role: 'agent', text: reply, time: new Date().toLocaleString('fa-IR') });
    setChat(msgs);
    logInteraction(currentAgent.name, text, reply);
    addActivity('گفتگو با ' + currentAgent.name);
    renderChat();
  }, 600);
}

function bodyTyping() {
  var body = document.getElementById('chatBody');
  body.innerHTML += '<div class="msg agent"><div class="msg-bubble muted">در حال تولید پاسخ...</div></div>';
  body.scrollTop = body.scrollHeight;
}

function logInteraction(agentName, userText, reply) {
  var log = getStore('aryaz_ai_history', []) || [];
  log.unshift({ agent: agentName, user: userText, reply: reply.slice(0, 200), time: new Date().toLocaleString('fa-IR') });
  setStore('aryaz_ai_history', log.slice(0, 50));
}

function clearCurrentChat() {
  if (!currentAgent) return;
  setChat([]);
  lastAgentReply = '';
  renderChat();
  toast('گفتگو پاک شد');
}

function saveLastOutput() {
  if (!lastAgentReply) { toast('پاسخی برای ذخیره نیست'); return; }
  var outs = getStore('aryaz_ai_outputs', []) || [];
  outs.unshift({
    agent: currentAgent ? currentAgent.name : 'Agent',
    text: lastAgentReply,
    time: new Date().toLocaleString('fa-IR')
  });
  setStore('aryaz_ai_outputs', outs.slice(0, 30));
  addActivity('ذخیره خروجی AI');
  toast('خروجی ذخیره شد');
}

function renderHistory() {
  var log = getStore('aryaz_ai_history', []) || [];
  var el = document.getElementById('historyList');
  if (!log.length) { el.innerHTML = '<p class="muted">هنوز تعاملی ثبت نشده</p>'; return; }
  el.innerHTML = log.map(function (h) {
    return '<div class="output-card" style="margin-bottom:10px;padding:12px;border:1px solid #e2e8f0;border-radius:12px">' +
      '<strong>' + escapeHtml(h.agent) + '</strong> <span class="muted" style="font-size:.8rem">' + h.time + '</span>' +
      '<p style="margin:8px 0 4px;font-size:.9rem"><strong>شما:</strong> ' + escapeHtml(h.user) + '</p>' +
      '<p class="muted" style="font-size:.85rem">' + escapeHtml(h.reply) + '…</p></div>';
  }).join('');
}

function renderOutputs() {
  var outs = getStore('aryaz_ai_outputs', []) || [];
  var el = document.getElementById('outputsList');
  if (!outs.length) { el.innerHTML = '<p class="muted">خروجی ذخیره‌شده‌ای نیست. در گفتگو «ذخیره آخرین پاسخ» را بزنید.</p>'; return; }
  el.innerHTML = outs.map(function (o, i) {
    return '<div class="output-card" style="margin-bottom:10px;padding:12px;border:1px solid #e2e8f0;border-radius:12px">' +
      '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">' +
      '<strong>' + escapeHtml(o.agent) + '</strong><span class="muted" style="font-size:.8rem">' + o.time + '</span></div>' +
      '<pre style="white-space:pre-wrap;font-family:inherit;font-size:.88rem;margin:10px 0;line-height:1.7">' + escapeHtml(o.text) + '</pre>' +
      '<button type="button" class="btn btn-secondary btn-sm" onclick="deleteOutput(' + i + ')">حذف</button></div>';
  }).join('');
}

function deleteOutput(i) {
  var outs = getStore('aryaz_ai_outputs', []) || [];
  outs.splice(i, 1);
  setStore('aryaz_ai_outputs', outs);
  renderOutputs();
  toast('حذف شد');
}

document.addEventListener('DOMContentLoaded', function () {
  var plan = getPlan();
  var badge = document.getElementById('planBadge');
  if (badge) badge.textContent = 'پلن: ' + plan;
  renderAgentList();
  var input = document.getElementById('chatInput');
  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
  }
});
