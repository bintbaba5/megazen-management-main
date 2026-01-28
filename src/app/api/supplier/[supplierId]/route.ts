import { NextResponse } from "next/server";
import { prisma } from "@/prisma"; // Adjust the import based on your Prisma setup

export async function PUT(req: Request) {
  try {
    const supplierId = parseInt(req.url.split("/").pop() || "", 10); 
    if (isNaN(supplierId)) {
      return NextResponse.json(
        { error: "Invalid supplier ID format." },
        { status: 400 }
      );
    }

    const supplierData = await req.json(); 

   
    if (!supplierData.name || !supplierData.phone) {
      return NextResponse.json(
        { error: "Supplier name and phone are required." },
        { status: 400 }
      );
    }

    const updatedSupplier = await prisma.supplier.update({
      where: { supplierId: supplierId },
      data: supplierData, 
    });

    return NextResponse.json({ supplier: updatedSupplier });
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
    const supplierId = parseInt(req.url.split("/").pop() || "", 10); 

    if (isNaN(supplierId)) {
      return NextResponse.json(
        { error: "Invalid supplier ID format." },
        { status: 400 }
      );
    }

    const supplier = await prisma.supplier.findUnique({
      where: { supplierId: supplierId },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found." },
        { status: 404 }
      );
    }

    await prisma.supplier.delete({
      where: { supplierId: supplierId },
    });

    return NextResponse.json({ message: "Supplier deleted successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}