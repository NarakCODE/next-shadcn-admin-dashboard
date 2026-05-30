"use client";

import { useState } from "react";

import { AlertCircle, Check, Copy, Download, Globe, Key, Shield, TestTube, Upload, Users } from "lucide-react";

import { FeatureGate } from "@/components/features";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type SSOProvider = {
  id: string;
  name: string;
  type: "saml" | "oauth";
  enabled: boolean;
  configured: boolean;
  icon: string;
};

const initialProviders: SSOProvider[] = [
  { id: "google", name: "Google Workspace", type: "oauth", enabled: true, configured: true, icon: "G" },
  { id: "microsoft", name: "Microsoft Azure AD", type: "saml", enabled: false, configured: true, icon: "M" },
  { id: "okta", name: "Okta", type: "saml", enabled: false, configured: false, icon: "O" },
  { id: "onelogin", name: "OneLogin", type: "saml", enabled: false, configured: false, icon: "1" },
];

export default function SSOConfigurationPage() {
  const [providers, setProviders] = useState<SSOProvider[]>(initialProviders);
  const [activeTab, setActiveTab] = useState("saml");
  const [domainVerified, _setDomainVerified] = useState(false);
  const [scimEnabled, setScimEnabled] = useState(false);

  const toggleProvider = (id: string) => {
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <FeatureGate feature="sso" showUpgradePrompt>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-3xl tracking-tight">SSO Configuration</h1>
          <p className="text-muted-foreground">Configure single sign-on with SAML 2.0 and OAuth providers</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">SSO Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="font-semibold text-2xl text-green-600">Active</div>
                <Badge variant="outline" className="text-green-600">
                  <Check className="mr-1 h-3 w-3" />
                  Enabled
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">1 provider configured</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Domain Verification</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-2xl">{domainVerified ? "Verified" : "Pending"}</div>
              <p className="text-muted-foreground text-xs">example.com</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">SCIM Provisioning</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-2xl">{scimEnabled ? "Enabled" : "Disabled"}</div>
              <p className="text-muted-foreground text-xs">Automatic user sync</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="saml">SAML 2.0</TabsTrigger>
            <TabsTrigger value="oauth">OAuth Providers</TabsTrigger>
            <TabsTrigger value="domain">Domain Verification</TabsTrigger>
            <TabsTrigger value="scim">SCIM Provisioning</TabsTrigger>
          </TabsList>

          <TabsContent value="saml" className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>SAML 2.0 Configuration</CardTitle>
                <CardDescription>Configure your Identity Provider (IdP) for SAML-based single sign-on</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="entityId">Entity ID / Issuer</Label>
                  <Input id="entityId" placeholder="https://your-idp.com/saml/metadata" />
                  <p className="text-muted-foreground text-xs">The unique identifier for your Identity Provider</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="ssoUrl">Single Sign-On URL</Label>
                  <Input id="ssoUrl" placeholder="https://your-idp.com/saml/sso" />
                  <p className="text-muted-foreground text-xs">The URL where SAML authentication requests are sent</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="certificate">X.509 Certificate</Label>
                  <Textarea
                    id="certificate"
                    rows={8}
                    placeholder="-----BEGIN CERTIFICATE-----&#10;MIIC...&#10;-----END CERTIFICATE-----"
                    className="font-mono text-xs"
                  />
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Certificate
                    </Button>
                    <p className="text-muted-foreground text-xs">Or paste the certificate content above</p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-2">
                  <Label>Service Provider (SP) Metadata</Label>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">ACS URL</span>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-background px-2 py-1 font-mono text-xs">
                            https://app.example.com/auth/saml/acs
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard("https://app.example.com/auth/saml/acs")}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Entity ID</span>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-background px-2 py-1 font-mono text-xs">
                            https://app.example.com
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard("https://app.example.com")}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-fit">
                    <Download className="mr-2 h-4 w-4" />
                    Download SP Metadata XML
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <Label>Test SSO Configuration</Label>
                    <p className="text-muted-foreground text-xs">Verify your SAML configuration before enabling</p>
                  </div>
                  <Button variant="outline">
                    <TestTube className="mr-2 h-4 w-4" />
                    Run Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="oauth" className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>OAuth Providers</CardTitle>
                <CardDescription>Connect with popular OAuth providers for single sign-on</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {providers
                  .filter((p) => p.type === "oauth")
                  .map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 font-bold text-lg text-primary">
                          {provider.icon}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{provider.name}</p>
                            {provider.configured && (
                              <Badge variant="outline" className="text-xs">
                                Configured
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs">OAuth 2.0 / OpenID Connect</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {provider.configured && (
                          <Switch checked={provider.enabled} onCheckedChange={() => toggleProvider(provider.id)} />
                        )}
                        {!provider.configured && (
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Google Workspace Configuration</CardTitle>
                <CardDescription>Configure Google Workspace OAuth settings</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input id="clientId" placeholder="your-client-id.apps.googleusercontent.com" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input id="clientSecret" type="password" placeholder="••••••••••••••••" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Redirect URI</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value="https://app.example.com/auth/google/callback"
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard("https://app.example.com/auth/google/callback")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Configuration</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domain" className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Domain Verification</CardTitle>
                <CardDescription>Verify domain ownership to enable SSO for your organization</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="domain">Domain Name</Label>
                  <Input id="domain" defaultValue="example.com" placeholder="yourdomain.com" />
                  <p className="text-muted-foreground text-xs">
                    Only users with email addresses from this domain can use SSO
                  </p>
                </div>

                <Separator />

                <div className="flex flex-col gap-4">
                  <Label>Verification Method</Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3 rounded-lg border p-4">
                      <input type="radio" name="method" id="dns" defaultChecked className="mt-1" />
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="dns" className="font-medium">
                          DNS TXT Record
                        </Label>
                        <p className="text-muted-foreground text-xs">Add a TXT record to your domain's DNS settings</p>
                        <div className="rounded-lg bg-muted/50 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <code className="font-mono text-xs">studio-verify=abc123def456ghi789jkl012mno345</code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard("studio-verify=abc123def456ghi789jkl012mno345")}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border p-4">
                      <input type="radio" name="method" id="meta" className="mt-1" />
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="meta" className="font-medium">
                          Meta Tag
                        </Label>
                        <p className="text-muted-foreground text-xs">Add a meta tag to your website's homepage</p>
                        <div className="rounded-lg bg-muted/50 p-3">
                          <code className="font-mono text-xs">
                            &lt;meta name="studio-verification" content="abc123def456" /&gt;
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-950/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600" />
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-sm text-yellow-800 dark:text-yellow-400">
                        Domain verification pending
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-500">
                        Add the verification record and click "Verify Domain" to complete the process
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Verify Domain
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scim" className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>SCIM User Provisioning</CardTitle>
                <CardDescription>Automatically sync users from your Identity Provider using SCIM</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <Label>Enable SCIM Provisioning</Label>
                    <p className="text-muted-foreground text-xs">
                      Automatically create and update users based on your IdP directory
                    </p>
                  </div>
                  <Switch checked={scimEnabled} onCheckedChange={setScimEnabled} />
                </div>

                {scimEnabled && (
                  <>
                    <Separator />

                    <div className="flex flex-col gap-4">
                      <Label>SCIM Endpoint</Label>
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">Base URL</span>
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-background px-2 py-1 font-mono text-xs">
                                https://api.example.com/scim/v2
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard("https://api.example.com/scim/v2")}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <Label>API Token</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value="scim_token_abc123def456ghi789jkl012mno345pqr678stu901"
                          className="font-mono text-xs"
                          type="password"
                        />
                        <Button variant="outline" size="sm">
                          <Key className="mr-2 h-4 w-4" />
                          Regenerate
                        </Button>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Use this token to authenticate SCIM requests from your IdP
                      </p>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-4">
                      <Label>Supported Operations</Label>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-2 rounded-lg border p-3">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Create Users</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border p-3">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Update Users</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border p-3">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Deactivate Users</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border p-3">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Group Management</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <Label>Test SCIM Connection</Label>
                        <p className="text-muted-foreground text-xs">Verify your SCIM configuration</p>
                      </div>
                      <Button variant="outline">
                        <TestTube className="mr-2 h-4 w-4" />
                        Run Test
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FeatureGate>
  );
}
