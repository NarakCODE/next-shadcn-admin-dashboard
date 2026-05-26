"use client";

import {
  TrendingUp,
  TrendingDown,
  Eye,
  MessageSquare,
  Heart,
  Clock,
  Users,
  ArrowUpRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

const stats = [
  {
    title: "Total Views",
    value: "48,294",
    change: "+12.5%",
    trend: "up" as const,
    icon: Eye,
  },
  {
    title: "Total Comments",
    value: "1,429",
    change: "+8.2%",
    trend: "up" as const,
    icon: MessageSquare,
  },
  {
    title: "Total Likes",
    value: "3,847",
    change: "+15.3%",
    trend: "up" as const,
    icon: Heart,
  },
  {
    title: "Avg. Read Time",
    value: "4m 32s",
    change: "-2.1%",
    trend: "down" as const,
    icon: Clock,
  },
];

const topPosts = [
  {
    title: "Getting Started with Next.js 15",
    views: 12847,
    comments: 42,
    likes: 284,
    readTime: "8 min",
  },
  {
    title: "Building Scalable Design Systems",
    views: 9234,
    comments: 28,
    likes: 192,
    readTime: "6 min",
  },
  {
    title: "TypeScript 5.4: What's New",
    views: 7891,
    comments: 19,
    likes: 156,
    readTime: "5 min",
  },
  {
    title: "Mastering React Server Components",
    views: 6542,
    comments: 35,
    likes: 218,
    readTime: "10 min",
  },
  {
    title: "API Security Best Practices",
    views: 5123,
    comments: 24,
    likes: 145,
    readTime: "9 min",
  },
];

const trafficSources = [
  { source: "Direct", visitors: 18420, percentage: 38 },
  { source: "Organic Search", visitors: 14280, percentage: 30 },
  { source: "Social Media", visitors: 8560, percentage: 18 },
  { source: "Referral", visitors: 4280, percentage: 9 },
  { source: "Email", visitors: 2380, percentage: 5 },
];

const dailyViews = [
  { day: "Mon", views: 1240 },
  { day: "Tue", views: 1580 },
  { day: "Wed", views: 1890 },
  { day: "Thu", views: 1420 },
  { day: "Fri", views: 2100 },
  { day: "Sat", views: 980 },
  { day: "Sun", views: 760 },
];

const maxViews = Math.max(...dailyViews.map((d) => d.views));

export default function BlogAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Typography variant="h1">Analytics</Typography>
        <Typography variant="muted">
          Track your blog performance and engagement metrics
        </Typography>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-muted p-2">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <Badge
                  variant={stat.trend === "up" ? "default" : "destructive"}
                  className="gap-1"
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <Typography variant="large">{stat.value}</Typography>
                <Typography variant="muted">{stat.title}</Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Daily Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {dailyViews.map((day) => (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-40">
                    <div
                      className="w-full max-w-[40px] rounded-t bg-primary transition-all hover:bg-primary/80"
                      style={{
                        height: `${(day.views / maxViews) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-muted-foreground text-xs">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {trafficSources.map((source) => (
                <div key={source.source} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{source.source}</span>
                    <span className="text-muted-foreground text-sm">
                      {source.visitors.toLocaleString()} visitors
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {topPosts.map((post, index) => (
              <div
                key={post.title}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-sm">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm">{post.title}</p>
                  <div className="mt-1 flex items-center gap-4 text-muted-foreground text-xs">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {post.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audience Overview */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant="h2" className="text-3xl">24,891</Typography>
            <Typography variant="muted">Last 30 days</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Avg. Session Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant="h2" className="text-3xl">3m 45s</Typography>
            <Typography variant="muted">+12% from last month</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              Bounce Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant="h2" className="text-3xl">32.4%</Typography>
            <Typography variant="muted">-5% from last month</Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
