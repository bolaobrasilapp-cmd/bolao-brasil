export const rodadaAtual = {
  numero: 1,
  campeonato: "Brasileirão Série A",
  jogos: [
    {
      id: 1,
      home: "Flamengo",
      away: "Palmeiras",
      // Agora aponta para a sua pasta public/escudos
      homeLogo: "/escudos/flamengo.png", 
      awayLogo: "/escudos/palmeiras.png",
      data: "Hoje",
      hora: "21:30"
    },
    {
      id: 2,
      home: "Vitoria",
      away: "Corinthians",
      homeLogo: "/escudos/vitoria.png", 
      awayLogo: "/escudos/corinthians.png",
      data: "Dom",
      hora: "16:00"
    },
    {
      id: 3,
      home: "Grêmio",
      away: "Internacional",
      homeLogo: "/escudos/gremio.png", 
      awayLogo: "/escudos/internacional.png",
      data: "Dom",
      hora: "18:30"
    }
  ]
};