"use client";

import { useState } from "react";

import { Check, Globe, Image as ImageIcon, Mail, Palette, Save, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BrandingSettings {
  logo: string | null;
  favicon: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  customDomain: string;
  emailFromName: string;
  emailFromAddress: string;
  emailReplyTo: string;
  loginTitle: string;
  loginSubtitle: string;
  loginBackground: string | null;
  whiteLabelEnabled: boolean;
  removeBranding: boolean;
}

const defaultBranding: BrandingSettings = {
  logo: null,
  favicon: null,
  primaryColor: "#3b82f6",
  secondaryColor: "#64748b",
  accentColor: "#f59e0b",
  customDomain: "",
  emailFromName: "Rhea Admin",
  emailFromAddress: "noreply@rheaadmin.com",
  emailReplyTo: "support@rheaadmin.com",
  loginTitle: "Welcome Back",
  loginSubtitle: "Sign in to your account to continue",
  loginBackground: null,
  whiteLabelEnabled: false,
  removeBranding: false,
};

export default function CustomBrandingPage() {
  const [activeTab, setActiveTab] = useState("logo");
  const [branding, setBranding] = useState<BrandingSettings>(defaultBranding);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In real implementation, this would save to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding({ ...branding, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding({ ...branding, favicon: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding({ ...branding, loginBackground: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Custom Branding</h1>
          <p className="text-muted-foreground">Customize your workspace branding and white-label options</p>
        </div>
        <Button onClick={handleSave}>
          {saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="logo">
            <ImageIcon className="mr-2 h-4 w-4" />
            Logo & Favicon
          </TabsTrigger>
          <TabsTrigger value="colors">
            <Palette className="mr-2 h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="domain">
            <Globe className="mr-2 h-4 w-4" />
            Custom Domain
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="login">
            <ImageIcon className="mr-2 h-4 w-4" />
            Login Page
          </TabsTrigger>
          <TabsTrigger value="whitelabel">
            <Check className="mr-2 h-4 w-4" />
            White Label
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>
                Upload your company logo. Recommended size: 200x50px. Supported formats: PNG, SVG, JPG.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="flex h-32 w-64 items-center justify-center rounded-lg border-2 border-dashed">
                  {branding.logo ? (
                    <img src={branding.logo} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="mx-auto h-8 w-8" />
                      <p className="mt-2 text-sm">No logo uploaded</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-accent">
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </div>
                  </Label>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/png,image/svg+xml,image/jpeg"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  {branding.logo && (
                    <Button variant="outline" size="sm" onClick={() => setBranding({ ...branding, logo: null })}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Favicon</CardTitle>
              <CardDescription>
                Upload a favicon for browser tabs. Recommended size: 32x32px or 64x64px. Supported formats: PNG, ICO.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed">
                  {branding.favicon ? (
                    <img src={branding.favicon} alt="Favicon preview" className="h-8 w-8 object-contain" />
                  ) : (
                    <div className="text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-accent">
                      <Upload className="h-4 w-4" />
                      Upload Favicon
                    </div>
                  </Label>
                  <input
                    id="favicon-upload"
                    type="file"
                    accept="image/png,image/x-icon"
                    className="hidden"
                    onChange={handleFaviconUpload}
                  />
                  {branding.favicon && (
                    <Button variant="outline" size="sm" onClick={() => setBranding({ ...branding, favicon: null })}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>
                Customize the color palette for your workspace. These colors will be used throughout the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                      className="h-10 w-20 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                      placeholder="#3b82f6"
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">Used for buttons, links, and primary actions</p>
                </div>

                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                      className="h-10 w-20 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                      placeholder="#64748b"
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">Used for secondary actions and accents</p>
                </div>

                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={branding.accentColor}
                      onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                      className="h-10 w-20 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={branding.accentColor}
                      onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                      placeholder="#f59e0b"
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">Used for highlights and notifications</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <p className="mb-3 font-medium">Preview</p>
                <div className="flex gap-2">
                  <Button style={{ backgroundColor: branding.primaryColor }}>Primary Button</Button>
                  <Button variant="secondary" style={{ backgroundColor: branding.secondaryColor }}>
                    Secondary Button
                  </Button>
                  <Badge style={{ backgroundColor: branding.accentColor }}>Accent Badge</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Domain</CardTitle>
              <CardDescription>
                Set up a custom domain for your workspace. This will replace the default studioadmin.com domain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Custom Domain</Label>
                <Input
                  placeholder="app.yourcompany.com"
                  value={branding.customDomain}
                  onChange={(e) => setBranding({ ...branding, customDomain: e.target.value })}
                />
                <p className="text-muted-foreground text-sm">
                  Enter your custom domain without https:// (e.g., app.yourcompany.com)
                </p>
              </div>

              {branding.customDomain && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                  <p className="mb-2 font-medium text-blue-900 dark:text-blue-100">DNS Configuration Required</p>
                  <p className="mb-3 text-blue-800 text-sm dark:text-blue-200">
                    Add the following CNAME record to your DNS settings:
                  </p>
                  <div className="rounded bg-white p-3 font-mono text-sm dark:bg-gray-900">
                    <p>{branding.customDomain} CNAME custom.studioadmin.com</p>
                  </div>
                  <p className="mt-3 text-blue-700 text-xs dark:text-blue-300">
                    DNS changes may take up to 48 hours to propagate. We'll notify you when your domain is verified.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button>Verify Domain</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize the sender information for emails sent from your workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>From Name</Label>
                <Input
                  value={branding.emailFromName}
                  onChange={(e) => setBranding({ ...branding, emailFromName: e.target.value })}
                  placeholder="Your Company Name"
                />
                <p className="text-muted-foreground text-sm">The name that appears in the "From" field of emails</p>
              </div>

              <div className="space-y-2">
                <Label>From Email Address</Label>
                <Input
                  type="email"
                  value={branding.emailFromAddress}
                  onChange={(e) => setBranding({ ...branding, emailFromAddress: e.target.value })}
                  placeholder="noreply@yourcompany.com"
                />
                <p className="text-muted-foreground text-sm">The email address that emails are sent from</p>
              </div>

              <div className="space-y-2">
                <Label>Reply-To Email Address</Label>
                <Input
                  type="email"
                  value={branding.emailReplyTo}
                  onChange={(e) => setBranding({ ...branding, emailReplyTo: e.target.value })}
                  placeholder="support@yourcompany.com"
                />
                <p className="text-muted-foreground text-sm">The email address that replies are sent to</p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="mb-2 font-medium">Email Preview</p>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">From:</span> {branding.emailFromName} &lt;
                    {branding.emailFromAddress}&gt;
                  </p>
                  <p>
                    <span className="text-muted-foreground">Reply-To:</span> {branding.emailReplyTo}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Login Page Customization</CardTitle>
              <CardDescription>Customize the appearance and messaging on your login page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Login Page Title</Label>
                <Input
                  value={branding.loginTitle}
                  onChange={(e) => setBranding({ ...branding, loginTitle: e.target.value })}
                  placeholder="Welcome Back"
                />
              </div>

              <div className="space-y-2">
                <Label>Login Page Subtitle</Label>
                <Input
                  value={branding.loginSubtitle}
                  onChange={(e) => setBranding({ ...branding, loginSubtitle: e.target.value })}
                  placeholder="Sign in to your account to continue"
                />
              </div>

              <div className="space-y-2">
                <Label>Login Page Background</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-32 w-48 items-center justify-center rounded-lg border-2 border-dashed">
                    {branding.loginBackground ? (
                      <img
                        src={branding.loginBackground}
                        alt="Login background preview"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="mx-auto h-8 w-8" />
                        <p className="mt-2 text-xs">No background</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-bg-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-accent">
                        <Upload className="h-4 w-4" />
                        Upload Background
                      </div>
                    </Label>
                    <input
                      id="login-bg-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLoginBackgroundUpload}
                    />
                    {branding.loginBackground && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setBranding({ ...branding, loginBackground: null })}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Recommended size: 1920x1080px. Supported formats: PNG, JPG, WebP.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whitelabel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>White Label Options</CardTitle>
              <CardDescription>
                Remove Rhea Admin branding and fully customize your workspace appearance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable White Label</Label>
                  <p className="text-muted-foreground text-sm">
                    Remove all Rhea Admin branding and logos from your workspace
                  </p>
                </div>
                <Switch
                  checked={branding.whiteLabelEnabled}
                  onCheckedChange={(checked) => setBranding({ ...branding, whiteLabelEnabled: checked })}
                />
              </div>

              {branding.whiteLabelEnabled && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Remove "Powered by Rhea Admin"</Label>
                      <p className="text-muted-foreground text-sm">
                        Remove the "Powered by Rhea Admin" footer from all pages
                      </p>
                    </div>
                    <Switch
                      checked={branding.removeBranding}
                      onCheckedChange={(checked) => setBranding({ ...branding, removeBranding: checked })}
                    />
                  </div>

                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
                    <p className="font-medium text-yellow-900 dark:text-yellow-100">White Label Active</p>
                    <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
                      Your workspace will display your custom branding instead of Rhea Admin branding. Make sure to
                      upload your logo and favicon for the best experience.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding Preview</CardTitle>
              <CardDescription>See how your branding will appear across the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <p className="mb-2 font-medium">Sidebar Logo</p>
                  <div className="flex h-12 items-center gap-3 rounded-md bg-muted p-3">
                    {branding.logo ? (
                      <img src={branding.logo} alt="Logo" className="h-8 w-8 object-contain" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
                        S
                      </div>
                    )}
                    <span className="font-semibold">Your Company</span>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="mb-2 font-medium">Browser Tab</p>
                  <div className="flex items-center gap-2 rounded-t-md border-b bg-muted px-3 py-2">
                    {branding.favicon ? (
                      <img src={branding.favicon} alt="Favicon" className="h-4 w-4 object-contain" />
                    ) : (
                      <div className="flex h-4 w-4 items-center justify-center rounded bg-primary text-primary-foreground text-xs">
                        S
                      </div>
                    )}
                    <span className="text-sm">Your Company - Dashboard</span>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="mb-2 font-medium">Email Sender</p>
                  <div className="text-sm">
                    <p>
                      <span className="text-muted-foreground">From:</span> {branding.emailFromName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email:</span> {branding.emailFromAddress}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
