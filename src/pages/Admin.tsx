import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, doc, writeBatch, getDocs, updateDoc } from 'firebase/firestore';
import { LayoutDashboard, Trophy, DollarSign, Users, CheckCircle, AlertCircle, Search, Lock, KeyRound, Sparkles, DatabaseZap, Copy, UploadCloud, RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface Repasse {
  id: string;
  nome: string;
  liga: string;
  valor: number;
  chavePix: string;
  status: 'PENDENTE' | 'PAGO';
  comprovanteUrl?: string;
}

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'dashboard' | 'resultados' | 'repasses' | 'jogos'>('resultados');
  
  // Estados para Robôs
  const [loadingIA, setLoadingIA] = useState(false);
  const [loadingResultados, setLoadingResultados] = useState(false);
  const [debugErro, setDebugErro] = useState('');

  // Estados para Repasses
  const [repasses, setRepasses] = useState<Repasse[]>([]);
  const [loadingRepasses, setLoadingRepasses] = useState(false);
  const [comprovantesBase64, setComprovantesBase64] = useState<Record<string, string>>({});

  const SENHA_MASTER = 'Lara#340@123';

  const handleLogin = () => {
    if (senha === SENHA_MASTER) {
      setAutenticado(true);
      setErro('');
      carregarRepasses();
    } else {
      setErro('Senha incorreta.');
      setSenha('');
    }
  };

  const carregarRepasses = async () => {
    setLoadingRepasses(true);
    try {
      setRepasses([
        { id: 'rep_123', nome: 'João Silva', liga: 'Liga Cowburguer', valor: 810.00, chavePix: '11999998888', status: 'PENDENTE' }
      ]);
    } catch (error) {
      console.error("Erro", error);
    } finally {
      setLoadingRepasses(false);
    }
  };

  // ROBÔ 1: Puxar Jogos da Rodada
  const puxarJogosDaAPI = async () => {
    setLoadingIA(true);
    setDebugErro('');
    try {
      const response = await fetch('/api/robo-jogos');
      const data = await response.json();

      if (!response.ok) {
        setDebugErro(`${data.error}: ${data.detalhe}`);
        return;
      }

      const batch = writeBatch(db);
      data.forEach((jogo: any) => {
        const idUnico = `${jogo.home}_${jogo.away}_R${jogo.rodada}`.replace(/[^a-zA-Z0-9]/g, '');
        const docRef = doc(collection(db, "jogos"), idUnico);
        batch.set(docRef, { ...jogo, dataCadastro: new Date().toISOString() });
      });

      await batch.commit();
      alert(`✅ SUCESSO! ${data.length} jogos importados/atualizados.`);
    } catch (error: any) {
      setDebugErro(`Falha de rede: ${error.message}`);
    } finally {
      setLoadingIA(false);
    }
  };

  // ROBÔ 2: Puxar Resultados Oficiais (NOVO)
  const apurarResultados = async () => {
    setLoadingResultados(true);
    setDebugErro('');
    try {
      const response = await fetch('/api/robo-resultados');
      const data = await response.json();

      if (!response.ok) {
        setDebugErro(`${data.error}: ${data.detalhe}`);
        return;
      }

      if (data.length === 0) {
        alert('Nenhum jogo com placar oficial encontrado no momento. Tente novamente mais tarde.');
        return;
      }

      const batch = writeBatch(db);
      data.forEach((resultado: any) => {
        const idUnico = `${resultado.home}_${resultado.away}_R${resultado.rodada}`.replace(/[^a-zA-Z0-9]/g, '');
        const docRef = doc(collection(db, "jogos"), idUnico);
        // Atualiza o banco com o placar real
        batch.update(docRef, { 
          scoreHomeReal: resultado.scoreHome, 
          scoreAwayReal: resultado.scoreAway,
          encerrado: resultado.encerrado 
        });
      });

      await batch.commit();
      alert(`✅ SUCESSO! Placar de ${data.length} jogos atualizados. (A distribuição de pontos será a próxima etapa)`);
    } catch (error: any) {
      setDebugErro(`Falha de rede: ${error.message}`);
    } finally {
      setLoadingResultados(false);
    }
  };

  const copiarPix = (chave: string) => {
    navigator.clipboard.writeText(chave);
    alert('Chave PIX copiada: ' + chave);
  };

  const handleUploadComprovante = (e: React.ChangeEvent<HTMLInputElement>, repasseId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setComprovantesBase64(prev => ({ ...prev, [repasseId]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmarPagamento = async (repasseId: string) => {
    const comprovante = comprovantesBase64[repasseId];
    if (!comprovante) {
      alert("Anexe o comprovante (print do PIX) antes de confirmar o pagamento!");
      return;
    }
    try {
      setRepasses(prev => prev.map(r => r.id === repasseId ? { ...r, status: 'PAGO', comprovanteUrl: comprovante } : r));
      alert("Pagamento confirmado e comprovante anexado com sucesso!");
    } catch (error) {
      alert("Erro ao confirmar pagamento.");
    }
  };

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-gray-800 p-8 rounded-3xl border border-gray-700 text-center">
          <Lock size={32} className="text-brazil-yellow mx-auto mb-4" />
          <h2 className="text-xl font-black text-white mb-6">Painel Master</h2>
          {erro && <p className="text-red-400 text-xs mb-4">{erro}</p>}
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl text-center text-white mb-4" placeholder="Senha Master" />
          <button onClick={handleLogin} className="w-full bg-brazil-yellow text-gray-900 font-black py-4 rounded-xl uppercase">Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pb-20">
      <div className="bg-gray-800 p-6 border-b border-gray-700">
        <h1 className="text-2xl font-black flex items-center justify-between">
          <span>Admin <span className="text-brazil-yellow">Bolão</span></span>
          <span className="text-[10px] bg-brazil-green/20 text-brazil-green px-3 py-1 rounded-full uppercase tracking-widest border border-brazil-green/30">Sistema Online</span>
        </h1>
      </div>

      <div className="flex bg-gray-800 p-2 gap-2 border-b border-gray-700 overflow-x-auto scrollbar-hide">
        <button onClick={() => setAbaAtiva('dashboard')} className={`px-4 py-3 rounded-xl text-xs font-black whitespace-nowrap transition-all ${abaAtiva === 'dashboard' ? 'bg-brazil-blue text-white' : 'text-gray-400 hover:bg-gray-700'}`}><LayoutDashboard size={14} className="inline mr-1 -mt-0.5"/> DASHBOARD</button>
        <button onClick={() => setAbaAtiva('resultados')} className={`px-4 py-3 rounded-xl text-xs font-black whitespace-nowrap transition-all ${abaAtiva === 'resultados' ? 'bg-brazil-yellow text-gray-900' : 'text-gray-400 hover:bg-gray-700'}`}><Trophy size={14} className="inline mr-1 -mt-0.5"/> RESULTADOS</button>
        <button onClick={() => setAbaAtiva('repasses')} className={`px-4 py-3 rounded-xl text-xs font-black whitespace-nowrap transition-all ${abaAtiva === 'repasses' ? 'bg-brazil-green text-gray-900' : 'text-gray-400 hover:bg-gray-700'}`}><DollarSign size={14} className="inline mr-1 -mt-0.5"/> REPASSES</button>
        <button onClick={() => setAbaAtiva('jogos')} className={`px-4 py-3 rounded-xl text-xs font-black whitespace-nowrap transition-all ${abaAtiva === 'jogos' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}><DatabaseZap size={14} className="inline mr-1 -mt-0.5"/> JOGOS / API</button>
      </div>

      <div className="p-4">
        {abaAtiva === 'jogos' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-2xl p-5 border border-brazil-green/30">
              <h4 className="font-black text-sm uppercase mb-4 flex items-center gap-2">
                <DatabaseZap size={18} className="text-brazil-green" /> Automação Smart API
              </h4>
              {debugErro && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-4">
                  <p className="text-red-400 text-[10px] font-mono break-all">{debugErro}</p>
                </div>
              )}
              <button onClick={puxarJogosDaAPI} disabled={loadingIA} className="w-full bg-brazil-green py-4 rounded-xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all text-gray-900">
                {loadingIA ? "Sincronizando..." : "🤖 Puxar Próxima Rodada"}
              </button>
            </div>
          </div>
        )}

        {abaAtiva === 'resultados' && (
          <div className="bg-gray-800 rounded-2xl p-5 border border-brazil-yellow/30 text-center">
             <Trophy size={40} className="text-brazil-yellow mx-auto mb-4" />
             <h3 className="font-black text-lg text-white mb-2">Apuração Automática</h3>
             <p className="text-xs text-gray-400 mb-6">Puxe os placares oficiais da rodada em tempo real e atualize o banco de dados.</p>
             {debugErro && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-4 text-left">
                  <p className="text-red-400 text-[10px] font-mono break-all">{debugErro}</p>
                </div>
              )}
             <button onClick={apurarResultados} disabled={loadingResultados} className="w-full bg-brazil-yellow text-gray-900 font-black px-6 py-4 rounded-xl text-xs uppercase shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                {loadingResultados ? "Buscando Placares..." : <><RefreshCw size={18} /> Puxar Resultados Oficiais</>}
             </button>
          </div>
        )}

        {abaAtiva === 'repasses' && (
          <div className="space-y-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Buscar usuário ou liga..." className="w-full bg-gray-800 border border-gray-700 p-4 pl-12 rounded-xl text-sm focus:border-brazil-green outline-none" />
            </div>

            {loadingRepasses ? (
              <p className="text-center text-gray-500 py-10">Carregando pendências...</p>
            ) : repasses.map((rep) => (
              <div key={rep.id} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden relative shadow-lg">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${rep.status === 'PENDENTE' ? 'bg-brazil-yellow' : 'bg-brazil-green'}`}></div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-lg text-white">{rep.nome}</h3>
                      <p className="text-xs text-gray-400">Vencedor Único - {rep.liga}</p>
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider ${rep.status === 'PENDENTE' ? 'bg-brazil-yellow/20 text-brazil-yellow' : 'bg-brazil-green/20 text-brazil-green'}`}>
                      {rep.status}
                    </span>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-4 flex justify-between items-center mb-4 border border-gray-800">
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Valor do Prêmio</p>
                      <p className="text-2xl font-black text-white">R$ {rep.valor.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Chave Pix</p>
                      <p className="text-sm font-mono text-gray-300">{rep.chavePix}</p>
                    </div>
                  </div>

                  {rep.status === 'PENDENTE' ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <button onClick={() => copiarPix(rep.chavePix)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 transition-colors">
                          <Copy size={16} /> Copiar Chave
                        </button>
                        
                        <label className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl font-bold text-xs uppercase cursor-pointer transition-colors border-2 border-dashed ${comprovantesBase64[rep.id] ? 'bg-brazil-blue/20 border-brazil-blue text-brazil-blue' : 'border-gray-600 text-gray-400 hover:border-gray-400'}`}>
                          <UploadCloud size={16} /> 
                          {comprovantesBase64[rep.id] ? 'Comprovante OK' : 'Anexar Print'}
                          <input type="file" accept="image/*" onChange={(e) => handleUploadComprovante(e, rep.id)} className="hidden" />
                        </label>
                      </div>

                      <button onClick={() => confirmarPagamento(rep.id)} className={`w-full py-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all ${comprovantesBase64[rep.id] ? 'bg-brazil-green text-gray-900 shadow-lg hover:brightness-110' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
                        <CheckCircle size={18} /> Marcar como Pago
                      </button>
                    </div>
                  ) : (
                    <div className="bg-brazil-green/10 border border-brazil-green/30 p-4 rounded-xl flex items-center gap-3">
                      <CheckCircle size={24} className="text-brazil-green" />
                      <div>
                        <p className="text-sm font-bold text-brazil-green">Pagamento Concluído</p>
                        <p className="text-xs text-gray-400">O usuário já recebeu o comprovante no painel.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}