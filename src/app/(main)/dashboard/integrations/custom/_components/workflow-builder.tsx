"use client";

import { useState } from "react";

import {
  ArrowDown,
  Check,
  CheckCircle,
  Database,
  Layers,
  Mail,
  MessageSquare,
  Play,
  Plus,
  Settings,
  Trash2,
  Zap,
} from "lucide-react";

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
} from "@/components/ui/dialog";

type StepType = "trigger" | "condition" | "action";

type Step = {
  id: string;
  type: StepType;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
};

const STEP_OPTIONS = [
  {
    type: "trigger",
    title: "Webhook Received",
    subtitle: "Triggers on any incoming POST request payloads",
    icon: Zap,
    color: "border-l-blue-500 hover:border-blue-400",
  },
  {
    type: "trigger",
    title: "Schedule (Cron)",
    subtitle: "Triggers periodically on cron frequencies",
    icon: Layers,
    color: "border-l-blue-500 hover:border-blue-400",
  },
  {
    type: "condition",
    title: "Filter Field",
    subtitle: "Continues only if condition attributes match",
    icon: Layers,
    color: "border-l-amber-500 hover:border-amber-400",
  },
  {
    type: "condition",
    title: "Rate Limit Gate",
    subtitle: "Prevents execution overload gates",
    icon: Layers,
    color: "border-l-amber-500 hover:border-amber-400",
  },
  {
    type: "action",
    title: "Post CRM Lead",
    subtitle: "Push contact into active CRM lists",
    icon: Database,
    color: "border-l-emerald-500 hover:border-emerald-400",
  },
  {
    type: "action",
    title: "Slack Channel Push",
    subtitle: "Send custom messages to Slack hooks",
    icon: MessageSquare,
    color: "border-l-emerald-500 hover:border-emerald-400",
  },
  {
    type: "action",
    title: "Email Recipient",
    subtitle: "Deliver custom email via Mailgun APIs",
    icon: Mail,
    color: "border-l-emerald-500 hover:border-emerald-400",
  },
];

const INITIAL_STEPS: Step[] = [
  {
    id: "1",
    type: "trigger",
    title: "Webhook Received",
    subtitle: "Triggers on any incoming POST request payloads",
    icon: Zap,
    color: "border-l-blue-500",
  },
  {
    id: "2",
    type: "condition",
    title: "Filter Field",
    subtitle: "Continues only if user.email contains '@company'",
    icon: Layers,
    color: "border-l-amber-500",
  },
  {
    id: "3",
    type: "action",
    title: "Slack Channel Push",
    subtitle: "Send new lead alert into Slack channel",
    icon: MessageSquare,
    color: "border-l-emerald-500",
  },
];

type Props = {
  recipeName?: string | null;
  onRecipeHandled?: () => void;
};

