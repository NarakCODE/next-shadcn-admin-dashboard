"use client";

import { useMemo, useState } from "react";

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Webhook,
  XCircle,
} from "lucide-react";

import { FeatureGate, UsageIndicator } from "@/components/features";
import { DataGrid, DataGridContainer, DataGridTable } from "@/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type WebhookStatus = "active" | "paused" | "failing";

type WebhookEvent =
  | "user.created"
  | "user.updated"
  | "user.deleted"
  | "project.created"
  | "project.updated"
  | "project.deleted"
  | "invoice.paid"
  | "invoice.failed"
  | "team.member.added"
  | "team.member.removed";

type WebhookConfig = {
  id: string;
  url: string;
  description: string;
  events: WebhookEvent[];
  status: WebhookStatus;
  createdAt: string;
  lastDelivery: string | null;
  successRate: number;
  secret: string;
};

type DeliveryLog = {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  timestamp: string;
  statusCode: number;
  duration: number;
  success: boolean;
  response: string;
};

const initialWebhooks: WebhookConfig[] = [
  {
    id: "wh-1",
    url: "https://api.example.com/webhooks/users",
    description: "User lifecycle events",
    events: ["user.created", "user.updated", "user.deleted"],
    status: "active",
    createdAt: "2024-01-10",
    lastDelivery: "2024-01-15T10:30:00Z",
    successRate: 98.5,
    secret: "whsec_abc123def456ghi789jkl012mno345",
  },
  {
    id: "wh-2",
    url: "https://api.example.com/webhooks/projects",
    description: "Project updates",
    events: ["project.created", "project.updated"],
    status: "active",
    createdAt: "2024-01-12",
    lastDelivery: "2024-01-15T09:45:00Z",
    successRate: 100,
    secret: "whsec_xyz789uvw456rst123opq098lmn654",
  },
  {
    id: "wh-3",
    url: "https://api.example.com/webhooks/billing",
    description: "Billing notifications",
    events: ["invoice.paid", "invoice.failed"],
    status: "failing",
    createdAt: "2024-01-08",
    lastDelivery: "2024-01-15T08:20:00Z",
    successRate: 45.2,
    secret: "whsec_mno345pqr678stu901vwx234yzb567",
  },
];

const initialDeliveryLogs: DeliveryLog[] = [
  {
    id: "log-1",
    webhookId: "wh-1",
    event: "user.created",
    timestamp: "2024-01-15T10:30:00Z",
    statusCode: 200,
    duration: 145,
    success: true,
    response: '{"status": "ok"}',
  },
  {
    id: "log-2",
    webhookId: "wh-1",
    event: "user.updated",
    timestamp: "2024-01-15T09:45:00Z",
    statusCode: 200,
    duration: 132,
    success: true,
    response: '{"status": "ok"}',
  },
  {
    id: "log-3",
    webhookId: "wh-3",
    event: "invoice.paid",
    timestamp: "2024-01-15T08:20:00Z",
    statusCode: 500,
    duration: 5000,
    success: false,
    response: "Internal Server Error",
  },
];

const EVENT_OPTIONS: { value: WebhookEvent; label: string; category: string }[] = [
  { value: "user.created", label: "User Created", category: "Users" },
  { value: "user.updated", label: "User Updated", category: "Users" },
  { value: "user.deleted", label: "User Deleted", category: "Users" },
  { value: "project.created", label: "Project Created", category: "Projects" },
  { value: "project.updated", label: "Project Updated", category: "Projects" },
  { value: "project.deleted", label: "Project Deleted", category: "Projects" },
  { value: "invoice.paid", label: "Invoice Paid", category: "Billing" },
  { value: "invoice.failed", label: "Invoice Failed", category: "Billing" },
  { value: "team.member.added", label: "Team Member Added", category: "Team" },
  { value: "team.member.removed", label: "Team Member Removed", category: "Team" },
];

