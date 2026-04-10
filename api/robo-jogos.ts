import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).send('Método não permitido');

  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Chave RAPIDAPI_KEY não configurada na Vercel.' });
  }

  // URL e Host específicos para quem usa a chave da RAPIDAPI
  const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?league=71&season=2026&next=10';
  const host = 'api-football-v1.p.rapidapi.com';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': host,
        'x-rapidapi-key': apiKey
      }
    });

    const data: any = await response.json();

    // Verifica se a RapidAPI ou o provedor retornaram erro de chave
    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(401).json({ 
        error: 'Chave Recusada', 
        detalhe: JSON.stringify(data.errors) 
      });
    }

    if (!data.response || data.response.length === 0) {
      return res.status(400).json({ 
        error: 'Lista Vazia', 
        detalhe: 'A API conectou mas não há jogos de 2026 cadastrados no sistema deles ainda.' 
      });
    }

    // Traduz para o formato do Bolão Brasil
    const jogosFormatados = data.response.map((jogo: any) => {
      const dataLocal = new Date(jogo.fixture.date);
      const dia = String(dataLocal.getDate()).padStart(2, '0');
      const mes = String(dataLocal.getMonth() + 1).padStart(2, '0');
      const horas = String(dataLocal.getHours()).padStart(2, '0');
      const minutos = String(dataLocal.getMinutes()).padStart(2, '0');
      const numeroRodada = jogo.league.round.replace(/[^0-9]/g, '') || '1';

      return {
        home: jogo.teams.home.name,
        away: jogo.teams.away.name,
        data: `${dia}/${mes}`,
        hora: `${horas}:${minutos}`,
        estadio: jogo.fixture.venue.name || "A Definir",
        categoria: "brasileirao",
        rodada: Number(numeroRodada)
      };
    });

    return res.status(200).json(jogosFormatados);

  } catch (error: any) {
    return res.status(500).json({ error: 'Erro no servidor', detalhe: error.message });
  }
}