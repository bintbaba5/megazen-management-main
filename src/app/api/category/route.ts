import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: {
        name: "asc", 
      },
    });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const body = await req.json();
    // Check if the body is null or not an object
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }
    const { name, description } = body;
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    // Create the product in the database
    const category = await prisma.categories.create({
      data: {
        name,
        description: description || "", // If description is optional
      },
    });

    // Return the created product
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// // export async function PUT(req: Request) {
// //   try {
// //     const product = await req.json();
// //     const updatedProduct = await prisma.products.update({
// //       where: { productId: product.productId },
// //       data: {
// //         name: product.name,
// //         description: product.description,
// //         categoryId: product.categoryId,
// //       },
// //     });
// //     return NextResponse.json({ updatedProduct }, { status: 200 });
// //   } catch (error) {
// //     console.error(error);
// //     return NextResponse.json(
// //       { error: "Something went wrong." },
// //       { status: 500 }
// //     );
// //   }
// // }


// // export async function PUT(req: Request) {
// //   try {
// //     const product = await req.json();
// //     const updatedProduct = await prisma.products.update({
// //       where: { productId: product.id },
// //       data: product,
// //     });
// //     return NextResponse.json({ updatedProduct }, { status: 200 });
// //   } catch (error) {
// //     console.error(error);
// //     return NextResponse.json(
// //       { error: "Something went wrong." },
// //       { status: 500 }
// //     );
// //   }
// // }

// export async function DELETE(req: Request) {
//   try {
//     const productId = req.url.split("/").pop();
//     if (!productId) {
//       return NextResponse.json(
//         { error: "Product ID is missing." },
//         { status: 400 }
//       );
//     }
//     await prisma.products.delete({ where: { productId } });
//     return NextResponse.json({ message: "Product deleted successfully." });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Something went wrong." },
//       { status: 500 }
//     );
//   }
// }