import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db/prisma";
import { rsvpSchema } from "../../../../../lib/community/schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const rsvps = await prisma.eventRSVP.findMany({
      where: { eventId: id, status: "YES" },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ rsvps });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const input = rsvpSchema.parse(await request.json());
    const rsvp = await prisma.eventRSVP.upsert({
      where: { eventId_userId: { eventId: id, userId: input.userId } },
      create: { eventId: id, userId: input.userId, status: input.status },
      update: { status: input.status }
    });

    return NextResponse.json({ rsvp });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
