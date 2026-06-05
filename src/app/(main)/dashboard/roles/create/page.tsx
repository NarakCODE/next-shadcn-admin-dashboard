"use client";

import { useCallback, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Activity,
  ArrowLeft,
  ArrowLeftRight,
  BadgePercent,
  Building2,
  CircleHelp,
  CreditCard,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Grid,
  Home,
  Layers,
  Monitor,
  Package,
  Percent,
  Settings,
  Shield,
  ShoppingBag,
  TrendingUp,
  Truck,
  User,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Permission = {
  label: string;
  type: "checkbox" | "radio";
  group?: string;
  default?: boolean;
  has_info_tooltip?: boolean;
  idx?: number;
};

type PermissionSection = {
  category: string;
  permissions: Permission[];
  has_info_tooltip?: boolean;
};

const permissionSections: PermissionSection[] = [
  {
    category: "Others",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      {
        label: "View export to buttons (csv/excel/print/pdf) on tables",
        type: "checkbox",
        default: false,
      },
    ],
  },
  {
    category: "User",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      { label: "View user", type: "checkbox", default: false },
      { label: "Add user", type: "checkbox", default: false },
      { label: "Edit user", type: "checkbox", default: false },
      { label: "Delete user", type: "checkbox", default: false },
    ],
  },
  {
    category: "Roles",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      { label: "View role", type: "checkbox", default: false },
      { label: "Add Role", type: "checkbox", default: false },
      { label: "Edit Role", type: "checkbox", default: false },
      { label: "Delete role", type: "checkbox", default: false },
    ],
  },
  {
    category: "Supplier",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      {
        label: "View all supplier",
        type: "radio",
        group: "supplier_view",
        default: false,
      },
      {
        label: "View own supplier",
        type: "radio",
        group: "supplier_view",
        default: false,
      },
      { label: "Add supplier", type: "checkbox", default: false },
      { label: "Edit supplier", type: "checkbox", default: false },
      { label: "Delete supplier", type: "checkbox", default: false },
    ],
  },
  {
    category: "Customer",
    has_info_tooltip: true,
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      {
        label: "View all customer",
        type: "radio",
        group: "customer_view",
        default: false,
      },
      {
        label: "View own customer",
        type: "radio",
        group: "customer_view",
        default: false,
      },
      {
        label: "View customers with no sell from one month only",
        type: "radio",
        group: "customer_view",
        default: false,
      },
      {
        label: "View customers with no sell from three months only",
        type: "radio",
        group: "customer_view",
        default: false,
      },
      {
        label: "View customers with no sell from six months only",
        type: "radio",
        group: "customer_view",
        default: false,
      },
      {
        label: "View customers with no sell from one year only",
        type: "radio",
        group: "customer_view",
        default: false,
      },
      {
        label: "View customers irrespective of their sell",
        type: "radio",
        group: "customer_view",
        default: false,
      },
      { label: "Add customer", type: "checkbox", default: false },
      { label: "Edit customer", type: "checkbox", default: false },
      { label: "Delete customer", type: "checkbox", default: false },
    ],
  },
  {
    category: "Product",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      { label: "View product", type: "checkbox", default: false },
      { label: "Add product", type: "checkbox", default: false },
      { label: "Edit product", type: "checkbox", default: false },
      { label: "Delete product", type: "checkbox", default: false },
      { label: "Add Opening Stock", type: "checkbox", default: false },
      {
        label: "View Purchase Price",
        type: "checkbox",
        default: false,
        has_info_tooltip: true,
      },
    ],
  },
  {
    category: "Purchase",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      {
        label: "View all Purchase",
        type: "radio",
        group: "purchase_view",
        default: false,
      },
      {
        label: "View own Purchase",
        type: "radio",
        group: "purchase_view",
        default: false,
      },
      { label: "Add purchase", type: "checkbox", default: false },
      { label: "Edit purchase", type: "checkbox", default: false },
      { label: "Delete purchase", type: "checkbox", default: false },
      { label: "Add purchase payment", type: "checkbox", default: false },
      { label: "Edit purchase payment", type: "checkbox", default: false },
      { label: "Delete purchase payment", type: "checkbox", default: false },
      { label: "Update Status", type: "checkbox", default: false },
    ],
  },
  {
    category: "Stock Adjustment",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      {
        label: "View all stock adjustment",
        type: "radio",
        group: "stock_adj_view",
        default: false,
      },
      {
        label: "View own stock adjustment",
        type: "radio",
        group: "stock_adj_view",
        default: false,
      },
      { label: "Add stock adjustment", type: "checkbox", default: false },
      { label: "Edit stock adjustment", type: "checkbox", default: false },
      { label: "Delete stock adjustment", type: "checkbox", default: false },
    ],
  },
  {
    category: "Stock Transfer",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      {
        label: "View all stock transfer",
        type: "radio",
        group: "stock_trans_view",
        default: false,
      },
      {
        label: "View own stock transfer",
        type: "radio",
        group: "stock_trans_view",
        default: false,
      },
      { label: "Add stock transfer", type: "checkbox", default: false },
      { label: "Edit stock transfer", type: "checkbox", default: false },
      { label: "Delete stock transfer", type: "checkbox", default: false },
    ],
  },
  {
    category: "POS",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      { label: "View POS sell", type: "checkbox", default: false },
      { label: "Add POS sell", type: "checkbox", default: false },
      { label: "Edit POS sell", type: "checkbox", default: false },
      { label: "Delete POS sell", type: "checkbox", default: false },
      {
        label: "Edit product price from POS screen",
        type: "checkbox",
        default: false,
      },
      {
        label: "Edit product discount from POS screen",
        type: "checkbox",
        default: false,
      },
      { label: "Add/Edit Payment", type: "checkbox", default: false },
      { label: "Print Invoice", type: "checkbox", default: false },
      { label: "Disable Multiple Pay", type: "checkbox", default: false },
      { label: "Disable Draft", type: "checkbox", default: false },
      { label: "Disable Express Checkout", type: "checkbox", default: false },
      { label: "Disable Discount", type: "checkbox", default: false },
      { label: "Disable Suspend Sale", type: "checkbox", default: false },
      { label: "Disable credit sale button", type: "checkbox", default: false },
      { label: "Disable Quotation", type: "checkbox", default: false },
      { label: "Disable Card", type: "checkbox", default: false },
    ],
  },
  {
    category: "Sell",
    has_info_tooltip: true,
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      {
        label: "View all sell",
        type: "radio",
        group: "sell_view",
        default: false,
      },
      {
        label: "View own sell only",
        type: "radio",
        group: "sell_view",
        default: false,
      },
      { label: "View paid sells only", type: "checkbox", default: false },
      { label: "View due sells only", type: "checkbox", default: false },
      {
        label: "View partially paid sells only",
        type: "checkbox",
        default: false,
      },
      { label: "View overdue sells only", type: "checkbox", default: false },
      { label: "Add Sell", type: "checkbox", default: false },
      { label: "Update Sell", type: "checkbox", default: false },
      { label: "Delete Sell", type: "checkbox", default: false },
      {
        label: "Commission agent can view their own sell",
        type: "checkbox",
        default: false,
      },
      { label: "Add sell payment", type: "checkbox", default: false },
      { label: "Edit sell payment", type: "checkbox", default: false },
      { label: "Delete sell payment", type: "checkbox", default: false },
      {
        label: "Edit product price from sales screen",
        type: "checkbox",
        default: false,
      },
      {
        label: "Edit product discount from Sale screen",
        type: "checkbox",
        default: false,
      },
      { label: "Add/Edit/Delete Discount", type: "checkbox", default: false },
      { label: "Access all sell return", type: "checkbox", default: false },
      { label: "Access own sell return", type: "checkbox", default: false },
      { label: "Add edit invoice number", type: "checkbox", default: false },
    ],
  },
  {
    category: "Draft",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      {
        label: "View all drafts",
        type: "radio",
        group: "draft_view",
        default: false,
      },
      {
        label: "View own drafts",
        type: "radio",
        group: "draft_view",
        default: false,
      },
      { label: "Edit draft", type: "checkbox", default: false },
      { label: "Delete draft", type: "checkbox", default: false },
    ],
  },
  {
    category: "Quotation",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      {
        label: "View all quotations",
        type: "radio",
        group: "quotation_view",
        default: false,
      },
      {
        label: "View own quotations",
        type: "radio",
        group: "quotation_view",
        default: false,
      },
      { label: "Edit quotation", type: "checkbox", default: false },
      { label: "Delete quotation", type: "checkbox", default: false },
    ],
  },
  {
    category: "Shipments",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      {
        label: "Access all shipments",
        type: "radio",
        group: "shipments_view",
        default: false,
      },
      {
        label: "Access own shipments",
        type: "radio",
        group: "shipments_view",
        default: false,
      },
      {
        label: "Access pending shipments only",
        type: "checkbox",
        default: false,
      },
      {
        label: "Commission agent can access their own shipments",
        type: "checkbox",
        default: false,
      },
    ],
  },
  {
    category: "Cash Register",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      { label: "View cash register", type: "checkbox", default: false },
      { label: "Close cash register", type: "checkbox", default: false },
    ],
  },
  {
    category: "Brand",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      { label: "View brand", type: "checkbox", default: false },
      { label: "Add brand", type: "checkbox", default: false },
      { label: "Edit brand", type: "checkbox", default: false },
      { label: "Delete brand", type: "checkbox", default: false },
    ],
  },
  {
    category: "Tax rate",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      { label: "View tax rate", type: "checkbox", default: false },
      { label: "Add tax rate", type: "checkbox", default: false },
      { label: "Edit tax rate", type: "checkbox", default: false },
      { label: "Delete tax rate", type: "checkbox", default: false },
    ],
  },
  {
    category: "Unit",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      { label: "View unit", type: "checkbox", default: false },
      { label: "Add unit", type: "checkbox", default: false },
      { label: "Edit unit", type: "checkbox", default: false },
      { label: "Delete unit", type: "checkbox", default: false },
    ],
  },
  {
    category: "Category",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      { label: "View category", type: "checkbox", default: false },
      { label: "Add category", type: "checkbox", default: false },
      { label: "Edit category", type: "checkbox", default: false },
      { label: "Delete category", type: "checkbox", default: false },
    ],
  },
  {
    category: "Report",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      {
        label: "View purchase & sell report",
        type: "checkbox",
        default: false,
      },
      { label: "View Tax report", type: "checkbox", default: false },
      {
        label: "View Supplier & Customer report",
        type: "checkbox",
        default: false,
      },
      { label: "View expense report", type: "checkbox", default: false },
      { label: "View profit/loss report", type: "checkbox", default: false },
      {
        label: "View stock report, stock adjustment report & stock expiry report",
        type: "checkbox",
        default: false,
      },
      {
        label: "View trending product report",
        type: "checkbox",
        default: false,
      },
      { label: "View register report", type: "checkbox", default: false },
      {
        label: "View sales representative report",
        type: "checkbox",
        default: false,
      },
      { label: "View product stock value", type: "checkbox", default: false },
    ],
  },
  {
    category: "Settings",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      { label: "Access business settings", type: "checkbox", default: false },
      { label: "Access barcode settings", type: "checkbox", default: false },
      { label: "Access invoice settings", type: "checkbox", default: false },
      { label: "Access printers", type: "checkbox", default: false },
    ],
  },
  {
    category: "Expense",
    permissions: [
      { label: "Select all", type: "checkbox", default: false },
      {
        label: "Access all expenses",
        type: "radio",
        group: "expense_view",
        default: false,
      },
      {
        label: "View own expense only",
        type: "radio",
        group: "expense_view",
        default: false,
      },
      { label: "Add Expense", type: "checkbox", default: false },
      { label: "Edit Expense", type: "checkbox", default: false },
      { label: "Delete Expense", type: "checkbox", default: false },
    ],
  },
  {
    category: "Home",
    has_info_tooltip: true,
    permissions: [{ label: "View Home data", type: "checkbox", default: true }],
  },
  {
    category: "Account",
    permissions: [
      { label: "Access Accounts", type: "checkbox", default: false },
      { label: "Edit account transaction", type: "checkbox", default: false },
      { label: "Delete account transaction", type: "checkbox", default: false },
    ],
  },
  {
    category: "Access selling price groups",
    permissions: [{ label: "Default Selling Price", type: "checkbox", default: true }],
  },
];

