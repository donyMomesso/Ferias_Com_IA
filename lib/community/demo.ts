import type { CommunityEventCard, CommunityGroupCard } from "./types";

export const communityCategories = [
  "Viagem",
  "Esportes",
  "Tech",
  "Gastronomia",
  "Arte",
  "Família",
  "Aventura"
];

export const demoGroups: CommunityGroupCard[] = [
  {
    id: "demo-trilhas",
    name: "Trilhas e Praias Inteligentes",
    description: "Grupo para viajantes que querem explorar natureza com segurança, fotos e bons roteiros.",
    category: "Aventura",
    city: "Cananéia",
    state: "SP",
    coverImage: "https://picsum.photos/seed/comunidade-trilhas/900/520",
    isPrivate: false,
    memberCount: 128,
    nextEvent: {
      id: "demo-evento-trilha",
      title: "Caminhada leve + pôr do sol",
      date: new Date(Date.now() + 86400000 * 10).toISOString()
    }
  },
  {
    id: "demo-gastro",
    name: "Sabores do Litoral",
    description: "Encontros em restaurantes locais, frutos do mar e experiências gastronômicas regionais.",
    category: "Gastronomia",
    city: "Cananéia",
    state: "SP",
    coverImage: "https://picsum.photos/seed/comunidade-gastro/900/520",
    isPrivate: false,
    memberCount: 86
  },
  {
    id: "demo-pesca",
    name: "Pescaria em Família",
    description: "Comunidade para combinar saídas de pesca, barcos, dicas de equipamento e fornecedores locais.",
    category: "Esportes",
    city: "Cananéia",
    state: "SP",
    coverImage: "https://picsum.photos/seed/comunidade-pesca/900/520",
    isPrivate: false,
    memberCount: 64
  }
];

export const demoEvents: CommunityEventCard[] = [
  {
    id: "demo-evento-trilha",
    title: "Caminhada leve + pôr do sol",
    description: "Encontro para famílias e viajantes que querem conhecer um ponto bonito sem correria.",
    date: new Date(Date.now() + 86400000 * 10).toISOString(),
    location: "Centro histórico",
    isOnline: false,
    price: 0,
    coverImage: "https://picsum.photos/seed/evento-por-do-sol/900/520",
    rsvpCount: 24,
    group: {
      id: "demo-trilhas",
      name: "Trilhas e Praias Inteligentes",
      category: "Aventura",
      city: "Cananéia"
    }
  },
  {
    id: "demo-evento-gastro",
    title: "Noite de frutos do mar",
    description: "Mesa compartilhada para trocar dicas, fotos e contatos de bons fornecedores locais.",
    date: new Date(Date.now() + 86400000 * 14).toISOString(),
    location: "Restaurante parceiro",
    isOnline: false,
    price: 80,
    coverImage: "https://picsum.photos/seed/evento-frutos-mar/900/520",
    rsvpCount: 18,
    group: {
      id: "demo-gastro",
      name: "Sabores do Litoral",
      category: "Gastronomia",
      city: "Cananéia"
    }
  }
];
