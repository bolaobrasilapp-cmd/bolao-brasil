import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).send('Método não permitido');

  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Chave RAPIDAPI_KEY não configurada na Vercel.' });
  }

  // Calculamos a data de hoje e de daqui a 10 dias no formato YYYY-MM-DD
  const hoje = new Date();
  const futuro = new Date();
  futuro.setDate(hoje.getDate() + 10);

  const formatData = (d: Date) => d.toISOString().split('T')[0];

  // URL mudada para buscar por PERÍODO (Brasileirão Série A - ID 71)
  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=71&season=2026&from=${formatData(hoje)}&to=${formatData(futuro)}`;
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

    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(401).json({ error: 'Chave Recusada', detalhe: JSON.stringify(data.errors) });
    }

    if (!data.response || data.response.length === 0) {
      return res.status(400).json({ 
        error: 'Tabela Vazia', 
        detalhe: `A API não encontrou jogos do Brasileirão entre ${formatData(hoje)} e ${formatData(futuro)}.` 
      });
    }

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