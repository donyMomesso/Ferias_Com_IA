import { generateTripPlan } from "../ai/adapters";
import { createSupplierContactDrafts } from "../suppliers/contactSkill";
import type { TripRequest } from "../trips/types";
import { scoreFindings } from "./evaluator";
import { researchTripContext } from "./researcher";
import type { PlannerReport } from "./types";

export async function runPlannerAgents(request: TripRequest): Promise<PlannerReport> {
  const findings = await researchTripContext({
    request,
    now: new Date()
  });
  const bestOptions = scoreFindings(findings);
  const supplierDrafts = createSupplierContactDrafts(request);
  const plan = await generateTripPlan({ form: request });

  return {
    plan: {
      ...plan,
      resumo: `${plan.resumo} O planejador também comparou opções por relevância, confiança e impacto na experiência.`
    },
    findings,
    bestOptions: bestOptions.slice(0, 5),
    supplierDrafts,
    nextAgentActions: [
      "Buscar dados reais de hospedagem, passeios, restaurantes, clima e avaliações.",
      "Comparar preço, localização, disponibilidade, conforto e risco de cada opção.",
      "Confirmar fornecedores locais antes de recomendar compra ou reserva.",
      "Salvar decisões no banco e gerar PDF final para o cliente."
    ]
  };
}
