import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { subDays, startOfDay, endOfDay } from "date-fns";
import { parse } from "url";
export async function GET(request: Request) {
  const parsedUrl = parse(request.url, true);
  const query = parsedUrl.query;
  const { startDate, endDate } = query;

  // Default to today if no interval is provided
  const start = startDate
    ? new Date(startDate as string)
    : startOfDay(new Date());
  const end = endDate ? new Date(endDate as string) : endOfDay(new Date());

  try {
    const history = await prisma.audits.findMany({
      where: {
        timestamp: {
          gte: start,
          lte: end,
        },
      },
      include: {
        inventory: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
            location: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
        transfers: {
          include: {
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
        },
        movements: {
          select: {
            inventory: true,
            quantity: true,
            type: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });
    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    console.error("Error fetching inventory report:", error);
    NextResponse.json({ error: "Internal server error" });
  }
}
