"use client";

import { useUsage } from "@/hooks/use-feature";
import type { UsageLimits } from "@/lib/types";

type UsageIndicatorProps = {
  metric: keyof UsageLimits;
  label: string;
  showWarning?: boolean;
  warningThreshold?: number;
};

export function UsageIndicator({ metric, label, showWarning = true, warningThreshold = 80 }: UsageIndicatorProps) {
  const { current, limit, percentage, isExceeded, isUnlimited } = useUsage(metric);

  const showWarningState = showWarning && percentage >= warningThreshold && !isUnlimited;
  const isDanger = isExceeded || percentage >= 95;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{label}</span>
        <span className="text-muted-foreground text-xs">
          {isUnlimited ? (
            <>
              {current} <span className="text-muted-foreground/60">/ Unlimited</span>
            </>
          ) : (
            <>
              {current} <span className="text-muted-foreground/60">/ {limit}</span>
            </>
          )}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full transition-all ${
              isDanger ? "bg-destructive" : showWarningState ? "bg-warning" : "bg-primary"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      {isExceeded && <p className="text-destructive text-xs">Usage limit exceeded. Please upgrade your plan.</p>}
      {showWarningState && !isExceeded && (
        <p className="text-warning text-xs">You're approaching your usage limit. Consider upgrading.</p>
      )}
    </div>
  );
}
