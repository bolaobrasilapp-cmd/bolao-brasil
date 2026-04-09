import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Shield, Trash2, Smartphone, ChevronRight } from 'lucide-react';

export default function Configuracoes() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pb-24 bg-gray-50 min-h-screen">
      <Helmet><title>Configurações | Bolão Brasil</title></Helmet>

      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6 mt-2">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full text-gray-600 shadow-sm border border-gray-100">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight leading-none">Configurações</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Sua Conta e App</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Preferências */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/30">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preferências</h3>
          </div>
          
          <div className="divide-y divide-gray-50">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-brazil-blue" />
                <span className="text-sm font-bold text-gray-700">Notificações Push</span>
              </div>
              <div className="w-10 h-5 bg-brazil-green rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Smartphone size={18} className="text-brazil-blue" />
                <span className="text-sm font-bold text-gray-700">Modo Escuro (Auto)</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/30">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Privacidade e Segurança</h3>
          </div>
          
          <div className="divide-y divide-gray-50">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-brazil-green" />
                <span className="text-sm font-bold text-gray-700">Dados Compartilhados</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-4">
          <button 
            onClick={() => confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')}
            className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 border border-red-100 hover:bg-red-100 transition-all text-xs uppercase tracking-widest"
          >
            <Trash2 size={16} /> Excluir Minha Conta
          </button>
        </div>
      </div>
    </div>
  );
}