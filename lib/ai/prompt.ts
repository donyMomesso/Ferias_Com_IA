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

export function buildCommunityPrompt(destino: string, objetivo: string): string {
  return `Você é um assistente de viagens e comunidades locais.

O usuário vai viajar para: ${destino}
Objetivo da viagem: ${objetivo}

Sugira até 5 tipos de grupos e eventos locais que ele deveria buscar nesta cidade.
Responda em JSON com o formato:
{
  "grupos": [{ "categoria": string, "sugestao": string, "motivo": string }],
  "eventos": [{ "tipo": string, "descricao": string, "dica": string }]
}`;
}
