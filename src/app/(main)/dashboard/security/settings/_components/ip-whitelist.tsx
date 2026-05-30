"use client";

import { useState } from "react";

import { AlertTriangle, Globe, Plus, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type IpRule = {
  id: string;
  ip: string;
  description: string;
  status: "active" | "inactive";
  lastUsed: string;
  addedBy: string;
};

const INITIAL_RULES: IpRule[] = [
  {
    id: "1",
    ip: "192.168.1.0/24",
    description: "Office Corporate Network",
    status: "active",
    lastUsed: "May 29, 2026",
    addedBy: "Aiy",
  },
  {
    id: "2",
    ip: "10.0.0.1/32",
    description: "Production Deployment CI/CD Server",
    status: "active",
    lastUsed: "May 28, 2026",
    addedBy: "Aiy",
  },
  {
    id: "3",
    ip: "84.120.45.19",
    description: "Executive VPN Access Gateway",
    status: "active",
    lastUsed: "May 29, 2026",
    addedBy: "Sarah Connor",
  },
  {
    id: "4",
    ip: "172.16.8.0/20",
    description: "Customer Support Subnet",
    status: "inactive",
    lastUsed: "Never",
    addedBy: "Sarah Connor",
  },
];

const REGIONS = [
  { id: "us", label: "Americas (US, CA, MX)", flag: "🇺🇸", enabled: true },
  { id: "eu", label: "Europe (UK, DE, FR, NL)", flag: "🇪🇺", enabled: true },
  { id: "apac", label: "Asia Pacific (SG, JP, AU)", flag: "🇯🇵", enabled: true },
  { id: "me", label: "Middle East & Africa (ZA, AE)", flag: "🇿🇦", enabled: false },
];

export function IpWhitelist() {
  const [rules, setRules] = useState<IpRule[]>(INITIAL_RULES);
  const [regions, setRegions] = useState(REGIONS);

  // Dialog Add State
  const [ipInput, setIpInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const toggleRegion = (id: string) => {
    setRegions(regions.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const handleAddRule = () => {
    if (!ipInput) return;
    const newRule: IpRule = {
      id: Math.random().toString(),
      ip: ipInput,
      description: descInput || "Custom IP Whitelist Rule",
      status: "active",
      lastUsed: "Never",
      addedBy: "Aiy",
    };
    setRules([...rules, newRule]);
    setIpInput("");
    setDescInput("");
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    setRules(rules.filter((r) => r.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Whitelist Rules Card */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
        <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 border-border/40 border-b pb-4">
          <div>
            <CardTitle className="flex items-center gap-2 font-semibold text-lg tracking-tight">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" />
              IP Whitelist & Rules Setup
            </CardTitle>
            <CardDescription className="text-xs">
              Restrict console and API connections to specific verified IP ranges.
            </CardDescription>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8.5 px-3 font-semibold text-xs shadow-xs">
                <Plus className="mr-1 h-4 w-4" /> Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm border-border/60 bg-popover">
              <DialogHeader>
                <DialogTitle className="font-semibold text-sm">Add Allowed IP Rule</DialogTitle>
                <DialogDescription className="text-xs">
                  Enter an IP address or a standard CIDR block to authorize access.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ip-block" className="font-semibold text-xs">
                    IP Address / CIDR Block
                  </Label>
                  <Input
                    id="ip-block"
                    placeholder="e.g. 192.168.1.1 or 10.0.0.0/24"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    className="h-9.5 border-border/50 bg-background font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ip-desc" className="font-semibold text-xs">
                    Rule Friendly Description
                  </Label>
                  <Input
                    id="ip-desc"
                    placeholder="e.g. London Office Network"
                    value={descInput}
                    onChange={(e) => setDescInput(e.target.value)}
                    className="h-9.5 border-border/50 bg-background text-xs"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddRule} className="h-9.5 w-full font-semibold text-xs shadow-sm">
                  Add to Whitelist
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-border/40 border-b bg-muted/20 text-left text-muted-foreground">
                  <th className="p-3 font-semibold">IP Range / CIDR</th>
                  <th className="p-3 font-semibold">Description</th>
                  <th className="w-24 p-3 text-center font-semibold">Status</th>
                  <th className="p-3 font-semibold">Last Used</th>
                  <th className="p-3 font-semibold">Added By</th>
                  <th className="w-20 p-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {rules.map((r) => (
                  <tr key={r.id} className="text-foreground transition-colors hover:bg-muted/10">
                    <td className="p-3 font-mono font-semibold text-[11px]">{r.ip}</td>
                    <td className="p-3 text-muted-foreground">{r.description}</td>
                    <td className="p-3 text-center">
                      <Badge
                        variant="outline"
                        className={`h-4.5 border-none px-2 font-semibold text-[9px] ${
                          r.status === "active"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{r.lastUsed}</td>
                    <td className="p-3 font-medium">{r.addedBy}</td>
                    <td className="p-3 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(r.id)}
                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove allowed IP"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm border-border/60 bg-popover">
          <DialogHeader>
            <DialogTitle className="font-semibold text-sm">Confirm IP Removal</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to remove this IP range from the whitelist? Requests from this source will be
              blocked.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="ghost" onClick={() => setDeleteId(null)} className="h-9.5 text-xs">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="h-9.5 px-4 font-semibold text-xs shadow-sm"
            >
              Confirm Removal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Geographic Restrictions Card */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5 font-semibold text-sm tracking-tight">
            <Globe className="h-4 w-4 text-primary" />
            Geographic Access Restrictions
          </CardTitle>
          <CardDescription className="text-[11px]">
            Restrict login access to users connecting from authorized geographic locations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {regions.map((reg) => (
              <div
                key={reg.id}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3"
              >
                <div className="flex items-center gap-3 pr-2">
                  <span className="shrink-0 text-xl">{reg.flag}</span>
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground text-xs">{reg.label}</span>
                    <p className="text-[9px] text-muted-foreground capitalize">
                      {reg.enabled ? "Authorized access region" : "Access blocked from zone"}
                    </p>
                  </div>
                </div>
                <Switch checked={reg.enabled} onCheckedChange={() => toggleRegion(reg.id)} className="scale-75" />
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-amber-500/10 bg-amber-500/5 p-3.5">
            <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-500" />
            <div className="space-y-0.5 text-muted-foreground text-xs leading-relaxed">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500" /> Geographic Lock enabled
              </span>
              <p className="text-[10px]">
                Users attempting to log in from countries not in authorized zones will trigger high-priority push
                security alerts and experience dynamic IP blocking.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
