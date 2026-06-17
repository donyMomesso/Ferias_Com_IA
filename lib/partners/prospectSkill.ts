import { runSearchSkill } from "../sources/searchSkill";
import { fetchDestinationPhotos } from "../sources/photosSkill";
import type { PartnerCategory, PartnerProspect, PartnerProspectRequest } from "./types";

const defaultCategories: PartnerCategory[] = [
  "guia",
  "passeio",
  "restaurante",
  "hospedagem",
  "transfer",
  "experiencia"
];

const categoryQueries: Record<PartnerCategory, string> = {
  guia: "guia turístico local WhatsApp Instagram",
  passeio: "passeio turístico agência local barco trilha",
  restaurante: "restaurante local bem avaliado família",
  hospedagem: "pousada hotel familiar bem avaliado",
  transfer: "transfer motorista turismo local",
  experiencia: "experiência local gastronomia pesca aventura"
};

function categoryLabel(category: PartnerCategory) {
  const labels: Record<PartnerCategory, string> = {
    guia: "guia turístico",
    passeio: "passeio local",
    restaurante: "restaurante",
    hospedagem: "hospedagem",
    transfer: "transfer",
    experiencia: "experiência local"
  };

  return labels[category];
}

export function buildPartnershipMessage(prospect: Pick<PartnerProspect, "name" | "destination" | "category">) {
  return `Olá, tudo bem? Estou montando a plataforma Férias com IA, que cria roteiros personalizados para viajantes e famílias.

Estamos selecionando parceiros locais em ${prospect.destination} para indicar ${categoryLabel(
    prospect.category
  )} dentro dos roteiros.

Vi o contato de vocês e queria entender se têm interesse em receber clientes indicados pela plataforma.

Podem me passar disponibilidade, valores médios, fotos/links, formas de pagamento e como funciona a parceria?`;
}

function scoreProspect(confidence: number, source: string) {
  const sourceBonus = source.startsWith("http") ? 12 : 0;
  return Math.min(100, Math.round(confidence * 100) + sourceBonus);
}

export async function prospectPartners(request: PartnerProspectRequest): Promise<PartnerProspect[]> {
  const categories = request.categories?.length ? request.categories : defaultCategories;
  const results = await Promise.all(
    categories.map(async (category) => {
      const [findings, photos] = await Promise.all([
        runSearchSkill({
          query: categoryQueries[category],
          category: "fornecedor",
          destination: request.destination
        }),
        fetchDestinationPhotos(`${request.destination} ${categoryLabel(category)}`, 5)
      ]);

      return findings.map((finding, index): PartnerProspect => {
        const photo = photos[index % Math.max(photos.length, 1)];
        const prospect = {
          name: finding.title,
          destination: request.destination,
          category,
          description: finding.description,
          photoUrl: photo?.url,
          thumbUrl: photo?.thumbUrl,
          photoAlt: photo?.alt || `${categoryLabel(category)} em ${request.destination}`,
          photoCredit: photo ? `${photo.photographer} via ${photo.source}` : undefined,
          source: finding.source,
          confidence: finding.confidence,
          score: scoreProspect(finding.confidence, finding.source),
          status: "prospectado" as const,
          contactHint: finding.contactHint || finding.source,
          partnershipMessage: ""
        };

        return {
          ...prospect,
          partnershipMessage: buildPartnershipMessage(prospect)
        };
      });
    })
  );

  return results
    .flat()
    .sort((a, b) => b.score - a.score)
    .slice(0, 18);
}
