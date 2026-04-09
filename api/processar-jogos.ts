import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Método não permitido');

  const { textoBruto, categoria, rodada } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Falta a chave GEMINI_API_KEY na Vercel.' });
  }

  // IMPORTANTE: Adicionado '-latest' para forçar o Google a achar o modelo e evitar o bug do 404
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{
        text: `Retorne APENAS um array JSON. Extraia os jogos:
        Formato: [{"home": "Time A", "away": "Time B", "data": "DD/MM", "hora": "HH:MM", "estadio": "Nome", "categoria": "${categoria}", "rodada": ${rodada}}]
        
        Texto: ${textoBruto}`
      }]
    }],
    generationConfig: {
      responseMimeType: "application/json" // Força o Google a não usar Markdown
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data: any = await response.json();

    // Se o Google recusar, passamos o erro real pra frente
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Erro Google (${response.status})`, 
        detalhe: data.error?.message || 'Modelo não encontrado ou sem permissão.' 
      });
    }

    const aiText = data.candidates[0].content.parts[0].text;
    
    // Proteção extra
    const cleanJson = aiText.replace(/```json|```/g, "").trim();
    
    return res.status(200).json(JSON.parse(cleanJson));

  } catch (error: any) {
    return res.status(500).json({ error: 'Falha no servidor', detalhe: error.message });
  }
}