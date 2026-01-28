import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const period = searchParams.get("period");

    const filters: any = {};

    if (startDate && endDate) {
      filters.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (period) {
      const now = new Date();
      switch (period) {
        case "daily":
          filters.timestamp = {
            gte: new Date(now.setHours(0, 0, 0, 0)),
            lte: new Date(now.setHours(23, 59, 59, 999)),
          };
          break;
        case "weekly":
          const startOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay())
          );
          startOfWeek.setHours(0, 0, 0, 0);
          const endOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay() + 6)
          );
          endOfWeek.setHours(23, 59, 59, 999);
          filters.timestamp = {
            gte: startOfWeek,
            lte: endOfWeek,
          };
          break;
        case "monthly":
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endOfMonth.setHours(23, 59, 59, 999);
          filters.timestamp = {
            gte: startOfMonth,
            lte: endOfMonth,
          };
          break;
        case "yearly":
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          const endOfYear = new Date(now.getFullYear(), 11, 31);
          endOfYear.setHours(23, 59, 59, 999);
          filters.timestamp = {
            gte: startOfYear,
            lte: endOfYear,
          };
          break;
        default:
          break;
      }
    }

    const stockTransfers = await prisma.stockTransfers.findMany({
      where: filters,
      include: {
        product: true,
        sourceInventory: {
          include: {
            location: true,
          },
        },
        destinationInventory: {
          include: {
            location: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return NextResponse.json({ success: true, data: stockTransfers });
  } catch (error) {
    console.error("Error fetching stock transfers:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stock transfers." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  try {
    const { productId, quantity, sourceLocationId, destinationLocationId } =
      await req.json();

    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated." },
        { status: 401 }
      );
    }

    // Validate request payload
    if (
      !productId ||
      !quantity ||
      !sourceLocationId ||
      !destinationLocationId
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (sourceLocationId === destinationLocationId) {
      return NextResponse.json(
        { error: "Source and destination locations cannot be the same." },
        { status: 400 }
      );
    }

    // Check source inventory stock
    const sourceInventory = await prisma.inventory.findFirst({
      where: {
        productId,
        locationId: sourceLocationId,
      },
    });

    if (!sourceInventory) {
      return NextResponse.json(
        { error: "Product not found in the source location." },
        { status: 400 }
      );
    }

    if (!sourceInventory || sourceInventory.quantity < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock in the source location." },
        { status: 400 }
      );
    }

    // Find or create destination inventory
    const destinationInventory = await prisma.inventory.upsert({
      where: {
        productId_locationId: {
          productId,
          locationId: destinationLocationId,
        },
      },
      update: {},
      create: {
        productId,
        locationId: destinationLocationId,
        quantity: 0,
      },
    });

    // Create stock transfer record
    const transfer = await prisma.stockTransfers.create({
      data: {
        productId: parseInt(productId),
        quantity: parseInt(quantity),
        sourceInventoryId: sourceInventory.inventoryId,
        destinationInventoryId: destinationInventory.inventoryId,
      },
    });

    // Update source inventory
    await prisma.inventory.update({
      where: { inventoryId: sourceInventory.inventoryId },
      data: {
        quantity: sourceInventory.quantity - quantity,
      },
    });

    // Update destination inventory
    await prisma.inventory.update({
      where: { inventoryId: destinationInventory.inventoryId },
      data: {
        quantity: destinationInventory.quantity + quantity,
      },
    });

    await prisma.audits.create({
      data: {
        action: "Transfer",
        timestamp: new Date(),
        user: {
          connect: {
            id: userId,
          },
        },
        inventory: {
          connect: {
            inventoryId: sourceInventory.inventoryId,
          },
        },
        transfers: {
          connect: {
            transferId: transfer.transferId,
          },
        },
        oldQuantity: sourceInventory.quantity,
        newQuantity: sourceInventory.quantity - quantity,
      },
    });

    return NextResponse.json(
      { message: "Stock transfer successful." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling stock transfer:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  try {
    const { transferId, quantity } = await req.json();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated." },
        { status: 401 }
      );
    }
    if (!transferId) {
      return NextResponse.json(
        { error: "Transfer ID is required." },
        { status: 400 }
      );
    }

    const transfer = await prisma.stockTransfers.findUnique({
      where: { transferId },
    });
    if (!transfer) {
      return NextResponse.json(
        { error: "Transfer not found." },
        { status: 404 }
      );
    }

    const sourceInventory = await prisma.inventory.findFirst({
      where: { inventoryId: transfer.sourceInventoryId },
    });
    if (!sourceInventory) {
      return NextResponse.json(
        { error: "Source inventory not found." },
        { status: 404 }
      );
    }

    const destinationInventory = await prisma.inventory.findFirst({
      where: { inventoryId: transfer.destinationInventoryId },
    });
    if (!destinationInventory) {
      return NextResponse.json(
        { error: "Destination inventory not found." },
        { status: 404 }
      );
    }

    // Calculate the difference between the old and new quantity
    const quantityDifference = quantity - transfer.quantity;

    // Update source inventory (adjust by the difference)
    await prisma.inventory.update({
      where: { inventoryId: sourceInventory.inventoryId },
      data: {
        quantity: sourceInventory.quantity - quantityDifference,
      },
    });

    // Update destination inventory (adjust by the difference)
    await prisma.inventory.update({
      where: { inventoryId: destinationInventory.inventoryId },
      data: {
        quantity: destinationInventory.quantity + quantityDifference,
      },
    });

    // Update the transfer record with the new quantity
    await prisma.stockTransfers.update({
      where: { transferId },
      data: { quantity },
    });

    return NextResponse.json(
      { message: "Transfer updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling stock transfer:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  try {
    const { transferId } = await req.json();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated." },
        { status: 401 }
      );
    }
    if (!transferId) {
      return NextResponse.json(
        { error: "Transfer ID is required." },
        { status: 400 }
      );
    }

    // Fetch the stock transfer record
    const transfer = await prisma.stockTransfers.findUnique({
      where: { transferId },
    });
    if (!transfer) {
      return NextResponse.json(
        { error: "Transfer not found." },
        { status: 404 }
      );
    }

    // Fetch the source and destination inventories
    const sourceInventory = await prisma.inventory.findFirst({
      where: { inventoryId: transfer.sourceInventoryId },
    });
    if (!sourceInventory) {
      return NextResponse.json(
        { error: "Source inventory not found." },
        { status: 404 }
      );
    }

    const destinationInventory = await prisma.inventory.findFirst({
      where: { inventoryId: transfer.destinationInventoryId },
    });
    if (!destinationInventory) {
      return NextResponse.json(
        { error: "Destination inventory not found." },
        { status: 404 }
      );
    }

    // Revert the source inventory by adding back the quantity
    await prisma.inventory.update({
      where: { inventoryId: sourceInventory.inventoryId },
      data: {
        quantity: sourceInventory.quantity + transfer.quantity,
      },
    });

    // Revert the destination inventory by subtracting the quantity
    await prisma.inventory.update({
      where: { inventoryId: destinationInventory.inventoryId },
      data: {
        quantity: destinationInventory.quantity - transfer.quantity,
      },
    });

    // Delete the stock transfer record
    await prisma.stockTransfers.delete({
      where: { transferId },
    });

    return NextResponse.json(
      { message: "Transfer deleted and inventory reverted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling stock transfer deletion:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
