import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Legal() {
  const { pagina } = useParams();
  const navigate = useNavigate();

  // Força a página a rolar para o topo ao carregar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pagina]);

  const conteudos = {
    'termos': {
      titulo: 'Termos de Uso',
      texto: 'Bem-vindo ao Bolão Brasil. Ao utilizar nosso aplicativo (PWA), você concorda que a plataforma atua exclusivamente como uma ferramenta de gestão e automação para ligas privadas entre amigos. O Bolão Brasil não é uma casa de apostas, mas um software de custódia temporária (escrow) e gamificação esportiva. A responsabilidade fiscal e tributária sobre os prêmios recebidos é exclusiva do usuário vencedor. Proibido para menores de 18 anos.'
    },
    'privacidade': {
      titulo: 'Política de Privacidade',
      texto: 'Sua segurança é nossa prioridade. Coletamos apenas os dados estritamente necessários para o funcionamento do Bolão (Nome e WhatsApp para login, e Chave Pix para pagamento de prêmios). Os pagamentos são processados via gateway oficial homologado pelo Banco Central do Brasil. Não vendemos seus dados para terceiros. Utilizamos criptografia SSL ponta-a-ponta e seguimos as diretrizes de segurança da informação em conformidade com a LGPD.'
    },
    'contato': {
      titulo: 'Fale Conosco',
      texto: 'Precisa de ajuda com sua liga, pagamentos Pix ou tem alguma dúvida técnica? Nossa equipe de suporte está pronta para atender. Entre em contato através do email bolaobrasilapp@gmail.com Nosso prazo de resposta padrão é de até 24 horas úteis. Em dias de jogos da rodada, o suporte pode ter um acréscimo no tempo de resposta devido à alta demanda.'
    },
    'jogo-responsavel': {
      titulo: 'Jogo Responsável',
      texto: 'O futebol é paixão e o bolão deve ser apenas diversão entre amigos. O Bolão Brasil apoia e incentiva práticas de jogo responsável. Estabeleça limites de valor para as entradas das suas ligas e nunca utilize recursos financeiros destinados a despesas essenciais do seu dia a dia. Se você sentir que a diversão acabou ou que precisa de ajuda, busque apoio de profissionais e instituições especializadas.'
    }
  };

  const conteudoAtual = conteudos[pagina as keyof typeof conteudos] || conteudos['termos'];

  return (
    <div className="p-4 space-y-6 pb-20 bg-white min-h-screen">
      <Helmet>
        <title>{`${conteudoAtual.titulo} | Bolão Brasil`}</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-brazil-blue font-bold p-2 -ml-2 rounded-lg hover:bg-gray-50"
      >
        <ChevronLeft size={20} /> Voltar
      </button>

      <div className="space-y-4 pt-4">
        <div className="w-12 h-12 bg-brazil-green/10 rounded-full flex items-center justify-center">
          <ShieldCheck size={24} className="text-brazil-green" />
        </div>
        <h1 className="text-2xl font-black text-brazil-blue">{conteudoAtual.titulo}</h1>
        
        <div className="prose prose-sm text-gray-600 leading-relaxed">
          <p>{conteudoAtual.texto}</p>
        </div>
      </div>

      <div className="mt-12 p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
        <p className="text-xs text-gray-500 font-medium">Bolão Brasil © 2026 - Documento Oficial</p>
      </div>
    </div>
  );
}