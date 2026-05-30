"use client";

import { ArrowDownRight, ArrowUpRight, BarChart3, Clock } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// 30 days of daily API usage metrics
const generateApiMetrics = () => {
  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const baseRequests = 35000;
    const rand1 = 0.85 + Math.random() * 0.3;
    const rand2 = 0.8 + Math.random() * 0.4;

    const successful = Math.round(baseRequests * rand1);
    const failed = Math.round(baseRequests * 0.012 * rand2); // ~1.2% errors

    return {
      date: `May ${day.toString().padStart(2, "0")}`,
      success: successful,
      failed: failed,
      p50: Math.round(110 + Math.random() * 20),
      p95: Math.round(180 + Math.random() * 50),
      p99: Math.round(310 + Math.random() * 120),
    };
  });
};

const endpointsUsage = [
  { path: "/api/v3/users", method: "GET", requests: 485230, errorRate: "0.2%", latency: "92ms", status: "Healthy" },
  {
    path: "/api/v3/orders/create",
    method: "POST",
    requests: 312890,
    errorRate: "1.4%",
    latency: "240ms",
    status: "Healthy",
  },
  { path: "/api/v3/products", method: "GET", requests: 245100, errorRate: "0.5%", latency: "115ms", status: "Healthy" },
  {
    path: "/api/v3/analytics/track",
    method: "POST",
    requests: 124500,
    errorRate: "0.1%",
    latency: "74ms",
    status: "Healthy",
  },
  {
    path: "/api/v3/users/update",
    status: "Healthy",
    method: "PUT",
    requests: 58200,
    errorRate: "2.1%",
    latency: "185ms",
  },
  {
    path: "/api/v3/inventory",
    method: "PATCH",
    requests: 12400,
    errorRate: "3.4%",
    latency: "310ms",
    status: "Warning",
  },
  {
    path: "/api/v3/keys/revoke",
    method: "DELETE",
    requests: 4200,
    errorRate: "0.0%",
    latency: "142ms",
    status: "Healthy",
  },
];

const volumeConfig = {
  success: { label: "Successful", color: "var(--chart-1)" },
  failed: { label: "Failed Requests", color: "var(--destructive)" },
} satisfies ChartConfig;

