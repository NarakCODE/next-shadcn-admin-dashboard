export type SubscriptionTier = "starter" | "pro" | "enterprise";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  subscription: Subscription;
};

export type Subscription = {
  tier: SubscriptionTier;
  status: "active" | "trialing" | "past_due" | "canceled";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
};

export type UsageMetrics = {
  projects: number;
  storage: number;
  teamMembers: number;
  apiCalls: number;
  webhooks: number;
  customIntegrations: number;
};

export type UsageLimits = {
  projects: number | "unlimited";
  storage: number | "unlimited";
  teamMembers: number | "unlimited";
  apiCalls: number | "unlimited";
  webhooks: number | "unlimited";
  customIntegrations: number | "unlimited";
  auditLogRetention: number;
};

export type FeatureAccess = {
  teamManagement: boolean;
  auditLogs: boolean;
  sso: boolean;
  webhooks: boolean;
  advancedAnalytics: boolean;
  customIntegrations: boolean;
  advancedSecurity: boolean;
  dataExport: boolean;
  customBranding: boolean;
  apiMonitoring: boolean;
  savedViews: boolean;
  bulkOperations: boolean;
  advancedSearch: boolean;
};
