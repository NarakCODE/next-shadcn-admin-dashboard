"use client";

import { useState } from "react";

import { ArrowUpRight, Eye, MoreHorizontal, Search, Settings, Unplug } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type Integration = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  status: "connected" | "pending" | "disconnected";
  connectedDate: string | null;
  lastSync: string | null;
  features: string[];
  settings: {
    autoSync: boolean;
    notifications: boolean;
    webhooks: boolean;
    apiKey: string;
    webhookUrl: string;
    notes: string;
  };
};

const integrations: Integration[] = [
  {
    id: "int-1",
    title: "PostHog",
    description: "Open-source product analytics platform for tracking user behavior and insights.",
    url: "https://posthog.com/",
    category: "Analytics",
    status: "connected",
    connectedDate: "2024-01-15",
    lastSync: "2024-02-05T14:20:00Z",
    features: ["Event Tracking", "Session Recording", "Feature Flags", "A/B Testing"],
    settings: {
      autoSync: true,
      notifications: true,
      webhooks: false,
      apiKey: "phc_live_4eC39HqLyjWDarjtT1zdp7dc",
      webhookUrl: "https://api.example.com/webhooks/posthog",
      notes: "Primary analytics tool for product team",
    },
  },
  {
    id: "int-2",
    title: "Mailchimp",
    description: "Marketing platform for creating, sending, and automating email campaigns.",
    url: "https://mailchimp.com",
    category: "Marketing",
    status: "connected",
    connectedDate: "2024-01-20",
    lastSync: "2024-02-04T16:45:00Z",
    features: ["Email Campaigns", "Audience Segmentation", "Automation", "Analytics"],
    settings: {
      autoSync: true,
      notifications: false,
      webhooks: true,
      apiKey: "mc_live_7fD42IqMzKXbskutU2aeq8ed",
      webhookUrl: "https://api.example.com/webhooks/mailchimp",
      notes: "Used for newsletter and promotional emails",
    },
  },
  {
    id: "int-3",
    title: "Webflow",
    description: "Website builder for creating and managing responsive websites without code.",
    url: "https://webflow.com/",
    category: "Design",
    status: "pending",
    connectedDate: null,
    lastSync: null,
    features: ["CMS", "E-commerce", "Hosting", "Interactions"],
    settings: {
      autoSync: false,
      notifications: true,
      webhooks: false,
      apiKey: "",
      webhookUrl: "",
      notes: "Pending approval from design team",
    },
  },
  {
    id: "int-4",
    title: "Stripe",
    description: "Payment processing platform for online businesses and subscription management.",
    url: "https://stripe.com",
    category: "Payments",
    status: "connected",
    connectedDate: "2023-12-10",
    lastSync: "2024-02-05T18:00:00Z",
    features: ["Payments", "Subscriptions", "Invoicing", "Radar Fraud Prevention"],
    settings: {
      autoSync: true,
      notifications: true,
      webhooks: true,
      apiKey: "sk_live_mock_key_000000000000000000000000",
      webhookUrl: "https://api.example.com/webhooks/stripe",
      notes: "Primary payment processor for all transactions",
    },
  },
  {
    id: "int-5",
    title: "Sanity",
    description: "Headless CMS for structured content management and real-time collaboration.",
    url: "https://sanity.io/",
    category: "Content",
    status: "disconnected",
    connectedDate: null,
    lastSync: null,
    features: ["Content Modeling", "Real-time API", "Studio Dashboard", "Image Pipeline"],
    settings: {
      autoSync: false,
      notifications: false,
      webhooks: false,
      apiKey: "",
      webhookUrl: "",
      notes: "Previously used, disconnected in Q4 2023",
    },
  },
  {
    id: "int-6",
    title: "Zapier",
    description: "Automation platform connecting 5000+ apps to streamline workflows.",
    url: "https://zapier.com",
    category: "Automation",
    status: "connected",
    connectedDate: "2024-02-01",
    lastSync: "2024-02-05T12:00:00Z",
    features: ["Multi-step Zaps", "Filters", "Paths", "Webhooks"],
    settings: {
      autoSync: true,
      notifications: true,
      webhooks: true,
      apiKey: "zap_live_2hF64KsObMZdunwW4cgs0gf1",
      webhookUrl: "https://api.example.com/webhooks/zapier",
      notes: "Automates data sync between CRM and email tools",
    },
  },
  {
    id: "int-7",
    title: "Slack",
    description: "Business communication platform for team messaging and collaboration.",
    url: "https://slack.com",
    category: "Communication",
    status: "connected",
    connectedDate: "2024-01-05",
    lastSync: "2024-02-05T19:30:00Z",
    features: ["Channels", "Direct Messages", "File Sharing", "App Integrations"],
    settings: {
      autoSync: true,
      notifications: true,
      webhooks: true,
      apiKey: "xoxb-3iG75LtPcNAevnxX5dht1hg",
      webhookUrl: "https://api.example.com/webhooks/slack",
      notes: "Main communication channel for dev team",
    },
  },
  {
    id: "int-8",
    title: "GitHub",
    description: "Code hosting and collaboration platform for software development teams.",
    url: "https://github.com",
    category: "Development",
    status: "pending",
    connectedDate: null,
    lastSync: null,
    features: ["Repositories", "Actions", "Issues", "Pull Requests"],
    settings: {
      autoSync: false,
      notifications: true,
      webhooks: false,
      apiKey: "",
      webhookUrl: "",
      notes: "Setup in progress for CI/CD pipeline",
    },
  },
  {
    id: "int-9",
    title: "Notion",
    description: "All-in-one workspace for notes, docs, project management, and wikis.",
    url: "https://notion.so",
    category: "Productivity",
    status: "disconnected",
    connectedDate: null,
    lastSync: null,
    features: ["Pages", "Databases", "Templates", "API Access"],
    settings: {
      autoSync: false,
      notifications: false,
      webhooks: false,
      apiKey: "",
      webhookUrl: "",
      notes: "Trial period ended, considering reconnection",
    },
  },
  {
    id: "int-10",
    title: "Figma",
    description: "Collaborative interface design tool for creating UI/UX designs.",
    url: "https://figma.com",
    category: "Design",
    status: "connected",
    connectedDate: "2024-01-25",
    lastSync: "2024-02-05T15:00:00Z",
    features: ["Design Files", "Prototyping", "Dev Mode", "Plugins"],
    settings: {
      autoSync: true,
      notifications: false,
      webhooks: false,
      apiKey: "fig_live_4jH86MuQdOBfwoyY6eiu2ih3",
      webhookUrl: "",
      notes: "Design handoff pipeline to development team",
    },
  },
];

