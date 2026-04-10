import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).send('Método não permitido');

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Falta a RAPIDAPI_KEY na Vercel.' });

  const host = 'api-football-v1.p.rapidapi.com';

  try {
    // BUSCA DIRETA: Pede os próximos 10 jogos da Série A (ID 71) que ainda não começaram.
    const url = `https://${host}/v3/fixtures?league=71&next=10`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'x-rapidapi-host': host, 
        'x-rapidapi-key': apiKey 
      }
    });

    const data: any = await response.json();

    // Se a assinatura não estiver ativa no painel, a API vai avisar aqui:
    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(401).json({ 
        error: 'Assinatura Pendente', 
        detalhe: 'Sua chave RapidAPI foi aceita, mas você precisa clicar em SUBSCRIBE no plano FREE da API-Football.' 
      });
    }

    if (!data.response || data.response.length === 0) {
      return res.status(404).json({ 
        error: 'Jogos não encontrados', 
        detalhe: 'A API não retornou os próximos jogos. Verifique se a assinatura está ATIVA no seu Dashboard da RapidAPI.' 
      });
    }

    const formatados = data.response.map((j: any) => {
      const d = new Date(j.fixture.date);
      // Pega o número da rodada (Ex: "Regular Season - 12" -> 12)
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
    return res.status(500).json({ error: 'Erro de conexão', detalhe: error.message });
  }
}