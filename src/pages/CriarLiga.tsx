import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Globe, Lock, Share2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

export default function CriarLiga() {
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(true);
  const [isCreated, setIsCreated] = useState(false);

  const handleCriar = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreated(true);
  };

  if (isCreated) {
    return (
      <div className="p-4 space-y-6 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-brazil-green text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-brazil-green/30">
          <ShieldCheck size={40} />
        </motion.div>
        <h2 className="text-2xl font-black text-brazil-blue">Liga Criada!</h2>
        <p className="text-gray-500 text-sm max-w-xs">Sua liga está pronta. Compartilhe o link com seus amigos para eles entrarem e pagarem a cota via Pix.</p>
        
        <button className="w-full max-w-xs bg-brazil-yellow text-brazil-blue font-black text-sm py-4 rounded-xl flex items-center justify-center gap-2 mt-4 shadow-md hover:scale-105 transition-transform">
          <Share2 size={20} /> Compartilhar Link
        </button>
        <button onClick={() => navigate('/palpites')} className="w-full max-w-xs bg-white border-2 border-gray-200 text-gray-600 font-bold text-sm py-4 rounded-xl mt-2">
          Ir para Meus Palpites
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      <Helmet>
        <title>Criar Nova Liga | Bolão Brasil</title>
      </Helmet>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-brazil-blue">Criar Bolão</h2>
        <p className="text-sm text-gray-500">Configure sua liga para a rodada. O sistema cuida da cobrança e distribuição dos prêmios automaticamente.</p>
      </div>

      <form onSubmit={handleCriar} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase">Nome da Liga</label>
          <input required type="text" placeholder="Ex: Bolão da Firma" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brazil-blue focus:bg-white transition-all" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase">Valor da Entrada (Pix)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">R$</span>
            <input required type="number" min="0" placeholder="20,00" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-brazil-blue focus:outline-none focus:border-brazil-blue focus:bg-white transition-all" />
          </div>
          <p className="text-[10px] text-gray-400">Digite 0 para criar um bolão gratuito (sem premiação real).</p>
        </div>

        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-gray-700 uppercase">Privacidade da Liga</label>
          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => setIsPublic(true)}
              className={`border-2 rounded-xl p-4 flex flex-col items-center text-center gap-2 cursor-pointer transition-all ${isPublic ? 'border-brazil-blue bg-brazil-blue/5' : 'border-gray-100 bg-white opacity-60'}`}
            >
              <Globe size={24} className={isPublic ? 'text-brazil-blue' : 'text-gray-400'} />
              <div>
                <p className={`font-bold text-sm ${isPublic ? 'text-brazil-blue' : 'text-gray-500'}`}>Público</p>
                <p className="text-[9px] text-gray-500 mt-1">Aparece na lista de buscas. Qualquer um pode entrar.</p>
              </div>
            </div>

            <div 
              onClick={() => setIsPublic(false)}
              className={`border-2 rounded-xl p-4 flex flex-col items-center text-center gap-2 cursor-pointer transition-all ${!isPublic ? 'border-brazil-blue bg-brazil-blue/5' : 'border-gray-100 bg-white opacity-60'}`}
            >
              <Lock size={24} className={!isPublic ? 'text-brazil-blue' : 'text-gray-400'} />
              <div>
                <p className={`font-bold text-sm ${!isPublic ? 'text-brazil-blue' : 'text-gray-500'}`}>Privado</p>
                <p className="text-[9px] text-gray-500 mt-1">Bloqueado. Somente quem tiver seu link de convite entra.</p>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-brazil-blue text-white font-black text-sm py-4 rounded-xl shadow-lg mt-6 hover:bg-blue-900 transition-colors">
          Confirmar e Gerar Link
        </button>
      </form>
    </div>
  );
}