"use client";

import { useCallback, useMemo, useState } from "react";

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
import { Check, Flag, Heart, MessageSquare, MoreHorizontal, Search, Trash2, X } from "lucide-react";

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Comment = {
  id: string;
  author: string;
  authorAvatar: string;
  email: string;
  content: string;
  postTitle: string;
  publishedAt: string;
  status: "pending" | "approved" | "rejected" | "reported";
  likes: number;
};

const initialComments: Comment[] = [
  {
    id: "comment-1",
    author: "Sarah Chen",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&dpr=2&q=80",
    email: "sarah@example.com",
    content: "Great article! The explanation of partial prerendering was particularly helpful.",
    postTitle: "Getting Started with Next.js 15",
    publishedAt: "2024-12-16T10:30:00Z",
    status: "pending",
    likes: 12,
  },
  {
    id: "comment-2",
    author: "Mike Peters",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&dpr=2&q=80",
    email: "mike@example.com",
    content:
      "The server actions section was incredibly detailed. One thing I'd add is that you should be careful with caching.",
    postTitle: "Getting Started with Next.js 15",
    publishedAt: "2024-12-17T08:15:00Z",
    status: "approved",
    likes: 8,
  },
  {
    id: "comment-3",
    author: "Emily Davis",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&dpr=2&q=80",
    email: "emily@example.com",
    content: "This is the most comprehensive guide I've found so far. Bookmarked!",
    postTitle: "Building Scalable Design Systems",
    publishedAt: "2024-12-18T14:20:00Z",
    status: "approved",
    likes: 15,
  },
  {
    id: "comment-4",
    author: "John Doe",
    authorAvatar: "",
    email: "john@spam.com",
    content: "Check out my website for amazing deals!!! Click here now!!!",
    postTitle: "TypeScript 5.4: What's New",
    publishedAt: "2024-12-19T09:00:00Z",
    status: "reported",
    likes: 0,
  },
  {
    id: "comment-5",
    author: "Lisa Wang",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&dpr=2&q=80",
    email: "lisa@example.com",
    content: "Could you elaborate more on the caching model changes? I'm still confused about revalidation.",
    postTitle: "Mastering React Server Components",
    publishedAt: "2024-12-20T11:45:00Z",
    status: "pending",
    likes: 3,
  },
  {
    id: "comment-6",
    author: "David Kim",
    authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&dpr=2&q=80",
    email: "david@example.com",
    content: "Nice write-up! I've been using these patterns in production and they work great.",
    postTitle: "API Security Best Practices",
    publishedAt: "2024-12-21T16:30:00Z",
    status: "rejected",
    likes: 5,
  },
  {
    id: "comment-7",
    author: "Rachel Green",
    authorAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&dpr=2&q=80",
    email: "rachel@example.com",
    content: "The edge computing examples were really practical. Would love to see more content on Cloudflare Workers.",
    postTitle: "Introduction to Edge Computing",
    publishedAt: "2024-12-22T09:15:00Z",
    status: "approved",
    likes: 7,
  },
  {
    id: "comment-8",
    author: "Tom Wilson",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&dpr=2&q=80",
    email: "tom@example.com",
    content: "Query optimization tips saved our production database. Thank you!",
    postTitle: "Optimizing Database Queries",
    publishedAt: "2024-12-23T14:00:00Z",
    status: "pending",
    likes: 11,
  },
  {
    id: "comment-9",
    author: "Anna Smith",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&dpr=2&q=80",
    email: "anna@example.com",
    content: "The accessibility checklist is now part of our team's standard process.",
    postTitle: "Building Accessible Web Applications",
    publishedAt: "2024-12-24T10:30:00Z",
    status: "approved",
    likes: 20,
  },
  {
    id: "comment-10",
    author: "Chris Lee",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&dpr=2&q=80",
    email: "chris@example.com",
    content: "Microservices architecture patterns are spot on. We implemented similar patterns at our company.",
    postTitle: "Microservices Architecture Guide",
    publishedAt: "2024-12-25T08:45:00Z",
    status: "reported",
    likes: 2,
  },
  {
    id: "comment-11",
    author: "Mia Johnson",
    authorAvatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=40&h=40&dpr=2&q=80",
    email: "mia@example.com",
    content: "Mobile-first design tips transformed our approach. Great read!",
    postTitle: "Designing for Mobile-First",
    publishedAt: "2024-12-26T16:20:00Z",
    status: "approved",
    likes: 9,
  },
  {
    id: "comment-12",
    author: "James Brown",
    authorAvatar: "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=40&h=40&dpr=2&q=80",
    email: "james@example.com",
    content: "Could you write a follow-up article on advanced React patterns?",
    postTitle: "Advanced React Patterns",
    publishedAt: "2024-12-27T11:00:00Z",
    status: "pending",
    likes: 6,
  },
];

