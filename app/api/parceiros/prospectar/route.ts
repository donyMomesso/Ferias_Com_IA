import { NextResponse } from "next/server";
import { z } from "zod";
import { prospectPartners } from "../../../../lib/partners/prospectSkill";

const requestSchema = z.object({
  destination: z.string().trim().min(2),
  objective: z.string().trim().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = requestSchema.parse(body);
    const parceiros = await prospectPartners(input);

    return NextResponse.json({
      parceiros,
      aviso:
        process.env.SEARCH_PROVIDER === "serper"
          ? "Busca real ativa. Valide os parceiros antes de recomendar."
          : "Modo demo ativo. Configure SEARCH_PROVIDER=serper e SERPER_API_KEY para buscar candidatos reais."
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";

    return NextResponse.json(
      { error: `Não foi possível prospectar parceiros. ${message}` },
      { status: 400 }
    );
  }
}
