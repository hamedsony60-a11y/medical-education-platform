/* Aryaz AI Agents v3 — real structured replies */
var AGENTS = [
  { id: 'leader', name: 'کوچ رهبری', desc: 'سبک رهبری، تفویض، انگیزش تیم', access: 'free', prompts: ['چطور اعتماد تیم را بسازم؟', 'تفویض اختیار را از کجا شروع کنم؟', 'جلسه یک‌به‌یک چگونه باشد؟'], system: 'leadership' },
  { id: 'growth', name: 'مربی توسعه فردی', desc: 'هدف‌گذاری، عادت، خودآگاهی', access: 'free', prompts: ['یک هدف ۳۰ روزه پیشنهاد بده', 'چطور عادت مطالعه بسازم؟', 'مدیریت زمان'], system: 'growth' },
  { id: 'hr', name: 'مشاور HR', desc: 'جذب، عملکرد، تعارض سازمانی', access: 'free', prompts: ['چارچوب جلسه بازخورد عملکرد', 'استعفای خاموش', 'چک‌لیست آنبوردینگ'], system: 'hr' },
  { id: 'feedback', name: 'تحلیلگر بازخورد', desc: 'بازخورد سازنده (SBI)', access: 'free', prompts: ['بازخورد تأخیر مکرر', 'بازخورد مثبت قوی', 'همکار مقاوم'], system: 'feedback' },
  { id: 'soft', name: 'مربی مهارت نرم', desc: 'ارتباط، مذاکره، هوش هیجانی', access: 'free', prompts: ['تعارض تیمی', 'گوش دادن فعال', 'مذاکره'], system: 'soft' },
  { id: 'org', name: 'مشاور سازمانی', desc: 'فرهنگ و تغییر سازمانی', access: 'free', prompts: ['تغییر فرهنگ', 'سلامت تیم', 'هم‌راستایی استراتژی'], system: 'org' }
];

var currentAgent = null;
var lastAgentReply = '';

function getPlan() { return getStore('aryaz_plan', 'رایگان') || 'رایگان'; }
function canAccess() { return true; }

function showTab(name) {
  document.getElementById('panelChat').classList.toggle('hidden', name !== 'chat');
  document.getElementById('panelHistory').classList.toggle('hidden', name !== 'history');
  document.getElementById('panelOutputs').classList.toggle('hidden', name !== 'outputs');
  ['tabChat','tabHistory','tabOutputs'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('active', (id === 'tabChat' && name === 'chat') || (id === 'tabHistory' && name === 'history') || (id === 'tabOutputs' && name === 'outputs'));
  });
  if (name === 'history') renderHistory();
  if (name === 'outputs') renderOutputs();
}

function renderAgentList() {
  var el = document.getElementById('agentList');
  if (!el) return;
  el.innerHTML = AGENTS.map(function (a) {
    var active = currentAgent && currentAgent.id === a.id ? ' active' : '';
    return '<button type="button" class="agent-item' + active + '" onclick="selectAgent(\'' + a.id + '\')">' +
      '<h4>' + a.name + '</h4><p>' + a.desc + '</p></button>';
  }).join('');
}

function selectAgent(id) {
  var agent = AGENTS.find(function (a) { return a.id === id; });
  if (!agent) return;
  currentAgent = agent;
  var t = document.getElementById('activeAgentTitle');
  var d = document.getElementById('activeAgentDesc');
  if (t) t.textContent = agent.name;
  if (d) d.textContent = agent.desc;
  renderAgentList();
  renderQuickPrompts();
  renderChat();
  if (typeof addActivity === 'function') addActivity('انتخاب Agent: ' + agent.name);
}

function renderQuickPrompts() {
  var box = document.getElementById('quickPrompts');
  if (!box || !currentAgent) return;
  box.innerHTML = currentAgent.prompts.map(function (p) {
    return '<button type="button" onclick="usePrompt(' + JSON.stringify(p) + ')">' + p + '</button>';
  }).join('');
}

function usePrompt(p) {
  document.getElementById('chatInput').value = p;
  sendMessage();
}

