"use client";

import { useState } from "react";

import Link from "next/link";

import { format } from "date-fns";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  Clock,
  Heart,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";

type Comment = {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  publishedAt: string;
  likes: number;
  replies?: Comment[];
};

const sampleComments: Comment[] = [
  {
    id: "comment-1",
    author: "Sarah Chen",
    authorAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&dpr=2&q=80",
    content:
      "Great article! The explanation of partial prerendering was particularly helpful. I've been struggling with implementing it in my project, and this cleared up a lot of confusion.",
    publishedAt: "2024-12-16T10:30:00Z",
    likes: 12,
    replies: [
      {
        id: "reply-1",
        author: "Alex Johnson",
        authorAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&dpr=2&q=80",
        content:
          "Thanks Sarah! Glad it helped. Feel free to reach out if you have any specific questions about the implementation.",
        publishedAt: "2024-12-16T11:45:00Z",
        likes: 5,
      },
    ],
  },
  {
    id: "comment-2",
    author: "Mike Peters",
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&dpr=2&q=80",
    content:
      "The server actions section was incredibly detailed. One thing I'd add is that you should be careful with caching when using mutations - it can lead to stale data if not handled properly.",
    publishedAt: "2024-12-17T08:15:00Z",
    likes: 8,
  },
  {
    id: "comment-3",
    author: "Emily Davis",
    authorAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&dpr=2&q=80",
    content:
      "This is the most comprehensive guide I've found so far. Bookmarked for future reference!",
    publishedAt: "2024-12-18T14:20:00Z",
    likes: 15,
  },
];

