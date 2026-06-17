import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";
import { groupUpdateSchema } from "../../../../lib/community/schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { joinedAt: "desc" }
        },
        events: { orderBy: { date: "asc" }, include: { _count: { select: { rsvps: true } } } }
      }
    });

    if (!group) return NextResponse.json({ error: "Grupo não encontrado." }, { status: 404 });

    return NextResponse.json({ group });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const input = groupUpdateSchema.parse(body);
    const group = await prisma.group.findUnique({ where: { id } });

    if (!group) return NextResponse.json({ error: "Grupo não encontrado." }, { status: 404 });
    if (group.organizerId !== input.userId) {
      return NextResponse.json({ error: "Apenas o organizador pode editar." }, { status: 403 });
    }

    const updated = await prisma.group.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        category: input.category,
        city: input.city,
        state: input.state,
        country: input.country,
        coverImage: input.coverImage,
        isPrivate: input.isPrivate
      }
    });

    return NextResponse.json({ group: updated });
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
    const group = await prisma.group.findUnique({ where: { id } });

    if (!group) return NextResponse.json({ error: "Grupo não encontrado." }, { status: 404 });
    if (!userId || group.organizerId !== userId) {
      return NextResponse.json({ error: "Apenas o organizador pode deletar." }, { status: 403 });
    }

    await prisma.group.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
