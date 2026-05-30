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
import { Mail, MoreHorizontal, Phone, Plus, Search, Shield, Trash2, UserPen } from "lucide-react";

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

type Customer = {
  id: string;
  name: string;
  role: string;
  age: number;
  phone: string;
  email: string;
  avatar: string;
};

const initialCustomers: Customer[] = [
  {
    id: "customer-1",
    name: "James Johnson",
    role: "Admin",
    age: 30,
    phone: "123-456-7890",
    email: "alice@company.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "customer-2",
    name: "Maria Hernandez",
    role: "User",
    age: 45,
    phone: "555-312-8899",
    email: "bobsmith@gmail.com",
    avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "customer-3",
    name: "Clara Mason",
    role: "Superadmin",
    age: 38,
    phone: "402-123-4567",
    email: "clara@enterprise.com",
    avatar: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "customer-4",
    name: "Derek White",
    role: "Moderator",
    age: 29,
    phone: "212-321-6789",
    email: "derek@forum.com",
    avatar: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "customer-5",
    name: "Eva Carter",
    role: "Author",
    age: 33,
    phone: "678-999-8212",
    email: "eva@blogging.com",
    avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "customer-6",
    name: "Frank Zhou",
    role: "User",
    age: 41,
    phone: "504-222-9990",
    email: "fzhou@yahoo.com",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "customer-7",
    name: "Grace Lee",
    role: "Admin",
    age: 27,
    phone: "703-301-4444",
    email: "gracelee@company.com",
    avatar: "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
  },
  {
    id: "customer-8",
    name: "Henry Ford",
    role: "Superadmin",
    age: 52,
    phone: "888-456-1234",
    email: "henry.ford@auto.com",
    avatar: "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
  },
];

const roleColors: Record<string, string> = {
  Admin: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  Superadmin: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  Moderator: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  Author: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  User: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(initialCustomers);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);

  const filteredData = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        customer.email.toLowerCase().includes(globalFilter.toLowerCase());
      const matchesRole = roleFilter === "all" || customer.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [customers, globalFilter, roleFilter]);

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => <DataGridColumnHeader title="Name" column={column} />,
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
            <span className="font-medium text-sm">{row.original.name}</span>
          </div>
        ),
        size: 200,
        enableSorting: true,
      },
      {
        accessorKey: "role",
        id: "role",
        header: ({ column }) => <DataGridColumnHeader title="Role" column={column} />,
        cell: ({ row }) => <Badge className={roleColors[row.original.role]}>{row.original.role}</Badge>,
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "age",
        id: "age",
        header: ({ column }) => <DataGridColumnHeader title="Age" column={column} />,
        cell: ({ row }) => <span>{row.original.age}</span>,
        size: 80,
        enableSorting: true,
      },
      {
        accessorKey: "phone",
        id: "phone",
        header: ({ column }) => <DataGridColumnHeader title="Phone" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{row.original.phone}</span>
          </div>
        ),
        size: 150,
        enableSorting: false,
      },
      {
        accessorKey: "email",
        id: "email",
        header: ({ column }) => <DataGridColumnHeader title="Email" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{row.original.email}</span>
          </div>
        ),
        size: 220,
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
                <UserPen className="mr-2 h-4 w-4" />
                Edit Customer
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="mr-2 h-4 w-4" />
                Call Customer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                Change Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Customer
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
    getRowId: (row: Customer) => row.id,
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
          <h1 className="text-3xl leading-none tracking-tight">Customers</h1>
          <p className="text-muted-foreground text-sm">Manage your customer accounts</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-9"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        <Tabs value={roleFilter} onValueChange={setRoleFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Superadmin">Superadmin</TabsTrigger>
            <TabsTrigger value="Admin">Admin</TabsTrigger>
            <TabsTrigger value="Moderator">Moderator</TabsTrigger>
            <TabsTrigger value="Author">Author</TabsTrigger>
            <TabsTrigger value="User">User</TabsTrigger>
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
