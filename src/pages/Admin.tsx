import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { LayoutDashboard, Trophy, DollarSign, Users, CheckCircle, AlertCircle, Search, Lock, KeyRound, Sparkles, CalendarDays } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'dashboard' | 'resultados' | 'repasses' | 'jogos'>('dashboard');
  const [textoIA, setTextoIA] = useState('');
  const [rodadaIA, setRodadaIA] = useState('1');
  const [categoriaIA, setCategoriaIA] = useState<'brasileirao' | 'copa'>('brasileirao');
  const [loadingIA, setLoadingIA] = useState(false);

  const SENHA_MASTER = 'Lara#340@123'; // Você pode mudar essa senha para qual quiser depois!

  const handleLogin = () => {
    if (senha === SENHA_MASTER) {
      setAutenticado(true);
      setErro('');
    } else {
      setErro('Acesso negado. Senha incorreta.');
      setSenha('');
    }
  };

  const processarJogosComIA = async () => {
    if (!textoIA.trim()) return alert("Cole o texto dos jogos primeiro!");
    
    setLoadingIA(true);
    try {
      const response = await fetch('/api/processar-jogos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          textoBruto: textoIA, 
          categoria: categoriaIA, 
          rodada: Number(rodadaIA) 
        }),
      });

      // Se der erro 404 (Not Found) ou 500, ele vai te avisar aqui antes de travar
      if (!response.ok) {
        throw new Error(`A API não respondeu (Erro ${response.status}). Se estiver no PC local, use o comando 'vercel dev'.`);
      }

      const data = await response.json();

      // Se a IA falhou em entender o texto, o 'data.jogos' virá vazio ou erro
      const listaDeJogos = data.jogos || data; 

      if (!Array.isArray(listaDeJogos) || listaDeJogos.length === 0) {
        throw new Error("A IA não conseguiu identificar os jogos. Tente copiar um texto mais limpo (ex: do site do GE).");
      }

      const batch = writeBatch(db);
      
      listaDeJogos.forEach((jogo: any) => {
        // Validação extra: se o time estiver vazio, pula
        if (!jogo.home || !jogo.away) return;

        const idUnico = `${jogo.home}_${jogo.away}_R${rodadaIA}`.replace(/[^a-zA-Z0-9]/g, '');
        const docRef = doc(collection(db, "jogos"), idUnico);
        batch.set(docRef, {
          home: jogo.home,
          away: jogo.away,
          data: jogo.data || "",
          hora: jogo.hora || "",
          estadio: jogo.estadio || "",
          categoria: categoriaIA,
          rodada: Number(rodadaIA),
          dataCadastro: new Date().toISOString()
        });
      });

      await batch.commit();
      alert(`Mágica feita! ${listaDeJogos.length} jogos cadastrados.`);
      setTextoIA('');
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoadingIA(false);
    }
  };

  // TELA DE LOGIN DO ADMIN (O Cadeado)
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-gray-100">
        <Helmet>
          <title>Acesso Restrito | SaaS Admin</title>
        </Helmet>

        <div className="w-full max-w-sm bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-gray-700 text-brazil-yellow">
            <Lock size={32} />
          </div>
          
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">Acesso Master</h2>
          <p className="text-sm text-gray-400 mb-8">Digite a senha de segurança para acessar o controle operacional.</p>

          {erro && (
            <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold mb-4 flex items-center justify-center gap-2">
              <AlertCircle size={16} /> {erro}
            </div>
          )}

          <div className="w-full space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="password"
                placeholder="Senha Master"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-gray-900 border border-gray-700 text-white p-4 pl-12 rounded-xl outline-none font-bold shadow-inner focus:border-brazil-yellow transition-all text-center tracking-widest"
              />
            </div>
            
            <button 
              onClick={handleLogin}
              className="w-full bg-brazil-yellow text-gray-900 font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition-all text-sm uppercase tracking-wider"
            >
              Desbloquear Painel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TELA DO PAINEL ADMIN (Se a senha estiver correta)
  return (
    <div className="min-h-screen bg-gray-900 pb-24 text-gray-100">
      <Helmet>
        <title>SaaS Master Admin | Bolão Brasil</title>
      </Helmet>

      {/* Header Admin */}
      <div className="bg-gray-800 p-6 border-b border-gray-700 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Painel <span className="text-brazil-yellow">Master</span></h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Controle Operacional SaaS</p>
          </div>
          <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20 text-[10px] font-black uppercase flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Sistema Online
          </div>
        </div>
      </div>

      {/* Navegação Interna Admin */}
      <div className="flex overflow-x-auto bg-gray-800 border-b border-gray-700 p-2 gap-2 hide-scrollbar">
        <button 
          onClick={() => setAbaAtiva('dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${abaAtiva === 'dashboard' ? 'bg-brazil-blue text-white shadow-sm' : 'text-gray-400 hover:bg-gray-700'}`}
        >
          <LayoutDashboard size={14} /> Dashboard
        </button>
        <button 
          onClick={() => setAbaAtiva('resultados')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${abaAtiva === 'resultados' ? 'bg-brazil-yellow text-brazil-blue shadow-sm' : 'text-gray-400 hover:bg-gray-700'}`}
        >
          <Trophy size={14} /> Resultados
        </button>
        <button 
          onClick={() => setAbaAtiva('repasses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${abaAtiva === 'repasses' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-700'}`}
        >
          <DollarSign size={14} /> Repasses
        </button>
        <button 
          onClick={() => setAbaAtiva('jogos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${abaAtiva === 'jogos' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-400/70 border border-purple-500/20 hover:bg-gray-700'}`}
        >
          <Sparkles size={14} /> IMPORTAR IA
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* ABA: Dashboard */}
        {abaAtiva === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Volume Transacionado</p>
                <h3 className="text-xl font-black text-white mt-1">R$ 1.250,00</h3>
                <p className="text-[10px] text-green-400 mt-2 font-medium">+15% essa semana</p>
              </div>
              <div className="bg-brazil-blue/20 p-4 rounded-2xl border border-brazil-blue/30 shadow-lg">
                <p className="text-[10px] font-bold text-brazil-blue uppercase">Lucro Líquido (10%)</p>
                <h3 className="text-xl font-black text-brazil-yellow mt-1">R$ 125,00</h3>
                <p className="text-[10px] text-gray-300 mt-2 font-medium">Livre na Efí Bank</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white text-sm">Ligas Ativas (Rodada 12)</h3>
                <Users size={16} className="text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <div>
                    <p className="text-xs font-bold text-white">Liga Cowburguer</p>
                    <p className="text-[10px] text-gray-400">45 participantes</p>
                  </div>
                  <span className="text-xs font-black text-brazil-green">R$ 900,00</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <div>
                    <p className="text-xs font-bold text-white">Confraria do Peixe</p>
                    <p className="text-[10px] text-gray-400">12 participantes</p>
                  </div>
                  <span className="text-xs font-black text-brazil-green">R$ 240,00</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: Lançar Resultados */}
        {abaAtiva === 'resultados' && (
          <div className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3 items-start">
              <AlertCircle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-200 leading-relaxed">
                Digite o placar real oficial. Ao salvar, o sistema calculará os pontos de todos os usuários e fechará as ligas desta rodada.
              </p>
            </div>

            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <p className="text-xs font-bold text-gray-400 uppercase mb-4 text-center">Rodada 12 - Brasileirão</p>
              
              {/* Jogo 1 Admin */}
              <div className="flex items-center justify-between gap-2 mb-4 bg-gray-900 p-3 rounded-xl">
                <span className="text-xs font-bold w-1/3 text-right">Flamengo</span>
                <div className="flex items-center gap-2">
                  <input type="number" className="w-10 h-10 bg-gray-800 border border-gray-600 rounded-lg text-center text-white font-black focus:border-brazil-yellow outline-none" />
                  <span className="text-gray-500 font-bold text-xs">X</span>
                  <input type="number" className="w-10 h-10 bg-gray-800 border border-gray-600 rounded-lg text-center text-white font-black focus:border-brazil-yellow outline-none" />
                </div>
                <span className="text-xs font-bold w-1/3 text-left">Palmeiras</span>
              </div>

              <button className="w-full bg-brazil-yellow text-brazil-blue font-black py-3 rounded-xl text-xs uppercase tracking-wider mt-2">
                Salvar Placares e Processar Rankings
              </button>
            </div>
          </div>
        )}

        {/* ABA: Repasses */}
        {abaAtiva === 'repasses' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input type="text" placeholder="Buscar usuário ou liga..." className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brazil-blue" />
            </div>

            <div className="bg-gray-800 rounded-2xl p-4 border-l-4 border-l-brazil-yellow shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-white text-sm">João Silva</h4>
                  <p className="text-[10px] text-gray-400">Vencedor Único - Liga Cowburguer</p>
                </div>
                <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase px-2 py-1 rounded">Pendente</span>
              </div>
              
              <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 mb-3 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Valor do Prêmio</p>
                  <p className="text-lg font-black text-white">R$ 810,00</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Chave Pix Cadastrada</p>
                  <p className="text-xs font-mono text-gray-300">11999998888</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-gray-700 text-white font-bold text-[10px] py-2.5 rounded-lg uppercase">Copiar Chave</button>
                <button className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold text-[10px] py-2.5 rounded-lg uppercase flex items-center justify-center gap-1">
                  <CheckCircle size={14} /> Marcar como Pago
                </button>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'jogos' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl flex gap-3 items-start">
              <Sparkles size={20} className="text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-purple-300 uppercase">Motor Gemini 1.5 Ativo</h4>
                <p className="text-[10px] text-purple-200/70 leading-relaxed mt-1">
                  Cole o texto bruto de qualquer site (GE, CBF, ESPN). A IA vai identificar times, horários e estádios automaticamente.
                </p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 space-y-4 shadow-xl">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Rodada</label>
                  <input 
                    type="number" 
                    value={rodadaIA}
                    onChange={(e) => setRodadaIA(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Campeonato</label>
                  <select 
                    value={categoriaIA}
                    onChange={(e) => setCategoriaIA(e.target.value as any)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm outline-none focus:border-purple-500"
                  >
                    <option value="brasileirao">Brasileirão</option>
                    <option value="copa">Copa do Mundo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Texto dos Jogos</label>
                <textarea 
                  value={textoIA}
                  onChange={(e) => setTextoIA(e.target.value)}
                  placeholder="Ex: Sáb 13/04 18:30 Criciúma x Vitória Heriberto Hülse..."
                  className="w-full h-40 bg-gray-900 border border-gray-700 rounded-xl p-4 text-xs outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <button 
                onClick={processarJogosComIA}
                disabled={loadingIA}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-wider"
              >
                {loadingIA ? "Processando com IA..." : "Cadastrar Rodada no Calendário"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}