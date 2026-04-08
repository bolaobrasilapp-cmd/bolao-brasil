import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Calendario() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState<'brasileirao' | 'copa'>('brasileirao');
  const [jogos, setJogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Monitora os jogos no Firebase em tempo real
  useEffect(() => {
    const q = query(collection(db, "jogos"), orderBy("rodada", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const listaJogos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJogos(listaJogos);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Filtra os jogos de acordo com a aba (brasileirao ou copa)
  const jogosFiltrados = jogos.filter(j => j.categoria === abaAtiva);
  
  // Pega o número da rodada do primeiro jogo da lista
  const rodadaExibida = jogosFiltrados.length > 0 ? jogosFiltrados[0].rodada : 1;

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Calendário de Jogos | Bolão Brasil</title>
      </Helmet>

      {/* Cabeçalho */}
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-brazil-blue">Calendário</h2>
        <p className="text-sm text-gray-500">
          Acompanhe as datas e horários para não perder nenhum palpite.
        </p>
      </div>

      {/* Abas */}
      <div className="flex bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
        <button 
          onClick={() => setAbaAtiva('brasileirao')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
            abaAtiva === 'brasileirao' ? 'bg-brazil-blue text-white shadow-md' : 'text-gray-400 hover:text-brazil-blue'
          }`}
        >
          Brasileirão
        </button>
        <button 
          onClick={() => setAbaAtiva('copa')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
            abaAtiva === 'copa' ? 'bg-brazil-blue text-white shadow-md' : 'text-gray-400 hover:text-brazil-blue'
          }`}
        >
          Copa do Mundo
        </button>
      </div>

      {/* Lista de Jogos Dinâmica */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-bold animate-pulse uppercase text-xs tracking-widest">
          Sincronizando com a CBF...
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-gray-700">Rodada #{rodadaExibida}</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brazil-green/10 text-brazil-green px-2 py-1 rounded-md">Atualizado</span>
          </div>

          {jogosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-dashed border-gray-200 text-center text-gray-400 text-xs font-bold uppercase">
              Nenhum jogo cadastrado para esta categoria.
            </div>
          ) : (
            jogosFiltrados.map((jogo) => (
              <div key={jogo.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-3">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <CalendarIcon size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{jogo.data}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-brazil-blue">
                    <Clock size={14} />
                    <span className="text-xs font-black">{jogo.hora}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between gap-4">
                  {/* Time da Casa */}
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 text-xl">
                      {jogo.homeEmoji || '⚽'}
                    </div>
                    <span className="text-[11px] font-black text-gray-800 uppercase tracking-wide text-center">{jogo.home}</span>
                  </div>
                  
                  {/* VS / Botão Palpitar */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-gray-300 font-black text-xs">VS</span>
                    <button 
                      onClick={() => navigate('/palpites')}
                      className="bg-brazil-yellow text-brazil-blue font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-wider shadow-sm hover:scale-105 transition-transform"
                    >
                      Palpitar
                    </button>
                  </div>

                  {/* Time Visitante */}
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 text-xl">
                      {jogo.awayEmoji || '⚽'}
                    </div>
                    <span className="text-[11px] font-black text-gray-800 uppercase tracking-wide text-center">{jogo.away}</span>
                  </div>
                </div>

                {/* Local */}
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-center gap-1.5 text-gray-400">
                  <MapPin size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">
                    {jogo.estadio || 'A Definir'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Placeholder da Copa */}
      {abaAtiva === 'copa' && jogosFiltrados.length === 0 && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center space-y-3">
          <div className="w-16 h-16 bg-brazil-yellow/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-3xl">🏆</span>
          </div>
          <h3 className="font-black text-gray-800">Grupos da Copa 2026</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            A tabela oficial da Copa do Mundo FIFA 2026 será liberada após o sorteio dos grupos.
          </p>
        </div>
      )}
    </div>
  );
}