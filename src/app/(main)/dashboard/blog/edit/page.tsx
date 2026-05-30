"use client";

import { useCallback, useState } from "react";

import Link from "next/link";

import { format } from "date-fns";
import { ArrowLeft, Calendar, Eye, ImagePlus, Plus, Save, Trash2, X } from "lucide-react";

import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const defaultCategories = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "security", label: "Security" },
  { value: "backend", label: "Backend" },
  { value: "infrastructure", label: "Infrastructure" },
];

export default function BlogEditPage() {
  const [title, setTitle] = useState("Getting Started with Next.js 15: A Complete Guide");
  const [excerpt, setExcerpt] = useState(
    "Learn everything about Next.js 15's new features including partial prerendering, server actions, and the new caching model.",
  );
  const [content, setContent] = useState(
    `<h2>Introduction</h2><p>Next.js 15 brings a host of new features and improvements that make building modern web applications easier than ever.</p><h2>Partial Prerendering (PPR)</h2><p>One of the most exciting features in Next.js 15 is Partial Prerendering.</p><h2>Server Actions</h2><p>Server Actions have been significantly improved in Next.js 15.</p>`,
  );
  const [tags, setTags] = useState<string[]>(["Next.js", "React", "Web Development"]);
  const [tagInput, setTagInput] = useState("");
  const [categoryId, setCategoryId] = useState("development");
  const [categories, setCategories] = useState(defaultCategories);
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&dpr=2&q=80",
  );
  const [status, setStatus] = useState<"draft" | "published" | "scheduled" | "inactive">("published");
  const [publishDate, setPublishDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const addTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  }, [tagInput, tags]);

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleCreateCategory = useCallback(() => {
    if (!newCategoryName.trim()) return;
    const value = newCategoryName.toLowerCase().replace(/\s+/g, "-");
    if (!categories.find((c) => c.value === value)) {
      setCategories((prev) => [...prev, { value, label: newCategoryName.trim() }]);
      setCategoryId(value);
    }
    setNewCategoryName("");
    setCreateCategoryOpen(false);
  }, [newCategoryName, categories]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCoverImage(URL.createObjectURL(file));
  };

  const triggerFileInput = () => {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    input?.click();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Top Bar */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <Link href="/dashboard/blog">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Update
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 space-y-1">
        <h1 className="text-3xl tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground text-sm">Update and refine your blog article</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-semibold text-xl"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Write a short summary of the article..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Content</Label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Start writing your article..."
                  className="min-h-[400px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing Details */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="flex gap-2">
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="icon" onClick={() => setCreateCategoryOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button type="button" size="icon" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="rounded-full hover:bg-muted-foreground/20"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              {coverImage ? (
                <div className="relative overflow-hidden rounded-lg">
                  <img src={coverImage} alt="Cover" className="h-auto w-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => setCoverImage("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:bg-muted/50"
                  onClick={triggerFileInput}
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Upload cover image</p>
                    <p className="text-muted-foreground text-xs">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}
              <Input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </CardContent>
          </Card>

          {/* Status & Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Blog Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {status === "scheduled" && (
                <div className="space-y-2">
                  <Label>Publish Date</Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !publishDate && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {publishDate ? format(publishDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={publishDate}
                        onSelect={(date) => {
                          if (date) {
                            setPublishDate(date);
                            setCalendarOpen(false);
                          }
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Category Dialog */}
      <Dialog open={createCategoryOpen} onOpenChange={setCreateCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>Add a new category to organize your blog posts.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newCategory">Category Name</Label>
              <Input
                id="newCategory"
                placeholder="e.g., Technology"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
