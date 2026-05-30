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
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  MoreHorizontal,
  Package,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import { DataGrid, DataGridContainer, DataGridTable } from "@/components/reui/data-grid/data-grid";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type OrderDetails = {
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
};

type Order = {
  id: string;
  customer: string;
  customerAvatar: string;
  email: string;
  product: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  items: number;
  details: OrderDetails;
};

const orders: Order[] = [
  {
    id: "ORD-001",
    customer: "Alex Johnson",
    customerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&dpr=2&q=80",
    email: "alex@example.com",
    product: 'MacBook Pro 16"',
    amount: 2499.0,
    status: "delivered",
    date: "2024-12-20T10:30:00Z",
    items: 1,
    details: {
      shippingAddress: "123 Tech Street, San Francisco, CA 94102",
      billingAddress: "123 Tech Street, San Francisco, CA 94102",
      paymentMethod: "Visa ending in 4242",
      trackingNumber: "1Z999AA10123456784",
      notes: "Leave at front door",
    },
  },
  {
    id: "ORD-002",
    customer: "Sarah Chen",
    customerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&dpr=2&q=80",
    email: "sarah@example.com",
    product: "iPhone 15 Pro Max",
    amount: 1199.0,
    status: "shipped",
    date: "2024-12-21T14:15:00Z",
    items: 1,
    details: {
      shippingAddress: "456 Innovation Ave, New York, NY 10001",
      billingAddress: "456 Innovation Ave, New York, NY 10001",
      paymentMethod: "Mastercard ending in 8888",
      trackingNumber: "1Z999AA10123456785",
    },
  },
  {
    id: "ORD-003",
    customer: "Mike Peters",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&dpr=2&q=80",
    email: "mike@example.com",
    product: "AirPods Pro",
    amount: 249.0,
    status: "processing",
    date: "2024-12-22T09:00:00Z",
    items: 2,
    details: {
      shippingAddress: "789 Design Blvd, Austin, TX 73301",
      billingAddress: "321 Payment Lane, Austin, TX 73301",
      paymentMethod: "Apple Pay",
      notes: "Gift wrap requested",
    },
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&dpr=2&q=80",
    email: "emily@example.com",
    product: "iPad Air",
    amount: 799.0,
    status: "pending",
    date: "2024-12-23T11:45:00Z",
    items: 1,
    details: {
      shippingAddress: "555 Creative Way, Seattle, WA 98101",
      billingAddress: "555 Creative Way, Seattle, WA 98101",
      paymentMethod: "PayPal",
    },
  },
  {
    id: "ORD-005",
    customer: "David Kim",
    customerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&dpr=2&q=80",
    email: "david@example.com",
    product: "Apple Watch Ultra",
    amount: 899.0,
    status: "delivered",
    date: "2024-12-18T16:30:00Z",
    items: 1,
    details: {
      shippingAddress: "888 Watch Street, Portland, OR 97201",
      billingAddress: "888 Watch Street, Portland, OR 97201",
      paymentMethod: "Visa ending in 1234",
      trackingNumber: "1Z999AA10123456786",
      notes: "Signature required",
    },
  },
  {
    id: "ORD-006",
    customer: "Lisa Wang",
    customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&dpr=2&q=80",
    email: "lisa@example.com",
    product: "Magic Keyboard",
    amount: 299.0,
    status: "cancelled",
    date: "2024-12-19T08:20:00Z",
    items: 1,
    details: {
      shippingAddress: "222 Keyboard Ave, Boston, MA 02101",
      billingAddress: "222 Keyboard Ave, Boston, MA 02101",
      paymentMethod: "Google Pay",
      notes: "Customer requested cancellation",
    },
  },
  {
    id: "ORD-007",
    customer: "Tom Wilson",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&dpr=2&q=80",
    email: "tom@example.com",
    product: "Studio Display",
    amount: 1599.0,
    status: "shipped",
    date: "2024-12-24T13:00:00Z",
    items: 1,
    details: {
      shippingAddress: "333 Display Road, Denver, CO 80201",
      billingAddress: "333 Display Road, Denver, CO 80201",
      paymentMethod: "Amex ending in 9999",
      trackingNumber: "1Z999AA10123456787",
    },
  },
  {
    id: "ORD-008",
    customer: "Rachel Green",
    customerAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&dpr=2&q=80",
    email: "rachel@example.com",
    product: "HomePod mini",
    amount: 199.0,
    status: "delivered",
    date: "2024-12-17T10:15:00Z",
    items: 3,
    details: {
      shippingAddress: "444 Music Lane, Nashville, TN 37201",
      billingAddress: "444 Music Lane, Nashville, TN 37201",
      paymentMethod: "Visa ending in 5678",
      trackingNumber: "1Z999AA10123456788",
      notes: "Fragile items - handle with care",
    },
  },
  {
    id: "ORD-009",
    customer: "James Brown",
    customerAvatar: "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=40&h=40&dpr=2&q=80",
    email: "james@example.com",
    product: "Mac Mini M2",
    amount: 699.0,
    status: "processing",
    date: "2024-12-25T15:30:00Z",
    items: 1,
    details: {
      shippingAddress: "666 Mini Street, Chicago, IL 60601",
      billingAddress: "666 Mini Street, Chicago, IL 60601",
      paymentMethod: "Mastercard ending in 3333",
    },
  },
  {
    id: "ORD-010",
    customer: "Anna Smith",
    customerAvatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=40&h=40&dpr=2&q=80",
    email: "anna@example.com",
    product: "AirTag 4-Pack",
    amount: 99.0,
    status: "delivered",
    date: "2024-12-16T09:45:00Z",
    items: 2,
    details: {
      shippingAddress: "777 Tracker Blvd, Miami, FL 33101",
      billingAddress: "777 Tracker Blvd, Miami, FL 33101",
      paymentMethod: "Apple Pay",
      trackingNumber: "1Z999AA10123456789",
    },
  },
  {
    id: "ORD-011",
    customer: "Chris Lee",
    customerAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&dpr=2&q=80",
    email: "chris@example.com",
    product: "Pro Display XDR",
    amount: 4999.0,
    status: "pending",
    date: "2024-12-26T11:00:00Z",
    items: 1,
    details: {
      shippingAddress: "999 Pro Avenue, Los Angeles, CA 90001",
      billingAddress: "999 Pro Avenue, Los Angeles, CA 90001",
      paymentMethod: "Wire Transfer",
      notes: "Business purchase - invoice required",
    },
  },
  {
    id: "ORD-012",
    customer: "Mia Johnson",
    customerAvatar: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=40&h=40&dpr=2&q=80",
    email: "mia@example.com",
    product: "MacBook Air M3",
    amount: 1299.0,
    status: "shipped",
    date: "2024-12-27T14:20:00Z",
    items: 1,
    details: {
      shippingAddress: "111 Air Street, Atlanta, GA 30301",
      billingAddress: "111 Air Street, Atlanta, GA 30301",
      paymentMethod: "Visa ending in 7777",
      trackingNumber: "1Z999AA10123456790",
    },
  },
  {
    id: "ORD-013",
    customer: "Nick Taylor",
    customerAvatar: "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=40&h=40&dpr=2&q=80",
    email: "nick@example.com",
    product: "Apple Pencil Pro",
    amount: 129.0,
    status: "delivered",
    date: "2024-12-15T08:30:00Z",
    items: 2,
    details: {
      shippingAddress: "222 Pencil Road, Phoenix, AZ 85001",
      billingAddress: "222 Pencil Road, Phoenix, AZ 85001",
      paymentMethod: "PayPal",
      trackingNumber: "1Z999AA10123456791",
    },
  },
  {
    id: "ORD-014",
    customer: "Emma Wilson",
    customerAvatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=40&h=40&dpr=2&q=80",
    email: "emma@example.com",
    product: "Vision Pro",
    amount: 3499.0,
    status: "processing",
    date: "2024-12-28T16:45:00Z",
    items: 1,
    details: {
      shippingAddress: "333 Vision Blvd, San Diego, CA 92101",
      billingAddress: "333 Vision Blvd, San Diego, CA 92101",
      paymentMethod: "Amex ending in 1111",
      notes: "High value item - insurance included",
    },
  },
  {
    id: "ORD-015",
    customer: "Daniel Martinez",
    customerAvatar: "https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=40&h=40&dpr=2&q=80",
    email: "daniel@example.com",
    product: "iPhone 15 Case",
    amount: 49.0,
    status: "cancelled",
    date: "2024-12-14T12:00:00Z",
    items: 4,
    details: {
      shippingAddress: "444 Case Street, Dallas, TX 75201",
      billingAddress: "444 Case Street, Dallas, TX 75201",
      paymentMethod: "Google Pay",
      notes: "Wrong item ordered - customer cancelled",
    },
  },
];

