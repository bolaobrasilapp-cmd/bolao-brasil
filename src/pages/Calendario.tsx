import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Trophy, MapPin, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Calendario() {
  const [tab, setTab] = useState<'brasileirao' | 'copa'>('brasileirao');

  const jogosBrasileirao = [
    { id: 101, data: '11/04', hora: '19:00', mandante: 'Botafogo', mandanteImg: '⭐', visitante: 'Vasco', visitanteImg: '💢', local: 'Nilton Santos' },
    { id: 102, data: '12/04', hora: '16:00', mandante: 'Flamengo', mandanteImg: '🔴⚫', visitante: 'Palmeiras', visitanteImg: '🟢⚪', local: 'Maracanã' },
    { id: 103, data: '12/04', hora: '16:00', mandante: 'São Paulo', mandanteImg: '🔴⚪', visitante: 'Corinthians', visitanteImg: '⚫⚪', local: 'Morumbis' },
    { id: 104, data: '13/04', hora: '20:00', mandante: 'Grêmio', mandanteImg: '🔵⚪', visitante: 'Internacional', visitanteImg: '🔴⚪', local: 'Arena do Grêmio' },
  ];

  const jogosCopa = [
    { id: 201, data: '08/06', hora: '15:00', mandante: 'Brasil', mandanteImg: '🇧🇷', visitante: 'França', visitanteImg: '🇫🇷', local: 'Estádio Nacional' },
    { id: 202, data: '09/06', hora: '12:00', mandante: 'Argentina', mandanteImg: '🇦🇷', visitante: 'Espanha', visitanteImg: '🇪🇸', local: 'Arena Central' },
    { id: 203, data: '10/06', hora: '15:00', mandante: 'Portugal', mandanteImg: '🇵🇹', visitante: 'Alemanha', visitanteImg: '🇩🇪', local: 'Estádio de Lusail' },
  ];

  const listaAtual = tab === 'brasileirao' ? jogosBrasileirao : jogosCopa;

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Calendário de Jogos | Bolão Brasil</title>
      </Helmet>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-brazil-blue">Calendário</h2>
        <p className="text-sm text-gray-500">Acompanhe as datas e horários para não perder nenhum palpite.</p>
      </div>

      {/* Abas de Seleção */}
      <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
        <button 
          onClick={() => setTab('brasileirao')}
          className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${tab === 'brasileirao' ? 'bg-brazil-blue text-white shadow-md' : 'text-gray-400'}`}
        >
          Brasileirão
        </button>
        <button 
          onClick={() => setTab('copa')}
          className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${tab === 'copa' ? 'bg-brazil-green text-white shadow-md' : 'text-gray-400'}`}
        >
          Copa do Mundo
        </button>
      </div>

      {/* Lista de Jogos */}
      <div className="space-y-4">
        {listaAtual.map((jogo) => (
          <motion.div 
            key={jogo.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-3">
              <div className="flex items-center gap-2 text-gray-400">
                <CalendarIcon size={14} />
                <span className="text-[10px] font-bold uppercase">{jogo.data}</span>
              </div>
              <div className="flex items-center gap-2 text-brazil-blue">
                <Clock size={14} />
                <span className="text-[10px] font-black">{jogo.hora}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 py-2">
              <div className="flex flex-col items-center flex-1 text-center">
                <span className="text-2xl mb-1">{jogo.mandanteImg}</span>
                <span className="text-xs font-black text-gray-800 uppercase">{jogo.mandante}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-gray-300">VS</span>
                <button className="mt-2 bg-brazil-yellow text-brazil-blue text-[9px] font-black px-3 py-1 rounded-full shadow-sm">
                  PALPITAR
                </button>
              </div>

              <div className="flex flex-col items-center flex-1 text-center">
                <span className="text-2xl mb-1">{jogo.visitanteImg}</span>
                <span className="text-xs font-black text-gray-800 uppercase">{jogo.visitante}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              <MapPin size={10} className="text-brazil-green" />
              {jogo.local}
            </div>
          </motion.div>
        ))}
      </div>

      {tab === 'copa' && (
        <div className="bg-brazil-green/10 border border-brazil-green/20 rounded-xl p-4 flex items-center gap-4">
          <Trophy className="text-brazil-green shrink-0" size={24} />
          <p className="text-[10px] text-brazil-green font-bold leading-relaxed uppercase">
            Bolão da Copa Liberado! Comece a analisar os grupos e garanta sua vaga nas ligas nacionais.
          </p>
        </div>
      )}
    </div>
  );
}