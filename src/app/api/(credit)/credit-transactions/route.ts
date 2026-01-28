import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const transactions = await prisma.creditTransactions.findMany({
    include: {
      customer: true,
      supplier: true,
      sale: true,
      purchase: true,
    },
  });
  return NextResponse.json(transactions);
}
export async function POST(req: Request) {
  const {
    type,
    customerId,
    supplierId,
    amount,
    description,
    saleId,
    purchaseId,
  } = await req.json();

  // Create the credit transaction
  const transaction = await prisma.creditTransactions.create({
    data: {
      type,
      customerId: type === "Customer" ? parseInt(customerId) : null,
      supplierId: type === "Supplier" ? parseInt(supplierId) : null,
      amount: parseFloat(amount),
      description,
      saleId,
      purchaseId,
    },
  });

  // Update the credit balance
  const balanceField = type === "Customer" ? "customerId" : "supplierId";
  const balanceId =
    type === "Customer" ? parseInt(customerId) : parseInt(supplierId);

  await prisma.creditBalance.upsert({
    where: { [balanceField]: balanceId },
    update: { balance: { increment: parseFloat(amount) } },
    create: {
      type,
      [balanceField]: balanceId,
      balance: parseFloat(amount),
    },
  });

  return NextResponse.json(transaction);
}
