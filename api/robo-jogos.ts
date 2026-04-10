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

    if (!data || !data.partidas || data.partidas.length === 0) {
      return res.status(404).json({ error: 'Rodada Vazia', detalhe: 'Sem jogos.' });
    }

    const clubes = data.clubes;
    const rodada = data.rodada;

    const formatados = data.partidas.map((jogo: any) => {
      const timeCasa = clubes[jogo.clube_casa_id];
      const timeVisitante = clubes[jogo.clube_visitante_id];
      
      const dataHoraString = jogo.partida_data.replace(' ', 'T');
      const dataHora = new Date(dataHoraString);
      
      const dia = String(dataHora.getDate()).padStart(2, '0');
      const mes = String(dataHora.getMonth() + 1).padStart(2, '0');
      const horas = String(dataHora.getHours()).padStart(2, '0');
      const minutos = String(dataHora.getMinutes()).padStart(2, '0');

      // Pegamos o escudo em tamanho ideal (60x60). Se falhar, pega o 45x45.
      const escudoCasa = timeCasa.escudos?.['60x60'] || timeCasa.escudos?.['45x45'] || "";
      const escudoVisitante = timeVisitante.escudos?.['60x60'] || timeVisitante.escudos?.['45x45'] || "";

      return {
        home: timeCasa.nome,
        away: timeVisitante.nome,
        // Mandamos os dois nomes possíveis de variável para não ter erro no seu Frontend
        logoHome: escudoCasa,
        logoAway: escudoVisitante,
        escudoHome: escudoCasa,
        escudoAway: escudoVisitante,
        data: `${dia}/${mes}`,
        hora: `${horas}:${minutos}`,
        estadio: jogo.local || "A Definir",
        categoria: "brasileirao",
        rodada: Number(rodada)
      };
    });

    return res.status(200).json(formatados);

  } catch (error: any) {
    return res.status(500).json({ error: 'Erro de rede', detalhe: error.message });
  }
}