import type { AgentContext, ResearchFinding } from "./types";

export async function researchTripContext(context: AgentContext): Promise<ResearchFinding[]> {
  const { request } = context;

  return [
    {
      category: "hospedagem",
      title: `Base de hospedagem em ${request.destino}`,
      description:
        "Priorizar hospedagens com boa localização, cozinha ou café da manhã, estacionamento e acesso simples às atividades principais.",
      source: "base-interna-demo",
      confidence: 0.72,
      estimatedCost: request.orcamento
    },
    {
      category: "passeio",
      title: "Passeio principal guiado",
      description:
        "Reservar a atividade mais importante da viagem com antecedência e deixar alternativas para clima ruim.",
      source: "base-interna-demo",
      confidence: 0.76,
      locationHint: request.destino
    },
    {
      category: "restaurante",
      title: "Restaurantes locais com perfil familiar",
      description:
        "Selecionar restaurantes próximos ao roteiro do dia para reduzir deslocamento e evitar filas em horários de pico.",
      source: "base-interna-demo",
      confidence: 0.68,
      estimatedCost: "médio"
    },
    {
      category: "transporte",
      title: "Deslocamento com folga",
      description:
        "Planejar blocos de atividades por região e reservar intervalos para crianças, refeições e imprevistos.",
      source: "heuristica-planejador",
      confidence: 0.82
    },
    {
      category: "fornecedor",
      title: "Fornecedor local para experiência principal",
      description:
        "Contato recomendado para confirmar disponibilidade, preço, duração, ponto de encontro e política de cancelamento.",
      source: "base-interna-demo",
      confidence: 0.7,
      contactHint: "WhatsApp"
    }
  ];
}
