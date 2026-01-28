import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: {  createdAt: "desc",}, 
    });

    return NextResponse.json({ suppliers }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const { name, phone, email, address } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        phone,
        email: email || null,
        address: address || null,
      },
    });

    return NextResponse.json({ supplier }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create supplier" },
      { status: 500 }
    );
  }
}