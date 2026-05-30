"use client";

import { useMemo, useState } from "react";

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Download,
  Eye,
  Filter,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";

import { type BulkAction, BulkActionsBar } from "@/components/features/bulk-actions-bar";
import { SavedViewsManager } from "@/components/features/saved-views-manager";
import { DataGrid, DataGridContainer, DataGridTable } from "@/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSavedViews } from "@/hooks/use-saved-views";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "editor" | "viewer" | "moderator";
  status: "active" | "inactive" | "suspended";
  location: string;
  joinedDate: string;
  lastActive: string;
  projects: number;
};

const initialUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Johnson",
    email: "alex@apple.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    role: "admin",
    status: "active",
    location: "United States",
    joinedDate: "2024-01-15",
    lastActive: "2024-02-05",
    projects: 12,
  },
  {
    id: "user-2",
    name: "Sarah Chen",
    email: "sarah@openai.com",
    avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    role: "editor",
    status: "active",
    location: "United Kingdom",
    joinedDate: "2023-03-20",
    lastActive: "2024-02-04",
    projects: 8,
  },
  {
    id: "user-3",
    name: "Michael Rodriguez",
    email: "michael@meta.com",
    avatar: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    role: "moderator",
    status: "inactive",
    location: "Canada",
    joinedDate: "2022-06-10",
    lastActive: "2024-01-20",
    projects: 15,
  },
  {
    id: "user-4",
    name: "Emma Wilson",
    email: "emma@tesla.com",
    avatar: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    role: "viewer",
    status: "suspended",
    location: "Australia",
    joinedDate: "2024-09-05",
    lastActive: "2024-01-15",
    projects: 3,
  },
  {
    id: "user-5",
    name: "David Kim",
    email: "david@sap.com",
    avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    role: "admin",
    status: "active",
    location: "Germany",
    joinedDate: "2023-11-12",
    lastActive: "2024-02-05",
    projects: 20,
  },
  {
    id: "user-6",
    name: "Aron Thompson",
    email: "aron@keenthemes.com",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80",
    role: "editor",
    status: "active",
    location: "Malaysia",
    joinedDate: "2022-02-28",
    lastActive: "2024-02-03",
    projects: 10,
  },
  {
    id: "user-7",
    name: "James Brown",
    email: "james@bbva.es",
    avatar: "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
    role: "viewer",
    status: "inactive",
    location: "Spain",
    joinedDate: "2024-08-15",
    lastActive: "2024-01-25",
    projects: 5,
  },
  {
    id: "user-8",
    name: "Maria Garcia",
    email: "maria@sony.jp",
    avatar: "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
    role: "moderator",
    status: "active",
    location: "Japan",
    joinedDate: "2023-12-01",
    lastActive: "2024-02-05",
    projects: 18,
  },
  {
    id: "user-9",
    name: "Nick Johnson",
    email: "nick@lvmh.fr",
    avatar: "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80",
    role: "editor",
    status: "active",
    location: "France",
    joinedDate: "2022-04-10",
    lastActive: "2024-02-04",
    projects: 14,
  },
  {
    id: "user-10",
    name: "Liam Thompson",
    email: "liam@eni.it",
    avatar: "https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=96&h=96&dpr=2&q=80",
    role: "viewer",
    status: "suspended",
    location: "Italy",
    joinedDate: "2024-07-20",
    lastActive: "2024-01-10",
    projects: 2,
  },
  {
    id: "user-11",
    name: "Sophie Anderson",
    email: "sophie@spotify.se",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
    role: "admin",
    status: "active",
    location: "Sweden",
    joinedDate: "2023-05-15",
    lastActive: "2024-02-05",
    projects: 22,
  },
  {
    id: "user-12",
    name: "Carlos Silva",
    email: "carlos@vale.br",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80",
    role: "editor",
    status: "active",
    location: "Brazil",
    joinedDate: "2023-10-08",
    lastActive: "2024-02-03",
    projects: 9,
  },
  {
    id: "user-13",
    name: "Priya Sharma",
    email: "priya@tata.in",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80",
    role: "moderator",
    status: "active",
    location: "India",
    joinedDate: "2024-01-22",
    lastActive: "2024-02-04",
    projects: 11,
  },
  {
    id: "user-14",
    name: "Oliver Martin",
    email: "oliver@airbus.fr",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&dpr=2&q=80",
    role: "viewer",
    status: "inactive",
    location: "France",
    joinedDate: "2023-08-30",
    lastActive: "2024-01-18",
    projects: 4,
  },
  {
    id: "user-15",
    name: "Yuki Tanaka",
    email: "yuki@toyota.jp",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&dpr=2&q=80",
    role: "editor",
    status: "active",
    location: "Japan",
    joinedDate: "2024-02-01",
    lastActive: "2024-02-05",
    projects: 7,
  },
];