const STATUS_CONFIG = {
  active: { label: "Active", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  paused: { label: "Paused", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  failing: { label: "Failing", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
};

export default function WebhooksManagementPage() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(initialWebhooks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfig | null>(null);
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});

  const [newWebhook, setNewWebhook] = useState({
    url: "",
    description: "",
    events: [] as WebhookEvent[],
  });

  const filteredWebhooks = useMemo(() => {
    return webhooks.filter((webhook) => {
      const matchesSearch =
        searchQuery === "" ||
        webhook.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        webhook.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || webhook.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [webhooks, searchQuery, statusFilter]);

  const columns: ColumnDef<WebhookConfig>[] = useMemo(
    () => [
      {
        accessorKey: "url",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Endpoint URL" />,
        cell: ({ row }) => {
          const webhook = row.original;
          return (
            <div className="flex flex-col">
              <code className="font-mono text-sm">{webhook.url}</code>
              <span className="text-muted-foreground text-xs">{webhook.description}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "events",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Events" />,
        cell: ({ row }) => {
          const events = row.original.events;
          return (
            <div className="flex flex-wrap gap-1">
              {events.slice(0, 2).map((event: WebhookEvent) => (
                <Badge key={event} variant="outline" className="text-xs">
                  {event}
                </Badge>
              ))}
              {events.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{events.length - 2}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
          const status: WebhookStatus = row.original.status;
          const config = STATUS_CONFIG[status];
          return (
            <Badge variant="outline" className={config.color}>
              {config.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "successRate",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Success Rate" />,
        cell: ({ row }) => {
          const rate = row.original.successRate;
          const color = rate >= 95 ? "text-green-600" : rate >= 80 ? "text-yellow-600" : "text-red-600";
          return <span className={`font-medium ${color}`}>{rate.toFixed(1)}%</span>;
        },
      },
      {
        accessorKey: "lastDelivery",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Last Delivery" />,
        cell: ({ row }) => {
          const lastDelivery = row.original.lastDelivery;
          if (!lastDelivery) return <span className="text-muted-foreground text-sm">Never</span>;
          return (
            <span className="text-muted-foreground text-sm">{format(new Date(lastDelivery), "MMM d, h:mm a")}</span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Created" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {format(new Date(row.original.createdAt), "MMM d, yyyy")}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const webhook = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedWebhook(webhook);
                    setLogsDialogOpen(true);
                  }}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  View Delivery Logs
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Play className="mr-2 h-4 w-4" />
                  Test Webhook
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>{webhook.status === "active" ? "Pause" : "Resume"}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    setWebhooks((prev) => prev.filter((w) => w.id !== webhook.id));
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredWebhooks,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleCreateWebhook = () => {
    const webhook: WebhookConfig = {
      id: `wh-${Date.now()}`,
      url: newWebhook.url,
      description: newWebhook.description,
      events: newWebhook.events,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      lastDelivery: null,
      successRate: 100,
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
    };

    setWebhooks((prev) => [...prev, webhook]);
    setNewWebhook({ url: "", description: "", events: [] });
    setCreateDialogOpen(false);
  };

  const toggleEvent = (event: WebhookEvent) => {
    setNewWebhook((prev) => ({
      ...prev,
      events: prev.events.includes(event) ? prev.events.filter((e) => e !== event) : [...prev.events, event],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const failingCount = webhooks.filter((w) => w.status === "failing").length;

  return (
    <FeatureGate feature="webhooks" showUpgradePrompt>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-3xl tracking-tight">Webhooks</h1>
            <p className="text-muted-foreground">Receive real-time notifications when events occur in your account</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Webhook
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Total Webhooks</CardTitle>
              <Webhook className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-2xl">{webhooks.length}</div>
              <p className="text-muted-foreground text-xs">
                {webhooks.filter((w) => w.status === "active").length} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Success Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-2xl">
                {(webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length).toFixed(1)}%
              </div>
              <p className="text-muted-foreground text-xs">Average across all webhooks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Failing</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-2xl text-destructive">{failingCount}</div>
              <p className="text-muted-foreground text-xs">Requires attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <UsageIndicator metric="webhooks" label="Webhook Limit" />
            </CardHeader>
          </Card>
        </div>

        {failingCount > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {failingCount} webhook{failingCount > 1 ? "s" : ""} failing
                </p>
                <p className="text-muted-foreground text-xs">Check delivery logs for details</p>
              </div>
              <Button variant="destructive" size="sm">
                View Logs
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search webhooks..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="paused">Paused</TabsTrigger>
                <TabsTrigger value="failing">Failing</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <DataGrid table={table} recordCount={filteredWebhooks.length}>
          <DataGridContainer>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </DataGridContainer>
          <DataGridPagination table={table} />
        </DataGrid>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Webhook</DialogTitle>
              <DialogDescription>Configure a new webhook to receive event notifications</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="url">Endpoint URL</Label>
                <Input
                  id="url"
                  placeholder="https://api.example.com/webhooks"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook((prev) => ({ ...prev, url: e.target.value }))}
                />
                <p className="text-muted-foreground text-xs">Must be a valid HTTPS URL</p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="What is this webhook for?"
                  value={newWebhook.description}
                  onChange={(e) => setNewWebhook((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <Label>Events to Subscribe</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {EVENT_OPTIONS.map((event) => (
                    <div key={event.value} className="flex items-center gap-2">
                      <Checkbox
                        id={event.value}
                        checked={newWebhook.events.includes(event.value)}
                        onCheckedChange={() => toggleEvent(event.value)}
                      />
                      <Label htmlFor={event.value} className="text-sm">
                        {event.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWebhook} disabled={!newWebhook.url || newWebhook.events.length === 0}>
                Create Webhook
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={logsDialogOpen} onOpenChange={setLogsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Delivery Logs</DialogTitle>
              <DialogDescription>{selectedWebhook?.url}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label>Webhook Secret</Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={selectedWebhook?.secret || ""}
                    type={showSecret[selectedWebhook?.id || ""] ? "text" : "password"}
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setShowSecret((prev) => ({
                        ...prev,
                        [selectedWebhook?.id || ""]: !prev[selectedWebhook?.id || ""],
                      }))
                    }
                  >
                    {showSecret[selectedWebhook?.id || ""] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(selectedWebhook?.secret || "")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">Use this secret to verify webhook signatures</p>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <Label>Recent Deliveries</Label>
                <div className="flex flex-col gap-2">
                  {initialDeliveryLogs
                    .filter((log) => log.webhookId === selectedWebhook?.id)
                    .map((log) => (
                      <div key={log.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          {log.success ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{log.event}</span>
                              <Badge variant="outline" className="text-xs">
                                {log.statusCode}
                              </Badge>
                            </div>
                            <span className="text-muted-foreground text-xs">
                              {format(new Date(log.timestamp), "MMM d, yyyy h:mm a")} • {log.duration}ms
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!log.success && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLogsDialogOpen(false)}>
                Close
              </Button>
              <Button variant="outline">
                <Play className="mr-2 h-4 w-4" />
                Send Test Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FeatureGate>
  );
}
