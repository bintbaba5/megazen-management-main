import { format } from "date-fns";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

// Function to get KPIs and payment chart data
export async function GET() {
  try {
    // ---------------------Payment amount area chart--------------------------------

    // Fetch sales data, grouped by month and status
    const salesData = await prisma.sales.findMany({
      where: {
        paymentStatus: {
          in: ["Paid", "Partial"], // Filter for the statuses you need
        },
        status: "Completed", // Only consider completed sales
      },
      select: {
        orderDate: true,
        status: true,
        paymentStatus: true,
      },
      orderBy: {
        orderDate: "asc", // Order by date ascending
      },
    });

    // Group data by month and status
    const groupedByMonthAndStatus = salesData.reduce((acc, sale) => {
      // Extract year and month as 'YYYY-MM'
      const date = new Date(sale.orderDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // 'YYYY-MM'

      // Initialize month if it does not exist in the accumulator
      if (!acc[monthKey]) {
        acc[monthKey] = { Completed: 0, Partial: 0 };
      }

      // Increment the count for the respective status
      if (sale.paymentStatus === "Paid") {
        acc[monthKey].Completed += 1;
      } else if (sale.paymentStatus === "Partial") {
        acc[monthKey].Partial += 1;
      }

      return acc;
    }, {});

    // Convert the grouped data into the desired format
    const salesStatusCount = Object.entries(groupedByMonthAndStatus).map(
      ([month, statusCount]) => {
        const formattedMonth = format(new Date(month), "MMMM yyyy"); // Format as 'January 2023'
        return {
          month: formattedMonth,
          Completed: statusCount.Completed,
          Partial: statusCount.Partial,
        };
      }
    );

    // ------------------------------------Sales Payment Status----------------------------------------

    // Fetch payment data for the chart (aggregated by month)
    const salesDataForChart = await prisma.sales.findMany({
      where: {
        paymentStatus: {
          in: ["Paid", "Partial"], // Filter for the statuses you need
        },
        status: "Completed", // Only consider completed sales
      },
      select: {
        orderDate: true,
        totalAmount: true,
        payedAmount: true,
        customer: true,
        status: true,
      },
      orderBy: {
        orderDate: "asc", // Order by date ascending
      },
    });

    // Group payment data by month using reduce
    const groupedByMonth = salesDataForChart.reduce((acc, sale) => {
      // Extract year and month as 'YYYY-MM'
      const date = new Date(sale.orderDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // 'YYYY-MM'

      // If the month is not in the accumulator, add it
      if (!acc[monthKey]) {
        acc[monthKey] = { paid: 0, credit: 0 };
      }

      // Add the paid and credit amounts for the current sale to the corresponding month
      acc[monthKey].paid += sale.payedAmount ?? 0;
      acc[monthKey].credit += (sale.totalAmount ?? 0) - (sale.payedAmount ?? 0);

      return acc;
    }, {});

    // Convert the grouped data into the desired chart format
    const chartData = Object.entries(groupedByMonth).map(
      ([month, data]: any) => {
        const formattedMonth = format(new Date(month), "MMMM yyyy"); // Format as 'January 2023'
        return {
          month: formattedMonth,
          paid: data.paid,
          credit: data.credit,
        };
      }
    );

    // -------------------------------Purchases and sales order trends----------------------------------------------

    // Fetch sales data (aggregated by month)
    const salesDataTrend = await prisma.sales.findMany({
      where: {
        paymentStatus: {
          in: ["Paid", "Partial"], // Filter for the statuses you need
        },
        status: "Completed", // Only consider completed sales
      },
      select: {
        orderDate: true,
        totalAmount: true,
      },
      orderBy: {
        orderDate: "asc", // Order by date ascending
      },
    });

    // Fetch purchases data (aggregated by month)
    const purchasesData = await prisma.purchases.findMany({
      where: {
        paymentStatus: {
          in: ["Paid", "Partial"], // Filter for the statuses you need
        },
        status: "Received", // Only consider received purchases
      },
      select: {
        orderDate: true,
        totalAmount: true,
      },
      orderBy: {
        orderDate: "asc", // Order by date ascending
      },
    });

    // Group sales data by month
    const groupedSalesByMonth = salesDataTrend.reduce((acc, sale) => {
      const date = new Date(sale.orderDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // 'YYYY-MM'

      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }

      acc[monthKey] += sale.totalAmount ?? 0;
      return acc;
    }, {});

    // Group purchases data by month
    const groupedPurchasesByMonth = purchasesData.reduce((acc, purchase) => {
      const date = new Date(purchase.orderDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // 'YYYY-MM'

      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }

      acc[monthKey] += purchase.totalAmount ?? 0;
      return acc;
    }, {});

    // Combine sales and purchases data into a single trend data
    const trendData = Object.keys(groupedSalesByMonth).map((monthKey) => {
      const formattedMonth = format(new Date(monthKey), "MMMM yyyy"); // Format as 'January 2023'
      return {
        month: formattedMonth,
        sales: groupedSalesByMonth[monthKey] ?? 0,
        purchases: groupedPurchasesByMonth[monthKey] ?? 0,
      };
    });

    // -------------------------------------------sales order list----------------------------------------------

    // Return both the payment chart data and sales status count
    return NextResponse.json({
      payment: chartData,
      salesStatusCount: salesStatusCount,
      purchaseSalesTrend: trendData,
      salesDataTable: salesDataForChart,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
