"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Check,
  ChevronRight,
  Command,
  FileText,
  Folder,
  MailIcon,
  Plus,
  PlusCircleIcon,
  Settings,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LocalIcon } from "@/components/ui/local-icon";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { NavGroup, NavMainItem } from "@/navigation/sidebar/sidebar-items";

interface NavMainProps {
  readonly items: readonly NavGroup[];
}

const workspaces = [
  {
    id: "1",
    name: "Acme Inc",
    plan: "Enterprise",
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "Startup Co",
    plan: "Pro",
    color: "bg-green-500",
  },
  {
    id: "3",
    name: "Personal",
    plan: "Free",
    color: "bg-purple-500",
  },
];

const quickCreateItems = [
  { label: "New Project", icon: Folder, shortcut: "⌘P" },
  { label: "New Team", icon: Users, shortcut: "⌘T" },
  { label: "New Document", icon: FileText, shortcut: "⌘D" },
];

const IsComingSoon = () => (
  <span className="ml-auto rounded-md bg-gray-200 px-2 py-1 text-xs dark:text-gray-800">Soon</span>
);

const NavItemExpanded = ({
  item,
  isActive,
  isSubmenuOpen,
}: {
  item: NavMainItem;
  isActive: (url: string, subItems?: NavMainItem["subItems"]) => boolean;
  isSubmenuOpen: (subItems?: NavMainItem["subItems"]) => boolean;
}) => {
  return (
    <Collapsible key={item.title} asChild defaultOpen={isSubmenuOpen(item.subItems)} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          {item.subItems ? (
            <SidebarMenuButton
              disabled={item.comingSoon}
              isActive={isActive(item.url, item.subItems)}
              tooltip={item.title}
            >
              {item.icon && <LocalIcon icon={item.icon} className="h-4 w-4" />}
              <span>{item.title}</span>
              {item.comingSoon && <IsComingSoon />}
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton
              asChild
              aria-disabled={item.comingSoon}
              isActive={isActive(item.url)}
              tooltip={item.title}
            >
              <Link prefetch={false} href={item.url} target={item.newTab ? "_blank" : undefined}>
                {item.icon && <LocalIcon icon={item.icon} className="h-4 w-4" />}
                <span>{item.title}</span>
                {item.comingSoon && <IsComingSoon />}
              </Link>
            </SidebarMenuButton>
          )}
        </CollapsibleTrigger>
        {item.subItems && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton aria-disabled={subItem.comingSoon} isActive={isActive(subItem.url)} asChild>
                    <Link prefetch={false} href={subItem.url} target={subItem.newTab ? "_blank" : undefined}>
                      {subItem.icon && <LocalIcon icon={subItem.icon} className="h-4 w-4" />}
                      <span>{subItem.title}</span>
                      {subItem.comingSoon && <IsComingSoon />}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
};

const NavItemCollapsed = ({
  item,
  isActive,
}: {
  item: NavMainItem;
  isActive: (url: string, subItems?: NavMainItem["subItems"]) => boolean;
}) => {
  return (
    <SidebarMenuItem key={item.title}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            disabled={item.comingSoon}
            tooltip={item.title}
            isActive={isActive(item.url, item.subItems)}
          >
            {item.icon && <LocalIcon icon={item.icon} className="h-4 w-4" />}
            <span>{item.title}</span>
            <ChevronRight />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-50 space-y-1" side="right" align="start">
          {item.subItems?.map((subItem) => (
            <DropdownMenuItem key={subItem.title} asChild>
              <SidebarMenuSubButton
                key={subItem.title}
                asChild
                className="focus-visible:ring-0"
                aria-disabled={subItem.comingSoon}
                isActive={isActive(subItem.url)}
              >
                <Link prefetch={false} href={subItem.url} target={subItem.newTab ? "_blank" : undefined}>
                  {subItem.icon && <LocalIcon icon={subItem.icon} className="h-4 w-4" />}
                  <span>{subItem.title}</span>
                  {subItem.comingSoon && <IsComingSoon />}
                </Link>
              </SidebarMenuSubButton>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export function NavMain({ items }: NavMainProps) {
  const path = usePathname();
  const { state, isMobile } = useSidebar();
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces[0]);

  const isItemActive = (url: string, subItems?: NavMainItem["subItems"]) => {
    if (subItems?.length) {
      return subItems.some((sub) => path.startsWith(sub.url));
    }
    return path === url;
  };

  const isSubmenuOpen = (subItems?: NavMainItem["subItems"]) => {
    return subItems?.some((sub) => path.startsWith(sub.url)) ?? false;
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton tooltip="Switch Workspace" className="flex-1 justify-start gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className={`${selectedWorkspace.color} text-white text-xs`}>
                        {selectedWorkspace.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-left">{selectedWorkspace.name}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {selectedWorkspace.plan}
                    </Badge>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {workspaces.map((workspace) => (
                      <DropdownMenuItem
                        key={workspace.id}
                        onClick={() => setSelectedWorkspace(workspace)}
                        className="gap-2"
                      >
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className={`${workspace.color} text-white text-xs`}>
                            {workspace.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-1 flex-col">
                          <span className="font-medium text-sm">{workspace.name}</span>
                          <span className="text-muted-foreground text-xs">{workspace.plan}</span>
                        </div>
                        {selectedWorkspace.id === workspace.id && <Check className="h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Workspace</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Workspace Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>

            <SidebarMenuItem className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Quick Create"
                    className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                  >
                    <PlusCircleIcon />
                    <span>Quick Create</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>Create New</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {quickCreateItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.label} className="gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="flex-1">{item.label}</span>
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground">
                          {item.shortcut}
                        </kbd>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <Command className="h-4 w-4" />
                    <span>View All Commands</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                size="icon"
                className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <MailIcon />
                <span className="sr-only">Inbox</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {items.map((group) => (
        <SidebarGroup key={group.id}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {group.items.map((item) => {
                if (state === "collapsed" && !isMobile) {
                  if (!item.subItems) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          aria-disabled={item.comingSoon}
                          tooltip={item.title}
                          isActive={isItemActive(item.url)}
                        >
                          <Link prefetch={false} href={item.url} target={item.newTab ? "_blank" : undefined}>
                            {item.icon && <LocalIcon icon={item.icon} className="h-4 w-4" />}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }
                  return <NavItemCollapsed key={item.title} item={item} isActive={isItemActive} />;
                }
                return (
                  <NavItemExpanded key={item.title} item={item} isActive={isItemActive} isSubmenuOpen={isSubmenuOpen} />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
