"use client";

import { useState } from "react";

import { ArrowDownRight, ArrowUpRight, Calendar } from "lucide-react";
import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data generator for 30 days
const generateComparisonData = (metric: "sessions" | "pageviews" | "revenue") => {
  const baseVal = metric === "sessions" ? 8000 : metric === "pageviews" ? 18000 : 2500;
  const _variance = metric === "sessions" ? 2000 : metric === "pageviews" ? 5000 : 800;

  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const dateLabel = `May ${day.toString().padStart(2, "0")}`;
    const randomFactor1 = 0.85 + Math.random() * 0.3;
    const randomFactor2 = 0.8 + Math.random() * 0.3;

    // Add a bump mid-month
    const midMonthBump = day > 10 && day < 20 ? 1.25 : 1.0;

    const currentVal = Math.round(baseVal * randomFactor1 * midMonthBump);
    const previousVal = Math.round(baseVal * randomFactor2 * (day > 10 && day < 20 ? 1.05 : 0.95));

    return {
      date: dateLabel,
      current: currentVal,
      previous: previousVal,
    };
  });
};

const chartConfig = {
  current: {
    label: "Current Period",
    color: "var(--primary)",
  },
  previous: {
    label: "Previous Period",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

export function ComparisonChart() {
  const [metric, setMetric] = useState<"sessions" | "pageviews" | "revenue">("sessions");

  const data = generateComparisonData(metric);

  const totalCurrent = data.reduce((acc, curr) => acc + curr.current, 0);
  const totalPrevious = data.reduce((acc, curr) => acc + curr.previous, 0);
  const percentChange = ((totalCurrent - totalPrevious) / totalPrevious) * 100;
  const isPositive = percentChange >= 0;

  const formatValue = (val: number) => {
    if (metric === "revenue") {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
        val,
      );
    }
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(val);
  };

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader className="flex flex-col gap-4 space-y-0 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="font-semibold text-lg tracking-tight">Period Comparison</CardTitle>
          <CardDescription className="text-xs">
            Compare performance of the current 30 days against the prior 30 days.
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:self-center">
          <Tabs value={metric} onValueChange={(val) => setMetric(val as any)} className="w-auto">
            <TabsList className="h-8.5 border border-border/40 bg-background/50 p-1">
              <TabsTrigger value="sessions" className="h-6.5 px-2.5 text-xs">
                Sessions
              </TabsTrigger>
              <TabsTrigger value="pageviews" className="h-6.5 px-2.5 text-xs">
                Pageviews
              </TabsTrigger>
              <TabsTrigger value="revenue" className="h-6.5 px-2.5 text-xs">
                Revenue
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Badge
            variant={isPositive ? "default" : "destructive"}
            className={`flex h-8.5 items-center gap-1 border-none font-semibold text-xs shadow-xs ${
              isPositive
                ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-rose-500/15 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
            }`}
          >
            {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {isPositive ? "+" : ""}
            {percentChange.toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-border/40 bg-muted/15 p-4.5">
          <div>
            <span className="font-normal text-muted-foreground text-xs">Current Period Total</span>
            <div className="mt-0.5 font-semibold text-2xl text-foreground tracking-tight">
              {formatValue(totalCurrent)}
            </div>
            <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="h-2.5 w-2.5" /> May 01 - May 30, 2026
            </span>
          </div>
          <div className="border-border/50 border-l pl-4.5">
            <span className="font-normal text-muted-foreground text-xs">Previous Period Total</span>
            <div className="mt-0.5 font-semibold text-2xl text-muted-foreground tracking-tight">
              {formatValue(totalPrevious)}
            </div>
            <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="h-2.5 w-2.5" /> Apr 01 - Apr 30, 2026
            </span>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  style={{ fontSize: "10px", fill: "var(--muted-foreground)" }}
                  interval={4}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  style={{ fontSize: "10px", fill: "var(--muted-foreground)" }}
                  tickFormatter={formatValue}
                />
                <ChartTooltip
                  cursor={{ stroke: "rgba(var(--foreground), 0.05)", strokeWidth: 1 }}
                  content={
                    <ChartTooltipContent
                      className="border-border/60 bg-popover/90 backdrop-blur-xs"
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  name="Current Period"
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="var(--muted-foreground)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={false}
                  name="Previous Period"
                  opacity={0.6}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