const statusBadgeVariant = (status: Comment["status"]) => {
  switch (status) {
    case "approved":
      return "default";
    case "pending":
      return "secondary";
    case "rejected":
      return "destructive";
    case "reported":
      return "destructive";
  }
};

export default function BlogCommentsPage() {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "publishedAt", desc: true }]);

  const handleApprove = useCallback((id: string) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status: "approved" as const } : c)));
  }, []);

  const handleReject = useCallback((id: string) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status: "rejected" as const } : c)));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const statusCounts = useMemo(
    () => ({
      all: comments.length,
      pending: comments.filter((c) => c.status === "pending").length,
      approved: comments.filter((c) => c.status === "approved").length,
      rejected: comments.filter((c) => c.status === "rejected").length,
      reported: comments.filter((c) => c.status === "reported").length,
    }),
    [comments],
  );

  const columns = useMemo<ColumnDef<Comment>[]>(
    () => [
      {
        accessorKey: "author",
        id: "author",
        header: "Author",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row.original.authorAvatar} />
              <AvatarFallback>
                {row.original.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-sm">{row.original.author}</p>
              <p className="text-muted-foreground text-xs">{row.original.email}</p>
            </div>
          </div>
        ),
        size: 180,
        enableSorting: true,
      },
      {
        accessorKey: "content",
        header: "Comment",
        cell: ({ row }) => (
          <div className="max-w-[300px]">
            <p className="line-clamp-2 text-muted-foreground text-sm">{row.original.content}</p>
            <p className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
              <MessageSquare className="h-3 w-3" />
              on "{row.original.postTitle}"
            </p>
          </div>
        ),
        size: 300,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge variant={statusBadgeVariant(row.original.status)}>{row.original.status}</Badge>,
        size: 110,
        meta: {
          cellClassName: "font-medium",
        },
      },
      {
        accessorKey: "likes",
        header: "Likes",
        cell: ({ row }) => (
          <span className="flex items-center gap-1 text-muted-foreground text-sm">
            <Heart className="h-3 w-3" />
            {row.original.likes}
          </span>
        ),
        size: 80,
        meta: {
          cellClassName: "font-medium",
        },
      },
      {
        accessorKey: "publishedAt",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {format(new Date(row.original.publishedAt), "MMM dd, yyyy")}
          </span>
        ),
        size: 130,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const comment = row.original;
          return (
            <div className="flex items-center gap-1">
              {comment.status === "pending" && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950"
                    onClick={() => handleApprove(comment.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                    onClick={() => handleReject(comment.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
              {comment.status === "reported" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-green-600 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950"
                  onClick={() => handleApprove(comment.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {comment.status !== "reported" && (
                    <DropdownMenuItem data-icon="inline-start">
                      <Flag className="h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDelete(comment.id)}
                    data-icon="inline-start"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        size: 120,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [handleApprove, handleReject, handleDelete],
  );

  const filteredComments = useMemo(() => {
    let result = comments;
    if (activeTab !== "all") {
      result = result.filter((c) => c.status === activeTab);
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.author.toLowerCase().includes(lowerSearch) ||
          c.content.toLowerCase().includes(lowerSearch) ||
          c.postTitle.toLowerCase().includes(lowerSearch) ||
          c.email.toLowerCase().includes(lowerSearch),
      );
    }
    return result;
  }, [comments, activeTab, search]);

  const table = useReactTable({
    columns,
    data: filteredComments,
    pageCount: Math.ceil(filteredComments.length / pagination.pageSize),
    getRowId: (row) => row.id,
    state: {
      pagination,
      sorting,
    },
    columnResizeMode: "onChange",
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Comments</h1>
        <p className="text-muted-foreground text-sm">Moderate and manage blog post comments</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              All
              <Badge variant="primary-light" className="h-4 px-1.5 text-[10px]">
                {statusCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              Pending
              <Badge variant="primary-light" className="h-4 px-1.5 text-[10px]">
                {statusCounts.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              Approved
              <Badge variant="primary-light" className="h-4 px-1.5 text-[10px]">
                {statusCounts.approved}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              Rejected
              <Badge variant="primary-light" className="h-4 px-1.5 text-[10px]">
                {statusCounts.rejected}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="reported" className="gap-2">
              Reported
              <Badge variant="primary-light" className="h-4 px-1.5 text-[10px]">
                {statusCounts.reported}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full max-w-sm">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <DataGrid table={table} recordCount={filteredComments.length}>
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
