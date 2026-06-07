"use client";

import * as React from "react";

import { ArrowDownUp, ChevronLeft, ChevronRight, Download, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { ProfitReportRow } from "./report-data";

const PAGE_SIZE = 5;
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const numberFormatter = new Intl.NumberFormat("en-US");

interface ProfitReportGridProps {
  title: string;
  description: string;
  dimensionLabel: string;
  transactionLabel?: string;
  rows: ProfitReportRow[];
}

export function ProfitReportGrid({
  title,
  description,
  dimensionLabel,
  transactionLabel = "Transactions",
  rows,
}: ProfitReportGridProps) {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState("profit");
  const [page, setPage] = React.useState(0);

  const filteredRows = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchingRows = normalizedQuery
      ? rows.filter((row) => `${row.name} ${row.detail}`.toLowerCase().includes(normalizedQuery))
      : rows;

    return matchingRows.toSorted((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "revenue") return b.revenue - a.revenue;
      if (sort === "margin") return b.margin - a.margin;
      return b.profit - a.profit;
    });
  }, [query, rows, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleRows = filteredRows.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);
  const totals = filteredRows.reduce(
    (result, row) => ({
      revenue: result.revenue + row.revenue,
      cost: result.cost + row.cost,
      profit: result.profit + row.profit,
      transactions: result.transactions + row.transactions,
    }),
    { revenue: 0, cost: 0, profit: 0, transactions: 0 },
  );
  const totalMargin = totals.revenue ? Math.round((totals.profit / totals.revenue) * 100) : 0;

  function exportCsv() {
    const header = [dimensionLabel, "Detail", "Revenue", "Cost", "Gross profit", "Margin", transactionLabel];
    const lines = filteredRows.map((row) => [
      row.name,
      row.detail,
      row.revenue,
      row.cost,
      row.profit,
      `${row.margin}%`,
      row.transactions,
    ]);
    const csv = [header, ...lines]
      .map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.toLowerCase().replaceAll(" ", "-")}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline" onClick={exportCsv}>
            <Download data-icon="inline-start" />
            Export CSV
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <div className="flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder={`Search ${dimensionLabel.toLowerCase()}...`}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
            />
          </div>
          <Select
            value={sort}
            onValueChange={(value) => {
              setSort(value);
              setPage(0);
            }}
          >
            <SelectTrigger className="w-full sm:w-44" size="sm">
              <ArrowDownUp />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectItem value="profit">Highest profit</SelectItem>
                <SelectItem value="revenue">Highest revenue</SelectItem>
                <SelectItem value="margin">Highest margin</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="px-4">{dimensionLabel}</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Gross profit</TableHead>
              <TableHead className="text-right">Margin</TableHead>
              <TableHead className="pr-4 text-right">{transactionLabel}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.length ? (
              visibleRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{row.name}</span>
                      <span className="text-muted-foreground text-xs">{row.detail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{currencyFormatter.format(row.revenue)}</TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {currencyFormatter.format(row.cost)}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {currencyFormatter.format(row.profit)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{row.margin}%</Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right tabular-nums">
                    {numberFormatter.format(row.transactions)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No results match &quot;{query}&quot;.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="px-4 font-medium">Total</TableCell>
              <TableCell className="text-right tabular-nums">{currencyFormatter.format(totals.revenue)}</TableCell>
              <TableCell className="text-right tabular-nums">{currencyFormatter.format(totals.cost)}</TableCell>
              <TableCell className="text-right tabular-nums">{currencyFormatter.format(totals.profit)}</TableCell>
              <TableCell className="text-right">
                <Badge>{totalMargin}%</Badge>
              </TableCell>
              <TableCell className="pr-4 text-right tabular-nums">
                {numberFormatter.format(totals.transactions)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <div className="flex items-center justify-between px-4">
          <p className="text-muted-foreground text-xs">
            {filteredRows.length
              ? `${currentPage * PAGE_SIZE + 1}-${Math.min((currentPage + 1) * PAGE_SIZE, filteredRows.length)} of ${filteredRows.length}`
              : "0 results"}
          </p>
          <div className="flex items-center gap-1">
            <Button
              aria-label="Previous page"
              disabled={currentPage === 0}
              size="icon-sm"
              variant="outline"
              onClick={() => setPage((value) => Math.max(0, value - 1))}
            >
              <ChevronLeft />
            </Button>
            <span className="min-w-16 text-center text-muted-foreground text-xs">
              Page {currentPage + 1} of {pageCount}
            </span>
            <Button
              aria-label="Next page"
              disabled={currentPage >= pageCount - 1}
              size="icon-sm"
              variant="outline"
              onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
