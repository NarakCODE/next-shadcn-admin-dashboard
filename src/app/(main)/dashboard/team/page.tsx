"use client";

import { useMemo, useState } from "react";

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Crown,
  Mail,
  MoreHorizontal,
  PinIcon,
  Search,
  SettingsIcon,
  Share2Icon,
  Shield,
  Trash2,
  TrashIcon,
  TriangleAlertIcon,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";

import { FeatureGate, UsageIndicator } from "@/components/features";
import { DataGrid, DataGridContainer, DataGridTable } from "@/components/reui/data-grid/data-grid";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TeamRole = "owner" | "admin" | "member" | "viewer";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: TeamRole;
  status: "active" | "pending" | "inactive";
  joinedDate: string;
  lastActive: string;
  projects: number;
};

const initialTeamMembers: TeamMember[] = [
  {
    id: "member-1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "",
    role: "owner",
    status: "active",
    joinedDate: "2023-01-15",
    lastActive: "2 minutes ago",
    projects: 12,
  },
  {
    id: "member-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "",
    role: "admin",
    status: "active",
    joinedDate: "2023-02-20",
    lastActive: "1 hour ago",
    projects: 8,
  },
  {
    id: "member-3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    avatar: "",
    role: "member",
    status: "active",
    joinedDate: "2023-03-10",
    lastActive: "3 hours ago",
    projects: 5,
  },
  {
    id: "member-4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    avatar: "",
    role: "viewer",
    status: "pending",
    joinedDate: "2024-01-05",
    lastActive: "Never",
    projects: 0,
  },
  {
    id: "member-5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    avatar: "",
    role: "member",
    status: "inactive",
    joinedDate: "2023-06-15",
    lastActive: "2 weeks ago",
    projects: 3,
  },
];

const ROLE_CONFIG: Record<TeamRole, { label: string; icon: typeof Crown; color: string }> = {
  owner: { label: "Owner", icon: Crown, color: "text-yellow-600" },
  admin: { label: "Admin", icon: Shield, color: "text-blue-600" },
  member: { label: "Member", icon: Users, color: "text-green-600" },
  viewer: { label: "Viewer", icon: Users, color: "text-gray-600" },
};

export default function TeamManagementPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("member");

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesSearch =
        searchQuery === "" ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || member.status === statusFilter;
      const matchesRole = roleFilter === "all" || member.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [teamMembers, searchQuery, statusFilter, roleFilter]);

  const columns: ColumnDef<TeamMember>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Member" />,
        cell: ({ row }) => {
          const member = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={member.avatar || undefined} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{member.name}</span>
                <span className="text-muted-foreground text-xs">{member.email}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Role" />,
        cell: ({ row }) => {
          const role = row.original.role;
          const config = ROLE_CONFIG[role];
          const Icon = config.icon;
          return (
            <Badge variant="outline" className="gap-1">
              <Icon className={`h-3 w-3 ${config.color}`} />
              {config.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
          const status = row.original.status;
          const variant = status === "active" ? "default" : status === "pending" ? "secondary" : "outline";
          return <Badge variant={variant}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
        },
      },
      {
        accessorKey: "projects",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Projects" />,
        cell: ({ row }) => <span>{row.original.projects}</span>,
      },
      {
        accessorKey: "joinedDate",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Joined" />,
        cell: ({ row }) => {
          const date = row.original.joinedDate;
          return <span className="text-muted-foreground text-sm">{format(new Date(date), "MMM d, yyyy")}</span>;
        },
      },
      {
        accessorKey: "lastActive",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Last Active" />,
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.lastActive}</span>,
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const member = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <UserCog className="mr-2 h-4 w-4" />
                  Change Role
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {member.role !== "owner" && (
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      setTeamMembers((prev) => prev.filter((m) => m.id !== member.id));
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Member
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredMembers,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleInvite = () => {
    const emails = inviteEmails
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    const newMembers: TeamMember[] = emails.map((email, index) => ({
      id: `member-${Date.now()}-${index}`,
      name: email.split("@")[0],
      email,
      avatar: "",
      role: inviteRole,
      status: "pending",
      joinedDate: new Date().toISOString().split("T")[0],
      lastActive: "Never",
      projects: 0,
    }));

    setTeamMembers((prev) => [...prev, ...newMembers]);
    setInviteEmails("");
    setInviteRole("member");
    setInviteDialogOpen(false);
  };

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <FeatureGate feature="teamManagement" showUpgradePrompt>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-3xl tracking-tight">Team Management</h1>
            <p className="text-muted-foreground">Manage your team members and their permissions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Members
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-muted-foreground text-sm">Total Members</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-me-1.5" aria-label="More options">
                      <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <SettingsIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TriangleAlertIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Add Alert
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PinIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Pin to Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2Icon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <TrashIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-medium text-2xl text-foreground tabular-nums tracking-tight">
                    {teamMembers.length}
                  </span>
                  <Badge variant="success-light">
                    <ArrowUpIcon aria-hidden="true" />
                    40%
                  </Badge>
                </div>
                <Separator />
                <div className="text-muted-foreground text-xs">
                  Vs last month:{" "}
                  <span className="font-medium text-foreground tabular-nums">
                    {Math.max(1, teamMembers.length - 2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-muted-foreground text-sm">Pending Invites</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-me-1.5" aria-label="More options">
                      <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <SettingsIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TriangleAlertIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Add Alert
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PinIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Pin to Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2Icon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <TrashIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-medium text-2xl text-foreground tabular-nums tracking-tight">
                    {teamMembers.filter((m) => m.status === "pending").length}
                  </span>
                  <Badge variant="destructive-light">
                    <ArrowDownIcon aria-hidden="true" />
                    50%
                  </Badge>
                </div>
                <Separator />
                <div className="text-muted-foreground text-xs">
                  Vs last week: <span className="font-medium text-foreground tabular-nums">2</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-muted-foreground text-sm">Team Capacity</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-me-1.5" aria-label="More options">
                      <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <SettingsIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TriangleAlertIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Add Alert
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PinIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Pin to Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2Icon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <TrashIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2.5">
                <UsageIndicator metric="teamMembers" label="Team Members" />
                <Separator />
                <div className="text-muted-foreground text-xs">
                  Active members:{" "}
                  <span className="font-medium text-foreground tabular-nums">
                    {teamMembers.filter((m) => m.status === "active").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {selectedCount > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  const selectedIds = Object.keys(rowSelection);
                  setTeamMembers((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
                  setRowSelection({});
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove ({selectedCount})
              </Button>
            )}
          </div>
        </div>

        <DataGrid table={table} recordCount={filteredMembers.length}>
          <DataGridContainer>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </DataGridContainer>
          <DataGridPagination table={table} />
        </DataGrid>

        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Members</DialogTitle>
              <DialogDescription>
                Send invitations to join your team. They'll receive an email with instructions.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="emails">Email Addresses</Label>
                <Input
                  id="emails"
                  placeholder="user1@example.com, user2@example.com"
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                />
                <p className="text-muted-foreground text-xs">Separate multiple emails with commas</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as TeamRole)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={!inviteEmails.trim()}>
                Send Invitations
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FeatureGate>
  );
}
