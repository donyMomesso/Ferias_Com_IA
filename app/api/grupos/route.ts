import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { groupCreateSchema } from "../../../lib/community/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cidade = searchParams.get("cidade") || undefined;
    const categoria = searchParams.get("categoria") || undefined;
    const busca = searchParams.get("busca") || undefined;

    const groups = await prisma.group.findMany({
      where: {
        city: cidade ? { contains: cidade, mode: "insensitive" } : undefined,
        category: categoria ? { equals: categoria, mode: "insensitive" } : undefined,
        OR: busca
          ? [
              { name: { contains: busca, mode: "insensitive" } },
              { description: { contains: busca, mode: "insensitive" } }
            ]
          : undefined
      },
      include: {
        _count: { select: { members: true } },
        events: {
          where: { date: { gte: new Date() }, status: "SCHEDULED" },
          orderBy: { date: "asc" },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ groups });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = groupCreateSchema.parse(body);

    const group = await prisma.group.create({
      data: {
        name: input.name,
        description: input.description,
        category: input.category,
        city: input.city,
        state: input.state || null,
        country: input.country,
        coverImage: input.coverImage || null,
        isPrivate: input.isPrivate,
        organizerId: input.organizerId,
        members: {
          create: {
            userId: input.organizerId,
            role: "ORGANIZER"
          }
        }
      }
    });

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
