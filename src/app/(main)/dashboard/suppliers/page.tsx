"use client";

import { useEffect, useMemo, useState } from "react";

import {
  type Column,
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";

import { type BulkAction, BulkActionsBar } from "@/components/features/bulk-actions-bar";
import { SavedViewsManager } from "@/components/features/saved-views-manager";
import { PageHeader } from "@/components/page-header";
import { DataGrid, DataGridContainer } from "@/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTable } from "@/components/reui/data-grid/data-grid-table";
import { Badge } from "@/components/ui/badge";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useSavedViews } from "@/hooks/use-saved-views";

type Supplier = {
  id: string;
  contactId: string;
  businessName: string;
  name: string;
  email: string;
  taxNumber: string;
  payTerm: string;
  openingBalance: number;
  advanceBalance: number;
  addedOn: string;
  address: string;
  mobile: string;
  totalPurchaseDue: number;
  totalPurchaseReturnDue: number;
  customFields: string[];
};

const mockSuppliers: Supplier[] = [
  {
    id: "sup-1",
    contactId: "SUP-001",
    businessName: "ACLEDA Bank PLC",
    name: "Sokha Meas",
    email: "sokha@acleda.com.kh",
    taxNumber: "TAX-001-2024",
    payTerm: "Net 30",
    openingBalance: 5000.0,
    advanceBalance: 1200.0,
    addedOn: "2024-01-15",
    address: "#45, Street 240, Phnom Penh",
    mobile: "+855 12 345 678",
    totalPurchaseDue: 3500.0,
    totalPurchaseReturnDue: 200.0,
    customFields: ["Electronics", "Phnom Penh", "Gold", "Yes", "A+", "Active", "VIP", "Monthly", "USD", "Local"],
  },
  {
    id: "sup-2",
    contactId: "SUP-002",
    businessName: "Royal Distribution Co.",
    name: "Dara Chan",
    email: "dara@royal-dist.com",
    taxNumber: "TAX-002-2024",
    payTerm: "Net 15",
    openingBalance: 2500.0,
    advanceBalance: 0.0,
    addedOn: "2024-02-20",
    address: "#12, Russian Blvd, Siem Reap",
    mobile: "+855 97 654 321",
    totalPurchaseDue: 1800.0,
    totalPurchaseReturnDue: 0.0,
    customFields: ["Beverages", "Siem Reap", "Silver", "No", "B+", "Active", "", "Weekly", "KHR", "Import"],
  },
  {
    id: "sup-3",
    contactId: "SUP-003",
    businessName: "Mekong Foods Ltd.",
    name: "Bopha Kem",
    email: "bopha@mekong-foods.com",
    taxNumber: "TAX-003-2024",
    payTerm: "COD",
    openingBalance: 0.0,
    advanceBalance: 500.0,
    addedOn: "2024-03-10",
    address: "#78, Monivong Blvd, Battambang",
    mobile: "+855 77 888 999",
    totalPurchaseDue: 0.0,
    totalPurchaseReturnDue: 150.0,
    customFields: ["Food", "Battambang", "Bronze", "Yes", "O", "Inactive", "", "Bi-weekly", "USD", "Local"],
  },
  {
    id: "sup-4",
    contactId: "SUP-004",
    businessName: "Angkor Textile Supply",
    name: "Vicheka Nop",
    email: "vicheka@angkor-textile.com",
    taxNumber: "TAX-004-2024",
    payTerm: "Net 45",
    openingBalance: 8000.0,
    advanceBalance: 2000.0,
    addedOn: "2024-01-05",
    address: "#23, Street 63, Phnom Penh",
    mobile: "+855 88 111 222",
    totalPurchaseDue: 6200.0,
    totalPurchaseReturnDue: 500.0,
    customFields: ["Textile", "Phnom Penh", "Gold", "Yes", "AB+", "Active", "VIP", "Monthly", "USD", "Export"],
  },
  {
    id: "sup-5",
    contactId: "SUP-005",
    businessName: "Khmer Hardware Co.",
    name: "Ratanak Seng",
    email: "ratanak@khmer-hardware.com",
    taxNumber: "TAX-005-2024",
    payTerm: "Net 30",
    openingBalance: 3200.0,
    advanceBalance: 800.0,
    addedOn: "2024-04-12",
    address: "#56, National Road 4, Kampong Speu",
    mobile: "+855 10 555 444",
    totalPurchaseDue: 2400.0,
    totalPurchaseReturnDue: 300.0,
    customFields: ["Hardware", "Kampong Speu", "Silver", "No", "B-", "Active", "", "Monthly", "KHR", "Local"],
  },
  {
    id: "sup-6",
    contactId: "SUP-006",
    businessName: "Golden Rice Trading",
    name: "Channary Ly",
    email: "channary@golden-rice.com",
    taxNumber: "TAX-006-2024",
    payTerm: "Net 60",
    openingBalance: 12000.0,
    advanceBalance: 3000.0,
    addedOn: "2023-11-20",
    address: "#89, Street 371, Phnom Penh",
    mobile: "+855 96 333 777",
    totalPurchaseDue: 9500.0,
    totalPurchaseReturnDue: 1200.0,
    customFields: ["Agriculture", "Phnom Penh", "Platinum", "Yes", "A+", "Active", "VIP", "Quarterly", "USD", "Export"],
  },
  {
    id: "sup-7",
    contactId: "SUP-007",
    businessName: "Siem Reap Crafts",
    name: "Pisey Hun",
    email: "pisey@sr-crafts.com",
    taxNumber: "TAX-007-2024",
    payTerm: "Net 15",
    openingBalance: 1500.0,
    advanceBalance: 0.0,
    addedOn: "2024-05-08",
    address: "#34, Sivatha Blvd, Siem Reap",
    mobile: "+855 68 222 111",
    totalPurchaseDue: 800.0,
    totalPurchaseReturnDue: 0.0,
    customFields: ["Handicrafts", "Siem Reap", "Bronze", "No", "O+", "Active", "", "Weekly", "USD", "Local"],
  },
  {
    id: "sup-8",
    contactId: "SUP-008",
    businessName: "Phnom Penh Electronics",
    name: "Kunthea Touch",
    email: "kunthea@pp-electronics.com",
    taxNumber: "TAX-008-2024",
    payTerm: "COD",
    openingBalance: 4500.0,
    advanceBalance: 1000.0,
    addedOn: "2024-02-28",
    address: "#101, Street 271, Phnom Penh",
    mobile: "+855 76 999 888",
    totalPurchaseDue: 3200.0,
    totalPurchaseReturnDue: 450.0,
    customFields: ["Electronics", "Phnom Penh", "Gold", "Yes", "A", "Active", "VIP", "Monthly", "USD", "Import"],
  },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "businessName", desc: false }]);
  const [purchaseDue, setPurchaseDue] = useState(false);
  const [purchaseReturn, setPurchaseReturn] = useState(false);
  const [advanceBalance, setAdvanceBalance] = useState(false);
  const [openingBalance, setOpeningBalance] = useState(false);
  const [assignedTo, setAssignedTo] = useState("None");
  const [status, setStatus] = useState("None");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [formData, setFormData] = useState({
    contactType: "Suppliers",
    classification: "Individual",
    prefix: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    alternateMobile: "",
    landline: "",
    email: "",
    contactId: "",
    shippingAddress: "",
    dob: "",
    assignedTo: "Mr Narak",
  });

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
    namespace: "suppliers-page",
    defaultFilters: {
      globalFilter: "",
      purchaseDue: false,
      purchaseReturn: false,
      advanceBalance: false,
      openingBalance: false,
      assignedTo: "None",
      status: "None",
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
          setPurchaseDue(activeView.filters.purchaseDue ?? false);
          setPurchaseReturn(activeView.filters.purchaseReturn ?? false);
          setAdvanceBalance(activeView.filters.advanceBalance ?? false);
          setOpeningBalance(activeView.filters.openingBalance ?? false);
          setAssignedTo(activeView.filters.assignedTo ?? "None");
          setStatus(activeView.filters.status ?? "None");
        }
      }
      setHasLoadedInitial(true);
    }
  }, [isHydrated, activeViewId, views, hasLoadedInitial]);

  const currentFilters = useMemo(
    () => ({
      globalFilter,
      purchaseDue,
      purchaseReturn,
      advanceBalance,
      openingBalance,
      assignedTo,
      status,
    }),
    [globalFilter, purchaseDue, purchaseReturn, advanceBalance, openingBalance, assignedTo, status],
  );

  const filteredData = useMemo(() => {
    return suppliers.filter((supplier) => {
      const query = globalFilter.toLowerCase();
      const matchesSearch =
        supplier.businessName.toLowerCase().includes(query) ||
        supplier.name.toLowerCase().includes(query) ||
        supplier.email.toLowerCase().includes(query) ||
        supplier.contactId.toLowerCase().includes(query) ||
        supplier.mobile.toLowerCase().includes(query);

      const matchesPurchaseDue = !purchaseDue || supplier.totalPurchaseDue > 0;
      const matchesPurchaseReturn = !purchaseReturn || supplier.totalPurchaseReturnDue > 0;
      const matchesAdvanceBalance = !advanceBalance || supplier.advanceBalance > 0;
      const matchesOpeningBalance = !openingBalance || supplier.openingBalance > 0;

      return (
        matchesSearch && matchesPurchaseDue && matchesPurchaseReturn && matchesAdvanceBalance && matchesOpeningBalance
      );
    });
  }, [suppliers, globalFilter, purchaseDue, purchaseReturn, advanceBalance, openingBalance]);

  const totalOpeningBalance = filteredData.reduce((sum, s) => sum + s.openingBalance, 0);
  const totalAdvanceBalance = filteredData.reduce((sum, s) => sum + s.advanceBalance, 0);

  const columns = useMemo<ColumnDef<Supplier>[]>(
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
        accessorKey: "contactId",
        id: "contactId",
        header: ({ column }) => <DataGridColumnHeader title="Contact ID" column={column} />,
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.contactId}</span>,
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "businessName",
        id: "businessName",
        header: ({ column }) => <DataGridColumnHeader title="Business Name" column={column} />,
        cell: ({ row }) => <span className="font-medium text-sm">{row.original.businessName}</span>,
        size: 180,
        enableSorting: true,
      },
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => <DataGridColumnHeader title="Name" column={column} />,
        cell: ({ row }) => <span className="text-sm">{row.original.name}</span>,
        size: 130,
        enableSorting: true,
      },
      {
        accessorKey: "email",
        id: "email",
        header: ({ column }) => <DataGridColumnHeader title="Email" column={column} />,
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.email}</span>,
        size: 200,
        enableSorting: true,
      },
      {
        accessorKey: "taxNumber",
        id: "taxNumber",
        header: ({ column }) => <DataGridColumnHeader title="Tax Number" column={column} />,
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.taxNumber}</span>,
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "payTerm",
        id: "payTerm",
        header: ({ column }) => <DataGridColumnHeader title="Pay Term" column={column} />,
        cell: ({ row }) => <span className="text-sm">{row.original.payTerm}</span>,
        size: 90,
        enableSorting: true,
      },
      {
        accessorKey: "openingBalance",
        id: "openingBalance",
        header: ({ column }) => <DataGridColumnHeader title="Opening Balance" column={column} />,
        cell: ({ row }) => <span className="font-medium text-sm">${row.original.openingBalance.toFixed(2)}</span>,
        size: 130,
        enableSorting: true,
      },
      {
        accessorKey: "advanceBalance",
        id: "advanceBalance",
        header: ({ column }) => <DataGridColumnHeader title="Advance Balance" column={column} />,
        cell: ({ row }) => <span className="font-medium text-sm">${row.original.advanceBalance.toFixed(2)}</span>,
        size: 130,
        enableSorting: true,
      },
      {
        accessorKey: "addedOn",
        id: "addedOn",
        header: ({ column }) => <DataGridColumnHeader title="Added On" column={column} />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {format(new Date(row.original.addedOn), "MMM dd, yyyy")}
          </span>
        ),
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "address",
        id: "address",
        header: ({ column }) => <DataGridColumnHeader title="Address" column={column} />,
        cell: ({ row }) => (
          <span className="max-w-[200px] truncate text-muted-foreground text-sm">{row.original.address}</span>
        ),
        size: 200,
        enableSorting: true,
      },
      {
        accessorKey: "mobile",
        id: "mobile",
        header: ({ column }) => <DataGridColumnHeader title="Mobile" column={column} />,
        cell: ({ row }) => <span className="text-sm">{row.original.mobile}</span>,
        size: 140,
        enableSorting: true,
      },
      {
        accessorKey: "totalPurchaseDue",
        id: "totalPurchaseDue",
        header: ({ column }) => <DataGridColumnHeader title="Total Purchase Due" column={column} />,
        cell: ({ row }) => <span className="font-medium text-sm">${row.original.totalPurchaseDue.toFixed(2)}</span>,
        size: 150,
        enableSorting: true,
      },
      {
        accessorKey: "totalPurchaseReturnDue",
        id: "totalPurchaseReturnDue",
        header: ({ column }) => <DataGridColumnHeader title="Total Purchase Return Due" column={column} />,
        cell: ({ row }) => (
          <span className="font-medium text-sm">${row.original.totalPurchaseReturnDue.toFixed(2)}</span>
        ),
        size: 180,
        enableSorting: true,
      },
      ...Array.from({ length: 10 }, (_, i) => ({
        accessorKey: `customFields.${i}`,
        id: `customField${i + 1}`,
        header: ({ column }: { column: Column<Supplier, unknown> }) => (
          <DataGridColumnHeader title={`Custom Field ${i + 1}`} column={column} />
        ),
        cell: ({ row }: { row: Row<Supplier> }) => (
          <span className="text-muted-foreground text-sm">{row.original.customFields[i] ?? "-"}</span>
        ),
        size: 120,
        enableSorting: false,
      })),
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
                <Eye className="mr-2 size-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setSuppliers((prev) => prev.filter((s) => s.id !== row.original.id))}
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
    getRowId: (row: Supplier) => row.id,
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
    setSuppliers((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
    setRowSelection({});
  };

  const handleBulkExport = (format: "csv" | "json") => {
    const selectedIds = Object.keys(rowSelection);
    const selectedSuppliers = suppliers.filter((s) => selectedIds.includes(s.id));
    console.log(`Exporting ${selectedSuppliers.length} suppliers as ${format}`);
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
    setPurchaseDue(filters.purchaseDue ?? false);
    setPurchaseReturn(filters.purchaseReturn ?? false);
    setAdvanceBalance(filters.advanceBalance ?? false);
    setOpeningBalance(filters.openingBalance ?? false);
    setAssignedTo(filters.assignedTo ?? "None");
    setStatus(filters.status ?? "None");
  };

  const handleRenameView = (id: string, name: string) => {
    updateView(id, { name });
  };

  const handleClearActiveView = () => {
    setActiveView(null);
  };

  const handleSaveContact = () => {
    if (!formData.firstName.trim()) {
      alert("First name is required.");
      return;
    }
    if (!formData.mobile.trim()) {
      alert("Mobile number is required.");
      return;
    }
    if (formData.contactType === "Please Select") {
      alert("Please select a contact type.");
      return;
    }

    const newId = `sup-${Date.now()}`;
    const newSupplier: Supplier = {
      id: newId,
      contactId: formData.contactId.trim() || `SUP-${Math.floor(100 + Math.random() * 900)}`,
      businessName:
        formData.classification === "Business"
          ? formData.firstName + (formData.lastName ? ` ${formData.lastName}` : "")
          : "N/A",
      name: `${formData.prefix} ${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email.trim() || "N/A",
      taxNumber: "TAX-NEW",
      payTerm: "Net 30",
      openingBalance: 0.0,
      advanceBalance: 0.0,
      addedOn: new Date().toISOString().split("T")[0],
      address: formData.shippingAddress.trim() || "N/A",
      mobile: formData.mobile.trim(),
      totalPurchaseDue: 0.0,
      totalPurchaseReturnDue: 0.0,
      customFields: [],
    };

    setSuppliers((prev) => [newSupplier, ...prev]);
    setIsDialogOpen(false);

    setFormData({
      contactType: "Suppliers",
      classification: "Individual",
      prefix: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobile: "",
      alternateMobile: "",
      landline: "",
      email: "",
      contactId: "",
      shippingAddress: "",
      dob: "",
      assignedTo: "Mr Narak",
    });
    setShowMoreInfo(false);
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader title="Suppliers" subtitle={formattedDate} />

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download />
            Export
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Toolbar / Search & Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers..."
              className="pl-9"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 space-y-4 p-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Filter Options</h4>
                  <p className="text-muted-foreground text-xs">Select criteria to filter suppliers.</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="purchase-due"
                      checked={purchaseDue}
                      onCheckedChange={(v) => setPurchaseDue(v as boolean)}
                    />
                    <label htmlFor="purchase-due" className="cursor-pointer font-normal text-sm">
                      Purchase Due
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="purchase-return"
                      checked={purchaseReturn}
                      onCheckedChange={(v) => setPurchaseReturn(v as boolean)}
                    />
                    <label htmlFor="purchase-return" className="cursor-pointer font-normal text-sm">
                      Purchase Return
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="advance-balance"
                      checked={advanceBalance}
                      onCheckedChange={(v) => setAdvanceBalance(v as boolean)}
                    />
                    <label htmlFor="advance-balance" className="cursor-pointer font-normal text-sm">
                      Advance Balance
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="opening-balance"
                      checked={openingBalance}
                      onCheckedChange={(v) => setOpeningBalance(v as boolean)}
                    />
                    <label htmlFor="opening-balance" className="cursor-pointer font-normal text-sm">
                      Opening Balance
                    </label>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="assigned-to" className="font-medium text-muted-foreground text-xs">
                      Assigned to
                    </label>
                    <Select value={assignedTo} onValueChange={setAssignedTo}>
                      <SelectTrigger id="assigned-to">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Mr Narak">Mr Narak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="status-filter" className="font-medium text-muted-foreground text-xs">
                      Status
                    </label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setPurchaseDue(false);
                      setPurchaseReturn(false);
                      setAdvanceBalance(false);
                      setOpeningBalance(false);
                      setAssignedTo("None");
                      setStatus("None");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active Filters Display */}
        {(purchaseDue ||
          purchaseReturn ||
          advanceBalance ||
          openingBalance ||
          assignedTo !== "None" ||
          status !== "None") && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-muted-foreground text-xs">Active filters:</span>
            {purchaseDue && (
              <Badge variant="secondary" className="gap-1 pr-1.5 font-normal text-xs">
                Purchase Due
                <button
                  type="button"
                  onClick={() => setPurchaseDue(false)}
                  className="rounded-full p-0.5 hover:bg-muted"
                >
                  <XCircle className="size-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )}
            {purchaseReturn && (
              <Badge variant="secondary" className="gap-1 pr-1.5 font-normal text-xs">
                Purchase Return
                <button
                  type="button"
                  onClick={() => setPurchaseReturn(false)}
                  className="rounded-full p-0.5 hover:bg-muted"
                >
                  <XCircle className="size-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )}
            {advanceBalance && (
              <Badge variant="secondary" className="gap-1 pr-1.5 font-normal text-xs">
                Advance Balance
                <button
                  type="button"
                  onClick={() => setAdvanceBalance(false)}
                  className="rounded-full p-0.5 hover:bg-muted"
                >
                  <XCircle className="size-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )}
            {openingBalance && (
              <Badge variant="secondary" className="gap-1 pr-1.5 font-normal text-xs">
                Opening Balance
                <button
                  type="button"
                  onClick={() => setOpeningBalance(false)}
                  className="rounded-full p-0.5 hover:bg-muted"
                >
                  <XCircle className="size-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )}
            {assignedTo !== "None" && (
              <Badge variant="secondary" className="gap-1 pr-1.5 font-normal text-xs">
                Assigned: {assignedTo}
                <button
                  type="button"
                  onClick={() => setAssignedTo("None")}
                  className="rounded-full p-0.5 hover:bg-muted"
                >
                  <XCircle className="size-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )}
            {status !== "None" && (
              <Badge variant="secondary" className="gap-1 pr-1.5 font-normal text-xs">
                Status: {status}
                <button type="button" onClick={() => setStatus("None")} className="rounded-full p-0.5 hover:bg-muted">
                  <XCircle className="size-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPurchaseDue(false);
                setPurchaseReturn(false);
                setAdvanceBalance(false);
                setOpeningBalance(false);
                setAssignedTo("None");
                setStatus("None");
              }}
              className="h-7 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
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

      {/* Summary Footer */}
      <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Total Opening Balance:</span>
            <span className="font-semibold text-foreground text-sm">${totalOpeningBalance.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Total Advance Balance:</span>
            <span className="font-semibold text-foreground text-sm">${totalAdvanceBalance.toFixed(2)}</span>
          </div>
        </div>
        <span className="text-muted-foreground text-xs">
          Showing {filteredData.length} of {suppliers.length} entries
        </span>
      </div>

      {/* Add Supplier Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add a new contact</DialogTitle>
            <DialogDescription>Create a new contact record. Fill in the required fields to save.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Contact Type */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contact-type" className="font-medium text-sm">
                  Contact type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.contactType}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, contactType: val }))}
                >
                  <SelectTrigger id="contact-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Please Select">Please Select</SelectItem>
                    <SelectItem value="Suppliers">Suppliers</SelectItem>
                    <SelectItem value="Customers">Customers</SelectItem>
                    <SelectItem value="Both (Supplier & Customer)">Both (Supplier & Customer)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Classification */}
              <div className="flex flex-col gap-1.5">
                <Label className="font-medium text-sm">Contact Classification</Label>
                <RadioGroup
                  value={formData.classification}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, classification: val }))}
                  className="flex h-10 items-center gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="Individual" id="class-individual" />
                    <Label htmlFor="class-individual" className="cursor-pointer font-normal">
                      Individual
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="Business" id="class-business" />
                    <Label htmlFor="class-business" className="cursor-pointer font-normal">
                      Business
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Separator />

            {/* Name Details */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="form-prefix" className="text-xs">
                  Prefix
                </Label>
                <Input
                  id="form-prefix"
                  placeholder="Mr / Mrs / Miss"
                  value={formData.prefix}
                  onChange={(e) => setFormData((prev) => ({ ...prev, prefix: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-3">
                <Label htmlFor="form-first-name" className="text-xs">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="form-first-name"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="form-middle-name" className="text-xs">
                  Middle Name
                </Label>
                <Input
                  id="form-middle-name"
                  placeholder="Middle name"
                  value={formData.middleName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      middleName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="form-last-name" className="text-xs">
                  Last Name
                </Label>
                <Input
                  id="form-last-name"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="form-mobile" className="text-xs">
                  Mobile <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="form-mobile"
                  placeholder="Mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="form-email" className="text-xs">
                  Email
                </Label>
                <Input
                  id="form-email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="form-contact-id" className="text-xs">
                Contact ID
              </Label>
              <Input
                id="form-contact-id"
                placeholder="Contact ID"
                value={formData.contactId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactId: e.target.value,
                  }))
                }
              />
              <span className="text-[10px] text-muted-foreground">Leave empty to autogenerate</span>
            </div>

            {/* Expandable Section */}
            <div className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                className="flex items-center gap-1.5 text-primary text-xs"
              >
                {showMoreInfo ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                More Informations
              </Button>
            </div>

            {showMoreInfo && (
              <div className="mt-2 space-y-4 border-t pt-2">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="form-alt-contact" className="text-xs">
                      Alternate contact number
                    </Label>
                    <Input
                      id="form-alt-contact"
                      placeholder="Alternate contact number"
                      value={formData.alternateMobile}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          alternateMobile: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="form-landline" className="text-xs">
                      Landline
                    </Label>
                    <Input
                      id="form-landline"
                      placeholder="Landline"
                      value={formData.landline}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          landline: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="form-address" className="text-xs">
                    Shipping Address
                  </Label>
                  <Input
                    id="form-address"
                    placeholder="Search address"
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        shippingAddress: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="form-dob" className="text-xs">
                      Date of birth
                    </Label>
                    <Input
                      id="form-dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dob: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="form-assigned" className="text-xs">
                      Assigned to
                    </Label>
                    <Select
                      value={formData.assignedTo}
                      onValueChange={(val) => setFormData((prev) => ({ ...prev, assignedTo: val }))}
                    >
                      <SelectTrigger id="form-assigned">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr Narak">Mr Narak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
            <Button onClick={handleSaveContact} variant="default">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
