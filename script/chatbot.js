(function () {
  // Este endpoint es tu propio proxy (ver /api/chat.js), NUNCA la API de Google directamente.
  const ENDPOINT = '/api/chat';

  const fab = document.getElementById('openChat');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('closeChat');
  const messages = document.getElementById('chatMessages');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');

  let history = []; // { role: 'user' | 'model', text: '...' }

  function openChat() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    input.focus();
  }
  function closeChat() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }

  fab.addEventListener('click', () => {
    panel.classList.contains('open') ? closeChat() : openChat();
  });
  closeBtn.addEventListener('click', closeChat);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeChat(); });

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + role;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    history.push({ role: 'user', text });
    input.value = '';
    input.disabled = true;

    const typingEl = addMessage('Escribiendo…', 'bot typing');

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      });

      if (!res.ok) throw new Error('Respuesta no válida del servidor');
      const data = await res.json();

      typingEl.remove();
      addMessage(data.reply, 'bot');
      history.push({ role: 'model', text: data.reply });
    } catch (err) {
      typingEl.remove();
      addMessage('No pude conectar con el chat en este momento. Intenta de nuevo en un momento.', 'error');
    } finally {
      input.disabled = false;
      input.focus();
    }
  });
})();