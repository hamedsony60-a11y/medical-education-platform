var products = [
  { id: 's1', name: 'رهبری تیمی در سازمان', type: 'course', price: 890000, desc: 'دوره کامل رهبری با گواهینامه' },
  { id: 's2', name: 'مدیریت عملکرد کارکنان', type: 'course', price: 750000, desc: 'OKR، بازخورد و PIP' },
  { id: 's3', name: 'کوچینگ برای مدیران', type: 'course', price: 980000, desc: 'مهارت کوچینگ اجرایی' },
  { id: 's4', name: 'تفکر انتقادی و حل مسئله', type: 'course', price: 420000, desc: 'چارچوب تصمیم‌گیری' },
  { id: 's5', name: 'بسته کتاب مهارت نرم', type: 'book', price: 320000, desc: 'مجموعه خلاصه کتاب‌های کلیدی' },
  { id: 's6', name: 'چک‌لیست ارزیابی عملکرد', type: 'tool', price: 120000, desc: 'ابزار آماده برای مدیران' },
  { id: 's7', name: 'Canvas توسعه فردی', type: 'tool', price: 90000, desc: 'قالب هدف‌گذاری ۹۰ روزه' },
  { id: 's8', name: 'چک‌لیست آنبوردینگ ۳۰ روزه', type: 'tool', price: 110000, desc: 'برای تیم‌های HR و مدیران' },
  { id: 's9', name: 'Agent کوچ رهبری', type: 'agent', price: 450000, desc: 'دسترسی ویژه گفتگوهای رهبری' },
  { id: 's10', name: 'بسته تخصصی HR', type: 'course', price: 1500000, desc: 'دوره + ابزار + ارزیابی' }
];
var cart = getStore('aryaz_cart', []) || [];
var filter = 'all';
var coupon = null;

document.querySelectorAll('.tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
    filter = tab.getAttribute('data-tab');
    renderStore();
  });
});

function renderStore() {
  var list = products.filter(function (p) { return filter === 'all' || p.type === filter; });
  var icons = { course: '🎓', book: '📘', tool: '🛠️', agent: '🤖' };
  document.getElementById('storeGrid').innerHTML = list.map(function (p) {
    return '<div class="card product-card"><div class="product-cover">' + (icons[p.type] || '📦') + '</div>' +
      '<div class="card-body"><span class="badge">' + p.type + '</span><h3>' + p.name + '</h3>' +
      '<p class="muted" style="font-size:.85rem">' + p.desc + '</p>' +
      '<p class="price">' + p.price.toLocaleString('fa-IR') + ' تومان</p>' +
      '<button class="btn btn-primary btn-block" onclick="addToCart(\'' + p.id + '\')">افزودن به سبد</button></div></div>';
  }).join('');
}

function addToCart(id) {
  var p = products.find(function (x) { return x.id === id; });
  if (!p) return;
  cart.push({ id: p.id, name: p.name, price: p.price, type: p.type });
  setStore('aryaz_cart', cart);
  updateCart();
  toast('«' + p.name + '» اضافه شد');
  addActivity('سبد: ' + p.name);
}

function updateCart() {
  document.getElementById('cartCount').textContent = cart.length;
  var total = cart.reduce(function (s, i) { return s + i.price; }, 0);
  if (coupon === 'ARIAZ20') total = Math.round(total * 0.8);
  document.getElementById('cartTotal').textContent = total.toLocaleString('fa-IR');
  document.getElementById('cartBar').classList.toggle('show', cart.length > 0);
}

function applyCoupon() {
  var code = ((document.getElementById('couponInput') || {}).value || '').trim().toUpperCase();
  if (code === 'ARIAZ20') {
    coupon = code;
    toast('تخفیف ۲۰٪ اعمال شد');
    updateCart();
  } else if (code) {
    toast('کد نامعتبر است');
  }
}

function checkout() {
  if (!cart.length) return;
  var total = cart.reduce(function (s, i) { return s + i.price; }, 0);
  if (coupon === 'ARIAZ20') total = Math.round(total * 0.8);
  var orders = getStore('aryaz_orders', []) || [];
  var invoice = {
    id: 'INV-' + Date.now().toString().slice(-6),
    items: cart.map(function (c) { return c.name; }),
    total: total,
    coupon: coupon,
    time: new Date().toLocaleString('fa-IR')
  };
  orders.unshift(invoice);
  setStore('aryaz_orders', orders.slice(0, 30));
  addActivity('فاکتور ' + invoice.id + ' — ' + total.toLocaleString('fa-IR') + ' تومان');
  toast('پرداخت ثبت شد · ' + invoice.id);
  cart = [];
  coupon = null;
  setStore('aryaz_cart', cart);
  updateCart();
  var el = document.getElementById('lastInvoice');
  if (el) {
    el.innerHTML = '<div class="card" style="padding:16px;margin-top:16px"><strong>آخرین فاکتور: ' + invoice.id + '</strong>' +
      '<p class="muted">' + invoice.items.join('، ') + '</p>' +
      '<p class="price">' + invoice.total.toLocaleString('fa-IR') + ' تومان</p></div>';
  }
}

renderStore();
updateCart();
