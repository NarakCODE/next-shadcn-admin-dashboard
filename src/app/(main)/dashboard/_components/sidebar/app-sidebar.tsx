"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  Contact,
  DollarSign,
  Home,
  Link2,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sliders,
  Users,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Logo } from "@/components/sidebar-02/logo";
import type { Route } from "@/components/sidebar-02/nav-main";
import DashboardNavigation from "@/components/sidebar-02/nav-main";
import { NotificationsPopover } from "@/components/sidebar-02/nav-notifications";
import { TeamSwitcher } from "@/components/sidebar-02/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { rootUser } from "@/data/users";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { NavUser } from "./nav-user";

const sampleNotifications = [
  {
    id: "1",
    avatar: "/avatars/01.png",
    fallback: "OM",
    text: "New order received.",
    time: "10m ago",
  },
  {
    id: "2",
    avatar: "/avatars/02.png",
    fallback: "JL",
    text: "Server upgrade completed.",
    time: "1h ago",
  },
  {
    id: "3",
    avatar: "/avatars/03.png",
    fallback: "HH",
    text: "New user signed up.",
    time: "2h ago",
  },
];

const dashboardRoutes: Route[] = [
  {
    id: "home",
    title: "Home",
    icon: <Home />,
    link: "/dashboard/dashboard",
  },
  {
    id: "user-management",
    title: "User Management",
    icon: <Users />,
    link: "#",
    subs: [
      { title: "Users", link: "/dashboard/users" },
      { title: "Roles", link: "/dashboard/roles" },
      {
        title: "Commission Agents",
        link: "/dashboard/sales-commission-agents",
      },
    ],
  },
  {
    id: "contacts",
    title: "Contacts",
    icon: <Contact />,
    link: "#",
    subs: [
      { title: "Suppliers", link: "/dashboard/suppliers" },
      { title: "Customers", link: "/dashboard/customers" },
      { title: "Customer Groups", link: "/dashboard/customer-groups" },
      { title: "Import Contacts", link: "/dashboard/import-contacts" },
    ],
  },
  {
    id: "ecommerce",
    title: "E-Commerce",
    icon: <ShoppingCart />,
    link: "/dashboard/ecommerce",
  },
  {
    id: "products",
    title: "Products",
    icon: <Package />,
    link: "#",
    subs: [
      { title: "List Products", link: "/dashboard/products" },
      { title: "Add Product", link: "/dashboard/products/create" },
      { title: "Print Labels", link: "/dashboard/labels/show" },
      { title: "Variations", link: "/dashboard/variation-templates" },
      { title: "Import Products", link: "/dashboard/import-products" },
      { title: "Units", link: "/dashboard/units" },
      { title: "Categories", link: "/dashboard/categories" },
      { title: "Brands", link: "/dashboard/brands" },
    ],
  },
  {
    id: "purchases",
    title: "Purchases",
    icon: <ShoppingBag />,
    link: "#",
    subs: [
      { title: "List Purchases", link: "/dashboard/purchases" },
      { title: "Add Purchase", link: "/dashboard/purchases/create" },
      { title: "Purchase Return", link: "/dashboard/purchase-return" },
    ],
  },
  {
    id: "sell",
    title: "Sell",
    icon: <DollarSign />,
    link: "#",
    subs: [
      { title: "All Sales", link: "/dashboard/sells" },
      { title: "Add Sale", link: "/dashboard/sells/create" },
      { title: "List POS", link: "/dashboard/pos" },
      { title: "POS Screen", link: "/dashboard/pos/create" },
      { title: "Drafts", link: "/dashboard/sells/drafts" },
      { title: "Quotations", link: "/dashboard/sells/quotations" },
      { title: "Sell Return", link: "/dashboard/sell-return" },
      { title: "Shipments", link: "/dashboard/shipments" },
      { title: "Discounts", link: "/dashboard/discounts" },
    ],
  },
  {
    id: "stock-transfers",
    title: "Stock Transfers",
    icon: <ArrowLeftRight />,
    link: "#",
    subs: [
      { title: "List Stock Transfers", link: "/dashboard/stock-transfers" },
      {
        title: "Add Stock Transfer",
        link: "/dashboard/stock-transfers/create",
      },
    ],
  },
  {
    id: "stock-adjustment",
    title: "Stock Adjustment",
    icon: <Sliders />,
    link: "#",
    subs: [
      { title: "List Stock Adjustments", link: "/dashboard/stock-adjustments" },
      {
        title: "Add Stock Adjustment",
        link: "/dashboard/stock-adjustments/create",
      },
    ],
  },
  {
    id: "expenses",
    title: "Expenses",
    icon: <Receipt />,
    link: "#",
    subs: [
      { title: "List Expenses", link: "/dashboard/expenses" },
      { title: "Add Expense", link: "/dashboard/expenses/create" },
      { title: "Expense Categories", link: "/dashboard/expense-categories" },
    ],
  },
  {
    id: "reports",
    title: "Reports",
    icon: <BarChart3 />,
    link: "#",
    subs: [
      { title: "Profit / Loss Report", link: "/dashboard/reports/profit-loss" },
      {
        title: "Purchase & Sale Report",
        link: "/dashboard/reports/purchase-sell",
      },
      { title: "Tax Report", link: "/dashboard/reports/tax-report" },
      {
        title: "Trending Products",
        link: "/dashboard/reports/trending-products",
      },
      { title: "Stock Report", link: "/dashboard/reports/stock-report" },
    ],
  },
  {
    id: "notification-templates",
    title: "Notification Templates",
    icon: <Bell />,
    link: "/dashboard/notification-templates",
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings />,
    link: "#",
    subs: [
      { title: "Business Settings", link: "/dashboard/business-settings" },
      { title: "Business Locations", link: "/dashboard/business-locations" },
      { title: "Invoice Settings", link: "/dashboard/invoice-schemes" },
      { title: "Barcode Settings", link: "/dashboard/barcodes" },
      { title: "Tax Rates", link: "/dashboard/tax-rates" },
    ],
  },
  {
    id: "connector",
    title: "Connector",
    icon: <Link2 />,
    link: "/dashboard/connector",
  },
];

const teams = [{ id: "1", name: APP_CONFIG.name, logo: Logo, plan: "Free" }];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sidebarVariant, sidebarCollapsible, isSynced } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.sidebarVariant,
      sidebarCollapsible: s.sidebarCollapsible,
      isSynced: s.isSynced,
    })),
  );

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const variant = isSynced ? sidebarVariant : props.variant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed
            ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
            : "flex-row items-center justify-between",
        )}
      >
        <Link href="/dashboard/home" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          {!isCollapsed && <span className="font-semibold text-black dark:text-white">{APP_CONFIG.name}</span>}
        </Link>

        <motion.div
          key={isCollapsed ? "header-collapsed" : "header-expanded"}
          className={cn("flex items-center gap-2", isCollapsed ? "flex-row md:flex-col-reverse" : "flex-row")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <NotificationsPopover notifications={sampleNotifications} />
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4">
        <DashboardNavigation routes={dashboardRoutes} />
      </SidebarContent>
      <SidebarFooter className="px-2">
        <TeamSwitcher teams={teams} />
        <NavUser user={rootUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
