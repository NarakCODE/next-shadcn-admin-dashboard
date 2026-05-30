"use client";

import { useState } from "react";

import { ArrowRight, Database, Mail, MessageSquare, RefreshCw, Search, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { Input } from "@/components/ui/input";

type Template = {
  id: string;
  name: string;
  category: "sync" | "notify" | "auto" | "crm";
  description: string;
  icon: any;
  color: string;
};

const TEMPLATES: Template[] = [
  {
    id: "temp-1",
    name: "Salesforce CRM Lead Sync",
    category: "crm",
    description: "Sync leads from incoming API webhooks to Salesforce contacts automatically.",
    icon: Database,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "temp-2",
    name: "Slack Channel Notification",
    category: "notify",
    description: "Post a message to your specified Slack channel on user milestone conversion events.",
    icon: MessageSquare,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    id: "temp-3",
    name: "HubSpot Marketing Sync",
    category: "crm",
    description: "Sync active dashboard contact updates straight into HubSpot lists.",
    icon: RefreshCw,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    id: "temp-4",
    name: "Stripe Invoice Event Trigger",
    category: "auto",
    description: "Email invoice payment notifications directly via transactional Mailgun hooks.",
    icon: ShieldCheck,
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    id: "temp-5",
    name: "Google Sheets Data Append",
    category: "sync",
    description: "Append custom log events as a new row to Google Sheets via secure workflow.",
    icon: Zap,
    color: "bg-teal-500/10 text-teal-500",
  },
  {
    id: "temp-6",
    name: "Mailchimp Newsletter Opt-in",
    category: "notify",
    description: "Auto-add new registered dashboard accounts to your designated Mailchimp audience list.",
    icon: Mail,
    color: "bg-amber-500/10 text-amber-500",
  },
];

type Props = {
  onSelectTemplate: (templateName: string) => void;
};

export function IntegrationTemplates({ onSelectTemplate }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = TEMPLATES.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "all" || t.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex h-full flex-col gap-4 border-border/40 border-r pr-4">
      <div className="space-y-1 pb-1">
        <h3 className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          Integration Recipes
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Quickly bootstrap your custom workflow builder using one of our verified templates.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8.5 border-border/50 bg-background pl-8 text-xs"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1">
        {["all", "sync", "notify", "auto", "crm"].map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`rounded-md border px-2.5 py-1 font-semibold text-[10px] capitalize transition-all ${
              activeCategory === c
                ? "border-primary bg-primary text-primary-foreground shadow-xs"
                : "border-border/50 bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Recipes list */}
      <div className="flex max-h-[460px] flex-col gap-2 overflow-y-auto pr-1">
        {filtered.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.id}
              onClick={() => onSelectTemplate(t.name)}
              className="group flex cursor-pointer items-start gap-3 rounded-lg border border-border/40 bg-muted/10 p-3 transition-all duration-200 hover:border-primary/30 hover:bg-background"
            >
              <div className={`mt-0.5 shrink-0 rounded-lg p-1.5 ${t.color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="truncate font-semibold text-foreground text-xs leading-tight transition-colors group-hover:text-primary">
                    {t.name}
                  </h4>
                  <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100" />
                </div>
                <p className="line-clamp-2 text-[10px] text-muted-foreground leading-relaxed">{t.description}</p>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-lg border border-border/40 border-dashed py-8 text-center text-muted-foreground text-xs">
            No recipes matched.
          </div>
        )}
      </div>
    </div>
  );
}
