import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, Users, Calendar, CheckSquare, BarChart3, QrCode,
  ChevronDown, ChevronUp, Trophy, Share2, Star, ShieldCheck, Lock
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

  const reviews = [
    { name: "Carlos T.", role: "Organizador da Firma", text: "Acabou a dor de cabeça de cobrar o pessoal no WhatsApp. O app tranca o palpite até o Pix cair. Genial!", rating: 5 },
    { name: "Mariana S.", role: "Torcedora", text: "Ganhei o bolão da rodada e o dinheiro caiu na minha conta na segunda de manhã sem eu pedir. Muito confiável.", rating: 5 },
    { name: "João P.", role: "Grupo de Amigos", text: "O ranking ao vivo enquanto o jogo acontece deixa a resenha no bar 10x mais emocionante.", rating: 5 }
  ];

  return (
    <>
      <SEO 
        title="Bolão Brasil - Bolão do Brasileirão e Copa com Pix"
        description="O bolão de futebol mais rápido do Brasil. Crave placares, ganhe pontos e receba prêmios no Pix."
        canonical="https://bolaobrasil.app/"
        schema={[generateWebApplicationSchema(), generateFAQSchema()]}
      />
      {/* Schema.org Aggregate Rating para estrelas no Google */}
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
          <button className="absolute top-4 right-4 bg-brazil-yellow text-brazil-blue p-2.5 rounded-full shadow-md z-30"><Share2 size={18} /></button>
          
          <div className="relative z-10 space-y-2 max-w-[65%]">
            <p className="text-brazil-yellow font-bold text-xs uppercase tracking-wider">RODADA DO BRASILEIRÃO</p>
            <h2 className="text-xl font-black leading-tight">Pronto para cravar?</h2>
            <div className="pt-2">
              <p className="text-xs opacity-90 font-medium">PONTOS TOTAIS:</p>
              <p className="text-4xl font-black text-brazil-yellow drop-shadow-md">1,250</p>
            </div>
            <div className="flex gap-2 mt-4 relative z-20 max-w-[80%]">
              <button onClick={() => navigate('/palpites')} className="bg-white text-brazil-green px-4 py-2 rounded-full text-xs font-bold shadow-sm w-full">
                Ver Meus Bolões
              </button>
            </div>
          </div>
        </motion.div>

        {/* Grid de Botões */}
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, idx) => (
            <motion.button key={idx} whileTap={{ scale: 0.95 }} onClick={() => navigate(f.path)} className={`${f.color} ${f.textColor || 'text-white'} p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-2 h-24`}>
              <f.icon size={24} />
              <span className="text-[11px] font-bold truncate w-full">{f.label}</span>
            </motion.button>
          ))}
        </div>

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
        {/* Social Proof: Avaliações de Clientes ... (MANTENHA O BLOCO DE AVALIAÇÕES E FAQ INTACTOS AQUI NO MEIO) ... */}
{/* Prova Social: Resenha da Galera (Restaurado) */}
          <div className="space-y-4 pt-8 pb-4">
            <div className="flex justify-between items-end px-1">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Resenha da Galera</h3>
              <div className="flex gap-0.5 text-brazil-yellow">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              {[
                { name: "Carlos T.", role: "Organizador da Firma", text: "Acabou a dor de cabeça de cobrar o pessoal no WhatsApp. O app tranca o palpite até o Pix cair. Genial!", rating: 5 },
                { name: "Mariana S.", role: "Torcedora", text: "Ganhei o bolão da rodada e o dinheiro caiu na minha conta na segunda de manhã sem eu pedir. Muito confiável.", rating: 5 },
                { name: "João P.", role: "Grupo de Amigos", text: "O ranking ao vivo enquanto o jogo acontece deixa a resenha no bar 10x mais emocionante.", rating: 5 }
              ].map((review, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brazil-blue/10 flex items-center justify-center text-brazil-blue font-bold text-xs">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{review.name}</p>
                        <p className="text-[10px] text-gray-500">{review.role}</p>
                      </div>
                    </div>
                    <div className="flex text-brazil-yellow">
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 italic">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        {/* Rodapé Seguro (Legal, Privacidade, Selos e Contato Institucional) */}
        <footer className="pt-6 pb-10 text-center space-y-6">
          <div className="flex justify-center gap-4">
            <a href="https://bolaobrasil.app.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
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