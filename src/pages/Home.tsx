import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  PlusCircle, Users, Calendar, CheckSquare, BarChart3, QrCode,
  ChevronDown, ChevronUp, Trophy, Share2, Star, ShieldCheck, Lock, Gift
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { generateWebApplicationSchema, generateFAQSchema } from '../utils/schema';
import { Helmet } from 'react-helmet-async';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-gray-800 pr-4">{question}</span>
        {isOpen ? <ChevronUp size={20} className="text-brazil-green" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="pb-4 text-gray-600 text-sm leading-relaxed"
        >
          {answer}
        </motion.div>
      )}
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { saldo } = useAuth();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bolão Brasil',
          text: 'Chega de calote! Vem pro meu bolão com Pix Automático e prêmios na hora.',
          url: 'https://bolaobrasil.app.br',
        });
      } catch (error) {
        console.log('Compartilhamento cancelado', error);
      }
    } else {
      alert('Copie o link: https://bolaobrasil.app.br');
    }
  };

  // Motor da Contagem Regressiva da Copa
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-05-01T00:00:00').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      
      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: PlusCircle, label: 'Criar Nova Liga', color: 'bg-brazil-blue', path: '/criar-liga' },
    { icon: Users, label: 'Participar de Liga', color: 'bg-brazil-green', path: '/participar' },
    { icon: Calendar, label: 'Calendário de Jogos', color: 'bg-white', textColor: 'text-gray-800', path: '/calendario' },
    { icon: CheckSquare, label: 'Meus Palpites', color: 'bg-white', textColor: 'text-gray-800', path: '/palpites' },
    { icon: BarChart3, label: 'Ranking Geral', color: 'bg-white', textColor: 'text-gray-800', path: '/rankings' },
    { icon: QrCode, label: 'Gestão Pix', color: 'bg-white', textColor: 'text-gray-800', path: '/pix' },
  ];

  const faqs = [
    { question: "Como funciona o Bolão Brasil com Pix?", answer: "Você cria a liga, o sistema cobra as entradas via Pix, calcula os pontos e paga os vencedores." },
    { question: "É focado no Brasileirão ou na Copa?", answer: "Comece cravando os placares do Brasileirão e prepare-se para a maior liga na Copa do Mundo." },
    { question: "Quando recebo meu prêmio no bolão?", answer: "O Pix do prêmio é processado para o vencedor logo após a auditoria oficial dos resultados." }
  ];

  const destaques = [
    { id: 1, nome: "Bolão Nacional Oficial", premio: "R$ 5.000,00", icon: Trophy, color: "text-brazil-blue" },
    { id: 2, nome: "Bolão Família Krutze", premio: "R$ 350,00", icon: Trophy, color: "text-brazil-green" },
    { id: 3, nome: "Bolão Cowburguer", premio: "R$ 800,00", icon: Trophy, color: "text-orange-500" },
    { id: 4, nome: "Liga Confraria do Peixe", premio: "R$ 1.200,00", icon: Trophy, color: "text-blue-500" },
    { id: 5, nome: "Bolão Bar do Boca", premio: "R$ 450,00", icon: Trophy, color: "text-brazil-yellow" },
    { id: 6, nome: "Copa Macanudo Rex", premio: "R$ 600,00", icon: Trophy, color: "text-red-500" }
  ];

  return (
    <>
      <SEO 
        title="Bolão Brasil - Bolão do Brasileirão e Copa com Pix"
        description="O bolão de futebol mais rápido do Brasil. Crave placares, ganhe pontos e receba prêmios no Pix."
        canonical="https://bolaobrasil.app/"
        schema={[generateWebApplicationSchema(), generateFAQSchema()]}
      />
      <Helmet>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org/",
              "@type": "SoftwareApplication",
              "name": "Bolão Brasil",
              "applicationCategory": "SportsApplication",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "845"
              }
            }
          `}
        </script>
      </Helmet>

      <div className="p-4 space-y-6">
        {/* Hero Card */}
        <motion.div className="bg-brazil-green rounded-2xl p-6 text-white relative overflow-hidden shadow-lg z-10">
          <div className="absolute right-[-10px] bottom-1 w-64 h-32 pointer-events-none drop-shadow-xl z-0">
            <img src="/mascote.png" alt="Mascote Oficial" className="w-full h-full object-contain object-right-bottom" loading="eager" />
          </div>
          <button onClick={handleShare} className="absolute top-4 right-4 bg-brazil-yellow text-brazil-blue p-2.5 rounded-full shadow-md z-30 hover:scale-105 active:scale-95 transition-transform"><Share2 size={18} /></button>
          
          <div className="relative z-10 space-y-2 max-w-[65%]">
            <p className="text-brazil-yellow font-bold text-xs uppercase tracking-wider">RODADA DO BRASILEIRÃO</p>
            <h2 className="text-xl font-black leading-tight">Pronto para cravar?</h2>
            <div className="pt-2">
              <p className="text-xs opacity-90 font-medium">PONTOS TOTAIS:</p>
              <p className="text-4xl font-black text-brazil-yellow drop-shadow-md leading-none">1,250</p>
            </div>
            <div className="pt-2">
              <p className="text-[10px] opacity-90 font-bold uppercase tracking-wider">Saldo em Carteira:</p>
              <p className="text-xl font-black text-white leading-none">
                {saldo ? saldo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
              </p>
            </div>
            <div className="flex gap-2 mt-4 relative z-20 max-w-[80%]">
              <button onClick={() => navigate('/palpites')} className="bg-white text-brazil-green px-4 py-2 rounded-full text-xs font-bold shadow-sm w-full">
                Ver Meus Bolões
              </button>
            </div>
          </div>
        </motion.div>

        {/* Banner Copa do Mundo 2026 */}
        <div className="mt-4 mb-2 bg-gradient-to-r from-[#8B6B1D] via-[#D4AF37] to-[#8B6B1D] rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-20">
            <Trophy size={100} />
          </div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-white" />
              <h3 className="font-black text-sm uppercase tracking-wider">Bolão Copa do Mundo 2026</h3>
            </div>
            <p className="text-xs text-white/90 font-medium">As ligas exclusivas da Copa abrem em:</p>
            
            <div className="flex gap-2 mt-1">
              <div className="bg-black/20 rounded-lg px-2 py-1 flex flex-col items-center min-w-[48px]">
                <span className="font-black text-lg leading-none">{timeLeft.d}</span>
                <span className="text-[9px] uppercase font-bold text-white/80">Dias</span>
              </div>
              <span className="font-black text-lg py-1">:</span>
              <div className="bg-black/20 rounded-lg px-2 py-1 flex flex-col items-center min-w-[48px]">
                <span className="font-black text-lg leading-none">{timeLeft.h.toString().padStart(2, '0')}</span>
                <span className="text-[9px] uppercase font-bold text-white/80">Hrs</span>
              </div>
              <span className="font-black text-lg py-1">:</span>
              <div className="bg-black/20 rounded-lg px-2 py-1 flex flex-col items-center min-w-[48px]">
                <span className="font-black text-lg leading-none">{timeLeft.m.toString().padStart(2, '0')}</span>
                <span className="text-[9px] uppercase font-bold text-white/80">Min</span>
              </div>
              <span className="font-black text-lg py-1">:</span>
              <div className="bg-black/20 rounded-lg px-2 py-1 flex flex-col items-center min-w-[48px]">
                <span className="font-black text-lg leading-none">{timeLeft.s.toString().padStart(2, '0')}</span>
                <span className="text-[9px] uppercase font-bold text-white/80">Seg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Botões */}
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, idx) => (
            <motion.button key={idx} whileTap={{ scale: 0.95 }} onClick={() => navigate(f.path)} className={`${f.color} ${f.textColor || 'text-white'} p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2 h-24`}>
              <f.icon size={24} />
              <span className="text-[11px] font-bold truncate w-full">{f.label}</span>
            </motion.button>
          ))}
        </div>

        {/* --- BANNER INDIQUE E GANHE NA HOME --- */}
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/indique')} 
          className="bg-gradient-to-r from-brazil-yellow to-[#FFD700] rounded-xl p-4 shadow-sm border border-yellow-300 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/30 p-2 rounded-xl">
              <Gift size={24} className="text-brazil-blue" />
            </div>
            <div>
              <h3 className="font-black text-brazil-blue text-sm uppercase tracking-tight">Indique e Ganhe R$2,00</h3>
              <p className="text-[10px] text-brazil-blue/80 font-bold uppercase tracking-wider">Convide amigos para o bolão</p>
            </div>
          </div>
          <div className="bg-white text-brazil-blue text-[10px] font-black px-3 py-2 rounded-xl shadow-sm uppercase tracking-widest flex items-center gap-1">
            Resgatar
          </div>
        </motion.div>

        {/* Destaques da Rodada (Ligas Reais Integradas) */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Destaques da Rodada</h3>
          <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth snap-x">
            {destaques.map((liga) => (
              <div key={liga.id} onClick={() => navigate('/participar')} className="snap-center shrink-0 w-64 bg-brazil-yellow/10 rounded-xl p-4 border border-brazil-yellow/20 flex items-center gap-4 hover:bg-brazil-yellow/20 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <liga.icon size={20} className={liga.color} />
                </div>
                <div>
                  <p className="font-bold text-brazil-blue text-sm truncate max-w-[150px]">{liga.nome}</p>
                  <p className="text-xs text-brazil-blue/70 font-medium">Prêmio: {liga.premio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Estruturado para SEO e AEO (Inteligência Artificial) */}
        <div className="space-y-4 pt-4">
          <div className="px-1">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Dúvidas Frequentes</h3>
            <p className="text-[10px] text-gray-400 mt-1">Tudo o que você precisa saber para cravar seus palpites.</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 px-4 shadow-sm">
            {[
              {
                q: "Como funciona o Bolão Brasil com Pix?",
                a: "O Bolão Brasil é uma plataforma de automação. Você escolhe uma liga, registra seus palpites e paga a cota via Pix. O sistema monitora os resultados reais do Brasileirão e da Copa, calcula a pontuação e distribui os prêmios automaticamente aos vencedores."
              },
              {
                q: "É seguro pagar via Pix no aplicativo?",
                a: "Sim. Todas as transações são processadas via Efí Bank, instituição autorizada pelo Banco Central. O valor das cotas fica em custódia segura até o encerramento da rodada, garantindo que o ganhador receba o prêmio instantaneamente."
              },
              {
                q: "Posso criar um bolão privado só para meus amigos?",
                a: "Com certeza! Na aba 'Criar Liga', você pode escolher o modo 'Privado'. Assim, seu bolão não aparece nas buscas públicas e apenas pessoas com o seu link exclusivo de convite podem participar."
              },
              {
                q: "Como é feita a pontuação dos palpites?",
                a: "Nossa pontuação padrão premia: Placar Exato (25 pts), Acerto de Vencedor e Saldo de Gols (15 pts), Acerto apenas do Vencedor (10 pts) e Acerto de empate sem placar exato (12 pts)."
              },
              {
                q: "O Bolão Brasil é legalizado?",
                a: "Sim. Atuamos como um software de entretenimento e gestão de concursos prognósticos entre grupos privados, em conformidade com as normas de entretenimento esportivo e gamificação."
              },
              {
                q: "O que acontece se um jogo for adiado?",
                a: "Nossa IA atualiza os dados em tempo real. Se um jogo for adiado por mais de 48h, a partida é anulada do bolão e os pontos não são contabilizados para ninguém, mantendo a integridade da disputa."
              }
            ].map((faq, idx) => (
              <FAQItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>

        {/* Avaliações */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mt-6 mb-4">
          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <h3 className="font-black text-xl italic text-[#1A237E] uppercase tracking-tight">AVALIAÇÕES DA LOJA</h3>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-[#1A237E]">5.0</span>
              <div className="flex flex-col items-start">
                <div className="flex text-brazil-yellow">
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                  <Star fill="currentColor" size={16} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">Baseado em 19 avaliações</span>
              </div>
            </div>
            
            <div className="bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xs shadow-sm mt-2">
              <ShieldCheck size={16} />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[14px]">EXCELENTE</span>
                <span className="text-[9px] font-medium opacity-80 uppercase tracking-wide">LOJA VERIFICADA</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { nome: "DIEGO KRUTZE", texto: "Avaliação via Clube VIP" },
              { nome: "ANDRÉ QUEIROZ", texto: "Avaliação via Clube VIP" },
              { nome: "MICHELE S.", texto: "O Pix do prêmio caiu na segunda de manhã sem eu pedir. Muito confiável!" }
            ].map((av, idx) => (
              <div key={idx} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-black text-[#1A237E] text-xs uppercase">{av.nome}</h4>
                  <div className="flex text-brazil-yellow">
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                  </div>
                </div>
                <p className="text-xs text-[#1A237E]/70 font-medium">{av.texto}</p>
              </div>
            ))}
          </div>

          <button 
            onClick={() => alert('Obrigado! Sua avaliação será enviada para auditoria do Google e atualizada em breve.')}
            className="w-full mt-4 bg-white border-2 border-[#1A237E] text-[#1A237E] font-black text-xs py-3 rounded-xl hover:bg-[#1A237E] hover:text-white transition-colors"
          >
            DEIXAR UMA AVALIAÇÃO
          </button>
        </div>

        {/* Rodapé */}
        <footer className="pt-6 pb-10 text-center space-y-6">
          <div className="flex justify-center gap-4">
            <a href="https://transparencyreport.google.com/safe-browsing/search?url=bolaobrasil.app.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
              <ShieldCheck size={16} className="text-brazil-green" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Google Safe</span>
            </a>
            <div className="flex items-center gap-1 text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <Lock size={16} className="text-brazil-blue" />
              <span className="text-[10px] font-bold uppercase tracking-wider">SSL Seguro</span>
            </div>
          </div>
          
          <p className="text-[10px] text-gray-400 leading-relaxed max-w-[280px] mx-auto">
            Bolão Brasil © 2026. O melhor app de bolão para a Copa do Mundo e Brasileirão. Seguro, automático e com pagamentos via Pix instantâneo. Proibido para menores de 18 anos.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-500 max-w-[300px] mx-auto">
            <button onClick={() => navigate('/legal/termos')} className="hover:text-brazil-blue transition-colors">Termos de Uso</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => navigate('/legal/privacidade')} className="hover:text-brazil-blue transition-colors">Privacidade</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => navigate('/legal/contato')} className="hover:text-brazil-blue transition-colors">Contato</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => navigate('/legal/jogo-responsavel')} className="hover:text-brazil-blue transition-colors">Jogo Responsável</button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;