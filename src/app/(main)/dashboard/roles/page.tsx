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
import { Copy, Download, Eye, Filter, MoreHorizontal, Pencil, Plus, Search, Shield, Trash2, Users } from "lucide-react";

import { DataGrid, DataGridContainer, DataGridTable } from "@/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type Permission = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: {
    users: Permission;
    projects: Permission;
    reports: Permission;
    settings: Permission;
  };
  userCount: number;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
};

const initialRoles: Role[] = [
  {
    id: "role-1",
    name: "Super Admin",
    description: "Full access to all features and settings",
    permissions: {
      users: { create: true, read: true, update: true, delete: true },
      projects: { create: true, read: true, update: true, delete: true },
      reports: { create: true, read: true, update: true, delete: true },
      settings: { create: true, read: true, update: true, delete: true },
    },
    userCount: 3,
    createdAt: "2023-01-01",
    updatedAt: "2024-01-15",
    isDefault: true,
  },
  {
    id: "role-2",
    name: "Admin",
    description: "Administrative access with limited settings",
    permissions: {
      users: { create: true, read: true, update: true, delete: false },
      projects: { create: true, read: true, update: true, delete: true },
      reports: { create: true, read: true, update: true, delete: true },
      settings: { create: false, read: true, update: true, delete: false },
    },
    userCount: 8,
    createdAt: "2023-01-01",
    updatedAt: "2024-01-10",
    isDefault: false,
  },
  {
    id: "role-3",
    name: "Manager",
    description: "Manage projects and team members",
    permissions: {
      users: { create: true, read: true, update: true, delete: false },
      projects: { create: true, read: true, update: true, delete: false },
      reports: { create: true, read: true, update: true, delete: false },
      settings: { create: false, read: true, update: false, delete: false },
    },
    userCount: 15,
    createdAt: "2023-02-15",
    updatedAt: "2024-01-05",
    isDefault: false,
  },
  {
    id: "role-4",
    name: "Editor",
    description: "Create and edit content, view reports",
    permissions: {
      users: { create: false, read: true, update: false, delete: false },
      projects: { create: true, read: true, update: true, delete: false },
      reports: { create: true, read: true, update: false, delete: false },
      settings: { create: false, read: false, update: false, delete: false },
    },
    userCount: 24,
    createdAt: "2023-02-15",
    updatedAt: "2023-12-20",
    isDefault: false,
  },
  {
    id: "role-5",
    name: "Viewer",
    description: "Read-only access to projects and reports",
    permissions: {
      users: { create: false, read: true, update: false, delete: false },
      projects: { create: false, read: true, update: false, delete: false },
      reports: { create: false, read: true, update: false, delete: false },
      settings: { create: false, read: true, update: false, delete: false },
    },
    userCount: 42,
    createdAt: "2023-02-15",
    updatedAt: "2023-11-15",
    isDefault: true,
  },
  {
    id: "role-6",
    name: "Support",
    description: "Customer support team access",
    permissions: {
      users: { create: false, read: true, update: true, delete: false },
      projects: { create: false, read: true, update: true, delete: false },
      reports: { create: true, read: true, update: false, delete: false },
      settings: { create: false, read: false, update: false, delete: false },
    },
    userCount: 12,
    createdAt: "2023-03-10",
    updatedAt: "2023-12-01",
    isDefault: false,
  },
  {
    id: "role-7",
    name: "Developer",
    description: "Development team with project access",
    permissions: {
      users: { create: false, read: true, update: false, delete: false },
      projects: { create: true, read: true, update: true, delete: false },
      reports: { create: true, read: true, update: true, delete: false },
      settings: { create: false, read: true, update: false, delete: false },
    },
    userCount: 18,
    createdAt: "2023-03-10",
    updatedAt: "2024-01-08",
    isDefault: false,
  },
  {
    id: "role-8",
    name: "Analyst",
    description: "Data analysis and reporting access",
    permissions: {
      users: { create: false, read: true, update: false, delete: false },
      projects: { create: false, read: true, update: false, delete: false },
      reports: { create: true, read: true, update: true, delete: false },
      settings: { create: false, read: true, update: false, delete: false },
    },
    userCount: 9,
    createdAt: "2023-04-20",
    updatedAt: "2023-12-15",
    isDefault: false,
  },
];

function PermissionBadge({ hasPermission }: { hasPermission: boolean }) {
  return hasPermission ? (
    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Yes</Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      No
    </Badge>
  );
}

