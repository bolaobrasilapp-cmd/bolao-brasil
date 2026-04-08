import type { VercelRequest, VercelResponse } from '@vercel/node';
import EfiPay from 'sdk-node-apis-efi';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apenas aceita requisições do tipo POST (envio de dados)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { valor, cpf, nome, descricao } = req.body;

    // Recupera o certificado base64 do cofre da Vercel e converte de volta para formato de arquivo em memória
    const certBase64 = process.env.EFI_CERT_BASE64;
    if (!certBase64) throw new Error("Certificado não configurado no servidor.");
    const certBuffer = Buffer.from(certBase64, 'base64');

    // Configurações da Efí
    const options = {
      sandbox: false, // Produção ativada
      client_id: process.env.EFI_CLIENT_ID as string,
      client_secret: process.env.EFI_CLIENT_SECRET as string,
      certificate: certBuffer,
    };

    const efipay = new EfiPay(options);

    // Monta o pedido do Pix
    const body = {
      calendario: { expiracao: 3600 }, // Pix expira em 1 hora
      devedor: { 
        cpf: cpf.replace(/\D/g, ''), // Limpa a formatação do CPF
        nome: nome 
      },
      valor: { original: valor.toFixed(2) },
      chave: process.env.EFI_CHAVE_PIX as string,
      solicitacaoPagador: descricao || 'Cota Bolão Brasil'
    };

    // Gera a Cobrança Imediata
    const response = await efipay.pixCreateImmediateCharge([], body);

    // Gera a Imagem e o Link do QR Code
    const qrCode = await efipay.pixGenerateQRCode({ id: response.loc.id });

    // Devolve para o Frontend do App
    return res.status(200).json({
      sucesso: true,
      txid: response.txid,
      copiaECola: qrCode.qrcode,
      qrCodeImage: qrCode.imagemQrcode,
      linkVisualizacao: qrCode.linkVisualizacao
    });

  } catch (error: any) {
    console.error("Erro Efí:", error);
    return res.status(500).json({ 
      sucesso: false, 
      error: 'Erro ao processar o Pix',
      detalhe: error.message
    });
  }
}