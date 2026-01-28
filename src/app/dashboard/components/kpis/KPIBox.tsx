"use client";
import React, { useEffect, useState } from "react";
import {
  BellOff,
  BellRing,
  BriefcaseBusinessIcon,
  ShuffleIcon,
  UsersIcon,
  PlusCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

type KPI = {
  id: number;
  name: string;
  value: string;
  percentage: number;
  icon: React.ElementType;
  description: string;
};

const KPIBox = () => {
  const [KPIs, setKPIs] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard/kpis");
      const data = await response.json();
      setKPIs(data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const price = new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
  });

  const KPIdata = [
    {
      id: 1,
      name: "Total Sales",
      value: price.format(KPIs?.totalSalesAmount || 0),
      percentage: 10,
      icon: BriefcaseBusinessIcon,
      description: `${KPIs?.salesAmountDifference} from last month`,
    },
    {
      id: 2,
      name: "Total Purchases",
      value: price.format(KPIs?.totalPurchasesAmount || 0),
      percentage: 10,
      icon: PlusCircle,
      description: `${KPIs?.purchasesAmountDifference} from last month`,
    },
    {
      id: 5,
      name: "Total Sales Orders",
      value: KPIs?.totalSalesOrders || 0,
      percentage: 10,
      icon: ShuffleIcon,
      description: `${KPIs?.salesOrdersDifference} from last month`,
    },
    {
      id: 6,
      name: "Total Purchases Orders",
      value: KPIs?.totalPurchasesOrders || 0,
      percentage: 10,
      icon: UsersIcon,
      description: `${KPIs?.purchasesOrdersDifference} from last month`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {KPIdata.map((data) => (
        <div key={data.id} className="aspect-auto rounded-xl bg-muted/50">
          <div className="flex items-center justify-between gap-2 rounded-xl p-4">
            <div className="flex flex-col">
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-[100px] mb-2" />{" "}
                  {/* Name Skeleton */}
                  <Skeleton className="h-8 w-[120px] mb-2" />{" "}
                  {/* Value Skeleton */}
                  <Skeleton className="h-3 w-[80px]" />{" "}
                  {/* Description Skeleton */}
                </>
              ) : (
                <>
                  <p className="text-sm font-medium leading-none">
                    {data.name}
                  </p>
                  <p className="text-[30px]">{data.value}</p>
                  <p className="text-sm text-muted-foreground">
                    {data.description}
                  </p>
                </>
              )}
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full">
              {isLoading ? (
                <Skeleton className="h-6 w-6 rounded-full" />
              ) : (
                <data.icon className="h-6 w-6" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIBox;
