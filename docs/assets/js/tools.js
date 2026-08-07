var currentTool = null;

var TOOLS = {
  onboard: {
    title: 'چک‌لیست آنبوردینگ ۳۰ روزه',
    items: [
      'دسترسی سیستم‌ها و ایمیل',
      'معرفی به تیم و Buddy',
      'توضیح نقش و انتظارات ۳۰/۹۰ روز',
      'اولین خروجی کوچک (هفته ۲)',
      'بازخورد دوطرفه (هفته ۳)',
      'تعریف اهداف سه‌ماهه (هفته ۴)',
      'جلسه جمع‌بندی روز ۳۰'
    ]
  },
  okr: {
    title: 'Canvas هدف ۹۰ روزه',
    fields: ['هدف اصلی', 'معیار موفقیت (عدد)', 'عادت هفتگی', 'مانع احتمالی', 'حمایت مورد نیاز']
  },
  feedback: {
    title: 'قالب بازخورد SBI',
    fields: ['موقعیت (کی و کجا)', 'رفتار مشاهده‌شده', 'تأثیر روی کار/تیم', 'درخواست مشخص', 'زمان پیگیری']
  },
  '1on1': {
    title: 'دستورکار یک‌به‌یک',
    items: [
      'حال و انرژی (۵ دقیقه)',
      'اولویت‌ها و موانع او',
      'بازخورد دوطرفه',
      'رشد و یادگیری',
      'تعهدات و تاریخ پیگیری'
    ]
  }
};

function openTool(id) {
  currentTool = id;
  var t = TOOLS[id];
  if (!t) return;
  document.getElementById('toolTitle').textContent = t.title;
  document.getElementById('toolPanel').classList.remove('hidden');
  var saved = getStore('aryaz_tool_' + id, null);
  var html = '';

  if (t.items) {
    var checks = (saved && saved.checks) || {};
    html = t.items.map(function (item, i) {
      var checked = checks[i] ? 'checked' : '';
      return '<label class="q-option" style="display:flex;align-items:center;gap:10px">' +
        '<input type="checkbox" data-i="' + i + '" ' + checked + ' onchange="toggleCheck(this)" /> ' + item + '</label>';
    }).join('');
  }
  if (t.fields) {
    var vals = (saved && saved.fields) || {};
    html = t.fields.map(function (f, i) {
      return '<div class="form-group"><label>' + f + '</label>' +
        '<textarea data-f="' + i + '" rows="2" style="width:100%;padding:10px;border-radius:10px;border:1px solid #e2e8f0;font-family:inherit">' +
        (vals[i] || '') + '</textarea></div>';
    }).join('');
  }
  document.getElementById('toolBody').innerHTML = html;
  document.getElementById('toolPanel').scrollIntoView({ behavior: 'smooth' });
}

function toggleCheck() { /* state read on save */ }

function saveTool() {
  if (!currentTool) return;
  var t = TOOLS[currentTool];
  var data = {};
  if (t.items) {
    data.checks = {};
    document.querySelectorAll('#toolBody input[type=checkbox]').forEach(function (cb) {
      data.checks[cb.getAttribute('data-i')] = cb.checked;
    });
  }
  if (t.fields) {
    data.fields = {};
    document.querySelectorAll('#toolBody textarea').forEach(function (ta) {
      data.fields[ta.getAttribute('data-f')] = ta.value;
    });
  }
  setStore('aryaz_tool_' + currentTool, data);
  addActivity('ذخیره ابزار: ' + t.title);
  toast('ابزار ذخیره شد');
}
