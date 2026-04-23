import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin, Clock, ShieldCheck, Trophy, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface Jogo {
  id: string;
  home: string;
  away: string;
  logoHome?: string;
  logoAway?: string;
  data?: string;
  hora?: string;
  estadio?: string;
  categoria: string;
  rodada: number;
  encerrado?: boolean;
  scoreHomeReal?: number;
  scoreAwayReal?: number;
}

// O CÉREBRO DAS IMAGENS: Mantendo a padronização visual
const getEscudoLocal = (nome: string) => {
  if (!nome) return null;
  const n = nome.toLowerCase();
  if (n.includes('athletico') || n === 'cap') return '/escudos/Athletico Paranaense.png';
  if (n.includes('atlético-mg') || n.includes('atletico') || n === 'cam') return '/escudos/Atlético Mineiro.png';
  if (n.includes('bahia') || n === 'bah') return '/escudos/Bahia.png';
  if (n.includes('botafogo') || n === 'bot') return '/escudos/Botafogo.png';
  if (n.includes('chape') || n === 'cha') return '/escudos/Chapecoense.png';
  if (n.includes('corinthians') || n === 'cor') return '/escudos/Corinthians.png';
  if (n.includes('coritiba') || n === 'cfc') return '/escudos/Coritiba.png';
  if (n.includes('cruzeiro') || n === 'cru') return '/escudos/Cruzeiro.png';
  if (n.includes('flamengo') || n === 'fla') return '/escudos/Flamengo.png';
  if (n.includes('fluminense') || n === 'flu') return '/escudos/Fluminense.png';
  if (n.includes('gremio') || n.includes('grêmio') || n === 'gre') return '/escudos/Gremio.png';
  if (n.includes('internacional') || n.includes('inter') || n === 'int') return '/escudos/Internacional.png';
  if (n.includes('mirassol') || n === 'mir') return '/escudos/Mirassol-SP.png';
  if (n.includes('palmeiras') || n === 'pal') return '/escudos/Palmeiras.png';
  if (n.includes('bragantino') || n.includes('red bull') || n === 'rbb') return '/escudos/Red Bull Bragantino.png';
  if (n.includes('santos') || n === 'san') return '/escudos/Santos.png';
  if (n.includes('paulo') || n === 'sao' || n === 'spo') return '/escudos/São Paulo.png';
  if (n.includes('vasco') || n === 'vas') return '/escudos/Vasco da Gama.png';
  if (n.includes('vitoria') || n.includes('vitória') || n === 'vit') return '/escudos/Vitoria.png';
  if (n.includes('remo') || n === 'rem') return '/escudos/Remo.png';
  return null; 
};

