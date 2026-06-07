"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowDownToLine, ArrowUpFromLine, ChartNoAxesColumnIncreasing, PackageCheck, PackageOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface SummaryItem {
  label: string;
  detail?: string;
  value: number;
}

interface SummaryGroup {
  title: string;
  icon: LucideIcon;
  items: SummaryItem[];
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const summaryGroups: SummaryGroup[] = [
  {
    title: "Opening stock",
    icon: PackageOpen,
    items: [
      { label: "Opening stock", detail: "By purchase price", value: 0 },
      { label: "Opening stock", detail: "By sale price", value: 0 },
    ],
  },
  {
    title: "Purchases & costs",
    icon: ArrowDownToLine,
    items: [
      { label: "Total purchase", detail: "Excluding tax and discount", value: 0 },
      { label: "Total stock adjustment", value: 0 },
      { label: "Total expense", value: 0 },
      { label: "Total purchase shipping charge", value: 0 },
      { label: "Purchase additional expenses", value: 0 },
      { label: "Total transfer shipping charge", value: 0 },
      { label: "Total sell discount", value: 0 },
      { label: "Total customer reward", value: 0 },
      { label: "Total sell return", value: 0 },
    ],
  },
  {
    title: "Sales & recoveries",
    icon: ArrowUpFromLine,
    items: [
      { label: "Total sales", detail: "Excluding tax and discount", value: 0 },
      { label: "Total sell shipping charge", value: 0 },
      { label: "Sell additional expenses", value: 0 },
      { label: "Total stock recovered", value: 0 },
      { label: "Total purchase return", value: 0 },
      { label: "Total purchase discount", value: 0 },
      { label: "Total sell round off", value: 0 },
    ],
  },
  {
    title: "Closing stock",
    icon: PackageCheck,
    items: [
      { label: "Closing stock", detail: "By purchase price", value: 0 },
      { label: "Closing stock", detail: "By sale price", value: 0 },
    ],
  },
];

function SummaryGroupPanel({ group }: { group: SummaryGroup }) {
  const Icon = group.icon;

  return (
    <section className="overflow-hidden rounded-lg border bg-background">
      <div className="flex items-center gap-2.5 bg-muted/40 px-3 py-2.5">
        <div className="flex size-7 items-center justify-center rounded-md bg-background text-muted-foreground ring-1 ring-foreground/10">
          <Icon className="size-3.5" />
        </div>
        <h3 className="font-medium text-sm">{group.title}</h3>
        <Badge className="ml-auto" variant="secondary">
          {group.items.length}
        </Badge>
      </div>
      <Separator />
      <dl>
        {group.items.map((item, index) => (
          <div
            className="flex min-h-12 items-center justify-between gap-4 border-b px-3 py-2 last:border-b-0"
            key={`${item.label}-${item.detail ?? index}`}
          >
            <dt className="flex min-w-0 flex-col">
              <span>{item.label}</span>
              {item.detail ? <span className="text-muted-foreground text-xs">({item.detail})</span> : null}
            </dt>
            <dd className="shrink-0 font-medium tabular-nums">{currencyFormatter.format(item.value)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ProfitLossSummaryDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button aria-label="Open profit and loss summary" size="icon" variant="outline">
          <ChartNoAxesColumnIncreasing />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="border-b px-5 py-4 pr-12">
          <div className="flex items-center gap-2">
            <DialogTitle>Profit & loss summary</DialogTitle>
            <Badge variant="secondary">20 line items</Badge>
          </div>
          <DialogDescription>
            Stock, purchases, operating costs, sales, and recoveries for the current reporting period.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(90vh-6.5rem)] overflow-y-auto p-4 sm:p-5">
          <div className="grid items-start gap-4 lg:grid-cols-2">
            <div className="grid gap-4">
              <SummaryGroupPanel group={summaryGroups[0]} />
              <SummaryGroupPanel group={summaryGroups[1]} />
            </div>
            <div className="grid gap-4">
              <SummaryGroupPanel group={summaryGroups[2]} />
              <SummaryGroupPanel group={summaryGroups[3]} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
