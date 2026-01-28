import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: NextRequest) {
  // Use req.nextUrl to get the URL and parse the query parameters
  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const paymentStatus = searchParams.get("paymentStatus");
  const customerName = searchParams.get("customerName");

  const start = startDate
    ? new Date(startDate as string)
    : startOfDay(new Date());
  const end = endDate ? new Date(endDate as string) : endOfDay(new Date());

  const skip = (Number(page) - 1) * Number(limit);
  try {
    // Query sales with the necessary filters
    const sales = await prisma.sales.findMany({
      where: {
        orderDate: {
          gte: start,
          lte: end,
        },
        paymentStatus: paymentStatus
          ? paymentStatus != "all"
            ? paymentStatus
            : undefined
          : undefined,
        customer: {
          name: {
            contains: customerName ? customerName : undefined,
            mode: "insensitive",
          },
        },
      },
      skip,
      take: Number(limit),
      include: {
        SalesOrderLineItems: true,
        customer: true,
      },
    });

    // Get total count of the sales for pagination
    const totalCount = await prisma.sales.count({
      where: {
        orderDate: {
          gte: start,
          lte: end,
        },
        paymentStatus: paymentStatus
          ? paymentStatus != "all"
            ? paymentStatus
            : undefined
          : undefined,
        customer: {
          name: {
            contains: customerName ? customerName : undefined,
            mode: "insensitive",
          },
        },
      },
    });

    // Get total amount, total paid (payedAmount), and total credit (totalAmount)
    const totals = await prisma.sales.aggregate({
      _sum: {
        totalAmount: true, // Sum of all totalAmount
        payedAmount: true, // Sum of all payedAmount (total credit)
      },
      where: {
        orderDate: {
          gte: start,
          lte: end,
        },
        paymentStatus: {
          in: ["Paid", "Partial"], // Filter for the statuses you need
        },
      },
    });

    const totalExpense = await prisma.expenses.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    // Return the sales, total count, and the totals for amount, paid, and credit
    return NextResponse.json(
      {
        sales,
        totalCount,
        totalAmount: totals._sum.totalAmount ?? 0,
        totalPaidAmount: totals._sum.payedAmount ?? 0,
        totalCreditAmount: totals._sum.totalAmount - totals._sum.payedAmount, // Total credit as the difference
        totalExpense: totalExpense._sum.amount ?? 0,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Method not allowed", error },
      { status: 405 }
    );
  }
}
