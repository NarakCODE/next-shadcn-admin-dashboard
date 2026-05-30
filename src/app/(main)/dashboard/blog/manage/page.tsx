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
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";

import { DataGrid, DataGridContainer, DataGridTable } from "@/components/reui/data-grid/data-grid";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  status: "published" | "draft" | "scheduled" | "inactive";
  views: number;
  comments: number;
};

const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "Getting Started with Next.js 15: A Complete Guide",
    category: "Development",
    author: "Alex Johnson",
    publishedAt: "2024-12-15",
    status: "published",
    views: 1234,
    comments: 24,
  },
  {
    id: "post-2",
    title: "Building Scalable Design Systems with Tailwind CSS",
    category: "Design",
    author: "Sarah Chen",
    publishedAt: "2024-12-10",
    status: "published",
    views: 892,
    comments: 18,
  },
  {
    id: "post-3",
    title: "TypeScript 5.4: What's New and Improved",
    category: "Development",
    author: "Mike Peters",
    publishedAt: "2024-12-05",
    status: "draft",
    views: 0,
    comments: 0,
  },
  {
    id: "post-4",
    title: "Mastering React Server Components",
    category: "Development",
    author: "Emily Davis",
    publishedAt: "2024-11-28",
    status: "published",
    views: 2156,
    comments: 32,
  },
  {
    id: "post-5",
    title: "The Future of Web Animation: CSS vs JavaScript",
    category: "Design",
    author: "David Kim",
    publishedAt: "2024-11-20",
    status: "published",
    views: 678,
    comments: 15,
  },
  {
    id: "post-6",
    title: "API Security Best Practices for Modern Web Apps",
    category: "Security",
    author: "Lisa Wang",
    publishedAt: "2024-11-15",
    status: "scheduled",
    views: 0,
    comments: 0,
  },
  {
    id: "post-7",
    title: "Optimizing Database Queries for High-Traffic Applications",
    category: "Backend",
    author: "Tom Wilson",
    publishedAt: "2024-11-10",
    status: "inactive",
    views: 432,
    comments: 8,
  },
  {
    id: "post-8",
    title: "Introduction to Edge Computing with Cloudflare Workers",
    category: "Infrastructure",
    author: "Rachel Green",
    publishedAt: "2024-11-05",
    status: "published",
    views: 567,
    comments: 9,
  },
  {
    id: "post-9",
    title: "Building Accessible Web Applications from Scratch",
    category: "Accessibility",
    author: "James Brown",
    publishedAt: "2024-10-28",
    status: "published",
    views: 345,
    comments: 16,
  },
  {
    id: "post-10",
    title: "Advanced React Patterns for Enterprise Applications",
    category: "Development",
    author: "Anna Smith",
    publishedAt: "2024-10-20",
    status: "draft",
    views: 0,
    comments: 0,
  },
  {
    id: "post-11",
    title: "Microservices Architecture: A Practical Guide",
    category: "Backend",
    author: "Chris Lee",
    publishedAt: "2024-10-15",
    status: "published",
    views: 1890,
    comments: 45,
  },
  {
    id: "post-12",
    title: "Designing for Mobile-First: Tips and Tricks",
    category: "Design",
    author: "Mia Johnson",
    publishedAt: "2024-10-08",
    status: "published",
    views: 723,
    comments: 12,
  },
];

const statusVariant = (status: BlogPost["status"]) => {
  switch (status) {
    case "published":
      return "default";
    case "draft":
      return "secondary";
    case "scheduled":
      return "outline";
    case "inactive":
      return "destructive";
  }
};

export default function ManageBlogPage() {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "publishedAt", desc: true }]);

  const columns = useMemo<ColumnDef<BlogPost>[]>(
    () => [
      {
        accessorKey: "title",
        id: "title",
        header: "Title",
        cell: ({ row }) => (
          <Link href={`/dashboard/blog/detail`} className="line-clamp-1 font-medium text-foreground hover:text-primary">
            {row.original.title}
          </Link>
        ),
        size: 280,
        enableSorting: true,
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge>,
        size: 140,
      },
      {
        accessorKey: "author",
        header: "Author",
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.author}</span>,
        size: 150,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge variant={statusVariant(row.original.status)}>{row.original.status}</Badge>,
        size: 120,
        meta: {
          cellClassName: "font-medium",
        },
      },
      {
        accessorKey: "publishedAt",
        header: "Published",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {format(new Date(row.original.publishedAt), "MMM dd, yyyy")}
          </span>
        ),
        size: 130,
        meta: {
          cellClassName: "font-medium",
        },
      },
      {
        accessorKey: "views",
        header: "Views",
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.views.toLocaleString()}</span>,
        size: 100,
      },
      {
        accessorKey: "comments",
        header: "Comments",
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.comments}</span>,
        size: 100,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const post = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/blog/detail" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/blog/edit" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    setPosts((prev) => prev.filter((p) => p.id !== post.id));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 60,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [],
  );

  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);

  const table = useReactTable({
    columns,
    data: posts,
    pageCount: Math.ceil(posts.length / pagination.pageSize),
    getRowId: (row) => row.id,
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
      return row.original.title.toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl tracking-tight">Manage Blog Posts</h1>
          <p className="text-muted-foreground text-sm">Create, edit, and manage all your blog posts</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/dashboard/blog/create">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <DataGrid table={table} recordCount={posts.length}>
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
