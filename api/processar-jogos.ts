import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Método não permitido');

  const { textoBruto, categoria, rodada } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Falta a chave GEMINI_API_KEY na Vercel.' });
  }

  // BALA DE PRATA: Usamos o gemini-pro (1.0). É universal, gratuito e imune ao erro 404.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{
        text: `Retorne APENAS um array JSON puro. Não use markdown.
        Extraia os jogos de futebol do texto:
        Formato: [{"home": "Time A", "away": "Time B", "data": "DD/MM", "hora": "HH:MM", "estadio": "Nome", "categoria": "${categoria}", "rodada": ${rodada}}]
        
        Texto: ${textoBruto}`
      }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data: any = await response.json();

    // Se o Google bater a porta, lemos o recado exato
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Erro Google`, 
        detalhe: data.error?.message || 'Falha de permissão no modelo.' 
      });
    }

    const aiText = data.candidates[0].content.parts[0].text;
    
    // Limpeza bruta de markdown caso a IA tente colocar ```json
    const cleanJson = aiText.replace(/```json|```/g, "").trim();
    
    return res.status(200).json(JSON.parse(cleanJson));

  } catch (error: any) {
    return res.status(500).json({ error: 'Erro no servidor', detalhe: error.message });
  }
}