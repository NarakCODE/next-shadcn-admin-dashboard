"use client";

import { Database, Folder, Key, Link2, Users, Webhook } from "lucide-react";

import { UsageIndicator } from "@/components/features/usage-indicator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UsageDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Overview</CardTitle>
        <CardDescription>Monitor your current usage against your plan limits</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Projects</span>
            </div>
            <UsageIndicator metric="projects" label="Projects" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Storage</span>
            </div>
            <UsageIndicator metric="storage" label="Storage (GB)" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Team Members</span>
            </div>
            <UsageIndicator metric="teamMembers" label="Team Members" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">API Calls</span>
            </div>
            <UsageIndicator metric="apiCalls" label="API Calls (Today)" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Webhook className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Webhooks</span>
            </div>
            <UsageIndicator metric="webhooks" label="Active Webhooks" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Custom Integrations</span>
            </div>
            <UsageIndicator metric="customIntegrations" label="Integrations" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
