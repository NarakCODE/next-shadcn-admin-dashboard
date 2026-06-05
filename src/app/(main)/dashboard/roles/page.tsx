"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

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
  CheckCircle,
  Download,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Shield,
  Trash2,
  XCircle,
} from "lucide-react";

import { type BulkAction, BulkActionsBar } from "@/components/features/bulk-actions-bar";
import { SavedViewsManager } from "@/components/features/saved-views-manager";
import { DataGrid, DataGridContainer, DataGridTable } from "@/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
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

type Role = {
  id: string;
  name: string;
  key: string;
  description: string;
  usersCount: number;
  permissions: string[];
  status: "active" | "inactive";
  createdDate: string;
};

const initialRoles: Role[] = [
  {
    id: "role-1",
    name: "Admin",
    key: "admin",
    description: "Full access to all modules, settings, and business locations.",
    usersCount: 3,
    permissions: ["all permissions"],
    status: "active",
    createdDate: "2024-01-01",
  },
  {
    id: "role-2",
    name: "Cashier",
    key: "cashier",
    description: "Manage POS sells, process payments, and view cash register logs.",
    usersCount: 8,
    permissions: ["sells.create", "sells.view", "pos.access"],
    status: "active",
    createdDate: "2024-01-15",
  },
  {
    id: "role-3",
    name: "Manager",
    key: "manager",
    description: "Oversee sales, purchases, and view profit-loss reports.",
    usersCount: 2,
    permissions: ["sells.view", "purchases.view", "expenses.view", "reports.view"],
    status: "active",
    createdDate: "2024-02-01",
  },
  {
    id: "role-4",
    name: "Sales Agent",
    key: "sales_agent",
    description: "Create sales, manage customer directory, and view personal commissions.",
    usersCount: 5,
    permissions: ["sells.create", "customers.view"],
    status: "active",
    createdDate: "2024-02-10",
  },
  {
    id: "role-5",
    name: "Store Keeper",
    key: "store_keeper",
    description: "Manage stock reports, handle stock adjustments, and print labels.",
    usersCount: 4,
    permissions: ["stock.adjust", "labels.print", "products.view"],
    status: "active",
    createdDate: "2024-02-20",
  },
  {
    id: "role-6",
    name: "Billing Clerk",
    key: "billing_clerk",
    description: "Manage invoices, payment records, and tax rates configuration.",
    usersCount: 1,
    permissions: ["invoices.manage", "taxes.view"],
    status: "inactive",
    createdDate: "2024-03-01",
  },
];

