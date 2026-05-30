"use client";

import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FEATURE_LABELS } from "@/lib/features";
import type { FeatureAccess, SubscriptionTier } from "@/lib/types";

type UpgradeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: keyof FeatureAccess;
  requiredTier?: SubscriptionTier;
};

const TIER_FEATURES: Record<SubscriptionTier, (keyof FeatureAccess)[]> = {
  starter: ["savedViews", "bulkOperations"],
  pro: [
    "teamManagement",
    "sso",
    "webhooks",
    "advancedAnalytics",
    "customIntegrations",
    "apiMonitoring",
    "advancedSearch",
  ],
  enterprise: ["auditLogs", "advancedSecurity", "dataExport", "customBranding"],
};

const TIER_PRICING: Record<SubscriptionTier, { monthly: number; yearly: number }> = {
  starter: { monthly: 9, yearly: 7 },
  pro: { monthly: 29, yearly: 24 },
  enterprise: { monthly: 79, yearly: 66 },
};

export function UpgradeModal({ open, onOpenChange, feature, requiredTier = "pro" }: UpgradeModalProps) {
  const features = TIER_FEATURES[requiredTier];
  const pricing = TIER_PRICING[requiredTier];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            Upgrade to {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
            {requiredTier === "pro" && (
              <Badge variant="primary-light" className="text-xs">
                Most Popular
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {feature ? (
              <>
                Unlock <span className="font-semibold text-foreground">{FEATURE_LABELS[feature]}</span> and other
                powerful features
              </>
            ) : (
              <>Unlock powerful features to scale your business</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-4xl">${pricing.monthly}</span>
            <span className="text-muted-foreground">/month</span>
            <span className="text-muted-foreground text-sm">or ${pricing.yearly}/mo billed yearly</span>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-medium text-sm">Everything in {requiredTier} includes:</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-2">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm">{FEATURE_LABELS[f]}</span>
                </div>
              ))}
            </div>
          </div>

          {requiredTier === "enterprise" && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="font-medium text-sm">Enterprise also includes:</p>
              <ul className="mt-2 flex flex-col gap-1 text-muted-foreground text-sm">
                <li>• Dedicated account manager</li>
                <li>• 24/7 priority support</li>
                <li>• Custom contracts and SLA</li>
                <li>• On-premise deployment option</li>
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Button
            onClick={() => {
              window.location.href = `/dashboard/pricing?upgrade=${requiredTier}`;
            }}
          >
            {requiredTier === "enterprise" ? "Contact Sales" : "Start Free Trial"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
