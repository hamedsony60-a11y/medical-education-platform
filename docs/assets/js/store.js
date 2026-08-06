var cart = [];
document.querySelectorAll('.tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
    var id = tab.getAttribute('data-tab');
    document.getElementById('print').classList.toggle('hidden', id !== 'print');
    document.getElementById('ebook').classList.toggle('hidden', id !== 'ebook');
  });
});
function addToCart(name) {
  cart.push(name); updateCart();
  alert('«' + name + '» به سبد اضافه شد.');
}
function buyEbook(name) {
  alert('خرید «' + name + '» انجام شد.');
}
function updateCart() {
  var bar = document.getElementById('cartBar');
  document.getElementById('cartCount').textContent = cart.length;
  if (cart.length > 0) bar.classList.add('show');
  else bar.classList.remove('show');
}
function checkout() {
  if (cart.length === 0) return;
  alert('سفارش ثبت شد:\n' + cart.join('\n'));
  cart = []; updateCart();
}
