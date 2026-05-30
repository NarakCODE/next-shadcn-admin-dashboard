"use client";

import { AlertCircle, CheckCircle2, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

// 45 days of data: 30 days historical, 15 days forecast
const generatePredictiveData = () => {
  const data = [];
  const baseVal = 9500;

  for (let i = 0; i < 45; i++) {
    const day = i - 30; // -30 to 14
    let dateLabel = "";
    if (day < 0) {
      dateLabel = `May ${Math.abs(day).toString().padStart(2, "0")} (Hist)`;
    } else if (day === 0) {
      dateLabel = `Today`;
    } else {
      dateLabel = `Jun ${day.toString().padStart(2, "0")} (Fcst)`;
    }

    const randomFactor = 0.88 + Math.random() * 0.24;
    // upward trend
    const trend = 1 + i * 0.006;

    let historicalVal: number | null = null;
    let forecastVal: number | null = null;
    let upperConfidence: number | null = null;
    let lowerConfidence: number | null = null;

    if (i <= 30) {
      historicalVal = Math.round(baseVal * randomFactor * trend);
      // Introduce an anomaly on day 15 (May 15)
      if (i === 15) {
        historicalVal = Math.round(historicalVal * 1.55); // high spike
      }
      if (i === 24) {
        historicalVal = Math.round(historicalVal * 0.52); // sharp drop
      }
      forecastVal = historicalVal;
    } else {
      // Forecast points
      const fcstTrend = 1 + i * 0.007;
      forecastVal = Math.round(baseVal * (0.95 + Math.sin(i * 0.4) * 0.08) * fcstTrend);

      // Confidence intervals broaden as time increases
      const variance = (i - 30) * 160;
      upperConfidence = forecastVal + variance + 400;
      lowerConfidence = Math.max(2000, forecastVal - variance - 400);
    }

    data.push({
      index: i,
      date: dateLabel,
      historical: historicalVal,
      forecast: forecastVal,
      upper: upperConfidence || forecastVal,
      lower: lowerConfidence || forecastVal,
    });
  }
  return data;
};

const anomalies = [
  {
    id: 1,
    date: "May 15, 2026",
    metric: "Unique Visitors",
    type: "Spike Detected",
    severity: "info",
    description: "Traffic surged by 55% above baseline due to campaign promotion launch.",
  },
  {
    id: 2,
    date: "May 24, 2026",
    metric: "API Request Rate",
    type: "Anomaly Drop",
    severity: "warning",
    description: "Brief API throughput dip of 48% due to minor server upgrade down-time.",
  },
];

const chartConfig = {
  historical: {
    label: "Historical Traffic",
    color: "var(--primary)",
  },
  forecast: {
    label: "AI Predicted",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function PredictiveAnalytics() {
  const data = generatePredictiveData();

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 font-semibold text-lg tracking-tight">
              <Sparkles className="h-4.5 w-4.5 animate-pulse text-indigo-500" />
              Predictive Traffic Analytics & Forecasts
            </CardTitle>
            <CardDescription className="text-xs">
              AI-driven session forecast models with confidence boundaries and real-time anomaly analysis.
            </CardDescription>
          </div>
          <Badge className="flex items-center gap-1 border-none bg-indigo-500/10 font-semibold text-indigo-600 text-xs dark:bg-indigo-500/15 dark:text-indigo-400">
            <CheckCircle2 className="h-3 w-3" /> Predictive Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* KPI Strip */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-1 rounded-lg border border-border/40 bg-muted/15 p-4">
            <span className="font-normal text-muted-foreground text-xs">Projected Monthly Sessions</span>
            <div className="mt-0.5 font-semibold text-2xl text-foreground tracking-tight">386.4K</div>
            <span className="mt-0.5 flex items-center gap-0.5 font-medium text-[10px] text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" /> +14.2% Growth Predicted
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-lg border border-border/40 bg-muted/15 p-4">
            <span className="font-normal text-muted-foreground text-xs">Forecast Confidence Level</span>
            <div className="mt-0.5 font-semibold text-2xl text-foreground tracking-tight">94.8%</div>
            <span className="mt-0.5 text-[10px] text-muted-foreground">Based on 90-day learning baseline</span>
          </div>

          <div className="flex flex-col gap-1 rounded-lg border border-border/40 bg-muted/15 p-4">
            <span className="font-normal text-muted-foreground text-xs">Detected Anomalies (30d)</span>
            <div className="mt-0.5 font-semibold text-2xl text-amber-600 tracking-tight dark:text-amber-400">
              2 Events
            </div>
            <span className="mt-0.5 text-[10px] text-muted-foreground">1 System Incident, 1 Campaign Spike</span>
          </div>
        </div>

        {/* Forecast Chart */}
        <div className="mb-6 h-[300px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  style={{ fontSize: "9px", fill: "var(--muted-foreground)" }}
                  interval={5}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  style={{ fontSize: "9px", fill: "var(--muted-foreground)" }}
                  tickFormatter={(val) => new Intl.NumberFormat("en-US", { notation: "compact" }).format(val)}
                />

                {/* Reference line marking Today */}
                <ReferenceLine
                  x="Today"
                  stroke="var(--destructive)"
                  strokeDasharray="3 3"
                  label={{
                    value: "TODAY",
                    position: "insideTopLeft",
                    fill: "var(--destructive)",
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                />

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      const data = payload[0].payload;
                      const isFcst = data.index > 30;
                      return (
                        <div className="space-y-1 rounded-lg border border-border/60 bg-popover/95 p-3 text-xs shadow-md backdrop-blur-xs">
                          <p className="font-semibold text-foreground">{data.date}</p>
                          {isFcst ? (
                            <>
                              <p className="font-medium text-indigo-500">Forecast: {data.forecast?.toLocaleString()}</p>
                              <p className="text-[10px] text-muted-foreground">
                                Range: {data.lower?.toLocaleString()} - {data.upper?.toLocaleString()}
                              </p>
                            </>
                          ) : (
                            <p className="font-medium text-primary">Actual: {data.historical?.toLocaleString()}</p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Confidence Boundary Area */}
                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="none"
                  fill="var(--chart-2)"
                  fillOpacity={0.06}
                  name="Confidence Upper"
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stroke="none"
                  fill="var(--chart-2)"
                  fillOpacity={0.06}
                  name="Confidence Lower"
                />

                {/* Historical Area */}
                <Area
                  type="monotone"
                  dataKey="historical"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  fill="url(#colorHist)"
                  name="Historical Data"
                  connectNulls
                />

                {/* Forecast Area */}
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="var(--chart-2)"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  fill="url(#colorFcst)"
                  name="AI Forecast"
                  connectNulls
                />

                {/* Gradients */}
                <defs>
                  <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorFcst" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Anomaly Detection Section */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            <ShieldAlert className="h-3.5 w-3.5" />
            Historical Anomaly Logs (Auto-flagged)
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {anomalies.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 rounded-lg border border-border/40 bg-background/40 p-4 transition-colors hover:bg-background/80"
              >
                <div
                  className={`mt-0.5 rounded-full p-1.5 ${
                    a.severity === "warning" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground text-xs">{a.type}</span>
                    <Badge variant="outline" className="h-4.5 font-normal text-[9px]">
                      {a.date}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{a.description}</p>
                  <span className="block pt-0.5 font-medium text-[9px] text-muted-foreground uppercase tracking-tight">
                    Metric: {a.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
