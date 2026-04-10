import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).send('Método não permitido');

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Falta a RAPIDAPI_KEY na Vercel.' });

  // CONFIGURAÇÃO PARA A "FREE API LIVE FOOTBALL DATA" (Smart API)
  const host = 'free-api-live-football-data.p.rapidapi.com';
  const leagueId = '13'; // ID oficial do Brasileirão Série A nesta API

  try {
    // Buscamos todos os jogos da liga para filtrar os próximos
    const url = `https://${host}/football-get-all-fixtures-by-league?leagueId=${leagueId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'x-rapidapi-host': host, 
        'x-rapidapi-key': apiKey 
      }
    });

    const data: any = await response.json();

    if (!data.status || !data.response || !data.response.fixtures) {
      return res.status(404).json({ 
        error: 'Jogos não encontrados', 
        detalhe: 'A API não retornou a lista de jogos. Verifique se a assinatura está ativa.' 
      });
    }

    // Pegamos o horário de agora
    const agora = new Date();

    // Filtramos apenas os jogos que ainda vão acontecer
    const proximos = data.response.fixtures
      .filter((j: any) => {
        // Tenta converter a data da API (formato DD-MM-YYYY)
        const [dia, mes, ano] = j.date.split('-');
        const dataJogo = new Date(`${ano}-${mes}-${dia}T${j.time}:00`);
        return dataJogo > agora;
      })
      .slice(0, 10); // Pega os 10 primeiros da fila

    const formatados = proximos.map((j: any) => {
      return {
        home: j.home_team,
        away: j.away_team,
        data: j.date.substring(0, 5).replace('-', '/'), // Vira DD/MM
        hora: j.time,
        estadio: j.stadium || "A Definir",
        categoria: "brasileirao",
        rodada: Number(j.round) || 11
      };
    });

    return res.status(200).json(formatados);

  } catch (error: any) {
    return res.status(500).json({ error: 'Erro de conexão', detalhe: error.message });
  }
}