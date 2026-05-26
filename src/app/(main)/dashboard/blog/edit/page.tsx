"use client";

import { useState } from "react";

import Link from "next/link";

import { ArrowLeft, Eye, ImagePlus, Save, Trash2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";

export default function BlogEditPage() {
  const [title, setTitle] = useState("Getting Started with Next.js 15: A Complete Guide");
  const [excerpt, setExcerpt] = useState(
    "Learn everything about Next.js 15's new features including partial prerendering, server actions, and the new caching model.",
  );
  const [content, setContent] = useState(`## Introduction

Next.js 15 brings a host of new features and improvements that make building modern web applications easier than ever.

## Partial Prerendering (PPR)

One of the most exciting features in Next.js 15 is Partial Prerendering.

## Server Actions

Server Actions have been significantly improved in Next.js 15.`);
  const [tags, setTags] = useState<string[]>(["Next.js", "React", "Web Development"]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState("Development");
  const [image, setImage] = useState(
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&dpr=2&q=80",
  );

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <Link href="/dashboard/blog">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog Posts
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

      <Typography variant="h1" className="mb-6">Edit Post</Typography>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
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
                  className="text-xl font-semibold"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Write a short summary..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="content">Content (Markdown)</Label>
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Development"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
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
                  <Button size="icon" onClick={addTag}>
                    <span className="sr-only">Add tag</span>+
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              {image ? (
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={image}
                    alt="Featured"
                    className="h-auto w-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => setImage("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 text-center">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Upload an image</p>
                    <p className="text-muted-foreground text-xs">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
