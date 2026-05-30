"use client";

import { useState } from "react";

import { ArrowRight, BarChart3, Check, DollarSign, FileText, Search, Sparkles, TrendingUp, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Template = {
  id: string;
  name: string;
  description: string;
  category: "traffic" | "conversion" | "revenue" | "audience";
  tags: string[];
  gradient: string;
  icon: any;
};

const TEMPLATES: Template[] = [
  {
    id: "temp-1",
    name: "Traffic Acquisition Overview",
    description: "Detailed breakdown of channels, landing pages, referrers, and campaign sources.",
    category: "traffic",
    tags: ["Acquisition", "Popular"],
    gradient: "from-blue-500/20 to-cyan-500/20",
    icon: TrendingUp,
  },
  {
    id: "temp-2",
    name: "E-commerce Conversion Funnel",
    description: "Visualises shopper progression from pageview to cart add to final checkout success.",
    category: "conversion",
    tags: ["Sales", "Funnel"],
    gradient: "from-emerald-500/20 to-teal-500/20",
    icon: BarChart3,
  },
  {
    id: "temp-3",
    name: "Audience Demographics & Cohorts",
    description: "Geographic locations, device profiles, system environments, and retention behavior.",
    category: "audience",
    tags: ["Demographics", "Cohorts"],
    gradient: "from-purple-500/20 to-pink-500/20",
    icon: Users,
  },
  {
    id: "temp-4",
    name: "Monthly Billing & Revenue Summary",
    description: "Calculates MRR progression, subscriber LTV, churn rate, and overage billing estimates.",
    category: "revenue",
    tags: ["Finance", "MRR"],
    gradient: "from-amber-500/20 to-orange-500/20",
    icon: DollarSign,
  },
  {
    id: "temp-5",
    name: "SEO Performance & Keyword Mapping",
    description: "Tracks search engine impressions, click-through-rates, and ranking variations over time.",
    category: "traffic",
    tags: ["SEO", "Organic"],
    gradient: "from-indigo-500/20 to-violet-500/20",
    icon: Search,
  },
  {
    id: "temp-6",
    name: "Custom KPI Executive Dashboard",
    description: "High-level summary of conversion multipliers, average order values, and marketing efficiency.",
    category: "conversion",
    tags: ["Executive", "KPIs"],
    gradient: "from-rose-500/20 to-red-500/20",
    icon: Sparkles,
  },
];

export function ReportTemplates() {
  const [filter, setFilter] = useState<string>("all");
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  const filteredTemplates = TEMPLATES.filter((t) => filter === "all" || t.category === filter);

  const handleUse = (id: string) => {
    setActiveTemplate(id);
    setTimeout(() => setActiveTemplate(null), 2500);
  };

  return (
    <Card className="flex h-full flex-col border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 font-semibold text-lg tracking-tight">
              <FileText className="h-4.5 w-4.5 text-primary" />
              Report Templates Library
            </CardTitle>
            <CardDescription className="text-xs">
              Kickstart custom metrics reporting with professionally configured layout models.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-5">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 border-border/40 border-b pb-3">
          {["all", "traffic", "conversion", "revenue", "audience"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-md px-3 py-1.5 font-semibold text-xs capitalize transition-all ${
                filter === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredTemplates.map((t) => {
            const Icon = t.icon;
            const isUsing = activeTemplate === t.id;
            return (
              <div
                key={t.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border/40 bg-background/50 p-4 transition-all duration-300 hover:border-primary/30"
              >
                {/* Background Gradient Circle */}
                <div
                  className={`absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br ${t.gradient} blur-lg transition-transform duration-300 group-hover:scale-125`}
                />

                <div className="relative space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg border border-border/50 bg-muted/40 p-2 text-foreground transition-colors group-hover:text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex gap-1">
                      {t.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="h-4.5 border-none px-2 font-semibold text-[9px]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground text-xs leading-tight transition-colors group-hover:text-primary">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{t.description}</p>
                  </div>
                </div>

                <div className="relative mt-auto pt-4">
                  <Button
                    onClick={() => handleUse(t.id)}
                    variant={isUsing ? "default" : "outline"}
                    className={`h-8.5 w-full font-medium text-xs ${
                      isUsing
                        ? "border-emerald-600 bg-emerald-600 hover:bg-emerald-600"
                        : "border-border/50 hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    {isUsing ? (
                      <>
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Active Layout
                      </>
                    ) : (
                      <>
                        Configure Template
                        <ArrowRight className="ml-1 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
