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
import { Download, Eye, Filter, MoreHorizontal, Pencil, Plus, Search, Send, Trash2 } from "lucide-react";

import { DataGrid, DataGridContainer, DataGridTable } from "@/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Invoice = {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAvatar?: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "draft";
  issueDate: string;
  dueDate: string;
};

const initialInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-001",
    clientName: "Acme Corp",
    clientEmail: "billing@acme.com",
    clientAvatar: "https://github.com/shadcn.png",
    amount: 2500.0,
    status: "paid",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-002",
    clientName: "TechStart Inc",
    clientEmail: "finance@techstart.io",
    clientAvatar: "https://github.com/shadcn.png",
    amount: 1800.5,
    status: "pending",
    issueDate: "2024-01-20",
    dueDate: "2024-02-20",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-003",
    clientName: "Global Media",
    clientEmail: "accounts@globalmedia.com",
    clientAvatar: "https://github.com/shadcn.png",
    amount: 4200.0,
    status: "overdue",
    issueDate: "2023-12-10",
    dueDate: "2024-01-10",
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-004",
    clientName: "Design Studio",
    clientEmail: "hello@designstudio.co",
    clientAvatar: "https://github.com/shadcn.png",
    amount: 950.0,
    status: "draft",
    issueDate: "2024-01-25",
    dueDate: "2024-02-25",
  },
  {
    id: "inv-5",
    invoiceNumber: "INV-005",
    clientName: "CloudNet Solutions",
    clientEmail: "pay@cloudnet.dev",
    clientAvatar: "https://github.com/shadcn.png",
    amount: 3150.75,
    status: "paid",
    issueDate: "2024-01-05",
    dueDate: "2024-02-05",
  },
  {
    id: "inv-6",
    invoiceNumber: "INV-006",
    clientName: "Bright Ideas Agency",
    clientEmail: "invoices@brightideas.co",
    clientAvatar: "https://github.com/shadcn.png",
    amount: 1275.0,
    status: "pending",
    issueDate: "2024-01-28",
    dueDate: "2024-02-28",
  },
  {
    id: "inv-7",
    invoiceNumber: "INV-007",
    clientName: "DataFlow Systems",
    clientEmail: "billing@dataflow.io",
    clientAvatar: "https://github.com/shadcn.png",
    amount: 5600.0,
    status: "paid",
    issueDate: "2024-01-12",
    dueDate: "2024-02-12",
  },
  {
    id: "inv-8",
    invoiceNumber: "INV-008",
    clientName: "Nexus Digital",
    clientEmail: "finance@nexus.digital",
    clientAvatar: "https://github.com/shadcn.png",
    amount: 2100.25,
    status: "overdue",
    issueDate: "2023-12-20",
    dueDate: "2024-01-20",
  },
  {
    id: "inv-9",
    invoiceNumber: "INV-009",
    clientName: "Quantum Labs",
    clientEmail: "pay@quantum.io",
    clientAvatar: "https://github.com/shadcn.png",
    amount: 7800.0,
    status: "paid",
    issueDate: "2024-01-18",
    dueDate: "2024-02-18",
  },
  {
    id: "inv-10",
    invoiceNumber: "INV-010",
    clientName: "Stellar Corp",
    clientEmail: "finance@stellar.com",
    clientAvatar: "https://github.com/shadcn.png",
    amount: 3450.5,
    status: "pending",
    issueDate: "2024-01-22",
    dueDate: "2024-02-22",
  },
  {
    id: "inv-11",
    invoiceNumber: "INV-011",
    clientName: "NovaTech",
    clientEmail: "billing@novatech.dev",
    clientAvatar: "https://github.com/shadcn.png",
    amount: 1950.0,
    status: "draft",
    issueDate: "2024-01-30",
    dueDate: "2024-03-01",
  },
  {
    id: "inv-12",
    invoiceNumber: "INV-012",
    clientName: "Fusion Dynamics",
    clientEmail: "accounts@fusion.co",
    clientAvatar: "https://github.com/shadcn.png",
    amount: 6200.0,
    status: "overdue",
    issueDate: "2023-12-15",
    dueDate: "2024-01-15",
  },
];

const statusColors = {
  paid: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  overdue: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export default function InvoicePage() {
  const [invoices] = useState<Invoice[]>(initialInvoices);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "issueDate", desc: true }]);
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  const filteredData = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(globalFilter.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(globalFilter.toLowerCase()) ||
        invoice.clientEmail.toLowerCase().includes(globalFilter.toLowerCase());
      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, globalFilter, statusFilter]);

  const totalAmount = filteredData.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = filteredData.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = filteredData
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = filteredData
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: "invoiceNumber",
        id: "invoiceNumber",
        header: ({ column }) => <DataGridColumnHeader title="Invoice" column={column} />,
        cell: ({ row }) => <span className="font-medium">{row.original.invoiceNumber}</span>,
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "clientName",
        id: "client",
        header: ({ column }) => <DataGridColumnHeader title="Client" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={row.original.clientAvatar} alt={row.original.clientName} />
              <AvatarFallback className="text-xs">
                {row.original.clientName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{row.original.clientName}</span>
              <span className="text-muted-foreground text-xs">{row.original.clientEmail}</span>
            </div>
          </div>
        ),
        size: 200,
        enableSorting: true,
      },
      {
        accessorKey: "amount",
        id: "amount",
        header: ({ column }) => <DataGridColumnHeader title="Amount" column={column} />,
        cell: ({ row }) => (
          <span className="font-semibold">
            ${row.original.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        ),
        size: 120,
        enableSorting: true,
        meta: {
          cellClassName: "font-semibold",
        },
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
        accessorKey: "issueDate",
        id: "issueDate",
        header: ({ column }) => <DataGridColumnHeader title="Issue Date" column={column} />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {format(new Date(row.original.issueDate), "MMM dd, yyyy")}
          </span>
        ),
        size: 130,
        enableSorting: true,
      },
      {
        accessorKey: "dueDate",
        id: "dueDate",
        header: ({ column }) => <DataGridColumnHeader title="Due Date" column={column} />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {format(new Date(row.original.dueDate), "MMM dd, yyyy")}
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
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="mr-2 h-4 w-4" />
                Send
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
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
    getRowId: (row: Invoice) => row.id,
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
          <h1 className="text-3xl leading-none tracking-tight">Invoices</h1>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Total Invoices</p>
          <p className="mt-1 font-semibold text-2xl">
            ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-muted-foreground text-xs">{filteredData.length} invoices</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Paid</p>
          <p className="mt-1 font-semibold text-2xl text-green-600">
            ${paidAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-muted-foreground text-xs">
            {filteredData.filter((inv) => inv.status === "paid").length} invoices
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Pending</p>
          <p className="mt-1 font-semibold text-2xl text-yellow-600">
            ${pendingAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-muted-foreground text-xs">
            {filteredData.filter((inv) => inv.status === "pending").length} invoices
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Overdue</p>
          <p className="mt-1 font-semibold text-2xl text-red-600">
            ${overdueAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-muted-foreground text-xs">
            {filteredData.filter((inv) => inv.status === "overdue").length} invoices
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            className="pl-9"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
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
    </div>
  );
}
