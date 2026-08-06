var cart = getStore('med_cart', []) || [];

document.querySelectorAll('.tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
    var id = tab.getAttribute('data-tab');
    document.getElementById('print').classList.toggle('hidden', id !== 'print');
    document.getElementById('ebook').classList.toggle('hidden', id !== 'ebook');
  });
});

function addToCart(name, price) {
  cart.push({ name: name, price: price || 0 });
  setStore('med_cart', cart);
  updateCart();
  toast('«' + name + '» به سبد اضافه شد');
  addActivity('افزودن به سبد: ' + name);
}

function buyEbook(name) {
  var buys = getStore('med_ebooks', []) || [];
  buys.unshift({ name: name, time: new Date().toLocaleString('fa-IR') });
  setStore('med_ebooks', buys.slice(0, 20));
  addActivity('خرید eBook: ' + name);
  toast('خرید «' + name + '» انجام شد');
}

function updateCart() {
  var bar = document.getElementById('cartBar');
  document.getElementById('cartCount').textContent = cart.length;
  var total = cart.reduce(function (s, i) { return s + (i.price || 0); }, 0);
  document.getElementById('cartTotal').textContent = total.toLocaleString('fa-IR');
  if (cart.length > 0) bar.classList.add('show');
  else bar.classList.remove('show');
}

function checkout() {
  if (!cart.length) return;
  var orders = getStore('med_orders', []) || [];
  orders.unshift({ items: cart.slice(), time: new Date().toLocaleString('fa-IR') });
  setStore('med_orders', orders.slice(0, 20));
  addActivity('ثبت سفارش: ' + cart.length + ' مورد');
  toast('سفارش ثبت شد');
  cart = [];
  setStore('med_cart', cart);
  updateCart();
}

updateCart();
