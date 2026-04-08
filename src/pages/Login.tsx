import React, { useState } from 'react';
import { Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [telefone, setTelefone] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleEnviarLink = async () => {
    // Limpa o número para mandar apenas dígitos para a API
    const numeroLimpo = telefone.replace(/\D/g, '');

    if (numeroLimpo.length < 11) {
      alert('Digite o número completo com DDD (ex: 11999998888)');
      return;
    }
    
    try {
      // Chama a função que criamos na Vercel
      const response = await fetch('/api/send-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefone: numeroLimpo }),
      });

      if (response.ok) {
        setEnviado(true);
        // Agora o login real só acontece quando ele clicar no link do Zap
        // Mas para seu teste de agora, vamos manter o login automático após 5s
        setTimeout(() => {
          login(telefone);
          navigate('/');
        }, 5000);
      } else {
        alert('Erro ao enviar WhatsApp. Verifique suas chaves da Meta.');
      }
    } catch (error) {
      alert('Falha na conexão com o servidor de disparo.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brazil-green text-white p-6 relative overflow-hidden">
      <Helmet>
        <title>Entrar | Bolão Brasil</title>
      </Helmet>

      {/* Elementos de fundo para dar charme */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-brazil-yellow/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl rotate-3">
          <span className="text-4xl">⚽</span>
        </div>
        
        <h2 className="text-3xl font-black text-center mb-2 tracking-tight">Bolão Brasil</h2>
        <p className="text-white/80 text-center text-sm mb-10 font-medium">Sem senhas complicadas. Receba seu acesso direto no WhatsApp.</p>

        {!enviado ? (
          <div className="w-full space-y-4">
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="tel"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                  setTelefone(val);
                }}
                maxLength={15}
                className="w-full bg-white text-gray-800 p-4 pl-12 rounded-2xl outline-none font-bold shadow-lg focus:ring-4 focus:ring-brazil-yellow/50 transition-all text-lg"
              />
            </div>
            
            <button 
              onClick={handleEnviarLink}
              className="w-full bg-brazil-yellow text-brazil-blue font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition-all text-sm uppercase tracking-wider mt-2"
            >
              Enviar Link via Zap <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="w-full text-center space-y-5 bg-white/10 p-8 rounded-3xl border border-white/20 backdrop-blur-md animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-brazil-yellow rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 size={32} className="text-brazil-blue" />
            </div>
            <div>
              <h3 className="font-black text-xl mb-1">Link Enviado!</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                Enviamos uma mensagem para <strong>{telefone}</strong>. Abra seu WhatsApp e clique no link para entrar.
              </p>
            </div>
            <button 
              onClick={() => setEnviado(false)} 
              className="text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors pt-2"
            >
              Tentar outro número
            </button>
          </div>
        )}
      </div>
    </div>
  );
}