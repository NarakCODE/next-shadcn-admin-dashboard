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
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  color: string;
};

const initialCategories: Category[] = [
  {
    id: "cat-1",
    name: "Development",
    slug: "development",
    description: "Articles about software development and programming",
    postCount: 45,
    color: "bg-blue-500",
  },
  {
    id: "cat-2",
    name: "Design",
    slug: "design",
    description: "UI/UX design, design systems, and visual content",
    postCount: 32,
    color: "bg-purple-500",
  },
  {
    id: "cat-3",
    name: "Security",
    slug: "security",
    description: "Cybersecurity, best practices, and vulnerability management",
    postCount: 18,
    color: "bg-red-500",
  },
  {
    id: "cat-4",
    name: "Backend",
    slug: "backend",
    description: "Server-side development, databases, and APIs",
    postCount: 27,
    color: "bg-green-500",
  },
  {
    id: "cat-5",
    name: "Infrastructure",
    slug: "infrastructure",
    description: "Cloud, DevOps, and deployment strategies",
    postCount: 15,
    color: "bg-orange-500",
  },
  {
    id: "cat-6",
    name: "Accessibility",
    slug: "accessibility",
    description: "Web accessibility standards and inclusive design",
    postCount: 12,
    color: "bg-teal-500",
  },
  {
    id: "cat-7",
    name: "DevOps",
    slug: "devops",
    description: "CI/CD, containerization, and deployment automation",
    postCount: 21,
    color: "bg-pink-500",
  },
  {
    id: "cat-8",
    name: "Mobile",
    slug: "mobile",
    description: "React Native, Flutter, and mobile development",
    postCount: 19,
    color: "bg-yellow-500",
  },
];

const colorOptions = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-orange-500", label: "Orange" },
  { value: "bg-teal-500", label: "Teal" },
  { value: "bg-pink-500", label: "Pink" },
  { value: "bg-yellow-500", label: "Yellow" },
];

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "bg-blue-500",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "postCount", desc: true }]);

  const handleOpenDialog = useCallback((category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        color: category.color,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", slug: "", description: "", color: "bg-blue-500" });
    }
    setDialogOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.name.trim()) return;

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-");

    setCategories((prev) => {
      if (editingCategory) {
        return prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...formData, slug, postCount: cat.postCount } : cat,
        );
      }
      return [...prev, { id: `cat-${Date.now()}`, ...formData, slug, postCount: 0 }];
    });
    setDialogOpen(false);
  }, [formData, editingCategory]);

  const handleDelete = useCallback((id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  }, []);

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: "Category",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${row.original.color}`} />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
        size: 180,
        enableSorting: true,
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
          <Badge variant="secondary" className="font-mono text-xs">
            /{row.original.slug}
          </Badge>
        ),
        size: 160,
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="line-clamp-1 text-muted-foreground text-sm">{row.original.description}</span>
        ),
        size: 300,
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
    data: categories,
    pageCount: Math.ceil(categories.length / pagination.pageSize),
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
        row.original.description.toLowerCase().includes(filterValue.toLowerCase())
      );
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm">Manage blog post categories and organization</p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-icon="inline-start">
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <DataGrid table={table} recordCount={categories.length}>
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
            <DialogTitle>{editingCategory ? "Edit Category" : "Create Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category details below."
                : "Add a new category to organize your blog posts."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., Development"
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
                placeholder="e.g., development"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this category..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`h-8 w-8 rounded-full border-2 transition-all ${color.value} ${
                      formData.color === color.value ? "scale-110 border-foreground" : "border-transparent"
                    }`}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    aria-label={`Select ${color.label} color`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editingCategory ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
