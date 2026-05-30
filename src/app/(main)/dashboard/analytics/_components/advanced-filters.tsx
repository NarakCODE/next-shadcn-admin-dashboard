"use client";

import { useState } from "react";

import { Check, Filter, Plus, Sparkles, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FilterCondition = {
  id: string;
  dimension: string;
  operator: string;
  value: string;
};

const DIMENSIONS = [
  { value: "device", label: "Device Type" },
  { value: "country", label: "Country" },
  { value: "source", label: "Traffic Source" },
  { value: "browser", label: "Browser" },
  { value: "os", label: "Operating System" },
  { value: "page", label: "Landing Page" },
  { value: "campaign", label: "Campaign" },
];

const OPERATORS = [
  { value: "is", label: "is" },
  { value: "is_not", label: "is not" },
  { value: "contains", label: "contains" },
  { value: "starts_with", label: "starts with" },
];

export function AdvancedFilters() {
  const [conditions, setConditions] = useState<FilterCondition[]>([
    { id: "1", dimension: "device", operator: "is", value: "Mobile" },
    { id: "2", dimension: "country", operator: "is", value: "United States" },
  ]);

  const addCondition = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setConditions([...conditions, { id: newId, dimension: "device", operator: "is", value: "" }]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const updateCondition = (id: string, key: keyof FilterCondition, val: string) => {
    setConditions(conditions.map((c) => (c.id === id ? { ...c, [key]: val } : c)));
  };

  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <Filter className="h-4.5 w-4.5 text-primary" />
            Advanced Segment Builder
          </CardTitle>
          <CardDescription className="text-xs">
            Create highly-targeted segments using dynamic logic filters.
          </CardDescription>
        </div>
        <Badge variant="secondary" className="border-none bg-primary/10 font-medium text-primary hover:bg-primary/20">
          {conditions.length} Active Filters
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {conditions.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 bg-background/50 p-2.5"
            >
              <Select value={c.dimension} onValueChange={(val) => updateCondition(c.id, "dimension", val)}>
                <SelectTrigger className="w-[160px] bg-background">
                  <SelectValue placeholder="Dimension" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DIMENSIONS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select value={c.operator} onValueChange={(val) => updateCondition(c.id, "operator", val)}>
                <SelectTrigger className="w-[120px] bg-background">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {OPERATORS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Input
                placeholder="Value (e.g. Chrome, US, direct)"
                value={c.value}
                onChange={(e) => updateCondition(c.id, "value", e.target.value)}
                className="min-w-[150px] flex-1 bg-background"
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCondition(c.id)}
                className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="Remove filter"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {conditions.length === 0 && (
            <div className="flex h-24 flex-col items-center justify-center rounded-lg border border-border/60 border-dashed bg-muted/20 text-center text-muted-foreground">
              <p className="text-xs">No active filters. Click add to build a custom segment.</p>
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-border/40 border-t pt-2">
            <Button variant="outline" size="sm" onClick={addCondition} className="flex h-8.5 items-center gap-1.5">
              <Plus className="h-4 w-4" />
              Add Condition
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConditions([])}
                className="h-8.5 text-muted-foreground text-xs hover:text-foreground"
              >
                Clear All
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleApply}
                className="flex h-8.5 items-center gap-1.5 px-4 font-medium shadow-sm"
              >
                {applied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Applied
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Apply Segment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
