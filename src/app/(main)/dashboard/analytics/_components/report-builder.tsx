"use client";

import { useState } from "react";

import {
  AreaChart,
  BarChart,
  Calendar,
  CheckSquare,
  LineChart,
  Mail,
  Save,
  Sparkles,
  Square,
  Table,
} from "lucide-react";
import {
  Area,
  Bar,
  CartesianGrid,
  Line,
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const METRICS = [
  { id: "sessions", label: "Sessions" },
  { id: "pageviews", label: "Pageviews" },
  { id: "bounce", label: "Bounce Rate" },
  { id: "conversions", label: "Conversion Rate" },
  { id: "revenue", label: "Revenue" },
];

const DIMENSIONS = [
  { id: "date", label: "Date" },
  { id: "country", label: "Country" },
  { id: "device", label: "Device" },
  { id: "channel", label: "Channel" },
];

const MOCK_PREVIEW_DATA = {
  date: [
    { name: "Mon", sessions: 4200, pageviews: 9500, revenue: 1400, bounce: 42, conversions: 2.1 },
    { name: "Tue", sessions: 5100, pageviews: 11200, revenue: 2100, bounce: 38, conversions: 2.8 },
    { name: "Wed", sessions: 4800, pageviews: 10400, revenue: 1900, bounce: 39, conversions: 2.5 },
    { name: "Thu", sessions: 6100, pageviews: 13500, revenue: 2800, bounce: 35, conversions: 3.2 },
    { name: "Fri", sessions: 5800, pageviews: 12800, revenue: 2400, bounce: 37, conversions: 2.9 },
    { name: "Sat", sessions: 3200, pageviews: 7100, revenue: 900, bounce: 45, conversions: 1.8 },
    { name: "Sun", sessions: 3500, pageviews: 7800, revenue: 1100, bounce: 43, conversions: 1.9 },
  ],
  country: [
    { name: "US", sessions: 18500, pageviews: 38000, revenue: 9500, bounce: 36, conversions: 3.4 },
    { name: "UK", sessions: 8200, pageviews: 17200, revenue: 3800, bounce: 39, conversions: 2.8 },
    { name: "DE", sessions: 5400, pageviews: 11800, revenue: 2200, bounce: 37, conversions: 2.5 },
    { name: "CA", sessions: 4800, pageviews: 10200, revenue: 1800, bounce: 40, conversions: 2.2 },
    { name: "FR", sessions: 3900, pageviews: 8900, revenue: 1400, bounce: 42, conversions: 2.0 },
  ],
  device: [
    { name: "Desktop", sessions: 22000, pageviews: 45000, revenue: 12500, bounce: 32, conversions: 3.8 },
    { name: "Mobile", sessions: 16500, pageviews: 35000, revenue: 5800, bounce: 44, conversions: 2.1 },
    { name: "Tablet", sessions: 2300, pageviews: 5200, revenue: 800, bounce: 38, conversions: 2.4 },
  ],
  channel: [
    { name: "Organic", sessions: 15400, pageviews: 32000, revenue: 6400, bounce: 38, conversions: 2.5 },
    { name: "Paid Ads", sessions: 9800, pageviews: 21000, revenue: 7800, bounce: 35, conversions: 3.8 },
    { name: "Direct", sessions: 8500, pageviews: 18000, revenue: 3200, bounce: 40, conversions: 2.2 },
    { name: "Social", sessions: 4500, pageviews: 9500, revenue: 1100, bounce: 48, conversions: 1.5 },
  ],
};

export function ReportBuilder() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["sessions"]);
  const [dimension, setDimension] = useState<string>("date");
  const [chartType, setChartType] = useState<"bar" | "line" | "area" | "table">("line");
  const [comparePrevious, setComparePrevious] = useState<boolean>(false);

  // Dialog State
  const [saveName, setSaveName] = useState("");
  const [saveDesc, setSaveDesc] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [scheduleEmail, setScheduleEmail] = useState("");
  const [scheduleFreq, setScheduleFreq] = useState("weekly");
  const [isScheduled, setIsScheduled] = useState(false);

  const toggleMetric = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(selectedMetrics.filter((m) => m !== metricId));
      }
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  const getActiveData = () => {
    return MOCK_PREVIEW_DATA[dimension as keyof typeof MOCK_PREVIEW_DATA] || MOCK_PREVIEW_DATA.date;
  };

  const activeData = getActiveData();
  const _primaryMetric = selectedMetrics[0] || "sessions";

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSchedule = () => {
    setIsScheduled(true);
    setTimeout(() => setIsScheduled(false), 2000);
  };

  return (
    <Card className="flex h-full flex-col border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <Sparkles className="h-4.5 w-4.5 text-primary" />
          Custom Report Designer
        </CardTitle>
        <CardDescription className="text-xs">
          Assemble analytics metrics, group by dimensions, and instantly visualise results.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Panel - Configurations */}
          <div className="space-y-5">
            {/* Metrics */}
            <div className="space-y-2">
              <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Select Metrics
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {METRICS.map((m) => {
                  const isChecked = selectedMetrics.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleMetric(m.id)}
                      className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-xs transition-all ${
                        isChecked
                          ? "border-primary/40 bg-primary/5 font-medium text-foreground"
                          : "border-border/50 bg-background/40 text-muted-foreground hover:bg-background/80"
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <Square className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      )}
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension */}
            <div className="space-y-2">
              <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Group By Dimension
              </Label>
              <div className="flex flex-wrap gap-2">
                {DIMENSIONS.map((d) => {
                  const isSelected = dimension === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setDimension(d.id)}
                      className={`rounded-full border px-3.5 py-1.5 font-medium text-xs transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-xs"
                          : "border-border/60 bg-background/50 text-muted-foreground hover:bg-background"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chart Type */}
            <div className="space-y-2">
              <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Chart Representation
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "line", label: "Line", icon: LineChart },
                  { id: "bar", label: "Bar", icon: BarChart },
                  { id: "area", label: "Area", icon: AreaChart },
                  { id: "table", label: "Table", icon: Table },
                ].map((c) => {
                  const Icon = c.icon;
                  const isSelected = chartType === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setChartType(c.id as any)}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-2.5 text-center transition-all ${
                        isSelected
                          ? "border-primary/40 bg-primary/5 font-medium text-foreground"
                          : "border-border/50 bg-background/40 text-muted-foreground hover:bg-background"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[10px]">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comparison Switch */}
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-3">
              <div className="space-y-0.5">
                <Label className="font-medium text-xs">Compare Period</Label>
                <p className="text-[10px] text-muted-foreground">Include period-over-period comparison indicators.</p>
              </div>
              <Switch checked={comparePrevious} onCheckedChange={setComparePrevious} />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex h-9.5 flex-1 items-center justify-center gap-1.5 font-medium text-xs"
                  >
                    <Save className="h-4 w-4 text-muted-foreground" />
                    Save Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm border-border/60 bg-popover">
                  <DialogHeader>
                    <DialogTitle className="font-semibold text-sm">Save Custom Report</DialogTitle>
                    <DialogDescription className="text-xs">
                      Give this report a friendly name and summary description.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="report-name" className="font-medium text-xs">
                        Report Name
                      </Label>
                      <Input
                        id="report-name"
                        placeholder="e.g. Weekly Marketing Performance"
                        value={saveName}
                        onChange={(e) => setSaveName(e.target.value)}
                        className="h-9.5 bg-background text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="report-desc" className="font-medium text-xs">
                        Description
                      </Label>
                      <Input
                        id="report-desc"
                        placeholder="e.g. Tracks organic and social conversion metrics"
                        value={saveDesc}
                        onChange={(e) => setSaveDesc(e.target.value)}
                        className="h-9.5 bg-background text-xs"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSave} className="h-9.5 w-full font-medium text-xs">
                      {isSaved ? "Saved Successfully!" : "Confirm & Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex h-9.5 flex-1 items-center justify-center gap-1.5 font-medium text-xs"
                  >
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Schedule Email
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm border-border/60 bg-popover">
                  <DialogHeader>
                    <DialogTitle className="font-semibold text-sm">Automate Report Email Delivery</DialogTitle>
                    <DialogDescription className="text-xs">
                      Schedule PDF delivery directly to your inbox.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="email-rec" className="font-medium text-xs">
                        Email Recipient
                      </Label>
                      <Input
                        id="email-rec"
                        type="email"
                        placeholder="name@company.com"
                        value={scheduleEmail}
                        onChange={(e) => setScheduleEmail(e.target.value)}
                        className="h-9.5 bg-background text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-medium text-xs">Delivery Schedule</Label>
                      <div className="flex gap-2">
                        {["daily", "weekly", "monthly"].map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setScheduleFreq(f)}
                            className={`flex-1 rounded-md border py-1.5 text-center font-medium text-xs capitalize transition-all ${
                              scheduleFreq === f
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border/50 bg-background text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSchedule} className="h-9.5 w-full font-medium text-xs">
                      {isScheduled ? "Scheduled!" : "Activate Schedule"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="flex min-h-[300px] flex-col justify-between rounded-lg border border-border/40 bg-muted/10 p-4.5">
            <div className="mb-4 flex items-center justify-between border-border/40 border-b pb-3">
              <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Live Report Preview
              </span>
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="secondary"
                  className="h-5 border-none bg-background font-normal text-[10px] text-muted-foreground"
                >
                  Group: <span className="ml-0.5 font-semibold text-foreground capitalize">{dimension}</span>
                </Badge>
                {comparePrevious && (
                  <Badge className="h-5 border-none bg-emerald-500/10 text-[9px] text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                    +Comp
                  </Badge>
                )}
              </div>
            </div>

            <div className="min-h-[220px] w-full flex-1">
              {chartType === "table" ? (
                <div className="h-full overflow-auto rounded-md border border-border/40 bg-background/50 text-xs">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-border/40 border-b bg-muted/30 text-left text-muted-foreground">
                        <th className="p-2 font-medium capitalize">{dimension}</th>
                        {selectedMetrics.map((m) => (
                          <th key={m} className="p-2 text-right font-medium capitalize">
                            {m}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {activeData.map((row: any, i) => (
                        <tr key={i} className="text-foreground hover:bg-muted/10">
                          <td className="p-2 font-medium">{row.name}</td>
                          {selectedMetrics.map((m) => (
                            <td key={m} className="p-2 text-right">
                              {m === "revenue"
                                ? `$${row[m].toLocaleString()}`
                                : m === "conversions" || m === "bounce"
                                  ? `${row[m]}%`
                                  : row[m].toLocaleString()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-[210px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <RechartsLineChart data={activeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          style={{ fontSize: "9px", fill: "var(--muted-foreground)" }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          style={{ fontSize: "9px", fill: "var(--muted-foreground)" }}
                        />
                        <Tooltip />
                        {selectedMetrics.map((m, idx) => (
                          <Line
                            key={m}
                            type="monotone"
                            dataKey={m}
                            stroke={idx === 0 ? "var(--chart-1)" : idx === 1 ? "var(--chart-2)" : "var(--chart-3)"}
                            strokeWidth={2}
                            dot={false}
                          />
                        ))}
                      </RechartsLineChart>
                    ) : chartType === "bar" ? (
                      <RechartsBarChart data={activeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          style={{ fontSize: "9px", fill: "var(--muted-foreground)" }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          style={{ fontSize: "9px", fill: "var(--muted-foreground)" }}
                        />
                        <Tooltip />
                        {selectedMetrics.map((m, idx) => (
                          <Bar
                            key={m}
                            dataKey={m}
                            fill={idx === 0 ? "var(--chart-1)" : idx === 1 ? "var(--chart-2)" : "var(--chart-3)"}
                            radius={[3, 3, 0, 0]}
                          />
                        ))}
                      </RechartsBarChart>
                    ) : (
                      <RechartsAreaChart data={activeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          style={{ fontSize: "9px", fill: "var(--muted-foreground)" }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          style={{ fontSize: "9px", fill: "var(--muted-foreground)" }}
                        />
                        <Tooltip />
                        {selectedMetrics.map((m, idx) => (
                          <Area
                            key={m}
                            type="monotone"
                            dataKey={m}
                            fill={idx === 0 ? "var(--chart-1)" : "var(--chart-2)"}
                            fillOpacity={0.08}
                            stroke={idx === 0 ? "var(--chart-1)" : "var(--chart-2)"}
                            strokeWidth={2}
                          />
                        ))}
                      </RechartsAreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="mt-2.5 flex items-center justify-between border-border/40 border-t pt-2.5 text-[10px] text-muted-foreground">
              <span>* Live rendering mock environment.</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Last 30 days active
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
