"use client";

import { useState } from "react";

import { format } from "date-fns";
import {
  Search,
  Check,
  X,
  Trash2,
  MoreHorizontal,
  MessageSquare,
  Flag,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Typography } from "@/components/ui/typography";

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
    content: "The server actions section was incredibly detailed. One thing I'd add is that you should be careful with caching.",
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
];

export default function BlogCommentsPage() {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.author.toLowerCase().includes(search.toLowerCase()) ||
      comment.content.toLowerCase().includes(search.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && comment.status === activeTab;
  });

  const handleApprove = (id: string) => {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, status: "approved" as const } : c)),
    );
  };

  const handleReject = (id: string) => {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, status: "rejected" as const } : c)),
    );
  };

  const handleDelete = (id: string) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const statusCounts = {
    all: comments.length,
    pending: comments.filter((c) => c.status === "pending").length,
    approved: comments.filter((c) => c.status === "approved").length,
    rejected: comments.filter((c) => c.status === "rejected").length,
    reported: comments.filter((c) => c.status === "reported").length,
  };

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Typography variant="h1">Comments</Typography>
        <Typography variant="muted">
          Moderate and manage blog post comments
        </Typography>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>
              All Comments ({statusCounts.all})
            </CardTitle>
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
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">
                All ({statusCounts.all})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({statusCounts.pending})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({statusCounts.approved})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({statusCounts.rejected})
              </TabsTrigger>
              <TabsTrigger value="reported">
                Reported ({statusCounts.reported})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col gap-4">
            {filteredComments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="flex gap-3">
                  <Avatar size="default">
                    <AvatarImage src={comment.authorAvatar} />
                    <AvatarFallback>
                      {comment.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">
                        {comment.author}
                      </span>
                      <Badge variant={statusBadgeVariant(comment.status)}>
                        {comment.status}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {format(new Date(comment.publishedAt), "MMM dd, yyyy HH:mm")}
                      </span>
                    </div>
                    <p className="mb-2 text-muted-foreground text-sm">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4 text-muted-foreground text-xs">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        on "{comment.postTitle}"
                      </span>
                      <span>{comment.email}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {comment.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1 text-xs"
                            onClick={() => handleApprove(comment.id)}
                            data-icon="inline-start"
                          >
                            <Check />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1 text-xs"
                            onClick={() => handleReject(comment.id)}
                            data-icon="inline-start"
                          >
                            <X />
                            Reject
                          </Button>
                        </>
                      )}
                      {comment.status === "reported" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 text-xs"
                          onClick={() => handleApprove(comment.id)}
                          data-icon="inline-start"
                        >
                          <Check />
                          Dismiss Report
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(comment.id)}
                            data-icon="inline-start"
                          >
                            <Trash2 />
                            Delete
                          </DropdownMenuItem>
                          {comment.status !== "reported" && (
                            <DropdownMenuItem data-icon="inline-start">
                              <Flag />
                              Report
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