export default function RolesPage() {
  const [roles] = useState<Role[]>(initialRoles);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  const filteredData = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch =
        role.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        role.description.toLowerCase().includes(globalFilter.toLowerCase());
      return matchesSearch;
    });
  }, [roles, globalFilter]);

  const totalRoles = filteredData.length;
  const totalUsers = filteredData.reduce((sum, role) => sum + role.userCount, 0);
  const defaultRoles = filteredData.filter((r) => r.isDefault).length;
  const customRoles = filteredData.filter((r) => !r.isDefault).length;

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => <DataGridColumnHeader title="Role" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="font-medium text-sm">{row.original.name}</span>
              <span className="line-clamp-1 text-muted-foreground text-xs">{row.original.description}</span>
            </div>
          </div>
        ),
        size: 200,
        enableSorting: true,
      },
      {
        accessorKey: "permissions.users",
        id: "userAccess",
        header: () => <span className="text-sm">Users</span>,
        cell: ({ row }) => {
          const perms = row.original.permissions.users;
          return (
            <div className="flex items-center gap-1">
              <PermissionBadge hasPermission={perms.create} />
              <PermissionBadge hasPermission={perms.read} />
              <PermissionBadge hasPermission={perms.update} />
              <PermissionBadge hasPermission={perms.delete} />
            </div>
          );
        },
        size: 180,
        enableSorting: false,
      },
      {
        accessorKey: "permissions.projects",
        id: "projectAccess",
        header: () => <span className="text-sm">Projects</span>,
        cell: ({ row }) => {
          const perms = row.original.permissions.projects;
          return (
            <div className="flex items-center gap-1">
              <PermissionBadge hasPermission={perms.create} />
              <PermissionBadge hasPermission={perms.read} />
              <PermissionBadge hasPermission={perms.update} />
              <PermissionBadge hasPermission={perms.delete} />
            </div>
          );
        },
        size: 180,
        enableSorting: false,
      },
      {
        accessorKey: "permissions.reports",
        id: "reportAccess",
        header: () => <span className="text-sm">Reports</span>,
        cell: ({ row }) => {
          const perms = row.original.permissions.reports;
          return (
            <div className="flex items-center gap-1">
              <PermissionBadge hasPermission={perms.create} />
              <PermissionBadge hasPermission={perms.read} />
              <PermissionBadge hasPermission={perms.update} />
              <PermissionBadge hasPermission={perms.delete} />
            </div>
          );
        },
        size: 180,
        enableSorting: false,
      },
      {
        accessorKey: "userCount",
        id: "userCount",
        header: ({ column }) => <DataGridColumnHeader title="Users" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-semibold">{row.original.userCount}</span>
          </div>
        ),
        size: 80,
        enableSorting: true,
        meta: {
          cellClassName: "font-semibold",
        },
      },
      {
        accessorKey: "isDefault",
        id: "isDefault",
        header: ({ column }) => <DataGridColumnHeader title="Type" column={column} />,
        cell: ({ row }) => (
          <Badge
            className={
              row.original.isDefault
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }
          >
            {row.original.isDefault ? "Default" : "Custom"}
          </Badge>
        ),
        size: 90,
        enableSorting: true,
      },
      {
        accessorKey: "updatedAt",
        id: "updatedAt",
        header: ({ column }) => <DataGridColumnHeader title="Last Updated" column={column} />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {format(new Date(row.original.updatedAt), "MMM dd, yyyy")}
          </span>
        ),
        size: 130,
        enableSorting: true,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem disabled={row.original.isDefault}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Role
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" disabled={row.original.isDefault}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Role
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
    getRowId: (row: Role) => row.id,
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Total Roles</p>
          <p className="mt-1 font-semibold text-2xl">{totalRoles}</p>
          <p className="text-muted-foreground text-xs">Defined roles</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Total Users</p>
          <p className="mt-1 font-semibold text-2xl text-blue-600">{totalUsers}</p>
          <p className="text-muted-foreground text-xs">Users across all roles</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Default Roles</p>
          <p className="mt-1 font-semibold text-2xl text-green-600">{defaultRoles}</p>
          <p className="text-muted-foreground text-xs">System default roles</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Custom Roles</p>
          <p className="mt-1 font-semibold text-2xl text-purple-600">{customRoles}</p>
          <p className="text-muted-foreground text-xs">User-created roles</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            className="pl-9"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">Permission columns: Create / Read / Update / Delete</span>
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
    </div>
  );
}
