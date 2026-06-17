import { NextResponse } from "next/server";
import { runPlannerAgents } from "../../../lib/agents/planner";
import { tripRequestSchema } from "../../../lib/trips/schema";
import { generateBookingLinks } from "../../../lib/sources/bookingLinks";
import { fetchPOIs } from "../../../lib/sources/amadeusSkill";

async function geocode(destination: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(destination)}`,
      { headers: { "User-Agent": "FeriasComIA/0.1 contato@feriascomia.local" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : null;
    if (!first?.lat) return null;
    return { lat: Number(first.lat), lng: Number(first.lon) };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const form = tripRequestSchema.parse(body);

    const [report, coords] = await Promise.all([
      runPlannerAgents(form),
      geocode(form.destino)
    ]);

    const [bookingLinks, pois] = await Promise.all([
      Promise.resolve(
        generateBookingLinks({
          destination: form.destino,
          datas: form.datas,
          pessoas: form.pessoas
        })
      ),
      coords ? fetchPOIs(coords.lat, coords.lng) : Promise.resolve([])
    ]);

    return NextResponse.json({
      roteiro: report.plan,
      agentes: {
        achados: report.findings,
        melhoresOpcoes: report.bestOptions,
        contatosFornecedores: report.supplierDrafts,
        proximasAcoes: report.nextAgentActions,
        skillsUsadas: report.skillsUsed
      },
      coords,
      bookingLinks,
      pois
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json(
      { error: `Não foi possível gerar o roteiro. ${message}` },
      { status: 500 }
    );
  }
}