const statusColors = {
  active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [globalFilter, setGlobalFilter] = useState("");
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
    isHydrated,
  } = useSavedViews({
    namespace: "roles-page",
    defaultFilters: {
      globalFilter: "",
      statusFilter: "all",
    },
  });

  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  // Load active view on initial hydration
  useEffect(() => {
    if (isHydrated && !hasLoadedInitial) {
      if (activeViewId) {
        const activeView = views.find((v) => v.id === activeViewId);
        if (activeView) {
          setGlobalFilter(activeView.filters.globalFilter ?? "");
          setStatusFilter(activeView.filters.statusFilter ?? "all");
        }
      }
      setHasLoadedInitial(true);
    }
  }, [isHydrated, activeViewId, views, hasLoadedInitial]);

  const currentFilters = useMemo(
    () => ({
      globalFilter,
      statusFilter,
    }),
    [globalFilter, statusFilter],
  );

  const filteredData = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch =
        role.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        role.key.toLowerCase().includes(globalFilter.toLowerCase()) ||
        role.description.toLowerCase().includes(globalFilter.toLowerCase());
      const matchesStatus = statusFilter === "all" || role.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [roles, globalFilter, statusFilter]);

  const columns = useMemo<ColumnDef<Role>[]>(
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
        header: ({ column }) => <DataGridColumnHeader title="Role Name" column={column} />,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-sm">{row.original.name}</span>
            <span className="line-clamp-1 text-muted-foreground text-xs">{row.original.description}</span>
          </div>
        ),
        size: 260,
        enableSorting: true,
      },
      {
        accessorKey: "key",
        id: "key",
        header: ({ column }) => <DataGridColumnHeader title="Key" column={column} />,
        cell: ({ row }) => <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{row.original.key}</code>,
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "usersCount",
        id: "usersCount",
        header: ({ column }) => <DataGridColumnHeader title="Users Assigned" column={column} />,
        cell: ({ row }) => <span className="font-semibold">{row.original.usersCount}</span>,
        size: 140,
        enableSorting: true,
        meta: {
          cellClassName: "font-semibold",
        },
      },
      {
        accessorKey: "permissions",
        id: "permissions",
        header: ({ column }) => <DataGridColumnHeader title="Permissions" column={column} />,
        cell: ({ row }) => (
          <div className="flex max-w-[280px] flex-wrap gap-1">
            {row.original.permissions.map((perm) => (
              <Badge key={perm} variant="outline" className="px-1.5 py-0 font-normal text-[10px] capitalize">
                {perm.replace(".", " ")}
              </Badge>
            ))}
          </div>
        ),
        size: 240,
        enableSorting: false,
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
        accessorKey: "createdDate",
        id: "createdDate",
        header: ({ column }) => <DataGridColumnHeader title="Created" column={column} />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {format(new Date(row.original.createdDate), "MMM dd, yyyy")}
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
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto">
              <DropdownMenuItem>
                <Pencil />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield />
                Edit Permissions
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {row.original.status === "inactive" ? (
                <DropdownMenuItem
                  onClick={() => {
                    setRoles((prev) => prev.map((r) => (r.id === row.original.id ? { ...r, status: "active" } : r)));
                  }}
                >
                  <CheckCircle />
                  Activate Role
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-red-400"
                  onClick={() => {
                    setRoles((prev) => prev.map((r) => (r.id === row.original.id ? { ...r, status: "inactive" } : r)));
                  }}
                >
                  <XCircle />
                  Deactivate Role
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-400"
                onClick={() => {
                  setRoles((prev) => prev.filter((r) => r.id !== row.original.id));
                }}
              >
                <Trash2 />
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
    setRoles((prev) => prev.filter((role) => !selectedIds.includes(role.id)));
    setRowSelection({});
  };

  const handleBulkActivate = async () => {
    const selectedIds = Object.keys(rowSelection);
    setRoles((prev) => prev.map((role) => (selectedIds.includes(role.id) ? { ...role, status: "active" } : role)));
    setRowSelection({});
  };

  const handleBulkDeactivate = async () => {
    const selectedIds = Object.keys(rowSelection);
    setRoles((prev) => prev.map((role) => (selectedIds.includes(role.id) ? { ...role, status: "inactive" } : role)));
    setRowSelection({});
  };

  const handleBulkExport = (format: "csv" | "json") => {
    const selectedIds = Object.keys(rowSelection);
    const selectedRoles = roles.filter((role) => selectedIds.includes(role.id));
    console.log(`Exporting ${selectedRoles.length} roles as ${format}`);
  };

  const bulkActions: BulkAction[] = [
    {
      id: "activate",
      label: "Activate",
      icon: <CheckCircle />,
      onClick: handleBulkActivate,
    },
    {
      id: "deactivate",
      label: "Deactivate",
      icon: <XCircle />,
      onClick: handleBulkDeactivate,
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 />,
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
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Roles</h1>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/roles/create">
              <Plus />
              Add Role
            </Link>
          </Button>
        </div>
      </div>

      {/* Toolbar / Search & Filters */}
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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

      {/* Data Grid Table */}
      <DataGrid table={table} recordCount={filteredData.length}>
        <div className="w-full space-y-2.5">
          <DataGridContainer>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </DataGridContainer>
          <DataGridPagination />
        </div>
      </DataGrid>
    </div>
  );
}
