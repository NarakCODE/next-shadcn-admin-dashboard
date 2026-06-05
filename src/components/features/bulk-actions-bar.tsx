"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Download, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export type BulkAction = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void | Promise<void>;
  variant?: "destructive" | "default" | "outline";
};

interface BulkActionsBarProps {
  selectedCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
  enableExport?: boolean;
  onExport?: (format: "csv" | "json") => void;
}

export function BulkActionsBar({
  selectedCount,
  actions,
  onClearSelection,
  enableExport = false,
  onExport,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="fixed bottom-6 left-1/2 z-50 flex w-[92vw] max-w-fit items-center gap-3 rounded-full border border-border/80 bg-background/85 px-4 py-2.5 shadow-2xl backdrop-blur-md md:gap-4 dark:bg-zinc-950/85"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-[10px] text-primary-foreground">
          {selectedCount}
        </span>
        <span className="hidden font-medium text-muted-foreground text-sm sm:inline">selected</span>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1.5 md:gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            size="sm"
            variant={action.variant === "destructive" ? "destructive" : "ghost"}
            onClick={action.onClick}
            className="h-8 rounded-full px-3 text-xs"
          >
            {action.icon && <span className="mr-1.5">{action.icon}</span>}
            {action.label}
          </Button>
        ))}

        {enableExport && onExport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 rounded-full px-3 text-xs">
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onExport("csv")}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("json")}>Export as JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Separator orientation="vertical" className="h-6" />

      <Button
        size="icon"
        variant="ghost"
        onClick={onClearSelection}
        className="h-8 w-8 rounded-full hover:bg-muted"
        aria-label="Clear selection"
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
