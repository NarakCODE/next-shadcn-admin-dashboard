"use client";

import type * as React from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DataGridScrollAreaProps extends React.ComponentProps<typeof ScrollArea> {
  children?: React.ReactNode;
}

export function DataGridScrollArea({ className, children, ...props }: DataGridScrollAreaProps) {
  return (
    <ScrollArea className={cn("w-full", className)} {...props}>
      {children}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
