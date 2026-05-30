"use client";

import type { ReactNode } from "react";

import { useFeature } from "@/hooks/use-feature";
import type { FeatureAccess } from "@/lib/types";

type FeatureGateProps = {
  feature: keyof FeatureAccess;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
};

export function FeatureGate({ feature, children, fallback, showUpgradePrompt = false }: FeatureGateProps) {
  const { hasAccess, requiredTier, label, description } = useFeature(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (showUpgradePrompt) {
    return <UpgradePrompt requiredTier={requiredTier} label={label} description={description} />;
  }

  if (fallback !== undefined) {
    return <>{fallback}</>;
  }

  return null;
}

type UpgradePromptProps = {
  requiredTier: string;
  label: string;
  description: string;
};

function UpgradePrompt({ requiredTier, label, description }: UpgradePromptProps) {
  return (
    <div className="rounded-lg border border-primary/30 border-dashed bg-primary/5 p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <svg
            className="h-6 w-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-label="Locked feature"
          >
            <title>Locked feature</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">{label}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
          <p className="text-muted-foreground text-xs">
            Upgrade to <span className="font-semibold text-primary">{requiredTier}</span> to unlock this feature
          </p>
        </div>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
          onClick={() => {
            window.location.href = `/dashboard/pricing?upgrade=${requiredTier}`;
          }}
        >
          Upgrade to {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
        </button>
      </div>
    </div>
  );
}
