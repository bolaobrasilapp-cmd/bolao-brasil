import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).send('Método não permitido');

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Falta a RAPIDAPI_KEY na Vercel.' });

  // HOST exato do seu print das 11:39
  const host = 'free-api-live-football-data.p.rapidapi.com';

  try {
    // TENTATIVA 1: Buscar jogos da liga 13 (Brasileirão nesta API)
    const url = `https://${host}/football-get-all-fixtures-by-league?leagueId=13`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'x-rapidapi-host': host, 
        'x-rapidapi-key': apiKey 
      }
    });

    const data: any = await response.json();

    // Se a API responder com erro de assinatura ou mensagem de erro
    if (data.status === false || data.message) {
      return res.status(401).json({ 
        error: 'Erro na API', 
        detalhe: data.message || 'Acesso negado ou liga não encontrada.' 
      });
    }

    const fixtures = data.response?.fixtures || [];

    if (fixtures.length === 0) {
      return res.status(404).json({ 
        error: 'Lista Vazia', 
        detalhe: 'A API não encontrou jogos para a liga 13. Verifique se o campeonato está ativo hoje.' 
      });
    }

    const agora = new Date();

    // Filtra jogos futuros, ordena e pega os 10 primeiros
    const proximos = fixtures
      .map((j: any) => {
        // Converte data DD-MM-YYYY para objeto Date
        const [dia, mes, ano] = j.date.split('-');
        return { ...j, dataISO: new Date(`${ano}-${mes}-${dia}T${j.time}:00`) };
      })
      .filter((j: any) => j.dataISO > agora)
      .sort((a: any, b: any) => a.dataISO.getTime() - b.dataISO.getTime())
      .slice(0, 10);

    const final = proximos.map((j: any) => ({
      home: j.home_team,
      away: j.away_team,
      data: j.date.substring(0, 5).replace('-', '/'),
      hora: j.time,
      estadio: j.stadium || "A Definir",
      categoria: "brasileirao",
      rodada: Number(j.round) || 11
    }));

    return res.status(200).json(final);

  } catch (error: any) {
    return res.status(500).json({ error: 'Erro técnico', detalhe: error.message });
  }
}