export default function BlogDetailPage() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleSubmitComment = () => {
    if (!comment.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: "Current User",
      authorAvatar: "",
      content: comment,
      publishedAt: new Date().toISOString(),
      likes: 0,
    };

    setComments([newComment, ...comments]);
    setComment("");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" size="sm" className="mb-6 gap-2" asChild>
        <Link href="/dashboard/blog">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog Posts
        </Link>
      </Button>

      {/* Article Header */}
      <header className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-indigo-600/10 text-indigo-500 dark:bg-indigo-500/35 dark:text-indigo-300"
          >
            Development
          </Badge>
          <Badge variant="outline">Next.js</Badge>
          <Badge variant="outline">React</Badge>
        </div>

        <h1 className="mb-6 font-bold text-4xl leading-tight tracking-tight md:text-5xl">
          Getting Started with Next.js 15: A Complete Guide
        </h1>

        <p className="mb-6 text-muted-foreground text-xl leading-relaxed">
          Learn everything about Next.js 15's new features including partial
          prerendering, server actions, and the new caching model.
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar size="default">
              <AvatarImage
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&dpr=2&q=80"
                alt="Alex Johnson"
              />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">Alex Johnson</p>
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <CalendarDays className="h-3 w-3" />
                <span>Dec 15, 2024</span>
                <span>·</span>
                <Clock className="h-3 w-3" />
                <span>8 min read</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={liked ? "text-red-500" : ""}
              onClick={() => setLiked(!liked)}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={bookmarked ? "text-yellow-500" : ""}
              onClick={() => setBookmarked(!bookmarked)}
            >
              <Bookmark
                className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`}
              />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative mb-10 overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&dpr=2&q=80"
          alt="Next.js 15 Guide"
          className="h-auto w-full object-cover"
        />
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none dark:prose-invert">
        <Typography variant="h2">Introduction</Typography>
        <Typography>
          Next.js 15 brings a host of new features and improvements that make
          building modern web applications easier than ever. In this
          comprehensive guide, we'll explore everything you need to know to get
          started with the latest version.
        </Typography>

        <Typography variant="h2">Partial Prerendering (PPR)</Typography>
        <Typography>
          One of the most exciting features in Next.js 15 is Partial
          Prerendering. This allows you to combine static and dynamic rendering
          in a single route, giving you the best of both worlds:
        </Typography>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <strong>Instant loading</strong> - Static shell loads immediately
          </li>
          <li>
            <strong>Dynamic content</strong> - Suspense boundaries stream in
            dynamic data
          </li>
          <li>
            <strong>Better UX</strong> - Users see content faster while data
            loads
          </li>
        </ul>

        <pre className="rounded-lg bg-muted p-4 text-sm">
          <code>{`// app/page.tsx
export default async function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <DynamicComponent />
    </Suspense>
  );
}`}</code>
        </pre>

        <Typography variant="h2">Server Actions</Typography>
        <Typography>
          Server Actions have been significantly improved in Next.js 15. You can
          now use them with better type safety, improved error handling, and
          more predictable caching behavior.
        </Typography>

        <Typography variant="h3">Key Improvements</Typography>
        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
          <li>Enhanced type inference for action parameters</li>
          <li>Better error boundaries and error handling</li>
          <li>Improved caching with explicit revalidation</li>
          <li>Support for progressive enhancement</li>
        </ol>

        <Typography variant="h2">New Caching Model</Typography>
        <Typography>
          The caching model has been refined to be more predictable and easier
          to reason about. Key changes include:
        </Typography>
        <blockquote className="mt-6 border-l-2 pl-6 italic">
          <Typography>
            "With Next.js 15, we've made caching more explicit and predictable.
            You now have full control over what gets cached and when it gets
            revalidated." - Next.js Team
          </Typography>
        </blockquote>

        <Typography variant="h2">Getting Started</Typography>
        <Typography>
          To upgrade to Next.js 15, run the following command in your project:
        </Typography>
        <pre className="rounded-lg bg-muted p-4 text-sm">
          <code>{`npm install next@latest react@latest react-dom@latest`}</code>
        </pre>

        <Typography variant="h2">Conclusion</Typography>
        <Typography>
          Next.js 15 represents a significant step forward in building modern
          web applications. With Partial Prerendering, improved Server Actions,
          and a more predictable caching model, you have all the tools you need
          to create fast, dynamic, and user-friendly applications.
        </Typography>
      </article>

      {/* Article Footer */}
      <div className="mt-12">
        <Separator className="mb-8" />

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar size="default">
              <AvatarImage
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&dpr=2&q=80"
                alt="Alex Johnson"
              />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Alex Johnson</p>
              <p className="text-muted-foreground text-sm">
                Senior Developer & Technical Writer
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Follow
          </Button>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="outline"
            className={`gap-2 ${liked ? "border-red-500 text-red-500" : ""}`}
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            {liked ? "Liked" : "Like"} (42)
          </Button>
          <Button variant="outline" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Comments ({comments.length})
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      <section className="mt-12">
        <h2 className="mb-6 font-semibold text-2xl">
          Comments ({comments.length})
        </h2>

        {/* Comment Input */}
        <Card className="mb-8 p-4">
          <div className="flex gap-3">
            <Avatar size="default">
              <AvatarFallback>CU</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!comment.trim()}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id}>
              <Card className="p-4">
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
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {comment.author}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {format(new Date(comment.publishedAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <p className="mb-3 text-muted-foreground text-sm leading-relaxed">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        {comment.likes}
                      </button>
                      <button className="text-muted-foreground text-xs hover:text-foreground">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Replies */}
              {comment.replies && (
                <div className="ml-8 mt-4 space-y-4">
                  {comment.replies.map((reply) => (
                    <Card key={reply.id} className="p-4">
                      <div className="flex gap-3">
                        <Avatar size="default">
                          <AvatarImage src={reply.authorAvatar} />
                          <AvatarFallback>
                            {reply.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {reply.author}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {format(new Date(reply.publishedAt), "MMM dd, yyyy")}
                            </span>
                          </div>
                          <p className="mb-3 text-muted-foreground text-sm leading-relaxed">
                            {reply.content}
                          </p>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground">
                              <ThumbsUp className="h-3 w-3" />
                              {reply.likes}
                            </button>
                            <button className="text-muted-foreground text-xs hover:text-foreground">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
