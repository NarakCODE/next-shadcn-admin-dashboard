"use client";

import { Ban, Coins, CreditCard, FileQuestion, FileText, PauseCircle, PiggyBank, Split } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  totalPayableUsd: number;
  totalPayableRiel: number;
  onDraft: () => void;
  onQuotation: () => void;
  onSuspend: () => void;
  onCreditSale: () => void;
  onCard: () => void;
  onMultiplePay: () => void;
  onCash: () => void;
  onCancel: () => void;
  isCartEmpty: boolean;
}

export function ActionButtons({
  totalPayableUsd,
  totalPayableRiel,
  onDraft,
  onQuotation,
  onSuspend,
  onCreditSale,
  onCard,
  onMultiplePay,
  onCash,
  onCancel,
  isCartEmpty,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 border-border border-t bg-background/90 p-4 shadow-lg md:flex-row">
      {/* Total Payable Box */}
      <div className="flex shrink-0 flex-col items-center md:items-start">
        <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Total Payable</span>
        <div className="mt-0.5 flex flex-row items-baseline gap-1.5">
          <span className="font-black font-mono text-2xl text-primary tracking-tight">
            ${totalPayableUsd.toFixed(2)}
          </span>
          <span className="font-mono font-semibold text-muted-foreground text-xs">
            / ៛{totalPayableRiel.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Grid of Action Buttons */}
      <div className="grid w-full max-w-5xl grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        <Button
          type="button"
          variant="outline"
          disabled={isCartEmpty}
          onClick={onDraft}
          className="h-10 gap-1.5 border-border/80 font-semibold text-xs hover:bg-muted"
        >
          <FileText className="size-3.5 shrink-0 text-blue-500" />
          Draft
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isCartEmpty}
          onClick={onQuotation}
          className="h-10 gap-1.5 border-border/80 font-semibold text-xs hover:bg-muted"
        >
          <FileQuestion className="size-3.5 shrink-0 text-purple-500" />
          Quotation
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isCartEmpty}
          onClick={onSuspend}
          className="h-10 gap-1.5 border-border/80 font-semibold text-xs hover:bg-muted"
        >
          <PauseCircle className="size-3.5 shrink-0 text-amber-500" />
          Suspend
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isCartEmpty}
          onClick={onCreditSale}
          className="h-10 gap-1.5 border-border/80 font-semibold text-xs hover:bg-indigo-500/10 hover:text-indigo-500"
        >
          <PiggyBank className="size-3.5 shrink-0 text-indigo-500" />
          Credit Sale
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isCartEmpty}
          onClick={onCard}
          className="h-10 gap-1.5 border-border/80 font-semibold text-xs hover:bg-sky-500/10 hover:text-sky-500"
        >
          <CreditCard className="size-3.5 shrink-0 text-sky-500" />
          Card
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isCartEmpty}
          onClick={onMultiplePay}
          className="h-10 gap-1.5 border-border/80 font-semibold text-xs hover:bg-violet-500/10 hover:text-violet-500"
        >
          <Split className="size-3.5 shrink-0 text-violet-500" />
          Multiple Pay
        </Button>

        <Button
          type="button"
          disabled={isCartEmpty}
          onClick={onCash}
          className="h-10 gap-1.5 bg-emerald-600 font-bold text-white text-xs shadow-xs hover:bg-emerald-700"
        >
          <Coins className="size-3.5 shrink-0" />
          Cash
        </Button>

        <Button
          type="button"
          variant="destructive"
          disabled={isCartEmpty}
          onClick={onCancel}
          className="h-10 gap-1.5 font-semibold text-xs opacity-90 hover:opacity-100"
        >
          <Ban className="size-3.5 shrink-0" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
