import type { TripPlan, TripRequest } from "../trips/types";
import type { CommunitySuggestion } from "../community/types";
import { buildCommunityPrompt, buildTripPrompt } from "./prompt";

export type AiProvider = "demo" | "openai" | "gemini" | "claude";

type GenerateTripPlanInput = {
  form: TripRequest;
  provider?: AiProvider;
};

function demoCommunitySuggestion(destino: string, objetivo: string): CommunitySuggestion {
  return {
    grupos: [
      {
        categoria: "Viagem",
        sugestao: `Viajantes em ${destino}`,
        motivo: `Bom para trocar dicas práticas sobre ${objetivo}.`
      },
      {
        categoria: "Gastronomia",
        sugestao: "Experiências e restaurantes locais",
        motivo: "Ajuda a descobrir lugares autênticos e fornecedores validados."
      },
      {
        categoria: "Aventura",
        sugestao: "Passeios leves e natureza",
        motivo: "Combina viajantes com interesses parecidos e reduz risco em passeios."
      }
    ],
    eventos: [
      {
        tipo: "Encontro de boas-vindas",
        descricao: "Pequeno encontro para viajantes trocarem dicas no primeiro dia.",
        dica: "Procure eventos gratuitos ou com consumo individual."
      },
      {
        tipo: "Passeio guiado em grupo",
        descricao: "Atividade local com guia ou fornecedor validado.",
        dica: "Confirme lotação, segurança e política de cancelamento."
      }
    ]
  };
}

function demoTripPlan(form: TripRequest): TripPlan {
  return {
    titulo: `Roteiro inteligente para ${form.destino}`,
    destino: form.destino,
    resumo:
      "Plano inicial gerado pelo modo demo. Ele já organiza a viagem por dias e pode ser substituído por IA real quando as chaves forem configuradas.",
    roteiro: [
      "Dia 1 - Chegada, check-in, reconhecimento da região e jantar perto da hospedagem.",
      "Dia 2 - Centro histórico, pontos turísticos leves, fotos da família e primeiro contato com prestadores locais.",
      "Dia 3 - Atividade principal alinhada ao objetivo da viagem: pesca, praia, gastronomia, descanso ou aventura.",
      "Dia 4 - Passeio especial com guia local, barco, trilha, praia diferenciada ou experiência gastronômica.",
      "Dia 5 - Dia livre inteligente com opções ajustadas ao clima, distância, orçamento e energia do grupo.",
      "Dia 6 - Última experiência marcante, pôr do sol, jantar especial e foto oficial da viagem.",
      "Dia 7 - Café da manhã, checkout e retorno com paradas sugeridas."
    ],
    checklist: [
      "Confirmar hospedagem e horários de check-in.",
      "Separar documentos, reservas e contatos de emergência.",
      "Validar previsão do tempo dois dias antes da saída.",
      "Reservar passeios com maior demanda."
    ],
    orcamentoEstimado: `Perfil ${form.orcamento}: priorizar escolhas com bom custo-benefício e uma experiência especial na viagem.`,
    proximosPassos: [
      "Conectar uma chave de IA real no arquivo .env.",
      "Cadastrar parceiros locais no banco.",
      "Gerar PDF do roteiro para impressão ou WhatsApp."
    ],
    geradoPor: "demo"
  };
}

function parseAiJson(text: string, provider: AiProvider): TripPlan {
  const parsed = JSON.parse(text) as Omit<TripPlan, "geradoPor">;

  return {
    ...parsed,
    geradoPor: provider
  };
}

async function callOpenAi(form: TripRequest): Promise<TripPlan> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return demoTripPlan(form);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: buildTripPrompt(form)
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI retornou erro ${response.status}`);
  }

  const data = await response.json();
  const text = data.output_text || data.output?.[0]?.content?.[0]?.text;
  if (!text) throw new Error("OpenAI não retornou texto.");

  return parseAiJson(text, "openai");
}

async function callGemini(form: TripRequest): Promise<TripPlan> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return demoTripPlan(form);

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildTripPrompt(form) }] }]
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini retornou erro ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini não retornou texto.");

  return parseAiJson(text, "gemini");
}

async function callClaude(form: TripRequest): Promise<TripPlan> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return demoTripPlan(form);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL || "claude-3-5-haiku-latest",
      max_tokens: 1600,
      messages: [{ role: "user", content: buildTripPrompt(form) }]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude retornou erro ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error("Claude não retornou texto.");

  return parseAiJson(text, "claude");
}

export async function generateTripPlan({
  form,
  provider = (process.env.AI_PROVIDER as AiProvider) || "demo"
}: GenerateTripPlanInput): Promise<TripPlan> {
  if (provider === "openai") return callOpenAi(form);
  if (provider === "gemini") return callGemini(form);
  if (provider === "claude") return callClaude(form);

  return demoTripPlan(form);
}

export async function generateCommunitySuggestions({
  destino,
  objetivo,
  provider = (process.env.AI_PROVIDER as AiProvider) || "demo"
}: {
  destino: string;
  objetivo: string;
  provider?: AiProvider;
}): Promise<CommunitySuggestion> {
  if (provider === "demo") return demoCommunitySuggestion(destino, objetivo);

  const prompt = buildCommunityPrompt(destino, objetivo);

  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: prompt
      })
    });
    if (!response.ok) throw new Error(`OpenAI retornou erro ${response.status}`);
    const data = await response.json();
    const text = data.output_text || data.output?.[0]?.content?.[0]?.text;
    if (!text) return demoCommunitySuggestion(destino, objetivo);
    return JSON.parse(text) as CommunitySuggestion;
  }

  return demoCommunitySuggestion(destino, objetivo);
}