function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case "others":
      return Settings;
    case "user":
      return User;
    case "roles":
      return Shield;
    case "supplier":
      return Building2;
    case "customer":
      return Users;
    case "product":
      return Package;
    case "purchase":
      return ShoppingBag;
    case "stock adjustment":
      return Activity;
    case "stock transfer":
      return ArrowLeftRight;
    case "pos":
      return Monitor;
    case "sell":
      return BadgePercent;
    case "draft":
      return FileText;
    case "quotation":
      return FileSpreadsheet;
    case "shipments":
      return Truck;
    case "cash register":
      return DollarSign;
    case "brand":
      return Layers;
    case "tax rate":
      return Percent;
    case "unit":
      return Grid;
    case "category":
      return Grid;
    case "report":
      return TrendingUp;
    case "settings":
      return Settings;
    case "expense":
      return CreditCard;
    case "home":
      return Home;
    case "account":
      return CreditCard;
    case "access selling price groups":
      return DollarSign;
    default:
      return Shield;
  }
}

function HelpTooltip({ content }: { content: string }) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="text-muted-foreground/60 transition-colors hover:text-muted-foreground">
            <CircleHelp className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-sm">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function PermissionRow({
  permission,
  checked,
  onToggle,
}: {
  permission: Permission;
  checked: boolean;
  onToggle: () => void;
}) {
  const id = `${permission.label}-${permission.type}`;

  if (permission.type === "radio") {
    return (
      <div className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted/50">
        <RadioGroupItem value={permission.label} id={id} className="shrink-0" />
        <Label htmlFor={id} className="flex-1 cursor-pointer text-sm leading-snug">
          {permission.label}
        </Label>
        {permission.has_info_tooltip && <HelpTooltip content={`Information about "${permission.label}"`} />}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted/50">
      <Checkbox id={id} checked={checked} onCheckedChange={onToggle} className="shrink-0" />
      <Label htmlFor={id} className="flex-1 cursor-pointer text-sm leading-snug">
        {permission.label}
      </Label>
      {permission.has_info_tooltip && <HelpTooltip content={`Information about "${permission.label}"`} />}
    </div>
  );
}

function FormSection({
  id,
  title,
  description,
  icon: Icon,
  children,
}: {
  id: string;
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  const hasHeader = !!title || !!description || !!Icon;

  return (
    <Card id={id}>
      {hasHeader && (
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pt-6 pb-3">
          {Icon && (
            <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
              <Icon className="size-5" />
            </div>
          )}
          <div className="flex flex-col gap-1">
            {title && <CardTitle className="font-semibold text-base">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </CardHeader>
      )}
      <CardContent className={hasHeader ? "pt-0" : "pt-6"}>
        <FieldGroup>{children}</FieldGroup>
      </CardContent>
    </Card>
  );
}

function PermissionSectionCard({
  section,
  sectionIndex,
  permissionsState,
  radioState,
  onTogglePermission,
  onSelectAll,
  id,
  icon,
}: {
  section: PermissionSection;
  sectionIndex: number;
  permissionsState: Record<string, boolean>;
  radioState: Record<string, string>;
  onTogglePermission: (sectionIdx: number, permIdx: number) => void;
  onSelectAll: (sectionIdx: number) => void;
  id: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const nonSelectPermissions = section.permissions.filter((p) => !p.label.startsWith("Select all"));
  const selectAllPerm = section.permissions.find((p) => p.label.startsWith("Select all"));
  const allChecked = nonSelectPermissions.every((p) => {
    if (p.type === "radio" && p.group) {
      return radioState[p.group] === p.label;
    }
    return permissionsState[`${sectionIndex}-${section.permissions.indexOf(p)}`] ?? p.default;
  });

  const radioGroups = new Map<string, Permission[]>();
  const standalonePermissions: Permission[] = [];

  section.permissions.forEach((p, idx) => {
    if (p.type === "radio" && p.group) {
      if (!radioGroups.has(p.group)) {
        radioGroups.set(p.group, []);
      }
      radioGroups.get(p.group)?.push({ ...p, idx });
    } else if (!p.label.startsWith("Select all")) {
      standalonePermissions.push({ ...p, idx });
    }
  });

  return (
    <FormSection
      id={id}
      title={section.category}
      description={
        section.has_info_tooltip
          ? `Configure permission levels for ${section.category.toLowerCase()} settings.`
          : undefined
      }
      icon={icon}
    >
      <div className="flex flex-col gap-4">
        {selectAllPerm && (
          <div className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted/50">
            <Checkbox
              id={`select-all-${sectionIndex}`}
              checked={allChecked}
              onCheckedChange={() => onSelectAll(sectionIndex)}
              className="shrink-0"
            />
            <Label htmlFor={`select-all-${sectionIndex}`} className="flex-1 cursor-pointer text-sm">
              {selectAllPerm.label}
            </Label>
          </div>
        )}

        {radioGroups.size > 0 && (
          <div className="mt-1 flex flex-col gap-0.5">
            <p className="px-3 font-medium text-muted-foreground/70 text-xs uppercase tracking-wider">View Scope</p>
            {Array.from(radioGroups.entries()).map(([group, perms]) => (
              <RadioGroup
                key={group}
                value={radioState[group] ?? ""}
                onValueChange={(_val) => {
                  const firstPermIdx = perms[0].idx ?? 0;
                  onTogglePermission(sectionIndex, firstPermIdx);
                }}
                className="gap-0.5"
              >
                {perms.map((p) => {
                  const permIdx = p.idx ?? 0;
                  return (
                    <PermissionRow
                      key={p.label}
                      permission={p}
                      checked={radioState[group] === p.label}
                      onToggle={() => onTogglePermission(sectionIndex, permIdx)}
                    />
                  );
                })}
              </RadioGroup>
            ))}
          </div>
        )}

        {standalonePermissions.length > 0 && (
          <div className="flex flex-col gap-0.5">
            {radioGroups.size > 0 && (
              <p className="px-3 font-medium text-muted-foreground/70 text-xs uppercase tracking-wider">Actions</p>
            )}
            {standalonePermissions.map((p) => {
              const permIdx = p.idx ?? 0;
              const key = `${sectionIndex}-${permIdx}`;
              return (
                <PermissionRow
                  key={key}
                  permission={p}
                  checked={permissionsState[key] ?? p.default}
                  onToggle={() => onTogglePermission(sectionIndex, permIdx)}
                />
              );
            })}
          </div>
        )}
      </div>
    </FormSection>
  );
}

export default function CreateRolePage() {
  const router = useRouter();
  const [roleName, setRoleName] = useState("");
  const [permissionsState, setPermissionsState] = useState<Record<string, boolean>>({});
  const [radioState, setRadioState] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState("role-details");

  const handleTogglePermission = useCallback((sectionIdx: number, permIdx: number) => {
    const key = `${sectionIdx}-${permIdx}`;
    const section = permissionSections[sectionIdx];
    const perm = section.permissions[permIdx];

    if (perm.type === "radio" && perm.group) {
      const groupKey = perm.group;
      setRadioState((prev) => ({
        ...prev,
        [groupKey]: prev[groupKey] === perm.label ? "" : perm.label,
      }));
    } else {
      setPermissionsState((prev) => ({
        ...prev,
        [key]: !(prev[key] ?? perm.default),
      }));
    }
  }, []);

  const handleSelectAll = useCallback(
    (sectionIdx: number) => {
      const section = permissionSections[sectionIdx];
      const nonSelectPermissions = section.permissions.filter((p) => !p.label.startsWith("Select all"));

      const currentAllChecked = nonSelectPermissions.every((p) => {
        const idx = section.permissions.indexOf(p);
        if (p.type === "radio" && p.group) {
          return radioState[p.group] === p.label;
        }
        return permissionsState[`${sectionIdx}-${idx}`] ?? p.default;
      });

      const newState = { ...permissionsState };
      const newRadio = { ...radioState };

      nonSelectPermissions.forEach((p) => {
        const idx = section.permissions.indexOf(p);
        if (p.type === "radio" && p.group) {
          if (!currentAllChecked) {
            newRadio[p.group] = p.label;
          } else {
            delete newRadio[p.group];
          }
        } else {
          newState[`${sectionIdx}-${idx}`] = !currentAllChecked;
        }
      });

      setPermissionsState(newState);
      setRadioState(newRadio);
    },
    [permissionsState, radioState],
  );

  const sections = useMemo(() => {
    return [
      { id: "role-details", title: "Role Details", icon: Shield },
      ...permissionSections.map((s) => ({
        id: s.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: s.category,
        icon: getCategoryIcon(s.category),
      })),
    ];
  }, []);

  const handleAsideClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/roles")}>
            <ArrowLeft data-icon="inline-start" />
            Back to Roles
          </Button>
        </div>
        <PageHeader title="Add Role" subtitle="Define a new role and configure its permissions across the system." />
      </div>

      <Separator />

      {/* Main Layout Grid */}
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Aside Navigation */}
        <aside className="scrollbar-none overflow-y-auto pr-2 lg:sticky lg:top-24 lg:h-[calc(100vh-10rem)] lg:w-64 lg:shrink-0">
          <nav className="flex flex-col gap-1">
            {sections.map(({ id, title, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleAsideClick(e, id)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{title}</span>
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Form Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {activeSection === "role-details" && (
            <FormSection
              id="role-details"
              title="Role Details"
              description="Enter a descriptive name for this role."
              icon={Shield}
            >
              <Field>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <FieldLabel>Role Name</FieldLabel>
                    <span className="font-normal text-destructive">*</span>
                  </div>
                </div>
                <Input
                  placeholder="e.g. Branch Manager, Cashier, Inventory Clerk"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="max-w-md"
                />
              </Field>
            </FormSection>
          )}

          {/* Dynamic Category Cards */}
          {permissionSections.map((section, sectionIdx) => {
            const id = section.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            if (activeSection !== id) return null;

            const Icon = getCategoryIcon(section.category);
            return (
              <div key={section.category} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h2 className="font-semibold text-lg">{section.category} Permissions</h2>
                  <p className="text-muted-foreground text-sm">
                    Configure what this role can view and modify under {section.category.toLowerCase()} settings.
                  </p>
                </div>
                <PermissionSectionCard
                  id={id}
                  section={section}
                  sectionIndex={sectionIdx}
                  permissionsState={permissionsState}
                  radioState={radioState}
                  onTogglePermission={handleTogglePermission}
                  onSelectAll={handleSelectAll}
                  icon={Icon}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="sticky bottom-0 z-20 -mx-6 border-t bg-background/80 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/roles")}>
            Cancel
          </Button>
          <Button>
            <Shield data-icon="inline-start" />
            Save Role
          </Button>
        </div>
      </div>
    </div>
  );
}
