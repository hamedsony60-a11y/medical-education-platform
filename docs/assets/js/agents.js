/* Aryaz AI Engine v5 — high-capability client agent */
var AGENTS = [
  { id: 'leader', name: 'کوچ رهبری', desc: 'رهبری تیم، تفویض، انگیزش، جلسات', icon: '👔', system: 'leadership',
    prompts: ['اعتماد تیم ضعیف است', 'چطور تفویض کنم بدون از دست دادن کنترل؟', 'جلسه یک‌به‌یک مؤثر', 'تیم بی‌انگیزه شده'] },
  { id: 'growth', name: 'مربی توسعه فردی', desc: 'هدف، عادت، تمرکز، خودآگاهی', icon: '🌱', system: 'growth',
    prompts: ['برنامه ۳۰ روزه رشد', 'عادت مطالعه نمی‌ماند', 'مدیریت زمان برای مدیر', 'فرسودگی شغلی'] },
  { id: 'hr', name: 'مشاور HR', desc: 'عملکرد، جذب، نگهداشت، تعارض', icon: '📋', system: 'hr',
    prompts: ['جلسه بازخورد سخت', 'استعفای خاموش', 'آنبوردینگ ۳۰ روزه', 'تعدیل نیرو با احترام'] },
  { id: 'feedback', name: 'تحلیلگر بازخورد', desc: 'متن بازخورد SBI و دشوار', icon: '💬', system: 'feedback',
    prompts: ['بازخورد تأخیر مکرر بنویس', 'بازخورد به مدیر مافوق', 'بازخورد مثبت قوی', 'همکار دفاعی'] },
  { id: 'soft', name: 'مربی مهارت نرم', desc: 'ارتباط، مذاکره، تعارض، EQ', icon: '🤝', system: 'soft',
    prompts: ['تعارض با همکار ارشد', 'مذاکره افزایش حقوق', 'گوش دادن فعال', 'نه گفتن محترمانه'] },
  { id: 'org', name: 'مشاور سازمانی', desc: 'فرهنگ، تغییر، ساختار تیم', icon: '🏢', system: 'org',
    prompts: ['تغییر فرهنگ سلسله‌مراتبی', 'ادغام دو تیم', 'شاخص سلامت تیم', 'مقاومت در برابر تغییر'] }
];

var currentAgent = null;
var lastAgentReply = '';

function getPlan() { return getStore('aryaz_plan', 'رایگان') || 'رایگان'; }

function showTab(name) {
  document.getElementById('panelChat').classList.toggle('hidden', name !== 'chat');
  document.getElementById('panelHistory').classList.toggle('hidden', name !== 'history');
  document.getElementById('panelOutputs').classList.toggle('hidden', name !== 'outputs');
  var map = { chat: 'tabChat', history: 'tabHistory', outputs: 'tabOutputs' };
  Object.keys(map).forEach(function (k) {
    var el = document.getElementById(map[k]);
    if (el) el.classList.toggle('active', k === name);
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
      '<h4>' + (a.icon || '🤖') + ' ' + a.name + '</h4><p>' + a.desc + '</p></button>';
  }).join('');
}

function selectAgent(id) {
  currentAgent = AGENTS.find(function (a) { return a.id === id; }) || null;
  if (!currentAgent) return;
  var t = document.getElementById('activeAgentTitle');
  var d = document.getElementById('activeAgentDesc');
  if (t) t.textContent = (currentAgent.icon || '') + ' ' + currentAgent.name;
  if (d) d.textContent = currentAgent.desc;
  renderAgentList();
  renderChat();
  if (typeof addActivity === 'function') addActivity('Agent: ' + currentAgent.name);
}

function renderQuickPrompts() {
  var box = document.getElementById('quickPrompts');
  if (!box || !currentAgent) return;
  box.innerHTML = currentAgent.prompts.map(function (p) {
    return '<button type="button" onclick=\'usePrompt(' + JSON.stringify(p) + ')\'>' + p + '</button>';
  }).join('');
}

function usePrompt(p) {
  document.getElementById('chatInput').value = p;
  sendMessage();
}

