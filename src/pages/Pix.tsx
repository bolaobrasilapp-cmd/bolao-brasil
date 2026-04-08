import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';

const Pix: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ copiaECola: string, qrCodeImage: string } | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState('');

  // Formulário rápido para a Efí validar quem está pagando
  const [form, setForm] = useState({ nome: '', cpf: '' });

  const handleGerarPix = async () => {
    // Validação básica para evitar recusa do banco
    if (form.nome.length < 3 || form.cpf.length < 11) {
      setErro("Preencha o nome e o CPF com 11 números para o banco aceitar.");
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const response = await fetch('/api/gerar-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valor: 20.00, // Valor fixo para a primeira liga teste
          cpf: form.cpf,
          nome: form.nome,
          descricao: 'Cota Bolão Primeira Liga'
        })
      });

      const data = await response.json();

      if (data.sucesso) {
        setPixData({ copiaECola: data.copiaECola, qrCodeImage: data.qrCodeImage });
      } else {
        setErro(data.detalhe || 'Erro ao gerar Pix. Verifique as chaves da Efí.');
      }
    } catch (err) {
      setErro("Falha na comunicação com o servidor bancário.");
    } finally {
      setLoading(false);
    }
  };

  const copiarCodigo = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.copiaECola);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 rounded-full text-gray-600 shadow-sm border border-gray-100">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-gray-800 tracking-tight">Pagamento da Cota</h2>
      </div>

      {!pixData ? (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
          <div className="bg-brazil-green/10 p-4 rounded-xl border border-brazil-green/20 flex items-start gap-3">
            <ShieldCheck className="text-brazil-green shrink-0 mt-0.5" size={20} />
            <p className="text-[11px] font-medium text-gray-700 leading-relaxed">
              Ambiente Seguro Efí Bank. Para registrar sua entrada na liga e gerar o QR Code oficial, insira os dados do pagador.
            </p>
          </div>

          {erro && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-xs font-bold border border-red-100">
              {erro}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nome Completo</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm({...form, nome: e.target.value})}
                placeholder="Como está na sua conta bancária"
                className="w-full mt-1.5 p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brazil-green focus:ring-1 focus:ring-brazil-green text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">CPF</label>
              <input
                type="text"
                value={form.cpf}
                onChange={(e) => setForm({...form, cpf: e.target.value.replace(/\D/g, '')})}
                placeholder="Apenas números"
                maxLength={11}
                className="w-full mt-1.5 p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brazil-green focus:ring-1 focus:ring-brazil-green text-sm font-medium tracking-wide"
              />
            </div>
          </div>

          <button
            onClick={handleGerarPix}
            disabled={loading}
            className="w-full bg-brazil-green text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(0,168,89,0.39)] hover:bg-[#009045] transition-all disabled:opacity-50 disabled:shadow-none mt-2"
          >
            {loading ? 'Conectando ao Banco...' : 'Gerar Pix de R$ 20,00'}
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="text-center space-y-1">
            <h3 className="font-black text-xl text-gray-800">Cota Liberada!</h3>
            <p className="text-xs text-gray-500">Escaneie o código abaixo com o app do seu banco</p>
          </div>
          
          <div className="p-3 border-4 border-brazil-green rounded-2xl bg-white shadow-inner">
            <img src={pixData.qrCodeImage} alt="QR Code Pix" className="w-56 h-56 object-contain" />
          </div>

          <div className="w-full space-y-3">
            <p className="text-[11px] text-gray-400 font-medium text-center uppercase tracking-widest">Ou use o Copia e Cola</p>
            
            <button
              onClick={copiarCodigo}
              className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                copiado 
                  ? 'bg-brazil-green/10 text-brazil-green border border-brazil-green/20' 
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {copiado ? <CheckCircle2 size={20} /> : <Copy size={20} />}
              {copiado ? 'Código Copiado!' : 'Copiar Código Pix'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pix;