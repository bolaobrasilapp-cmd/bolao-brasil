import type { VercelRequest, VercelResponse } from '@vercel/node';
import EfiPay from 'sdk-node-apis-efi';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Caminho temporário para o certificado na Vercel
  const certPath = path.join('/tmp', 'cert.p12');

  try {
    const { valor, cpf, nome, descricao } = req.body;

    const certBase64 = process.env.EFI_CERT_BASE64;
    if (!certBase64) throw new Error("Variável EFI_CERT_BASE64 não encontrada.");

    // Converte o Base64 de volta para um arquivo físico temporário
    fs.writeFileSync(certPath, Buffer.from(certBase64, 'base64'));

    const options = {
      sandbox: false, // Produção
      client_id: process.env.EFI_CLIENT_ID as string,
      client_secret: process.env.EFI_CLIENT_SECRET as string,
      certificate: certPath, // Agora passamos o CAMINHO do arquivo criado
    };

    const efipay = new EfiPay(options);

    const body = {
      calendario: { expiracao: 3600 },
      devedor: { 
        cpf: cpf.replace(/\D/g, ''), 
        nome: nome 
      },
      valor: { original: valor.toFixed(2) },
      chave: process.env.EFI_CHAVE_PIX as string,
      solicitacaoPagador: descricao || 'Cota Bolão Brasil'
    };

    const response = await efipay.pixCreateImmediateCharge([], body);
    const qrCode = await efipay.pixGenerateQRCode({ id: response.loc.id });

    // Limpa o arquivo temporário por segurança
    if (fs.existsSync(certPath)) fs.unlinkSync(certPath);

    return res.status(200).json({
      sucesso: true,
      txid: response.txid,
      copiaECola: qrCode.qrcode,
      qrCodeImage: qrCode.imagemQrcode
    });

  } catch (error: any) {
    console.error("Erro Efí:", error);
    // Limpa o arquivo mesmo em caso de erro
    if (fs.existsSync(certPath)) fs.unlinkSync(certPath);

    return res.status(500).json({ 
      sucesso: false, 
      error: 'Erro ao processar o Pix',
      detalhe: error.error_description || error.message || 'Erro desconhecido'
    });
  }
}