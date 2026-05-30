"use client";

import { useState } from "react";

import { Clock, Eye, History, RotateCcw } from "lucide-react";

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
  DialogTrigger,
} from "@/components/ui/dialog";

type Version = {
  version: string;
  timestamp: string;
  author: {
    name: string;
    avatar: string;
  };
  summary: string;
  isActive: boolean;
};

const INITIAL_VERSIONS: Version[] = [
  {
    version: "v1.4",
    timestamp: "2026-05-28T14:24:00Z",
    author: { name: "Aiy", avatar: "A" },
    summary: "Added conditional routing filter to prevent staging events from posting to production webhook.",
    isActive: true,
  },
  {
    version: "v1.3",
    timestamp: "2026-05-20T09:12:00Z",
    author: { name: "John Doe", avatar: "J" },
    summary: "Fixed Salesforce OAuth2 token exchange scope mapping issue. Updated body payload keys.",
    isActive: false,
  },
  {
    version: "v1.2",
    timestamp: "2026-05-15T16:45:00Z",
    author: { name: "Aiy", avatar: "A" },
    summary: "Appended custom X-Webhook-Signature verification headers. Set up retry delivery window (3 attempts).",
    isActive: false,
  },
  {
    version: "v1.1",
    timestamp: "2026-05-02T10:30:00Z",
    author: { name: "Sarah Connor", avatar: "S" },
    summary: "Configured API endpoint target path to support lead mapping models correctly.",
    isActive: false,
  },
  {
    version: "v1.0",
    timestamp: "2026-04-28T08:00:00Z",
    author: { name: "Sarah Connor", avatar: "S" },
    summary: "Initial integration build. Trigger maps webhook lead creations directly.",
    isActive: false,
  },
];

export function VersionHistory() {
  const [versions, setVersions] = useState<Version[]>(INITIAL_VERSIONS);
  const [restoreTarget, setRestoreTarget] = useState<string | null>(null);
  const [isRestored, setIsRestored] = useState(false);

  const handleRestore = (vNumber: string) => {
    setRestoreTarget(vNumber);
  };

  const confirmRestore = () => {
    if (!restoreTarget) return;
    setVersions(
      versions.map((v) => ({
        ...v,
        isActive: v.version === restoreTarget,
      })),
    );
    setIsRestored(true);
    setTimeout(() => {
      setIsRestored(false);
      setRestoreTarget(null);
    }, 2000);
  };

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <History className="h-4.5 w-4.5 text-primary" />
          Version Control Timeline
        </CardTitle>
        <CardDescription className="text-xs">
          Audit previous updates, trace changes, and easily roll back integration workflows.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline representation */}
        <div className="relative ml-3 space-y-6 border-border/60 border-l pt-2 pl-6">
          {versions.map((v) => (
            <div key={v.version} className="relative">
              {/* Connector dot */}
              <div
                className={`absolute top-1.5 -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border-2 bg-background ${
                  v.isActive ? "border-primary text-primary" : "border-muted-foreground/40 text-muted-foreground"
                }`}
              >
                {v.isActive && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </div>

              <div className="flex flex-col gap-2 rounded-lg border border-border/40 bg-background/50 p-4 transition-all duration-200 hover:border-primary/20">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-xs">{v.version}</span>
                    {v.isActive ? (
                      <Badge className="h-4.5 border-none bg-emerald-500/10 font-semibold text-[9px] text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                        Active Release
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="h-4.5 border-none font-normal text-[9px] text-muted-foreground"
                      >
                        Archived
                      </Badge>
                    )}
                  </div>

                  {/* Timestamp & Author */}
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(v.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 font-bold text-[9px] text-primary">
                        {v.author.avatar}
                      </div>
                      {v.author.name}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">{v.summary}</p>

                {/* Actions */}
                <div className="mt-1.5 flex justify-end gap-2 border-border/40 border-t pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Eye className="mr-1 h-3.5 w-3.5" /> View Specs
                  </Button>

                  {!v.isActive && (
                    <Dialog open={restoreTarget === v.version} onOpenChange={(open) => !open && setRestoreTarget(null)}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => handleRestore(v.version)}
                          variant="outline"
                          size="sm"
                          className="h-7 border-border/50 px-2.5 text-[10px] hover:bg-primary/5 hover:text-primary"
                        >
                          <RotateCcw className="mr-1 h-3.5 w-3.5" /> Restore Version
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm border-border/60 bg-popover">
                        <DialogHeader>
                          <DialogTitle className="font-semibold text-sm">Confirm Rollback</DialogTitle>
                          <DialogDescription className="text-xs">
                            Are you sure you want to roll back the active integration to version{" "}
                            <span className="font-semibold text-foreground">{v.version}</span>? This will modify the
                            live endpoint immediately.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="pt-2">
                          <Button variant="ghost" onClick={() => setRestoreTarget(null)} className="h-9.5 text-xs">
                            Cancel
                          </Button>
                          <Button onClick={confirmRestore} className="h-9.5 px-4 font-semibold text-xs shadow-sm">
                            {isRestored ? "Rolled Back!" : "Confirm Rollback"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
