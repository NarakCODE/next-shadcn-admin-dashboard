"use client";

import { useState } from "react";

import { Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";

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

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenDialog = (category?: Category) => {
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
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-");

    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, ...formData, slug, postCount: cat.postCount }
            : cat,
        ),
      );
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        ...formData,
        slug,
        postCount: 0,
      };
      setCategories([...categories, newCategory]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1">Categories</Typography>
          <Typography variant="muted">
            Manage blog post categories and organization
          </Typography>
        </div>
        <Button onClick={() => handleOpenDialog()} data-icon="inline-start">
          <Plus />
          New Category
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Categories</CardTitle>
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${category.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      /{category.slug}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] text-muted-foreground text-sm truncate">
                    {category.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.postCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(category)} data-icon="inline-start">
                          <Edit />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(category.id)}
                          data-icon="inline-start"
                        >
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
                      formData.color === color.value ? "border-foreground scale-110" : "border-transparent"
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
            <Button onClick={handleSave}>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