function chatKey() { return currentAgent ? 'aryaz_ai_v5_' + currentAgent.id : null; }
function getChat() { var k = chatKey(); return k ? (getStore(k, []) || []) : []; }
function setChat(msgs) { var k = chatKey(); if (k) setStore(k, msgs.slice(-60)); }
function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function renderChat() {
  var body = document.getElementById('chatBody');
  if (!body) return;
  if (!currentAgent) {
    body.innerHTML = '<div class="empty-chat"><div style="font-size:2.5rem">🤖</div><p>یک Agent انتخاب کنید</p></div>';
    return;
  }
  var msgs = getChat();
  if (!msgs.length) {
    body.innerHTML = '<div class="empty-chat"><p>گفتگو با <strong>' + currentAgent.name + '</strong></p>' +
      '<p class="muted" style="font-size:.85rem;margin-top:8px">سوال دقیق‌تر = پاسخ دقیق‌تر</p>' +
      '<div class="quick-prompts" id="quickPrompts"></div></div>';
    renderQuickPrompts();
    return;
  }
  body.innerHTML = msgs.map(function (m) {
    return '<div class="msg ' + m.role + '"><div class="msg-bubble">' + escapeHtml(m.text) + '</div>' +
      '<div class="msg-meta">' + (m.role === 'user' ? 'شما' : currentAgent.name) + (m.time ? ' · ' + m.time : '') + '</div></div>';
  }).join('');
  body.scrollTop = body.scrollHeight;
  var last = null;
  for (var i = msgs.length - 1; i >= 0; i--) { if (msgs[i].role === 'agent') { last = msgs[i]; break; } }
  lastAgentReply = last ? last.text : '';
}

/* ========== INTENT ENGINE ========== */
function detectIntents(text) {
  var t = text.toLowerCase();
  var intents = [];
  var rules = [
    ['greet', /^(سلام|درود|hi|hello|صبح|عصر|خوبی|چطوری)[\s!?.]*$/i],
    ['thanks', /(ممنون|مرسی|متشکر|عالی بود|دمت گرم)/],
    ['trust', /(اعتماد|بی‌اعتماد|شک به تیم|شفافیت)/],
    ['delegate', /(تفویض|واگذار|سپردن کار|میکرو.?مدیر|کنترل زیاد)/],
    ['oneonone', /(یک.?به.?یک|1:1|وان.?آن|جلسه فردی)/],
    ['motivation', /(بی.?انگیزه|انگیزش|بی.?انگیزگی|خستگی تیم|کم.?کاری)/],
    ['feedback', /(بازخورد|فیدبک|feedback|انتقاد سازنده)/],
    ['performance', /(عملکرد|ارزیابی|KPI|نمره عملکرد|weak performance)/],
    ['conflict', /(تعارض|درگیری|اختلاف|دعوا|تنش|conflict)/],
    ['quiet_quit', /(استعفای خاموش|quiet quit|بی.?تفاوتی|حداقل کار)/],
    ['onboard', /(آنبورد|onboard|همکار جدید|استخدام جدید|جذب)/],
    ['layoff', /(تعدیل|اخراج|قطع همکاری|layoff|جدا شدن)/],
    ['habit', /(عادت|habit|پایدار نمی|رژیم مطالعه|تداوم)/],
    ['goal', /(هدف|goal|برنامه ۳۰|سی روز|SMART|اسمارت)/],
    ['time', /(مدیریت زمان|وقت کم|پرمشغله|اولویت|time manage)/],
    ['burnout', /(فرسودگی|burnout|خستگی شدید|از پا درآمدن)/],
    ['negotiate', /(مذاکره|حقوق|افزایش حقوق|پیشنهاد شغلی|offer)/],
    ['say_no', /(نه گفتن|رد کردن درخواست|boundary|مرزگذاری)/],
    ['listen', /(گوش دادن|شنیدن فعال|active listen)/],
    ['culture', /(فرهنگ|culture|سلسله.?مراتب|ارزش.?های سازمان)/],
    ['change', /(مقاومت|تغییر|change manage|تحول)/],
    ['merge', /(ادغام|ادغام تیم|merge team|دو تیم)/],
    ['health', /(سلامت تیم|team health|لینچیونی|Lencioni)/],
    ['delay', /(تأخیر|دیر کردن|موعد|deadline|دیلاین)/],
    ['defensive', /(دفاعی|مقاوم|گیرنده نیست|قبول نمی.?کند)/],
    ['upward', /(به مدیر|مافوق|بالادستی|به رئیس)/],
    ['positive_fb', /(بازخورد مثبت|تشویق|قدردانی|آفرین)/]
  ];
  rules.forEach(function (r) { if (r[1].test(t) || r[1].test(text)) intents.push(r[0]); });
  if (!intents.length) intents.push('general');
  return intents;
}