const roleColors = {
  admin: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  editor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  moderator: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  viewer: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const statusColors = {
  active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  suspended: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  // Saved views hook
  const {
    views,
    activeViewId,
    saveView,
    updateView,
    deleteView,
    loadView,
    setActiveView,
    setDefaultView,
    hasUnsavedChanges,
  } = useSavedViews({
    namespace: "users-page",
    defaultFilters: {
      globalFilter: "",
      roleFilter: "all",
      statusFilter: "all",
    },
  });

  const currentFilters = useMemo(
    () => ({
      globalFilter,
      roleFilter,
      statusFilter,
    }),
    [globalFilter, roleFilter, statusFilter],
  );

  const filteredData = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        user.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
        user.location.toLowerCase().includes(globalFilter.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, globalFilter, roleFilter, statusFilter]);

  const totalUsers = filteredData.length;
  const activeUsers = filteredData.filter((u) => u.status === "active").length;
  const inactiveUsers = filteredData.filter((u) => u.status === "inactive").length;
  const suspendedUsers = filteredData.filter((u) => u.status === "suspended").length;

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => <DataGridColumnHeader title="User" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={row.original.avatar} alt={row.original.name} />
              <AvatarFallback>
                {row.original.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{row.original.name}</span>
              <span className="text-muted-foreground text-xs">{row.original.email}</span>
            </div>
          </div>
        ),
        size: 220,
        enableSorting: true,
      },
      {
        accessorKey: "role",
        id: "role",
        header: ({ column }) => <DataGridColumnHeader title="Role" column={column} />,
        cell: ({ row }) => <Badge className={roleColors[row.original.role]}>{row.original.role}</Badge>,
        size: 100,
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
        accessorKey: "location",
        id: "location",
        header: ({ column }) => <DataGridColumnHeader title="Location" column={column} />,
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.location}</span>,
        size: 140,
        enableSorting: true,
      },
      {
        accessorKey: "projects",
        id: "projects",
        header: ({ column }) => <DataGridColumnHeader title="Projects" column={column} />,
        cell: ({ row }) => <span className="font-semibold">{row.original.projects}</span>,
        size: 90,
        enableSorting: true,
        meta: {
          cellClassName: "font-semibold",
        },
      },
      {
        accessorKey: "joinedDate",
        id: "joinedDate",
        header: ({ column }) => <DataGridColumnHeader title="Joined" column={column} />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {format(new Date(row.original.joinedDate), "MMM dd, yyyy")}
          </span>
        ),
        size: 130,
        enableSorting: true,
      },
      {
        accessorKey: "lastActive",
        id: "lastActive",
        header: ({ column }) => <DataGridColumnHeader title="Last Active" column={column} />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {format(new Date(row.original.lastActive), "MMM dd, yyyy")}
          </span>
        ),
        size: 130,
        enableSorting: true,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                Change Role
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserCheck className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <UserX className="mr-2 h-4 w-4" />
                Suspend
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 60,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
    getRowId: (row: User) => row.id,
    state: {
      pagination,
      sorting,
      globalFilter,
      rowSelection,
    },
    columnResizeMode: "onChange",
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  // Bulk actions handlers
  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection);
    setUsers((prev) => prev.filter((user) => !selectedIds.includes(user.id)));
    setRowSelection({});
  };

  const handleBulkActivate = async () => {
    const selectedIds = Object.keys(rowSelection);
    setUsers((prev) => prev.map((user) => (selectedIds.includes(user.id) ? { ...user, status: "active" } : user)));
    setRowSelection({});
  };

  const handleBulkSuspend = async () => {
    const selectedIds = Object.keys(rowSelection);
    setUsers((prev) => prev.map((user) => (selectedIds.includes(user.id) ? { ...user, status: "suspended" } : user)));
    setRowSelection({});
  };

  const handleBulkExport = (format: "csv" | "json") => {
    const selectedIds = Object.keys(rowSelection);
    const selectedUsers = users.filter((user) => selectedIds.includes(user.id));
    console.log(`Exporting ${selectedUsers.length} users as ${format}`);
    // In production, this would trigger actual export
  };

  const bulkActions: BulkAction[] = [
    {
      id: "activate",
      label: "Activate",
      icon: <UserCheck className="h-4 w-4" />,
      onClick: handleBulkActivate,
    },
    {
      id: "suspend",
      label: "Suspend",
      icon: <UserX className="h-4 w-4" />,
      onClick: handleBulkSuspend,
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleBulkDelete,
      variant: "destructive",
    },
  ];

  const selectedCount = Object.keys(rowSelection).length;

  // Saved views handlers
  const handleSaveView = (name: string) => {
    saveView(name, currentFilters);
  };

  const handleLoadView = (id: string) => {
    const filters = loadView(id);
    setGlobalFilter(filters.globalFilter);
    setRoleFilter(filters.roleFilter);
    setStatusFilter(filters.statusFilter);
  };

  const handleRenameView = (id: string, name: string) => {
    updateView(id, { name });
  };

  const handleClearActiveView = () => {
    setActiveView(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Total Users</p>
          <p className="mt-1 font-semibold text-2xl">{totalUsers}</p>
          <p className="text-muted-foreground text-xs">All registered users</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Active</p>
          <p className="mt-1 font-semibold text-2xl text-green-600">{activeUsers}</p>
          <p className="text-muted-foreground text-xs">Currently active users</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Inactive</p>
          <p className="mt-1 font-semibold text-2xl text-yellow-600">{inactiveUsers}</p>
          <p className="text-muted-foreground text-xs">Not active recently</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Suspended</p>
          <p className="mt-1 font-semibold text-2xl text-red-600">{suspendedUsers}</p>
          <p className="text-muted-foreground text-xs">Suspended accounts</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <SavedViewsManager
            views={views}
            activeViewId={activeViewId}
            hasUnsavedChanges={hasUnsavedChanges(currentFilters)}
            onSave={handleSaveView}
            onLoad={handleLoadView}
            onDelete={deleteView}
            onRename={handleRenameView}
            onSetDefault={setDefaultView}
            onClearActive={handleClearActiveView}
          />
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <BulkActionsBar
          selectedCount={selectedCount}
          actions={bulkActions}
          onClearSelection={() => setRowSelection({})}
          enableExport
          onExport={handleBulkExport}
        />
      )}

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
    </div>
  );
}
