"use client";

import { useState } from "react";

import Link from "next/link";

import { ArrowLeft, Plug, RefreshCw, Terminal } from "lucide-react";

import { FeatureGate } from "@/components/features";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ApiConfigForm } from "./_components/api-config-form";
// Import custom components
import { IntegrationTemplates } from "./_components/integration-templates";
import { VersionHistory } from "./_components/version-history";
import { WorkflowBuilder } from "./_components/workflow-builder";

export default function CustomIntegrationsPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "active">("draft");
  const [activeTab, setActiveTab] = useState("workflow");

  const handleSelectRecipe = (name: string) => {
    setSelectedRecipe(name);
    setActiveTab("workflow"); // switch to workflow builder
  };

  const handleRecipeHandled = () => {
    setSelectedRecipe(null);
  };

  const handlePublish = () => {
    setStatus(status === "draft" ? "active" : "draft");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Feature Access restriction wrapper */}
      <FeatureGate feature="customIntegrations" showUpgradePrompt={true}>
        {/* Back Link & Header */}
        <div className="space-y-3">
          <Link
            href="/dashboard/integrations"
            className="flex w-fit items-center gap-1.5 font-medium text-muted-foreground text-xs transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Integrations
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="flex items-center gap-2 text-3xl tracking-tight">
                <Plug className="h-7 w-7 text-primary" />
                Custom Workflow Builder
              </h1>
              <p className="text-muted-foreground text-sm">
                Design multi-node visual triggers, apply data modifiers, and deploy custom outbound webhook connections.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`h-6 font-semibold text-xs uppercase ${
                  status === "active"
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                    : "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400"
                }`}
              >
                {status === "active" ? "Active Release" : "Draft Mode"}
              </Badge>

              <Button
                onClick={handlePublish}
                variant={status === "active" ? "destructive" : "default"}
                size="sm"
                className="h-8.5 px-4 font-semibold text-xs shadow-xs"
              >
                {status === "active" ? "Pause Workflow" : "Deploy workflow"}
              </Button>
            </div>
          </div>
        </div>

        {/* Builder Workspace Layout */}
        <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
          {/* Templates Library Sidebar */}
          <div className="h-full xl:col-span-4">
            <Card className="h-full border-border/60 bg-card/60 p-4.5 backdrop-blur-xs">
              <IntegrationTemplates onSelectTemplate={handleSelectRecipe} />
            </Card>
          </div>

          {/* Builder Center Tabbed Panel */}
          <div className="h-full xl:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-4">
              <TabsList className="h-9 w-fit border border-border/40 bg-background/50 p-1">
                <TabsTrigger value="workflow" className="h-7 px-3 text-xs">
                  Visual Canvas
                </TabsTrigger>
                <TabsTrigger value="api" className="h-7 px-3 text-xs">
                  API Payload Schema
                </TabsTrigger>
                <TabsTrigger value="history" className="h-7 px-3 text-xs">
                  Release Logs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="workflow" className="mt-0">
                <WorkflowBuilder recipeName={selectedRecipe} onRecipeHandled={handleRecipeHandled} />
              </TabsContent>

              <TabsContent value="api" className="mt-0">
                <ApiConfigForm />
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <VersionHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Real-time Execution Console logs */}
        <Card className="mt-1 border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader className="mb-3.5 flex flex-row items-center justify-between space-y-0 border-border/40 border-b pb-3">
            <CardTitle className="flex items-center gap-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              Live Deployment Execution Logs
            </CardTitle>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <RefreshCw className="h-3 w-3 animate-spin-slow" /> Real-time active console
            </span>
          </CardHeader>
          <CardContent>
            <div className="max-h-[140px] space-y-2 overflow-y-auto rounded-lg bg-black/95 p-3.5 font-mono text-[10px] text-emerald-400 leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">[15:12:44]</span>
                <span className="text-indigo-400">[RELEASE]</span>
                <span className="font-semibold text-foreground">
                  Active workflow [v1.4] successfully listening for outbound requests.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">[15:14:02]</span>
                <span className="text-blue-400">[TRIGGER]</span>
                <span>Incoming Webhook POST request from source IP 192.168.1.144. Content-Length: 422 bytes.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">[15:14:03]</span>
                <span className="text-amber-400">[FILTER]</span>
                <span>Payload validated. Condition (user.company) check succeeded. Forwarding fields.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">[15:14:03]</span>
                <span className="text-emerald-500">[ACTION]</span>
                <span>Slack endpoint webhook delivered successfully. Status code: 200 OK. Response time: 88ms.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </FeatureGate>
    </div>
  );
}
