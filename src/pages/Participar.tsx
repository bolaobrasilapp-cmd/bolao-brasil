import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Search, ShieldCheck, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

export default function Participar() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');

  const ligasDisponiveis = [
    { id: 1, nome: "Bolão Nacional Oficial", org: "Bolão Brasil", premio: "R$ 5.000,00", entrada: "R$ 20,00", users: 250, icon: Trophy, color: "text-brazil-blue", bg: "bg-brazil-blue/10" },
    { id: 2, nome: "Bolão Família Krutze", org: "Jeferson K.", premio: "R$ 350,00", entrada: "R$ 10,00", users: 35, icon: Users, color: "text-brazil-green", bg: "bg-brazil-green/10" },
    { id: 3, nome: "Bolão Cowburguer", org: "Cowburguer Oficial", premio: "R$ 800,00", entrada: "R$ 50,00", users: 16, icon: Trophy, color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: 4, nome: "Liga Confraria do Peixe", org: "Mestre Cuca", premio: "R$ 1.200,00", entrada: "R$ 100,00", users: 12, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 5, nome: "Bolão Bar do Boca", org: "Boca", premio: "R$ 450,00", entrada: "R$ 15,00", users: 30, icon: Trophy, color: "text-brazil-yellow", bg: "bg-brazil-yellow/20" },
    { id: 6, nome: "Copa Macanudo Rex", org: "Rex", premio: "R$ 600,00", entrada: "R$ 30,00", users: 20, icon: Users, color: "text-red-500", bg: "bg-red-500/10" }
  ];

  const ligasFiltradas = ligasDisponiveis.filter(liga => liga.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Participar de Bolão | Bolão Brasil</title>
      </Helmet>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-brazil-blue">Ligas Públicas</h2>
        <p className="text-sm text-gray-500">Escolha um bolão, faça o Pix e comece a cravar os placares da rodada.</p>
      </div>

      {/* Barra de Busca */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar liga pelo nome..." 
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brazil-blue focus:ring-1 focus:ring-brazil-blue transition-all"
        />
      </div>

      {/* Lista de Ligas */}
      <div className="space-y-4">
        {ligasFiltradas.map((liga) => (
          <motion.div 
            key={liga.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${liga.bg}`}>
                  <liga.icon size={20} className={liga.color} />
                </div>
                <div>
                  <h3 className="font-bold text-brazil-blue text-sm">{liga.nome}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                    <ShieldCheck size={12} className="text-brazil-green" />
                    <span>Org: {liga.org}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-gray-400">Entrada</p>
                <p className="font-black text-brazil-green">{liga.entrada}</p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Prêmio Acumulado</p>
                <p className="font-black text-brazil-blue">{liga.premio}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                <Users size={14} /> {liga.users}
              </div>
            </div>

            <button 
              onClick={() => navigate('/palpites')}
              className="w-full bg-brazil-yellow text-brazil-blue font-black text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:brightness-105 transition-all"
            >
              Entrar neste Bolão <ArrowRight size={18} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}