function recentUserContext(msgs) {
  return msgs.filter(function (m) { return m.role === 'user'; }).slice(-3).map(function (m) { return m.text; }).join(' | ');
}

function playbook(key, agentName) {
  var PB = {
    greet_leadership: 'سلام 👋 من کوچ رهبری شما هستم.\n\nمی‌توانم در این زمینه‌ها کمکتان کنم:\n• ساخت اعتماد و امنیت روانی تیم\n• تفویض بدون از دست دادن کیفیت\n• جلسات یک‌به‌یک مؤثر\n• انگیزش و جلوگیری از افت انرژی تیم\n\nسوال‌تان را هرچه مشخص‌تر بگویید (مثلاً: «۳ نفر از ۵ نفر تیم بی‌انگیزه‌اند»).',
    greet_growth: 'سلام 🌱 من مربی توسعه فردی هستم.\n\nحوزه‌های من:\n• هدف‌گذاری SMART و برنامه ۳۰/۹۰ روزه\n• ساخت عادت پایدار\n• مدیریت زمان و اولویت\n• پیشگیری از فرسودگی\n\nالان روی چه چیزی گیر کرده‌اید؟',
    greet_hr: 'سلام 📋 من مشاور HR هستم.\n\nمی‌توانم کمک کنم در:\n• جلسه بازخورد عملکرد (حتی سخت)\n• تشخیص و مدیریت استعفای خاموش\n• آنبوردینگ ۳۰ روزه\n• قطع همکاری محترمانه و قانونی‌تر\n\nموقعیت را با جزئیات بگویید تا چارچوب دقیق بدهم.',
    greet_feedback: 'سلام 💬 من تحلیلگر بازخورد هستم.\n\nمتن بازخورد را با مدل SBI می‌سازم:\nموقعیت → رفتار مشاهده‌شده → تأثیر → درخواست.\n\nبگویید: چه کسی؟ چه رفتاری؟ چه تأثیری داشته؟',
    greet_soft: 'سلام 🤝 مربی مهارت نرم هستم.\n\nارتباط مؤثر، مذاکره، نه گفتن، تعارض و هوش هیجانی.\nسناریو را تعریف کنید تا دیالوگ پیشنهادی بنویسم.',
    greet_org: 'سلام 🏢 مشاور سازمانی هستم.\n\nفرهنگ، مدیریت تغییر، ادغام تیم‌ها و شاخص‌های سلامت تیم.\nچه تحولی در سازمان می‌خواهید؟',

    trust: '🛡️ ساخت اعتماد در تیم — نقشه عمل\n\nاصول:\n۱) قابلیت پیش‌بینی: قول کوچک بدهید و ۱۰۰٪ انجام دهید.\n۲) آسیب‌پذیری رهبری: اشتباه را زود و علنی بپذیرید.\n۳) شفافیت: اطلاعات تصمیم‌ساز را مخفی نکنید.\n۴) عدالت رویه‌ای: قوانین برای همه یکسان.\n۵) امنیت روانی: سوال و مخالفت بدون ترس از تنبیه.\n\nاقدام این هفته:\n• یک جلسه ۱۵ دقیقه‌ای با هر عضو فقط برای شنیدن موانع\n• در جمع، یک اشتباه اخیر خودتان را بدون توجیه بگویید\n• یک تصمیم را «چرا»یش را برای تیم توضیح دهید\n\nشاخص پیشرفت: آیا افراد اخبار بد را زودتر به شما می‌گویند؟',

    delegate: '📤 تفویض حرفه‌ای (بدون رها کردن یا میکرو‌مدیریت)\n\nقالب تفویض:\n• کار: دقیقاً چه چیزی؟\n• نتیجه: خروجی خوب چه شکلی است؟\n• مهلت: چه زمانی؟\n• اختیار: فقط اطلاع / مشورت اجباری / تصمیم مستقل\n• منابع: چه کمکی در اختیار دارد؟\n• نقطه بررسی: یک چک‌پوینت میانی (نه روزانه)\n\nسطح اختیار را بلند بگویید تا حدس نزند.\nبعد از اتمام: بازخورد یادگیری، نه فقط «خوب بود/بد بود».',

    oneonone: '🗓️ جلسه یک‌به‌یک مؤثر (۳۰–۴۵ دقیقه)\n\nساختار پیشنهادی:\n۰–۵ دقیقه: حال و انرژی (انسانی)\n۵–۲۰: اولویت‌ها و موانع او (او حرف بزند)\n۲۰–۳۵: بازخورد دوطرفه و رشد\n۳۵–۴۵: تعهدات و پیگیری\n\nسوالات قوی:\n• این هفته چه چیزی بیشتر انرژی‌ات را گرفت؟\n• اگر یک مانع را بردارم، کدام است؟\n• روی چه مهارتی می‌خواهی رشد کنی؟\n\nقانون: ۶۰٪+ زمان را او صحبت کند. موبایل کنار.',

    motivation: '⚡ تیم بی‌انگیزه — تشخیص و مداخله\n\nابتدا علت را جدا کنید:\n• ابهام هدف؟\n• حجم کار غیرواقعی؟\n• دیده نشدن تلاش؟\n• تعارض حل‌نشده؟\n• رشد شغلی متوقف؟\n\nمداخله سریع:\n۱) هدف مشترک را دوباره «چرا»دار کنید\n۲) یک برد کوچک ۷ روزه برای تیم بسازید\n۳) قدردانی عمومی مشخص (نه کلی)\n۴) یک مانع سازمانی را شخصاً بردارید\n\nاز شعار و سخنرانی انگیزشی به‌تنهایی استفاده نکنید.',

    feedback: '🎯 چارچوب بازخورد قوی\n\nمدل SBI:\n• Situation: زمان و مکان مشخص\n• Behavior: رفتار قابل مشاهده (نه برچسب شخصیتی)\n• Impact: تأثیر روی تیم/نتیجه/مشتری\n+ Request: درخواست مشخص برای بعد\n+ Follow-up: زمان پیگیری\n\nترتیب جلسه:\n۱) نیت حمایتی را بگویید\n۲) SBI\n۳) شنیدن روایت او\n۴) توافق قدم بعدی\n۵) یادداشت کوتاه مشترک',

    performance: '📊 مدیریت عملکرد ضعیف\n\nمراحل:\n۱) شواهد عینی جمع کنید (نه شایعه)\n۲) جلسه خصوصی با SBI\n۳) PIP کوتاه و شفاف (هدف، حمایت، مهلت)\n۴) پیگیری هفتگی\n۵) تصمیم نهایی بر اساس داده\n\nهرگز عملکرد را فقط در ارزیابی سالانه غافلگیر نکنید.',

    conflict: '⚖️ مدیریت تعارض\n\nمراحل:\n۱) مکث هیجانی (خود و طرف)\n۲) جدا کردن فرد از مسئله\n۳) گوش دادن و بازنویسی نگرانی او\n۴) بیان نیاز خود بدون حمله\n۵) یافتن نیاز مشترک\n۶) توافق روی یک قدم آزمایشی\n\nجمله کلیدی:\n«می‌خواهم مطمئن شوم درست فهمیدم؛ منظورتان این است که…؟»',

    quiet_quit: '😶 استعفای خاموش — علائم و اقدام\n\nعلائم:\n• حداقل انجام وظیفه\n• عدم پیشنهاد ایده\n• اجتناب از مسئولیت اضافه\n• کاهش ارتباط غیررسمی\n\nاقدام مدیر:\n۱) جلسه کنجکاوانه نه اتهامی\n۲) پرسیدن از رشد، معنا و مانع\n۳) تنظیم مجدد نقش یا چالش\n۴) اگر ارزش‌ها ناسازگارند، مسیر خروج محترمانه\n\nمجازات علنی معمولاً اوضاع را بدتر می‌کند.',

    onboard: '🚀 آنبوردینگ ۳۰ روزه\n\nهفته ۱: دسترسی، افراد کلیدی، نقش، انتظارات ۳۰/۹۰ روز\nهفته ۲: اولین خروجی واقعی کوچک + بازخورد سریع\nهفته ۳: بازخورد دوطرفه و تنظیم\nهفته ۴: اهداف سه‌ماهه و استقلال بیشتر\n\nحتماً یک Buddy سازمانی تعیین کنید.\nروز ۳۰: جلسه «چه چیز گیج‌کننده بود؟»',

    layoff: '🤝 قطع همکاری محترمانه\n\nاصول:\n• کوتاه، واضح، انسانی\n• بدون بحث طولانی در لحظه اعلام\n• آمادگی برای سوالات عملی (تسویه، بیمه، معرفی)\n• هماهنگی با سیاست سازمان و مستندات\n\nساختار گفتگو:\n۱) تصمیم\n۲) دلیل کلی در سطح مناسب\n۳) قدم‌های بعدی عملی\n۴) احترام به کرامت فرد\n\nاین یک راهنمای مدیریتی است؛ در موارد حساس با مشاور حقوقی/HR سازمان هماهنگ کنید.',

    habit: '🔁 ساخت عادت پایدار\n\nفرمول: محرک → رفتار خیلی کوچک → پاداش فوری\n\nقواعد:\n• عادت را به روال موجود بچسبانید (بعد از چای صبح)\n• شروع را مسخره‌وار کوچک کنید (۲ صفحه، ۵ دقیقه)\n• زنجیره را نشکنید؛ اگر شکستید همان روز حداقل نسخه مینی را انجام دهید\n• محیط را آسان‌تر از اراده کنید\n\nپیگیری: تقویم ساده با علامت ✅',

    goal: '🎯 هدف ۳۰ روزه SMART\n\n• Specific: یک مهارت/خروجی مشخص\n• Measurable: عدد یا معیار عینی\n• Achievable: با زمان واقعی زندگی‌تان\n• Relevant: به نقش یا ارزش شما وصل باشد\n• Time-bound: روز ۳۰ مرور\n\nقالب:\n«تا [تاریخ]، [عدد] بار [رفتار] را انجام می‌دهم تا [نتیجه].»\n\nمرور هفتگی ۱۵ دقیقه‌ای واجب است.',

    time: '⏰ مدیریت زمان برای فرد پرمشغله\n\n۱) ۳ اولویت روز را صبح بنویسید\n۲) کار عمیق را در بلوک ۹۰ دقیقه‌ای محافظت کنید\n۳) جلسات را با دستورکار و پایان‌زمان برگزار کنید\n۴) «نه» محترمانه به کارهای کم‌ارزش\n۵) دسته‌بندی ایمیل/پیام در ۲ نوبت مشخص\n\nقانون: اگر همه چیز اولویت است، هیچ چیز اولویت نیست.',

    burnout: '🧯 فرسودگی — هشدار و بازیابی\n\nعلائم: خستگی مزمن، بی‌حسی، افت کیفیت، بدبینی\n\nاقدام فوری:\n• ۷ روز کاهش بار غیرضروری\n• خواب و حرکت را غیرقابل مذاکره کنید\n• یک منبع انرژی معنی‌دار (نه فقط استراحت منفعل)\n• گفتگو با مدیر درباره اولویت‌ها\n\nاگر علائم شدید و پایدار است، از کمک تخصصی حرفه‌ای استفاده کنید.',

    negotiate: '💼 مذاکره (حقوق / فرصت)\n\nآماده‌سازی:\n• ارزش ایجادشده را با عدد بیاورید\n• بازه بازار را بشناسید\n• BATNA (جایگزیل) داشته باشید\n\nدر جلسه:\n• ابتدا ارزش، بعد عدد\n• سکوت بعد از پیشنهاد\n• روی بسته کامل مذاکره کنید (نه فقط پایه)\n\nجمله: «بر اساس مسئولیت‌ها و نتایج X، بازه Y منصفانه است.»',

    say_no: '🚫 نه گفتن محترمانه\n\nقالب:\n۱) قدردانی از اعتماد\n۲) محدودیت واقعی (زمان/اولویت)\n۳) جایگزین (زمان دیگر / شخص دیگر / نسخه سبک‌تر)\n\nمثال:\n«ممنون که به من فکر کردید. این هفته روی تحویل پروژه A متمرکزم و نمی‌توانم کیفیت لازم را برای این کار بگذارم. می‌توانم هفته بعد یا همکار B را معرفی کنم.»',

    listen: '👂 گوش دادن فعال\n\nمهارت‌ها:\n• توجه کامل (بدون موبایل)\n• تأیید کوتاه («ادامه بده»)\n• سوال شفاف‌ساز\n• خلاصه‌سازی با کلمات خودتان\n• نام بردن احساس طرف مقابل\n\nهدف فهمیدن است نه آماده کردن جواب.',

    culture: '🏛️ کار روی فرهنگ سازمانی\n\nفرهنگ = رفتارهایی که پاداش می‌گیرند، نه شعار روی دیوار.\n\n۴ لایه تغییر:\n۱) روایت رهبری (چرا)\\n۲) رفتار نمادین مدیران\n۳) سیستم ارزیابی و تشویق\n۴) شاخص‌های قابل مشاهده\n\nیک رفتار هدف را انتخاب کنید و آن را در استخدام، بازخورد و ارتقا وارد کنید.',

    change: '🔄 مدیریت مقاومت در برابر تغییر\n\nمقاومت معمولاً منطقی است: ترس از دست دادن کنترل/جایگاه/تسلط.\n\nاقدام:\n• ذی‌نفعان را زود درگیر کنید\n• «چه چیزی برای من؟» را برای هر گروه جواب دهید\n• بردهای زودهنگام بسازید\n• صدای مخالف را سرکوب نکنید؛ کانال دهید\n• مدیران میانی را مسلح به روایت کنید',

    merge: '🔗 ادغام دو تیم\n\nمراحل:\n۱) هدف ادغام را شفاف کنید\n۲) نقش‌ها و تداخل‌ها را روی کاغذ بیاورید\n۳) آداب و هنجار مشترک جدید بسازید\n۴) هویت جدید (نام، آیین، اهداف مشترک)\n۵) تعارض‌های قدیمی را تسهیل‌گری کنید نه نادیده\n\n۹۰ روز اول حیاتی است.',

    health: '❤️ سلامت تیم (مدل ۵ اختلال Lencioni)\n\nاز پایه به بالا:\n۱) نبود اعتماد\n۲) ترس از تعارض\n۳) کمبود تعهد\n۴) اجتناب از پاسخگویی\n۵) بی‌توجهی به نتایج\n\nتشخیص: کدام لایه الان ضعیف‌ترین است؟ همان را اول تعمیر کنید.',

    delay: '⏱️ بازخورد تأخیر مکرر (متن آماده)\n\n«در دو اسپرینت اخیر (موقعیت)، تحویل گزارش تحلیل با تأخیر انجام شد بدون اعلام قبلی (رفتار). در نتیجه تیم محصول نتوانست تصمیم‌گیری کند و یک روز برنامه عقب افتاد (تأثیر). از این به بعد لطفاً اگر احتمال تأخیر هست حداقل ۲۴ ساعت زودتر اعلام کنید و نسخه اولیه ناقص را هم به اشتراک بگذارید (درخواست). هفته بعد همین موضوع را مرور می‌کنیم.»',

    defensive: '🧱 وقتی طرف مقابل دفاعی می‌شود\n\n• سرعت و شدت لحن را پایین بیاورید\n• نیت مثبت را تکرار کنید\n• به رفتار برگردید نه شخصیت\n• از او بخواهید روایتش را بگوید\n• روی آینده توافق کنید نه محکومیت گذشته\n\nجمله: «هدفم سرزنش نیست؛ می‌خواهم با هم راه حل پیدا کنیم.»',

    upward: '⬆️ بازخورد به مافوق\n\nاصول:\n• خصوصی\n• با نیت کمک به هدف مشترک\n• مبتنی بر تأثیر کار (نه انتقاد شخصی)\n• پیشنهاد همراه نقد\n\nقالب:\n«می‌خواهم درباره X بازخوردی بدهم چون روی Y اثر دارد. مشاهده من این است که… پیشنهاد من… نظر شما چیست؟»',

    positive_fb: '🌟 بازخورد مثبت قوی\n\nضعیف: «کارت عالی بود.»\nقوی: رفتار مشخص + تأثیر + تشویق ادامه\n\nمثال:\n«در ارائه دیروز به مشتری، وقتی داده اعتراض را با نمودار ساده کردی، تصمیم‌گیری جلسه ۲۰ دقیقه جلو افتاد. لطفاً همین سبک را در ارائه ماه بعد هم ادامه بده.»',

    thanks: 'خواهش می‌کنم 🌿\nاگر خواستید روی همان موضوع عمیق‌تر برویم، جزئیات بیشتری بدهید یا بگویید «قدم بعدی چیست؟»',

    general_leadership: 'برای اینکه دقیق‌تر کمک کنم، بگویید:\n• وضعیت تیم الان چیست؟\n• چه رفتاری می‌خواهید تغییر کند؟\n• محدودیت‌ها (زمان، افراد، سیاست) چیست؟\n\nدر عین حال یک چارچوب کلی:\nشفافیت هدف → امنیت روانی → تفویض با اختیار مشخص → بازخورد منظم.',
    general_growth: 'یک سوال برای شروع:\nاگر ۹۰ روز دیگر فقط در یک مهارت بهتر شده باشید، کدام مهارت بیشترین اثر را روی زندگی/کار شما دارد؟\n\nبعد برای همان یک هدف SMART و عادت روزانه می‌سازیم.',
    general_hr: 'لطفاً بگویید:\n• موضوع درباره فرد است یا فرآیند؟\n• فوریت چقدر است؟\n• آیا سیاست مکتوب سازمان دارید؟\n\nچارچوب عمومی HR خوب: داده → گفتگوی محترمانه → توافق مکتوب کوتاه → پیگیری.',
    general_feedback: 'برای نوشتن متن بازخورد این ۴ مورد را بفرستید:\n۱) چه کسی\n۲) چه موقع\n۳) چه رفتاری دیدید\n۴) چه اثری داشت\n\nهمان لحظه متن SBI را آماده می‌کنم.',
    general_soft: 'سناریو را این‌طور بنویسید:\n«وقتی X می‌گوید/انجام می‌دهد Y، من Z حس می‌کنم و می‌خواهم به W برسم.»\nبعد دیالوگ پیشنهادی می‌دهم.',
    general_org: 'بگویید تغییر مطلوب چیست و الان بزرگ‌ترین مقاومت از کجاست (افراد، ساختار، انگیزه، مهارت). همان نقطه اهرم را هدف می‌گیریم.'
  };
  return PB[key] || null;
}

