import type { VercelRequest, VercelResponse } from '@vercel/node';
import { adminDb } from '../lib/firebase-admin'; // Certifique-se de ter o Admin SDK configurado

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // A Efí envia um POST quando o Pix é confirmado
  if (req.method !== 'POST') return res.status(200).send('OK');

  try {
    const { pix } = req.body;

    if (pix && pix.length > 0) {
      const pagamento = pix[0];
      const valorPago = parseFloat(pagamento.valor);
      
      // A Efí devolve no "infoPagador" o UID que mandamos na geração
      const userUid = pagamento.infoPagador; 

      if (userUid) {
        const userRef = adminDb.collection('usuarios').doc(userUid);
        
        // INCREMENTO NO FIREBASE: Adiciona o valor ao saldo atual
        await userRef.update({
          saldo: adminDb.FieldValue.increment(valorPago),
          ultimoPagamento: new Date().toISOString()
        });

        console.log(`✅ Saldo de R$ ${valorPago} creditado para o usuário ${userUid}`);
      }
    }

    return res.status(200).send('Processado');
  } catch (error) {
    console.error('Erro no Webhook:', error);
    return res.status(500).send('Erro Interno');
  }
}