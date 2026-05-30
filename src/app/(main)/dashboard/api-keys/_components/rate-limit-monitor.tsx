"use client";

import { useState } from "react";

import { BellRing, CheckCircle2, KeyRound, MailWarning, RefreshCw, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type KeyLimit = {
  id: string;
  name: string;
  environment: "production" | "staging" | "development";
  used: number;
  limit: number;
  resetHours: number;
  alertEnabled: boolean;
};

const INITIAL_KEYS: KeyLimit[] = [
  {
    id: "1",
    name: "Prod Billing Client",
    environment: "production",
    used: 8490,
    limit: 10000,
    resetHours: 4,
    alertEnabled: true,
  },
  {
    id: "2",
    name: "Staging Testing Key",
    environment: "staging",
    used: 1200,
    limit: 10000,
    resetHours: 12,
    alertEnabled: false,
  },
  {
    id: "3",
    name: "Dev Mock Sync",
    environment: "development",
    used: 550,
    limit: 1000,
    resetHours: 18,
    alertEnabled: false,
  },
];

export function RateLimitMonitor() {
  const [keys, setKeys] = useState<KeyLimit[]>(INITIAL_KEYS);
  const [refreshing, setRefreshing] = useState(false);

  const toggleAlert = (id: string) => {
    setKeys(keys.map((k) => (k.id === id ? { ...k, alertEnabled: !k.alertEnabled } : k)));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const getProgressColor = (pct: number) => {
    if (pct > 85) return "bg-red-500";
    if (pct > 60) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const keysAtRisk = keys.filter((k) => (k.used / k.limit) * 100 > 80).length;

  return (
    <Card className="flex h-full flex-col border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 border-border/40 border-b pb-4">
        <div>
          <CardTitle className="font-semibold text-lg tracking-tight">Active Rate Limit Monitor</CardTitle>
          <CardDescription className="text-xs">
            Monitor API threshold consumption on a key-by-key basis in real-time.
          </CardDescription>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="icon"
          className="h-8 w-8 border-border/50 text-muted-foreground hover:bg-muted"
          disabled={refreshing}
          aria-label="Refresh rates"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between space-y-5 pt-2">
        <div className="space-y-4">
          {keys.map((k) => {
            const pct = (k.used / k.limit) * 100;
            const isNearLimit = pct > 80;

            return (
              <div
                key={k.id}
                className={`space-y-3 rounded-lg border bg-background/50 p-4 transition-all duration-200 ${
                  isNearLimit ? "border-amber-500/25 bg-amber-500/[0.01]" : "border-border/50"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground text-xs leading-none">{k.name}</span>

                    <Badge
                      className={`h-4.5 border-none px-2 font-bold text-[9px] uppercase ${
                        k.environment === "production"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : k.environment === "staging"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                      }`}
                    >
                      {k.environment}
                    </Badge>
                  </div>

                  <span className="font-mono text-[10px] text-muted-foreground">
                    {k.used.toLocaleString()} / {k.limit.toLocaleString()} reqs
                  </span>
                </div>

                {/* Custom Styled Progress Bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
                  <div
                    className={`h-full transition-all duration-500 ${getProgressColor(pct)}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[9px] text-muted-foreground">
                    Resets in: <span className="font-semibold text-foreground">{k.resetHours} hours</span>
                  </span>

                  {/* Threshold trigger settings */}
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                      <MailWarning className="h-3 w-3" /> Email alert at 80%
                    </span>
                    <Switch checked={k.alertEnabled} onCheckedChange={() => toggleAlert(k.id)} className="scale-75" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Summary bottom bar */}
        <div className="mt-4 flex items-center justify-between border-border/40 border-t pt-4 text-[11px] text-muted-foreground">
          {keysAtRisk > 0 ? (
            <span className="flex animate-pulse items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-4 w-4" />
              {keysAtRisk} key approaching daily rate limit!
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              All rate keys operating safely.
            </span>
          )}
          <span className="flex items-center gap-1">
            <BellRing className="h-3.5 w-3.5" /> Updates auto-syncing
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