function chatKey() { return currentAgent ? 'aryaz_ai_v3_' + currentAgent.id : null; }
function getChat() { var k = chatKey(); return k ? (getStore(k, []) || []) : []; }
function setChat(msgs) { var k = chatKey(); if (k) setStore(k, msgs); }
function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function renderChat() {
  var body = document.getElementById('chatBody');
  if (!body) return;
  if (!currentAgent) {
    body.innerHTML = '<div class="empty-chat"><div style="font-size:2.5rem">🤖</div><p>Agent را انتخاب کنید</p><div class="quick-prompts" id="quickPrompts"></div></div>';
    return;
  }
  var msgs = getChat();
  if (!msgs.length) {
    body.innerHTML = '<div class="empty-chat"><p>گفتگو با <strong>' + currentAgent.name + '</strong></p><div class="quick-prompts" id="quickPrompts"></div></div>';
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

function generateReply(agent, userText) {
  var text = (userText || '').trim();
  var low = text.toLowerCase();

  // greetings
  if (/^(سلام|درود|hi|hello|صبح بخیر|عصر بخیر)/i.test(text) || text.length < 4) {
    var greet = {
      leadership: 'سلام! من کوچ رهبری شما هستم.\nمی‌توانم درباره اعتمادسازی در تیم، تفویض اختیار، جلسات یک‌به‌یک و انگیزش کمکتان کنم.\nسوال مشخص‌تان چیست؟',
      growth: 'سلام! من مربی توسعه فردی هستم.\nبرای هدف‌گذاری، ساخت عادت و مدیریت زمان کنار شما هستم. از کجا شروع کنیم؟',
      hr: 'سلام! من مشاور منابع انسانی هستم.\nدر موضوعاتی مثل بازخورد عملکرد، آنبوردینگ، تعارض سازمانی و نگهداشت نیرو کمکتان می‌کنم. چه چالشی دارید؟',
      feedback: 'سلام! من تحلیلگر بازخورد هستم.\nمی‌توانم متن بازخورد سازنده (مدل SBI) برایتان طراحی کنم. موقعیت را بگویید.',
      soft: 'سلام! من مربی مهارت نرم هستم.\nارتباط مؤثر، مذاکره و مدیریت تعارض — بگویید روی کدام تمرکز کنیم؟',
      org: 'سلام! من مشاور سازمانی هستم.\nفرهنگ سازمانی، تغییر و سلامت تیم حوزه تخصص من است. چه هدفی دارید؟'
    };
    return greet[agent.system] || greet.growth;
  }

  // keyword-based richer answers
  if (/اعتماد|تیم/.test(text) && agent.system === 'leadership') {
    return 'برای ساخت اعتماد در تیم:\n\n۱) قول‌های کوچک و قابل‌اجرا بدهید و دقیقاً انجام دهید.\n۲) اشتباهات را علنی بپذیرید؛ تیم از رهبر آسیب‌پذیر یاد می‌گیرد.\n۳) اطلاعات را شفاف و به‌موقع به اشتراک بگذارید.\n۴) در جلسات یک‌به‌یک بیشتر گوش دهید تا حرف بزنید.\n۵) موفقیت‌ها را عمومی و نقد را خصوصی انجام دهید.\n\nقدم عملی این هفته: یک جلسه ۱۵ دقیقه‌ای با هر عضو برای شنیدن موانع کار.';
  }
  if (/تفویض/.test(text)) {
    return 'تفویض مؤثر در ۴ جزء:\n\n• چه کاری؟ (محدوده مشخص)\n• چه نتیجه‌ای؟ (خروجی قابل اندازه‌گیری)\n• تا کی؟ (مهلت)\n• با چه اختیاری؟ (فقط اطلاع / مشورت / تصمیم مستقل)\n\nبعد از تفویض، یک نقطه بررسی میانی بگذارید — نه میکرو‌مدیریت روزانه.';
  }
  if (/بازخورد|عملکرد/.test(text)) {
    return 'چارچوب جلسه بازخورد عملکرد:\n\n۱) آماده‌سازی با داده و مثال مشخص\n۲) شروع با نیت حمایتی (نه محاکمه)\n۳) مدل SBI:\n   • موقعیت: زمان/مکان مشخص\n   • رفتار: آنچه دیده شد (نه قضاوت شخصیت)\n   • تأثیر: روی تیم/نتیجه/مشتری\n۴) درخواست تغییر + توافق روی قدم بعدی\n۵) زمان پیگیری (مثلاً دو هفته بعد)\n\nجمله نمونه: «در گزارش هفته گذشته، بخش تحلیل داده ناقص بود؛ تیم نتوانست تصمیم بگیرد. از این هفته لطفاً قبل از ارسال، چک‌لیست سه موردی را کامل کنید.»';
  }
  if (/عادت|هدف|۳۰|سی روز/.test(text)) {
    return 'هدف ۳۰ روزه به روش SMART:\n\n• مشخص: فقط یک مهارت\n• قابل اندازه‌گیری: مثلاً ۳ نوبت تمرین در هفته\n• دست‌یافتنی: ۱۵ دقیقه در روز کافی است\n• مرتبط با نقش فعلی شما\n• زمان‌دار: مرور در روز ۳۰\n\nقانون عادت: محرک → رفتار خیلی کوچک → پاداش.\nامروز فقط ۱۰ دقیقه شروع کنید.';
  }
  if (/آنبورد|جذب|استخدام/.test(text)) {
    return 'چک‌لیست آنبوردینگ ۳۰ روزه:\n\nهفته ۱: معرفی نقش، افراد کلیدی، ابزارها و دسترسی‌ها\nهفته ۲: یک خروجی کوچک واقعی با پشتیبانی\nهفته ۳: بازخورد دوطرفه (مدیر ↔ همکار جدید)\nهفته ۴: تعریف اهداف سه‌ماهه\n\nنکته: در ۱۴ روز اول، یک «buddy» سازمانی تعیین کنید.';
  }
  if (/تعارض|درگیری|اختلاف/.test(text)) {
    return 'مدیریت تعارض:\n\n۱) مکث — هیجان را پایین بیاورید\n۲) گوش دادن بدون دفاع\n۳) نگرانی طرف مقابل را با کلمات خودتان بازگو کنید\n۴) نیاز مشترک را پیدا کنید\n۵) روی یک قدم بعدی توافق کنید\n\nجمله مفید: «می‌خواهم مطمئن شوم درست متوجه شدم؛ منظورتان این است که…؟»';
  }
  if (/فرهنگ|سازمان/.test(text)) {
    return 'تغییر فرهنگ سازمانی پایدار نیاز به ۴ لایه هم‌راستا دارد:\n\n۱) روایت رهبری (چرا تغییر؟)\n۲) رفتارهای نمادین مدیران\n۳) سیستم تشویق و ارزیابی\n۴) شاخص‌های قابل مشاهده\n\nبدون این هم‌راستایی، تغییر شعاری می‌ماند.';
  }

  // default by agent specialty
  var defaults = {
    leadership: 'از زاویه رهبری پیشنهاد می‌کنم:\n\n۱) وضعیت را در یک جمله شفاف کنید\n۲) یک رفتار مشخص برای تغییر انتخاب کنید (نه ویژگی شخصیتی)\n۳) انتظار را قابل اندازه‌گیری بگویید\n۴) پشتیبانی و پیگیری هفتگی تعیین کنید\n\nاگر جزئیات بیشتری از موقعیت بدهید، قدم‌های دقیق‌تری می‌نویسم.',
    growth: 'پیشنهاد توسعه فردی:\n\n• یک هدف کوچک برای ۷ روز آینده بنویسید\n• هر روز فقط یک بلوک ۱۵ دقیقه‌ای برای آن بگذارید\n• پیشرفت را شب‌ها در یک خط یادداشت کنید\n\nبگویید روی چه مهارتی تمرکز دارید تا برنامه دقیق‌تر بدهم.',
    hr: 'از نگاه HR:\n\nابتدا سیاست سازمان و مستندسازی را در نظر بگیرید، بعد گفتگوی محترمانه و شفاف.\nبرای موضوع شما این ترتیب معمولاً بهترین نتیجه را می‌دهد:\nداده → گفتگو → توافق کتبی کوتاه → پیگیری.\n\nجزئیات موقعیت را بگویید تا چارچوب دقیق‌تری بدهم.',
    feedback: 'متن بازخورد را با مدل SBI بسازید:\n\n• موقعیت\n• رفتار مشاهده‌شده\n• تأثیر\n• درخواست مشخص\n\nموقعیت واقعی‌تان را در یک خط بنویسید تا متن آماده بازخورد را بنویسم.',
    soft: 'در مهارت نرم این سه کار فوری کمک می‌کند:\n\n۱) قبل از پاسخ، یک نفس و یک سوال شفاف‌ساز\n۲) احساس طرف مقابل را نام ببرید\n۳) روی نیاز مشترک توافق کنید\n\nسناریو را بگویید تا دیالوگ پیشنهادی بنویسم.',
    org: 'در سطح سازمانی: وضوح نقش، اعتماد، تعارض سازنده، تعهد و پاسخگویی را همزمان ببینید.\nکدام بخش الان ضعیف‌تر است تا روی همان تمرکز کنیم؟'
  };
  return defaults[agent.system] || defaults.growth;
}

function sendMessage() {
  if (!currentAgent) {
    if (typeof toast === 'function') toast('ابتدا یک Agent انتخاب کنید');
    else alert('ابتدا یک Agent انتخاب کنید');
    return;
  }
  var input = document.getElementById('chatInput');
  var text = (input.value || '').trim();
  if (!text) return;

  var msgs = getChat();
  var now = new Date().toLocaleString('fa-IR');
  msgs.push({ role: 'user', text: text, time: now });
  input.value = '';
  setChat(msgs);
  renderChat();

  var body = document.getElementById('chatBody');
  body.innerHTML += '<div class="msg agent"><div class="msg-bubble muted">در حال نوشتن پاسخ...</div></div>';
  body.scrollTop = body.scrollHeight;

  setTimeout(function () {
    var reply = generateReply(currentAgent, text);
    lastAgentReply = reply;
    msgs = getChat();
    msgs.push({ role: 'agent', text: reply, time: new Date().toLocaleString('fa-IR') });
    setChat(msgs);
    var log = getStore('aryaz_ai_history', []) || [];
    log.unshift({ agent: currentAgent.name, user: text, reply: reply.slice(0, 180), time: now });
    setStore('aryaz_ai_history', log.slice(0, 50));
    if (typeof addActivity === 'function') addActivity('گفتگو با ' + currentAgent.name);
    renderChat();
  }, 400);
}

function clearCurrentChat() {
  if (!currentAgent) return;
  setChat([]);
  lastAgentReply = '';
  renderChat();
  if (typeof toast === 'function') toast('گفتگو پاک شد');
}

function saveLastOutput() {
  if (!lastAgentReply) {
    if (typeof toast === 'function') toast('پاسخی برای ذخیره نیست');
    return;
  }
  var outs = getStore('aryaz_ai_outputs', []) || [];
  outs.unshift({ agent: currentAgent ? currentAgent.name : 'Agent', text: lastAgentReply, time: new Date().toLocaleString('fa-IR') });
  setStore('aryaz_ai_outputs', outs.slice(0, 30));
  if (typeof addActivity === 'function') addActivity('ذخیره خروجی AI');
  if (typeof toast === 'function') toast('خروجی ذخیره شد');
}

function renderHistory() {
  var log = getStore('aryaz_ai_history', []) || [];
  var el = document.getElementById('historyList');
  if (!el) return;
  if (!log.length) { el.innerHTML = '<p class="muted">هنوز تعاملی نیست</p>'; return; }
  el.innerHTML = log.map(function (h) {
    return '<div style="margin-bottom:10px;padding:12px;border:1px solid #e2e8f0;border-radius:12px"><strong>' + escapeHtml(h.agent) + '</strong> <span class="muted">' + h.time + '</span><p style="margin:8px 0;font-size:.9rem"><strong>شما:</strong> ' + escapeHtml(h.user) + '</p><p class="muted" style="font-size:.85rem">' + escapeHtml(h.reply) + '…</p></div>';
  }).join('');
}

function renderOutputs() {
  var outs = getStore('aryaz_ai_outputs', []) || [];
  var el = document.getElementById('outputsList');
  if (!el) return;
  if (!outs.length) { el.innerHTML = '<p class="muted">خروجی ذخیره‌شده نیست</p>'; return; }
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
