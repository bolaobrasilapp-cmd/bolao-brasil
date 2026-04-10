import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).send('Método não permitido');

  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Chave RAPIDAPI_KEY não configurada na Vercel.' });
  }

  // CORREÇÃO: Adicionado o parâmetro &season=2026 para a API não se perder nas datas
  const url = 'https://v3.football.api-sports.io/fixtures?league=71&season=2026&next=10';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': apiKey
      }
    });

    const data: any = await response.json();

    // Se a chave estiver errada ou bater limite
    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(500).json({ error: 'Erro na API-Football', detalhe: JSON.stringify(data.errors) });
    }

    // Se a API responder, mas a lista de jogos vier vazia
    if (!data.response || data.response.length === 0) {
      return res.status(400).json({ 
        error: 'Nenhum jogo encontrado', 
        detalhe: `A API conectou, mas a lista de 2026 veio vazia. Resposta bruta: ${JSON.stringify(data)}` 
      });
    }

    // Traduz o formato complexo da API mundial para o padrão do seu Firebase
    const jogosFormatados = data.response.map((jogo: any) => {
      const dataLocal = new Date(jogo.fixture.date);
      const dia = String(dataLocal.getDate()).padStart(2, '0');
      const mes = String(dataLocal.getMonth() + 1).padStart(2, '0');
      const horas = String(dataLocal.getHours()).padStart(2, '0');
      const minutos = String(dataLocal.getMinutes()).padStart(2, '0');

      // Extrai apenas o número da rodada (Ex: "Regular Season - 1" vira "1")
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
    return res.status(500).json({ error: 'Erro interno no robô', detalhe: error.message });
  }
}