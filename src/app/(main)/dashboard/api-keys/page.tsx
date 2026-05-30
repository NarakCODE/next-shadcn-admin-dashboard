"use client";

import { useCallback, useMemo, useState } from "react";

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
  BarChart3,
  Check,
  Clock,
  Copy,
  Filter,
  KeyRound,
  Lock,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ToggleRight,
  Trash2,
} from "lucide-react";

import { FeatureGate } from "@/components/features";
import { DataGrid, DataGridContainer, DataGridTable } from "@/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Phase 2 Monitoring imports
import { ApiMetricsDashboard } from "./_components/api-metrics-dashboard";
import { ApiVersionManager } from "./_components/api-version-manager";
import { CostCalculator } from "./_components/cost-calculator";
import { RateLimitMonitor } from "./_components/rate-limit-monitor";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  prefix: string;
  status: "active" | "revoked" | "expired";
  scopes: string[];
  created: string;
  expires: string | null;
  lastUsed: string | null;
  requests: number;
  requestLimit: number;
  environment: "production" | "staging" | "development";
  description: string;
};

const initialApiKeys: ApiKey[] = [
  {
    id: "key-1",
    name: "Production API Key",
    key: "sk_live_mock_key_000000000000000000000001",
    prefix: "sk_live_mock",
    status: "active",
    scopes: ["read", "write", "delete"],
    created: "2024-01-15T10:30:00Z",
    expires: "2025-01-15T10:30:00Z",
    lastUsed: "2024-02-05T14:20:00Z",
    requests: 45230,
    requestLimit: 100000,
    environment: "production",
    description: "Main production key for all API operations",
  },
  {
    id: "key-2",
    name: "Staging Environment",
    key: "sk_test_mock_key_000000000000000000000001",
    prefix: "sk_test_mock",
    status: "active",
    scopes: ["read", "write"],
    created: "2024-01-20T09:15:00Z",
    expires: "2025-01-20T09:15:00Z",
    lastUsed: "2024-02-04T16:45:00Z",
    requests: 12890,
    requestLimit: 50000,
    environment: "staging",
    description: "Staging environment key for testing",
  },
  {
    id: "key-3",
    name: "Read-Only Analytics",
    key: "sk_live_mock_key_000000000000000000000002",
    prefix: "sk_live_mock",
    status: "active",
    scopes: ["read"],
    created: "2024-02-01T11:00:00Z",
    expires: null,
    lastUsed: "2024-02-05T09:30:00Z",
    requests: 8750,
    requestLimit: 25000,
    environment: "production",
    description: "Read-only key for analytics dashboard",
  },
  {
    id: "key-4",
    name: "Legacy Integration",
    key: "sk_live_mock_key_000000000000000000000003",
    prefix: "sk_live_mock",
    status: "revoked",
    scopes: ["read", "write", "delete", "admin"],
    created: "2023-06-10T08:00:00Z",
    expires: "2024-06-10T08:00:00Z",
    lastUsed: "2024-01-10T12:00:00Z",
    requests: 98500,
    requestLimit: 100000,
    environment: "production",
    description: "Old integration key - revoked for security",
  },
  {
    id: "key-5",
    name: "Development Key",
    key: "sk_dev_mock_key_000000000000000000000001",
    prefix: "sk_dev_mock",
    status: "active",
    scopes: ["read", "write", "delete"],
    created: "2024-02-02T14:30:00Z",
    expires: "2024-08-02T14:30:00Z",
    lastUsed: "2024-02-05T17:00:00Z",
    requests: 3420,
    requestLimit: 10000,
    environment: "development",
    description: "Local development and debugging",
  },
  {
    id: "key-6",
    name: "Webhook Handler",
    key: "sk_live_mock_key_000000000000000000000004",
    prefix: "sk_live_mock",
    status: "active",
    scopes: ["read", "write"],
    created: "2024-01-25T16:00:00Z",
    expires: null,
    lastUsed: "2024-02-05T18:00:00Z",
    requests: 22100,
    requestLimit: 75000,
    environment: "production",
    description: "Dedicated key for webhook processing",
  },
  {
    id: "key-7",
    name: "Expired Test Key",
    key: "sk_test_mock_key_000000000000000000000002",
    prefix: "sk_test_mock",
    status: "expired",
    scopes: ["read"],
    created: "2023-12-01T13:00:00Z",
    expires: "2024-02-01T13:00:00Z",
    lastUsed: "2024-01-28T15:30:00Z",
    requests: 5600,
    requestLimit: 10000,
    environment: "staging",
    description: "Test key that has expired",
  },
  {
    id: "key-8",
    name: "Mobile App Backend",
    key: "sk_live_mock_key_000000000000000000000005",
    prefix: "sk_live_mock",
    status: "active",
    scopes: ["read", "write"],
    created: "2024-01-28T07:45:00Z",
    expires: "2025-01-28T07:45:00Z",
    lastUsed: "2024-02-05T19:00:00Z",
    requests: 67800,
    requestLimit: 200000,
    environment: "production",
    description: "API key for mobile app backend services",
  },
];

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  revoked: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  expired: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const envColors: Record<string, string> = {
  production: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  staging: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  development: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
};

