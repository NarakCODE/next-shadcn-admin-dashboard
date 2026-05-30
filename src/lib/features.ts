import type { FeatureAccess, SubscriptionTier, UsageLimits } from "./types";

export const FEATURE_MATRIX: Record<SubscriptionTier, FeatureAccess> = {
  starter: {
    teamManagement: false,
    auditLogs: false,
    sso: false,
    webhooks: false,
    advancedAnalytics: false,
    customIntegrations: false,
    advancedSecurity: false,
    dataExport: false,
    customBranding: false,
    apiMonitoring: false,
    savedViews: true,
    bulkOperations: true,
    advancedSearch: false,
  },
  pro: {
    teamManagement: true,
    auditLogs: false,
    sso: true,
    webhooks: true,
    advancedAnalytics: true,
    customIntegrations: true,
    advancedSecurity: false,
    dataExport: false,
    customBranding: false,
    apiMonitoring: true,
    savedViews: true,
    bulkOperations: true,
    advancedSearch: true,
  },
  enterprise: {
    teamManagement: true,
    auditLogs: true,
    sso: true,
    webhooks: true,
    advancedAnalytics: true,
    customIntegrations: true,
    advancedSecurity: true,
    dataExport: true,
    customBranding: true,
    apiMonitoring: true,
    savedViews: true,
    bulkOperations: true,
    advancedSearch: true,
  },
};

export const USAGE_LIMITS: Record<SubscriptionTier, UsageLimits> = {
  starter: {
    projects: 5,
    storage: 10,
    teamMembers: 1,
    apiCalls: 1000,
    webhooks: 0,
    customIntegrations: 0,
    auditLogRetention: 0,
  },
  pro: {
    projects: "unlimited",
    storage: 100,
    teamMembers: 10,
    apiCalls: 10000,
    webhooks: 10,
    customIntegrations: 5,
    auditLogRetention: 0,
  },
  enterprise: {
    projects: "unlimited",
    storage: "unlimited",
    teamMembers: "unlimited",
    apiCalls: "unlimited",
    webhooks: "unlimited",
    customIntegrations: "unlimited",
    auditLogRetention: 90,
  },
};

export const FEATURE_LABELS: Record<keyof FeatureAccess, string> = {
  teamManagement: "Team Management",
  auditLogs: "Audit Logs",
  sso: "SSO Configuration",
  webhooks: "Webhooks",
  advancedAnalytics: "Advanced Analytics",
  customIntegrations: "Custom Integrations",
  advancedSecurity: "Advanced Security",
  dataExport: "Data Export",
  customBranding: "Custom Branding",
  apiMonitoring: "API Monitoring",
  savedViews: "Saved Views",
  bulkOperations: "Bulk Operations",
  advancedSearch: "Advanced Search",
};

export const FEATURE_DESCRIPTIONS: Record<keyof FeatureAccess, string> = {
  teamManagement: "Invite and manage team members with role-based permissions",
  auditLogs: "Track all user activity and system events for compliance",
  sso: "Single sign-on with SAML 2.0 and OAuth providers",
  webhooks: "Real-time notifications for events in your account",
  advancedAnalytics: "Custom reports, segments, and predictive analytics",
  customIntegrations: "Build custom integrations with visual workflow builder",
  advancedSecurity: "IP whitelisting, session policies, and compliance settings",
  dataExport: "Export all your data and schedule automated backups",
  customBranding: "White-label your workspace with custom branding",
  apiMonitoring: "Monitor API usage, performance, and rate limits",
  savedViews: "Save custom filters and share views with your team",
  bulkOperations: "Perform bulk actions on multiple items at once",
  advancedSearch: "Global search across all entities with advanced filters",
};

export function hasFeatureAccess(tier: SubscriptionTier, feature: keyof FeatureAccess): boolean {
  return FEATURE_MATRIX[tier][feature];
}

export function getUsageLimit(tier: SubscriptionTier, metric: keyof UsageLimits): number | "unlimited" {
  return USAGE_LIMITS[tier][metric];
}

export function isUsageExceeded(tier: SubscriptionTier, metric: keyof UsageLimits, current: number): boolean {
  const limit = getUsageLimit(tier, metric);
  if (limit === "unlimited") return false;
  return current >= limit;
}

export function getUsagePercentage(tier: SubscriptionTier, metric: keyof UsageLimits, current: number): number {
  const limit = getUsageLimit(tier, metric);
  if (limit === "unlimited") return 0;
  return Math.min((current / limit) * 100, 100);
}

export function getRequiredTier(feature: keyof FeatureAccess): SubscriptionTier {
  if (FEATURE_MATRIX.starter[feature]) return "starter";
  if (FEATURE_MATRIX.pro[feature]) return "pro";
  return "enterprise";
}
