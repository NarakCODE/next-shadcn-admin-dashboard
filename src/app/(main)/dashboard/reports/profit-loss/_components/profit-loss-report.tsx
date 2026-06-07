"use client";

import { CalendarDays, MapPin, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ProfitByBrands } from "./profit-by-brands";
import { ProfitByCategories } from "./profit-by-categories";
import { ProfitByCustomer } from "./profit-by-customer";
import { ProfitByDate } from "./profit-by-date";
import { ProfitByDay } from "./profit-by-day";
import { ProfitByInvoice } from "./profit-by-invoice";
import { ProfitByLocations } from "./profit-by-locations";
import { ProfitByProducts } from "./profit-by-products";
import { ProfitByServiceStaff } from "./profit-by-service-staff";
import { ProfitLossBreakdown } from "./profit-loss-breakdown";

const tabs = [
  ["products", "Products", ProfitByProducts],
  ["categories", "Categories", ProfitByCategories],
  ["brands", "Brands", ProfitByBrands],
  ["locations", "Locations", ProfitByLocations],
  ["invoice", "Invoice", ProfitByInvoice],
  ["date", "Date", ProfitByDate],
  ["customer", "Customer", ProfitByCustomer],
  ["day", "Day", ProfitByDay],
  ["staff", "Service staff", ProfitByServiceStaff],
] as const;

const metrics = [
  ["Net revenue", "$226,370", "+8.4%", "After discounts and returns"],
  ["Cost of goods", "$124,903", "+5.1%", "55.2% of net revenue"],
  ["Gross profit", "$101,467", "+12.7%", "Best result in 6 months"],
  ["Gross margin", "44.8%", "+1.7 pts", "Target is 42.0%"],
] as const;

export function ProfitLossReport() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-muted/25">
        <CardHeader>
          <CardTitle>Report filters</CardTitle>
          <CardDescription>Showing completed sales in USD before tax.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Select defaultValue="may-2026">
            <SelectTrigger className="w-full sm:w-56">
              <CalendarDays />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="may-2026">May 1-31, 2026</SelectItem>
                <SelectItem value="apr-2026">April 1-30, 2026</SelectItem>
                <SelectItem value="q2-2026">Q2 2026 to date</SelectItem>
                <SelectItem value="ytd-2026">Year to date</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select defaultValue="all-locations">
            <SelectTrigger className="w-full sm:w-52">
              <MapPin />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-locations">All locations</SelectItem>
                <SelectItem value="downtown">Downtown Flagship</SelectItem>
                <SelectItem value="riverside">Riverside Store</SelectItem>
                <SelectItem value="bkk1">BKK1 Studio</SelectItem>
                <SelectItem value="online">Online Store</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, change, note]) => (
          <Card key={label} size="sm">
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-2">
              <Badge variant="secondary">
                <TrendingUp />
                {change}
              </Badge>
              <span className="truncate text-muted-foreground text-xs">{note}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProfitLossBreakdown />

      <Tabs defaultValue="products">
        <div className="overflow-x-auto pb-1">
          <TabsList variant="line">
            {tabs.map(([value, label]) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {tabs.map(([value, , Component]) => (
          <TabsContent key={value} value={value}>
            <Component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
