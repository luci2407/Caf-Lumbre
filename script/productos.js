(function () {
  const products = [
    {
      id: 'veracruz-alta',
      name: 'Altura de Veracruz',
      origin: 'Coatepec, Veracruz · 1,200 msnm',
      notes: 'Notas a piloncillo, cacao y cáscara de naranja.',
      price: 285,
      bagColor: '#B5502D',
      labelColor: '#D9A441'
    },
    {
      id: 'chiapas-reserva',
      name: 'Reserva de Chiapas',
      origin: 'Pueblo Nuevo, Chiapas · 1,450 msnm',
      notes: 'Cuerpo denso, ciruela madura y un final a especias.',
      price: 310,
      bagColor: '#3B2417',
      labelColor: '#EDE4D3'
    },
    {
      id: 'oaxaca-mezcla',
      name: 'Mezcla Oaxaqueña',
      origin: 'Pluma Hidalgo, Oaxaca · 900 msnm',
      notes: 'Ligero y floral, con un toque final a miel silvestre.',
      price: 260,
      bagColor: '#6B7654',
      labelColor: '#EDE4D3'
    }
  ];

  const money = n => '$' + n.toLocaleString('es-MX') + ' MXN';

  function bagSVG(p) {
    return `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 26 h92 v100 a10 10 0 0 1 -10 10 h-72 a10 10 0 0 1 -10 -10 z" fill="${p.bagColor}"/>
      <path d="M14 26 q46 -14 92 0 v10 q-46 -12 -92 0 z" fill="${p.bagColor}" opacity="0.7"/>
      <rect x="52" y="6" width="16" height="24" rx="3" fill="${p.bagColor}"/>
      <rect x="26" y="66" width="68" height="30" rx="2" fill="${p.labelColor}" opacity="0.92"/>
      <line x1="34" y1="78" x2="86" y2="78" stroke="${p.bagColor}" stroke-width="2" opacity="0.5"/>
      <line x1="34" y1="86" x2="70" y2="86" stroke="${p.bagColor}" stroke-width="2" opacity="0.5"/>
    </svg>`;
  }

  const grid = document.getElementById('productGrid');
  grid.innerHTML = products.map(p => `
    <div class="card">
      <div class="bag" style="background:${p.labelColor === '#EDE4D3' ? 'var(--cream)' : 'var(--cream-2)'}">${bagSVG(p)}</div>
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
     window.location.href = "../html/pago.html";
  });
  
  render();
})();