import type { LucideIcon } from "lucide-react";
import { ArrowDownToLine, ArrowUpFromLine, PackageCheck, PackageOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BreakdownItem {
  label: string;
  note?: string;
  value: number;
}

interface BreakdownGroup {
  title: string;
  description: string;
  icon: LucideIcon;
  items: BreakdownItem[];
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const groups: BreakdownGroup[] = [
  {
    title: "Opening position",
    description: "Inventory value at the start of the reporting period.",
    icon: PackageOpen,
    items: [
      { label: "Opening stock", note: "By purchase price", value: 0 },
      { label: "Opening stock", note: "By sale price", value: 0 },
    ],
  },
  {
    title: "Purchases & operating costs",
    description: "Inventory acquisitions and costs that reduce profit.",
    icon: ArrowDownToLine,
    items: [
      { label: "Total purchase", note: "Excluding tax and discount", value: 0 },
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
    description: "Sales income, recoveries, and purchase adjustments.",
    icon: ArrowUpFromLine,
    items: [
      { label: "Total sales", note: "Excluding tax and discount", value: 0 },
      { label: "Total sell shipping charge", value: 0 },
      { label: "Sell additional expenses", value: 0 },
      { label: "Total stock recovered", value: 0 },
      { label: "Total purchase return", value: 0 },
      { label: "Total purchase discount", value: 0 },
      { label: "Total sell round off", value: 0 },
    ],
  },
  {
    title: "Closing position",
    description: "Inventory value remaining at the end of the period.",
    icon: PackageCheck,
    items: [
      { label: "Closing stock", note: "By purchase price", value: 0 },
      { label: "Closing stock", note: "By sale price", value: 0 },
    ],
  },
];

function BreakdownGroupCard({ group }: { group: BreakdownGroup }) {
  const Icon = group.icon;

  return (
    <section className="flex flex-col rounded-lg border bg-background">
      <div className="flex items-start gap-3 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="font-medium">{group.title}</h3>
          <p className="text-muted-foreground text-xs">{group.description}</p>
        </div>
      </div>
      <Separator />
      <dl className="flex flex-1 flex-col">
        {group.items.map((item, index) => (
          <div
            className="flex min-h-14 items-center justify-between gap-4 border-b px-4 py-2.5 last:border-b-0"
            key={`${item.label}-${item.note ?? index}`}
          >
            <dt className="flex min-w-0 flex-col gap-0.5">
              <span>{item.label}</span>
              {item.note ? <span className="text-muted-foreground text-xs">({item.note})</span> : null}
            </dt>
            <dd className="shrink-0 font-medium tabular-nums">{currencyFormatter.format(item.value)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ProfitLossBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & loss breakdown</CardTitle>
        <CardDescription>
          Detailed stock, purchase, sales, and operating values for the selected period.
        </CardDescription>
        <Badge variant="secondary" className="w-fit">
          20 line items
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-2">
        <div className="grid content-start gap-4">
          <BreakdownGroupCard group={groups[0]} />
          <BreakdownGroupCard group={groups[1]} />
        </div>
        <div className="grid content-start gap-4">
          <BreakdownGroupCard group={groups[2]} />
          <BreakdownGroupCard group={groups[3]} />
        </div>
      </CardContent>
    </Card>
  );
}
