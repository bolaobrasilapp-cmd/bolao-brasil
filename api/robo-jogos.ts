import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).send('Método não permitido');

  try {
    // A ARMA SECRETA: API Pública do Cartola FC
    // 100% Gratuita, focada no Brasileirão, sem precisar de API Key.
    const url = 'https://api.cartolafc.globo.com/partidas';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data: any = await response.json();

    if (!data || !data.partidas || data.partidas.length === 0) {
      return res.status(404).json({ 
        error: 'Rodada Vazia', 
        detalhe: 'A API do Cartola não retornou jogos. O campeonato pode estar em pausa momentânea.' 
      });
    }

    // O Cartola separa os times (clubes) dos jogos (partidas)
    const clubes = data.clubes;
    const rodada = data.rodada;

    // Traduz do formato Globo para o formato Bolão Brasil
    const formatados = data.partidas.map((jogo: any) => {
      // Pega o nome correto dos times usando os IDs
      const timeCasa = clubes[jogo.clube_casa_id].nome;
      const timeVisitante = clubes[jogo.clube_visitante_id].nome;
      
      // A data no Cartola vem no formato "YYYY-MM-DD HH:MM:SS"
      // Substituímos o espaço por "T" para o Javascript ler perfeitamente
      const dataHoraString = jogo.partida_data.replace(' ', 'T');
      const dataHora = new Date(dataHoraString);
      
      const dia = String(dataHora.getDate()).padStart(2, '0');
      const mes = String(dataHora.getMonth() + 1).padStart(2, '0');
      const horas = String(dataHora.getHours()).padStart(2, '0');
      const minutos = String(dataHora.getMinutes()).padStart(2, '0');

      return {
        home: timeCasa,
        away: timeVisitante,
        data: `${dia}/${mes}`,
        hora: `${horas}:${minutos}`,
        estadio: jogo.local || "A Definir",
        categoria: "brasileirao",
        rodada: Number(rodada)
      };
    });

    // Filtra apenas os jogos que ainda não terminaram (opcional, mas bom pra garantir)
    // const agora = new Date();
    // const proximos = formatados.filter((j: any) => ... ) 
    // Como a API do Cartola já foca na rodada atual, mandamos tudo!

    return res.status(200).json(formatados);

  } catch (error: any) {
    return res.status(500).json({ error: 'Erro de rede', detalhe: error.message });
  }
}