"use client";

import { useState } from "react";

import { AlertCircle, CheckCircle2, Play, Plus, Shield, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

type HeaderRow = {
  id: string;
  key: string;
  value: string;
};

export function ApiConfigForm() {
  const [method, setMethod] = useState("POST");
  const [url, setUrl] = useState("https://api.salesforce.com/v50.0/sobjects/Contact");
  const [authType, setAuthType] = useState("bearer");
  const [authToken, setAuthToken] = useState("sf_token_live_920jkasd90123");
  const [authKeyName, setAuthKeyName] = useState("x-api-key");
  const [authKeyValue, setAuthKeyValue] = useState("");
  const [headers, setHeaders] = useState<HeaderRow[]>([
    { id: "1", key: "Content-Type", value: "application/json" },
    { id: "2", key: "Accept", value: "application/json" },
  ]);
  const [requestBody, setRequestBody] = useState(
    JSON.stringify(
      {
        FirstName: "{{trigger.first_name}}",
        LastName: "{{trigger.last_name}}",
        Email: "{{trigger.email}}",
        LeadSource: "Nextshadcn Dashboard",
      },
      null,
      2,
    ),
  );

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const addHeader = () => {
    setHeaders([...headers, { id: Math.random().toString(), key: "", value: "" }]);
  };

  const removeHeader = (id: string) => {
    setHeaders(headers.filter((h) => h.id !== id));
  };

  const updateHeader = (id: string, field: "key" | "value", val: string) => {
    setHeaders(headers.map((h) => (h.id === id ? { ...h, [field]: val } : h)));
  };

  const handleTestConnection = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult(Math.random() > 0.15 ? "success" : "error");
    }, 1500);
  };

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader>
        <CardTitle className="font-semibold text-lg tracking-tight">API Request Configuration</CardTitle>
        <CardDescription className="text-xs">
          Configure outgoing webhook options, payload mappings, and authorization keys.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Method & URL */}
        <div className="space-y-3">
          <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Method & Target Endpoint
          </Label>
          <div className="flex gap-2">
            <div className="flex gap-1 rounded-lg border border-border/60 bg-background/50 p-1">
              {["GET", "POST", "PUT", "DELETE"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`rounded-md px-3 py-1.5 font-semibold text-xs uppercase transition-all ${
                    method === m
                      ? m === "DELETE"
                        ? "bg-rose-500 text-white"
                        : "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.domain.com/v1/endpoint"
              className="h-10 flex-1 border-border/50 bg-background font-mono text-xs"
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            * Use double curly braces <span className="font-semibold text-foreground">{"{{variable}}"}</span> to
            interpolate dynamic step values.
          </p>
        </div>

        {/* Authorization Mode */}
        <div className="space-y-3 pt-2">
          <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Authorization Type
          </Label>
          <RadioGroup value={authType} onValueChange={setAuthType} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { id: "none", label: "No Auth" },
              { id: "bearer", label: "Bearer Token" },
              { id: "apikey", label: "API Key Header" },
              { id: "oauth2", label: "OAuth 2.0 Client" },
            ].map((auth) => (
              <label
                key={auth.id}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-xs transition-all ${
                  authType === auth.id
                    ? "border-primary bg-primary/5 font-medium text-foreground"
                    : "border-border/50 bg-background/30 text-muted-foreground hover:bg-background/80"
                }`}
              >
                <RadioGroupItem value={auth.id} id={auth.id} className="sr-only" />
                <Shield
                  className={`h-4 w-4 shrink-0 ${authType === auth.id ? "text-primary" : "text-muted-foreground"}`}
                />
                {auth.label}
              </label>
            ))}
          </RadioGroup>

          {/* Conditional Auth Form fields */}
          {authType === "bearer" && (
            <div className="space-y-1.5 pt-1">
              <Label className="font-medium text-xs">Access Token</Label>
              <Input
                type="password"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Bearer eyJhbGciOi..."
                className="h-9.5 border-border/50 bg-background font-mono text-xs"
              />
            </div>
          )}

          {authType === "apikey" && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <Label className="font-medium text-xs">Header Key Name</Label>
                <Input
                  value={authKeyName}
                  onChange={(e) => setAuthKeyName(e.target.value)}
                  placeholder="X-API-Key"
                  className="h-9.5 border-border/50 bg-background font-mono text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-medium text-xs">API Key Value</Label>
                <Input
                  type="password"
                  value={authKeyValue}
                  onChange={(e) => setAuthKeyValue(e.target.value)}
                  placeholder="Insert Key..."
                  className="h-9.5 border-border/50 bg-background font-mono text-xs"
                />
              </div>
            </div>
          )}

          {authType === "oauth2" && (
            <div className="flex flex-col gap-1 rounded-lg border border-indigo-500/10 bg-indigo-500/5 p-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Shield className="h-3.5 w-3.5 text-indigo-500" /> OAuth credentials connected successfully.
              </span>
              Connected scopes: write:contacts, read:accounts. Managed dynamically.
            </div>
          )}
        </div>

        {/* Custom Headers */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Custom Header Variables
            </Label>
            <Button variant="outline" size="sm" onClick={addHeader} className="h-8 px-2.5 font-medium text-[11px]">
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Header
            </Button>
          </div>

          <div className="space-y-2">
            {headers.map((h) => (
              <div key={h.id} className="flex items-center gap-2">
                <Input
                  placeholder="Header Name (e.g. User-Agent)"
                  value={h.key}
                  onChange={(e) => updateHeader(h.id, "key", e.target.value)}
                  className="h-9 flex-1 border-border/50 bg-background font-mono text-xs"
                />
                <Input
                  placeholder="Value (e.g. WebhookAgent)"
                  value={h.value}
                  onChange={(e) => updateHeader(h.id, "value", e.target.value)}
                  className="h-9 flex-1 border-border/50 bg-background font-mono text-xs"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHeader(h.id)}
                  className="h-9 w-9 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remove Header"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {headers.length === 0 && (
              <div className="rounded-lg border border-border/40 border-dashed py-4 text-center text-[10px] text-muted-foreground">
                No custom headers added.
              </div>
            )}
          </div>
        </div>

        {/* JSON Request Body */}
        <div className="space-y-2 pt-2">
          <Label className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            JSON Request Payload
          </Label>
          <Textarea
            rows={5}
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="resize-none border-border/50 bg-background p-3 font-mono text-xs leading-relaxed"
          />
        </div>

        {/* Connection Test & Output */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-border/40 border-t pt-4">
          <Button
            onClick={handleTestConnection}
            disabled={testing}
            className="flex h-9.5 items-center gap-1.5 px-4 font-semibold text-xs shadow-sm"
          >
            <Play className={`h-4 w-4 ${testing ? "animate-spin" : ""}`} />
            {testing ? "Sending Request..." : "Test Endpoint Target"}
          </Button>

          {testResult === "success" && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 text-xs dark:bg-emerald-500/15 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Success 201 Created
            </div>
          )}

          {testResult === "error" && (
            <div className="flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 font-semibold text-rose-700 text-xs dark:bg-rose-500/15 dark:text-rose-400">
              <AlertCircle className="h-4 w-4" /> Bad Request 400
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
