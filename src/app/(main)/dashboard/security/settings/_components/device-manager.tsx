"use client";

import { useState } from "react";

import { CheckCircle, Laptop, Phone, ShieldAlert, Tablet, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DeviceSession = {
  id: string;
  name: string;
  os: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  type: "desktop" | "mobile" | "tablet";
};

const INITIAL_SESSIONS: DeviceSession[] = [
  {
    id: "1",
    name: "Apple MacBook Pro 16",
    os: "macOS 14.4",
    browser: "Chrome 124.0.0",
    ip: "192.168.1.84",
    location: "San Francisco, CA (US)",
    lastActive: "Active Now",
    isCurrent: true,
    type: "desktop",
  },
  {
    id: "2",
    name: "iPhone 15 Pro Max",
    os: "iOS 17.3",
    browser: "Safari Mobile",
    ip: "84.20.11.90",
    location: "San Francisco, CA (US)",
    lastActive: "12 mins ago",
    isCurrent: false,
    type: "mobile",
  },
  {
    id: "3",
    name: "Lenovo ThinkPad X1 Carbon",
    os: "Windows 11 Enterprise",
    browser: "Firefox 125.0",
    ip: "10.0.0.42",
    location: "London (UK)",
    lastActive: "2 hours ago",
    isCurrent: false,
    type: "desktop",
  },
  {
    id: "4",
    name: "Apple iPad Pro 11",
    os: "iPadOS 17.2",
    browser: "Safari Mobile",
    ip: "172.16.2.14",
    location: "San Francisco, CA (US)",
    lastActive: "3 days ago",
    isCurrent: false,
    type: "tablet",
  },
];

const SECURITY_ALERTS = [
  {
    id: "1",
    type: "New Device Login",
    details: "Authorized login from Apple iPad Pro 11 under browser footprint.",
    date: "May 26, 2026",
    resolved: false,
  },
  {
    id: "2",
    type: "Location Shift",
    details: "Subnet shift detected. Lenovo ThinkPad connected from London (UK) network.",
    date: "May 25, 2026",
    resolved: true,
  },
];

export function DeviceManager() {
  const [sessions, setSessions] = useState<DeviceSession[]>(INITIAL_SESSIONS);
  const [alerts, setAlerts] = useState(SECURITY_ALERTS);

  const revokeSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const revokeAllOthers = () => {
    setSessions(sessions.filter((s) => s.isCurrent));
  };

  const resolveAlert = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
  };

  const getDeviceIcon = (type: string) => {
    if (type === "mobile") return Phone;
    if (type === "tablet") return Tablet;
    return Laptop;
  };

  return (
    <div className="space-y-6">
      {/* Active Device Sessions List */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
        <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 border-border/40 border-b pb-4">
          <div>
            <CardTitle className="flex items-center gap-2 font-semibold text-lg tracking-tight">
              <Laptop className="h-4.5 w-4.5 text-primary" />
              Active Login Sessions
            </CardTitle>
            <CardDescription className="text-xs">
              Monitor browser sessions currently logged into this workspace console.
            </CardDescription>
          </div>
          {sessions.length > 1 && (
            <Button
              onClick={revokeAllOthers}
              variant="outline"
              size="sm"
              className="h-8.5 border-rose-500/20 px-3 font-semibold text-rose-600 text-xs hover:bg-rose-500/10 hover:text-rose-700"
            >
              Revoke Other Sessions
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-3.5 pt-2">
          {sessions.map((s) => {
            const DeviceIcon = getDeviceIcon(s.type);
            return (
              <div
                key={s.id}
                className="flex items-start justify-between rounded-lg border border-border/50 bg-background/50 p-4 transition-all hover:border-primary/10"
              >
                <div className="flex items-start gap-3.5 pr-2">
                  <div className={`mt-0.5 shrink-0 rounded-lg bg-muted/40 p-2 text-foreground`}>
                    <DeviceIcon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-xs leading-none">{s.name}</span>
                      {s.isCurrent ? (
                        <Badge className="h-4.5 border-none bg-emerald-500/10 font-semibold text-[8px] text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                          Current Session
                        </Badge>
                      ) : (
                        <span className="font-medium font-mono text-[10px] text-muted-foreground">{s.lastActive}</span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {s.browser} • {s.os} • IP: <span className="font-mono text-[9.5px]">{s.ip}</span>
                    </p>
                    <span className="block font-medium text-[9px] text-muted-foreground">Location: {s.location}</span>
                  </div>
                </div>

                {!s.isCurrent && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => revokeSession(s.id)}
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Revoke Session"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Warning Incident Log */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
        <CardHeader className="mb-4 border-border/40 border-b pb-3">
          <CardTitle className="flex items-center gap-1.5 font-semibold text-sm tracking-tight">
            <ShieldAlert className="h-4 w-4 text-primary" />
            {"Security Incident Logs (Auto-Audited)"}
          </CardTitle>
          <CardDescription className="text-[11px]">
            Timeline of recent suspicious sessions or multi-factor authentication locks.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {alerts.map((a) => {
            return (
              <div
                key={a.id}
                className={`flex items-start justify-between gap-4 rounded-lg border p-4 transition-all hover:bg-background ${
                  a.resolved
                    ? "border-border/50 bg-background/30 opacity-70"
                    : "border-amber-500/20 bg-amber-500/[0.01]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 shrink-0 rounded-full p-1.5 ${
                      a.resolved ? "bg-muted text-muted-foreground" : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-xs leading-none">{a.type}</span>
                      <Badge
                        variant="outline"
                        className={`h-4.5 px-1.5 font-semibold text-[8px] uppercase ${
                          a.resolved
                            ? "border-muted bg-muted text-muted-foreground"
                            : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {a.resolved ? "Resolved" : "Active Audit"}
                      </Badge>
                    </div>
                    <p className="pr-2 text-[10px] text-muted-foreground leading-relaxed">{a.details}</p>
                    <span className="block font-mono text-[9px] text-muted-foreground">Logged: {a.date}</span>
                  </div>
                </div>

                {!a.resolved && (
                  <Button
                    onClick={() => resolveAlert(a.id)}
                    variant="outline"
                    size="sm"
                    className="h-7 border-border/60 px-2 text-[10px] hover:bg-muted"
                  >
                    <CheckCircle className="mr-1 h-3.5 w-3.5" /> Dismiss
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
