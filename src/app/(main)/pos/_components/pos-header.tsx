"use client";

import { History, MapPin, Monitor } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PosHeaderProps {
  onRecentTransactionsClick?: () => void;
}

export function PosHeader({ onRecentTransactionsClick }: PosHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex flex-col gap-3 border-border border-b bg-background/80 px-6 py-3.5 backdrop-blur-md md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary p-2 font-black text-primary-foreground text-sm tracking-wider shadow-md shadow-primary/20">
          UPOS
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground tracking-tight">Ultimate POS</span>
            <Badge
              variant="secondary"
              className="bg-muted-foreground/10 px-1.5 py-0 font-bold text-[10px] text-muted-foreground"
            >
              V6.9
            </Badge>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 font-semibold text-[10px] text-primary">
              ACLEDA BANK
            </Badge>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Generated at: <span className="font-medium text-foreground">06/06/2026 13:52</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/50 px-3 py-1.5 text-muted-foreground text-xs">
          <MapPin className="size-3.5 text-primary" />
          <span>Location:</span>
          <span className="font-semibold text-foreground">ACLEDA BANK</span>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/50 px-3 py-1.5 text-muted-foreground text-xs">
          <Monitor className="size-3.5 animate-pulse text-emerald-500" />
          <span>POS Screen</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRecentTransactionsClick}
          className="gap-2 border-border/80 font-medium text-xs shadow-xs hover:bg-muted/80"
        >
          <History className="size-3.5 text-muted-foreground" />
          Recent Transactions
        </Button>
      </div>
    </header>
  );
}
