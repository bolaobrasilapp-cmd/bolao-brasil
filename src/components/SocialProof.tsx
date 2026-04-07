import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Trophy, Users } from 'lucide-react';

const acoes = [
  { nome: "Michele N.", acao: "entrou no Bolão Bar do Boca", tempo: "agora mesmo", icon: Users, color: "text-brazil-green" },
  { nome: "Andriw K.", acao: "criou a liga Família Krutze", tempo: "há 2 min", icon: Trophy, color: "text-brazil-yellow" },
  { nome: "Carlos T.", acao: "cravou o placar de FLA x PAL", tempo: "há 5 min", icon: CheckCircle2, color: "text-brazil-blue" },
  { nome: "Mariana S.", acao: "entrou no Bolão Nacional", tempo: "há 10 min", icon: Users, color: "text-brazil-green" },
  { nome: "Sophia K.", acao: "entrou na liga Cowburguer", tempo: "há 12 min", icon: Users, color: "text-brazil-green" },
  { nome: "João P.", acao: "criou uma liga privada", tempo: "há 15 min", icon: Trophy, color: "text-brazil-blue" },
];

export const SocialProof: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Ciclo: Espera 5s, mostra por 6s, esconde por 8s
    const showTimeout = setTimeout(() => setVisible(true), 5000);
    
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % acoes.length);
        setVisible(true);
      }, 8000); // Tempo que fica escondido entre um e outro
    }, 14000); // Ciclo total

    return () => {
      clearTimeout(showTimeout);
      clearInterval(interval);
    };
  }, []);

  const atual = acoes[index];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 16, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-24 left-0 z-[100] bg-white border-l-4 border-brazil-green rounded-2xl shadow-2xl p-3 flex items-center gap-3 max-w-[280px]"
        >
          <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 ${atual.color}`}>
            <atual.icon size={20} />
          </div>
          <div className="flex flex-col">
            <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight">Atividade Verificada</p>
            <p className="text-[10px] text-gray-600 leading-tight">
              <span className="font-bold text-brazil-blue">{atual.nome}</span> {atual.acao}
            </p>
            <p className="text-[9px] text-gray-400 mt-0.5">{atual.tempo}</p>
          </div>
          <button 
            onClick={() => setVisible(false)}
            className="absolute top-1 right-2 text-gray-300 hover:text-gray-500 text-xs"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};