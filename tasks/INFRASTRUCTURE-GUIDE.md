# Infrastructure & Foundation - Implementation Guide

## Overview

This document describes the Infrastructure & Foundation system that enables feature gating, usage tracking, and upgrade flows for Pro/Enterprise features.

## Architecture

### Core Components

1. **Feature Flag System** (`src/lib/features.ts`)
   - Defines feature access matrix for Starter/Pro/Enterprise tiers
   - Provides utility functions to check feature access
   - Calculates usage limits and percentages

2. **User Context** (`src/context/user-context.tsx`)
   - Global state management for current user and subscription
   - Tracks usage metrics
   - Provides hooks for accessing user data

3. **Feature Hooks** (`src/hooks/use-feature.ts`)
   - `useFeature(feature)` - Check if user has access to a feature
   - `useUsage(metric)` - Get usage metrics and limits
   - `useSubscription()` - Get subscription details

4. **UI Components** (`src/components/features/`)
   - `FeatureGate` - Conditionally render content based on feature access
   - `UsageIndicator` - Display usage metrics with progress bars
   - `UpgradeModal` - Show upgrade prompts with feature comparisons
   - `UsageDashboard` - Complete usage overview component

## Usage Examples

### 1. Feature Gating

Conditionally render content based on user's subscription tier:

```tsx
import { FeatureGate } from "@/components/features";

function TeamManagementPage() {
  return (
    <div>
      <h1>Team Management</h1>
      
      {/* Show content only for Pro/Enterprise users */}
      <FeatureGate feature="teamManagement">
        <TeamMembersList />
      </FeatureGate>
      
      {/* Show upgrade prompt for locked features */}
      <FeatureGate feature="auditLogs" showUpgradePrompt>
        <AuditLogsTable />
      </FeatureGate>
      
      {/* Provide fallback for locked features */}
      <FeatureGate 
        feature="advancedAnalytics" 
        fallback={<p>Upgrade to Pro for advanced analytics</p>}
      >
        <AdvancedAnalyticsDashboard />
      </FeatureGate>
    </div>
  );
}
```

### 2. Checking Feature Access Programmatically

```tsx
import { useFeature } from "@/hooks/use-feature";

function MyComponent() {
  const { hasAccess, requiredTier, label } = useFeature("webhooks");
  
  if (!hasAccess) {
    return (
      <div>
        <p>{label} requires {requiredTier} plan</p>
        <button onClick={() => showUpgradeModal()}>Upgrade Now</button>
      </div>
    );
  }
  
  return <WebhooksConfiguration />;
}
```

### 3. Usage Tracking

Display usage metrics with visual indicators:

```tsx
import { UsageIndicator } from "@/components/features";

function UsageSection() {
  return (
    <div>
      <UsageIndicator metric="projects" label="Projects" />
      <UsageIndicator metric="storage" label="Storage (GB)" />
      <UsageIndicator metric="teamMembers" label="Team Members" />
      <UsageIndicator metric="apiCalls" label="API Calls (Today)" />
    </div>
  );
}
```

### 4. Programmatic Usage Checks

```tsx
import { useUsage } from "@/hooks/use-feature";

function CreateProjectButton() {
  const { current, limit, isExceeded, isUnlimited } = useUsage("projects");
  
  if (isExceeded) {
    return (
      <button disabled>
        Project limit reached ({current}/{limit})
      </button>
    );
  }
  
  return <button>Create Project</button>;
}
```

### 5. Subscription Information

```tsx
import { useSubscription } from "@/hooks/use-feature";

function SubscriptionBadge() {
  const { tier, status, isPro, isEnterprise, isTrialing } = useSubscription();
  
  return (
    <div>
      <Badge>{tier.toUpperCase()}</Badge>
      {isTrialing && <Badge variant="outline">Trial</Badge>}
      {isEnterprise && <Badge variant="primary-light">Enterprise</Badge>}
    </div>
  );
}
```

### 6. Upgrade Modal

Show upgrade prompts when users try to access locked features:

```tsx
import { UpgradeModal } from "@/components/features";
import { useState } from "react";

function MyPage() {
  const [showUpgrade, setShowUpgrade] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowUpgrade(true)}>
        Access Advanced Features
      </button>
      
      <UpgradeModal
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        feature="advancedAnalytics"
        requiredTier="pro"
      />
    </div>
  );
}
```

### 7. Complete Usage Dashboard

