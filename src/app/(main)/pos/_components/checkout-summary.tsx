"use client";

import { Coins, CreditCard, Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CheckoutSummaryProps {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  isCartEmpty: boolean;
  onHoldOrder?: () => void;
  onCashPay?: () => void;
  onChargeElectronic?: () => void;
}

export function CheckoutSummary({
  subtotal,
  taxAmount,
  totalAmount,
  isCartEmpty,
  onHoldOrder,
  onCashPay,
  onChargeElectronic,
}: CheckoutSummaryProps) {
  return (
    <div className="space-y-3 border-border border-t bg-muted/20 p-4">
      <div className="space-y-1.5 font-medium text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-mono">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Tax (8%)</span>
          <span className="font-mono">${taxAmount.toFixed(2)}</span>
        </div>
        <Separator className="my-1" />
        <div className="flex justify-between font-bold text-base text-foreground">
          <span>Total Bill</span>
          <span className="font-mono text-primary text-xl tracking-tight">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="flex h-11 items-center justify-center gap-2"
          disabled={isCartEmpty}
          onClick={onHoldOrder}
        >
          <Receipt className="h-4 w-4 text-muted-foreground" />
          Hold Order
        </Button>
        <Button
          variant="outline"
          className="flex h-11 items-center justify-center gap-2"
          disabled={isCartEmpty}
          onClick={onCashPay}
        >
          <Coins className="h-4 w-4 text-muted-foreground" />
          Cash Pay
        </Button>
      </div>

      <Button
        className="flex h-12 w-full items-center justify-center gap-2 font-semibold text-sm tracking-wide shadow-lg"
        disabled={isCartEmpty}
        onClick={onChargeElectronic}
      >
        <CreditCard className="h-4 w-4" />
        Charge Electronic Payment
      </Button>
    </div>
  );
}
