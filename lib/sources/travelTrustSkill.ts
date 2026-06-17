import type { TripRequest } from "../trips/types";
import type { TravelTrustSource } from "../agents/types";
import { generateBookingLinks } from "./bookingLinks";

export function buildTravelTrustSources(request: TripRequest): TravelTrustSource[] {
  const links = generateBookingLinks({
    destination: request.destino,
    datas: request.datas,
    pessoas: request.pessoas
  });

  return [
    {
      kind: "voo",
      name: "Google Voos",
      url: links.googleFlights,
      description:
        "Compara datas, escalas, duracao e faixas de preco antes de escolher a companhia.",
      verificationTip:
        "Use como primeira varredura e confirme bagagem, taxas e regras no site da companhia.",
      confidence: 0.9
    },
    {
      kind: "voo",
      name: "Skyscanner",
      url: links.skyscanner,
      description:
        "Ajuda a encontrar combinacoes de companhias, alertas de preco e alternativas de data.",
      verificationTip:
        "Compare com Google Voos e prefira finalizar em fornecedor com reputacao clara.",
      confidence: 0.86
    },
    {
      kind: "companhia-aerea",
      name: "LATAM",
      url: "https://www.latamairlines.com/br/pt",
      description:
        "Canal direto para conferir disponibilidade, milhas, bagagem e politica de remarcacao.",
      verificationTip:
        "Depois de achar um bom preco em buscadores, valide o mesmo trecho no canal oficial.",
      confidence: 0.84
    },
    {
      kind: "companhia-aerea",
      name: "GOL",
      url: "https://www.voegol.com.br/",
      description:
        "Boa fonte para checar rotas nacionais, tarifas promocionais e servicos incluidos.",
      verificationTip:
        "Confira aeroporto, horario e franquia de bagagem antes de recomendar a compra.",
      confidence: 0.84
    },
    {
      kind: "companhia-aerea",
      name: "Azul",
      url: "https://www.voeazul.com.br/",
      description:
        "Pode ter malha forte para cidades regionais e conexoes fora dos grandes hubs.",
      verificationTip:
        "Verifique se a chegada fica perto do destino final ou exige deslocamento adicional.",
      confidence: 0.84
    },
    {
      kind: "hospedagem",
      name: "Booking.com",
      url: links.booking,
      description:
        "Mostra hoteis, pousadas, filtros de nota, cancelamento, cafe da manha e localizacao.",
      verificationTip:
        "Priorize nota alta recente, muitas avaliacoes e politica de cancelamento flexivel.",
      confidence: 0.88
    },
    {
      kind: "hospedagem",
      name: "Google Hoteis",
      url: links.googleHotels,
      description:
        "Compara tarifas em varios canais e cruza localizacao com avaliacoes do Google.",
      verificationTip:
        "Confira se o preco final inclui taxas e se a nota e coerente com avaliacoes recentes.",
      confidence: 0.87
    },
    {
      kind: "avaliacao",
      name: "Tripadvisor",
      url: links.tripadvisor,
      description:
        "Ajuda a validar reputacao de hoteis, restaurantes, passeios e agencias locais.",
      verificationTip:
        "Leia avaliacoes negativas recentes para identificar risco real antes de indicar.",
      confidence: 0.82
    },
    {
      kind: "mapa",
      name: "Google Maps",
      url: links.googleMaps,
      description:
        "Confere distancia real entre hospedagem, aeroporto, passeios e restaurantes.",
      verificationTip:
        "Valide tempo de deslocamento no horario parecido com o da viagem.",
      confidence: 0.86
    }
  ];
}

export function buildTravelTrustFindings(request: TripRequest) {
  const sources = buildTravelTrustSources(request);

  return sources.slice(0, 7).map((source) => ({
    category:
      source.kind === "hospedagem" || source.kind === "avaliacao"
        ? ("hospedagem" as const)
        : ("transporte" as const),
    title: `${source.name}: fonte de verificacao`,
    description: `${source.description} ${source.verificationTip}`,
    source: source.url,
    confidence: source.confidence,
    locationHint: request.destino,
    requiresHumanValidation: true
  }));
}
