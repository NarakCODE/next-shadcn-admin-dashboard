"use client";

import { useState } from "react";

import { AlertCircle, Check, FileCheck, Save, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

type Framework = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  complianceCode: string;
};

const INITIAL_FRAMEWORKS: Framework[] = [
  {
    id: "gdpr",
    name: "GDPR Alignment Policy",
    description: "Enforces cookie consent policies, EU cookie bounds, and right-to-be-forgotten eraser scripts.",
    enabled: true,
    complianceCode: "EU 2016/679",
  },
  {
    id: "soc2",
    name: "SOC 2 Type II Auditing",
    description:
      "Secures infrastructure with active network audit logs, access logs, and regular intrusion monitoring.",
    enabled: true,
    complianceCode: "AICPA Trust Service",
  },
  {
    id: "hipaa",
    name: "HIPAA Patient Protection",
    description:
      "Protects electronic Protected Health Information (ePHI) with secure end-to-end TLS payload encryption.",
    enabled: false,
    complianceCode: "45 CFR Part 160",
  },
  {
    id: "iso27001",
    name: "ISO/IEC 27001 Standard",
    description: "Global standard tracking information asset protection protocols and routine penetration audits.",
    enabled: false,
    complianceCode: "ISO 27001:2022",
  },
];

export function ComplianceSettings() {
  const [frameworks, setFrameworks] = useState<Framework[]>(INITIAL_FRAMEWORKS);
  const [residency, setResidency] = useState("us-east");
  const [logRetention, setLogRetention] = useState<number>(90); // default 90 days retention
  const [backupRetention, setBackupRetention] = useState<number>(365); // default 1 year
  const [anonymizeLogs, setAnonymizeLogs] = useState(true);

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

  const toggleFramework = (id: string) => {
    setFrameworks(frameworks.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader className="mb-5 flex flex-row items-center justify-between space-y-0 border-border/40 border-b pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <ShieldCheck className="h-4.5 w-4.5 text-primary" />
            Compliance, Auditing & Privacy
          </CardTitle>
          <CardDescription className="text-xs">
            Govern workspace regulatory frameworks, cloud data residency hubs, and log retention spans.
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
              <Check className="h-3.5 w-3.5" /> Compliance Configured
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" /> Save Policies
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Compliance Frameworks Toggles */}
        <div className="space-y-3">
          <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Regulatory Standards
          </Label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {frameworks.map((f) => (
              <div
                key={f.id}
                className="flex items-start gap-4 rounded-lg border border-border/50 bg-background/50 p-4 transition-colors hover:border-primary/10"
              >
                <div
                  className={`mt-0.5 shrink-0 rounded-full p-2 ${
                    f.enabled ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <FileCheck className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground text-xs leading-none">{f.name}</span>
                    <Badge
                      variant="outline"
                      className={`h-4.5 border-none px-1.5 font-semibold text-[8px] uppercase ${
                        f.enabled
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {f.enabled ? "Enforced" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{f.description}</p>
                  <span className="block pt-0.5 font-mono text-[8px] text-muted-foreground uppercase tracking-tight">
                    Standard: {f.complianceCode}
                  </span>
                </div>
                <Switch
                  checked={f.enabled}
                  onCheckedChange={() => toggleFramework(f.id)}
                  className="mt-0.5 ml-1 shrink-0 scale-75"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Cloud Data Residency */}
        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
          <div className="space-y-3 rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="space-y-0.5">
              <Label className="font-semibold text-xs">Primary Data Residency Hub</Label>
              <p className="text-[10px] text-muted-foreground">
                Select physical cloud region cluster hosting databases.
              </p>
            </div>
            <Select value={residency} onValueChange={setResidency}>
              <SelectTrigger className="h-9 w-full border-border/50 bg-background text-xs">
                <SelectValue placeholder="Select region cluster" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="us-east">US East Cluster (N. Virginia)</SelectItem>
                  <SelectItem value="eu-central">EU Central Cluster (Frankfurt)</SelectItem>
                  <SelectItem value="apac-sing">APAC Southeast Cluster (Singapore)</SelectItem>
                  <SelectItem value="global-hybrid">Global Hybrid Mesh Network</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col justify-between gap-3 rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-semibold text-xs">Anonymize Log IP Addresses</Label>
                <p className="text-[10px] text-muted-foreground">Appends obfuscation masks onto user logging traces.</p>
              </div>
              <Switch checked={anonymizeLogs} onCheckedChange={setAnonymizeLogs} className="shrink-0 scale-75" />
            </div>
            <span className="block text-[9px] text-muted-foreground leading-normal">
              * Active masking strips the last octet from client IP strings (e.g. 192.168.1.xxx) inside auditing files.
            </span>
          </div>
        </div>

        {/* Data Retention Sliders */}
        <div className="space-y-4 pt-2">
          <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Storage Retention Periods
          </Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Audit Log Retention */}
            <div className="space-y-3 rounded-lg border border-border/50 bg-background/30 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Audit & Activity Log Span</span>
                <span className="rounded bg-primary/5 px-2 py-0.5 font-bold font-mono text-primary text-xs">
                  {logRetention} days
                </span>
              </div>
              <Slider
                min={30}
                max={365}
                step={30}
                value={[logRetention]}
                onValueChange={(val) => setLogRetention(val[0])}
                className="py-1"
              />
            </div>

            {/* Backups Retention */}
            <div className="space-y-3 rounded-lg border border-border/50 bg-background/30 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Cloud Backups Retention</span>
                <span className="rounded bg-primary/5 px-2 py-0.5 font-bold font-mono text-primary text-xs">
                  {backupRetention} days
                </span>
              </div>
              <Slider
                min={90}
                max={730}
                step={30}
                value={[backupRetention]}
                onValueChange={(val) => setBackupRetention(val[0])}
                className="py-1"
              />
            </div>
          </div>
        </div>

        {/* User erasure requests */}
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/10 bg-amber-500/5 p-3.5">
          <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-500" />
          <div className="space-y-0.5 text-muted-foreground text-xs leading-normal">
            <span className="flex items-center gap-1 font-semibold text-foreground">
              GDPR Right-to-Erasure Erasures Pending
            </span>
            <p className="text-[10px] leading-relaxed">
              There are currently <span className="font-bold text-foreground">3 active deletion requests</span> in
              queue. GDPR limits compliance execution to 30 days. Action immediately via the Data Management settings.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
