"use client";

import { useState } from "react";

import { Save, Globe, Bell, Shield, Palette, Rss } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";

export default function BlogSettingsPage() {
  const [settings, setSettings] = useState({
    blogName: "My Tech Blog",
    blogDescription: "A blog about software development, design, and technology",
    blogUrl: "https://myblog.com",
    postsPerPage: 10,
    enableComments: true,
    moderateComments: true,
    enableNotifications: true,
    notifyOnComment: true,
    notifyOnNewPost: false,
    enableRss: true,
    enableSearch: true,
    enableDarkMode: true,
    accentColor: "#3b82f6",
    fontFamily: "sans-serif",
    seoTitle: "My Tech Blog - Software Development & Design",
    seoDescription: "Explore the latest in software development, design systems, and web technologies.",
    seoKeywords: "software, development, design, web, technology",
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1">Settings</Typography>
          <Typography variant="muted">
            Configure your blog preferences and options
          </Typography>
        </div>
        <Button data-icon="inline-start">
          <Save />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general" data-icon="inline-start">
            <Globe />
            General
          </TabsTrigger>
          <TabsTrigger value="comments" data-icon="inline-start">
            <Bell />
            Comments
          </TabsTrigger>
          <TabsTrigger value="appearance" data-icon="inline-start">
            <Palette />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="seo" data-icon="inline-start">
            <Shield />
            SEO
          </TabsTrigger>
          <TabsTrigger value="integrations" data-icon="inline-start">
            <Rss />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic blog configuration and information
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="blogName">Blog Name</Label>
                <Input
                  id="blogName"
                  value={settings.blogName}
                  onChange={(e) =>
                    setSettings({ ...settings, blogName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="blogDescription">Description</Label>
                <Textarea
                  id="blogDescription"
                  value={settings.blogDescription}
                  onChange={(e) =>
                    setSettings({ ...settings, blogDescription: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="blogUrl">Blog URL</Label>
                <Input
                  id="blogUrl"
                  type="url"
                  value={settings.blogUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, blogUrl: e.target.value })
                  }
                />
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <Label htmlFor="postsPerPage">Posts Per Page</Label>
                <Input
                  id="postsPerPage"
                  type="number"
                  value={settings.postsPerPage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      postsPerPage: parseInt(e.target.value, 10),
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Comment Settings</CardTitle>
              <CardDescription>
                Configure how comments are handled on your blog
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="enableComments">Enable Comments</Label>
                  <p className="text-muted-foreground text-sm">
                    Allow readers to leave comments on posts
                  </p>
                </div>
                <Switch
                  id="enableComments"
                  checked={settings.enableComments}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableComments: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="moderateComments">Moderate Comments</Label>
                  <p className="text-muted-foreground text-sm">
                    Require approval before comments are published
                  </p>
                </div>
                <Switch
                  id="moderateComments"
                  checked={settings.moderateComments}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, moderateComments: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="notifyOnComment">Notify on New Comment</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive notifications when new comments are submitted
                  </p>
                </div>
                <Switch
                  id="notifyOnComment"
                  checked={settings.notifyOnComment}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notifyOnComment: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your blog
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="enableDarkMode">Dark Mode</Label>
                  <p className="text-muted-foreground text-sm">
                    Enable dark mode theme for readers
                  </p>
                </div>
                <Switch
                  id="enableDarkMode"
                  checked={settings.enableDarkMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableDarkMode: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="accentColor"
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) =>
                      setSettings({ ...settings, accentColor: e.target.value })
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    value={settings.accentColor}
                    onChange={(e) =>
                      setSettings({ ...settings, accentColor: e.target.value })
                    }
                    className="font-mono"
                  />
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Input
                  id="fontFamily"
                  value={settings.fontFamily}
                  onChange={(e) =>
                    setSettings({ ...settings, fontFamily: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your blog for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={settings.seoTitle}
                  onChange={(e) =>
                    setSettings({ ...settings, seoTitle: e.target.value })
                  }
                />
                <p className="text-muted-foreground text-xs">
                  {settings.seoTitle.length}/60 characters
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  value={settings.seoDescription}
                  onChange={(e) =>
                    setSettings({ ...settings, seoDescription: e.target.value })
                  }
                />
                <p className="text-muted-foreground text-xs">
                  {settings.seoDescription.length}/160 characters
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="seoKeywords">Keywords</Label>
                <Input
                  id="seoKeywords"
                  value={settings.seoKeywords}
                  onChange={(e) =>
                    setSettings({ ...settings, seoKeywords: e.target.value })
                  }
                  placeholder="Separate keywords with commas"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect your blog with external services
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="enableRss">RSS Feed</Label>
                  <p className="text-muted-foreground text-sm">
                    Enable RSS feed for your blog posts
                  </p>
                </div>
                <Switch
                  id="enableRss"
                  checked={settings.enableRss}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableRss: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="enableSearch">Search Functionality</Label>
                  <p className="text-muted-foreground text-sm">
                    Enable search for blog posts and content
                  </p>
                </div>
                <Switch
                  id="enableSearch"
                  checked={settings.enableSearch}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableSearch: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="enableNotifications">Push Notifications</Label>
                  <p className="text-muted-foreground text-sm">
                    Enable browser push notifications for new posts
                  </p>
                </div>
                <Switch
                  id="enableNotifications"
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableNotifications: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="notifyOnNewPost">Notify on New Post</Label>
                  <p className="text-muted-foreground text-sm">
                    Send notifications to subscribers when new posts are published
                  </p>
                </div>
                <Switch
                  id="notifyOnNewPost"
                  checked={settings.notifyOnNewPost}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notifyOnNewPost: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
