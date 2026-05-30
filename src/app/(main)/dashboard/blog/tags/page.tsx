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
import { Edit, Hash, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";

import { DataGrid, DataGridContainer, DataGridTable } from "@/components/reui/data-grid/data-grid";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Tag = {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  createdAt: string;
};

const initialTags: Tag[] = [
  { id: "tag-1", name: "Next.js", slug: "next-js", postCount: 28, createdAt: "2024-01-15" },
  { id: "tag-2", name: "React", slug: "react", postCount: 42, createdAt: "2024-01-10" },
  { id: "tag-3", name: "TypeScript", slug: "typescript", postCount: 35, createdAt: "2024-01-08" },
  { id: "tag-4", name: "Tailwind CSS", slug: "tailwind-css", postCount: 19, createdAt: "2024-02-01" },
  { id: "tag-5", name: "JavaScript", slug: "javascript", postCount: 56, createdAt: "2024-01-05" },
  { id: "tag-6", name: "Web Development", slug: "web-development", postCount: 48, createdAt: "2024-01-03" },
  { id: "tag-7", name: "Design Systems", slug: "design-systems", postCount: 12, createdAt: "2024-02-15" },
  { id: "tag-8", name: "UI/UX", slug: "ui-ux", postCount: 22, createdAt: "2024-02-10" },
  { id: "tag-9", name: "Performance", slug: "performance", postCount: 15, createdAt: "2024-03-01" },
  { id: "tag-10", name: "Server Components", slug: "server-components", postCount: 8, createdAt: "2024-03-10" },
  { id: "tag-11", name: "API", slug: "api", postCount: 31, createdAt: "2024-01-20" },
  { id: "tag-12", name: "Security", slug: "security", postCount: 17, createdAt: "2024-02-20" },
];

export default function BlogTagsPage() {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "postCount", desc: true }]);

  const handleOpenDialog = useCallback((tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({ name: tag.name, slug: tag.slug });
    } else {
      setEditingTag(null);
      setFormData({ name: "", slug: "" });
    }
    setDialogOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.name.trim()) return;

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-");

    setTags((prev) => {
      if (editingTag) {
        return prev.map((tag) => (tag.id === editingTag.id ? { ...tag, ...formData, slug } : tag));
      }
      return [
        ...prev,
        {
          id: `tag-${Date.now()}`,
          ...formData,
          slug,
          postCount: 0,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ];
    });
    setDialogOpen(false);
  }, [formData, editingTag]);

  const handleDelete = useCallback((id: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  }, []);

  const columns = useMemo<ColumnDef<Tag>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: "Tag",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
        size: 200,
        enableSorting: true,
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
          <Badge variant="secondary" className="font-mono text-xs">
            #{row.original.slug}
          </Badge>
        ),
        size: 180,
      },
      {
        accessorKey: "postCount",
        header: "Posts",
        cell: ({ row }) => <Badge variant="outline">{row.original.postCount}</Badge>,
        size: 100,
        meta: {
          cellClassName: "font-medium",
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
          </span>
        ),
        size: 140,
        meta: {
          cellClassName: "font-medium",
        },
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
              <DropdownMenuItem onClick={() => handleOpenDialog(row.original)} data-icon="inline-start">
                <Edit className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDelete(row.original.id)}
                data-icon="inline-start"
              >
                <Trash2 className="h-4 w-4" />
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
    [handleOpenDialog, handleDelete],
  );

  const table = useReactTable({
    columns,
    data: tags,
    pageCount: Math.ceil(tags.length / pagination.pageSize),
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
      return (
        row.original.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        row.original.slug.toLowerCase().includes(filterValue.toLowerCase())
      );
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl tracking-tight">Tags</h1>
          <p className="text-muted-foreground text-sm">Manage and organize blog post tags</p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-icon="inline-start">
          <Plus className="h-4 w-4" />
          New Tag
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <DataGrid table={table} recordCount={tags.length}>
        <div className="w-full space-y-2.5">
          <DataGridContainer>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </DataGridContainer>
          <DataGridPagination table={table} />
        </div>
      </DataGrid>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTag ? "Edit Tag" : "Create Tag"}</DialogTitle>
            <DialogDescription>
              {editingTag ? "Update the tag details below." : "Add a new tag to categorize your blog posts."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., React"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: formData.slug || e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="e.g., react"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editingTag ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
