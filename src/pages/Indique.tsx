import React from 'react';
import { Helmet } from 'react-helmet-async';
import { auth } from '../lib/firebase';
import { Copy, Gift, Share2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Indique() {
  const navigate = useNavigate();
  // Pega o ID único do usuário logado para gerar o código. Se não logado, usa um genérico.
  const user = auth.currentUser;
  const referralCode = user?.uid ? user.uid.substring(0, 7).toUpperCase() : "VELO10X";

  const copiarCodigo = () => {
    navigator.clipboard.writeText(referralCode);
    alert(`Código ${referralCode} copiado! Mande para os amigos.`);
  };

  const compartilharWhatsApp = () => {
    const texto = `Fala parceiro! Baixei o app do Bolão Brasil pra gente organizar nossas ligas com Pix automático. Usa meu código de convite *${referralCode}* pra entrar. Acesse: https://bolaobrasil.app.br`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pb-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Indique e Ganhe | Bolão Brasil</title>
      </Helmet>

      <div className="flex items-center gap-3 mb-2 mt-2">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-gray-800 tracking-tight">Indique e Ganhe</h2>
      </div>

      <div className="bg-brazil-yellow/20 p-8 rounded-3xl border-2 border-dashed border-brazil-yellow flex flex-col items-center gap-4 text-center animate-in fade-in slide-in-from-bottom-4">
        <Gift size={56} className="text-brazil-yellow" />
        <h2 className="text-2xl font-black text-brazil-blue leading-tight">Convide a galera<br/>e ganhe bônus!</h2>
        <p className="text-xs text-gray-600 font-medium px-4">
          Ganhe <strong className="text-brazil-green">R$ 2,00 em créditos</strong> para cada amigo que usar seu código ao entrar na primeira liga paga.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5 text-center animate-in zoom-in duration-300">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seu Código Exclusivo</p>
        <div className="text-4xl font-black tracking-widest text-brazil-blue bg-gray-50 py-4 rounded-xl border border-gray-100">
          {referralCode}
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={copiarCodigo}
            className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all text-xs uppercase tracking-wider"
          >
            <Copy size={16} /> Copiar
          </button>
          <button 
            onClick={compartilharWhatsApp}
            className="flex-[2] bg-brazil-green text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#009045] transition-all text-xs uppercase tracking-wider shadow-[0_4px_14px_0_rgba(0,168,89,0.39)]"
          >
            <Share2 size={16} /> Enviar no Zap
          </button>
        </div>
      </div>
    </div>
  );
}