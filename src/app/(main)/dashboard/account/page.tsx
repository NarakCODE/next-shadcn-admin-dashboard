"use client";

import { useEffect, useRef, useState } from "react";

import {
  AlertCircle,
  Bell,
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Globe,
  Key,
  Laptop,
  Link2,
  LogOut,
  Mail,
  MapPin,
  Monitor,
  MoreHorizontal,
  Plus,
  Shield,
  ShieldCheck,
  Smartphone,
  Trash2,
  User,
  Zap,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getInitials } from "@/lib/utils";

const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "",
  username: "johndoe",
  bio: "Product designer and developer based in San Francisco. I love building beautiful interfaces and solving complex problems.",
  location: "San Francisco, CA",
  website: "https://johndoe.com",
  timezone: "America/Los_Angeles",
  language: "en",
  role: "Product Designer",
  joinedDate: "January 2023",
  coverImage: "",
};

const connectedAccounts = [
  { id: "google", name: "Google", connected: true, email: "john.doe@gmail.com", icon: "G", color: "bg-red-500" },
  { id: "github", name: "GitHub", connected: true, email: "johndoe@github.com", icon: "GH", color: "bg-gray-800" },
  { id: "twitter", name: "Twitter", connected: false, email: "", icon: "X", color: "bg-blue-500" },
  { id: "linkedin", name: "LinkedIn", connected: false, email: "", icon: "in", color: "bg-blue-700" },
];

const sessions = [
  {
    id: "1",
    device: "MacBook Pro",
    browser: "Chrome 120.0",
    os: "macOS Sonoma",
    location: "San Francisco, CA",
    ip: "192.168.1.1",
    lastActive: "Active now",
    current: true,
    icon: Laptop,
  },
  {
    id: "2",
    device: "iPhone 15 Pro",
    browser: "Safari 17.2",
    os: "iOS 17.2",
    location: "San Francisco, CA",
    ip: "192.168.1.2",
    lastActive: "2 hours ago",
    current: false,
    icon: Smartphone,
  },
  {
    id: "3",
    device: "iPad Air",
    browser: "Safari 17.1",
    os: "iPadOS 17.1",
    location: "San Francisco, CA",
    ip: "192.168.1.3",
    lastActive: "1 day ago",
    current: false,
    icon: Monitor,
  },
];

const navItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Mail },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "connected", label: "Connected Accounts", icon: Link2 },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const _sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && navItems.some((item) => item.id === hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleCopyToken = () => {
    navigator.clipboard.writeText("sk_live_mock_key_000000000000000000000000");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-3xl tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative flex flex-col items-center gap-4 p-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <div className="group relative">
              <Avatar className="h-24 w-24 shadow-lg ring-4 ring-background">
                <AvatarImage src={user.avatar || undefined} alt={user.name} />
                <AvatarFallback className="font-semibold text-2xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary shadow-sm transition-transform group-hover:scale-110">
                <Camera className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1">
                <span className="flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500 ring-2 ring-background" />
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:pb-1 sm:text-left">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-xl">{user.name}</h2>
                <Badge variant="primary-light" className="gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {user.role} • Joined {user.joinedDate}
              </p>
              <div className="mt-1 flex items-center gap-3 text-muted-foreground text-xs">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {user.location}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {user.website.replace("https://", "")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View Profile
            </Button>
            <Button size="sm">
              <Camera className="mr-2 h-4 w-4" />
              Edit Avatar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:sticky lg:top-20 lg:w-64 lg:shrink-0 lg:self-start">
          <Card>
            <CardContent className="p-2">
              <nav className="flex flex-col gap-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-sm transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {isActive && <ChevronRight className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
                <Separator className="my-2" />
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-destructive text-sm transition-all hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="flex-1 text-left">Sign Out</span>
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="min-w-0 flex-1">
          {activeTab === "profile" && (
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and public profile</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="firstName" className="font-medium text-sm">
                        First Name
                      </Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="lastName" className="font-medium text-sm">
                        Last Name
                      </Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="username" className="font-medium text-sm">
                      Username
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">@</span>
                      <Input id="username" defaultValue={user.username} className="flex-1" />
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Your unique identifier. This will be shown publicly.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="font-medium text-sm">
                      Email Address
                    </Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                    <div className="flex items-center gap-1.5 text-xs">
                      <Check className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">Email verified</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="bio" className="font-medium text-sm">
                      Bio
                    </Label>
                    <Textarea id="bio" rows={4} defaultValue={user.bio} placeholder="Tell us about yourself..." />
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-xs">Brief description for your profile.</p>
                      <p className="text-muted-foreground text-xs">{user.bio.length}/200</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <p className="text-muted-foreground text-xs">Last updated 2 days ago</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button size="sm">Save Changes</Button>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                  <CardDescription>Optional information to enhance your profile</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="website" className="font-medium text-sm">
                      Website
                    </Label>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Input id="website" defaultValue={user.website} placeholder="https://" className="flex-1" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="location" className="font-medium text-sm">
                      Location
                    </Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        defaultValue={user.location}
                        placeholder="City, Country"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button size="sm">Save Changes</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "account" && (
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Configure your account settings</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="language" className="font-medium text-sm">
                      Language
                    </Label>
                    <Select defaultValue={user.language}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="en">English (US)</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <p className="text-muted-foreground text-xs">Select your preferred language for the interface.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="timezone" className="font-medium text-sm">
                      Timezone
                    </Label>
                    <Select defaultValue={user.timezone}>
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <p className="text-muted-foreground text-xs">
                      Used for scheduling and displaying dates/times correctly.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button size="sm">Save Changes</Button>
                </CardFooter>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  </div>
                  <CardDescription>Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-sm">Delete Account</p>
                      <p className="text-muted-foreground text-xs">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" className="shrink-0">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "security" && (
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="currentPassword" className="font-medium text-sm">
                      Current Password
                    </Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="newPassword" className="font-medium text-sm">
                      New Password
                    </Label>
                    <Input id="newPassword" type="password" />
                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="flex gap-1">
                        <div className="h-1 flex-1 rounded-full bg-green-500" />
                        <div className="h-1 flex-1 rounded-full bg-green-500" />
                        <div className="h-1 flex-1 rounded-full bg-green-500" />
                        <div className="h-1 flex-1 rounded-full bg-muted" />
                      </div>
                      <p className="text-muted-foreground text-xs">Strong password</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="confirmPassword" className="font-medium text-sm">
                      Confirm New Password
                    </Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button size="sm">Update Password</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-sm">Authenticator App</p>
                        <p className="text-muted-foreground text-xs">
                          Use an authenticator app to generate one-time codes
                        </p>
                      </div>
                    </div>
                    <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                  </div>
                  {twoFactorEnabled && (
                    <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/20">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-green-800 text-sm dark:text-green-400">
                          Two-factor authentication is enabled
                        </p>
                        <p className="text-green-700 text-xs dark:text-green-500">
                          Your account is protected with an authenticator app. You&apos;ll need to enter a code from
                          your app when signing in.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Active Sessions</CardTitle>
                      <CardDescription>Manage your active sessions across devices</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      Sign Out All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {sessions.map((session) => {
                    const Icon = session.icon;
                    return (
                      <div
                        key={session.id}
                        className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                          session.current ? "border-primary/30 bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              session.current ? "bg-primary/10" : "bg-muted"
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${session.current ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{session.device}</p>
                              {session.current && (
                                <Badge variant="primary-light" className="text-[10px]">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-xs">
                              {session.browser} • {session.os}
                            </p>
                            <div className="flex items-center gap-2 text-muted-foreground text-xs">
                              <MapPin className="h-3 w-3" />
                              <span>{session.location}</span>
                              <span>•</span>
                              <span>{session.lastActive}</span>
                            </div>
                          </div>
                        </div>
                        {!session.current && (
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <LogOut className="mr-2 h-4 w-4" />
                            Revoke
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Choose what emails you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
                  <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="emailNotif" className="font-medium text-sm">
                        Email Notifications
                      </Label>
                      <p className="text-muted-foreground text-xs">Receive email notifications for important updates</p>
                    </div>
                    <Switch id="emailNotif" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="marketingEmails" className="font-medium text-sm">
                        Marketing Emails
                      </Label>
                      <p className="text-muted-foreground text-xs">Receive emails about new features and promotions</p>
                    </div>
                    <Switch id="marketingEmails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Push Notifications</CardTitle>
                  <CardDescription>Configure push notifications for your devices</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
                  <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="pushNotif" className="font-medium text-sm">
                        Push Notifications
                      </Label>
                      <p className="text-muted-foreground text-xs">Receive push notifications on your devices</p>
                    </div>
                    <Switch id="pushNotif" checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Fine-tune your notification settings</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
                  <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-medium text-sm">Security Alerts</p>
                      <p className="text-muted-foreground text-xs">Get notified about security-related events</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-medium text-sm">Product Updates</p>
                      <p className="text-muted-foreground text-xs">
                        Receive updates about new features and improvements
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-medium text-sm">Weekly Digest</p>
                      <p className="text-muted-foreground text-xs">Get a weekly summary of your activity</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Current Plan</CardTitle>
                      <CardDescription>You are currently on the Pro plan</CardDescription>
                    </div>
                    <Button size="sm">
                      <Zap className="mr-2 h-4 w-4" />
                      Upgrade
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="flex items-center justify-between rounded-lg border bg-gradient-to-r from-primary/5 to-primary/10 p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-lg">Pro Plan</p>
                        <Badge variant="primary-light">Active</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">$29/month • Renews on Jan 15, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage Plan
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex flex-col gap-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-muted-foreground text-xs">Storage</p>
                        <span className="text-muted-foreground text-xs">45.2/100 GB</span>
                      </div>
                      <Progress value={45.2} className="h-2" />
                      <p className="text-muted-foreground text-xs">54.8 GB remaining</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-muted-foreground text-xs">Team Members</p>
                        <span className="text-muted-foreground text-xs">8/10 seats</span>
                      </div>
                      <Progress value={80} className="h-2" />
                      <p className="text-muted-foreground text-xs">2 seats remaining</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-muted-foreground text-xs">Projects</p>
                        <span className="text-muted-foreground text-xs">12</span>
                      </div>
                      <Progress value={100} className="h-2" />
                      <p className="text-muted-foreground text-xs">Unlimited projects</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Payment Method</CardTitle>
                      <CardDescription>Manage your payment methods</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="font-medium text-sm">•••• •••• •••• 4242</p>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>Expires 12/2025</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Default</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>View and download your past invoices</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {[
                    { month: "December 2024", amount: "$29.00", date: "Dec 15, 2024", status: "Paid" },
                    { month: "November 2024", amount: "$29.00", date: "Nov 15, 2024", status: "Paid" },
                    { month: "October 2024", amount: "$29.00", date: "Oct 15, 2024", status: "Paid" },
                  ].map((invoice) => (
                    <div
                      key={invoice.month}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex flex-col gap-0.5">
                        <p className="font-medium text-sm">{invoice.month}</p>
                        <p className="text-muted-foreground text-xs">
                          {invoice.amount} • Paid on {invoice.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-green-600">
                          {invoice.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "connected" && (
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>Link external accounts for quick access</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {connectedAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${account.color} font-bold text-sm text-white`}
                        >
                          {account.icon}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{account.name}</p>
                            {account.connected && (
                              <Badge variant="secondary" className="text-[10px]">
                                Connected
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            {account.connected ? account.email : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <Button variant={account.connected ? "outline" : "default"} size="sm">
                        {account.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Access</CardTitle>
                  <CardDescription>Manage your API keys and access tokens</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-primary" />
                        <p className="font-medium text-sm">Personal Access Token</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <p className="mt-2 text-muted-foreground text-xs">
                      Use this token to authenticate API requests. Keep it secret.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex flex-1 items-center gap-2 rounded-md border bg-background px-3 py-2">
                        <code className="flex-1 font-mono text-xs">
                          {showApiKey
                            ? "sk_live_mock_key_000000000000000000000000"
                            : "sk_live_••••••••••••••••••••••••••••"}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyToken}>
                              {copied ? (
                                <Check className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{copied ? "Copied!" : "Copy to clipboard"}</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <p className="mt-2 text-muted-foreground text-xs">Last used 2 hours ago</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Key className="mr-2 h-4 w-4" />
                    Generate New Token
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