const statusColors: Record<string, string> = {
  connected: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  disconnected: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const categories = [
  "All",
  "Analytics",
  "Marketing",
  "Payments",
  "Design",
  "Automation",
  "Communication",
  "Development",
  "Productivity",
  "Content",
];

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [integrationSettings, setIntegrationSettings] = useState<Integration["settings"] | null>(null);

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || integration.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || integration.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleViewDetails = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowDetailsDialog(true);
  };

  const handleOpenSettings = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIntegrationSettings({ ...integration.settings });
    setShowSettingsDialog(true);
  };

  const handleDisconnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowDisconnectDialog(true);
  };

  const handleSaveSettings = () => {
    if (selectedIntegration && integrationSettings) {
      setSelectedIntegration({ ...selectedIntegration, settings: integrationSettings });
    }
    setShowSettingsDialog(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3 py-8">
        <h1 className="text-center font-medium text-4xl tracking-[-0.04em]">Integrations</h1>
        <p className="text-center text-muted-foreground text-xl -tracking-[0.01em]">
          Connect your favorite tools and services to your account
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="connected">Connected</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="disconnected">Disconnected</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
            <TabsList className="flex-wrap">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-xs">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="relative flex flex-col items-start overflow-hidden rounded-lg border bg-card"
            >
              <div className="absolute inset-x-0 top-7 h-9.5 border-y border-dashed bg-muted/30" />
              <div className="absolute inset-y-0 left-7 w-9.5 border-x border-dashed bg-muted/30" />

              <div className="relative isolate flex w-full items-start justify-between gap-5 p-6">
                <div className="w-fit shrink-0 rounded-3xl bg-transparent p-1">
                  <div className="relative border bg-background">
                    <img
                      alt={integration.title}
                      className="size-9"
                      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(integration.url)}&sz=64`}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="py-2 font-medium text-xl">{integration.title}</h3>
                  <p className="mt-4 mb-2 text-pretty text-muted-foreground text-sm tracking-normal">
                    {integration.description}
                  </p>
                </div>
              </div>

              <div className="flex w-full items-center justify-between border-t px-6 py-4">
                <p className="text-muted-foreground text-xs">{integration.category}</p>
                <div className="flex items-center gap-1">
                  {integration.status === "connected" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-xs"
                      onClick={() => handleOpenSettings(integration)}
                    >
                      <Settings className="h-3 w-3" />
                      Settings
                    </Button>
                  ) : (
                    <Button size="sm" className="h-7 gap-1 text-xs">
                      Connect <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-auto">
                      <DropdownMenuItem onClick={() => handleViewDetails(integration)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {integration.status === "connected" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDisconnect(integration)}>
                            <Unplug className="mr-2 h-4 w-4" />
                            Disconnect
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedIntegration && (
                <>
                  <img
                    alt={selectedIntegration.title}
                    className="size-8 rounded-lg border"
                    src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(selectedIntegration.url)}&sz=64`}
                  />
                  {selectedIntegration.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription>{selectedIntegration?.description}</DialogDescription>
          </DialogHeader>
          {selectedIntegration && (
            <div className="flex flex-col gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Status</p>
                  <Badge className={statusColors[selectedIntegration.status]}>{selectedIntegration.status}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Category</p>
                  <p className="font-medium text-sm">{selectedIntegration.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Connected Date</p>
                  <p className="font-medium text-sm">{selectedIntegration.connectedDate || "Not connected"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Last Sync</p>
                  <p className="font-medium text-sm">
                    {selectedIntegration.lastSync
                      ? new Date(selectedIntegration.lastSync).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="mb-2 font-medium text-sm">Features</p>
                <div className="flex flex-wrap gap-1">
                  {selectedIntegration.features.map((feature) => (
                    <Badge key={feature} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleOpenSettings(selectedIntegration)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                {selectedIntegration.status === "connected" && (
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => handleDisconnect(selectedIntegration)}
                  >
                    <Unplug className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedIntegration && (
                <>
                  <img
                    alt={selectedIntegration.title}
                    className="size-8 rounded-lg border"
                    src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(selectedIntegration.url)}&sz=64`}
                  />
                  {selectedIntegration.title} Settings
                </>
              )}
            </DialogTitle>
            <DialogDescription>Configure integration settings and preferences.</DialogDescription>
          </DialogHeader>
          {integrationSettings && (
            <div className="flex flex-col gap-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Sync</Label>
                    <p className="text-muted-foreground text-xs">Automatically sync data at regular intervals</p>
                  </div>
                  <Switch
                    checked={integrationSettings.autoSync}
                    onCheckedChange={(checked) => setIntegrationSettings({ ...integrationSettings, autoSync: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications</Label>
                    <p className="text-muted-foreground text-xs">Receive notifications for integration events</p>
                  </div>
                  <Switch
                    checked={integrationSettings.notifications}
                    onCheckedChange={(checked) =>
                      setIntegrationSettings({ ...integrationSettings, notifications: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Webhooks</Label>
                    <p className="text-muted-foreground text-xs">Enable webhook callbacks for real-time updates</p>
                  </div>
                  <Switch
                    checked={integrationSettings.webhooks}
                    onCheckedChange={(checked) => setIntegrationSettings({ ...integrationSettings, webhooks: checked })}
                  />
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  value={integrationSettings.apiKey}
                  onChange={(e) => setIntegrationSettings({ ...integrationSettings, apiKey: e.target.value })}
                  placeholder="Enter API key"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  value={integrationSettings.webhookUrl}
                  onChange={(e) => setIntegrationSettings({ ...integrationSettings, webhookUrl: e.target.value })}
                  placeholder="https://your-domain.com/webhook"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={integrationSettings.notes}
                  onChange={(e) => setIntegrationSettings({ ...integrationSettings, notes: e.target.value })}
                  placeholder="Add notes about this integration..."
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disconnect Integration</DialogTitle>
            <DialogDescription>
              Are you sure you want to disconnect {selectedIntegration?.title}? This will stop all data synchronization
              and may affect dependent workflows.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisconnectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setShowDisconnectDialog(false)}>
              <Unplug className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
