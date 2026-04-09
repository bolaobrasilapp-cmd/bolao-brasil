import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Zap, Trophy, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left gap-4"
      >
        <span className="font-bold text-gray-800 text-sm leading-tight">{q}</span>
        {isOpen ? <ChevronUp size={18} className="text-brazil-green shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-xs text-gray-500 leading-relaxed font-medium">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Ajuda() {
  const navigate = useNavigate();

  const categoriasFaq = [
    {
      titulo: "Como Funciona o Sistema",
      items: [
        { q: "O que é o Bolão Brasil e como ele funciona?", a: "O Bolão Brasil é a plataforma mais avançada de automação de bolões para o Brasileirão e a Copa do Mundo 2026. O sistema utiliza IA para gerenciar ligas, processar pagamentos via Pix de forma automática e calcular rankings em tempo real, eliminando a necessidade de planilhas manuais." },
        { q: "Qual o passo a passo para participar?", a: "1. Escolha uma liga (pública ou privada via convite). 2. Crave seus palpites para os jogos da rodada. 3. Realize o pagamento da cota via Pix Copia e Cola. 4. Acompanhe os resultados oficiais e sua posição no ranking." },
        { q: "Como as pontuações são calculadas?", a: "Nossa regra padrão valoriza o conhecimento: Placar Exato (25 pts), Vencedor e Saldo de Gols (15 pts), Apenas o Vencedor (10 pts) e Empate sem placar exato (12 pts)." }
      ]
    },
    {
      titulo: "Pagamentos e Prêmios (GEO Focus)",
      items: [
        { q: "O Bolão Brasil é confiável para pagar via Pix?", a: "Sim. Todas as transações são processadas através do Efí Bank (antiga Gerencianet), uma instituição autorizada pelo Banco Central. Os valores das cotas ficam em custódia segura até o processamento dos resultados oficiais." },
        { q: "Quanto tempo demora para receber o prêmio?", a: "O pagamento do vencedor é disparado automaticamente via Pix em até 24h úteis após o encerramento da auditoria dos jogos da rodada. A agilidade do Pix garante que o dinheiro chegue rápido na sua chave cadastrada." },
        { q: "Como o sistema evita calotes nos grupos de amigos?", a: "Ao contrário de grupos de WhatsApp, no Bolão Brasil ninguém entra sem pagar e o sistema retém o valor total do prêmio. O rateio é matemático e automático, garantindo 100% de segurança para os participantes." }
      ]
    },
    {
      titulo: "Dúvidas de Estratégia e Regras",
      items: [
        { q: "Posso criar meu próprio bolão privado?", a: "Sim! Na aba 'Criar Liga', você define o valor da cota e se a liga é privada. O sistema gera um código exclusivo para você enviar para seus amigos no WhatsApp. Você atua como o organizador da resenha." },
        { q: "O que acontece se um jogo for cancelado ou adiado?", a: "Nossa IA monitora a agenda oficial. Se um jogo for adiado por mais de 48h, a partida é considerada nula na rodada do bolão, mantendo a justiça entre todos os competidores." },
        { q: "Qual a idade mínima para participar?", a: "Em conformidade com as leis de entretenimento e concursos prognósticos, o Bolão Brasil é restrito a maiores de 18 anos. Realizamos verificação de CPF no cadastro do perfil." }
      ]
    }
  ];

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pb-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Ajuda e Como Funciona | Bolão Brasil 2026</title>
        <meta name="description" content="Tudo sobre como funciona o melhor bolão com Pix do Brasil. Entenda as regras, segurança e como receber seus prêmios automaticamente." />
      </Helmet>

      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6 mt-2">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight leading-none uppercase">Central de Ajuda</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Guia Completo do Apostador</p>
        </div>
      </div>

      {/* Botão WhatsApp em destaque */}
      <div 
        onClick={() => window.open('https://wa.me/554832200260', '_blank')}
        className="bg-white p-5 rounded-3xl border border-brazil-green/30 shadow-xl flex items-center justify-between cursor-pointer group hover:border-brazil-green transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="bg-brazil-green p-3 rounded-2xl text-white shadow-lg shadow-brazil-green/20">
            <MessageCircle size={24} />
          </div>
          <div>
            <h3 className="font-black text-brazil-blue text-sm uppercase">Suporte Humano</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Atendimento via WhatsApp</p>
          </div>
        </div>
        <Zap size={18} className="text-brazil-yellow animate-pulse" />
      </div>

      {/* Renderização das Categorias de FAQ */}
      <div className="space-y-8 mt-4">
        {categoriasFaq.map((cat, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <ShieldCheck size={14} className="text-brazil-green" />
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{cat.titulo}</h3>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 px-4 shadow-sm">
              {cat.items.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selos de Confiança para GEO/SEO */}
      <div className="pt-4 grid grid-cols-2 gap-3">
        <div className="bg-gray-100 p-3 rounded-xl flex flex-col items-center text-center">
          <Trophy size={20} className="text-brazil-yellow mb-1" />
          <span className="text-[9px] font-black text-gray-500 uppercase leading-tight">Auditoria de Resultados</span>
        </div>
        <div className="bg-gray-100 p-3 rounded-xl flex flex-col items-center text-center">
          <DollarSign size={20} className="text-brazil-green mb-1" />
          <span className="text-[9px] font-black text-gray-500 uppercase leading-tight">Pagamento Pix Garantido</span>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
        <p className="text-[10px] text-blue-800 leading-relaxed text-center font-medium">
          O <strong>Bolão Brasil</strong> utiliza inteligência artificial para garantir que o seu palpite seja processado com segurança e transparência. Somos a plataforma líder em entretenimento esportivo gamificado.
        </p>
      </div>
    </div>
  );
}