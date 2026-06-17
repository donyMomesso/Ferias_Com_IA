import { NextResponse } from "next/server";
import { runPlannerAgents } from "../../../lib/agents/planner";
import { tripRequestSchema } from "../../../lib/trips/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const form = tripRequestSchema.parse(body);
    const report = await runPlannerAgents(form);

    return NextResponse.json({
      roteiro: report.plan,
      agentes: {
        achados: report.findings,
        melhoresOpcoes: report.bestOptions,
        contatosFornecedores: report.supplierDrafts,
        proximasAcoes: report.nextAgentActions
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";

    return NextResponse.json(
      { error: `Não foi possível gerar o roteiro. ${message}` },
      { status: 500 }
    );
  }
}
