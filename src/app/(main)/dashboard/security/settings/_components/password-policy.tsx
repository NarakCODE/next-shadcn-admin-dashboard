"use client";

import { useState } from "react";

import { Check, Lock, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export function PasswordPolicy() {
  const [minLength, setMinLength] = useState<number>(12);
  const [requireUpper, setRequireUpper] = useState(true);
  const [requireLower, setRequireLower] = useState(true);
  const [requireNumber, setRequireNumber] = useState(true);
  const [requireSymbol, setRequireSymbol] = useState(true);
  const [noDictWords, setNoDictWords] = useState(true);

  const [historyCount, setHistoryCount] = useState<number>(6);
  const [expiryDays, setExpiryDays] = useState("90");
  const [lockoutAttempts, setLockoutAttempts] = useState("5");
  const [lockoutMinutes, setLockoutMinutes] = useState("30");

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

  // Calculates password strength indicator based on requirements
  const getStrengthPercent = () => {
    let score = 0;
    if (minLength >= 8) score += 20;
    if (minLength >= 12) score += 10;
    if (requireUpper) score += 15;
    if (requireLower) score += 10;
    if (requireNumber) score += 15;
    if (requireSymbol) score += 15;
    if (noDictWords) score += 15;
    return score;
  };

  const strength = getStrengthPercent();

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader className="mb-5 flex flex-row items-center justify-between space-y-0 border-border/40 border-b pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <Lock className="h-4.5 w-4.5 text-primary" />
            Workspace Password Policy
          </CardTitle>
          <CardDescription className="text-xs">
            Enforce complexity requirements, history prevention, and lockout policies for member logins.
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
        {/* Min Length Slider */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Minimum Character Length
            </Label>
            <span className="rounded border border-primary/10 bg-primary/5 px-2 py-0.5 font-bold font-mono text-primary text-xs">
              {minLength} characters
            </span>
          </div>

          <Slider
            min={8}
            max={32}
            step={1}
            value={[minLength]}
            onValueChange={(val) => setMinLength(val[0])}
            className="py-1"
          />

          <div className="flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>8 (Weak)</span>
            <span>12 (Strong)</span>
            <span>16 (Enterprise)</span>
            <span>24</span>
            <span>32 characters</span>
          </div>
        </div>

        {/* Complexity Grid */}
        <div className="space-y-2.5 pt-1">
          <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Complexity Rules
          </Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              { label: "Require Uppercase", val: requireUpper, set: setRequireUpper },
              { label: "Require Lowercase", val: requireLower, set: setRequireLower },
              { label: "Require Numbers", val: requireNumber, set: setRequireNumber },
              { label: "Require Special Symbol", val: requireSymbol, set: setRequireSymbol },
              { label: "Ban Dictionary Words", val: noDictWords, set: setNoDictWords },
            ].map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-2.5"
              >
                <span className="font-medium text-foreground text-xs">{c.label}</span>
                <Switch checked={c.val} onCheckedChange={c.set} className="scale-75" />
              </div>
            ))}
          </div>
        </div>

        {/* Password History & Expiration */}
        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
          {/* Prevent History */}
          <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="space-y-0.5">
              <Label className="font-semibold text-xs">Prevent Password Reuse</Label>
              <p className="text-[10px] text-muted-foreground">Keep history of previous passes to block reuse.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHistoryCount(Math.max(1, historyCount - 1))}
                className="h-8 w-8 shrink-0 rounded border border-border/60 bg-background font-bold text-xs hover:bg-muted"
              >
                -
              </button>
              <span className="w-12 text-center font-bold font-mono text-foreground text-sm">Last {historyCount}</span>
              <button
                type="button"
                onClick={() => setHistoryCount(Math.min(24, historyCount + 1))}
                className="h-8 w-8 shrink-0 rounded border border-border/60 bg-background font-bold text-xs hover:bg-muted"
              >
                +
              </button>
            </div>
          </div>

          {/* Expiration Days */}
          <div className="flex flex-col justify-between gap-3 rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="space-y-0.5">
              <Label className="font-semibold text-xs">Password Expiration Interval</Label>
              <p className="text-[10px] text-muted-foreground">Forces users to rotate passwords periodically.</p>
            </div>
            <RadioGroup value={expiryDays} onValueChange={setExpiryDays} className="flex gap-4">
              {[
                { val: "never", label: "Never" },
                { val: "60", label: "60 days" },
                { val: "90", label: "90 days" },
                { val: "180", label: "180 days" },
              ].map((r) => (
                <label
                  key={r.val}
                  className="flex cursor-pointer items-center gap-1.5 font-semibold text-muted-foreground text-xs hover:text-foreground"
                >
                  <RadioGroupItem value={r.val} className="scale-75" />
                  {r.label}
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* Lockout Attempt limits */}
        <div className="space-y-3 pt-2">
          <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Account Lockout Protocol
          </Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-3">
              <div className="space-y-0.5 pr-2">
                <span className="font-semibold text-foreground text-xs">Lockout Attempt Limit</span>
                <p className="text-[10px] text-muted-foreground">Consecutive failed entries allowed before lock.</p>
              </div>
              <input
                type="number"
                value={lockoutAttempts}
                onChange={(e) => setLockoutAttempts(e.target.value)}
                className="h-8 w-16 rounded border border-border/60 bg-background text-center font-mono font-semibold text-xs"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-3">
              <div className="space-y-0.5 pr-2">
                <span className="font-semibold text-foreground text-xs">Lockout Active Duration</span>
                <p className="text-[10px] text-muted-foreground">Locked time duration in minutes.</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={lockoutMinutes}
                  onChange={(e) => setLockoutMinutes(e.target.value)}
                  className="h-8 w-16 rounded border border-border/60 bg-background text-center font-mono font-semibold text-xs"
                />
                <span className="text-[10px] text-muted-foreground">min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Strength Preview */}
        <div className="space-y-3 rounded-lg border border-border/50 bg-muted/15 p-4.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground">Enforced Policy Rating:</span>
            <span
              className={`font-bold uppercase ${
                strength > 85
                  ? "text-emerald-600 dark:text-emerald-400"
                  : strength > 60
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {strength > 85 ? "Excellent (PCI Compliant)" : strength > 60 ? "Good" : "Weak Policy"}
            </span>
          </div>
          <Progress value={strength} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
