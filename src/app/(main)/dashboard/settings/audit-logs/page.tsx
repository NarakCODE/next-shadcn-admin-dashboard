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
  AlertTriangle,
  Calendar,
  Download,
  FileText,
  LogIn,
  LogOut,
  MoreHorizontal,
  Search,
  Settings,
  Shield,
  User,
} from "lucide-react";

import { FeatureGate } from "@/components/features";
import { DataGrid, DataGridContainer, DataGridTable } from "@/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AuditAction =
  | "login"
  | "logout"
  | "create"
  | "update"
  | "delete"
  | "export"
  | "settings_change"
  | "permission_change";

type AuditLog = {
  id: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  action: AuditAction;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  severity: "info" | "warning" | "critical";
};

const initialAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "2024-01-15T10:30:00Z",
    user: {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "",
    },
    action: "login",
    resource: "Authentication",
    details: "Successful login from Chrome on macOS",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    location: "San Francisco, CA",
    severity: "info",
  },
  {
    id: "log-2",
    timestamp: "2024-01-15T09:45:00Z",
    user: {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "",
    },
    action: "delete",
    resource: "Project: Marketing Campaign",
    details: "Deleted project and all associated data",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    location: "New York, NY",
    severity: "warning",
  },
  {
    id: "log-3",
    timestamp: "2024-01-15T08:20:00Z",
    user: {
      id: "user-3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      avatar: "",
    },
    action: "permission_change",
    resource: "Team Member: Alice Williams",
    details: "Changed role from Member to Admin",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
    location: "Austin, TX",
    severity: "warning",
  },
  {
    id: "log-4",
    timestamp: "2024-01-14T23:15:00Z",
    user: {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "",
    },
    action: "export",
    resource: "Customer Data",
    details: "Exported 1,234 customer records to CSV",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    location: "San Francisco, CA",
    severity: "info",
  },
  {
    id: "log-5",
    timestamp: "2024-01-14T22:30:00Z",
    user: {
      id: "user-4",
      name: "Unknown",
      email: "unknown@example.com",
      avatar: "",
    },
    action: "login",
    resource: "Authentication",
    details: "Failed login attempt - invalid credentials",
    ipAddress: "203.0.113.45",
    userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1)",
    location: "Unknown",
    severity: "critical",
  },
  {
    id: "log-6",
    timestamp: "2024-01-14T20:00:00Z",
    user: {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "",
    },
    action: "settings_change",
    resource: "Security Settings",
    details: "Enabled two-factor authentication",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    location: "New York, NY",
    severity: "info",
  },
];

const ACTION_CONFIG: Record<AuditAction, { label: string; icon: typeof LogIn; color: string }> = {
  login: { label: "Login", icon: LogIn, color: "text-blue-600" },
  logout: { label: "Logout", icon: LogOut, color: "text-gray-600" },
  create: { label: "Create", icon: FileText, color: "text-green-600" },
  update: { label: "Update", icon: Settings, color: "text-blue-600" },
  delete: { label: "Delete", icon: FileText, color: "text-red-600" },
  export: { label: "Export", icon: Download, color: "text-purple-600" },
  settings_change: { label: "Settings Change", icon: Settings, color: "text-orange-600" },
  permission_change: { label: "Permission Change", icon: Shield, color: "text-yellow-600" },
};

const SEVERITY_CONFIG = {
  info: { label: "Info", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  warning: {
    label: "Warning",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  critical: {
    label: "Critical",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
};

export default function AuditLogsPage() {
  const [auditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: true }]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        searchQuery === "" ||
        log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
      const matchesUser = userFilter === "all" || log.user.id === userFilter;

      return matchesSearch && matchesAction && matchesSeverity && matchesUser;
    });
  }, [auditLogs, searchQuery, actionFilter, severityFilter, userFilter]);

  const columns: ColumnDef<AuditLog>[] = useMemo(
    () => [
      {
        accessorKey: "timestamp",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Timestamp" />,
        cell: ({ row }) => {
          const timestamp = row.original.timestamp;
          return (
            <div className="flex flex-col">
              <span className="font-medium text-sm">{format(new Date(timestamp), "MMM d, yyyy")}</span>
              <span className="text-muted-foreground text-xs">{format(new Date(timestamp), "h:mm a")}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "user",
        header: ({ column }) => <DataGridColumnHeader column={column} title="User" />,
        cell: ({ row }) => {
          const user = row.original.user;
          return (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || undefined} alt={user.name} />
                <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user.name}</span>
                <span className="text-muted-foreground text-xs">{user.email}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "action",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Action" />,
        cell: ({ row }) => {
          const action = row.original.action;
          const config = ACTION_CONFIG[action];
          const Icon = config.icon;
          return (
            <Badge variant="outline" className="gap-1">
              <Icon className={`h-3 w-3 ${config.color}`} />
              {config.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "resource",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Resource" />,
        cell: ({ row }) => <span className="text-sm">{row.original.resource}</span>,
      },
      {
        accessorKey: "details",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Details" />,
        cell: ({ row }) => (
          <span className="max-w-xs truncate text-muted-foreground text-sm">{row.original.details}</span>
        ),
      },
      {
        accessorKey: "severity",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Severity" />,
        cell: ({ row }) => {
          const severity = row.original.severity;
          const config = SEVERITY_CONFIG[severity];
          return (
            <Badge variant="outline" className={config.color}>
              {config.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "ipAddress",
        header: ({ column }) => <DataGridColumnHeader column={column} title="IP Address" />,
        cell: ({ row }) => (
          <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{row.original.ipAddress}</code>
        ),
      },
      {
        accessorKey: "location",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Location" />,
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.location}</span>,
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const _log = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Full Details</DropdownMenuItem>
                <DropdownMenuItem>View User Activity</DropdownMenuItem>
                <DropdownMenuItem>View Session</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredLogs,
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

  const uniqueUsers = useMemo(() => {
    const users = new Map(auditLogs.map((log) => [log.user.id, log.user]));
    return Array.from(users.values());
  }, [auditLogs]);

  const criticalCount = auditLogs.filter((log) => log.severity === "critical").length;

  return (
    <FeatureGate feature="auditLogs" showUpgradePrompt>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-3xl tracking-tight">Audit Logs</h1>
            <p className="text-muted-foreground">Track all user activity and system events for compliance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Total Events</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-2xl">{auditLogs.length}</div>
              <p className="text-muted-foreground text-xs">Last 90 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Critical Events</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-2xl text-destructive">{criticalCount}</div>
              <p className="text-muted-foreground text-xs">Requires attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Active Users</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-2xl">{uniqueUsers.length}</div>
              <p className="text-muted-foreground text-xs">In audit period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Retention</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-2xl">90 days</div>
              <p className="text-muted-foreground text-xs">Enterprise plan</p>
            </CardContent>
          </Card>
        </div>

        {criticalCount > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {criticalCount} critical event{criticalCount > 1 ? "s" : ""} detected
                </p>
                <p className="text-muted-foreground text-xs">Review suspicious activity immediately</p>
              </div>
              <Button variant="destructive" size="sm">
                Review Now
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataGrid table={table} recordCount={filteredLogs.length}>
          <DataGridContainer>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </DataGridContainer>
          <DataGridPagination table={table} />
        </DataGrid>
      </div>
    </FeatureGate>
  );
}