```tsx
import { UsageDashboard } from "@/components/features";

function AccountSettingsPage() {
  return (
    <div>
      <h1>Account Settings</h1>
      <UsageDashboard />
    </div>
  );
}
```

## Feature Matrix

### Starter Plan ($9/mo)
- ✅ Saved Views
- ✅ Bulk Operations
- ❌ Team Management
- ❌ Audit Logs
- ❌ SSO
- ❌ Webhooks
- ❌ Advanced Analytics
- ❌ Custom Integrations
- ❌ Advanced Security
- ❌ Data Export
- ❌ Custom Branding
- ❌ API Monitoring
- ❌ Advanced Search

### Professional Plan ($29/mo)
- ✅ Everything in Starter
- ✅ Team Management (10 members)
- ✅ SSO Configuration
- ✅ Webhooks (10)
- ✅ Advanced Analytics
- ✅ Custom Integrations (5)
- ✅ API Monitoring
- ✅ Advanced Search
- ❌ Audit Logs
- ❌ Advanced Security
- ❌ Data Export
- ❌ Custom Branding

### Enterprise Plan ($79/mo)
- ✅ Everything in Pro
- ✅ Audit Logs (90 days retention)
- ✅ Advanced Security
- ✅ Data Export
- ✅ Custom Branding
- ✅ Unlimited everything

## Usage Limits

| Metric | Starter | Pro | Enterprise |
|--------|---------|-----|------------|
| Projects | 5 | Unlimited | Unlimited |
| Storage | 10 GB | 100 GB | Unlimited |
| Team Members | 1 | 10 | Unlimited |
| API Calls/Day | 1,000 | 10,000 | Unlimited |
| Webhooks | 0 | 10 | Unlimited |
| Custom Integrations | 0 | 5 | Unlimited |
| Audit Log Retention | 0 days | 0 days | 90 days |

## API Reference

### Types

```typescript
type SubscriptionTier = "starter" | "pro" | "enterprise";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  subscription: Subscription;
};

type Subscription = {
  tier: SubscriptionTier;
  status: "active" | "trialing" | "past_due" | "canceled";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
};

type UsageMetrics = {
  projects: number;
  storage: number;
  teamMembers: number;
  apiCalls: number;
  webhooks: number;
  customIntegrations: number;
};

type FeatureAccess = {
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
```

### Utility Functions

```typescript
// Check if a tier has access to a feature
hasFeatureAccess(tier: SubscriptionTier, feature: keyof FeatureAccess): boolean

// Get usage limit for a metric
getUsageLimit(tier: SubscriptionTier, metric: keyof UsageLimits): number | "unlimited"

// Check if usage exceeds limit
isUsageExceeded(tier: SubscriptionTier, metric: keyof UsageLimits, current: number): boolean

// Get usage percentage
getUsagePercentage(tier: SubscriptionTier, metric: keyof UsageLimits, current: number): number

// Get minimum tier required for a feature
getRequiredTier(feature: keyof FeatureAccess): SubscriptionTier
```

## Integration with Backend

The current implementation uses mock data. To integrate with a real backend:

1. **Update UserProvider** to fetch user data from API:
```typescript
useEffect(() => {
  async function fetchUser() {
    const response = await fetch("/api/user");
    const user = await response.json();
    setUser(user);
  }
  fetchUser();
}, []);
```

2. **Update usage metrics** when actions are performed:
```typescript
const { updateUsage } = useUser();

async function createProject() {
  await fetch("/api/projects", { method: "POST" });
  updateUsage({ projects: usage.projects + 1 });
}
```

3. **Connect to Stripe** for subscription management:
```typescript
async function upgradeToPro() {
  const session = await fetch("/api/stripe/checkout", {
    method: "POST",
    body: JSON.stringify({ tier: "pro" })
  });
  window.location.href = session.url;
}
```

## Testing

Test different subscription tiers by modifying the mock user:

```typescript
// In src/context/user-context.tsx
const MOCK_USER: User = {
  // ...
  subscription: {
    tier: "starter", // Change to "pro" or "enterprise"
    // ...
  },
};
```

## Next Steps

With the infrastructure in place, you can now:

1. Implement Phase 1 features (Team Management, Audit Logs, SSO, Webhooks)
2. Add feature gates to existing pages
3. Integrate with payment processor (Stripe)
4. Add real backend API endpoints
5. Implement usage tracking in database

## Support

For questions or issues, refer to:
- `tasks/dashboard-audit-pro-features.md` - Full feature audit
- `tasks/todo.md` - Implementation roadmap
- Component source code for detailed examples
