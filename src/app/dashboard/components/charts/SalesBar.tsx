"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// const chartData = [
//   { month: "January", Completed: 186, Partial: 80 },
//   { month: "February", Completed: 305, Partial: 200 },
//   { month: "March", Completed: 237, Partial: 120 },
//   { month: "April", Completed: 73, Partial: 190 },
//   { month: "May", Completed: 209, Partial: 130 },
//   { month: "June", Completed: 214, Partial: 140 },
// ];

const chartConfig = {
  desktop: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Partial",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function SalesBar({ chartData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Count by month</CardTitle>
        <CardDescription>No. of sales by sales completion</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="Completed" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="Partial" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
