import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Flame, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface RankUser {
  id: string;
  nome: string;
  pontos: number;
}

export default function Rankings() {
  const navigate = useNavigate();
  const [rankingData, setRankingData] = useState<RankUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        // Puxa os top 50 usuários do Firebase ordenados por pontos
        const q = query(collection(db, "usuarios"), orderBy("pontos", "desc"), limit(50));
        const querySnapshot = await getDocs(q);
        
        const usuarios: RankUser[] = [];
        querySnapshot.forEach((doc) => {
          usuarios.push({ id: doc.id, ...doc.data() } as RankUser);
        });
        
        setRankingData(usuarios);
      } catch (error) {
        console.error("Erro ao buscar ranking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Ranking Geral | Bolão Brasil</title>
      </Helmet>

      {/* Navegação Topo */}
      <div className="flex items-center gap-3 mb-2 mt-2">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50">
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Seu Design de Cabeçalho Mantido */}
      <div className="bg-brazil-blue text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Trophy className="text-brazil-yellow" /> Ranking Global
          </h2>
          <p className="text-sm opacity-80 mt-1">Sua posição entre todos os torcedores.</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Trophy size={120} />
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
            <div className="w-8 h-8 border-4 border-brazil-blue border-t-brazil-yellow rounded-full animate-spin mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Buscando líderes...</p>
          </div>
        ) : rankingData.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-4">
            <Trophy size={48} className="text-gray-200 mx-auto" />
            <h3 className="font-bold text-gray-800">Ranking Vazio</h3>
            <p className="text-xs text-gray-500">Ninguém pontuou ainda. Seja o primeiro a cravar!</p>
          </div>
        ) : (
          rankingData.map((user, index) => {
            const pos = index + 1;
            return (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: pos * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-xl border shadow-sm ${
                  pos === 1 ? 'bg-brazil-yellow/10 border-brazil-yellow' : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 flex items-center justify-center font-black rounded-full ${
                    pos === 1 ? 'bg-brazil-yellow text-brazil-blue' :
                    pos === 2 ? 'bg-gray-300 text-gray-700' :
                    pos === 3 ? 'bg-orange-300 text-orange-800' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {pos}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${pos === 1 ? 'text-brazil-blue' : 'text-gray-800'}`}>
                      {user.nome || 'Torcedor'}
                    </p>
                    <p className="text-[10px] text-gray-500">Liga Brasil</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  {pos === 1 && <Flame size={16} className="text-red-500" />}
                  <div>
                    <p className={`font-black ${pos === 1 ? 'text-brazil-blue' : 'text-brazil-green'}`}>
                      {user.pontos || 0} <span className="text-[10px] uppercase font-bold">pts</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}