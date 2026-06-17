import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { eventCreateSchema } from "../../../lib/community/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cidade = searchParams.get("cidade") || undefined;
    const categoria = searchParams.get("categoria") || undefined;
    const data = searchParams.get("data") || undefined;
    const gratuito = searchParams.get("gratuito");

    const events = await prisma.event.findMany({
      where: {
        status: "SCHEDULED",
        date: data ? { gte: new Date(data) } : { gte: new Date() },
        price: gratuito === "true" ? 0 : undefined,
        group: {
          city: cidade ? { contains: cidade, mode: "insensitive" } : undefined,
          category: categoria ? { equals: categoria, mode: "insensitive" } : undefined
        }
      },
      include: {
        group: true,
        _count: { select: { rsvps: true } }
      },
      orderBy: { date: "asc" }
    });

    return NextResponse.json({ events });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const input = eventCreateSchema.parse(await request.json());
    const group = await prisma.group.findUnique({ where: { id: input.groupId } });

    if (!group) return NextResponse.json({ error: "Grupo não encontrado." }, { status: 404 });
    if (group.organizerId !== input.userId) {
      return NextResponse.json({ error: "Apenas o organizador pode criar eventos." }, { status: 403 });
    }

    const event = await prisma.event.create({
      data: {
        groupId: input.groupId,
        title: input.title,
        description: input.description,
        date: new Date(input.date),
        endDate: input.endDate ? new Date(input.endDate) : null,
        location: input.location || null,
        isOnline: input.isOnline,
        meetLink: input.meetLink || null,
        capacity: input.capacity,
        price: input.price,
        coverImage: input.coverImage || null
      }
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
