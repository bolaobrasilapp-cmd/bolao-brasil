import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Método não permitido');

  // URL que a Efí vai chamar (seu domínio)
  const webhookUrl = "https://bolaobrasil.app.br/api/webhook-pix";
  
  // A CHAVE PIX que você usa na Efí (CPF, E-mail ou Aleatória)
  const chavePix = "SUA_CHAVE_PIX_AQUI"; 

  try {
    // 1. O robô precisa de um Token de acesso da Efí
    const auth = Buffer.from(`${process.env.EFI_CLIENT_ID}:${process.env.EFI_CLIENT_SECRET}`).toString('base64');
    
    const tokenRes = await fetch(`${process.env.EFI_ENDPOINT}/oauth/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ grant_type: 'client_credentials' })
    });

    const { access_token } = await tokenRes.json();

    // 2. O robô registra a URL do Webhook na sua chave Pix
    const webhookRes = await fetch(`${process.env.EFI_ENDPOINT}/v2/webhook/${chavePix}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ webhookUrl })
    });

    if (webhookRes.ok) {
      return res.status(200).json({ sucesso: true, mensagem: "Webhook registrado com sucesso na Efí!" });
    } else {
      const erro = await webhookRes.json();
      return res.status(400).json({ sucesso: false, detalhe: erro });
    }

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}