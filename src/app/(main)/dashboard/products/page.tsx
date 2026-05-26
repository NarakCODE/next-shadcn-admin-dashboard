"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

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
import { Download, Eye, Filter, MoreHorizontal, Package, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";

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

type Product = {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  stock: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  rating: number;
  sku: string;
  createdAt: string;
};

const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: 'MacBook Pro 16"',
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=96&h=96&dpr=2&q=80",
    category: "Electronics",
    price: 2499.0,
    stock: 45,
    status: "in-stock",
    rating: 4.8,
    sku: "MBP-16-2024",
    createdAt: "2024-01-15",
  },
  {
    id: "prod-2",
    name: "iPhone 15 Pro Max",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=96&h=96&dpr=2&q=80",
    category: "Electronics",
    price: 1199.0,
    stock: 120,
    status: "in-stock",
    rating: 4.9,
    sku: "IP15-PM-256",
    createdAt: "2024-01-20",
  },
  {
    id: "prod-3",
    name: "Ergonomic Office Chair",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=96&h=96&dpr=2&q=80",
    category: "Furniture",
    price: 599.0,
    stock: 8,
    status: "low-stock",
    rating: 4.5,
    sku: "EOC-BLK-001",
    createdAt: "2024-02-01",
  },
  {
    id: "prod-4",
    name: "Sony WH-1000XM5",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=96&h=96&dpr=2&q=80",
    category: "Electronics",
    price: 349.0,
    stock: 0,
    status: "out-of-stock",
    rating: 4.7,
    sku: "SNY-WH5-BLK",
    createdAt: "2024-02-05",
  },
  {
    id: "prod-5",
    name: "Standing Desk Pro",
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=96&h=96&dpr=2&q=80",
    category: "Furniture",
    price: 899.0,
    stock: 32,
    status: "in-stock",
    rating: 4.6,
    sku: "SDP-WHT-60",
    createdAt: "2024-02-10",
  },
  {
    id: "prod-6",
    name: "Nike Air Max 270",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=96&h=96&dpr=2&q=80",
    category: "Footwear",
    price: 150.0,
    stock: 200,
    status: "in-stock",
    rating: 4.4,
    sku: "NKE-AM270-10",
    createdAt: "2024-02-15",
  },
  {
    id: "prod-7",
    name: "Mechanical Keyboard RGB",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=96&h=96&dpr=2&q=80",
    category: "Electronics",
    price: 179.0,
    stock: 5,
    status: "low-stock",
    rating: 4.6,
    sku: "MKB-RGB-CHX",
    createdAt: "2024-02-20",
  },
  {
    id: "prod-8",
    name: "Leather Messenger Bag",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=96&h=96&dpr=2&q=80",
    category: "Accessories",
    price: 249.0,
    stock: 0,
    status: "out-of-stock",
    rating: 4.3,
    sku: "LMB-BRN-001",
    createdAt: "2024-02-25",
  },
  {
    id: "prod-9",
    name: '4K Monitor 32"',
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=96&h=96&dpr=2&q=80",
    category: "Electronics",
    price: 699.0,
    stock: 28,
    status: "in-stock",
    rating: 4.7,
    sku: "4KM-32-USB",
    createdAt: "2024-03-01",
  },
  {
    id: "prod-10",
    name: "Wireless Mouse Pro",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=96&h=96&dpr=2&q=80",
    category: "Electronics",
    price: 79.0,
    stock: 150,
    status: "in-stock",
    rating: 4.5,
    sku: "WMP-BLK-001",
    createdAt: "2024-03-05",
  },
  {
    id: "prod-11",
    name: "Yoga Mat Premium",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=96&h=96&dpr=2&q=80",
    category: "Fitness",
    price: 49.0,
    stock: 75,
    status: "in-stock",
    rating: 4.2,
    sku: "YMP-PRP-6MM",
    createdAt: "2024-03-10",
  },
  {
    id: "prod-12",
    name: "Smart Watch Ultra",
    image: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=96&h=96&dpr=2&q=80",
    category: "Electronics",
    price: 799.0,
    stock: 3,
    status: "low-stock",
    rating: 4.8,
    sku: "SWU-TIT-49",
    createdAt: "2024-03-15",
  },
  {
    id: "prod-13",
    name: "Desk Lamp LED",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=96&h=96&dpr=2&q=80",
    category: "Furniture",
    price: 89.0,
    stock: 60,
    status: "in-stock",
    rating: 4.4,
    sku: "DLL-WHT-001",
    createdAt: "2024-03-20",
  },
  {
    id: "prod-14",
    name: "Backpack Travel Pro",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=96&h=96&dpr=2&q=80",
    category: "Accessories",
    price: 129.0,
    stock: 0,
    status: "out-of-stock",
    rating: 4.6,
    sku: "BTP-GRY-30L",
    createdAt: "2024-03-25",
  },
  {
    id: "prod-15",
    name: "Bluetooth Speaker",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=96&h=96&dpr=2&q=80",
    category: "Electronics",
    price: 199.0,
    stock: 42,
    status: "in-stock",
    rating: 4.5,
    sku: "BTS-BLK-001",
    createdAt: "2024-03-30",
  },
];