function generateReply(agent, userText, msgs) {
  var text = (userText || '').trim();
  if (!text) return 'لطفاً پیامتان را بنویسید.';

  var intents = detectIntents(text);
  var sys = agent.system;
  var parts = [];

  // greeting
  if (intents.indexOf('greet') !== -1) {
    return playbook('greet_' + sys, agent.name) || playbook('greet_growth');
  }
  if (intents.indexOf('thanks') !== -1) {
    return playbook('thanks');
  }

  // priority intent mapping
  var order = ['layoff','quiet_quit','burnout','conflict','delegate','trust','oneonone','motivation','performance','feedback','delay','defensive','upward','positive_fb','onboard','habit','goal','time','negotiate','say_no','listen','culture','change','merge','health'];
  for (var i = 0; i < order.length; i++) {
    if (intents.indexOf(order[i]) !== -1) {
      var block = playbook(order[i], agent.name);
      if (block) parts.push(block);
      break;
    }
  }

  if (!parts.length) {
    var g = playbook('general_' + sys, agent.name);
    if (g) parts.push(g);
  }

  // multi-turn hint
  var ctx = recentUserContext(msgs || []);
  if (ctx && msgs && msgs.length > 2) {
    parts.push('\n—\n🧵 با توجه به صحبت قبلی‌تان، اگر بخواهید می‌توانیم همان موضوع را به یک برنامه ۷ روزه اجرایی تبدیل کنیم. بنویسید: «برنامه ۷ روزه بده».');
  }

  // follow-up CTA
  parts.push('\n\n❓ برای دقیق‌تر شدن بگویید: محدودیت اصلی شما چیست؟ (زمان / افراد / مدیر / منابع)');

  return parts.join('\n\n');
}

