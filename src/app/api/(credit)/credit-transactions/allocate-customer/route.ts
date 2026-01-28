import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { customerId, amount } = await req.json();

  const salesOrders = await prisma.sales.findMany({
    where: {
      customerId: parseInt(customerId),
      paymentStatus: { in: ["Unpaid", "Partial"] },
    },
    orderBy: { createdAt: "asc" }, // Oldest first
  });

  let remainingPayment = amount;

  for (const order of salesOrders) {
    if (remainingPayment <= 0) break;

    const remainingAmount = order.totalAmount - order.payedAmount;
    const amountToAllocate = Math.min(remainingAmount, remainingPayment);

    await prisma.sales.update({
      where: { saleId: order.saleId },
      data: {
        payedAmount: { increment: amountToAllocate },
        paymentStatus:
          amountToAllocate === remainingAmount ? "Paid" : "Partial",
      },
    });

    remainingPayment -= amountToAllocate;
  }

  // Update credit balance
  await prisma.creditBalance.upsert({
    where: { customerId: parseInt(customerId) },
    update: { balance: { decrement: parseFloat(amount) } },
    create: {
      type: "Supplier",
      customerId: parseInt(customerId),
      balance: -parseFloat(amount), // Negative for payments
    },
  });

  // await prisma.creditBalance.upsert({
  //   where: { customerId },
  //   update: { balance: { decrement: parseFloat(amount) } },
  //   create: {
  //     type: "Customer",
  //     customerId,
  //     balance: parseFloat(amount),
  //   },
  // });

  // Record credit transaction
  await prisma.creditTransactions.create({
    data: {
      customerId: parseInt(customerId),
      amount: -parseFloat(amount), // Negative for payments
      description: "Payment against credit",
      type: "Customer",
    },
  });

  return NextResponse.json({ message: "Credit allocated successfully" });
}
