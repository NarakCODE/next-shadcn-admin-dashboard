"use client";

import { useState } from "react";

import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Filter,
  Mail,
  MessageSquare,
  MoreVertical,
  Search,
  Settings,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type NotificationType = "info" | "success" | "warning" | "error" | "mention" | "comment";
type NotificationCategory = "all" | "unread" | "mentions" | "comments" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: "mention" | "comment" | "system" | "update";
  avatar?: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "mention",
    title: "John Doe mentioned you",
    message: "Hey @you, can you review this pull request when you get a chance?",
    timestamp: "2 minutes ago",
    read: false,
    category: "mention",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    actionUrl: "#",
  },
  {
    id: "2",
    type: "comment",
    title: "New comment on your task",
    message: "Sarah left a comment on 'Update user authentication flow'",
    timestamp: "15 minutes ago",
    read: false,
    category: "comment",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    actionUrl: "#",
  },
  {
    id: "3",
    type: "success",
    title: "Deployment successful",
    message: "Your application has been successfully deployed to production",
    timestamp: "1 hour ago",
    read: true,
    category: "system",
    actionUrl: "#",
  },
  {
    id: "4",
    type: "warning",
    title: "Storage limit approaching",
    message: "You've used 85% of your storage quota. Consider upgrading your plan.",
    timestamp: "2 hours ago",
    read: true,
    category: "system",
    actionUrl: "#",
  },
  {
    id: "5",
    type: "info",
    title: "New feature available",
    message: "Check out our new analytics dashboard with advanced insights",
    timestamp: "5 hours ago",
    read: true,
    category: "update",
    actionUrl: "#",
  },
  {
    id: "6",
    type: "mention",
    title: "Alice mentioned you in a comment",
    message: "Great work on the new design @you! The team loves it.",
    timestamp: "1 day ago",
    read: true,
    category: "mention",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    actionUrl: "#",
  },
  {
    id: "7",
    type: "error",
    title: "Build failed",
    message: "The build for branch 'feature/auth' failed. Check the logs for details.",
    timestamp: "1 day ago",
    read: true,
    category: "system",
    actionUrl: "#",
  },
  {
    id: "8",
    type: "comment",
    title: "Bob replied to your comment",
    message: "Thanks for the feedback! I've updated the code accordingly.",
    timestamp: "2 days ago",
    read: true,
    category: "comment",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    actionUrl: "#",
  },
];

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  const filteredNotifications = notifications.filter((notification) => {
    // Category filter
    if (activeCategory === "unread" && notification.read) return false;
    if (activeCategory === "mentions" && notification.category !== "mention") return false;
    if (activeCategory === "comments" && notification.category !== "comment") return false;
    if (activeCategory === "system" && notification.category !== "system") return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return notification.title.toLowerCase().includes(query) || notification.message.toLowerCase().includes(query);
    }

    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedNotifications((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selectedNotifications.has(n.id)));
    setSelectedNotifications(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedNotifications((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const allIds = filteredNotifications.map((n) => n.id);
    setSelectedNotifications(new Set(allIds));
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "mention":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "success":
        return <Check className="h-4 w-4 text-green-500" />;
      case "warning":
        return <Bell className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <Bell className="h-4 w-4 text-red-500" />;
      case "info":
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeBadgeVariant = (type: NotificationType) => {
    switch (type) {
      case "mention":
        return "default";
      case "comment":
        return "secondary";
      case "success":
        return "default";
      case "warning":
        return "secondary";
      case "error":
        return "destructive";
      case "info":
        return "outline";
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
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
                      placeholder="Search notifications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[300px] pl-9"
                    />
                  </div>
                  {selectedNotifications.size > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedNotifications.size} selected</Badge>
                      <Button variant="ghost" size="sm" onClick={deleteSelected}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={selectAll}>Select all</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedNotifications(new Set())}>
                      Clear selection
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={markAllAsRead}>Mark all as read</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as NotificationCategory)}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">
                    All
                    {notifications.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {notifications.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="unread">
                    Unread
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="mentions">Mentions</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                <TabsContent value={activeCategory} className="mt-4">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-2">
                      {filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Bell className="h-12 w-12 text-muted-foreground" />
                          <p className="mt-4 font-medium text-lg">No notifications</p>
                          <p className="text-muted-foreground text-sm">
                            {searchQuery ? "No notifications match your search" : "You're all caught up!"}
                          </p>
                        </div>
                      ) : (
                        filteredNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                              !notification.read ? "bg-muted/50" : ""
                            }`}
                          >
                            <Checkbox
                              checked={selectedNotifications.has(notification.id)}
                              onCheckedChange={() => toggleSelect(notification.id)}
                              className="mt-1"
                            />
                            <div className="flex-shrink-0">
                              {notification.avatar ? (
                                <img src={notification.avatar} alt="" className="h-10 w-10 rounded-full" />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                  {getTypeIcon(notification.type)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium leading-none">{notification.title}</p>
                                    {!notification.read && (
                                      <Badge variant={getTypeBadgeVariant(notification.type)} className="text-xs">
                                        New
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-muted-foreground text-sm">{notification.message}</p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {!notification.read && (
                                      <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                        <Check className="mr-2 h-4 w-4" />
                                        Mark as read
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                <Clock className="h-3 w-3" />
                                <span>{notification.timestamp}</span>
                              </div>
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
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notif" className="text-sm">
                    Email notifications
                  </Label>
                  <Switch id="email-notif" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notif" className="text-sm">
                    Push notifications
                  </Label>
                  <Switch id="push-notif" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="desktop-notif" className="text-sm">
                    Desktop notifications
                  </Label>
                  <Switch id="desktop-notif" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
              <CardDescription>Choose which notifications to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <Label htmlFor="mentions" className="text-sm">
                      Mentions
                    </Label>
                  </div>
                  <Switch id="mentions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-500" />
                    <Label htmlFor="comments" className="text-sm">
                      Comments
                    </Label>
                  </div>
                  <Switch id="comments" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-green-500" />
                    <Label htmlFor="updates" className="text-sm">
                      System updates
                    </Label>
                  </div>
                  <Switch id="updates" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-yellow-500" />
                    <Label htmlFor="marketing" className="text-sm">
                      Marketing
                    </Label>
                  </div>
                  <Switch id="marketing" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Digest</CardTitle>
              <CardDescription>Receive a summary of notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="digest-frequency">Frequency</Label>
                <select
                  id="digest-frequency"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue="daily"
                >
                  <option value="never">Never</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="digest-time">Time</Label>
                <Input id="digest-time" type="time" defaultValue="09:00" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
