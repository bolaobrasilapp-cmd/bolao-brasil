import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserCircle2, Key, ShieldCheck, LogOut, Calendar, Fingerprint, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Perfil() {
  const [nome, setNome] = useState('Diego');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [erro, setErro] = useState('');

  // Função para validar idade (Mínimo 18 anos)
  const validarIdade = (data: string) => {
    const hoje = new Date();
    const nascimento = new Date(data);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade >= 18;
  };

  const handleSalvar = () => {
    setErro('');
    
    if (!dataNascimento || !cpf) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!validarIdade(dataNascimento)) {
      setErro('Acesso negado. O Bolão Brasil é permitido apenas para maiores de 18 anos.');
      return;
    }

    // Aqui entraria a lógica de salvar no Firebase
    alert('Dados validados e salvos com sucesso!');
  };

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Meu Perfil | Bolão Brasil</title>
      </Helmet>

      {/* Header do Perfil */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-brazil-blue/10 rounded-full flex items-center justify-center mb-3 relative">
          <UserCircle2 size={48} className="text-brazil-blue" />
          <div className="absolute bottom-0 right-0 bg-brazil-green text-white p-1 rounded-full border-2 border-white">
            <ShieldCheck size={14} />
          </div>
        </div>
        <h2 className="text-xl font-black text-gray-800">{nome}</h2>
        <p className="text-sm text-gray-500">Cadastro de Torcedor</p>
      </div>

      {/* Formulário de Dados Obrigatórios (Compliance) */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="text-brazil-green" size={20} />
          <h3 className="font-bold text-gray-800 text-sm">Dados de Verificação</h3>
        </div>

        {erro && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold flex items-center gap-2 border border-red-100">
            <AlertCircle size={16} /> {erro}
          </motion.div>
        )}

        {/* Input Data de Nascimento */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
            <Calendar size={12} /> Data de Nascimento
          </label>
          <input 
            type="date" 
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brazil-blue focus:bg-white transition-all"
          />
        </div>

        {/* Input CPF */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
            <Fingerprint size={12} /> CPF (Necessário para pagamentos Efí)
          </label>
          <input 
            type="text" 
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brazil-blue focus:bg-white transition-all font-mono"
          />
        </div>

        {/* Chave Pix */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
            <Key size={12} /> Chave Pix para Receber Prêmios
          </label>
          <input 
            type="text" 
            placeholder="E-mail, CPF ou Telefone"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brazil-blue focus:bg-white transition-all" 
          />
        </div>

        <button 
          onClick={handleSalvar}
          className="w-full bg-brazil-blue text-white font-black text-xs py-4 rounded-xl shadow-md hover:bg-blue-900 transition-colors mt-2"
        >
          SALVAR E VERIFICAR CONTA
        </button>
      </div>

      {/* Menu Secundário */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
          <LogOut size={18} className="text-red-400" />
          <span className="text-sm font-bold text-red-500">Sair do Aplicativo</span>
        </button>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
        <p className="text-[10px] text-yellow-700 leading-relaxed text-center font-medium">
          Atenção: O Bolão Brasil segue as normas do Jogo Responsável. Seus dados são protegidos por criptografia e usados apenas para processamento de pagamentos via Efí Bank.
        </p>
      </div>
    </div>
  );
}