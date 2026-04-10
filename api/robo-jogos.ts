import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).send('Método não permitido');

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Falta a RAPIDAPI_KEY na Vercel.' });

  // MUDANÇA: Agora usamos o endereço da SportAPI (rapidsportapi)
  const host = 'sportapi7.p.rapidapi.com';
  
  // No SportAPI, o ID do Brasileirão Série A geralmente é o 152
  const leagueId = '152'; 

  try {
    const url = `https://${host}/api/v1/sport/football/league/${leagueId}/events/next`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'x-rapidapi-host': host, 
        'x-rapidapi-key': apiKey 
      }
    });

    const data: any = await response.json();

    // Se der erro de assinatura
    if (data.message && data.message.includes('not subscribed')) {
      return res.status(401).json({ 
        error: 'Assinatura Errada', 
        detalhe: 'Você assinou a API do milad niknam, mas este código precisa da SportAPI (rapidsportapi).' 
      });
    }

    if (!data.events || data.events.length === 0) {
      return res.status(404).json({ 
        error: 'Jogos não encontrados', 
        detalhe: 'A SportAPI não retornou jogos. Verifique se a assinatura da SportAPI (rapidsportapi) está ATIVA.' 
      });
    }

    // Traduz para o formato do Bolão Brasil
    const jogosFormatados = data.events.slice(0, 10).map((item: any) => {
      const d = new Date(item.startTimestamp * 1000); // Converte timestamp
      
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const horas = String(d.getHours()).padStart(2, '0');
      const minutos = String(d.getMinutes()).padStart(2, '0');

      return {
        home: item.homeTeam.name,
        away: item.awayTeam.name,
        data: `${dia}/${mes}`,
        hora: `${horas}:${minutos}`,
        estadio: item.venue?.name || "A Definir",
        categoria: "brasileirao",
        rodada: item.roundInfo?.round || 11
      };
    });

    return res.status(200).json(jogosFormatados);

  } catch (error: any) {
    return res.status(500).json({ error: 'Erro de conexão', detalhe: error.message });
  }
}