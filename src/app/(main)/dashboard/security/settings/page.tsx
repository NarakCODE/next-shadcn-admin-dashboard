"use client";

import { useState } from "react";

import { AlertTriangle, ArrowUpRight, Clock, KeyRound, Laptop, Shield, ShieldCheck } from "lucide-react";

import { FeatureGate } from "@/components/features";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ComplianceSettings } from "./_components/compliance-settings";
import { DeviceManager } from "./_components/device-manager";
// Import custom subcomponents
import { IpWhitelist } from "./_components/ip-whitelist";
import { PasswordPolicy } from "./_components/password-policy";
import { SessionPolicy } from "./_components/session-policy";

export default function SecuritySettingsPage() {
  const [activeTab, setActiveTab] = useState("ip");

  return (
    <div className="flex flex-col gap-4">
      {/* Enterprise-restricted FeatureGate wrapper */}
      <FeatureGate feature="advancedSecurity" showUpgradePrompt={true}>
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="flex items-center gap-2 text-3xl tracking-tight">
              <Shield className="h-7 w-7 animate-pulse text-primary" />
              Advanced Security & Policies
            </h1>
            <p className="text-muted-foreground text-sm">
              Configure corporate firewalls, session lifetimes, password restrictions, and workspace auditing.
            </p>
          </div>

          <Badge className="flex h-6 items-center gap-1 border-none bg-indigo-500/10 font-bold text-indigo-600 text-xs uppercase dark:bg-indigo-500/15 dark:text-indigo-400">
            Enterprise Tier
          </Badge>
        </div>

        {/* Audit Callout & Score Strip */}
        <div className="mt-1 grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
          {/* Security Warning Banner */}
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/10 bg-amber-500/5 p-4.5 xl:col-span-8">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div className="space-y-1 text-muted-foreground text-xs leading-relaxed">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                Active Security Recommendations (2 Actions Needed)
              </span>
              <p className="text-[10px]">
                Ensure your <span className="font-bold text-foreground">HIPAA Alignment Standards</span> are activated
                to verify TLS parameters. Rotate active administrator sessions approaching 30-day limits.
              </p>
              <div className="flex gap-2 pt-1.5">
                <Button
                  onClick={() => setActiveTab("compliance")}
                  variant="outline"
                  size="sm"
                  className="h-7 border-amber-500/20 px-2.5 text-[10px] text-amber-600 hover:bg-amber-500/10"
                >
                  Configure HIPAA
                </Button>
                <Button
                  onClick={() => setActiveTab("sessions")}
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2.5 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  Audit Sessions
                </Button>
              </div>
            </div>
          </div>

          {/* Dynamic Circular Score Gauge Card */}
          <div className="xl:col-span-4">
            <Card className="h-full border-border/60 bg-card/60 p-4.5 backdrop-blur-xs">
              <div className="flex h-full items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-[10px] text-muted-foreground uppercase">Workspace Score</span>
                  <div className="flex items-center gap-1 font-bold text-foreground text-xl tracking-tight">
                    84 / 100
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-[9px] text-muted-foreground leading-normal">
                    Secure status active. PCI-DSS compliant rules deployed.
                  </p>
                </div>

                {/* Styled Circle Gauge representation */}
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90 transform">
                    <circle cx="28" cy="28" r="24" className="stroke-muted/30" strokeWidth="4" fill="transparent" />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      className="stroke-indigo-500"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray="150"
                      strokeDashoffset="24"
                    />
                  </svg>
                  <span className="absolute font-bold text-foreground text-xs">84%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Tabbed Layout Area */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-4">
          <TabsList className="h-9 w-fit flex-wrap border border-border/40 bg-background/50 p-1">
            <TabsTrigger value="ip" className="flex h-7 items-center gap-1 px-3 text-xs">
              <ShieldCheck className="h-3.5 w-3.5" /> IP & Firewalls
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex h-7 items-center gap-1 px-3 text-xs">
              <Clock className="h-3.5 w-3.5" /> Session Limits
            </TabsTrigger>
            <TabsTrigger value="passwords" className="flex h-7 items-center gap-1 px-3 text-xs">
              <KeyRound className="h-3.5 w-3.5" /> Passwords Policy
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex h-7 items-center gap-1 px-3 text-xs">
              <Shield className="h-3.5 w-3.5" /> Compliance Rules
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex h-7 items-center gap-1 px-3 text-xs">
              <Laptop className="h-3.5 w-3.5" /> Device Controls
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ip" className="mt-0">
            <IpWhitelist />
          </TabsContent>

          <TabsContent value="sessions" className="mt-0">
            <SessionPolicy />
          </TabsContent>

          <TabsContent value="passwords" className="mt-0">
            <PasswordPolicy />
          </TabsContent>

          <TabsContent value="compliance" className="mt-0">
            <ComplianceSettings />
          </TabsContent>

          <TabsContent value="devices" className="mt-0">
            <DeviceManager />
          </TabsContent>
        </Tabs>
      </FeatureGate>
    </div>
  );
}
