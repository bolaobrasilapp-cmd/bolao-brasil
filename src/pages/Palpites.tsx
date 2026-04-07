import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, CheckCircle2, Star, Copy, Loader2, QrCode } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Palpites() {
  // Máquina de estados para controlar o fluxo da tela
  const [step, setStep] = useState<'palpites' | 'gerando_pix' | 'checkout'>('palpites');
  const [pixCopiaECola, setPixCopiaECola] = useState('');
  const [copiado, setCopiado] = useState(false);

  const matches = [
    { id: 1, home: 'Flamengo', homeImg: '🔴⚫', away: 'Palmeiras', awayImg: '🟢⚪', time: 'Hoje, 21:30' },
    { id: 2, home: 'São Paulo', homeImg: '🔴⚪', away: 'Corinthians', awayImg: '⚫⚪', time: 'Dom, 16:00' },
    { id: 3, home: 'Atlético-MG', homeImg: '⚫⚪', away: 'Cruzeiro', awayImg: '🔵⚪', time: 'Dom, 18:30' },
  ];

  // Simula a comunicação com a Efí e o Firebase
  const handleSaveAndPay = () => {
    setStep('gerando_pix');
    
    // Simula o tempo do backend gerar a cobrança na Efí Bank
    setTimeout(() => {
      setPixCopiaECola('00020126580014br.gov.bcb.pix0136efi-bank-simulado-bolao-123456520400005303986540520.005802BR5912Bolao Brasil6009Sao Paulo62070503***6304ABCD');
      setStep('checkout');
    }, 2000);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCopiaECola);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="p-4 space-y-6 pb-20 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Meus Palpites | Rodada Brasileirão - Bolão Brasil</title>
      </Helmet>

      {/* Fluxo 1: Tela de Palpites */}
      {step === 'palpites' && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-brazil-blue">Rodada #12</h2>
              <p className="text-sm text-gray-500">Brasileirão Série A</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase text-brazil-green">Entrada</p>
              <p className="text-sm font-black text-brazil-green">R$ 20,00</p>
            </div>
          </div>

          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="text-center mb-3">
                  <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    {match.time}
                  </span>
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col items-center flex-1">
                    <div className="text-2xl mb-1">{match.homeImg}</div>
                    <span className="text-xs font-bold text-gray-800 truncate w-full text-center">{match.home}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input type="number" className="w-12 h-12 bg-gray-50 border-2 border-gray-200 rounded-xl text-center text-xl font-black text-brazil-blue focus:border-brazil-green focus:ring-0 outline-none transition-colors" placeholder="-" min="0" max="99" />
                    <span className="text-gray-400 font-bold">X</span>
                    <input type="number" className="w-12 h-12 bg-gray-50 border-2 border-gray-200 rounded-xl text-center text-xl font-black text-brazil-blue focus:border-brazil-green focus:ring-0 outline-none transition-colors" placeholder="-" min="0" max="99" />
                  </div>

                  <div className="flex flex-col items-center flex-1">
                    <div className="text-2xl mb-1">{match.awayImg}</div>
                    <span className="text-xs font-bold text-gray-800 truncate w-full text-center">{match.away}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveAndPay}
            className="w-full bg-brazil-yellow text-brazil-blue py-4 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition-all"
          >
            Confirmar e Gerar Pix
          </motion.button>

          {/* Botão de Avaliar o App Restaurado e Funcionando */}
          <div className="bg-brazil-blue/5 border border-brazil-blue/10 rounded-xl p-4 mt-8 flex flex-col items-center text-center gap-3">
            <div className="flex text-brazil-yellow">
              <Star fill="currentColor" size={24} />
              <Star fill="currentColor" size={24} />
              <Star fill="currentColor" size={24} />
              <Star fill="currentColor" size={24} />
              <Star fill="currentColor" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-brazil-blue text-sm">Gostando do Bolão Brasil?</h4>
              <p className="text-xs text-gray-500">Ajude a divulgar o app para mais torcedores avaliando a gente nas lojas.</p>
            </div>
            <button 
              onClick={() => alert('Redirecionando para a loja de aplicativos... Muito obrigado pelo seu feedback!')}
              className="bg-white border-2 border-brazil-blue text-brazil-blue font-bold text-xs px-6 py-2 rounded-full hover:bg-brazil-blue hover:text-white transition-colors cursor-pointer"
            >
              Avaliar Aplicativo
            </button>
          </div>
        </motion.div>
      )}

      {/* Fluxo 2: Loading da Efí Bank */}
      {step === 'gerando_pix' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <Loader2 size={48} className="text-brazil-green animate-spin" />
          <h3 className="font-bold text-brazil-blue text-lg">Registrando Palpites...</h3>
          <p className="text-gray-500 text-sm text-center max-w-xs">Comunicando com o Banco Central para gerar sua chave de pagamento.</p>
        </motion.div>
      )}

      {/* Fluxo 3: Checkout Pix */}
      {step === 'checkout' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pt-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg text-center space-y-6">
            <div className="w-16 h-16 bg-brazil-green/10 rounded-full flex items-center justify-center mx-auto text-brazil-green">
              <QrCode size={32} />
            </div>
            
            <div>
              <h2 className="text-2xl font-black text-brazil-blue">R$ 20,00</h2>
              <p className="text-sm text-gray-500 mt-1">Pague via Pix para trancar seus palpites.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 break-all text-xs text-gray-600 font-mono text-left relative">
              {pixCopiaECola}
            </div>

            <button 
              onClick={handleCopyPix}
              className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                copiado ? 'bg-brazil-green text-white' : 'bg-brazil-blue text-white hover:bg-blue-900'
              }`}
            >
              {copiado ? <><CheckCircle2 size={20} /> Código Copiado!</> : <><Copy size={20} /> Copiar Código Pix</>}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium pt-2">
              <Loader2 size={14} className="animate-spin" /> Aguardando confirmação do pagamento...
            </div>
          </div>

          <div className="flex items-start gap-2 bg-gray-100 p-4 rounded-xl border border-gray-200">
            <ShieldAlert size={20} className="text-gray-500 shrink-0" />
            <p className="text-[11px] text-gray-600 leading-relaxed">
              O pagamento é processado instantaneamente pela Efí Bank. Assim que o Pix for confirmado, seus palpites estarão oficialmente valendo no ranking da liga.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}