import type { TripRequest } from "../trips/types";

export function buildTripPrompt(form: TripRequest) {
  return `Você é o planejador principal do app Férias com IA.

Crie um roteiro de viagem em português do Brasil usando os dados abaixo.

Destino: ${form.destino}
Datas: ${form.datas}
Pessoas: ${form.pessoas}
Objetivo: ${form.objetivo}
Orçamento: ${form.orcamento}

Responda em JSON válido, sem markdown, neste formato:
{
  "titulo": "string",
  "destino": "string",
  "resumo": "string",
  "roteiro": ["Dia 1 - ...", "Dia 2 - ..."],
  "checklist": ["item"],
  "orcamentoEstimado": "string",
  "proximosPassos": ["item"]
}`;
}
