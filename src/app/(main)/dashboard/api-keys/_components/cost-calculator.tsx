"use client";

import { useState } from "react";

import { ArrowRight, DollarSign, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export function CostCalculator() {
  const [calls, setCalls] = useState<number>(150000); // default 150k calls
  const [includeStorage, setIncludeStorage] = useState(false);
  const [includeTeam, setIncludeTeam] = useState(false);

  // Calculates costs dynamically
  const getStarterCost = () => {
    // Starter limit: 1k/day = 30k/month
    const freeLimit = 30000;
    if (calls <= freeLimit) return 9; // starter base price
    // overage: $0.0005 per call
    const overage = (calls - freeLimit) * 0.0005;
    return Math.round(9 + overage);
  };

  const getProCost = () => {
    // Pro limit: 10k/day = 300k/month
    const freeLimit = 300000;
    let base = 29;
    if (includeStorage) base += 15;
    if (includeTeam) base += 20;

    if (calls <= freeLimit) return base;
    // overage: $0.0002 per call
    const overage = (calls - freeLimit) * 0.0002;
    return Math.round(base + overage);
  };

  const getEnterpriseCost = () => {
    // Unlimited calls included in base
    let base = 79;
    if (includeStorage) base += 25;
    if (includeTeam) base += 35;
    return base;
  };

  const starterCost = getStarterCost();
  const proCost = getProCost();
  const enterpriseCost = getEnterpriseCost();

  // Recommended tier detection
  const getRecommendedTier = () => {
    if (calls > 400000 || (includeStorage && includeTeam)) return "enterprise";
    if (calls > 30000) return "pro";
    return "starter";
  };

  const recommended = getRecommendedTier();
  const savings = Math.max(0, starterCost - proCost);

  return (
    <Card className="flex h-full flex-col justify-between border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <DollarSign className="h-4.5 w-4.5 text-primary" />
          Overage Cost Calculator
        </CardTitle>
        <CardDescription className="text-xs">
          Simulate monthly API request volume and forecast estimated billing costs across plan tiers.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Dynamic Slider */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Projected Monthly Requests
            </Label>
            <span className="rounded-md border border-primary/10 bg-primary/5 px-2 py-0.5 font-bold font-mono text-primary text-sm">
              {calls.toLocaleString()} calls
            </span>
          </div>

          <Slider
            min={10000}
            max={1000000}
            step={10000}
            value={[calls]}
            onValueChange={(val) => setCalls(val[0])}
            className="py-1"
          />

          <div className="flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>10k</span>
            <span>250k</span>
            <span>500k</span>
            <span>750k</span>
            <span>1M calls</span>
          </div>
        </div>

        {/* Extras Add-ons */}
        <div className="space-y-2.5 pt-1">
          <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Optional Features Add-on
          </Label>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/40 p-3">
              <div className="space-y-0.5 pr-2">
                <span className="font-semibold text-foreground text-xs">Advanced Storage</span>
                <p className="text-[9px] text-muted-foreground">Up to 100GB secure cloud storage.</p>
              </div>
              <Switch checked={includeStorage} onCheckedChange={setIncludeStorage} className="scale-75" />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/40 p-3">
              <div className="space-y-0.5 pr-2">
                <span className="font-semibold text-foreground text-xs">Expanded Team Space</span>
                <p className="text-[9px] text-muted-foreground">Adds 10 additional seat profiles.</p>
              </div>
              <Switch checked={includeTeam} onCheckedChange={setIncludeTeam} className="scale-75" />
            </div>
          </div>
        </div>

        {/* Pricing Matrix Comparisons */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {/* Starter Plan */}
          <div
            className={`flex flex-col justify-between gap-1 rounded-lg border p-3 transition-all ${
              recommended === "starter" ? "border-primary bg-primary/5 shadow-xs" : "border-border/50 bg-background/20"
            }`}
          >
            <div className="space-y-0.5">
              <span className="font-bold text-[10px] text-muted-foreground uppercase">Starter Plan</span>
              <div className="font-bold text-foreground text-xl tracking-tight">
                ${starterCost}
                <span className="font-normal text-[9px] text-muted-foreground">/mo</span>
              </div>
            </div>
            {recommended === "starter" && (
              <Badge className="h-4.5 w-fit border-none bg-primary/10 font-bold text-[8px] text-primary uppercase">
                Optimal
              </Badge>
            )}
          </div>

          {/* Pro Plan */}
          <div
            className={`flex flex-col justify-between gap-1 rounded-lg border p-3 transition-all ${
              recommended === "pro" ? "border-primary bg-primary/5 shadow-xs" : "border-border/50 bg-background/20"
            }`}
          >
            <div className="space-y-0.5">
              <span className="font-bold text-[10px] text-muted-foreground uppercase">Professional</span>
              <div className="font-bold text-foreground text-xl tracking-tight">
                ${proCost}
                <span className="font-normal text-[9px] text-muted-foreground">/mo</span>
              </div>
            </div>
            {recommended === "pro" && (
              <Badge className="h-4.5 w-fit border-none bg-primary/10 font-bold text-[8px] text-primary uppercase">
                Optimal
              </Badge>
            )}
          </div>

          {/* Enterprise Plan */}
          <div
            className={`flex flex-col justify-between gap-1 rounded-lg border p-3 transition-all ${
              recommended === "enterprise"
                ? "border-primary bg-primary/5 shadow-xs"
                : "border-border/50 bg-background/20"
            }`}
          >
            <div className="space-y-0.5">
              <span className="font-bold text-[10px] text-muted-foreground uppercase">Enterprise</span>
              <div className="font-bold text-foreground text-xl tracking-tight">
                ${enterpriseCost}
                <span className="font-normal text-[9px] text-muted-foreground">/mo</span>
              </div>
            </div>
            {recommended === "enterprise" && (
              <Badge className="h-4.5 w-fit border-none bg-primary/10 font-bold text-[8px] text-primary uppercase">
                Optimal
              </Badge>
            )}
          </div>
        </div>

        {/* Savings Callouts & Trial Action */}
        <div className="flex flex-col gap-3 border-border/40 border-t pt-2">
          {savings > 0 && (
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-3 text-muted-foreground text-xs">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-emerald-500" /> Save{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">${savings}/month</span> with
                Professional plan.
              </span>
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
            </div>
          )}

          <Button
            onClick={() => {
              window.location.href = "/dashboard/pricing";
            }}
            className="flex h-10 w-full items-center justify-center gap-1.5 font-semibold text-xs shadow-sm"
          >
            Upgrade subscription package
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