function sendMessage() {
  if (!currentAgent) {
    if (typeof toast === 'function') toast('ابتدا Agent را انتخاب کنید');
    else alert('ابتدا Agent را انتخاب کنید');
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
  body.innerHTML += '<div class="msg agent"><div class="msg-bubble muted">در حال تحلیل و پاسخ...</div></div>';
  body.scrollTop = body.scrollHeight;

  setTimeout(function () {
    var reply = generateReply(currentAgent, text, msgs);
    lastAgentReply = reply;
    msgs = getChat();
    msgs.push({ role: 'agent', text: reply, time: new Date().toLocaleString('fa-IR') });
    setChat(msgs);
    var log = getStore('aryaz_ai_history', []) || [];
    log.unshift({ agent: currentAgent.name, user: text, reply: reply.slice(0, 200), time: now });
    setStore('aryaz_ai_history', log.slice(0, 80));
    if (typeof addActivity === 'function') addActivity('AI: ' + currentAgent.name);
    renderChat();
  }, 450);
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
    if (typeof toast === 'function') toast('پاسخی نیست');
    return;
  }
  var outs = getStore('aryaz_ai_outputs', []) || [];
  outs.unshift({ agent: currentAgent ? currentAgent.name : 'Agent', text: lastAgentReply, time: new Date().toLocaleString('fa-IR') });
  setStore('aryaz_ai_outputs', outs.slice(0, 40));
  if (typeof toast === 'function') toast('خروجی ذخیره شد');
}

function renderHistory() {
  var log = getStore('aryaz_ai_history', []) || [];
  var el = document.getElementById('historyList');
  if (!el) return;
  if (!log.length) { el.innerHTML = '<p class="muted">خالی</p>'; return; }
  el.innerHTML = log.map(function (h) {
    return '<div style="margin-bottom:10px;padding:12px;border:1px solid #e2e8f0;border-radius:12px"><strong>' + escapeHtml(h.agent) + '</strong> <span class="muted">' + h.time + '</span><p style="margin:8px 0;font-size:.9rem"><strong>شما:</strong> ' + escapeHtml(h.user) + '</p><p class="muted" style="font-size:.85rem">' + escapeHtml(h.reply) + '…</p></div>';
  }).join('');
}

function renderOutputs() {
  var outs = getStore('aryaz_ai_outputs', []) || [];
  var el = document.getElementById('outputsList');
  if (!el) return;
  if (!outs.length) { el.innerHTML = '<p class="muted">خروجی ذخیره نشده</p>'; return; }
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
  if (badge) badge.textContent = 'پلن: ' + getPlan() + ' | AI v5';
  renderAgentList();
  var input = document.getElementById('chatInput');
  if (input) input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
});
