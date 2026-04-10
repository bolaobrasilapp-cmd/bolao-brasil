import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).send('Método não permitido');

  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Falta a RAPIDAPI_KEY na Vercel.' });
  }

  // ESTRATÉGIA AGRESSIVA: Pede os próximos 20 jogos da Liga 71 (Brasileirão Série A)
  // Removemos o filtro de "season" para a API não se perder.
  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=71&next=20`;
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

    // Erro de autenticação ou limite
    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(401).json({ 
        error: 'API Recusou o Acesso', 
        detalhe: JSON.stringify(data.errors) 
      });
    }

    // Se a lista vier vazia
    if (!data.response || data.response.length === 0) {
      return res.status(404).json({ 
        error: 'Jogos não encontrados', 
        detalhe: 'A API não retornou os próximos jogos. Verifique se a rodada 11 já foi processada no sistema deles.' 
      });
    }

    // Mapeia os jogos para o formato do seu Banco de Dados
    const jogosFormatados = data.response.map((item: any) => {
      const dataLocal = new Date(item.fixture.date);
      
      // Formata data e hora para o padrão Brasil (GMT-3)
      const dia = String(dataLocal.getDate()).padStart(2, '0');
      const mes = String(dataLocal.getMonth() + 1).padStart(2, '0');
      const horas = String(dataLocal.getHours()).padStart(2, '0');
      const minutos = String(dataLocal.getMinutes()).padStart(2, '0');
      
      // Limpa o texto da rodada (Ex: "Regular Season - 11" vira 11)
      const numeroRodada = item.league.round.replace(/[^0-9]/g, '') || '11';

      return {
        home: item.teams.home.name,
        away: item.teams.away.name,
        data: `${dia}/${mes}`,
        hora: `${horas}:${minutos}`,
        estadio: item.fixture.venue.name || "A Definir",
        categoria: "brasileirao",
        rodada: Number(numeroRodada)
      };
    });

    return res.status(200).json(jogosFormatados);

  } catch (error: any) {
    return res.status(500).json({ error: 'Erro interno', detalhe: error.message });
  }
}