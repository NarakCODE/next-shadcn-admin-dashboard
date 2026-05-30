"use client";

import { useState } from "react";

import { AlertTriangle, ArrowRight, Layers, Milestone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type VersionDetails = {
  id: string;
  name: string;
  releaseDate: string;
  sunsetDate: string | null;
  status: "stable" | "deprecated" | "sunset";
  activeKeys: number;
  changelogLink: string;
};

const VERSIONS: VersionDetails[] = [
  {
    id: "v3",
    name: "v3 (Stable, Recommended)",
    releaseDate: "Jan 12, 2026",
    sunsetDate: null,
    status: "stable",
    activeKeys: 3,
    changelogLink: "#",
  },
  {
    id: "v2",
    name: "v2 (Deprecated)",
    releaseDate: "Jun 15, 2024",
    sunsetDate: "Jun 30, 2026",
    status: "deprecated",
    activeKeys: 1,
    changelogLink: "#",
  },
  {
    id: "v1",
    name: "v1 (Legacy Sunset)",
    releaseDate: "Mar 10, 2023",
    sunsetDate: "Dec 31, 2025",
    status: "sunset",
    activeKeys: 0,
    changelogLink: "#",
  },
];

export function ApiVersionManager() {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <Card className="flex h-full flex-col border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <Layers className="h-4.5 w-4.5 text-primary" />
          API Version Governance
        </CardTitle>
        <CardDescription className="text-xs">
          Manage outgoing application protocols. Monitor sunset milestones and draft upgrade pathways.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between space-y-5 pt-2">
        {/* Version List */}
        <div className="space-y-3.5">
          {VERSIONS.map((v) => {
            const isDeprecated = v.status === "deprecated";
            const isSunset = v.status === "sunset";

            return (
              <div
                key={v.id}
                className={`space-y-3 rounded-lg border p-4 transition-all duration-200 ${
                  isDeprecated
                    ? "border-amber-500/25 bg-amber-500/[0.01]"
                    : isSunset
                      ? "border-rose-500/25 bg-rose-500/[0.01] opacity-70"
                      : "border-border/50 bg-background/50"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-xs leading-none">{v.name}</span>
                    <Badge
                      className={`h-4.5 border-none px-2 font-bold text-[8px] uppercase ${
                        v.status === "stable"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : v.status === "deprecated"
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                            : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
                      }`}
                    >
                      {v.status}
                    </Badge>
                  </div>

                  <span className="font-mono text-[10px] text-muted-foreground">{v.activeKeys} Active Keys</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] text-muted-foreground">
                  <span>
                    Released: <span className="font-medium text-foreground">{v.releaseDate}</span>
                  </span>
                  {v.sunsetDate && (
                    <span className={isSunset ? "font-bold text-rose-600" : "font-semibold text-amber-600"}>
                      Sunset Date: {v.sunsetDate}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning Callout for V2 deprecation */}
        <div className="flex flex-col gap-2 rounded-lg border border-amber-500/10 bg-amber-500/5 p-3">
          <div className="flex items-start gap-2.5 text-muted-foreground text-xs">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div className="space-y-0.5">
              <span className="font-semibold text-foreground">API v2 Sunset alert</span>
              <p className="text-[10px] leading-relaxed">
                We detected active traffic on <span className="font-bold text-foreground">API v2</span> endpoints.
                Ensure your endpoints are migrated to V3 prior to June 30, 2026, to prevent integration downtime.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowGuide(true)}
            variant="outline"
            className="h-8 w-full self-center border-amber-500/20 font-semibold text-[11px] text-amber-600 hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-700"
          >
            View migration guide <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Migration Guide Modal Dialog */}
        <Dialog open={showGuide} onOpenChange={setShowGuide}>
          <DialogContent className="max-w-md border-border/60 bg-popover">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-semibold text-sm">
                <Milestone className="h-5 w-5 text-primary" />
                V2 to V3 Endpoint Migration Guide
              </DialogTitle>
              <DialogDescription className="text-xs">
                Follow these critical structural guidelines to upgrade your JSON integrations seamlessly.
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[300px] space-y-4 overflow-y-auto py-2 text-xs leading-relaxed">
              <div className="space-y-1">
                <h4 className="flex items-center gap-1.5 font-bold text-foreground">
                  [1] Base Endpoint URL Path Changes
                </h4>
                <p className="pl-3 text-[11px] text-muted-foreground">
                  Replace outbound request targets from{" "}
                  <code className="rounded bg-muted p-0.5 font-mono text-[10px]">/api/v2/*</code> to{" "}
                  <code className="rounded bg-primary/10 p-0.5 font-mono text-[10px] text-primary">/api/v3/*</code>.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="flex items-center gap-1.5 font-bold text-foreground">
                  [2] JSON Response Structure Updates
                </h4>
                <p className="pl-3 text-[11px] text-muted-foreground">
                  V3 returns paginated lists wrapped under a primary{" "}
                  <code className="rounded bg-muted p-0.5 font-mono text-[10px]">data: []</code> array payload. Custom
                  sorting limits are passed as direct query params rather than request headers.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="flex items-center gap-1.5 font-bold text-foreground">
                  [3] Error Status payload mapping
                </h4>
                <p className="pl-3 text-[11px] text-muted-foreground">
                  V3 standardises REST formats. Output payloads return RFC 7807 problem details (error type, title,
                  detail, instance paths) to aid debug tooling.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setShowGuide(false)} className="h-9.5 w-full font-semibold text-xs">
                Understood, close guide
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
