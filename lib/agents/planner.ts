import { generateTripPlan } from "../ai/adapters";
import {
  buildTravelTrustFindings,
  buildTravelTrustSources
} from "../sources/travelTrustSkill";
import { createSupplierContactDrafts } from "../suppliers/contactSkill";
import type { TripRequest } from "../trips/types";
import { scoreFindings } from "./evaluator";
import { researchTripContext } from "./researcher";
import type {
  PlannerReport,
  ResearchFinding,
  ScoredOption,
  SkillWorkItem,
  SupplierContactDraft,
  TravelTrustSource
} from "./types";

function buildSkillWorkItems({
  request,
  findings,
  bestOptions,
  supplierDrafts,
  trustSources
}: {
  request: TripRequest;
  findings: ResearchFinding[];
  bestOptions: ScoredOption[];
  supplierDrafts: SupplierContactDraft[];
  trustSources: TravelTrustSource[];
}): SkillWorkItem[] {
  const destination = request.destino;
  const hasExternalSources = trustSources.length > 0;

  return [
    {
      id: "destination-intelligence",
      name: "Pesquisador do destino",
      role: "researcher",
      status: findings.length > 0 ? "done" : "waiting",
      mission: `Levantar contexto de ${destination}: hospedagem, passeios, clima, seguranca e deslocamento.`,
      result: `${findings.length} sinais encontrados para orientar o roteiro.`,
      clientBenefit: "Evita roteiro generico e ajuda a escolher atividades com mais chance de dar certo."
    },
    {
      id: "travel-trust-skill",
      name: "Validador de voos e hospedagem",
      role: "researcher",
      status: hasExternalSources ? "needs-review" : "waiting",
      mission: "Comparar fontes de mercado e separar links confiaveis para conferencia.",
      result: `${trustSources.length} fontes preparadas para voo, companhia aerea, hospedagem, avaliacao e mapa.`,
      clientBenefit: "O cliente ve onde confirmar preco, disponibilidade, reputacao e regras antes de comprar."
    },
    {
      id: "option-evaluator",
      name: "Avaliador de melhores escolhas",
      role: "budgetAnalyst",
      status: bestOptions.length > 0 ? "done" : "waiting",
      mission: "Pontuar opcoes por confianca, relevancia, risco e impacto na experiencia.",
      result: `${bestOptions.slice(0, 5).length} melhores opcoes ranqueadas para decisao rapida.`,
      clientBenefit: "Reduz a confusao de muitas opcoes e mostra o que vale olhar primeiro."
    },
    {
      id: "supplier-contact-draft",
      name: "Assistente de fornecedores",
      role: "supplierAgent",
      status: supplierDrafts.length > 0 ? "needs-review" : "waiting",
      mission: "Preparar mensagens para consultar guias, pousadas, passeios e parceiros locais.",
      result: `${supplierDrafts.length} mensagens prontas para contato humano ou WhatsApp.`,
      clientBenefit: "Acelera parceria e cotacao sem deixar a pessoa escrever tudo do zero."
    },
    {
      id: "trip-planner",
      name: "Montador do roteiro",
      role: "planner",
      status: "done",
      mission: "Transformar as pesquisas em roteiro, checklist, orcamento e proximos passos.",
      result: "Roteiro inicial gerado e pronto para ajustes conforme o cliente decide.",
      clientBenefit: "Entrega um plano pratico, nao apenas uma resposta solta da IA."
    }
  ];
}

export async function runPlannerAgents(request: TripRequest): Promise<PlannerReport> {
  const findings = await researchTripContext({
    request,
    now: new Date()
  });
  const trustSources = buildTravelTrustSources(request);
  const allFindings = [...findings, ...buildTravelTrustFindings(request)];
  const bestOptions = scoreFindings(allFindings);
  const supplierDrafts = createSupplierContactDrafts(request);
  const skillWork = buildSkillWorkItems({
    request,
    findings: allFindings,
    bestOptions,
    supplierDrafts,
    trustSources
  });
  const plan = await generateTripPlan({ form: request });

  return {
    plan: {
      ...plan,
      resumo: `${plan.resumo} O planejador tambem compara fontes de voo, hospedagem, reputacao e deslocamento para aumentar a confianca antes da reserva.`
    },
    findings: allFindings,
    bestOptions: bestOptions.slice(0, 5),
    supplierDrafts,
    trustSources,
    skillWork,
    nextAgentActions: [
      "Pesquisar voos em comparadores e validar a compra no site da companhia aerea.",
      "Comparar hospedagens por nota recente, localizacao, cancelamento, taxas e cafe da manha.",
      "Cruzar distancia real no mapa entre aeroporto, hospedagem, passeios e restaurantes.",
      "Confirmar fornecedores locais antes de recomendar compra, reserva ou pagamento.",
      "Salvar decisoes no banco e gerar PDF final para o cliente."
    ],
    skillsUsed: [
      "destination-intelligence",
      "search-skill",
      "travel-trust-skill",
      "weather-skill",
      "option-evaluator",
      "supplier-contact-draft"
    ]
  };
}
