"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  paid: {
    label: "Paid",
    color: "hsl(var(--chart-1))",
    icon: TrendingUp,
  },
  credit: {
    label: "Credit",
    color: "hsl(var(--chart-2))",
    icon: TrendingDown,
  },
} satisfies ChartConfig;

export function Payments({ chartData }: any) {
  const price = new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    // minimumFractionDigits: 2,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Trends</CardTitle>
        <CardDescription>
          Showing total payment trends for the months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => price.format(value)} // Example formatting
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="credit"
              type="natural"
              fill="var(--color-credit)"
              fillOpacity={0.4}
              stroke="var(--color-credit)"
              stackId="a"
            />
            <Area
              dataKey="paid"
              type="natural"
              fill="var(--color-paid)"
              fillOpacity={0.4}
              stroke="var(--color-paid)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
