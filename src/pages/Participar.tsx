import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Search, ShieldCheck, ArrowRight, Lock, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export default function Participar() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [codigoConvite, setCodigoConvite] = useState('');
  const [ligasPublicas, setLigasPublicas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buscandoCodigo, setBuscandoCodigo] = useState(false);

  // Busca ligas públicas reais do banco de dados
  useEffect(() => {
    const fetchLigas = async () => {
      try {
        const q = query(
          collection(db, "ligas"), 
          where("tipo", "==", "publica"),
          where("status", "==", "aberta"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const lista: any[] = [];
        querySnapshot.forEach((doc) => {
          lista.push({ id: doc.id, ...doc.data() });
        });
        setLigasPublicas(lista);
      } catch (error) {
        console.error("Erro ao buscar ligas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLigas();
  }, []);

  // Função para entrar em liga privada via código (O coração da viralização)
  const handleEntrarComCodigo = async () => {
    if (codigoConvite.length < 6) {
      alert("O código de convite tem 6 caracteres.");
      return;
    }

    setBuscandoCodigo(true);
    try {
      const q = query(collection(db, "ligas"), where("codigo", "==", codigoConvite.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Código de liga não encontrado. Verifique se digitou corretamente.");
      } else {
        const ligaDoc = querySnapshot.docs[0];
        // Aqui você pode salvar que o usuário agora pertence a essa liga
        navigate('/palpites');
      }
    } catch (error) {
      alert("Erro ao validar código.");
    } finally {
      setBuscandoCodigo(false);
    }
  };

  const ligasFiltradas = ligasPublicas.filter(liga => 
    liga.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Participar de Bolão | Bolão Brasil</title>
      </Helmet>

      <div className="space-y-2 mt-4">
        <h2 className="text-2xl font-black text-brazil-blue leading-tight text-center">Encontre seu Bolão</h2>
        <p className="text-xs text-gray-500 text-center px-4 font-medium">Entre em uma liga pública ou use um código privado.</p>
      </div>

      {/* SEÇÃO: CÓDIGO PRIVADO (CONGRUÊNCIA COM A CRIAÇÃO DE LIGA) */}
      <div className="bg-brazil-blue rounded-2xl p-5 shadow-lg border border-blue-900 text-white space-y-4">
        <div className="flex items-center gap-2">
          <Lock size={18} className="text-brazil-yellow" />
          <h3 className="font-bold text-sm uppercase tracking-wider">Tenho um Código</h3>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ex: A1B2C3" 
            value={codigoConvite}
            onChange={(e) => setCodigoConvite(e.target.value.toUpperCase())}
            maxLength={6}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-center font-black tracking-[0.3em] outline-none focus:border-brazil-yellow transition-all"
          />
          <button 
            onClick={handleEntrarComCodigo}
            disabled={buscandoCodigo}
            className="bg-brazil-yellow text-brazil-blue font-black px-6 rounded-xl text-xs uppercase hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {buscandoCodigo ? '...' : 'Entrar'}
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar bolão público..." 
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brazil-blue transition-all shadow-sm"
        />
      </div>

      {/* Lista de Ligas Reais */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Ligas em Destaque</h3>
        
        {loading ? (
          <div className="text-center py-10 opacity-50">
            <div className="w-6 h-6 border-2 border-brazil-blue border-t-brazil-yellow rounded-full animate-spin mx-auto mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Carregando Vitrine...</p>
          </div>
        ) : ligasFiltradas.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">
            <AlertCircle size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Nenhum bolão público encontrado com esse nome.</p>
          </div>
        ) : (
          ligasFiltradas.map((liga) => (
            <motion.div 
              key={liga.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brazil-green/10 flex items-center justify-center shrink-0">
                    <Trophy size={20} className="text-brazil-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brazil-blue text-sm truncate max-w-[140px]">{liga.nome}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                      <ShieldCheck size={12} className="text-brazil-green" />
                      <span>Verificado</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Entrada</p>
                  <p className="font-black text-brazil-green">R$ {liga.valorEntrada},00</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                <div>
                  <p className="text-[9px] uppercase font-bold text-gray-400">Prêmio Estimado</p>
                  <p className="font-black text-brazil-blue">R$ {liga.premioAcumulado || (liga.valorEntrada * 10)},00</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600">
                  <Users size={14} className="text-gray-400" /> {liga.participantesAtivos || 1}
                </div>
              </div>

              <button 
                onClick={() => navigate('/palpites')}
                className="w-full bg-brazil-yellow text-brazil-blue font-black text-xs py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-105 transition-all uppercase tracking-widest shadow-sm"
              >
                Participar Agora <ArrowRight size={16} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}