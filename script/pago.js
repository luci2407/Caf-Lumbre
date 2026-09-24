(function () {
  const money = n => '$' + n.toLocaleString('es-MX') + ' MXN';

  let order = null;
  try {
    order = JSON.parse(localStorage.getItem('cafelumbre_pedido'));
  } catch (e) {
    order = null;
  }

  const orderItems = document.getElementById('orderItems');
  const orderTotal = document.getElementById('orderTotal');
  const folioEl = document.getElementById('folio');
  const refValue = document.getElementById('refValue');
  const transferAmount = document.getElementById('transferAmount');
  const emptyNote = document.getElementById('emptyNote');

  if (!order || !order.items || order.items.length === 0) {
    document.querySelector('.order-grid').hidden = true;
    emptyNote.hidden = false;
    return;
  }

  folioEl.textContent = order.folio;

  orderItems.innerHTML = order.items.map(item => `
    <div class="item-row">
      <div>
        <div class="i-name">${item.name}</div>
        <div class="i-meta">${item.qty} × ${money(item.price)}</div>
      </div>
      <div class="i-price">${money(item.price * item.qty)}</div>
    </div>
  `).join('');

  orderTotal.textContent = money(order.total);
  transferAmount.textContent = money(order.total);

  // Referencia: the button that copies it also needs the plain text, so set both.
  refValue.childNodes[0].textContent = order.folio + ' ';
  refValue.querySelector('.copy-btn').dataset.copy = order.folio;

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        // Clipboard API unavailable — silently ignore, value is still visible to select/copy manually.
      }
      const original = btn.textContent;
      btn.textContent = 'Copiado';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1500);
    });
  });
})();


