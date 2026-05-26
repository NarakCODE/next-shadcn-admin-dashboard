"use client";

import { useState } from "react";

import Link from "next/link";

import { format } from "date-fns";
import {
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  status: "published" | "draft";
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
];

export default function ManageBlogPage() {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
      <div>
        <Typography variant="h1">Manage Blog Posts</Typography>
        <Typography variant="muted">
          Create, edit, and manage all your blog posts
        </Typography>
      </div>
        <Button className="gap-2" asChild>
          <Link href="/dashboard/blog/create">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Posts</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-[300px] font-medium">
                    {post.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{post.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {post.author}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        post.status === "published" ? "default" : "secondary"
                      }
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(post.publishedAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {post.views.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {post.comments}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard/blog/detail"
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/dashboard/blog/edit"
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
}
