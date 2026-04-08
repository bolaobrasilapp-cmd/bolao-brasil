import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Bloqueia qualquer método que não seja POST (Segurança)
  if (req.method !== 'POST') {
    return res.status(405).send('Método não permitido');
  }

  const { telefone } = req.body;

  // Busca as chaves das Variáveis de Ambiente da Vercel que configuramos
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
  const VERSION = "v19.0"; 

  // Validação de segurança: se as chaves não existirem, avisa o erro
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    return res.status(500).json({ error: 'Configurações do WhatsApp ausentes no servidor.' });
  }

  try {
    const response = await fetch(`https://graph.facebook.com/${VERSION}/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: telefone,
        type: "template",
        template: {
          name: "login_bolao", 
          language: { code: "pt_BR" }
        }
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, message: 'WhatsApp enviado!' });
    } else {
      return res.status(response.status).json({ error: 'Erro na API da Meta', details: data });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Falha interna ao disparar WhatsApp' });
  }
}