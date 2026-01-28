// misera gn reduce mayaregew nw 
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";



export async function GET() {
  try {
   const sales = await prisma.sales.findMany({
      include: {
        SalesOrderLineItems: {
          include: {
            product: {
              select: {
                name: true,
                productId: true,
              },
            },
          },
        },
      customer: true
      },
      orderBy: {
        updatedAt: "desc", 
      },
    });
    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    console.error("Error fetching Orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch Orders." },
      { status: 500 }
    );
  }
}

