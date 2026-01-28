import { NextResponse } from "next/server";
import { prisma } from "@/prisma"; // Assuming you are using Prisma for DB access

// GET: Retrieve product details
export async function GET(req: Request) {
  try {
    const productId = parseInt(req.url.split("/").pop() || "", 10); // Extract productId from URL

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID format." },
        { status: 400 }
      );
    }

    const product = await prisma.products.findUnique({
      where: { productId: productId },
      include: {
        category: true, // Include related category data if needed
        // You can also include related tables like Inventory, StockMovements etc. if needed
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const productId = parseInt(req.url.split("/").pop() || "", 10); // Extract productId from URL

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID format." },
        { status: 400 }
      );
    }

    const productData = await req.json(); // Get data from the request body

    // Validate product data
    if (!productData.name || !productData.description || !productData.categoryId) {
      return NextResponse.json(
        { error: "Product name, description, and categoryId are required." },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.products.update({
      where: { productId: productId },
      data: productData, // Update with the provided data
    });

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// DELETE: Delete a product
export async function DELETE(req: Request) {
  try {
    const productId = parseInt(req.url.split("/").pop() || "", 10); // Extract productId from URL

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID format." },
        { status: 400 }
      );
    }

    const product = await prisma.products.findUnique({
      where: { productId: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    // Delete the product
    await prisma.products.delete({
      where: { productId: productId },
    });

    return NextResponse.json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
