"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { formatDate } from "date-fns";
import { ArrowRight, CalendarDays, Dot, Filter, Grid, List, MessageSquare, Search, Tag, User, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: string;
  comments: number;
  featured: boolean;
};

const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "Getting Started with Next.js 15: A Complete Guide",
    excerpt:
      "Learn everything about Next.js 15's new features including partial prerendering, server actions, and the new caching model.",
    content: "",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&dpr=2&q=80",
    category: "Development",
    tags: ["Next.js", "React", "Web Development"],
    author: "Alex Johnson",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&dpr=2&q=80",
    publishedAt: "2024-12-15",
    readTime: "8 min read",
    comments: 24,
    featured: true,
  },
  {
    id: "post-2",
    title: "Building Scalable Design Systems with Tailwind CSS",
    excerpt:
      "Discover best practices for creating maintainable design systems using Tailwind CSS utility classes and component patterns.",
    content: "",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&dpr=2&q=80",
    category: "Design",
    tags: ["Tailwind CSS", "Design Systems", "UI/UX"],
    author: "Sarah Chen",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&dpr=2&q=80",
    publishedAt: "2024-12-10",
    readTime: "6 min read",
    comments: 18,
    featured: true,
  },
  {
    id: "post-3",
    title: "TypeScript 5.4: What's New and Improved",
    excerpt:
      "Explore the latest TypeScript release with improved type inference, better error messages, and new utility types.",
    content: "",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&dpr=2&q=80",
    category: "Development",
    tags: ["TypeScript", "JavaScript"],
    author: "Mike Peters",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&dpr=2&q=80",
    publishedAt: "2024-12-05",
    readTime: "5 min read",
    comments: 12,
    featured: false,
  },
  {
    id: "post-4",
    title: "Mastering React Server Components",
    excerpt: "Deep dive into React Server Components and learn how to optimize your application performance.",
    content: "",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&dpr=2&q=80",
    category: "Development",
    tags: ["React", "Server Components", "Performance"],
    author: "Emily Davis",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&dpr=2&q=80",
    publishedAt: "2024-11-28",
    readTime: "10 min read",
    comments: 32,
    featured: false,
  },
  {
    id: "post-5",
    title: "The Future of Web Animation: CSS vs JavaScript",
    excerpt: "Compare modern CSS animations with JavaScript libraries and learn when to use each approach.",
    content: "",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&dpr=2&q=80",
    category: "Design",
    tags: ["Animation", "CSS", "JavaScript"],
    author: "David Kim",
    authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&dpr=2&q=80",
    publishedAt: "2024-11-20",
    readTime: "7 min read",
    comments: 15,
    featured: false,
  },
  {
    id: "post-6",
    title: "API Security Best Practices for Modern Web Apps",
    excerpt: "Essential security patterns and practices to protect your APIs from common vulnerabilities.",
    content: "",
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&h=400&dpr=2&q=80",
    category: "Security",
    tags: ["API", "Security", "Backend"],
    author: "Lisa Wang",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&dpr=2&q=80",
    publishedAt: "2024-11-15",
    readTime: "9 min read",
    comments: 28,
    featured: false,
  },
  {
    id: "post-7",
    title: "Optimizing Database Queries for High-Traffic Applications",
    excerpt: "Learn advanced query optimization techniques to handle millions of requests efficiently.",
    content: "",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=400&dpr=2&q=80",
    category: "Backend",
    tags: ["Database", "Performance", "SQL"],
    author: "Tom Wilson",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&dpr=2&q=80",
    publishedAt: "2024-11-10",
    readTime: "12 min read",
    comments: 21,
    featured: false,
  },
  {
    id: "post-8",
    title: "Introduction to Edge Computing with Cloudflare Workers",
    excerpt: "Deploy your code closer to users with edge computing and reduce latency dramatically.",
    content: "",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&dpr=2&q=80",
    category: "Infrastructure",
    tags: ["Edge Computing", "Cloudflare", "Serverless"],
    author: "Rachel Green",
    authorAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&dpr=2&q=80",
    publishedAt: "2024-11-05",
    readTime: "6 min read",
    comments: 9,
    featured: false,
  },
  {
    id: "post-9",
    title: "Building Accessible Web Applications from Scratch",
    excerpt: "A comprehensive guide to WCAG compliance and creating inclusive user experiences.",
    content: "",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&dpr=2&q=80",
    category: "Accessibility",
    tags: ["A11y", "WCAG", "Inclusive Design"],
    author: "James Brown",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&dpr=2&q=80",
    publishedAt: "2024-10-28",
    readTime: "8 min read",
    comments: 16,
    featured: false,
  },
];

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = useMemo(() => {
    const cats = new Set(blogPosts.map((p) => p.category));
    return Array.from(cats);
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogPosts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    blogPosts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredPosts = useMemo(() => {
    return blogPosts
      .filter((post) => {
        const matchesSearch =
          search === "" ||
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
          post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = selectedCategory === "" || post.category === selectedCategory;
        const matchesTag = selectedTag === "" || post.tags.includes(selectedTag);

        return matchesSearch && matchesCategory && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        if (sortBy === "oldest") return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        if (sortBy === "popular") return b.comments - a.comments;
        if (sortBy === "read-time") return parseInt(a.readTime, 10) - parseInt(b.readTime, 10);
        return 0;
      });
  }, [search, selectedCategory, selectedTag, sortBy]);

  const _featuredPosts = useMemo(() => blogPosts.filter((p) => p.featured), []);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedTag("");
    setSortBy("newest");
  };

  const hasActiveFilters = search || selectedCategory || selectedTag;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground text-sm">
            Browse and discover articles about development, design, and technology
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filter Sidebar */}
        <aside className="w-full shrink-0 lg:w-64 xl:w-72">
          <Card>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold text-sm">
                  <Filter className="h-4 w-4" /> Filters
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="cursor-pointer text-muted-foreground text-xs underline hover:text-destructive"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <Separator />

              {/* Search */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-9 pl-8"
                  />
                </div>
              </div>

              <Separator />

              {/* Categories */}
              <div className="space-y-3">
                <span className="font-medium text-muted-foreground text-xs">Category</span>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                      selectedCategory === "" ? "bg-primary/10 font-medium text-primary" : "hover:bg-muted"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                        selectedCategory === cat ? "bg-primary/10 font-medium text-primary" : "hover:bg-muted"
                      }`}
                    >
                      <span>{cat}</span>
                      <Badge variant="secondary" className="text-xs">
                        {categoryCounts[cat]}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Tags */}
              <div className="space-y-3">
                <span className="font-medium text-muted-foreground text-xs">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "secondary"}
                      className="cursor-pointer text-xs hover:opacity-80"
                      onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Blog Posts */}
        <section className="min-w-0 flex-1 space-y-4">
          {/* Toolbar */}
          <Card className="p-2">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-0">
              <span className="text-muted-foreground text-sm">
                Showing <span className="font-semibold text-foreground">{filteredPosts.length}</span> articles
              </span>

              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 w-40">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="read-time">Shortest Read</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex rounded-md border p-0.5">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("")}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedTag && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  {selectedTag}
                  <button onClick={() => setSelectedTag("")} className="ml-1 rounded-full hover:bg-muted-foreground/20">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {search && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  Search: {search}
                  <button onClick={() => setSearch("")} className="ml-1 rounded-full hover:bg-muted-foreground/20">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Posts Grid/List */}
          <ScrollArea className="h-[800px] rounded-md border p-4">
            {filteredPosts.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-12 text-center">
                <MessageSquare className="mb-3 h-12 w-12 text-muted-foreground/30" />
                <h3 className="mb-1 font-medium text-lg">No articles match your filters</h3>
                <p className="mb-4 max-w-sm text-muted-foreground text-sm">
                  Try loosening your filters or clearing your search terms.
                </p>
                <Button onClick={clearFilters} variant="secondary" size="sm">
                  Reset Filters
                </Button>
              </Card>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredPosts.map((post) => (
                  <Link key={post.id} href={`/dashboard/blog/${post.id}`}>
                    <div className="overflow-hidden rounded-xl bg-muted p-2 pb-4">
                      <div className="relative isolate">
                        <img
                          alt={post.title}
                          className="aspect-[14/9] rounded-lg bg-muted object-cover"
                          src={post.image}
                        />
                        <img
                          alt={post.title}
                          className="absolute inset-0 -z-10 aspect-[17/9] scale-y-110 rounded bg-muted blur-2xl"
                          src={post.image}
                        />
                      </div>
                      <div className="px-2 py-1">
                        <div className="-ms-0.5 mt-4 flex flex-wrap items-center gap-2">
                          {post.tags.map((tag) => (
                            <Badge
                              className="bg-indigo-600/10 text-indigo-500 dark:bg-indigo-500/35 dark:text-indigo-300"
                              key={tag}
                              variant="secondary"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="mt-4 font-medium text-xl tracking-[-0.015em]">{post.title}</h3>
                        <div className="mt-3 flex items-center gap-1">
                          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <CalendarDays className="h-4 w-4" />{" "}
                            {formatDate(new Date(post.publishedAt), "MMM dd, yyyy")}
                          </div>
                          <Dot className="text-muted-foreground" />
                          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <User className="h-4 w-4" /> {post.author}
                          </div>
                        </div>

                        <Button className="mt-6">
                          Read Article <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <Link key={post.id} href={`/dashboard/blog/${post.id}`}>
                    <div className="overflow-hidden rounded-xl bg-muted p-2 pb-4">
                      <div className="relative isolate">
                        <img alt={post.title} className="aspect-[14/9] rounded-lg bg-muted" src={post.image} />
                        <img
                          alt={post.title}
                          className="absolute inset-0 -z-10 aspect-[17/9] scale-y-110 rounded bg-muted blur-2xl"
                          src={post.image}
                        />
                      </div>
                      <div className="px-2 py-1">
                        <div className="-ms-0.5 mt-4 flex flex-wrap items-center gap-2">
                          {post.tags.map((tag) => (
                            <Badge
                              className="bg-indigo-600/10 text-indigo-500 dark:bg-indigo-500/35 dark:text-indigo-300"
                              key={tag}
                              variant="secondary"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="mt-4 font-medium text-xl tracking-[-0.015em]">{post.title}</h3>
                        <div className="mt-3 flex items-center gap-1">
                          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <CalendarDays className="h-4 w-4" />{" "}
                            {formatDate(new Date(post.publishedAt), "MMM dd, yyyy")}
                          </div>
                          <Dot className="text-muted-foreground" />
                          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <User className="h-4 w-4" /> {post.author}
                          </div>
                        </div>

                        <Button className="mt-6">
                          Read Article <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </ScrollArea>
        </section>
      </div>
    </div>
  );
}
