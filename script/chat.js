// Función serverless de Vercel. Se despliega sola con solo tenerla en /api.
// La API key vive en una variable de entorno (GEMINI_API_KEY), nunca en el código del navegador.

const SYSTEM_PROMPT = `Eres el asistente virtual de Terrazas, una marca mexicana de café de grano.
Responde en español, en un tono cálido y cercano, en mensajes cortos (máximo 3-4 líneas).
Puedes hablar de: nuestros tres orígenes (Veracruz, Chiapas, Oaxaca), el proceso artesanal
(cosecha, despulpado, fermentación, secado, tueste), y nuestro compromiso con precio justo
y cultivo bajo sombra. Para dudas de pago o pedidos, dirige a la persona a la página de
"Café" para elegir producto y a "Resumen del pedido" para ver los datos de transferencia.
No inventes precios ni políticas que no te den; si no sabes algo, dilo con honestidad.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { message, history } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Falta el mensaje' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Falta configurar GEMINI_API_KEY en el servidor' });
  }

  // Convierte el historial simple del frontend al formato que espera la API.
  const contents = [
    ...(Array.isArray(history) ? history.slice(-10) : []).map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.text }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Error de la API de Gemini:', errText);
      return res.status(502).json({ error: 'Error al contactar a Gemini' });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || 'No tengo una respuesta para eso en este momento.';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Error en el proxy de chat:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}