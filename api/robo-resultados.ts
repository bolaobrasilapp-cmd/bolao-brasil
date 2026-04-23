import type { VercelRequest, VercelResponse } from '@vercel/node';
import { adminDb } from '../lib/firebase-admin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1. Busca na API externa (ex: Cartola/Globo) os resultados mais recentes
    const response = await fetch('https://api.cartola.globo.com/partidas');
    const data = await response.json();

    if (!data.partidas) {
      return res.status(400).json({ erro: "Não foi possível buscar as partidas." });
    }

    const partidas = data.partidas;
    let atualizados = 0;

    // 2. Prepara a gravação no Firebase
    const batch = adminDb.batch();

    partidas.forEach((p: any) => {
      // Formata o ID para bater com o que você salvou no banco
      const idJogo = `${p.clube_casa_id}_${p.clube_visitante_id}_R${data.rodada}`;
      const jogoRef = adminDb.collection('jogos').doc(idJogo);

      // Só atualiza se o jogo já tiver placar final (status encerrado)
      if (p.placar_oficial_visitante !== null) {
        batch.update(jogoRef, {
          scoreHomeReal: p.placar_oficial_casa,
          scoreAwayReal: p.placar_oficial_visitante,
          encerrado: true,
          dataAtualizacao: new Date().toISOString()
        });
        atualizados++;
      }
    });

    await batch.commit();

    return res.status(200).json({ 
      sucesso: true, 
      mensagem: `O robô trabalhou com sucesso! ${atualizados} jogos foram encerrados.` 
    });

  } catch (error: any) {
    console.error("Erro no robô automático:", error);
    return res.status(500).json({ erro: error.message });
  }
}