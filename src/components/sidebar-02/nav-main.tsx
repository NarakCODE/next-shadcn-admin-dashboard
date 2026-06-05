"use client";

import type React from "react";
import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronDown, ChevronUp } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuItem as SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type Route = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  link: string;
  subs?: {
    title: string;
    link: string;
    icon?: React.ReactNode;
  }[];
};

export default function DashboardNavigation({ routes }: { routes: Route[] }) {
  const { state } = useSidebar();
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

  useEffect(() => {
    for (const route of routes) {
      if (route.subs?.some((sub) => pathname.startsWith(sub.link))) {
        setOpenCollapsible(route.id);
        return;
      }
    }
  }, [pathname, routes]);

  const isActive = (link: string) => {
    return pathname === link || pathname.startsWith(`${link}/`);
  };

  return (
    <SidebarMenu>
      {routes.map((route) => {
        const isOpen = !isCollapsed && openCollapsible === route.id;
        const hasSubRoutes = !!route.subs?.length;
        const isRouteActive = isActive(route.link) || route.subs?.some((sub) => isActive(sub.link));

        return (
          <SidebarMenuItem key={route.id}>
            {hasSubRoutes ? (
              <Collapsible
                open={isOpen}
                onOpenChange={(open) => setOpenCollapsible(open ? route.id : null)}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={isRouteActive}
                    className={cn("rounded-lg px-2", isCollapsed && "justify-center")}
                  >
                    {route.icon}
                    {!isCollapsed && <span className="ml-2 flex-1 font-medium text-sm">{route.title}</span>}
                    {!isCollapsed && hasSubRoutes && (
                      <span className="ml-auto">
                        {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </span>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {!isCollapsed && (
                  <CollapsibleContent>
                    <SidebarMenuSub className="my-1 ml-3.5">
                      {route.subs?.map((subRoute) => {
                        const isSubActive = isActive(subRoute.link);
                        return (
                          <SidebarMenuSubItem key={`${route.id}-${subRoute.title}`} className="h-auto">
                            <SidebarMenuSubButton asChild isActive={isSubActive}>
                              <Link
                                href={subRoute.link}
                                prefetch={true}
                                className="flex items-center rounded-md px-4 py-1.5 font-medium text-sm"
                              >
                                {subRoute.icon}
                                {subRoute.icon && <span className="mr-2" />}
                                {subRoute.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </Collapsible>
            ) : (
              <SidebarMenuButton
                tooltip={route.title}
                asChild
                isActive={isRouteActive}
                className={cn("rounded-lg px-2", isCollapsed && "justify-center")}
              >
                <Link href={route.link} prefetch={true} className="flex items-center">
                  {route.icon}
                  {!isCollapsed && <span className="ml-2 font-medium text-sm">{route.title}</span>}
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
