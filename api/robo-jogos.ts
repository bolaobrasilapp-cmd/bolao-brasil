import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).send('Método não permitido');

  // Puxando a chave DIRETA (sem RapidAPI)
  const apiKey = process.env.API_SPORTS_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Falta a API_SPORTS_KEY na Vercel.' });
  }

  try {
    // Link direto para o servidor da API-Football mundial. (Liga 71 = Brasileirão)
    const url = `https://v3.football.api-sports.io/fixtures?league=71&next=10`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'x-apisports-key': apiKey 
      }
    });

    const data: any = await response.json();

    // Se o site deles recusar a chave
    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(401).json({ 
        error: 'Chave Oficial Inválida', 
        detalhe: JSON.stringify(data.errors) 
      });
    }

    if (!data.response || data.response.length === 0) {
      return res.status(404).json({ 
        error: 'Jogos não encontrados', 
        detalhe: 'A API não encontrou jogos pendentes. Confirme se a rodada atual já terminou.' 
      });
    }

    // Traduz do banco de dados oficial para o seu Firebase
    const formatados = data.response.map((j: any) => {
      const d = new Date(j.fixture.date);
      const numeroRodada = j.league.round.replace(/[^0-9]/g, '') || '11';

      return {
        home: j.teams.home.name,
        away: j.teams.away.name,
        data: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
        hora: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
        estadio: j.fixture.venue.name || "A Definir",
        categoria: "brasileirao",
        rodada: Number(numeroRodada)
      };
    });

    return res.status(200).json(formatados);

  } catch (error: any) {
    return res.status(500).json({ error: 'Erro de rede', detalhe: error.message });
  }
}