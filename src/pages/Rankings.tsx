import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Flame } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Rankings() {
  const rankingData = [
    { pos: 1, nome: "Diego (Você)", pontos: 1250, acertos: 14, trend: "up" },
    { pos: 2, nome: "Carlos T.", pontos: 1180, acertos: 12, trend: "up" },
    { pos: 3, nome: "Mariana S.", pontos: 1150, acertos: 11, trend: "down" },
    { pos: 4, nome: "João P.", pontos: 980, acertos: 9, trend: "same" },
    { pos: 5, nome: "Jeferson K.", pontos: 850, acertos: 8, trend: "up" },
    { pos: 6, nome: "Andriw", pontos: 720, acertos: 6, trend: "down" },
  ];

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Ranking Geral | Bolão Brasil</title>
      </Helmet>

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
        {rankingData.map((user) => (
          <motion.div 
            key={user.pos}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: user.pos * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-xl border shadow-sm ${
              user.pos === 1 ? 'bg-brazil-yellow/10 border-brazil-yellow' : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 flex items-center justify-center font-black rounded-full ${
                user.pos === 1 ? 'bg-brazil-yellow text-brazil-blue' :
                user.pos === 2 ? 'bg-gray-300 text-gray-700' :
                user.pos === 3 ? 'bg-orange-300 text-orange-800' :
                'bg-gray-100 text-gray-500'
              }`}>
                {user.pos}
              </div>
              <div>
                <p className={`font-bold text-sm ${user.pos === 1 ? 'text-brazil-blue' : 'text-gray-800'}`}>
                  {user.nome}
                </p>
                <p className="text-[10px] text-gray-500">{user.acertos} cravadas exatas</p>
              </div>
            </div>
            <div className="text-right flex items-center gap-2">
              {user.pos === 1 && <Flame size={16} className="text-red-500" />}
              <div>
                <p className={`font-black ${user.pos === 1 ? 'text-brazil-blue' : 'text-brazil-green'}`}>
                  {user.pontos} <span className="text-[10px] uppercase font-bold">pts</span>
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}