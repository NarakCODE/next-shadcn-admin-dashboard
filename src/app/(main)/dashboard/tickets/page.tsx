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
import { Clock, Eye, MessageSquare, MoreHorizontal, Plus, Search, Trash2, UserPen } from "lucide-react";

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Ticket = {
  id: string;
  ticketId: string;
  subject: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  assigneeAvatar: string;
  customer: string;
  customerAvatar: string;
  created: string;
  lastUpdate: string;
  messages: number;
};

const initialTickets: Ticket[] = [
  {
    id: "ticket-1",
    ticketId: "TK-1001",
    subject: "Cannot login to account after password reset",
    status: "open",
    priority: "high",
    assignee: "James Johnson",
    assigneeAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    customer: "Alice Smith",
    customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
    created: "2024-02-01T10:30:00",
    lastUpdate: "2024-02-02T14:20:00",
    messages: 5,
  },
  {
    id: "ticket-2",
    ticketId: "TK-1002",
    subject: "Billing discrepancy on monthly invoice",
    status: "in-progress",
    priority: "urgent",
    assignee: "Maria Hernandez",
    assigneeAvatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    customer: "Bob Wilson",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&dpr=2&q=80",
    created: "2024-02-01T09:15:00",
    lastUpdate: "2024-02-02T16:45:00",
    messages: 12,
  },
  {
    id: "ticket-3",
    ticketId: "TK-1003",
    subject: "Feature request: Export data to CSV format",
    status: "open",
    priority: "low",
    assignee: "Clara Mason",
    assigneeAvatar: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    customer: "Carol Davis",
    customerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
    created: "2024-01-30T11:00:00",
    lastUpdate: "2024-01-31T09:30:00",
    messages: 3,
  },
  {
    id: "ticket-4",
    ticketId: "TK-1004",
    subject: "API integration failing with 500 error",
    status: "in-progress",
    priority: "urgent",
    assignee: "Derek White",
    assigneeAvatar: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    customer: "David Brown",
    customerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80",
    created: "2024-02-02T08:00:00",
    lastUpdate: "2024-02-02T17:00:00",
    messages: 8,
  },
  {
    id: "ticket-5",
    ticketId: "TK-1005",
    subject: "Mobile app crashes on iOS 17 devices",
    status: "resolved",
    priority: "high",
    assignee: "Eva Carter",
    assigneeAvatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    customer: "Emma Taylor",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80",
    created: "2024-01-28T14:30:00",
    lastUpdate: "2024-02-01T10:00:00",
    messages: 15,
  },
  {
    id: "ticket-6",
    ticketId: "TK-1006",
    subject: "Update shipping address for pending order",
    status: "closed",
    priority: "medium",
    assignee: "Frank Zhou",
    assigneeAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80",
    customer: "Frank Miller",
    customerAvatar: "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
    created: "2024-01-25T16:00:00",
    lastUpdate: "2024-01-28T12:00:00",
    messages: 4,
  },
  {
    id: "ticket-7",
    ticketId: "TK-1007",
    subject: "Dashboard loading slowly on Chrome browser",
    status: "open",
    priority: "medium",
    assignee: "Grace Lee",
    assigneeAvatar: "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
    customer: "George Harris",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80",
    created: "2024-02-02T07:45:00",
    lastUpdate: "2024-02-02T09:00:00",
    messages: 2,
  },
  {
    id: "ticket-8",
    ticketId: "TK-1008",
    subject: "Request for custom report generation",
    status: "in-progress",
    priority: "low",
    assignee: "Henry Ford",
    assigneeAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&dpr=2&q=80",
    customer: "Hannah Clark",
    customerAvatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=96&h=96&dpr=2&q=80",
    created: "2024-01-29T13:00:00",
    lastUpdate: "2024-02-01T15:30:00",
    messages: 7,
  },
];

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "in-progress": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  resolved: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  closed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const priorityColors: Record<string, string> = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export default function TicketsPage() {
  const [tickets] = useState<Ticket[]>(initialTickets);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "lastUpdate", desc: true }]);

  const filteredData = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.subject.toLowerCase().includes(globalFilter.toLowerCase()) ||
        ticket.ticketId.toLowerCase().includes(globalFilter.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(globalFilter.toLowerCase()) ||
        ticket.assignee.toLowerCase().includes(globalFilter.toLowerCase());
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tickets, globalFilter, statusFilter]);

  const columns = useMemo<ColumnDef<Ticket>[]>(
    () => [
      {
        accessorKey: "ticketId",
        id: "ticketId",
        header: ({ column }) => <DataGridColumnHeader title="ID" column={column} />,
        cell: ({ row }) => <span className="font-mono text-sm">{row.original.ticketId}</span>,
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "subject",
        id: "subject",
        header: ({ column }) => <DataGridColumnHeader title="Subject" column={column} />,
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm">{row.original.subject}</span>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={row.original.customerAvatar} alt={row.original.customer} />
                <AvatarFallback>{row.original.customer[0]}</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground text-xs">{row.original.customer}</span>
            </div>
          </div>
        ),
        size: 280,
        enableSorting: true,
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        cell: ({ row }) => (
          <Badge className={statusColors[row.original.status]}>
            {row.original.status === "in-progress" ? "In Progress" : row.original.status}
          </Badge>
        ),
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "priority",
        id: "priority",
        header: ({ column }) => <DataGridColumnHeader title="Priority" column={column} />,
        cell: ({ row }) => <Badge className={priorityColors[row.original.priority]}>{row.original.priority}</Badge>,
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "assignee",
        id: "assignee",
        header: ({ column }) => <DataGridColumnHeader title="Assignee" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={row.original.assigneeAvatar} alt={row.original.assignee} />
              <AvatarFallback>{row.original.assignee[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{row.original.assignee}</span>
          </div>
        ),
        size: 160,
        enableSorting: true,
      },
      {
        accessorKey: "messages",
        id: "messages",
        header: ({ column }) => <DataGridColumnHeader title="Messages" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{row.original.messages}</span>
          </div>
        ),
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "lastUpdate",
        id: "lastUpdate",
        header: ({ column }) => <DataGridColumnHeader title="Last Update" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">
              {format(new Date(row.original.lastUpdate), "MMM dd, HH:mm")}
            </span>
          </div>
        ),
        size: 140,
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
                View Ticket
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserPen className="mr-2 h-4 w-4" />
                Edit Ticket
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                Reply
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Clock className="mr-2 h-4 w-4" />
                Change Status
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Ticket
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
    getRowId: (row: Ticket) => row.id,
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
          <h1 className="text-3xl leading-none tracking-tight">Tickets</h1>
          <p className="text-muted-foreground text-sm">Manage support tickets and customer issues</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Ticket
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-9"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
        </Tabs>
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