export default function Calendario() {
  const navigate = useNavigate();
  const [abaCategoria, setAbaCategoria] = useState<'brasileirao' | 'copa'>('brasileirao');
  const [abaStatus, setAbaStatus] = useState<'proximos' | 'encerrados'>('proximos');
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "jogos"), orderBy("rodada", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const listaJogos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Jogo));
      setJogos(listaJogos);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // FILTRO DUPLO: Categoria (Brasileirão/Copa) + Status (Próximos/Encerrados)
  const jogosFiltrados = jogos.filter(j => 
    j.categoria === abaCategoria && 
    (abaStatus === 'proximos' ? !j.encerrado : j.encerrado)
  );
  
  const rodadaExibida = jogosFiltrados.length > 0 ? jogosFiltrados[0].rodada : null;

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen">
      <Helmet><title>Calendário Oficial | Bolão Brasil</title></Helmet>

      <div className="space-y-1">
        <h2 className="text-2xl font-black text-brazil-blue">Calendário</h2>
        <p className="text-sm text-gray-500 font-medium">Acompanhe as rodadas e não perca o prazo.</p>
      </div>

      {/* Nível 1: Competição */}
      <div className="flex bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
        <button onClick={() => setAbaCategoria('brasileirao')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${abaCategoria === 'brasileirao' ? 'bg-brazil-blue text-white shadow-md' : 'text-gray-400 hover:text-brazil-blue'}`}>Brasileirão</button>
        <button onClick={() => setAbaCategoria('copa')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${abaCategoria === 'copa' ? 'bg-brazil-blue text-white shadow-md' : 'text-gray-400 hover:text-brazil-blue'}`}>Copa do Mundo</button>
      </div>

      {/* Nível 2: Status (Próximos vs Encerrados) */}
      <div className="flex gap-2">
        <button 
          onClick={() => setAbaStatus('proximos')}
          className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest rounded-full border transition-all ${abaStatus === 'proximos' ? 'bg-brazil-green border-brazil-green text-white shadow-sm' : 'bg-white border-gray-200 text-gray-400'}`}
        >
          Próximos Jogos
        </button>
        <button 
          onClick={() => setAbaStatus('encerrados')}
          className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest rounded-full border transition-all ${abaStatus === 'encerrados' ? 'bg-gray-800 border-gray-800 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-400'}`}
        >
          Rodadas Anteriores
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center opacity-50 flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-brazil-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sincronizando...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rodadaExibida && (
            <div className="flex items-center justify-between px-1">
              <h3 className="font-black text-gray-700 text-sm uppercase italic">Rodada #{rodadaExibida}</h3>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${abaStatus === 'proximos' ? 'bg-brazil-green/10 text-brazil-green' : 'bg-gray-100 text-gray-500'}`}>
                {abaStatus === 'proximos' ? 'Aberta' : 'Finalizada'}
              </span>
            </div>
          )}

          {jogosFiltrados.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-dashed border-gray-200 text-center space-y-3">
              <AlertCircle size={32} className="text-gray-200 mx-auto" />
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Nenhum jogo {abaStatus === 'proximos' ? 'pendente' : 'encerrado'} encontrado para esta categoria.
              </p>
            </div>
          ) : (
            jogosFiltrados.map((jogo) => {
              const escudoCasa = getEscudoLocal(jogo.home) || jogo.logoHome;
              const escudoVisitante = getEscudoLocal(jogo.away) || jogo.logoAway;

              return (
                <div key={jogo.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden transition-all hover:border-gray-200">
                  <div className={`absolute top-0 left-0 w-full h-1 ${abaStatus === 'proximos' ? 'bg-brazil-blue' : 'bg-gray-300'}`}></div>
                  
                  <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-3">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <CalendarIcon size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-wider">{jogo.data}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-brazil-blue">
                      <Clock size={12} />
                      <span className="text-[10px] font-black">{jogo.hora}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                    {/* Time Casa */}
                    <div className="flex flex-col items-center flex-1 gap-2">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner overflow-hidden p-2">
                        {escudoCasa ? <img src={escudoCasa} className="w-full h-full object-contain" alt="Escudo" /> : <ShieldCheck className="text-gray-200" />}
                      </div>
                      <span className="text-[10px] font-black text-gray-800 uppercase tracking-tight text-center truncate w-full">{jogo.home}</span>
                    </div>
                    
                    {/* CENTRO: VS/Palpitar ou Placar Real */}
                    <div className="flex flex-col items-center gap-2 px-2">
                      {abaStatus === 'proximos' ? (
                        <>
                          <span className="text-gray-200 font-black text-[10px]">VS</span>
                          <button 
                            onClick={() => navigate('/palpites')}
                            className="bg-brazil-yellow text-brazil-blue font-black text-[9px] px-4 py-2 rounded-full uppercase tracking-wider shadow-sm hover:scale-105 transition-transform whitespace-nowrap"
                          >
                            Palpitar
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-800 text-white rounded-lg flex items-center justify-center font-black text-sm">{jogo.scoreHomeReal ?? 0}</div>
                          <span className="text-gray-300 font-black text-xs">X</span>
                          <div className="w-8 h-8 bg-gray-800 text-white rounded-lg flex items-center justify-center font-black text-sm">{jogo.scoreAwayReal ?? 0}</div>
                        </div>
                      )}
                    </div>

                    {/* Time Visitante */}
                    <div className="flex flex-col items-center flex-1 gap-2">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner overflow-hidden p-2">
                        {escudoVisitante ? <img src={escudoVisitante} className="w-full h-full object-contain" alt="Escudo" /> : <ShieldCheck className="text-gray-200" />}
                      </div>
                      <span className="text-[10px] font-black text-gray-800 uppercase tracking-tight text-center truncate w-full">{jogo.away}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-center gap-1.5 text-gray-400">
                    <MapPin size={10} />
                    <span className="text-[8px] font-bold uppercase tracking-widest truncate">
                      {jogo.estadio || 'A Definir'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}