const availableScopes = [
  { value: "read", label: "Read", description: "Read data from the API" },
  { value: "write", label: "Write", description: "Create and update data" },
  { value: "delete", label: "Delete", description: "Delete resources" },
  { value: "admin", label: "Admin", description: "Full administrative access" },
];

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [envFilter, setEnvFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "lastUsed", desc: true }]);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [showNewKeyResult, setShowNewKeyResult] = useState(false);
  const [newKey, setNewKey] = useState<ApiKey | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedKey, _setSelectedKey] = useState<ApiKey | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    environment: "production" as "production" | "staging" | "development",
    scopes: ["read"] as string[],
    expires: "90" as string,
  });

  const filteredData = useMemo(() => {
    return apiKeys.filter((key) => {
      const matchesSearch =
        key.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        key.prefix.toLowerCase().includes(globalFilter.toLowerCase()) ||
        key.description.toLowerCase().includes(globalFilter.toLowerCase());
      const matchesStatus = statusFilter === "all" || key.status === statusFilter;
      const matchesEnv = envFilter === "all" || key.environment === envFilter;
      return matchesSearch && matchesStatus && matchesEnv;
    });
  }, [apiKeys, globalFilter, statusFilter, envFilter]);

  const totalKeys = apiKeys.length;
  const activeKeys = apiKeys.filter((k) => k.status === "active").length;
  const totalRequests = apiKeys.reduce((sum, k) => sum + k.requests, 0);
  const revokedKeys = apiKeys.filter((k) => k.status === "revoked").length;

  const handleCopy = useCallback((key: ApiKey) => {
    navigator.clipboard.writeText(key.key);
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleRegenerate = useCallback(
    (key: ApiKey) => {
      const newKeyValue = `sk_${key.environment === "production" ? "live" : key.environment === "staging" ? "test" : "dev"}_${Math.random().toString(36).substring(2, 40)}`;
      const newPrefix = newKeyValue.substring(0, 12);
      setApiKeys(
        apiKeys.map((k) =>
          k.id === key.id ? { ...k, key: newKeyValue, prefix: newPrefix, created: new Date().toISOString() } : k,
        ),
      );
    },
    [apiKeys],
  );

  const handleToggleStatus = useCallback(
    (key: ApiKey) => {
      setApiKeys(
        apiKeys.map((k) =>
          k.id === key.id
            ? { ...k, status: k.status === "active" ? "revoked" : ("active" as "active" | "revoked" | "expired") }
            : k,
        ),
      );
    },
    [apiKeys],
  );

  const handleRevoke = useCallback(() => {
    if (keyToRevoke) {
      setApiKeys(apiKeys.map((k) => (k.id === keyToRevoke.id ? { ...k, status: "revoked" as const } : k)));
      setShowRevokeDialog(false);
      setKeyToRevoke(null);
    }
  }, [apiKeys, keyToRevoke]);

  const handleCreateKey = useCallback(() => {
    const envPrefix =
      formData.environment === "production" ? "live" : formData.environment === "staging" ? "test" : "dev";
    const newKeyValue = `sk_${envPrefix}_${Math.random().toString(36).substring(2, 40)}`;
    const newPrefix = newKeyValue.substring(0, 12);

    const now = new Date();
    const expiresDate =
      formData.expires !== "never"
        ? new Date(now.getTime() + parseInt(formData.expires, 10) * 24 * 60 * 60 * 1000)
        : null;

    const newKeyObj: ApiKey = {
      id: `key-${Date.now()}`,
      name: formData.name,
      key: newKeyValue,
      prefix: newPrefix,
      status: "active",
      scopes: formData.scopes,
      created: now.toISOString(),
      expires: expiresDate ? expiresDate.toISOString() : null,
      lastUsed: null,
      requests: 0,
      requestLimit: formData.environment === "production" ? 100000 : formData.environment === "staging" ? 50000 : 10000,
      environment: formData.environment,
      description: formData.description,
    };

    setApiKeys([newKeyObj, ...apiKeys]);
    setNewKey(newKeyObj);
    setShowKeyDialog(false);
    setShowNewKeyResult(true);
    setFormData({ name: "", description: "", environment: "production", scopes: ["read"], expires: "90" });
  }, [apiKeys, formData]);

  const columns = useMemo<ColumnDef<ApiKey>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => <DataGridColumnHeader title="Name" column={column} />,
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm">{row.original.name}</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-muted-foreground text-xs">{row.original.prefix}••••••••</span>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleCopy(row.original)}>
                {copiedId === row.original.id ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        ),
        size: 220,
        enableSorting: true,
      },
      {
        accessorKey: "environment",
        id: "environment",
        header: ({ column }) => <DataGridColumnHeader title="Environment" column={column} />,
        cell: ({ row }) => <Badge className={envColors[row.original.environment]}>{row.original.environment}</Badge>,
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "scopes",
        id: "scopes",
        header: ({ column }) => <DataGridColumnHeader title="Scopes" column={column} />,
        cell: ({ row }) => (
          <div className="flex gap-1">
            {row.original.scopes.map((scope) => (
              <Badge key={scope} variant="outline" className="text-xs">
                {scope}
              </Badge>
            ))}
          </div>
        ),
        size: 180,
        enableSorting: false,
      },
      {
        accessorKey: "requests",
        id: "requests",
        header: ({ column }) => <DataGridColumnHeader title="Usage" column={column} />,
        cell: ({ row }) => (
          <div className="flex w-32 flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{row.original.requests.toLocaleString()}</span>
              <span className="text-muted-foreground">/ {row.original.requestLimit.toLocaleString()}</span>
            </div>
            <Progress value={(row.original.requests / row.original.requestLimit) * 100} className="h-1.5" />
          </div>
        ),
        size: 160,
        enableSorting: true,
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        cell: ({ row }) => <Badge className={statusColors[row.original.status]}>{row.original.status}</Badge>,
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "lastUsed",
        id: "lastUsed",
        header: ({ column }) => <DataGridColumnHeader title="Last Used" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">
              {row.original.lastUsed ? format(new Date(row.original.lastUsed), "MMM dd, HH:mm") : "Never"}
            </span>
          </div>
        ),
        size: 140,
        enableSorting: true,
      },
      {
        accessorKey: "expires",
        id: "expires",
        header: ({ column }) => <DataGridColumnHeader title="Expires" column={column} />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {row.original.expires ? format(new Date(row.original.expires), "MMM dd, yyyy") : "Never"}
          </span>
        ),
        size: 120,
        enableSorting: true,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Switch
                    checked={row.original.status === "active"}
                    onCheckedChange={() => handleToggleStatus(row.original)}
                    className="scale-75"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{row.original.status === "active" ? "Revoke key" : "Activate key"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => handleRegenerate(row.original)}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-red-600 text-xs hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
              onClick={() => {
                setKeyToRevoke(row.original);
                setShowRevokeDialog(true);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Revoke
            </Button>
          </div>
        ),
        size: 280,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [handleCopy, handleRegenerate, handleToggleStatus, copiedId],
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
    getRowId: (row: ApiKey) => row.id,
    state: {
      pagination,
      sorting,
      globalFilter,
    },
    columnResizeMode: "onChange",
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const toggleScope = (scope: string) => {
    setFormData((prev) => ({
      ...prev,
      scopes: prev.scopes.includes(scope) ? prev.scopes.filter((s) => s !== scope) : [...prev.scopes, scope],
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">API Keys</h1>
          <p className="text-muted-foreground text-sm">Manage your API keys and access tokens</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Shield className="mr-2 h-4 w-4" />
            Permissions
          </Button>
          <Button size="sm" onClick={() => setShowKeyDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Key
          </Button>
        </div>
      </div>

      <Tabs defaultValue="keys" className="flex flex-col gap-4">
        <TabsList className="h-9 w-fit border border-border/40 bg-background/50 p-1">
          <TabsTrigger value="keys" className="h-7 px-3 text-xs">
            Active Key Management
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex h-7 items-center gap-1.5 px-3 text-xs">
            Key Usage Analytics
            <Lock className="h-3 w-3 text-muted-foreground/80" />
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex h-7 items-center gap-1.5 px-3 text-xs">
            Governance & Pricing
            <Lock className="h-3 w-3 text-muted-foreground/80" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="mt-0 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">Total Keys</CardTitle>
                <KeyRound className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-semibold text-2xl">{totalKeys}</div>
                <p className="text-muted-foreground text-xs">{activeKeys} active keys</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">Total Requests</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-semibold text-2xl">{totalRequests.toLocaleString()}</div>
                <p className="text-muted-foreground text-xs">Across all keys</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">Active Keys</CardTitle>
                <ToggleRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="font-semibold text-2xl text-green-600">{activeKeys}</div>
                <p className="text-muted-foreground text-xs">{revokedKeys} revoked keys</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">Avg Usage</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-semibold text-2xl">
                  {activeKeys > 0 ? Math.round(totalRequests / activeKeys).toLocaleString() : 0}
                </div>
                <p className="text-muted-foreground text-xs">Requests per active key</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search keys..."
                className="pl-9"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="revoked">Revoked</TabsTrigger>
                  <TabsTrigger value="expired">Expired</TabsTrigger>
                </TabsList>
              </Tabs>
              <Select value={envFilter} onValueChange={setEnvFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Environments</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DataGrid table={table} recordCount={filteredData.length}>
            <div className="w-full space-y-2.5">
              <DataGridContainer>
                <DataGridScrollArea>
                  <DataGridTable />
                </DataGridScrollArea>
              </DataGridContainer>
              <DataGridPagination table={table} />
            </div>
          </DataGrid>
        </TabsContent>

        <TabsContent value="monitoring" className="mt-0">
          <FeatureGate feature="apiMonitoring" showUpgradePrompt={true}>
            <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
              <div className="xl:col-span-8">
                <ApiMetricsDashboard />
              </div>
              <div className="xl:col-span-4">
                <RateLimitMonitor />
              </div>
            </div>
          </FeatureGate>
        </TabsContent>

        <TabsContent value="versions" className="mt-0">
          <FeatureGate feature="apiMonitoring" showUpgradePrompt={true}>
            <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
              <div className="xl:col-span-6">
                <CostCalculator />
              </div>
              <div className="xl:col-span-6">
                <ApiVersionManager />
              </div>
            </div>
          </FeatureGate>
        </TabsContent>
      </Tabs>

      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>Generate a new API key with specific permissions and expiration.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="key-name">Key Name</Label>
              <Input
                id="key-name"
                placeholder="e.g., Production API Key"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="key-description">Description</Label>
              <Textarea
                id="key-description"
                placeholder="What is this key used for?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Environment</Label>
              <div className="flex gap-2">
                {(["production", "staging", "development"] as const).map((env) => (
                  <Button
                    key={env}
                    variant={formData.environment === env ? "default" : "outline"}
                    className="flex-1 capitalize"
                    onClick={() => setFormData({ ...formData, environment: env })}
                  >
                    {env}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Permissions (Scopes)</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableScopes.map((scope) => (
                  <button
                    key={scope.value}
                    type="button"
                    onClick={() => toggleScope(scope.value)}
                    className={`flex items-start gap-2 rounded-lg border p-3 text-left transition-colors ${
                      formData.scopes.includes(scope.value) ? "border-primary bg-primary/5" : "hover:bg-accent"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded border ${
                        formData.scopes.includes(scope.value) ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {formData.scopes.includes(scope.value) && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{scope.label}</p>
                      <p className="text-muted-foreground text-xs">{scope.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="key-expires">Expiration</Label>
              <Select value={formData.expires} onValueChange={(value) => setFormData({ ...formData, expires: value })}>
                <SelectTrigger id="key-expires">
                  <SelectValue placeholder="Select expiration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="never">Never expires</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowKeyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey} disabled={!formData.name || formData.scopes.length === 0}>
              <KeyRound className="mr-2 h-4 w-4" />
              Generate Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewKeyResult} onOpenChange={setShowNewKeyResult}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>API Key Created</DialogTitle>
            <DialogDescription>
              Your new API key has been generated. Copy it now - you won&apos;t be able to see it again.
            </DialogDescription>
          </DialogHeader>
          {newKey && (
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input readOnly value={newKey.key} className="font-mono text-sm" />
                  <Button variant="outline" size="icon" onClick={() => handleCopy(newKey)}>
                    {copiedId === newKey.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Important:</strong> Store this key securely. It will not be shown again.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowNewKeyResult(false)}>I&apos;ve saved it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Key Details</DialogTitle>
            <DialogDescription>View detailed information about this API key.</DialogDescription>
          </DialogHeader>
          {selectedKey && (
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedKey.name}</h3>
                  <p className="text-muted-foreground text-sm">{selectedKey.description}</p>
                </div>
                <Badge className={statusColors[selectedKey.status]}>{selectedKey.status}</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Environment</p>
                  <Badge className={envColors[selectedKey.environment]}>{selectedKey.environment}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Created</p>
                  <p className="font-medium text-sm">{format(new Date(selectedKey.created), "MMM dd, yyyy")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Last Used</p>
                  <p className="font-medium text-sm">
                    {selectedKey.lastUsed ? format(new Date(selectedKey.lastUsed), "MMM dd, yyyy HH:mm") : "Never"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Expires</p>
                  <p className="font-medium text-sm">
                    {selectedKey.expires ? format(new Date(selectedKey.expires), "MMM dd, yyyy") : "Never"}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="mb-2 text-muted-foreground text-sm">Scopes</p>
                <div className="flex gap-1">
                  {selectedKey.scopes.map((scope) => (
                    <Badge key={scope} variant="outline">
                      {scope}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="font-medium">
                    {selectedKey.requests.toLocaleString()} / {selectedKey.requestLimit.toLocaleString()}
                  </span>
                </div>
                <Progress value={(selectedKey.requests / selectedKey.requestLimit) * 100} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Revoke API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke &quot;{keyToRevoke?.name}&quot;? This action cannot be undone and will
              immediately invalidate this key.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevokeDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevoke}>
              <Trash2 className="mr-2 h-4 w-4" />
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
