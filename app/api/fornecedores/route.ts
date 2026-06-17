import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { supplierSchema } from "../../../lib/suppliers/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination") || undefined;

  try {
    const fornecedores = await prisma.localPartner.findMany({
      where: {
        active: true,
        destination: destination
          ? {
              contains: destination,
              mode: "insensitive"
            }
          : undefined
      },
      orderBy: [{ rating: "desc" }, { name: "asc" }],
      take: 50
    });

    return NextResponse.json({ fornecedores });
  } catch {
    return NextResponse.json({
      fornecedores: [],
      aviso:
        "Banco ainda não conectado. Configure DATABASE_URL e rode npm run prisma:migrate para ativar fornecedores reais."
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supplier = supplierSchema.parse(body);

    const fornecedor = await prisma.localPartner.create({
      data: {
        name: supplier.name,
        destination: supplier.destination,
        category: supplier.category,
        phone: supplier.phone || null,
        email: supplier.email || null,
        website: supplier.website || null,
        rating: supplier.rating || null,
        source: supplier.source || "manual",
        notes: supplier.notes || null
      }
    });

    return NextResponse.json({ fornecedor }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";

    return NextResponse.json(
      { error: `Não foi possível salvar o fornecedor. ${message}` },
      { status: 400 }
    );
  }
}
