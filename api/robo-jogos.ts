import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).send('Método não permitido');

  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Falta a RAPIDAPI_KEY na Vercel.' });
  }

  /**
   * EXPLICAÇÃO PARA O DIEGO:
   * league=71 é o ID oficial do Brasileirão Série A.
   * season=2026 é o ano atual.
   * Buscamos a tabela COMPLETA para não ter erro de filtro.
   */
  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=71&season=2026`;
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

    // 1. Verificação de Chave/Segurança
    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(401).json({ 
        error: 'Chave RapidAPI recusada', 
        detalhe: JSON.stringify(data.errors) 
      });
    }

    // 2. Verificação de Dados
    if (!data.response || data.response.length === 0) {
      return res.status(404).json({ 
        error: 'Tabela não encontrada', 
        detalhe: 'A API ainda não liberou os dados de 2026 para a liga 71. Tente novamente em instantes.' 
      });
    }

    // 3. O FILTRO INTELIGENTE
    // Pegamos o horário de AGORA (em segundos)
    const agora = Math.floor(Date.now() / 1000);

    // Filtramos apenas jogos que o status seja "NS" (Not Started - Não começou)
    // E que o horário seja maior que agora.
    const proximos = data.response
      .filter((item: any) => item.fixture.status.short === 'NS' && item.fixture.timestamp > agora)
      .sort((a: any, b: any) => a.fixture.timestamp - b.fixture.timestamp) // Do mais perto para o mais longe
      .slice(0, 10); // Pega os 10 primeiros da fila

    if (proximos.length === 0) {
      return res.status(404).json({ 
        error: 'Sem jogos pendentes', 
        detalhe: 'A API diz que todos os jogos de 2026 já aconteceram ou não há mais jogos marcados.' 
      });
    }

    // 4. FORMATAÇÃO PARA O BOLAOBRASIL
    const jogosFormatados = proximos.map((item: any) => {
      const dataLocal = new Date(item.fixture.date);
      
      const dia = String(dataLocal.getDate()).padStart(2, '0');
      const mes = String(dataLocal.getMonth() + 1).padStart(2, '0');
      const horas = String(dataLocal.getHours()).padStart(2, '0');
      const minutos = String(dataLocal.getMinutes()).padStart(2, '0');
      
      const numeroRodada = item.league.round.replace(/[^0-9]/g, '') || '1';

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
    return res.status(500).json({ error: 'Erro de conexão', detalhe: error.message });
  }
}