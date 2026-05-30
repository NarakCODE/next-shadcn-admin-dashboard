import { Lock } from "lucide-react";

import { FeatureGate } from "@/components/features";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// New components for Phase 2
import { AdvancedFilters } from "./_components/advanced-filters";
import { AnalyticsKpiStrip } from "./_components/analytics-kpi-strip";
import { AnalyticsToolbar } from "./_components/analytics-toolbar";
import { ComparisonChart } from "./_components/comparison-chart";
import { PredictiveAnalytics } from "./_components/predictive-analytics";
import { RealtimeVisitors } from "./_components/realtime-visitors";
import { ReportBuilder } from "./_components/report-builder";
import { ReportTemplates } from "./_components/report-templates";
import { TopPages } from "./_components/top-pages";
import { TopTrafficSources } from "./_components/top-traffic-sources";
import { TrafficQuality } from "./_components/traffic-quality";

// Import this stylesheet in any page or component that renders country flag classes.
import "@/styles/flag-icons/flags.css";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Hello, Aiy</h1>
        <p className="text-muted-foreground text-sm">
          Monitor traffic, engagement, and conversion performance in one view.
        </p>
      </div>

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="flex-wrap gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>

            {/* Phase 2: Pro & Enterprise restricted tabs */}
            <TabsTrigger value="advanced" className="flex items-center gap-1.5">
              Advanced
              <Lock className="h-3 w-3 text-muted-foreground/80" />
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1.5">
              Reports
              <Lock className="h-3 w-3 text-muted-foreground/80" />
            </TabsTrigger>
            <TabsTrigger value="predictive" className="flex items-center gap-1.5">
              Predictive
              <Lock className="h-3 w-3 text-muted-foreground/80" />
            </TabsTrigger>
          </TabsList>

          <AnalyticsToolbar />
        </div>

        <TabsContent value="overview" className="flex flex-col gap-4">
          <AnalyticsKpiStrip />

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TrafficQuality />
            </div>
            <div className="xl:col-span-5">
              <RealtimeVisitors />
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TopPages />
            </div>
            <div className="xl:col-span-5 xl:col-start-8">
              <TopTrafficSources />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audience">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Audience view coming soon.
          </div>
        </TabsContent>

        <TabsContent value="acquisition">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Acquisition view coming soon.
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Engagement view coming soon.
          </div>
        </TabsContent>

        <TabsContent value="conversions">
          <div className="flex h-64 items-center justify-center rounded-xl border border-border border-dashed text-muted-foreground">
            Conversions view coming soon.
          </div>
        </TabsContent>

        {/* Phase 2 Gated TabsContent */}
        <TabsContent value="advanced" className="flex flex-col gap-4">
          <FeatureGate feature="advancedAnalytics" showUpgradePrompt={true}>
            <AdvancedFilters />
            <ComparisonChart />
          </FeatureGate>
        </TabsContent>

        <TabsContent value="reports" className="flex flex-col gap-4">
          <FeatureGate feature="advancedAnalytics" showUpgradePrompt={true}>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <div className="xl:col-span-5">
                <ReportTemplates />
              </div>
              <div className="xl:col-span-7">
                <ReportBuilder />
              </div>
            </div>
          </FeatureGate>
        </TabsContent>

        <TabsContent value="predictive" className="flex flex-col gap-4">
          {/* Note: audit logs retention setting retains for enterprise only, let's gate predictive features for enterprise subscription */}
          <FeatureGate feature="advancedSecurity" showUpgradePrompt={true}>
            <PredictiveAnalytics />
          </FeatureGate>
        </TabsContent>
      </Tabs>
    </div>
  );
}
