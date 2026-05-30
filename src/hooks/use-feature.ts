"use client";

import { useMemo } from "react";

import { useUser } from "@/context/user-context";
import {
  FEATURE_DESCRIPTIONS,
  FEATURE_LABELS,
  getRequiredTier,
  getUsageLimit,
  getUsagePercentage,
  hasFeatureAccess,
  isUsageExceeded,
} from "@/lib/features";
import type { FeatureAccess, SubscriptionTier, UsageLimits } from "@/lib/types";

export function useFeature(feature: keyof FeatureAccess) {
  const { user } = useUser();

  return useMemo(() => {
    if (!user) {
      return {
        hasAccess: false,
        requiredTier: getRequiredTier(feature),
        label: FEATURE_LABELS[feature],
        description: FEATURE_DESCRIPTIONS[feature],
      };
    }

    const tier = user.subscription.tier;
    return {
      hasAccess: hasFeatureAccess(tier, feature),
      requiredTier: getRequiredTier(feature),
      currentTier: tier,
      label: FEATURE_LABELS[feature],
      description: FEATURE_DESCRIPTIONS[feature],
    };
  }, [user, feature]);
}

export function useUsage(metric: keyof UsageLimits) {
  const { user, usage } = useUser();

  return useMemo(() => {
    if (!user) {
      return {
        current: 0,
        limit: 0,
        percentage: 0,
        isExceeded: false,
        isUnlimited: false,
      };
    }

    const tier = user.subscription.tier;
    const current = (metric === "auditLogRetention" ? 0 : usage[metric as keyof typeof usage]) || 0;
    const limit = getUsageLimit(tier, metric);
    const isUnlimited = limit === "unlimited";

    return {
      current,
      limit,
      percentage: getUsagePercentage(tier, metric, current),
      isExceeded: isUsageExceeded(tier, metric, current),
      isUnlimited,
    };
  }, [user, usage, metric]);
}

export function useSubscription() {
  const { user } = useUser();

  return useMemo(() => {
    if (!user) {
      return {
        tier: "starter" as SubscriptionTier,
        status: "canceled" as const,
        isActive: false,
        isTrialing: false,
        isPro: false,
        isEnterprise: false,
      };
    }

    const { tier, status } = user.subscription;
    return {
      tier,
      status,
      isActive: status === "active" || status === "trialing",
      isTrialing: status === "trialing",
      isPro: tier === "pro",
      isEnterprise: tier === "enterprise",
    };
  }, [user]);
}
