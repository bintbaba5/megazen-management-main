import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { supplierId, amount } = await req.json();

  const purchaseOrders = await prisma.purchases.findMany({
    where: {
      supplierId: parseInt(supplierId),
      paymentStatus: { in: ["Unpaid", "Partial"] },
    },
    orderBy: { createdAt: "asc" }, // Oldest first
  });

  let remainingPayment = amount;

  for (const order of purchaseOrders) {
    if (remainingPayment <= 0) break;

    const remainingAmount = order.totalAmount - order.paidAmount;
    const amountToAllocate = Math.min(remainingAmount, remainingPayment);

    await prisma.purchases.update({
      where: { purchaseId: order.purchaseId },
      data: {
        paidAmount: { increment: amountToAllocate },
        paymentStatus:
          amountToAllocate === remainingAmount ? "Paid" : "Partial",
      },
    });

    remainingPayment -= amountToAllocate;
  }

  // Update credit balance
  await prisma.creditBalance.upsert({
    where: { supplierId: parseInt(supplierId) },
    update: { balance: { decrement: parseFloat(amount) } },
    create: {
      type: "Supplier",
      supplierId: parseInt(supplierId),
      balance: -parseFloat(amount), // Negative for payments
    },
  });

  // Record credit transaction
  await prisma.creditTransactions.create({
    data: {
      type: "Supplier",
      supplierId: parseInt(supplierId),
      amount: -parseFloat(amount), // Negative for payments
      description: "Payment against credit",
    },
  });

  return NextResponse.json({ message: "Credit allocated successfully" });
}
