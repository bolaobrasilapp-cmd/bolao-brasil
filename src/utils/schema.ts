export const generateWebApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Bolão Brasil",
  "url": "https://bolaobrasil.app",
  "description": "O Bolão Automático da Copa do Mundo com Pix. Gerencie apostas de amigos de forma fácil e segura.",
  "applicationCategory": "SportsApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "BRL"
  }
});

export const generateFAQSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como funciona o Bolão Brasil com Pix?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O Bolão Brasil automatiza tudo. Você cria a liga, o sistema cobra as entradas via Pix dos seus amigos, calcula os pontos automaticamente ao final de cada jogo e gerencia o pagamento aos vencedores."
      }
    },
    {
      "@type": "Question",
      "name": "É legal fazer bolão online na Copa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O Bolão Brasil funciona no modelo de 'bolão entre amigos' (piscina de apostas), que é uma tradição brasileira. Nosso app remove a dor de cabeça da organização."
      }
    },
    {
      "@type": "Question",
      "name": "Qual o valor mínimo da aposta?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O valor é definido pelo criador da liga. Você pode criar ligas gratuitas ou pagas via Pix."
      }
    },
    {
      "@type": "Question",
      "name": "Quando recebo meu prêmio no bolão?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O Pix do prêmio é processado automaticamente para o vencedor logo após a auditoria oficial dos resultados da rodada."
      }
    }
  ]
});

export const generateSportsEventSchema = (homeTeam: string, awayTeam: string, date: string) => ({
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": `${homeTeam} vs ${awayTeam} - Copa do Mundo`,
  "startDate": date,
  "location": {
    "@type": "Place",
    "name": "Estádio da Copa"
  },
  "competitor": [
    { "@type": "SportsTeam", "name": homeTeam },
    { "@type": "SportsTeam", "name": awayTeam }
  ]
});