const statusVariant = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return "secondary";
    case "processing":
      return "outline";
    case "shipped":
      return "default";
    case "delivered":
      return "default";
    case "cancelled":
      return "destructive";
  }
};

const statusIcon = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return <Clock className="h-3 w-3" />;
    case "processing":
      return <Package className="h-3 w-3" />;
    case "shipped":
      return <Truck className="h-3 w-3" />;
    case "delivered":
      return <CheckCircle className="h-3 w-3" />;
    case "cancelled":
      return <XCircle className="h-3 w-3" />;
  }
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalIncome = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.amount, 0);
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const completedOrders = orders.filter((o) => o.status === "delivered").length;
    const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
    return { totalOrders, totalIncome, pendingOrders, completedOrders, cancelledOrders };
  }, []);

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: "expand",
        header: () => null,
        cell: ({ row }) =>
          row.getCanExpand() ? (
            <Button
              variant="ghost"
              size="icon"
              className="size-6 text-muted-foreground hover:bg-transparent"
              onClick={() => row.toggleExpanded()}
            >
              {row.getIsExpanded() ? (
                <ChevronUp aria-hidden="true" className="h-4 w-4" />
              ) : (
                <ChevronDown aria-hidden="true" className="h-4 w-4" />
              )}
            </Button>
          ) : null,
        size: 40,
        meta: {
          expandedContent: (row: Order) => (
            <div className="bg-muted/30 px-4 py-4 text-sm">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Shipping Address</span>
                  </div>
                  <p className="text-foreground">{row.details.shippingAddress}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">Payment Method</span>
                  </div>
                  <p className="text-foreground">{row.details.paymentMethod}</p>
                </div>
                {row.details.trackingNumber && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span className="font-medium">Tracking Number</span>
                    </div>
                    <p className="font-mono text-foreground">{row.details.trackingNumber}</p>
                  </div>
                )}
                {row.details.notes && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span className="font-medium">Notes</span>
                    </div>
                    <p className="text-foreground">{row.details.notes}</p>
                  </div>
                )}
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <span className="font-medium text-muted-foreground">Billing Address</span>
                  <p className="text-foreground">{row.details.billingAddress}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-medium text-muted-foreground">Order Summary</span>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {row.items} item{row.items > 1 ? "s" : ""}
                    </span>
                    <span className="font-semibold">
                      ${row.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      },
      {
        accessorKey: "id",
        id: "id",
        header: "Order ID",
        cell: ({ row }) => (
          <Link href="#" className="font-medium text-primary hover:underline">
            {row.original.id}
          </Link>
        ),
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "customer",
        id: "customer",
        header: "Customer",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row.original.customerAvatar} />
              <AvatarFallback>
                {row.original.customer
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-sm">{row.original.customer}</p>
              <p className="text-muted-foreground text-xs">{row.original.email}</p>
            </div>
          </div>
        ),
        size: 200,
        enableSorting: true,
      },
      {
        accessorKey: "product",
        header: "Product",
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.product}</span>,
        size: 180,
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="font-medium">
            ${row.original.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        ),
        size: 120,
        meta: {
          cellClassName: "font-medium",
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.status)} className="gap-1">
            {statusIcon(row.original.status)}
            {row.original.status}
          </Badge>
        ),
        size: 130,
        meta: {
          cellClassName: "font-medium",
        },
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">{format(new Date(row.original.date), "MMM dd, yyyy")}</span>
        ),
        size: 130,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem data-icon="inline-start">View Details</DropdownMenuItem>
              <DropdownMenuItem data-icon="inline-start">Edit Order</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" data-icon="inline-start">
                Cancel Order
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
    data: orders,
    pageCount: Math.ceil(orders.length / pagination.pageSize),
    getRowId: (row) => row.id,
    getRowCanExpand: () => true,
    state: {
      pagination,
      sorting,
      globalFilter: search,
    },
    columnResizeMode: "onChange",
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      return (
        row.original.id.toLowerCase().includes(filterValue.toLowerCase()) ||
        row.original.customer.toLowerCase().includes(filterValue.toLowerCase()) ||
        row.original.product.toLowerCase().includes(filterValue.toLowerCase()) ||
        row.original.status.toLowerCase().includes(filterValue.toLowerCase())
      );
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-sm">Track and manage all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div
          data-slot="card"
          data-size="default"
          className="group/card !shadow-none flex flex-col gap-6 overflow-hidden rounded-xl border-0 bg-chart-1/12 p-3 text-sm ring-1 ring-foreground/10 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <h6 className="font-semibold text-base">{stats.totalOrders}</h6>
              <p className="text-sm">Total Orders</p>
            </div>
            <ShoppingBag className="h-5 w-5 text-chart-1" />
          </div>
        </div>

        <div
          data-slot="card"
          data-size="default"
          className="group/card !shadow-none flex flex-col gap-6 overflow-hidden rounded-xl border-0 bg-chart-5/12 p-3 text-sm ring-1 ring-foreground/10 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <h6 className="font-semibold text-base">
                ${stats.totalIncome.toLocaleString("en-US", { minimumFractionDigits: 0 })}
              </h6>
              <p className="text-sm">Income</p>
            </div>
            <DollarSign className="h-5 w-5 text-chart-5" />
          </div>
        </div>

        <div
          data-slot="card"
          data-size="default"
          className="group/card !shadow-none flex flex-col gap-6 overflow-hidden rounded-xl border-0 bg-chart-2/12 p-3 text-sm ring-1 ring-foreground/10 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <h6 className="font-semibold text-base">{stats.pendingOrders}</h6>
              <p className="text-sm">Pending</p>
            </div>
            <Clock className="h-5 w-5 text-chart-2" />
          </div>
        </div>

        <div
          data-slot="card"
          data-size="default"
          className="group/card !shadow-none flex flex-col gap-6 overflow-hidden rounded-xl border-0 bg-chart-3/12 p-3 text-sm ring-1 ring-foreground/10 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <h6 className="font-semibold text-base">{stats.completedOrders}</h6>
              <p className="text-sm">Completed</p>
            </div>
            <CheckCircle className="h-5 w-5 text-chart-3" />
          </div>
        </div>

        <div
          data-slot="card"
          data-size="default"
          className="group/card !shadow-none flex flex-col gap-6 overflow-hidden rounded-xl border-0 bg-chart-4/12 p-3 text-sm ring-1 ring-foreground/10 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <h6 className="font-semibold text-base">{stats.cancelledOrders}</h6>
              <p className="text-sm">Cancelled</p>
            </div>
            <XCircle className="h-5 w-5 text-chart-4" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* DataGrid */}
      <DataGrid table={table} recordCount={orders.length}>
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
