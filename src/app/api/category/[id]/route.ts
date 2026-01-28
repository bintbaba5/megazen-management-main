import { NextResponse } from "next/server";
import { prisma } from "@/prisma"; // Assuming you are using Prisma for DB access

// GET: Retrieve category details
export async function GET(req: Request) {
  try {
    const id = parseInt(req.url.split("/").pop() || "", 10); // Extract id from URL

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid category id format." },
        { status: 400 }
      );
    }

    const category = await prisma.categories.findUnique({
      where: { id: id },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const id = parseInt(req.url.split("/").pop() || "", 10); // Extract id from URL

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid Category ID format." },
        { status: 400 }
      );
    }

    const categoryData = await req.json(); // Get data from the request body

    // Validate category data
    if (!categoryData.name || !categoryData.description) {
      return NextResponse.json(
        { error: "Category name and Description are required." },
        { status: 400 }
      );
    }

    const updatedcategory = await prisma.categories.update({
      where: { id: id },
      data: categoryData, // Update with the provided data
    });

    return NextResponse.json({ category: updatedcategory });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// DELETE: Delete a category
export async function DELETE(req: Request) {
  try {
    const id = parseInt(req.url.split("/").pop() || "", 10); // Extract id from URL

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid category ID format." },
        { status: 400 }
      );
    }

    const category = await prisma.categories.findUnique({
      where: { id: id },
    });

    if (!category) {
      return NextResponse.json(
        { error: "category not found." },
        { status: 404 }
      );
    }

    // Delete the category
    await prisma.categories.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "category deleted successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
