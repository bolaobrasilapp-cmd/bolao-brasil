import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Ajustado para framer-motion padrão
import { UserCircle2, Key, ShieldCheck, LogOut, Calendar, Fingerprint, AlertCircle, Gift, Coins, ArrowLeft, Trophy, Receipt } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function Perfil() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [nome, setNome] = useState(user?.nome || '');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [pixKey, setPixKey] = useState(() => {
    return localStorage.getItem('@BolaoBrasil:pixKey') || '';
  });
  const [erro, setErro] = useState('');
  const [premios, setPremios] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem('@BolaoBrasil:pixKey', pixKey);
  }, [pixKey]);

  // EFEITO: Escuta o Firebase e auto-preenche a tela para não resetar!
  useEffect(() => {
    if (user) {
      if (user.nome && !nome) setNome(user.nome);
      if (user.cpf && !cpf) setCpf(user.cpf);
      if (user.dataNascimento && !dataNascimento) setDataNascimento(user.dataNascimento);
      if (user.pixKey && !pixKey) setPixKey(user.pixKey);
    }
  }, [user]);

  useEffect(() => {
    const fetchPremios = async () => {
      if (!user?.uid) return;
      try {
        const q = query(collection(db, 'repasses'), where('uid', '==', user.uid));
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPremios(lista);
      } catch (error) {
        console.error("Erro ao buscar prêmios:", error);
      }
    };
    fetchPremios();
  }, [user]);

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
        foto: user.foto || null,
        dataCadastro: new Date().toISOString()
      }, { merge: true }); 

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

      {/* Cuidando da Foto do Google */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        {user?.foto ? (
          <img src={user.foto} alt="Perfil" className="w-20 h-20 rounded-full mb-3 border-4 border-brazil-green/20 object-cover" />
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

      {premios.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-gray-50 pb-3">
            <Trophy className="text-brazil-yellow" size={20} />
            <h3 className="font-black text-gray-800 text-sm uppercase tracking-wide">Meus Prêmios e Saques</h3>
          </div>

          <div className="space-y-3">
            {premios.map((premio) => (
              <div key={premio.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{premio.liga}</p>
                  <p className="text-lg font-black text-brazil-green">R$ {premio.valor?.toFixed(2).replace('.', ',')}</p>
                </div>
                
                <div>
                  {premio.status === 'PAGO' && premio.comprovanteUrl ? (
                    <button 
                      onClick={() => window.open(premio.comprovanteUrl, '_blank')}
                      className="flex items-center gap-1.5 bg-brazil-green text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm hover:bg-green-600 transition-colors"
                    >
                      <Receipt size={14} /> Ver Pix
                    </button>
                  ) : (
                    <span className="bg-brazil-yellow/20 text-brazil-yellow px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border border-brazil-yellow/30">
                      Na Fila
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* MENU FINAL SUBSTITUÍDO (Tiramos Configurações, colocamos Ajuda) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col mt-4">
        <button 
          onClick={() => navigate('/ajuda')}
          className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50"
        >
          <div className="text-brazil-blue"><AlertCircle size={18} /></div>
          <span className="text-sm font-bold text-gray-700">Central de Ajuda / FAQ</span>
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

      <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl mt-4">
        <p className="text-[10px] text-yellow-700 leading-relaxed text-center font-medium">
          Atenção: O Bolão Brasil segue as normas do Jogo Responsável. Seus dados são protegidos por criptografia e usados apenas para processamento de pagamentos via Efí Bank.
        </p>
      </div>
    </div>
  );
}