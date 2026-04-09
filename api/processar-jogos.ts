import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Método não permitido');

  const { textoBruto, categoria, rodada } = req.body;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Chave GEMINI_API_KEY não configurada na Vercel.' });
  }

  // Usando o modelo mais estável para evitar o erro 404
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Atue como um extrator de dados esportivos. 
  Converta o texto de jogos abaixo em um ARRAY JSON puro.
  
  Formato esperado:
  [
    {
      "home": "Time Casa",
      "away": "Time Fora",
      "data": "DD/MM",
      "hora": "HH:MM",
      "estadio": "Nome do Estádio",
      "categoria": "${categoria}",
      "rodada": ${rodada}
    }
  ]

  Regras:
  - Não use blocos de código markdown (sem aspas ou a palavra json).
  - Se não houver estádio, use "".
  - Responda APENAS o array [].

  Texto: ${textoBruto}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Limpeza de segurança para garantir que o JSON seja aceito
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    return res.status(200).json(JSON.parse(cleanJson));
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    return res.status(500).json({ 
      error: 'Erro ao processar IA', 
      detalhe: error.message 
    });
  }
}