import { buildDestinationIntelligence } from "../sources/destinationSkill";
import type { AgentContext, ResearchFinding } from "./types";

function buildPlanningHeuristics(context: AgentContext): ResearchFinding[] {
  const { request } = context;

  return [
    {
      category: "transporte",
      title: "Deslocamento com folga",
      description:
        "Planejar blocos de atividades por região e reservar intervalos para crianças, refeições e imprevistos.",
      source: "heuristica-planejador",
      confidence: 0.82
    },
    {
      category: "seguranca",
      title: "Validação antes da compra",
      description:
        "Antes de recomendar reserva, confirmar reputação, endereço, política de cancelamento, inclusão de crianças e formas de pagamento.",
      source: "politica-interna",
      confidence: 0.9,
      requiresHumanValidation: true
    },
    {
      category: "hospedagem",
      title: `Critérios de hospedagem em ${request.destino}`,
      description:
        "Priorizar boa localização, café da manhã ou cozinha, estacionamento, cancelamento flexível e acesso simples às atividades principais.",
      source: "heuristica-planejador",
      confidence: 0.78,
      estimatedCost: request.orcamento
    }
  ];
}

export async function researchTripContext(context: AgentContext): Promise<ResearchFinding[]> {
  const intelligence = await buildDestinationIntelligence(context.request);

  return [...intelligence.findings, ...buildPlanningHeuristics(context)];
}
