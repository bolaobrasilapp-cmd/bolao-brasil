import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Método não permitido');

  const { textoBruto, categoria, rodada } = req.body;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Falta GEMINI_API_KEY na Vercel.' });
  }

  try {
    // Inicializa a IA forçando a versão 1.5 Flash que é a mais moderna e estável
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // IMPORTANTE: Mudamos aqui para o modelo 1.5-flash que é o padrão de 2026
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    const prompt = `Extraia os jogos de futebol do texto abaixo. 
    Responda APENAS um array JSON puro.
    Formato: [{"home": "Time A", "away": "Time B", "data": "DD/MM", "hora": "HH:MM", "estadio": "Nome", "categoria": "${categoria}", "rodada": ${rodada}}]
    
    Texto: ${textoBruto}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Limpeza de caracteres que a IA às vezes coloca e quebram o JSON
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    return res.status(200).json(JSON.parse(cleanJson));

  } catch (error: any) {
    // Se der erro, vamos mostrar exatamente o que o Google respondeu
    console.error("ERRO GOOGLE:", error);
    return res.status(500).json({ 
      error: 'Erro na IA', 
      detalhe: error.message 
    });
  }
}