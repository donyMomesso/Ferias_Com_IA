import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";
import { eventUpdateSchema } from "../../../../lib/community/schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        group: { include: { organizer: { select: { id: true, name: true, email: true } } } },
        rsvps: { include: { user: { select: { id: true, name: true, email: true } } } }
      }
    });

    if (!event) return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
    return NextResponse.json({ event });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const input = eventUpdateSchema.parse(await request.json());
    const event = await prisma.event.findUnique({ where: { id }, include: { group: true } });

    if (!event) return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
    if (event.group.organizerId !== input.userId) {
      return NextResponse.json({ error: "Apenas o organizador pode editar." }, { status: 403 });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        date: input.date ? new Date(input.date) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        location: input.location,
        isOnline: input.isOnline,
        meetLink: input.meetLink,
        capacity: input.capacity,
        price: input.price,
        coverImage: input.coverImage
      }
    });

    return NextResponse.json({ event: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const event = await prisma.event.findUnique({ where: { id }, include: { group: true } });

    if (!event) return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
    if (!userId || event.group.organizerId !== userId) {
      return NextResponse.json({ error: "Apenas o organizador pode cancelar." }, { status: 403 });
    }

    const cancelled = await prisma.event.update({ where: { id }, data: { status: "CANCELLED" } });
    return NextResponse.json({ event: cancelled });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
