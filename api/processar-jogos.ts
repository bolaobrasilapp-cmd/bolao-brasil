import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Método não permitido');

  const { textoBruto, categoria, rodada } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Chave GEMINI_API_KEY não encontrada na Vercel.' });
  }

  // URL Direta da API do Google (v1beta é a que suporta o Flash com JSON)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{
        text: `Extraia os jogos de futebol do texto abaixo e retorne APENAS um array JSON puro, sem markdown.
        Formato de cada objeto:
        {
          "home": "Time Casa",
          "away": "Time Fora",
          "data": "DD/MM",
          "hora": "HH:MM",
          "estadio": "Nome do Estádio",
          "categoria": "${categoria}",
          "rodada": ${rodada}
        }
        
        Texto: ${textoBruto}`
      }]
    }],
    generationConfig: {
      temperature: 0.1,
      topK: 1,
      topP: 1,
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data: any = await response.json();

    // Se o Google responder erro (como o 404), pegamos o detalhe aqui
    if (data.error) {
      return res.status(data.error.code || 500).json({ 
        error: 'Erro no Google AI', 
        detalhe: data.error.message 
      });
    }

    // Extrai o texto da resposta da IA
    const aiText = data.candidates[0].content.parts[0].text;
    const cleanJson = aiText.replace(/```json|```/g, "").trim();
    
    return res.status(200).json(JSON.parse(cleanJson));

  } catch (error: any) {
    console.error("Erro Interno:", error);
    return res.status(500).json({ 
      error: 'Erro no processamento', 
      detalhe: error.message 
    });
  }
}