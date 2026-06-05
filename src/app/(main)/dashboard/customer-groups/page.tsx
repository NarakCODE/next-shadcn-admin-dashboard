"use client";

import { useEffect, useMemo, useState } from "react";

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
import { Download, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { type BulkAction, BulkActionsBar } from "@/components/features/bulk-actions-bar";
import { SavedViewsManager } from "@/components/features/saved-views-manager";
import { DataGrid, DataGridContainer } from "@/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTable } from "@/components/reui/data-grid/data-grid-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSavedViews } from "@/hooks/use-saved-views";
import { cn } from "@/lib/utils";

type CustomerGroup = {
  id: string;
  name: string;
  percentage: number;
  priceGroup: string;
};

const initialGroups: CustomerGroup[] = [
  {
    id: "cg-1",
    name: "Retail Customers",
    percentage: 0.0,
    priceGroup: "Default Selling Price",
  },
  {
    id: "cg-2",
    name: "Wholesale Customers",
    percentage: -10.0,
    priceGroup: "Minimum Selling Price",
  },
  {
    id: "cg-3",
    name: "VIP Members",
    percentage: -15.0,
    priceGroup: "Special Price Group",
  },
  {
    id: "cg-4",
    name: "Staff Rate",
    percentage: -20.0,
    priceGroup: "Staff Price Group",
  },
];

export default function CustomerGroupsPage() {
  const [groups, setGroups] = useState<CustomerGroup[]>(initialGroups);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const _formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  // Add Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    percentage: "",
    priceGroup: "Default Selling Price",
  });

  // Set Page Title
  useEffect(() => {
    document.title = "Customer Groups - ACLEDA BANK";
  }, []);

  // Saved Views hook
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
    namespace: "customer-groups-page",
    defaultFilters: {
      globalFilter: "",
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
        }
      }
      setHasLoadedInitial(true);
    }
  }, [isHydrated, activeViewId, views, hasLoadedInitial]);

  const currentFilters = useMemo(
    () => ({
      globalFilter,
    }),
    [globalFilter],
  );

  const filteredData = useMemo(() => {
    return groups.filter((group) => {
      const query = globalFilter.toLowerCase();
      return (
        group.name.toLowerCase().includes(query) ||
        group.priceGroup.toLowerCase().includes(query) ||
        group.percentage.toString().includes(query)
      );
    });
  }, [groups, globalFilter]);

  const columns = useMemo<ColumnDef<CustomerGroup>[]>(
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
        header: ({ column }) => <DataGridColumnHeader title="Customer Group Name" column={column} />,
        cell: ({ row }) => <span className="font-medium text-sm">{row.original.name}</span>,
        size: 250,
        enableSorting: true,
      },
      {
        accessorKey: "percentage",
        id: "percentage",
        header: ({ column }) => <DataGridColumnHeader title="Calculation Percentage (%)" column={column} />,
        cell: ({ row }) => {
          const val = row.original.percentage;
          const isNegative = val < 0;
          return (
            <span className={cn("font-semibold text-sm", isNegative ? "text-red-500" : "text-green-500")}>
              {val > 0 ? `+${val}` : val}%
            </span>
          );
        },
        size: 200,
        enableSorting: true,
      },
      {
        accessorKey: "priceGroup",
        id: "priceGroup",
        header: ({ column }) => <DataGridColumnHeader title="Selling Price Group" column={column} />,
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.priceGroup}</span>,
        size: 200,
        enableSorting: true,
      },
      {
        id: "action",
        header: () => <span className="sr-only">Action</span>,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto">
              <DropdownMenuItem>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setGroups((prev) => prev.filter((g) => g.id !== row.original.id))}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
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
    getRowId: (row: CustomerGroup) => row.id,
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
    setGroups((prev) => prev.filter((group) => !selectedIds.includes(group.id)));
    setRowSelection({});
  };

  const handleBulkExport = (format: "csv" | "json") => {
    const selectedIds = Object.keys(rowSelection);
    const selectedGroups = groups.filter((group) => selectedIds.includes(group.id));
    console.log(`Exporting ${selectedGroups.length} customer groups as ${format}`);
  };

  const bulkActions: BulkAction[] = [
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
    setGlobalFilter(filters.globalFilter ?? "");
  };

  const handleRenameView = (id: string, name: string) => {
    updateView(id, { name });
  };

  const handleClearActiveView = () => {
    setActiveView(null);
  };

  // Add Group Handler
  const handleSaveGroup = () => {
    if (!formData.name.trim()) {
      alert("Customer group name is required.");
      return;
    }

    const newGroup: CustomerGroup = {
      id: `cg-${Date.now()}`,
      name: formData.name.trim(),
      percentage: Number(formData.percentage) || 0.0,
      priceGroup: formData.priceGroup,
    };

    setGroups((prev) => [newGroup, ...prev]);
    setIsDialogOpen(false);

    // Reset Form
    setFormData({
      name: "",
      percentage: "",
      priceGroup: "Default Selling Price",
    });
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Customer Groups</h1>
          <p className="text-muted-foreground text-sm">Manage your Customer Groups</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => console.log("Export CSV")}>Export CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Export Excel")}>Export Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Export PDF")}>Export PDF</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.print()}>Print</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus />
            Add
          </Button>
        </div>
      </div>

      {/* Toolbar / Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ..."
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
      <div className="w-full min-w-0 overflow-hidden">
        <DataGrid table={table} recordCount={filteredData.length} emptyMessage="No data available in table">
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

      {/* Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add a new contact</DialogTitle>
            <DialogDescription>Create a new customer group.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cg-name" className="font-medium text-sm">
                Customer Group Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cg-name"
                placeholder="e.g. Retail Customers, VIP Members"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cg-pct" className="font-medium text-sm">
                Calculation Percentage (%)
              </Label>
              <Input
                id="cg-pct"
                type="number"
                placeholder="e.g. -10, 5"
                value={formData.percentage}
                onChange={(e) => setFormData((prev) => ({ ...prev, percentage: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cg-price-group" className="font-medium text-sm">
                Selling Price Group
              </Label>
              <Select
                value={formData.priceGroup}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, priceGroup: val }))}
              >
                <SelectTrigger id="cg-price-group">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default Selling Price">Default Selling Price</SelectItem>
                  <SelectItem value="Minimum Selling Price">Minimum Selling Price</SelectItem>
                  <SelectItem value="Special Price Group">Special Price Group</SelectItem>
                  <SelectItem value="Staff Price Group">Staff Price Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
            <Button onClick={handleSaveGroup} variant="default">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
