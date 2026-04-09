import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Gift, Coins, CheckCircle2, AlertCircle } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function Roleta() {
  const navigate = useNavigate();
  const [girando, setGirando] = useState(false);
  const [premio, setPremio] = useState<number | null>(null);
  const [jaGirou, setJaGirou] = useState(false);
  const [loading, setLoading] = useState(true);

  // Monitora o login corretamente para evitar o "carregamento infinito"
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'usuarios', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const dados = userSnap.data();
          const hoje = new Date().toISOString().split('T')[0];
          
          if (dados.ultimaRoleta === hoje) {
            setJaGirou(true);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar roleta:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGirar = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Faça login para abrir a caixa diária!");
      navigate('/login');
      return;
    }

    setGirando(true);

    setTimeout(async () => {
      const sorteio = Math.random();
      let valorGanho = 0.10;
      if (sorteio > 0.6) valorGanho = 0.20;
      if (sorteio > 0.9) valorGanho = 0.50;

      try {
        const hoje = new Date().toISOString().split('T')[0];
        const userRef = doc(db, 'usuarios', user.uid);
        
        await updateDoc(userRef, {
          saldo: increment(valorGanho),
          ultimaRoleta: hoje
        });

        setPremio(valorGanho);
        setJaGirou(true);
      } catch (error) {
        console.error("Erro ao salvar prêmio:", error);
        alert("Erro de conexão. Tente novamente.");
      } finally {
        setGirando(false);
      }
    }, 2500);
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pb-24 bg-gray-50 min-h-screen">
      <Helmet><title>Sorteio Diário | Bolão Brasil</title></Helmet>

      <div className="flex items-center gap-3 mb-6 mt-2">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight leading-none">Bônus Diário</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Gire e Ganhe</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl w-full text-center space-y-8">
        
        {loading ? (
          <div className="py-10 animate-pulse text-gray-400 font-bold text-xs uppercase tracking-widest">
            Carregando sua sorte...
          </div>
        ) : premio !== null ? (
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
            <div className="w-24 h-24 bg-brazil-yellow/20 rounded-full flex items-center justify-center mx-auto border-4 border-brazil-yellow shadow-[0_0_30px_rgba(255,215,0,0.4)]">
              <Coins size={48} className="text-brazil-yellow" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-brazil-blue tracking-tight">R$ {premio.toFixed(2).replace('.', ',')}</h2>
              <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-widest">Adicionado ao seu saldo!</p>
            </div>
            <button onClick={() => navigate('/')} className="w-full bg-brazil-green text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-[#009045] transition-all uppercase text-xs tracking-wider">
              <CheckCircle2 size={18} /> Voltar para a Home
            </button>
          </motion.div>
        ) : jaGirou ? (
          <div className="space-y-6 py-6">
            <AlertCircle size={48} className="text-gray-300 mx-auto" />
            <div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight">Você já abriu hoje!</h2>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed px-4">
                Volte amanhã para resgatar mais bônus e usar nas suas ligas favoritas.
              </p>
            </div>
            <button onClick={() => navigate('/')} className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-xl transition-all uppercase text-xs tracking-wider mt-4">
              Ir para o Calendário
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-brazil-blue tracking-tight leading-tight">Caixa Misteriosa<br/>Diária</h2>
              <p className="text-xs text-gray-500 mt-2 font-medium px-4">Abra agora e ganhe até R$ 0,50 de bônus em créditos para o seu bolão.</p>
            </div>

            <motion.div 
              animate={girando ? { y: [0, -20, 0], rotate: [0, -5, 5, -5, 0] } : {}} 
              transition={{ repeat: girando ? Infinity : 0, duration: 0.5 }}
              className={`w-32 h-32 mx-auto rounded-3xl flex items-center justify-center shadow-xl ${girando ? 'bg-brazil-yellow' : 'bg-brazil-blue'}`}
            >
              <Gift size={64} className={girando ? 'text-brazil-blue' : 'text-brazil-yellow'} />
            </motion.div>

            <button 
              onClick={handleGirar}
              disabled={girando}
              className="w-full bg-brazil-yellow text-brazil-blue font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-105 disabled:opacity-50 transition-all uppercase text-xs tracking-wider"
            >
              {girando ? 'Sorteando Prêmio...' : 'ABRIR CAIXA AGORA'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}