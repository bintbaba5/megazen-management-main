import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const transactions = await prisma.creditBalance.findMany({
    include: {
      customer: true,
      supplier: true,
    },
  });
  return NextResponse.json(transactions);
}
export async function POST(req: Request) {
  const { type, customerId, supplierId, balance } = await req.json();

  // Update the credit balance
  const balanceField = type === "Customer" ? "customerId" : "supplierId";
  const balanceId =
    type === "Customer" ? parseInt(customerId) : parseInt(supplierId);

  console.log("balanceField:", balanceField, "balanceId:", balanceId);

  const balances = await prisma.creditBalance.upsert({
    where: { [balanceField]: balanceId },
    update: { balance: { increment: parseFloat(balance) } },
    create: {
      type,
      [balanceField]: balanceId,
      balance: parseFloat(balance),
    },
  });

  return NextResponse.json(balances);
}
