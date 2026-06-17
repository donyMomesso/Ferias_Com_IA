import { NextResponse } from "next/server";
import { generateCommunitySuggestions } from "../../../../lib/ai/adapters";
import { communitySuggestionSchema } from "../../../../lib/community/schema";

export async function POST(request: Request) {
  try {
    const input = communitySuggestionSchema.parse(await request.json());
    const sugestoes = await generateCommunitySuggestions({
      destino: input.destino,
      objetivo: input.objetivo
    });

    return NextResponse.json({ sugestoes });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