const latencyConfig = {
  p50: { label: "p50 Median", color: "var(--chart-1)" },
  p95: { label: "p95 Percentile", color: "var(--chart-2)" },
  p99: { label: "p99 Tail Latency", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function ApiMetricsDashboard() {
  const data = generateApiMetrics();

  return (
    <div className="flex w-full flex-col gap-4">
      {/* KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <span className="font-normal text-muted-foreground text-xs">Total API Volume</span>
            <Badge className="border-none bg-emerald-500/10 font-semibold text-[10px] text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <ArrowUpRight className="mr-0.5 h-3 w-3" /> +12.4%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-2xl tracking-tight">1.24M</div>
            <span className="text-[10px] text-muted-foreground">Successful hits (last 30d)</span>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <span className="font-normal text-muted-foreground text-xs">Average Error Rate</span>
            <Badge className="border-none bg-emerald-500/10 font-semibold text-[10px] text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <ArrowDownRight className="mr-0.5 h-3 w-3" /> -0.3%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-2xl text-foreground tracking-tight">0.82%</div>
            <span className="text-[10px] text-muted-foreground">Threshold warning at 3.0%</span>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <span className="font-normal text-muted-foreground text-xs">p95 Average Latency</span>
            <Badge className="border-none bg-emerald-500/10 font-semibold text-[10px] text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <ArrowDownRight className="mr-0.5 h-3 w-3" /> -8ms
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-2xl tracking-tight">142ms</div>
            <span className="text-[10px] text-muted-foreground">Service target: &lt; 250ms</span>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
            <span className="font-normal text-muted-foreground text-xs">Rate Limit Overloads</span>
            <Badge className="border-none bg-rose-500/10 font-semibold text-[10px] text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
              <ArrowUpRight className="mr-0.5 h-3 w-3" /> +4
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="font-semibold text-2xl text-rose-600 tracking-tight dark:text-rose-400">23 Events</div>
            <span className="text-[10px] text-muted-foreground">HTTP 429 status code returns</span>
          </CardContent>
        </Card>
      </div>

      {/* Volume & Latency Charts side-by-side */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* API Volume (Success/Failed) */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 font-semibold text-sm tracking-tight">
              <BarChart3 className="h-4 w-4 text-primary" />
              API Request Volume
            </CardTitle>
            <CardDescription className="text-[11px]">Daily volume of outbound schema actions handled.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[210px] w-full">
              <ChartContainer config={volumeConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      style={{ fontSize: "9px", fill: "var(--muted-foreground)" }}
                      interval={6}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      style={{ fontSize: "9px", fill: "var(--muted-foreground)" }}
                      tickFormatter={(val) => `${val / 1000}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="success"
                      stroke="var(--chart-1)"
                      fill="var(--chart-1)"
                      fillOpacity={0.08}
                      strokeWidth={2}
                      name="Successful"
                    />
                    <Area
                      type="monotone"
                      dataKey="failed"
                      stroke="var(--destructive)"
                      fill="var(--destructive)"
                      fillOpacity={0.05}
                      strokeWidth={1}
                      name="Failed"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* API Latency percentiles */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 font-semibold text-sm tracking-tight">
              <Clock className="h-4 w-4 text-primary" />
              Latency Percentiles (ms)
            </CardTitle>
            <CardDescription className="text-[11px]">
              Tracks standard p50 median, alongside p95 and p99 tails.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[210px] w-full">
              <ChartContainer config={latencyConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      style={{ fontSize: "9px", fill: "var(--muted-foreground)" }}
                      interval={6}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      style={{ fontSize: "9px", fill: "var(--muted-foreground)" }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="p50"
                      stroke="var(--chart-1)"
                      strokeWidth={1.5}
                      dot={false}
                      name="p50 Median"
                    />
                    <Line
                      type="monotone"
                      dataKey="p95"
                      stroke="var(--chart-2)"
                      strokeWidth={2}
                      dot={false}
                      name="p95 Tail"
                    />
                    <Line
                      type="monotone"
                      dataKey="p99"
                      stroke="var(--chart-3)"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      dot={false}
                      name="p99 Anomaly"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Endpoint Table */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
        <CardHeader>
          <CardTitle className="font-semibold text-sm tracking-tight">Usage Breakdown by API Endpoint</CardTitle>
          <CardDescription className="text-[11px]">Throughput split across specific V3 paths.</CardDescription>
        </CardHeader>
        <CardContent className="border-border/40 border-t p-0">
          <div className="overflow-x-auto text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-border/40 border-b bg-muted/20 text-left text-muted-foreground">
                  <th className="p-3 font-semibold">Endpoint Route</th>
                  <th className="w-24 p-3 text-center font-semibold">Method</th>
                  <th className="p-3 text-right font-semibold">Volume Hit</th>
                  <th className="p-3 text-right font-semibold">Error Rate</th>
                  <th className="p-3 text-right font-semibold">Avg Latency</th>
                  <th className="w-28 p-3 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {endpointsUsage.map((item, i) => (
                  <tr key={i} className="text-foreground transition-colors hover:bg-muted/10">
                    <td className="p-3 font-mono text-[11px]">{item.path}</td>
                    <td className="p-3 text-center">
                      <Badge
                        className={`h-5 border-none font-bold text-[9px] uppercase ${
                          item.method === "GET"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : item.method === "POST"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : item.method === "PUT"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : item.method === "PATCH"
                                  ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {item.method}
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-medium">{item.requests.toLocaleString()}</td>
                    <td className="p-3 text-right text-muted-foreground">{item.errorRate}</td>
                    <td className="p-3 text-right font-mono text-muted-foreground">{item.latency}</td>
                    <td className="p-3 text-center">
                      <Badge
                        variant="outline"
                        className={`h-4.5 px-2 font-semibold text-[9px] ${
                          item.status === "Healthy"
                            ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                            : "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
