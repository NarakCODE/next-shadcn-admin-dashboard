"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ModifiersSummaryProps {
  itemsCount: number;
  exchangeRate: number;
  onExchangeRateChange: (val: number) => void;
  discount: number;
  onDiscountChange: (val: number) => void;
  tax: number;
  onTaxChange: (val: number) => void;
  shipping: number;
  onShippingChange: (val: number) => void;
  totalUsd: number;
  totalRiel: number;
}

export function ModifiersSummary({
  itemsCount,
  exchangeRate,
  onExchangeRateChange,
  discount,
  onDiscountChange,
  tax,
  onTaxChange,
  shipping,
  onShippingChange,
  totalUsd,
  totalRiel,
}: ModifiersSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-border/80 bg-muted/20 p-4 shadow-2xs lg:grid-cols-12">
      {/* Modifiers Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-7">
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="exchangeRate"
            className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider"
          >
            Exchange Rate
          </Label>
          <div className="relative">
            <Input
              id="exchangeRate"
              type="number"
              value={exchangeRate}
              onChange={(e) => onExchangeRateChange(Number(e.target.value) || 0)}
              className="h-8 pr-6 font-mono text-xs"
            />
            <span className="absolute top-2 right-2 font-semibold text-[10px] text-muted-foreground">៛</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="discount" className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
            Discount (-)
          </Label>
          <div className="relative">
            <Input
              id="discount"
              type="number"
              value={discount || ""}
              onChange={(e) => onDiscountChange(Number(e.target.value) || 0)}
              placeholder="0.00"
              className="h-8 pr-6 font-mono text-xs"
            />
            <span className="absolute top-2 right-2 font-semibold text-[10px] text-muted-foreground">$</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="orderTax" className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
            Order Tax (+)
          </Label>
          <div className="relative">
            <Input
              id="orderTax"
              type="number"
              value={tax || ""}
              onChange={(e) => onTaxChange(Number(e.target.value) || 0)}
              placeholder="0"
              className="h-8 pr-6 font-mono text-xs"
            />
            <span className="absolute top-2 right-2 font-semibold text-[10px] text-muted-foreground">%</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="shipping" className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
            Shipping (+)
          </Label>
          <div className="relative">
            <Input
              id="shipping"
              type="number"
              value={shipping || ""}
              onChange={(e) => onShippingChange(Number(e.target.value) || 0)}
              placeholder="0.00"
              className="h-8 pr-6 font-mono text-xs"
            />
            <span className="absolute top-2 right-2 font-semibold text-[10px] text-muted-foreground">$</span>
          </div>
        </div>
      </div>

      {/* Summary Displays */}
      <div className="grid grid-cols-3 divide-x divide-border/60 rounded-lg border border-border/80 bg-background/60 p-2.5 lg:col-span-5">
        <div className="flex flex-col items-center justify-center px-1 text-center">
          <span className="font-bold text-[9px] text-muted-foreground uppercase tracking-wider">Items</span>
          <span className="mt-0.5 font-extrabold text-base text-foreground">{itemsCount.toFixed(2)}</span>
        </div>
        <div className="flex flex-col items-center justify-center px-1 text-center">
          <span className="font-bold text-[9px] text-muted-foreground uppercase tracking-wider">Total Riel</span>
          <span className="mt-0.5 font-extrabold text-primary text-sm tracking-tight">
            ៛{totalRiel.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center px-1 text-center">
          <span className="font-bold text-[9px] text-muted-foreground uppercase tracking-wider">Total USD</span>
          <span className="mt-0.5 font-extrabold text-foreground text-sm tracking-tight">${totalUsd.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