export function WorkflowBuilder({ recipeName, onRecipeHandled }: Props) {
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const [addIndex, setAddIndex] = useState<number | null>(null);
  const [testing, setTesting] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // If a template recipe was selected, append or reset it
  if (recipeName) {
    const templateStep: Step = {
      id: Math.random().toString(),
      type: "action",
      title: recipeName,
      subtitle: "Imported recipe layout model. Click to adjust payload mapping.",
      icon: Database,
      color: "border-l-emerald-500",
    };
    setSteps([...steps.filter((s) => s.type !== "action"), templateStep]);
    if (onRecipeHandled) onRecipeHandled();
  }

  const deleteStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const handleAddStep = (idx: number) => {
    setAddIndex(idx);
  };

  const selectStepOption = (opt: (typeof STEP_OPTIONS)[0]) => {
    if (addIndex === null) return;
    const newStep: Step = {
      id: Math.random().toString(),
      type: opt.type as any,
      title: opt.title,
      subtitle: opt.subtitle,
      icon: opt.icon,
      color:
        opt.type === "trigger"
          ? "border-l-blue-500"
          : opt.type === "condition"
            ? "border-l-amber-500"
            : "border-l-emerald-500",
    };

    const nextSteps = [...steps];
    nextSteps.splice(addIndex + 1, 0, newStep);
    setSteps(nextSteps);
    setAddIndex(null);
  };

  const handleTestWorkflow = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      setShowLogs(true);
    }, 1800);
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <Card className="flex h-full flex-col border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader className="mb-6 flex flex-row items-center justify-between space-y-0 border-border/40 border-b pb-4">
        <div>
          <CardTitle className="font-semibold text-lg tracking-tight">Workflow Canvas</CardTitle>
          <CardDescription className="text-xs">
            Visual step-by-step canvas. Add, reorder, and configure nodes.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            variant="outline"
            size="sm"
            className="h-8.5 border-border/60 font-medium text-xs hover:bg-muted"
          >
            {saveSuccess ? (
              <>
                <Check className="mr-1 h-4 w-4 text-emerald-500" /> Saved
              </>
            ) : (
              "Save Draft"
            )}
          </Button>
          <Button
            onClick={handleTestWorkflow}
            disabled={testing}
            size="sm"
            className="flex h-8.5 items-center gap-1.5 font-semibold text-xs shadow-xs"
          >
            <Play className={`h-3.5 w-3.5 ${testing ? "animate-spin" : ""}`} />
            {testing ? "Testing..." : "Test Run"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex max-h-[580px] flex-1 flex-col items-center space-y-4 overflow-y-auto pt-2 pb-6">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex w-full max-w-lg flex-col items-center">
              {/* Step Card */}
              <div
                className={`group relative flex w-full items-start gap-4 rounded-lg border border-border/50 border-l-4 bg-background/60 p-4 ${s.color} transition-all duration-200 hover:border-primary/20 hover:bg-background`}
              >
                <div
                  className={`rounded-lg p-2 ${
                    s.type === "trigger"
                      ? "bg-blue-500/10 text-blue-500"
                      : s.type === "condition"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-emerald-500/10 text-emerald-500"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold text-foreground text-xs capitalize tracking-tight">
                      {s.title}
                      <Badge
                        variant="outline"
                        className={`h-4 px-1.5 font-semibold text-[8px] uppercase ${
                          s.type === "trigger"
                            ? "border-blue-500/30 bg-blue-500/5 text-blue-500"
                            : s.type === "condition"
                              ? "border-amber-500/30 bg-amber-500/5 text-amber-500"
                              : "border-emerald-500/30 bg-emerald-500/5 text-emerald-500"
                        }`}
                      >
                        {s.type}
                      </Badge>
                    </span>

                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <Settings className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        onClick={() => deleteStep(s.id)}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="truncate text-[10px] text-muted-foreground leading-relaxed">{s.subtitle}</p>
                </div>
              </div>

              {/* Arrow and Add Connector (except for last step) */}
              {idx < steps.length - 1 && (
                <div className="group/conn relative flex flex-col items-center py-2">
                  <ArrowDown className="h-4.5 w-4.5 text-muted-foreground/40 transition-colors group-hover/conn:text-primary" />

                  {/* Floating Add step trigger */}
                  <Button
                    onClick={() => handleAddStep(idx)}
                    variant="outline"
                    size="icon"
                    className="absolute -top-1 z-10 h-5 w-5 scale-0 rounded-full border-border/80 bg-background shadow-xs transition-transform hover:bg-primary hover:text-primary-foreground group-hover/conn:scale-100"
                    aria-label="Add custom step node"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}

        {steps.length === 0 && (
          <div className="w-full max-w-lg rounded-lg border border-border/40 border-dashed py-12 text-center text-muted-foreground text-xs">
            No steps in workflow canvas. Click add to design triggers.
          </div>
        )}

        {/* Dynamic Step Options Selector Dialog */}
        <Dialog open={addIndex !== null} onOpenChange={(open) => !open && setAddIndex(null)}>
          <DialogContent className="max-w-sm border-border/60 bg-popover">
            <DialogHeader>
              <DialogTitle className="font-semibold text-sm">Choose Step Node</DialogTitle>
              <DialogDescription className="text-xs">
                Choose the type of node filter or action to append here.
              </DialogDescription>
            </DialogHeader>
            <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto py-3">
              {STEP_OPTIONS.map((opt, i) => {
                const OptIcon = opt.icon;
                return (
                  <button
                    key={i}
                    onClick={() => selectStepOption(opt)}
                    className={`flex items-start gap-3 rounded-lg border border-border/50 border-l-4 bg-background/50 p-2.5 text-left ${opt.color} transition-all hover:bg-muted`}
                  >
                    <div className="mt-0.5 rounded-lg bg-muted p-1.5">
                      <OptIcon className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 font-semibold text-foreground text-xs">
                        {opt.title}
                        <span className="text-[9px] uppercase opacity-70">({opt.type})</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-snug">{opt.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        {/* Test Run Execution Logs Dialog */}
        <Dialog open={showLogs} onOpenChange={setShowLogs}>
          <DialogContent className="max-w-md border-border/60 bg-popover">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-semibold text-sm">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Workflow Test Successful
              </DialogTitle>
              <DialogDescription className="text-xs">
                Execution summary log for 3 completed nodes. Elapsed time: 140ms.
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[260px] space-y-2 overflow-y-auto rounded-md border border-border/50 bg-background/50 p-3 font-mono text-[10px] leading-relaxed">
              <div className="flex justify-between text-muted-foreground">
                <span>[2026-05-29T15:18:24Z]</span>
                <span className="font-semibold text-blue-500">INFO</span>
              </div>
              <p className="font-semibold text-foreground">&gt; Initialising Workflow Engine instance...</p>

              <div className="flex justify-between pt-1 text-muted-foreground">
                <span>[2026-05-29T15:18:24Z]</span>
                <span className="font-semibold text-blue-500">INFO</span>
              </div>
              <p className="pl-2 text-foreground">
                &gt; Node [1] (Webhook Received) fired correctly. Payload validated.
              </p>

              <div className="flex justify-between pt-1 text-muted-foreground">
                <span>[2026-05-29T15:18:24Z]</span>
                <span className="font-semibold text-blue-500">INFO</span>
              </div>
              <p className="pl-2 text-amber-500">
                &gt; Node [2] (Filter Field): condition matched (user.email = aiy@google.com). Proceeding.
              </p>

              <div className="flex justify-between pt-1 text-muted-foreground">
                <span>[2026-05-29T15:18:24Z]</span>
                <span className="font-semibold text-blue-500">INFO</span>
              </div>
              <p className="pl-2 text-emerald-500">
                &gt; Node [3] (Slack Channel Push): POST payload successfully sent to incoming-hook. Slack responded 200
                OK.
              </p>

              <div className="flex justify-between border-border/40 border-t pt-2 text-muted-foreground">
                <span>[2026-05-29T15:18:24Z]</span>
                <span className="font-bold text-emerald-600">STATUS</span>
              </div>
              <p className="font-bold text-emerald-600">&gt; Finished workflow sequence gracefully. Exit code 0.</p>
            </div>

            <DialogFooter>
              <Button onClick={() => setShowLogs(false)} className="h-9.5 w-full font-semibold text-xs">
                Close Log Console
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
