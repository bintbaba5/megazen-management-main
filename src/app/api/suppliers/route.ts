import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const suppliers = await prisma.supplier.findMany({});

  return NextResponse.json({ suppliers });
}
