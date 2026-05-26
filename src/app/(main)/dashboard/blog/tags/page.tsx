"use client";

import { useState } from "react";

import { format } from "date-fns";
import { Plus, Search, Edit, Trash2, MoreHorizontal, Hash } from "lucide-react";

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
import { Typography } from "@/components/ui/typography";

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

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase()) ||
      tag.slug.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenDialog = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({ name: tag.name, slug: tag.slug });
    } else {
      setEditingTag(null);
      setFormData({ name: "", slug: "" });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-");

    if (editingTag) {
      setTags(
        tags.map((tag) =>
          tag.id === editingTag.id ? { ...tag, ...formData, slug } : tag,
        ),
      );
    } else {
      const newTag: Tag = {
        id: `tag-${Date.now()}`,
        ...formData,
        slug,
        postCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTags([...tags, newTag]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1">Tags</Typography>
          <Typography variant="muted">
            Manage and organize blog post tags
          </Typography>
        </div>
        <Button onClick={() => handleOpenDialog()} data-icon="inline-start">
          <Plus />
          New Tag
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Tags</CardTitle>
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{tag.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      #{tag.slug}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{tag.postCount}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(tag.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(tag)} data-icon="inline-start">
                          <Edit />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(tag.id)}
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
            <DialogTitle>{editingTag ? "Edit Tag" : "Create Tag"}</DialogTitle>
            <DialogDescription>
              {editingTag
                ? "Update the tag details below."
                : "Add a new tag to categorize your blog posts."}
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
            <Button onClick={handleSave}>
              {editingTag ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
