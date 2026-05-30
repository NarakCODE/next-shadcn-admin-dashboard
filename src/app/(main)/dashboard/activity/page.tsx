"use client";

import { useState } from "react";

import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  GitBranch,
  GitCommit,
  GitPullRequest,
  MessageSquare,
  Plus,
  Search,
  Upload,
  User,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ActivityType = "task" | "comment" | "project" | "commit" | "pull_request" | "deployment" | "user";
type ActivityView = "personal" | "team";

interface Activity {
  id: string;
  type: ActivityType;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  targetUrl?: string;
  timestamp: string;
  date: string;
  details?: string;
  metadata?: {
    branch?: string;
    commitHash?: string;
    status?: string;
  };
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "task",
    user: {
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    action: "completed task",
    target: "Update user authentication flow",
    targetUrl: "#",
    timestamp: "10 minutes ago",
    date: "Today",
    details: "Marked as complete after code review",
  },
  {
    id: "2",
    type: "comment",
    user: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    action: "commented on",
    target: "API endpoint optimization",
    targetUrl: "#",
    timestamp: "25 minutes ago",
    date: "Today",
    details: "Great work on reducing the response time by 40%!",
  },
  {
    id: "3",
    type: "commit",
    user: {
      name: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
    },
    action: "pushed commit to",
    target: "feature/dashboard-analytics",
    timestamp: "1 hour ago",
    date: "Today",
    metadata: {
      branch: "feature/dashboard-analytics",
      commitHash: "a1b2c3d",
    },
  },
  {
    id: "4",
    type: "pull_request",
    user: {
      name: "Alice Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    },
    action: "opened pull request",
    target: "Add dark mode support",
    targetUrl: "#",
    timestamp: "2 hours ago",
    date: "Today",
    metadata: {
      status: "open",
    },
  },
  {
    id: "5",
    type: "project",
    user: {
      name: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
    },
    action: "created project",
    target: "Mobile App Redesign",
    targetUrl: "#",
    timestamp: "3 hours ago",
    date: "Today",
  },
  {
    id: "6",
    type: "deployment",
    user: {
      name: "Bob Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    },
    action: "deployed to production",
    target: "v2.4.1",
    timestamp: "5 hours ago",
    date: "Today",
    metadata: {
      status: "success",
    },
  },
  {
    id: "7",
    type: "task",
    user: {
      name: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
    },
    action: "created task",
    target: "Implement search functionality",
    targetUrl: "#",
    timestamp: "Yesterday at 4:30 PM",
    date: "Yesterday",
  },
  {
    id: "8",
    type: "comment",
    user: {
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    action: "commented on",
    target: "Database schema update",
    targetUrl: "#",
    timestamp: "Yesterday at 2:15 PM",
    date: "Yesterday",
    details: "Looks good! Ready to merge.",
  },
  {
    id: "9",
    type: "user",
    user: {
      name: "Admin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
    action: "invited user",
    target: "mike@example.com",
    timestamp: "Yesterday at 10:00 AM",
    date: "Yesterday",
  },
  {
    id: "10",
    type: "pull_request",
    user: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    action: "merged pull request",
    target: "Fix authentication bug",
    targetUrl: "#",
    timestamp: "2 days ago",
    date: "Dec 18, 2024",
    metadata: {
      status: "merged",
    },
  },
];

export default function ActivityTimelinePage() {
  const [activities] = useState<Activity[]>(mockActivities);
  const [activeView, setActiveView] = useState<ActivityView>("personal");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const filteredActivities = activities.filter((activity) => {
    // View filter
    if (activeView === "personal" && activity.user.name !== "You") return false;

    // Type filter
    if (typeFilter !== "all" && activity.type !== typeFilter) return false;

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const activityDate = new Date(activity.timestamp);
      const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dateFilter === "today" && daysDiff > 0) return false;
      if (dateFilter === "week" && daysDiff > 7) return false;
      if (dateFilter === "month" && daysDiff > 30) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        activity.action.toLowerCase().includes(query) ||
        activity.target.toLowerCase().includes(query) ||
        activity.user.name.toLowerCase().includes(query) ||
        activity.details?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce(
    (groups, activity) => {
      const date = activity.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
      return groups;
    },
    {} as Record<string, Activity[]>,
  );

  const getTypeIcon = (type: ActivityType) => {
    switch (type) {
      case "task":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "project":
        return <Plus className="h-4 w-4 text-purple-500" />;
      case "commit":
        return <GitCommit className="h-4 w-4 text-orange-500" />;
      case "pull_request":
        return <GitPullRequest className="h-4 w-4 text-pink-500" />;
      case "deployment":
        return <Upload className="h-4 w-4 text-indigo-500" />;
      case "user":
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: ActivityType) => {
    switch (type) {
      case "task":
        return "border-green-500";
      case "comment":
        return "border-blue-500";
      case "project":
        return "border-purple-500";
      case "commit":
        return "border-orange-500";
      case "pull_request":
        return "border-pink-500";
      case "deployment":
        return "border-indigo-500";
      case "user":
        return "border-gray-500";
    }
  };

  // Calculate statistics
  const stats = {
    total: activities.length,
    today: activities.filter((a) => a.date === "Today").length,
    thisWeek: activities.filter((a) => {
      const now = new Date();
      const activityDate = new Date(a.timestamp);
      const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    }).length,
    byType: activities.reduce(
      (acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Activity Timeline</h1>
          <p className="text-muted-foreground">Track your activity and team collaboration</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Activity
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[300px] pl-9"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="task">Tasks</SelectItem>
                      <SelectItem value="comment">Comments</SelectItem>
                      <SelectItem value="project">Projects</SelectItem>
                      <SelectItem value="commit">Commits</SelectItem>
                      <SelectItem value="pull_request">Pull Requests</SelectItem>
                      <SelectItem value="deployment">Deployments</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeView} onValueChange={(v) => setActiveView(v as ActivityView)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="personal">
                    <User className="mr-2 h-4 w-4" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="team">
                    <Users className="mr-2 h-4 w-4" />
                    Team
                    <Badge variant="secondary" className="ml-2">
                      Pro
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeView} className="mt-4">
                  <ScrollArea className="h-[700px]">
                    <div className="space-y-6">
                      {Object.keys(groupedActivities).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Clock className="h-12 w-12 text-muted-foreground" />
                          <p className="mt-4 font-medium text-lg">No activities found</p>
                          <p className="text-muted-foreground text-sm">
                            {searchQuery || typeFilter !== "all" || dateFilter !== "all"
                              ? "No activities match your filters"
                              : "Your activities will appear here"}
                          </p>
                        </div>
                      ) : (
                        Object.entries(groupedActivities).map(([date, dateActivities]) => (
                          <div key={date} className="space-y-4">
                            <div className="sticky top-0 z-10 flex items-center gap-2 bg-background py-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <h3 className="font-semibold">{date}</h3>
                              <Badge variant="secondary">{dateActivities.length}</Badge>
                            </div>
                            <div className="relative space-y-4 pl-6">
                              <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-border" />
                              {dateActivities.map((activity) => (
                                <div key={activity.id} className="relative">
                                  <div
                                    className={`absolute top-2 -left-6 h-4 w-4 rounded-full border-2 border-background bg-background ${getTypeColor(
                                      activity.type,
                                    )}`}
                                  >
                                    <div className="flex h-full w-full items-center justify-center">
                                      {getTypeIcon(activity.type)}
                                    </div>
                                  </div>
                                  <Card className="ml-2">
                                    <CardContent className="p-4">
                                      <div className="flex items-start gap-3">
                                        <img
                                          src={activity.user.avatar}
                                          alt={activity.user.name}
                                          className="h-8 w-8 rounded-full"
                                        />
                                        <div className="flex-1 space-y-1">
                                          <div className="flex items-start justify-between">
                                            <div>
                                              <p className="text-sm">
                                                <span className="font-medium">{activity.user.name}</span>{" "}
                                                {activity.action}{" "}
                                                <a
                                                  href={activity.targetUrl || "#"}
                                                  className="font-medium text-primary hover:underline"
                                                >
                                                  {activity.target}
                                                </a>
                                              </p>
                                              {activity.details && (
                                                <p className="mt-1 text-muted-foreground text-sm">{activity.details}</p>
                                              )}
                                              {activity.metadata && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                  {activity.metadata.branch && (
                                                    <Badge variant="outline" className="text-xs">
                                                      <GitBranch className="mr-1 h-3 w-3" />
                                                      {activity.metadata.branch}
                                                    </Badge>
                                                  )}
                                                  {activity.metadata.commitHash && (
                                                    <Badge variant="outline" className="font-mono text-xs">
                                                      {activity.metadata.commitHash}
                                                    </Badge>
                                                  )}
                                                  {activity.metadata.status && (
                                                    <Badge
                                                      variant={
                                                        activity.metadata.status === "success" ||
                                                        activity.metadata.status === "merged"
                                                          ? "default"
                                                          : "secondary"
                                                      }
                                                      className="text-xs"
                                                    >
                                                      {activity.metadata.status}
                                                    </Badge>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                            <span className="text-muted-foreground text-xs">{activity.timestamp}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Statistics</CardTitle>
              <CardDescription>Your activity overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-2xl">{stats.total}</p>
                  <p className="text-muted-foreground text-xs">Total activities</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-2xl">{stats.today}</p>
                  <p className="text-muted-foreground text-xs">Today</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-2xl">{stats.thisWeek}</p>
                  <p className="text-muted-foreground text-xs">This week</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-2xl">{stats.byType.task || 0}</p>
                  <p className="text-muted-foreground text-xs">Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Breakdown</CardTitle>
              <CardDescription>By activity type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(type as ActivityType)}
                    <span className="text-sm capitalize">{type.replace("_", " ")}</span>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Filters</CardTitle>
              <CardDescription>Common activity filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setTypeFilter("task");
                  setDateFilter("today");
                }}
              >
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                Today's tasks
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setTypeFilter("pull_request");
                  setDateFilter("week");
                }}
              >
                <GitPullRequest className="mr-2 h-4 w-4 text-pink-500" />
                This week's PRs
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setTypeFilter("comment");
                  setDateFilter("all");
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4 text-blue-500" />
                All comments
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setTypeFilter("deployment");
                  setDateFilter("month");
                }}
              >
                <Upload className="mr-2 h-4 w-4 text-indigo-500" />
                Recent deployments
              </Button>
            </CardContent>
          </Card>

          {activeView === "team" && (
            <Card>
              <CardHeader>
                <CardTitle>Team Activity</CardTitle>
                <CardDescription>Most active team members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Sarah Johnson", count: 24, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" },
                  { name: "John Doe", count: 18, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john" },
                  { name: "Alice Chen", count: 15, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice" },
                  { name: "Bob Smith", count: 12, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob" },
                ].map((member) => (
                  <div key={member.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={member.avatar} alt={member.name} className="h-8 w-8 rounded-full" />
                      <span className="font-medium text-sm">{member.name}</span>
                    </div>
                    <Badge variant="secondary">{member.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
