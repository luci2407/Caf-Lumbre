(function () {
  const products = [
    {
      id: 'veracruz-alta',
      name: 'Altura de Veracruz',
      origin: 'Coatepec, Veracruz · 1,200 msnm',
      notes: 'Notas a piloncillo, cacao y cáscara de naranja.',
      price: 285,
      image: '../pic/cafe1.png'
    },
    {
      id: 'chiapas-reserva',
      name: 'Reserva de Chiapas',
      origin: 'Pueblo Nuevo, Chiapas · 1,450 msnm',
      notes: 'Cuerpo denso, ciruela madura y un final a especias.',
      price: 310,
      image: '../pic/cafe2.png'
    },
    {
      id: 'oaxaca-mezcla',
      name: 'Mezcla Oaxaqueña',
      origin: 'Pluma Hidalgo, Oaxaca · 900 msnm',
      notes: 'Ligero y floral, con un toque final a miel silvestre.',
      price: 260,
      image: '../pic/cafe3.png'
    }
  ];

  const money = n => '$' + n.toLocaleString('es-MX') + ' MXN';

  const grid = document.getElementById('productGrid');
  grid.innerHTML = products.map(p => `
    <div class="card">
      <div class="bag"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
      <div class="card-body">
        <p class="origin-tag">${p.origin}</p>
        <h3>${p.name}</h3>
        <p class="notes">${p.notes}</p>
        <div class="card-foot">
          <span class="price">${money(p.price)}</span>
          <button class="add-btn" data-id="${p.id}">Añadir</button>
        </div>
      </div>
    </div>
  `).join('');

  let cart = {}; // id -> qty

  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('overlay');
  const cartCount = document.getElementById('cartCount');
  const drawerItems = document.getElementById('drawerItems');
  const drawerTotal = document.getElementById('drawerTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function render() {
    const ids = Object.keys(cart).filter(id => cart[id] > 0);
    const totalQty = ids.reduce((s, id) => s + cart[id], 0);
    cartCount.textContent = totalQty;

    if (ids.length === 0) {
      drawerItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
      checkoutBtn.disabled = true;
    } else {
      checkoutBtn.disabled = false;
      drawerItems.innerHTML = ids.map(id => {
        const p = products.find(x => x.id === id);
        const qty = cart[id];
        return `<div class="cart-row">
          <div>
            <div class="ci-name">${p.name}</div>
            <div class="ci-meta">${money(p.price)} c/u</div>
            <div class="qty">
              <button data-act="dec" data-id="${id}" aria-label="Quitar uno">–</button>
              <span>${qty}</span>
              <button data-act="inc" data-id="${id}" aria-label="Añadir uno">+</button>
            </div>
          </div>
          <div class="price">${money(p.price * qty)}</div>
        </div>`;
      }).join('');
    }

    const total = ids.reduce((s, id) => s + cart[id] * products.find(p => p.id === id).price, 0);
    drawerTotal.textContent = money(total);
  }

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  document.getElementById('openCart').addEventListener('click', openDrawer);
  document.getElementById('closeCart').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  grid.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;
    const id = btn.dataset.id;
    cart[id] = (cart[id] || 0) + 1;
    render();
    openDrawer();
  });

  drawerItems.addEventListener('click', e => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.act === 'inc') cart[id] = (cart[id] || 0) + 1;
    if (btn.dataset.act === 'dec') cart[id] = Math.max(0, (cart[id] || 0) - 1);
    render();
  });

  checkoutBtn.addEventListener('click', () => {
  window.location.href = "pago.html";
});

  render();
})();