import { NextResponse } from "next/server";
import { generateTripPlan } from "../../../lib/ai/adapters";
import { tripRequestSchema } from "../../../lib/trips/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const form = tripRequestSchema.parse(body);
    const roteiro = await generateTripPlan({ form });

    return NextResponse.json({ roteiro });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";

    return NextResponse.json(
      { error: `Não foi possível gerar o roteiro. ${message}` },
      { status: 500 }
    );
  }
}
