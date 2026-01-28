"use client";
import React, { useEffect, useState } from "react";
import { Payments } from "./Payments";
import { SalesBar } from "./SalesBar";
import { PurchaseLine } from "./PurchaseLine";
import { SalesDataTable } from "./SalesTable";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

const Charts = () => {
  const [charts, setCharts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const responsechart = await fetch("/api/dashboard/charts");
      const chartsData = await responsechart.json();
      setCharts(chartsData);
    } catch (error) {
      console.error("Failed to fetch chart data", error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="grid auto-cols-min md:grid-cols-2 gap-4">
      {/* Payments Chart */}
      <div className="rounded-xl bg-muted/50">
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" /> // Placeholder for Payments chart
        ) : (
          <Payments chartData={charts?.payment} />
        )}
      </div>

      {/* Sales Bar Chart */}
      <div className="rounded-xl bg-muted/50">
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" /> // Placeholder for SalesBar chart
        ) : (
          <SalesBar chartData={charts?.salesStatusCount} />
        )}
      </div>

      {/* Purchase Line Chart */}
      <div className="rounded-xl bg-muted/50">
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" /> // Placeholder for PurchaseLine chart
        ) : (
          <PurchaseLine chartData={charts?.purchaseSalesTrend} />
        )}
      </div>

      {/* Sales Data Table */}
      <div className="rounded-xl bg-muted/50">
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" /> // Placeholder for SalesDataTable
        ) : (
          <SalesDataTable data={charts?.salesDataTable} />
        )}
      </div>
    </div>
  );
};

export default Charts;
