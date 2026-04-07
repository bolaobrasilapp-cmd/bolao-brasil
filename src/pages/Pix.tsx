import React from 'react';
import { motion } from 'motion/react';
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, QrCode } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Pix() {
  const extrato = [
    { id: 1, tipo: 'entrada', titulo: 'Prêmio: Rodada #11', valor: '+ R$ 350,00', data: 'Hoje, 09:45', status: 'Concluído' },
    { id: 2, tipo: 'saida', titulo: 'Entrada: Bolão da Firma', valor: '- R$ 20,00', data: 'Ontem, 14:20', status: 'Concluído' },
    { id: 3, tipo: 'saida', titulo: 'Saque para Conta', valor: '- R$ 100,00', data: '12/04, 18:30', status: 'Processando' },
  ];

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Gestão Pix | Bolão Brasil</title>
      </Helmet>

      {/* Card de Saldo */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-brazil-green rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brazil-yellow mb-1">Saldo Disponível</p>
            <h2 className="text-3xl font-black">R$ 230,00</h2>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Wallet size={20} className="text-white" />
          </div>
        </div>
        <div className="mt-6 flex gap-3 relative z-10">
          <button className="flex-1 bg-white text-brazil-green py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50">
            <ArrowUpRight size={16} /> Depositar
          </button>
          <button className="flex-1 bg-brazil-yellow text-brazil-blue py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:brightness-105">
            <ArrowDownRight size={16} /> Sacar Prêmio
          </button>
        </div>
        <QrCode className="absolute -right-6 -bottom-6 text-white/10" size={140} />
      </motion.div>

      {/* Extrato */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Extrato Recente</h3>
        <div className="space-y-3">
          {extrato.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.tipo === 'entrada' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {item.tipo === 'entrada' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">{item.titulo}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                    {item.status === 'Processando' ? <Clock size={10} className="text-orange-500"/> : null}
                    {item.data} • {item.status}
                  </p>
                </div>
              </div>
              <p className={`font-black text-sm ${item.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                {item.valor}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}