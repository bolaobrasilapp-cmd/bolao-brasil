import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { Trophy, ArrowLeft, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Jogo {
  id: string;
  home: string;
  away: string;
  logoHome?: string;
  logoAway?: string;
  data?: string;
  hora?: string;
  estadio?: string;
  encerrado?: boolean;
  scoreHomeReal?: number;
  scoreAwayReal?: number;
}

// O CÉREBRO DAS IMAGENS: Traduz o nome do banco para o arquivo exato da sua pasta
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

export default function Palpites() {
  const navigate = useNavigate();
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [palpites, setPalpites] = useState<Record<string, { home: string; away: string }>>({});
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [abaExibicao, setAbaExibicao] = useState<'proximos' | 'encerrados'>('proximos');

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jogos"));
        const listaJogos: Jogo[] = [];
        querySnapshot.forEach((doc) => {
          listaJogos.push({ id: doc.id, ...doc.data() } as Jogo);
        });
        setJogos(listaJogos);
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJogos();
  }, []);

  const handleScoreChange = (jogoId: string, team: 'home' | 'away', value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 2);
    setPalpites(prev => ({
      ...prev,
      [jogoId]: {
        ...prev[jogoId] || { home: '', away: '' },
        [team]: numericValue
      }
    }));
  };

  const handleSalvarPalpites = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Você precisa estar logado para salvar palpites!");
      navigate('/login');
      return;
    }

    const jogosPendentes = jogos.filter(j => !j.encerrado);

    if (Object.keys(palpites).length < jogosPendentes.length || jogosPendentes.length === 0) {
      alert("Preencha o placar de todos os jogos abertos antes de salvar!");
      return;
    }

    setSalvando(true);
    try {
      for (const jogoId of Object.keys(palpites)) {
        const palpiteRef = doc(db, `usuarios/${user.uid}/palpites`, jogoId);
        await setDoc(palpiteRef, {
          jogoId,
          homeScore: Number(palpites[jogoId].home),
          awayScore: Number(palpites[jogoId].away),
          dataPalpite: new Date().toISOString()
        });
      }
      setSucesso(true);
    } catch (error) {
      console.error("Erro ao salvar palpites:", error);
      alert("Erro ao salvar. Verifique sua conexão.");
    } finally {
      setSalvando(false);
    }
  };

  if (sucesso) {
    return (
      <div className="p-4 space-y-6 max-w-md mx-auto pb-24 min-h-screen flex flex-col justify-center items-center">
        <Helmet><title>Palpites Salvos | Bolão Brasil</title></Helmet>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl w-full text-center space-y-6 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-brazil-green/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} className="text-brazil-green" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Palpites Cravados!</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Tudo pronto para a rodada. Agora você precisa pagar a cota da liga para validar seus pontos.
            </p>
          </div>
          <button 
            onClick={() => navigate('/pix')} 
            className="w-full bg-brazil-yellow text-brazil-blue font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-105 transition-all uppercase text-xs tracking-wider"
          >
            PAGAR COTA (PIX)
          </button>
        </div>
      </div>
    );
  }

  // BLINDAGEM DE TEMPO: Verifica se a data e hora já passaram
  const isJogoPassado = (dataStr?: string, horaStr?: string) => {
    if (!dataStr) return false;
    const [dia, mes] = dataStr.split('/');
    const [hora, min] = (horaStr || '00:00').split(':');
    
    // Cria a data do jogo no formato oficial (Ano, Mês-1, Dia, Hora, Minuto)
    const dataJogo = new Date(new Date().getFullYear(), Number(mes) - 1, Number(dia), Number(hora), Number(min));
    const agora = new Date();
    
    return dataJogo < agora; // Retorna true se o jogo já passou
  };

  // DIVIDE OS JOGOS (Filtro Duplo: Firebase + Relógio do Celular)
  const jogosProximos = jogos.filter(j => !j.encerrado && !isJogoPassado(j.data, j.hora));
  const jogosAnteriores = jogos.filter(j => j.encerrado || isJogoPassado(j.data, j.hora));

  const jogosRenderizados = abaExibicao === 'proximos' ? jogosProximos : jogosAnteriores;

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pb-24 bg-gray-50 min-h-screen">
      <Helmet><title>Cravar Palpites | Bolão Brasil</title></Helmet>

      <div className="flex items-center gap-3 mb-4 mt-2">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight leading-none">Cravar Palpites</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Rodada Atual</p>
        </div>
      </div>

      {/* NOVO: ABAS DE NAVEGAÇÃO PARA SEPARAR OS JOGOS */}
      <div className="flex bg-white rounded-xl border border-gray-100 p-1 shadow-sm mb-6">
        <button 
          onClick={() => setAbaExibicao('proximos')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
            abaExibicao === 'proximos' ? 'bg-brazil-blue text-white shadow-md' : 'text-gray-400 hover:text-brazil-blue'
          }`}
        >
          Próximos
        </button>
        <button 
          onClick={() => setAbaExibicao('encerrados')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
            abaExibicao === 'encerrados' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-400 hover:text-gray-800'
          }`}
        >
          Encerrados
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <div className="w-8 h-8 border-4 border-brazil-green border-t-brazil-yellow rounded-full animate-spin mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest">Buscando Jogos...</p>
        </div>
      ) : jogosRenderizados.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-4">
          <AlertCircle size={40} className="text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-800">
            {abaExibicao === 'proximos' ? 'Nenhum jogo na rodada' : 'Nenhuma partida encerrada ainda'}
          </h3>
          <p className="text-xs text-gray-500">
            {abaExibicao === 'proximos' 
              ? 'O organizador (Admin) ainda não importou os jogos desta rodada via IA.'
              : 'Os resultados oficiais aparecerão aqui após o fim dos jogos.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* MENSAGEM DE PONTUAÇÃO (Apenas para Próximos) */}
          {abaExibicao === 'proximos' && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3 items-start">
              <Trophy size={16} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-[10px] text-blue-800 font-medium leading-relaxed">
                <strong>Placar exato:</strong> 25 pts | <strong>Vencedor e Saldo:</strong> 15 pts | <strong>Só Vencedor:</strong> 10 pts
              </p>
            </div>
          )}

          {jogosRenderizados.map((jogo) => {
            const escudoCasa = getEscudoLocal(jogo.home) || jogo.logoHome;
            const escudoVisitante = getEscudoLocal(jogo.away) || jogo.logoAway;

            return (
              <div key={jogo.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${abaExibicao === 'proximos' ? 'bg-gradient-to-r from-brazil-green to-brazil-yellow' : 'bg-gray-300'}`}></div>
                
                <div className="text-center mb-4 mt-1">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{jogo.data || 'Data a definir'} • {jogo.hora || '16:00'}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{jogo.estadio || 'Estádio a definir'}</p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  
                  {/* Time Casa */}
                  <div className="flex flex-col items-center flex-1 gap-2">
                    {escudoCasa ? (
                      <img src={escudoCasa} alt={jogo.home} className="w-10 h-10 object-contain drop-shadow-sm" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                        <ShieldCheck size={20} className="text-gray-300" />
                      </div>
                    )}
                    <span className="font-bold text-sm text-gray-800 text-center uppercase truncate w-full">{jogo.home}</span>
                  </div>

                  {/* CENTRO: INPUTS (Próximos) OU PLACAR OFICIAL (Encerrados) */}
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                    {abaExibicao === 'proximos' ? (
                      <>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={palpites[jogo.id]?.home || ''}
                          onChange={(e) => handleScoreChange(jogo.id, 'home', e.target.value)}
                          className="w-10 h-10 bg-white border border-gray-300 rounded-lg text-center font-black text-lg focus:border-brazil-blue focus:ring-2 focus:ring-brazil-blue/20 outline-none transition-all"
                        />
                        <span className="text-gray-400 font-black text-sm">X</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={palpites[jogo.id]?.away || ''}
                          onChange={(e) => handleScoreChange(jogo.id, 'away', e.target.value)}
                          className="w-10 h-10 bg-white border border-gray-300 rounded-lg text-center font-black text-lg focus:border-brazil-blue focus:ring-2 focus:ring-brazil-blue/20 outline-none transition-all"
                        />
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-gray-800 text-white rounded-lg flex items-center justify-center font-black text-lg">
                          {jogo.scoreHomeReal ?? '-'}
                        </div>
                        <span className="text-gray-400 font-black text-sm">X</span>
                        <div className="w-10 h-10 bg-gray-800 text-white rounded-lg flex items-center justify-center font-black text-lg">
                          {jogo.scoreAwayReal ?? '-'}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Time Visitante */}
                  <div className="flex flex-col items-center flex-1 gap-2">
                    {escudoVisitante ? (
                      <img src={escudoVisitante} alt={jogo.away} className="w-10 h-10 object-contain drop-shadow-sm" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                        <ShieldCheck size={20} className="text-gray-300" />
                      </div>
                    )}
                    <span className="font-bold text-sm text-gray-800 text-center uppercase truncate w-full">{jogo.away}</span>
                  </div>
                </div>
                
                {/* AVISO DE FIM DE JOGO */}
                {abaExibicao === 'encerrados' && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
                    <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-3 py-1 rounded-full uppercase tracking-widest">Partida Encerrada</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* BOTÃO DE SALVAR (Apenas para Próximos) */}
          {abaExibicao === 'proximos' && (
            <>
              <button 
                onClick={handleSalvarPalpites}
                disabled={salvando}
                className="w-full bg-brazil-blue text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-blue-900 disabled:opacity-50 transition-all uppercase text-xs tracking-wider mt-6"
              >
                {salvando ? 'Salvando Palpites...' : 'Salvar e Ir para Pagamento'}
              </button>
              
              <div className="flex items-center justify-center gap-1 mt-3">
                <ShieldCheck size={12} className="text-brazil-green" />
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Transação segura 256-bit</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}