import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Método não permitido');

  const { textoBruto, categoria, rodada } = req.body;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Você é um assistente do Bolão Brasil. Converta o texto abaixo em um JSON puro (sem markdown).
  Regras:
  - categoria deve ser: "${categoria}"
  - rodada deve ser: ${rodada}
  - Campos: home, away, data (DD/MM), hora (HH:MM), homeEmoji, awayEmoji, estadio.
  
  Texto: ${textoBruto}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "");
    return res.status(200).json(JSON.parse(text));
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar IA' });
  }
}