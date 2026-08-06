var products = [
  { id: 's1', name: 'رهبری تیمی در سازمان', type: 'course', price: 890000 },
  { id: 's2', name: 'مدیریت عملکرد کارکنان', type: 'course', price: 750000 },
  { id: 's3', name: 'بسته کتاب مهارت نرم', type: 'book', price: 320000 },
  { id: 's4', name: 'چک‌لیست ارزیابی عملکرد', type: 'tool', price: 120000 },
  { id: 's5', name: 'Canvas توسعه فردی', type: 'tool', price: 90000 },
  { id: 's6', name: 'Agent کوچ رهبری', type: 'agent', price: 450000 },
  { id: 's7', name: 'بسته تخصصی HR', type: 'course', price: 1500000 }
];
var cart = getStore('aryaz_cart', []) || [];
var filter = 'all';

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
      '<p class="price">' + p.price.toLocaleString('fa-IR') + ' تومان</p>' +
      '<button class="btn btn-primary btn-block" onclick="addToCart(\'' + p.id + '\')">افزودن به سبد</button></div></div>';
  }).join('');
}

function addToCart(id) {
  var p = products.find(function (x) { return x.id === id; });
  if (!p) return;
  cart.push(p);
  setStore('aryaz_cart', cart);
  updateCart();
  toast('به سبد اضافه شد');
  addActivity('سبد: ' + p.name);
}

function updateCart() {
  document.getElementById('cartCount').textContent = cart.length;
  var total = cart.reduce(function (s, i) { return s + i.price; }, 0);
  document.getElementById('cartTotal').textContent = total.toLocaleString('fa-IR');
  document.getElementById('cartBar').classList.toggle('show', cart.length > 0);
}

function checkout() {
  if (!cart.length) return;
  var orders = getStore('aryaz_orders', []) || [];
  var total = cart.reduce(function (s, i) { return s + i.price; }, 0);
  orders.unshift({ items: cart.map(function (c) { return c.name; }), total: total, time: new Date().toLocaleString('fa-IR') });
  setStore('aryaz_orders', orders.slice(0, 20));
  addActivity('پرداخت سفارش: ' + total.toLocaleString('fa-IR') + ' تومان');
  toast('فاکتور صادر شد — سفارش ثبت گردید');
  cart = [];
  setStore('aryaz_cart', cart);
  updateCart();
}

renderStore();
updateCart();
