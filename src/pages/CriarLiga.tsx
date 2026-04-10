import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Trophy, ShieldCheck, Users, DollarSign, ArrowLeft, Copy, Share2, CheckCircle2, PlusCircle, Coins } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function CriarLiga() {
  const navigate = useNavigate();
  
  // Estados do formulário
  const [nomeLiga, setNomeLiga] = useState('');
  const [tipo, setTipo] = useState<'privada' | 'publica'>('privada');
  const [valor, setValor] = useState<number>(20);
  const [campeonato, setCampeonato] = useState('brasileirao');
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
  
  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [codigoGerado, setCodigoGerado] = useState('');

  const gerarCodigo = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCriarLiga = async () => {
    if (!nomeLiga.trim()) {
      alert('Por favor, dê um nome para o seu bolão.');
      return;
    }

    // Define o valor final: ou o fixo ou o digitado no "Outro"
    const valorFinal = isCustom ? Number(customValue) : valor;

    if (!valorFinal || valorFinal <= 0) {
      alert("Defina um valor válido para a entrada!");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('Você precisa estar logado para criar uma liga.');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const novoCodigo = gerarCodigo();
      
      // Salva a liga oficial no banco de dados do Firebase
      await addDoc(collection(db, "ligas"), {
        nome: nomeLiga,
        tipo: tipo,
        valorEntrada: valorFinal,
        campeonato: campeonato,
        adminId: user.uid,
        codigo: novoCodigo,
        participantesAtivos: 1, 
        premioAcumulado: valorFinal, 
        dataCriacao: new Date().toISOString(),
        status: 'aberta'
      });

      setCodigoGerado(novoCodigo);
    } catch (error) {
      console.error("Erro ao criar liga:", error);
      alert('Erro ao criar a liga. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoGerado);
    alert(`Código ${codigoGerado} copiado com sucesso!`);
  };

  const compartilharWhatsApp = () => {
    const valorExibido = isCustom ? customValue : valor;
    const texto = `Fala galera! Criei nosso bolão oficial: *${nomeLiga}* 🏆\n\nA cota é de R$ ${valorExibido},00 com Pix automático pro vencedor.\n\nBaixe o app e entre com o meu código: *${codigoGerado}*\n👉 https://bolaobrasil.app.br`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  if (codigoGerado) {
    return (
      <div className="p-4 space-y-6 max-w-md mx-auto pb-24 min-h-screen flex flex-col justify-center items-center">
        <Helmet><title>Liga Criada | Bolão Brasil</title></Helmet>
        
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl w-full text-center space-y-6 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-brazil-green/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} className="text-brazil-green" />
          </div>
          
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Liga Criada!</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Sua liga <strong>{nomeLiga}</strong> já está rodando. Convide a galera para aumentar o prêmio!
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Código de Convite</p>
            <p className="text-3xl font-black text-brazil-blue tracking-[0.2em]">{codigoGerado}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={compartilharWhatsApp} className="w-full bg-brazil-green text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#009045] transition-all shadow-[0_4px_14px_0_rgba(0,168,89,0.39)] uppercase text-xs tracking-wider">
              <Share2 size={16} /> Compartilhar no Grupo
            </button>
            <button onClick={copiarCodigo} className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all uppercase text-xs tracking-wider">
              <Copy size={16} /> Copiar Código
            </button>
          </div>

          <button onClick={() => navigate('/')} className="text-xs font-bold text-gray-400 hover:text-brazil-blue uppercase tracking-widest pt-4">
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pb-24 bg-gray-50 min-h-screen">
      <Helmet><title>Criar Liga | Bolão Brasil</title></Helmet>

      <div className="flex items-center gap-3 mb-6 mt-2">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight leading-none">Nova Liga</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Seja o Dono do Bolão</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Trophy size={12} /> Nome do seu Bolão
          </label>
          <input 
            type="text" 
            placeholder="Ex: Bolão da Firma, Resenha FC..."
            value={nomeLiga}
            onChange={(e) => setNomeLiga(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 text-sm focus:outline-none focus:border-brazil-blue focus:bg-white transition-all font-bold text-gray-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck size={12} /> Privacidade
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setTipo('privada')}
              className={`py-3 px-4 rounded-xl text-xs font-bold border-2 transition-all flex flex-col items-center gap-1 ${tipo === 'privada' ? 'border-brazil-blue bg-brazil-blue/5 text-brazil-blue' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
            >
              <Users size={18} />
              Privada (Amigos)
            </button>
            <button 
              onClick={() => setTipo('publica')}
              className={`py-3 px-4 rounded-xl text-xs font-bold border-2 transition-all flex flex-col items-center gap-1 ${tipo === 'publica' ? 'border-brazil-blue bg-brazil-blue/5 text-brazil-blue' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
            >
              <Trophy size={18} />
              Pública (Todos)
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Coins size={12} /> Valor da Entrada (Cota por pessoa)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[1, 10, 20, 50].map((v) => (
              <button 
                key={v}
                onClick={() => { setValor(v); setIsCustom(false); }}
                className={`py-3 rounded-xl text-sm font-black border-2 transition-all ${(!isCustom && valor === v) ? 'border-brazil-green bg-brazil-green/10 text-brazil-green' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
              >
                R$ {v}
              </button>
            ))}
            <button 
                onClick={() => setIsCustom(true)}
                className={`py-3 rounded-xl text-sm font-black border-2 transition-all ${isCustom ? 'border-brazil-green bg-brazil-green/10 text-brazil-green' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
              >
                Outro
            </button>
          </div>

          {isCustom && (
            <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <input 
                type="number"
                placeholder="Digite o valor (ex: 5)"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="w-full bg-brazil-green/5 border border-brazil-green/30 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brazil-green font-black text-brazil-green"
              />
            </div>
          )}

          <p className="text-[9px] text-gray-400 font-medium text-center mt-2">10% do pote é retido para manutenção da plataforma via Efí Bank.</p>
        </div>

        <button 
          onClick={handleCriarLiga}
          disabled={loading}
          className="w-full bg-brazil-blue text-brazil-yellow font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all uppercase text-xs tracking-wider mt-4"
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-brazil-yellow/30 border-t-brazil-yellow rounded-full animate-spin" /> Processando...</>
          ) : (
            <><PlusCircle size={18} /> Criar Liga Agora</>
          )}
        </button>

      </div>
    </div>
  );
}