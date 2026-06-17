import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db/prisma";
import { groupJoinSchema } from "../../../../../lib/community/schema";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const input = groupJoinSchema.parse(await request.json());
    const member = await prisma.groupMember.upsert({
      where: { groupId_userId: { groupId: id, userId: input.userId } },
      create: { groupId: id, userId: input.userId, role: "MEMBER" },
      update: {}
    });

    return NextResponse.json({ member });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const input = groupJoinSchema.parse(await request.json());
    await prisma.groupMember.delete({
      where: { groupId_userId: { groupId: id, userId: input.userId } }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
