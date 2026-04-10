import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).send('Método não permitido');

  const apiKey = process.env.API_SPORTS_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Falta a API_SPORTS_KEY na Vercel.' });

  try {
    // ESTRATÉGIA NINJA: Em vez de usar "next=10" (que é pago), 
    // pedimos a tabela de 2026 inteira da Série A (ID 71) que é liberada no plano Free.
    const url = `https://v3.football.api-sports.io/fixtures?league=71&season=2026`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'x-apisports-key': apiKey }
    });

    const data: any = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(401).json({ error: 'Erro na API', detalhe: JSON.stringify(data.errors) });
    }

    const fixtures = data.response || [];

    if (fixtures.length === 0) {
      return res.status(404).json({ 
        error: 'Tabela Vazia', 
        detalhe: 'A API não retornou os jogos de 2026.' 
      });
    }

    // O NOSSO ROBÔ FAZ O TRABALHO DO PLANO PAGO AQUI:
    const agora = Math.floor(Date.now() / 1000); // Horário de agora em segundos

    const proximos = fixtures
      .filter((j: any) => j.fixture.timestamp > agora) // Pega só o que ainda vai acontecer
      .sort((a: any, b: any) => a.fixture.timestamp - b.fixture.timestamp) // Ordena pela data
      .slice(0, 10); // Corta os 10 primeiros

    if (proximos.length === 0) {
       return res.status(404).json({ 
         error: 'Fim de Linha', 
         detalhe: 'Todos os jogos do Brasileirão 2026 já aconteceram.' 
       });
    }

    const formatados = proximos.map((j: any) => {
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
    return res.status(500).json({ error: 'Erro técnico', detalhe: error.message });
  }
}