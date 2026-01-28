import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const inventories = await prisma.inventory.findMany({
    include: {
      product: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      product: {
        name: "asc", 
      },
    },
  });
  for (const inventory of inventories) {
    const product = inventory.product;
    if (product) {
      const category = product.category;
      if (category) {
        inventory.product.category = category;
        console.log(category);
      }
    }
  }
  return NextResponse.json({ inventories });
}

export async function POST(request: Request) {
  const body = await request.json();
  const productId = body.productId; // Example product ID

  const inventoryData = body.inventory;

  const createInventoryRecords = inventoryData.map((item) => ({
    productId: productId,
    locationId: item.locationId,
    quantity: item.quantity,
  }));

  try {
    const result = await prisma.inventory.createMany({
      data: createInventoryRecords, // Insert inventory data
    });
    console.log("Inventory created successfully:", result);
  } catch (error) {
    console.error("Error creating inventory:", error);
  }

  return NextResponse.json({ message: "Inventory created successfully" });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const inventory = await prisma.inventory.update({
    where: {
      inventoryId: body.inventoryId,
    },
    data: {
      product: {
        connect: {
          productId: body.product.productId,
        },
      },
      location: body.location,
      quantity: body.quantity,
    },
  });
  return NextResponse.json(inventory);
}
