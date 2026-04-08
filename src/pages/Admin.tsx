import React, { useState } from 'react';
import { LayoutDashboard, Trophy, DollarSign, Users, CheckCircle, AlertCircle, Search, Lock, KeyRound } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'dashboard' | 'resultados' | 'repasses'>('dashboard');

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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${abaAtiva === 'dashboard' ? 'bg-brazil-blue text-white' : 'text-gray-400 hover:bg-gray-700'}`}
        >
          <LayoutDashboard size={16} /> Visão Geral
        </button>
        <button 
          onClick={() => setAbaAtiva('resultados')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${abaAtiva === 'resultados' ? 'bg-brazil-yellow text-brazil-blue' : 'text-gray-400 hover:bg-gray-700'}`}
        >
          <Trophy size={16} /> Lançar Resultados
        </button>
        <button 
          onClick={() => setAbaAtiva('repasses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${abaAtiva === 'repasses' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
        >
          <DollarSign size={16} /> Repasses Pendentes
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

            {/* Card de Pagamento Pendente */}
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
      </div>
    </div>
  );
}