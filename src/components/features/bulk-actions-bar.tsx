"use client";

import { useState } from "react";

import { Check, Download, MoreHorizontal, RotateCcw, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

export type BulkAction = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void | Promise<void>;
  variant?: "default" | "destructive";
  disabled?: boolean;
};

type BulkActionsBarProps = {
  selectedCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
  enableExport?: boolean;
  onExport?: (format: "csv" | "json") => void;
  enableUndo?: boolean;
  undoLabel?: string;
  onUndo?: () => void;
};

type OperationState = {
  isRunning: boolean;
  progress: number;
  currentAction: string;
};

export function BulkActionsBar({
  selectedCount,
  actions,
  onClearSelection,
  enableExport = false,
  onExport,
  enableUndo = false,
  undoLabel = "Undo",
  onUndo,
}: BulkActionsBarProps) {
  const [operation, setOperation] = useState<OperationState>({
    isRunning: false,
    progress: 0,
    currentAction: "",
  });

  const handleAction = async (action: BulkAction) => {
    setOperation({
      isRunning: true,
      progress: 0,
      currentAction: action.label,
    });

    try {
      // Simulate progress for async operations
      const progressInterval = setInterval(() => {
        setOperation((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 100);

      await action.onClick();

      clearInterval(progressInterval);
      setOperation({
        isRunning: true,
        progress: 100,
        currentAction: action.label,
      });

      // Show completion briefly
      setTimeout(() => {
        setOperation({
          isRunning: false,
          progress: 0,
          currentAction: "",
        });
      }, 1000);
    } catch (error) {
      console.error("[BulkActionsBar] Action failed:", error);
      setOperation({
        isRunning: false,
        progress: 0,
        currentAction: "",
      });
    }
  };

  const handleExport = (format: "csv" | "json") => {
    if (onExport) {
      onExport(format);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="h-6 px-2">
            {selectedCount} selected
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <X className="mr-2 h-4 w-4" />
            Clear Selection
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Primary Actions */}
          {actions.slice(0, 3).map((action) => (
            <Button
              key={action.id}
              variant={action.variant === "destructive" ? "destructive" : "outline"}
              size="sm"
              onClick={() => handleAction(action)}
              disabled={action.disabled || operation.isRunning}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}

          {/* More Actions Dropdown */}
          {actions.length > 3 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={operation.isRunning}>
                  <MoreHorizontal className="mr-2 h-4 w-4" />
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {actions.slice(3).map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={() => handleAction(action)}
                    disabled={action.disabled || operation.isRunning}
                    className={action.variant === "destructive" ? "text-destructive" : ""}
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export Dropdown */}
          {enableExport && onExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={operation.isRunning}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("json")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Undo Button */}
          {enableUndo && onUndo && (
            <Button variant="ghost" size="sm" onClick={onUndo} disabled={operation.isRunning}>
              <RotateCcw className="mr-2 h-4 w-4" />
              {undoLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {operation.isRunning && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {operation.progress === 100 ? (
                <span className="flex items-center gap-1 text-green-600">
                  <Check className="h-3 w-3" />
                  {operation.currentAction} completed
                </span>
              ) : (
                `${operation.currentAction}...`
              )}
            </span>
            <span className="text-muted-foreground">{operation.progress}%</span>
          </div>
          <Progress value={operation.progress} className="h-1" />
        </div>
      )}
    </div>
  );
}
