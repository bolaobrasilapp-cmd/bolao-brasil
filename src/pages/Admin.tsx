import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, doc, writeBatch, getDocs, updateDoc, query, orderBy } from 'firebase/firestore';
import { 
  LayoutDashboard, Trophy, DollarSign, Users, CheckCircle, 
  AlertCircle, Search, Lock, KeyRound, Sparkles, DatabaseZap, 
  Copy, UploadCloud, RefreshCw, QrCode, ArrowRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface Repasse {
  id: string;
  nome: string;
  liga: string;
  valor: number;
  chavePix: string;
  status: 'PENDENTE' | 'PAGO';
  comprovanteUrl?: string;
  uid?: string;
  dataSolicitacao?: any;
}

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'dashboard' | 'resultados' | 'repasses' | 'jogos'>('dashboard');
  
  // Estados para Robôs e Automações
  const [loadingIA, setLoadingIA] = useState(false);
  const [loadingWebhook, setLoadingWebhook] = useState(false);
  const [loadingResultados, setLoadingResultados] = useState(false);
  const [debugErro, setDebugErro] = useState('');
  
  // Estados para IA Manual
  const [textoIA, setTextoIA] = useState('');
  const [rodadaIA, setRodadaIA] = useState('11');
  const [categoriaIA, setCategoriaIA] = useState<'brasileirao' | 'copa'>('brasileirao');

  // Estados para Repasses e Dashboard
  const [repasses, setRepasses] = useState<Repasse[]>([]);
  const [loadingRepasses, setLoadingRepasses] = useState(false);
  const [comprovantesBase64, setComprovantesBase64] = useState<Record<string, string>>({});
  const [stats, setStats] = useState({ usuarios: 0, totalPote: 0 });

  const SENHA_MASTER = 'Lara#340@123';

  const handleLogin = () => {
    if (senha === SENHA_MASTER) {
      setAutenticado(true);
      setErro('');
      carregarDadosIniciais();
    } else {
      setErro('Senha incorreta.');
      setSenha('');
    }
  };

  const carregarDadosIniciais = async () => {
    carregarRepasses();
    // Simulação de busca de stats - Futuramente conectar ao Firebase
    setStats({ usuarios: 142, totalPote: 12450.00 });
  };

  const carregarRepasses = async () => {
    setLoadingRepasses(true);
    try {
      const q = query(collection(db, 'repasses'), orderBy('status', 'asc'));
      const snapshot = await getDocs(q);
      const lista: Repasse[] = [];
      snapshot.forEach(doc => {
        lista.push({ id: doc.id, ...doc.data() } as Repasse);
      });
      setRepasses(lista);
    } catch (error) {
      console.error("Erro ao buscar repasses:", error);
    } finally {
      setLoadingRepasses(false);
    }
  };

  const ativarWebhookEfi = async () => {
    if(!confirm("Deseja ativar a escuta de Pix agora? Isso ligará o Bolão ao Banco Efí.")) return;
    setLoadingWebhook(true);
    try {
      const res = await fetch('/api/configurar-webhook', { method: 'POST' });
      const data = await res.json();
      if (data.sucesso) {
        alert("🚀 SUCESSO! O Webhook foi registrado. O saldo dos usuários agora cairá automático.");
      } else {
        alert("❌ Falha na Efí: " + JSON.stringify(data.erro));
      }
    } catch (e) {
      alert("Erro de rede. Verifique se o arquivo api/configurar-webhook.ts foi enviado para a Vercel.");
    } finally {
      setLoadingWebhook(false);
    }
  };

  const puxarJogosDaAPI = async () => {
    setLoadingIA(true);
    setDebugErro('');
    try {
      const response = await fetch('/api/robo-jogos');
      const data = await response.json();
      if (!response.ok) throw new Error(data.detalhe || "Erro na API");

      const batch = writeBatch(db);
      data.forEach((jogo: any) => {
        const idUnico = `${jogo.home}_${jogo.away}_R${jogo.rodada}`.replace(/[^a-zA-Z0-9]/g, '');
        const docRef = doc(collection(db, "jogos"), idUnico);
        batch.set(docRef, { ...jogo, dataCadastro: new Date().toISOString() }, { merge: true });
      });
      await batch.commit();
      alert(`✅ SUCESSO! ${data.length} jogos da rodada ${data[0]?.rodada} foram sincronizados.`);
    } catch (error: any) {
      setDebugErro(error.message);
    } finally {
      setLoadingIA(false);
    }
  };

  const processarJogosComIA = async () => {
    if (!textoIA.trim()) return alert("Cole o texto bruto dos jogos!");
    setLoadingIA(true);
    try {
      const response = await fetch('/api/processar-jogos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textoBruto: textoIA, categoria: categoriaIA, rodada: Number(rodadaIA) }),
      });
      const data = await response.json();
      const batch = writeBatch(db);
      data.forEach((jogo: any) => {
        const idUnico = `${jogo.home}_${jogo.away}_R${rodadaIA}`.replace(/[^a-zA-Z0-9]/g, '');
        const docRef = doc(collection(db, "jogos"), idUnico);
        batch.set(docRef, { ...jogo, rodada: Number(rodadaIA), dataCadastro: new Date().toISOString() });
      });
      await batch.commit();
      alert("✅ IA Gemini processou e cadastrou os jogos com sucesso!");
      setTextoIA('');
    } catch (e) { 
      alert("Erro no processamento manual."); 
    } finally { 
      setLoadingIA(false); 
    }
  };

  const apurarResultados = async () => {
    setLoadingResultados(true);
    try {
      const response = await fetch('/api/robo-resultados');
      const data = await response.json();
      if (!response.ok) throw new Error("API de resultados fora do ar");
      if (data.length === 0) return alert('Nenhum resultado encerrado encontrado para esta rodada.');

      const batch = writeBatch(db);
      data.forEach((resultado: any) => {
        const idUnico = `${resultado.home}_${resultado.away}_R${resultado.rodada}`.replace(/[^a-zA-Z0-9]/g, '');
        const docRef = doc(collection(db, "jogos"), idUnico);
        batch.update(docRef, { 
          scoreHomeReal: resultado.scoreHome, 
          scoreAwayReal: resultado.scoreAway,
          encerrado: resultado.encerrado 
        });
      });
      await batch.commit();
      alert(`✅ Placares oficiais de ${data.length} jogos foram atualizados no banco.`);
    } catch (e: any) { 
      alert("Erro: " + e.message); 
    } finally { 
      setLoadingResultados(false); 
    }
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
    if (!comprovante) return alert("Anexe o print do Pix primeiro!");
    
    try {
      await updateDoc(doc(db, 'repasses', repasseId), { 
        status: 'PAGO', 
        comprovanteUrl: comprovante,
        dataPagamento: new Date().toISOString()
      });
      setRepasses(prev => prev.map(r => r.id === repasseId ? { ...r, status: 'PAGO', comprovanteUrl: comprovante } : r));
      alert("✅ Pagamento confirmado! O usuário já pode ver o comprovante no Perfil dele.");
    } catch (e) { 
      alert("Erro ao salvar pagamento."); 
    }
  };

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-gray-800 p-8 rounded-[2rem] border border-gray-700 text-center shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-brazil-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} className="text-brazil-yellow" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Painel Master</h2>
          <p className="text-gray-400 text-xs mb-8 uppercase tracking-widest font-bold">Acesso Restrito EyAgencia</p>
          {erro && <p className="text-red-400 text-xs mb-4 font-bold bg-red-400/10 py-2 rounded-lg border border-red-400/20">{erro}</p>}
          <input 
            type="password" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()} 
            className="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl text-center text-white mb-4 outline-none focus:border-brazil-yellow transition-all" 
            placeholder="Senha Master" 
          />
          <button onClick={handleLogin} className="w-full bg-brazil-yellow text-gray-900 font-black py-4 rounded-xl uppercase hover:brightness-110 active:scale-[0.98] transition-all">Acessar Sistema</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pb-20 font-sans">
      <Helmet><title>Admin Master | Bolão Brasil</title></Helmet>
      
      {/* Header Fixo */}
      <div className="bg-gray-800 p-6 border-b border-gray-700 sticky top-0 z-50 flex justify-between items-center shadow-xl">
        <div>
          <h1 className="text-2xl font-black tracking-tighter">Admin <span className="text-brazil-yellow">Bolão</span></h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-0.5">Velo Data Fuel Engine</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-brazil-green rounded-full animate-pulse" />
          <span className="text-[10px] text-brazil-green font-black uppercase tracking-widest">Servidor Ativo</span>
        </div>
      </div>

      {/* Menu de Abas */}
      <div className="flex bg-gray-800 p-2 gap-2 border-b border-gray-700 overflow-x-auto no-scrollbar shadow-inner">
        <button onClick={() => setAbaAtiva('dashboard')} className={`px-5 py-3 rounded-xl text-[10px] font-black whitespace-nowrap transition-all flex items-center gap-2 ${abaAtiva === 'dashboard' ? 'bg-brazil-blue text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700'}`}><LayoutDashboard size={14}/> DASHBOARD</button>
        <button onClick={() => setAbaAtiva('jogos')} className={`px-5 py-3 rounded-xl text-[10px] font-black whitespace-nowrap transition-all flex items-center gap-2 ${abaAtiva === 'jogos' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700'}`}><DatabaseZap size={14}/> JOGOS / API</button>
        <button onClick={() => setAbaAtiva('resultados')} className={`px-5 py-3 rounded-xl text-[10px] font-black whitespace-nowrap transition-all flex items-center gap-2 ${abaAtiva === 'resultados' ? 'bg-brazil-yellow text-gray-900 shadow-lg' : 'text-gray-400 hover:bg-gray-700'}`}><Trophy size={14}/> RESULTADOS</button>
        <button onClick={() => setAbaAtiva('repasses')} className={`px-5 py-3 rounded-xl text-[10px] font-black whitespace-nowrap transition-all flex items-center gap-2 ${abaAtiva === 'repasses' ? 'bg-brazil-green text-gray-900 shadow-lg' : 'text-gray-400 hover:bg-gray-700'}`}><DollarSign size={14}/> REPASSES</button>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        
        {/* ABA: DASHBOARD */}
        {abaAtiva === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-[2rem] border border-brazil-blue/30 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-brazil-blue/10 group-hover:scale-110 transition-transform duration-700">
                  <QrCode size={120} />
                </div>
                <div className="relative z-10">
                  <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                    <QrCode size={18} className="text-brazil-blue" /> Conexão Bancária Efí
                  </h4>
                  <p className="text-xs text-gray-400 mb-6 leading-relaxed">Sincronize sua chave Pix com o servidor para habilitar o processamento de saldo automático via Webhook.</p>
                  <button onClick={ativarWebhookEfi} disabled={loadingWebhook} className="w-full bg-brazil-blue hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95">
                    {loadingWebhook ? <><RefreshCw size={18} className="animate-spin" /> Sincronizando...</> : <><RefreshCw size={18} /> Ligar Webhook Efí</>}
                  </button>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-6 rounded-[2rem] border border-gray-700 text-center hover:border-brazil-blue/50 transition-colors">
                  <div className="w-10 h-10 bg-brazil-blue/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-brazil-blue"><Users size={20} /></div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Usuários Ativos</p>
                  <p className="text-2xl font-black text-white mt-1">{stats.usuarios}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-[2rem] border border-gray-700 text-center hover:border-brazil-green/50 transition-colors">
                  <div className="w-10 h-10 bg-brazil-green/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-brazil-green"><DollarSign size={20} /></div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Caixa Geral</p>
                  <p className="text-2xl font-black text-white mt-1">R$ {stats.totalPote.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</p>
                </div>
             </div>
          </div>
        )}

        {/* ABA: JOGOS */}
        {abaAtiva === 'jogos' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-800 rounded-[2rem] p-6 border border-brazil-green/30 shadow-xl">
              <h4 className="font-black text-sm uppercase mb-4 flex items-center gap-2 text-white">
                <DatabaseZap size={18} className="text-brazil-green" /> Automação Smart API
              </h4>
              {debugErro && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-4 text-left">
                  <p className="text-red-400 text-[10px] font-mono break-all">{debugErro}</p>
                </div>
              )}
              <button onClick={puxarJogosDaAPI} disabled={loadingIA} className="w-full bg-brazil-green hover:bg-green-600 py-5 rounded-2xl font-black uppercase text-xs text-gray-900 flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
                {loadingIA ? <><RefreshCw size={18} className="animate-spin" /> Sincronizando...</> : <><RefreshCw size={18} /> Puxar Próxima Rodada</>}
              </button>
            </div>

            <div className="bg-gray-800 rounded-[2rem] p-6 border border-gray-700 shadow-xl">
              <h4 className="text-xs font-bold uppercase mb-4 text-purple-400 flex items-center gap-2">
                <Sparkles size={16} /> Motor Gemini IA (Manual)
              </h4>
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase ml-2">Rodada</label>
                  <input type="number" value={rodadaIA} onChange={(e) => setRodadaIA(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-xs text-white outline-none focus:border-purple-500" />
                </div>
                <div className="flex-[2]">
                  <label className="text-[9px] font-bold text-gray-500 uppercase ml-2">Categoria</label>
                  <select value={categoriaIA} onChange={(e: any) => setCategoriaIA(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-xs text-white outline-none focus:border-purple-500">
                    <option value="brasileirao">Brasileirão Série A</option>
                    <option value="copa">Copa do Brasil</option>
                  </select>
                </div>
              </div>
              <textarea value={textoIA} onChange={(e) => setTextoIA(e.target.value)} placeholder="Cole o texto bruto (ex: do GE ou Cartola)..." className="w-full h-36 bg-gray-900 border border-gray-700 rounded-xl p-4 text-xs mb-4 text-white outline-none focus:border-purple-500 resize-none" />
              <button onClick={processarJogosComIA} disabled={loadingIA} className="w-full bg-purple-600 py-4 rounded-xl font-black text-xs uppercase text-white hover:bg-purple-500 transition-all shadow-lg active:scale-95">
                Forçar Importação via IA
              </button>
            </div>
          </div>
        )}

        {/* ABA: RESULTADOS */}
        {abaAtiva === 'resultados' && (
          <div className="bg-gray-800 rounded-[2.5rem] p-10 border border-brazil-yellow/30 text-center shadow-2xl animate-in fade-in zoom-in duration-500">
             <div className="w-24 h-24 bg-brazil-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-brazil-yellow/20">
              <Trophy size={48} className="text-brazil-yellow" />
             </div>
             <h3 className="font-black text-2xl text-white mb-2">Apuração de Placares</h3>
             <p className="text-xs text-gray-400 mb-10 max-w-xs mx-auto leading-relaxed">Busque os placares reais da rodada em tempo real e feche as apostas encerradas.</p>
             <button onClick={apurarResultados} disabled={loadingResultados} className="w-full bg-brazil-yellow text-gray-900 font-black py-5 rounded-[1.5rem] text-xs uppercase shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                {loadingResultados ? <><RefreshCw size={20} className="animate-spin" /> Buscando Dados...</> : <><RefreshCw size={20} /> Sincronizar Placares Oficiais</>}
             </button>
          </div>
        )}

        {/* ABA: REPASSES */}
        {abaAtiva === 'repasses' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative mb-6">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Pesquisar por nome ou liga..." className="w-full bg-gray-800 border border-gray-700 py-5 pl-14 pr-6 rounded-2xl text-sm text-white outline-none focus:border-brazil-green transition-all" />
            </div>

            {loadingRepasses ? (
              <div className="flex flex-col items-center py-20 text-gray-500 gap-4">
                <RefreshCw size={32} className="animate-spin" />
                <p className="font-bold text-xs uppercase tracking-widest">Lendo Banco de Dados...</p>
              </div>
            ) : repasses.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-[2rem] text-gray-600">
                <CheckCircle size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold text-sm">Nenhum prêmio pendente!</p>
              </div>
            ) : repasses.map((rep) => (
              <div key={rep.id} className="bg-gray-800 rounded-[2rem] border border-gray-700 overflow-hidden relative shadow-xl hover:border-gray-600 transition-all">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${rep.status === 'PENDENTE' ? 'bg-brazil-yellow' : 'bg-brazil-green'}`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-black text-xl text-white tracking-tight leading-none">{rep.nome}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-1">
                        <Trophy size={10} className="text-brazil-yellow" /> {rep.liga}
                      </p>
                    </div>
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider ${rep.status === 'PENDENTE' ? 'bg-brazil-yellow/20 text-brazil-yellow border border-brazil-yellow/30' : 'bg-brazil-green/20 text-brazil-green border border-brazil-green/30'}`}>
                      {rep.status}
                    </span>
                  </div>

                  <div className="bg-gray-900/50 rounded-2xl p-5 flex justify-between items-center mb-6 border border-gray-700/50">
                    <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Prêmio do Usuário</p>
                      <p className="text-2xl font-black text-white">R$ {rep.valor.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Chave Pix</p>
                      <p className="text-xs font-mono text-gray-300 bg-gray-900 px-3 py-1 rounded-lg border border-gray-800">{rep.chavePix}</p>
                    </div>
                  </div>

                  {rep.status === 'PENDENTE' ? (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <button onClick={() => { navigator.clipboard.writeText(rep.chavePix); alert("Chave copiada!"); }} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold text-[10px] uppercase flex items-center justify-center gap-2 transition-all"><Copy size={16}/> Copiar Pix</button>
                        <label className={`flex-[1.5] flex justify-center items-center gap-2 py-4 rounded-xl font-bold text-[10px] uppercase cursor-pointer border-2 border-dashed transition-all ${comprovantesBase64[rep.id] ? 'bg-brazil-blue/20 border-brazil-blue text-brazil-blue' : 'border-gray-600 text-gray-500 hover:border-gray-500'}`}>
                          <UploadCloud size={16}/> {comprovantesBase64[rep.id] ? "Anexado OK" : "Anexar Comprovante"}
                          <input type="file" accept="image/*" onChange={(e) => handleUploadComprovante(e, rep.id)} className="hidden" />
                        </label>
                      </div>
                      <button onClick={() => confirmarPagamento(rep.id)} className="w-full bg-brazil-green hover:bg-green-600 text-gray-900 py-5 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
                        <CheckCircle size={18}/> Marcar como Pago e Notificar
                      </button>
                    </div>
                  ) : (
                    <div className="bg-brazil-green/10 border border-brazil-green/30 p-5 rounded-2xl flex items-center gap-4">
                      <div className="w-12 h-12 bg-brazil-green/20 rounded-full flex items-center justify-center text-brazil-green"><CheckCircle size={24} /></div>
                      <div>
                        <p className="text-sm font-black text-brazil-green uppercase">Pagamento Concluído</p>
                        <button onClick={() => rep.comprovanteUrl && window.open(rep.comprovanteUrl)} className="text-[10px] font-bold text-gray-400 hover:text-white uppercase mt-1 flex items-center gap-1 transition-colors">Ver Comprovante Enviado <ArrowRight size={10}/></button>
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