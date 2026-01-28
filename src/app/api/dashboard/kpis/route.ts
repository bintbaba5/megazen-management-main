import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

// Helper function to calculate percentage difference
const calculatePercentageDifference = (current, previous) => {
  if (previous === 0) return "+0.0%"; // Avoid division by zero
  const difference = ((current - previous) / previous) * 100;
  return `${difference >= 0 ? "+" : ""}${difference.toFixed(1)}%`;
};

// Function to get KPIs
export async function GET() {
  const currentDate = new Date();
  const startOfCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const startOfLastMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  const endOfLastMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  );

  try {
    // Fetch current month data
    const currentMonthSales = await prisma.sales.aggregate({
      where: {
        paymentStatus: {
          in: ["Paid", "Partial"],
        },
        orderDate: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    const currentMonthPurchases = await prisma.purchases.aggregate({
      where: {
        paymentStatus: {
          in: ["Paid", "Partial"],
        },
        orderDate: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    const currentMonthSalesOrders = await prisma.sales.count({
      where: {
        orderDate: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
    });

    const currentMonthPurchasesOrders = await prisma.purchases.count({
      where: {
        orderDate: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
    });

    // Fetch last month data
    const lastMonthSales = await prisma.sales.aggregate({
      where: {
        paymentStatus: {
          in: ["Paid", "Partial"],
        },
        orderDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    const lastMonthPurchases = await prisma.purchases.aggregate({
      where: {
        paymentStatus: {
          in: ["Paid", "Partial"],
        },
        orderDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    const lastMonthSalesOrders = await prisma.sales.count({
      where: {
        orderDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    const lastMonthPurchasesOrders = await prisma.purchases.count({
      where: {
        orderDate: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // Calculate percentage differences
    const salesAmountDifference = calculatePercentageDifference(
      currentMonthSales._sum.totalAmount || 0,
      lastMonthSales._sum.totalAmount || 0
    );

    const purchasesAmountDifference = calculatePercentageDifference(
      currentMonthPurchases._sum.totalAmount || 0,
      lastMonthPurchases._sum.totalAmount || 0
    );

    const salesOrdersDifference = calculatePercentageDifference(
      currentMonthSalesOrders,
      lastMonthSalesOrders
    );

    const purchasesOrdersDifference = calculatePercentageDifference(
      currentMonthPurchasesOrders,
      lastMonthPurchasesOrders
    );

    console.log("salesAmountDifference", salesAmountDifference);

    return NextResponse.json(
      {
        totalSalesAmount: currentMonthSales._sum.totalAmount || 0,
        totalPurchasesAmount: currentMonthPurchases._sum.totalAmount || 0,
        totalSalesOrders: currentMonthSalesOrders,
        totalPurchasesOrders: currentMonthPurchasesOrders,
        salesAmountDifference,
        purchasesAmountDifference,
        salesOrdersDifference,
        purchasesOrdersDifference,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
