import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Ajuda() {
  const navigate = useNavigate();
  const [perguntaAtiva, setPerguntaAtiva] = useState<number | null>(null);

  const faqs = [
    {
      pergunta: "Como funciona a pontuação do Bolão?",
      resposta: "Nossa pontuação é dividida em 3 níveis:\n\n🏆 25 Pontos (Placar Exato): Você acertou o vencedor e o número exato de gols de cada time.\n\n🎯 15 Pontos (Vencedor + Saldo): Você acertou quem venceu e a diferença de gols (ex: apostou 2x0 e o jogo foi 3x1, a diferença é de 2 gols).\n\n✅ 10 Pontos (Apenas Vencedor): Você acertou qual time ganhou, mas errou o placar e a diferença de gols."
    },
    {
      pergunta: "Como recebo o meu prêmio?",
      resposta: "Se você for o vencedor da rodada na sua Liga, o prêmio será depositado via PIX na conta que você cadastrou no seu Perfil. O comprovante do depósito ficará disponível na sua aba 'Perfil' em até 24h após o término do último jogo da rodada."
    },
    {
      pergunta: "Até que horas posso enviar meus palpites?",
      resposta: "Você pode enviar ou alterar seus palpites até o horário exato de início da primeira partida da rodada. Depois que a bola rolar para o primeiro jogo, o sistema trava e não permite mais edições."
    },
    {
      pergunta: "Como participo de uma Liga VIP?",
      resposta: "As Ligas são ambientes fechados onde o prêmio é acumulado entre os participantes. Para entrar em uma liga, você precisa receber o Link de Convite do administrador ou da empresa organizadora (ex: Liga Cowburguer)."
    },
    {
      pergunta: "Meus dados e chave Pix estão seguros?",
      resposta: "Sim! Utilizamos criptografia padrão militar e banco de dados isolado no Google Firebase. Sua chave Pix é utilizada única e exclusivamente para o pagamento dos seus prêmios através da nossa integração financeira."
    }
  ];

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Central de Ajuda | Bolão Brasil</title>
      </Helmet>

      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6 mt-2">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight leading-none">Central de Ajuda</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manual do Usuário</p>
        </div>
      </div>

      <div className="bg-brazil-blue rounded-3xl p-6 text-center relative overflow-hidden shadow-lg border border-blue-900">
        <HelpCircle size={48} className="text-brazil-yellow mx-auto mb-3 opacity-90" />
        <h3 className="text-lg font-black text-white mb-2">Como podemos ajudar?</h3>
        <p className="text-xs text-blue-200">Encontre respostas rápidas para as dúvidas mais frequentes do nosso Bolão.</p>
      </div>

      {/* Lista de FAQ */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setPerguntaAtiva(perguntaAtiva === index ? null : index)}
              className="w-full text-left p-4 flex items-center justify-between gap-4 focus:outline-none"
            >
              <span className="font-bold text-sm text-gray-800 pr-4">{faq.pergunta}</span>
              <div className={`transition-transform duration-300 ${perguntaAtiva === index ? 'rotate-180 text-brazil-green' : 'text-gray-400'}`}>
                <ChevronDown size={20} />
              </div>
            </button>
            
            <AnimatePresence>
              {perguntaAtiva === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 pt-0 text-xs text-gray-500 leading-relaxed whitespace-pre-line border-t border-gray-50 mt-2">
                    {faq.resposta}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Suporte Direto */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center mt-8">
        <h4 className="font-bold text-gray-800 mb-2">Ainda com dúvidas?</h4>
        <p className="text-xs text-gray-500 mb-4">Fale diretamente com nossa equipe de suporte pelo WhatsApp.</p>
        <button 
          onClick={() => window.open('https://wa.me/5544999999999', '_blank')}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all uppercase text-xs tracking-wider"
        >
          <MessageCircle size={18} /> Chamar no WhatsApp
        </button>
      </div>
    </div>
  );
}