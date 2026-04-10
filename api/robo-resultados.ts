import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).send('Método não permitido');

  try {
    const url = 'https://api.cartolafc.globo.com/partidas';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data: any = await response.json();

    if (!data || !data.partidas) {
      return res.status(404).json({ error: 'Sem dados', detalhe: 'API indisponível.' });
    }

    const clubes = data.clubes;
    const rodada = data.rodada;

    // Filtra e traduz apenas os jogos que já tem placar (começaram ou terminaram)
    const resultados = data.partidas
      .filter((jogo: any) => jogo.placar_oficial_mandante !== null) 
      .map((jogo: any) => {
        const timeCasa = clubes[jogo.clube_casa_id].nome;
        const timeVisitante = clubes[jogo.clube_visitante_id].nome;

        return {
          home: timeCasa,
          away: timeVisitante,
          scoreHome: jogo.placar_oficial_mandante,
          scoreAway: jogo.placar_oficial_visitante,
          rodada: Number(rodada),
          // O status 4 no Cartola significa "Jogo Encerrado"
          encerrado: jogo.status_transmissao_tr?.id === 4 
        };
      });

    return res.status(200).json(resultados);

  } catch (error: any) {
    return res.status(500).json({ error: 'Erro de rede', detalhe: error.message });
  }
}