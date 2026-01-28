import { NextResponse } from "next/server";
import { prisma } from "@/prisma"; // Adjust the import based on your Prisma setup

export async function PUT(req: Request) {
  try {
    const customerId = parseInt(req.url.split("/").pop() || "", 10);
    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: "Invalid customer ID format." },
        { status: 400 }
      );
    }

    const customerData = await req.json(); 

    if (!customerData.name) {
      return NextResponse.json(
        { error: "Customer name is required." },
        { status: 400 }
      );
    }

    const updatedCustomer = await prisma.customer.update({
      where: { customerId: customerId },
      data: customerData, 
    });

    return NextResponse.json({ customer: updatedCustomer });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const customerId = parseInt(req.url.split("/").pop() || "", 10); 
    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: "Invalid customer ID format." },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { customerId: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 }
      );
    }

    await prisma.customer.delete({
      where: { customerId: customerId },
    });

    return NextResponse.json({ message: "Customer deleted successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}