import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Método não permitido');

  const { textoBruto, categoria, rodada } = req.body;
  
  // 1. Verificação de segurança da Chave
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Chave GEMINI_API_KEY não encontrada no ambiente Vercel.' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });

  const prompt = `Extraia os jogos de futebol do texto abaixo e retorne APENAS um array JSON puro, sem formatação markdown.
  Siga rigorosamente este formato para cada objeto:
  {
    "home": "Time Casa",
    "away": "Time Fora",
    "data": "DD/MM",
    "hora": "HH:MM",
    "estadio": "Nome do Estádio",
    "categoria": "${categoria}",
    "rodada": ${rodada}
  }

  Texto: ${textoBruto}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // 2. Limpeza profunda: Remove marcações de markdown e espaços extras que quebram o JSON
    const cleanJson = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanJson);
    return res.status(200).json(parsedData);

  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    return res.status(500).json({ 
      error: 'Erro ao processar IA', 
      detalhe: error.message 
    });
  }
}