const statusColors = {
  "in-stock": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "low-stock": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  "out-of-stock": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export default function ProductsPage() {
  const [products] = useState<Product[]>(initialProducts);
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const formattedDate = format(new Date(), "EEEE, do MMMM yyyy");

  const filteredData = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        product.sku.toLowerCase().includes(globalFilter.toLowerCase());
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || product.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, globalFilter, categoryFilter, statusFilter]);

  const totalProducts = filteredData.length;
  const inStock = filteredData.filter((p) => p.status === "in-stock").length;
  const lowStock = filteredData.filter((p) => p.status === "low-stock").length;
  const outOfStock = filteredData.filter((p) => p.status === "out-of-stock").length;
  const totalValue = filteredData.reduce((sum, p) => sum + p.price * p.stock, 0);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats);
  }, [products]);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => <DataGridColumnHeader title="Product" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={row.original.image} alt={row.original.name} />
              <AvatarFallback>
                <Package className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{row.original.name}</span>
              <span className="text-muted-foreground text-xs">{row.original.sku}</span>
            </div>
          </div>
        ),
        size: 220,
        enableSorting: true,
      },
      {
        accessorKey: "category",
        id: "category",
        header: ({ column }) => <DataGridColumnHeader title="Category" column={column} />,
        cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge>,
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "price",
        id: "price",
        header: ({ column }) => <DataGridColumnHeader title="Price" column={column} />,
        cell: ({ row }) => (
          <span className="font-semibold">
            ${row.original.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        ),
        size: 100,
        enableSorting: true,
        meta: {
          cellClassName: "font-semibold",
        },
      },
      {
        accessorKey: "stock",
        id: "stock",
        header: ({ column }) => <DataGridColumnHeader title="Stock" column={column} />,
        cell: ({ row }) => <span className="font-semibold">{row.original.stock}</span>,
        size: 80,
        enableSorting: true,
        meta: {
          cellClassName: "font-semibold",
        },
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        cell: ({ row }) => (
          <Badge className={statusColors[row.original.status]}>{row.original.status.replace("-", " ")}</Badge>
        ),
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "rating",
        id: "rating",
        header: ({ column }) => <DataGridColumnHeader title="Rating" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-sm">{row.original.rating}</span>
          </div>
        ),
        size: 90,
        enableSorting: true,
      },
      {
        accessorKey: "createdAt",
        id: "createdAt",
        header: ({ column }) => <DataGridColumnHeader title="Created" column={column} />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
          </span>
        ),
        size: 120,
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
              <DropdownMenuItem asChild>
                <Link href="/dashboard/products/details">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/products/edit">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Product
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
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
    getRowId: (row: Product) => row.id,
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
          <h1 className="text-3xl leading-none tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Total Products</p>
          <p className="mt-1 font-semibold text-2xl">{totalProducts}</p>
          <p className="text-muted-foreground text-xs">All products</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">In Stock</p>
          <p className="mt-1 font-semibold text-2xl text-green-600">{inStock}</p>
          <p className="text-muted-foreground text-xs">Available products</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Low Stock</p>
          <p className="mt-1 font-semibold text-2xl text-yellow-600">{lowStock}</p>
          <p className="text-muted-foreground text-xs">Need restocking</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Out of Stock</p>
          <p className="mt-1 font-semibold text-2xl text-red-600">{outOfStock}</p>
          <p className="text-muted-foreground text-xs">Unavailable products</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">Inventory Value</p>
          <p className="mt-1 font-semibold text-2xl text-blue-600">
            ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-muted-foreground text-xs">Total stock value</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
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
