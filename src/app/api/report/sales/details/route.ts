import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { saleId } = await request.json();

  try {
    console.log(saleId);
    if (saleId) {
      const items = await prisma.salesOrderLineItems.findMany({
        where: { salesOrderId: Number(saleId) },
        include: { product: true, location: true },
      });

      return NextResponse.json(items, { status: 200 });
    } else {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Method not allowed", error },
      { status: 405 }
    );
  }
}
