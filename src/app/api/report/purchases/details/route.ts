import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { purchaseId } = await request.json();
  try {
    if (purchaseId) {
      const items = await prisma.purchaseOrderLineItems.findMany({
        where: { purchaseOrderId: Number(purchaseId) },
        include: { product: true, purchaseOrder: true },
      });

      return NextResponse.json(items, { status: 200 });
    } else if (!purchaseId) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Method not allowed", error },
      { status: 405 }
    );
  }
}
