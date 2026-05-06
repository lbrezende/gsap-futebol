import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  sectorId: z.string().min(1),
  quantity: z.number().int().min(1).max(8),
  buyer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    cpf: z.string().min(11),
  }),
  cardLast4: z.string().length(4),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const sector = await prisma.sector.findUnique({
      where: { id: data.sectorId },
    });
    if (!sector) {
      return NextResponse.json(
        { ok: false, error: "Setor não encontrado" },
        { status: 404 }
      );
    }
    if (sector.available < data.quantity) {
      return NextResponse.json(
        { ok: false, error: "Indisponível" },
        { status: 409 }
      );
    }

    const order = await prisma.$transaction(async (tx) => {
      await tx.sector.update({
        where: { id: sector.id },
        data: { available: sector.available - data.quantity },
      });
      return tx.order.create({
        data: {
          sectorId: sector.id,
          quantity: data.quantity,
          totalCents: sector.priceCents * data.quantity,
          buyerName: data.buyer.name,
          buyerEmail: data.buyer.email,
          buyerCpf: data.buyer.cpf,
          cardLast4: data.cardLast4,
        },
      });
    });

    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "erro";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
