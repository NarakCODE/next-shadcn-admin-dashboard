"use client";

import { useState } from "react";

import { Check, Clock, Save, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const TIMEOUT_LABELS = ["1 hour", "4 hours", "8 hours", "1 day", "7 days", "30 days"];

export function SessionPolicy() {
  const [timeoutIdx, setTimeoutIdx] = useState<number>(3); // default 1 day
  const [concurrentLimit, setConcurrentLimit] = useState<number>(3);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [rememberDays, setRememberDays] = useState("30");
  const [idleTimeout, setIdleTimeout] = useState(true);
  const [idleMinutes, setIdleMinutes] = useState("15");

  const [mfaSensitive, setMfaSensitive] = useState(true);
  const [mfaIpChange, setMfaIpChange] = useState(true);
  const [mfaNewDevice, setMfaNewDevice] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1200);
  };

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader className="mb-5 flex flex-row items-center justify-between space-y-0 border-border/40 border-b pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <Clock className="h-4.5 w-4.5 text-primary" />
            Active Session Governance
          </CardTitle>
          <CardDescription className="text-xs">
            Govern user login sessions, idle exclusions, and multi-factor re-verification checks.
          </CardDescription>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="sm"
          className="flex h-8.5 items-center gap-1.5 px-4 font-semibold text-xs shadow-xs"
        >
          {saved ? (
            <>
              <Check className="h-3.5 w-3.5" /> Policy Updated
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" /> Update Policy
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Session Timeout Slider */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Session Lifespan Limit
            </Label>
            <span className="rounded border border-primary/10 bg-primary/5 px-2 py-0.5 font-bold font-mono text-primary text-xs">
              {TIMEOUT_LABELS[timeoutIdx]}
            </span>
          </div>

          <Slider
            min={0}
            max={5}
            step={1}
            value={[timeoutIdx]}
            onValueChange={(val) => setTimeoutIdx(val[0])}
            className="py-1"
          />

          <div className="flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>1hr</span>
            <span>4hr</span>
            <span>8hr</span>
            <span>1d</span>
            <span>7d</span>
            <span>30d</span>
          </div>
        </div>

        {/* Core Constraints */}
        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
          {/* Concurrent Sessions */}
          <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="space-y-0.5">
              <Label className="font-semibold text-xs">Concurrent Limit</Label>
              <p className="text-[10px] text-muted-foreground">Maximum simultaneous logins per user account.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConcurrentLimit(Math.max(1, concurrentLimit - 1))}
                className="h-8 w-8 shrink-0 rounded border border-border/60 bg-background font-bold text-xs hover:bg-muted"
              >
                -
              </button>
              <span className="w-12 text-center font-bold font-mono text-foreground text-sm">
                {concurrentLimit === 10 ? "Unlimited" : concurrentLimit}
              </span>
              <button
                type="button"
                onClick={() => setConcurrentLimit(Math.min(10, concurrentLimit + 1))}
                className="h-8 w-8 shrink-0 rounded border border-border/60 bg-background font-bold text-xs hover:bg-muted"
              >
                +
              </button>
            </div>
          </div>

          {/* Idle Timeout */}
          <div className="flex flex-col justify-between gap-3 rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-semibold text-xs">Idle Exclusions</Label>
                <p className="text-[10px] text-muted-foreground">Auto-logout if user is inactive.</p>
              </div>
              <Switch checked={idleTimeout} onCheckedChange={setIdleTimeout} className="scale-75" />
            </div>
            {idleTimeout && (
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-[10px] text-muted-foreground">Timeout after:</span>
                <input
                  type="number"
                  value={idleMinutes}
                  onChange={(e) => setIdleMinutes(e.target.value)}
                  className="h-8 w-16 rounded border border-border/60 bg-background text-center font-mono font-semibold text-xs"
                />
                <span className="text-[10px] text-muted-foreground">minutes</span>
              </div>
            )}
          </div>
        </div>

        {/* Remember Device & Re-authentication */}
        <div className="space-y-3 pt-2">
          <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Device Recall & Verification Policy
          </Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-3">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground text-xs">Remember Trusted Devices</span>
                <p className="text-[10px] text-muted-foreground">
                  Allows users to skip 2FA verification on trusted browser footprints.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {rememberDevice && (
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <input
                      type="number"
                      value={rememberDays}
                      onChange={(e) => setRememberDays(e.target.value)}
                      className="h-8 w-12 rounded border border-border/60 bg-background text-center font-mono font-semibold text-xs"
                    />
                    <span className="text-[9px]">days</span>
                  </div>
                )}
                <Switch checked={rememberDevice} onCheckedChange={setRememberDevice} className="scale-75" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-3">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground text-xs">Force re-auth on Sensitive Actions</span>
                <p className="text-[10px] text-muted-foreground">
                  Prompt password or 2FA when changing keys, billing, or security settings.
                </p>
              </div>
              <Switch checked={mfaSensitive} onCheckedChange={setMfaSensitive} className="scale-75" />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-3">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground text-xs">Force re-auth on IP Address changes</span>
                <p className="text-[10px] text-muted-foreground">
                  Triggers authentication immediately if the connection IP subnet varies.
                </p>
              </div>
              <Switch checked={mfaIpChange} onCheckedChange={setMfaIpChange} className="scale-75" />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-3">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground text-xs">Verify login on New Device footprints</span>
                <p className="text-[10px] text-muted-foreground">
                  Deliver verification codes when browser, OS, or screen metadata changes.
                </p>
              </div>
              <Switch checked={mfaNewDevice} onCheckedChange={setMfaNewDevice} className="scale-75" />
            </div>
          </div>
        </div>

        {/* Current status info */}
        <div className="flex items-start gap-2.5 rounded-lg border border-indigo-500/10 bg-indigo-500/5 p-3">
          <ShieldAlert className="mt-0.5 h-4.5 w-4.5 shrink-0 text-indigo-500" />
          <div className="space-y-0.5 text-[10px] text-muted-foreground leading-normal">
            <span className="font-semibold text-foreground">Active Session Monitoring Active</span>
            <p>
              There are currently <span className="font-semibold text-foreground">3 active sessions</span> across 2
              distinct device nodes. Unused or deprecated tokens are garbage collected daily.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
