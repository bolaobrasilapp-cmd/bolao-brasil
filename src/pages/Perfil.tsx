import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserCircle2, Key, ShieldCheck, LogOut, Calendar, Fingerprint, AlertCircle, Gift } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function Perfil() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Como usamos Google Login, se tiver nome na conta, puxamos ele
  const [nome, setNome] = useState(user?.nome || '');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [pixKey, setPixKey] = useState(() => {
    return localStorage.getItem('@BolaoBrasil:pixKey') || '';
  });
  const [erro, setErro] = useState('');

  useEffect(() => {
    localStorage.setItem('@BolaoBrasil:pixKey', pixKey);
  }, [pixKey]);

  const aplicarMascaraData = (valor: string) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\/\d{4})\d+?$/, '$1');
  };

  const validarIdade = (dataPTBR: string) => {
    if (dataPTBR.length < 10) return false;
    const [dia, mes, ano] = dataPTBR.split('/');
    const dataISO = `${ano}-${mes}-${dia}`;
    const hoje = new Date();
    const nascimento = new Date(dataISO);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade >= 18;
  };

  const handleSalvar = async () => {
    setErro('');
    
    if (!dataNascimento || !cpf || !nome) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!validarIdade(dataNascimento)) {
      setErro('Acesso negado. O Bolão Brasil é permitido apenas para maiores de 18 anos.');
      return;
    }

    try {
      // Correção: Como agora usamos Google, o ID oficial no banco é o UID do Firebase
      if (!user?.uid) {
        setErro('Você precisa fazer Login antes de salvar os dados.');
        return;
      }

      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        dataNascimento: dataNascimento,
        cpf: cpf,
        pixKey: pixKey,
        uid: user.uid,
        email: user.email,
        dataCadastro: new Date().toISOString()
      }, { merge: true }); // Merge true evita apagar o saldo/pontos que já existem

      alert('Dados salvos na nuvem com sucesso! O Admin já pode ver sua Chave Pix.');
    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
      setErro('Falha ao conectar com o banco de dados. Verifique sua internet.');
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Meu Perfil | Bolão Brasil</title>
      </Helmet>

      {/* Header do Perfil */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        {/* Mostra a foto do Google se houver, ou o ícone padrão */}
        {user?.foto ? (
          <img src={user.foto} alt="Perfil" className="w-20 h-20 rounded-full mb-3 border-4 border-brazil-green/20" />
        ) : (
          <div className="w-20 h-20 bg-brazil-blue/10 rounded-full flex items-center justify-center mb-3 relative">
            <UserCircle2 size={48} className="text-brazil-blue" />
            <div className="absolute bottom-0 right-0 bg-brazil-green text-white p-1 rounded-full border-2 border-white">
              <ShieldCheck size={14} />
            </div>
          </div>
        )}
        <h2 className="text-xl font-black text-gray-800">{nome || "Torcedor"}</h2>
        <p className="text-sm text-gray-500">{user?.email || "Cadastro Pendente"}</p>
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

        <div className="space-y-1.5 mb-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
            <UserCircle2 size={12} /> Nome Completo
          </label>
          <input 
            type="text" 
            placeholder="Digite seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brazil-blue focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
            <Calendar size={12} /> Data de Nascimento
          </label>
          <input 
            type="text" 
            inputMode="numeric"
            placeholder="DD/MM/AAAA"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(aplicarMascaraData(e.target.value))}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brazil-blue focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
            <Fingerprint size={12} /> CPF (Para pagamentos Efí)
          </label>
          <input 
            type="text" 
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
              setCpf(v);
            }}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brazil-blue focus:bg-white transition-all font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
            <Key size={12} /> Chave Pix para Receber
          </label>
          <input 
            type="text" 
            placeholder="E-mail, CPF ou Telefone"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brazil-blue focus:bg-white transition-all font-medium" 
          />
        </div>

        <button 
          onClick={handleSalvar}
          className="w-full bg-brazil-blue text-white font-black text-xs py-4 rounded-xl shadow-md hover:bg-blue-900 transition-colors mt-2"
        >
          SALVAR DADOS NO SISTEMA
        </button>
      </div>

      {/* --- BANNER INDIQUE E GANHE NO PERFIL --- */}
      <div 
        onClick={() => navigate('/indique')}
        className="bg-brazil-yellow/20 rounded-2xl p-4 border-2 border-dashed border-brazil-yellow flex items-center justify-between cursor-pointer hover:bg-brazil-yellow/30 transition-colors shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Gift size={28} className="text-brazil-yellow" />
          <div>
            <h3 className="font-black text-brazil-blue text-sm leading-none uppercase tracking-wide">Indique e Ganhe</h3>
            <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">Ganhe créditos por convite</p>
          </div>
        </div>
        <span className="bg-brazil-yellow text-brazil-blue text-[10px] font-black px-4 py-2.5 rounded-xl uppercase shadow-sm tracking-widest">
          Meu Código
        </span>
      </div>

      {/* Menu Secundário */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <button 
          onClick={() => alert('Configurações estarão disponíveis na próxima atualização.')}
          className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50"
        >
          <div className="text-brazil-green"><ShieldCheck size={18} /></div>
          <span className="text-sm font-bold text-gray-700">Configurações da Conta</span>
        </button>
        
        <button 
          onClick={() => window.open('https://wa.me/5544999999999', '_blank')}
          className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50"
        >
          <div className="text-brazil-blue"><AlertCircle size={18} /></div>
          <span className="text-sm font-bold text-gray-700">Central de Ajuda (WhatsApp)</span>
        </button>

        <button 
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 p-4 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} className="text-red-500" />
          <span className="text-sm font-bold text-red-600">Sair da Conta</span>
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