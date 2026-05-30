export interface NavSubItem {
  title: string;
  url: string;
  icon?: string;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: string;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "Default",
        url: "/dashboard/default",
        icon: "mynaui:home",
      },
      {
        title: "CRM",
        url: "/dashboard/crm",
        icon: "mynaui:chart-bar",
      },
      {
        title: "Finance",
        url: "/dashboard/finance",
        icon: "mynaui:credit-card",
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: "mynaui:chart-pie",
      },
      {
        title: "Productivity",
        url: "/dashboard/productivity",
        icon: "mynaui:list-check",
      },
      {
        title: "E-commerce",
        url: "/dashboard/ecommerce",
        icon: "mynaui:shopping-bag",
      },
      {
        title: "Academy",
        url: "/dashboard/academy",
        icon: "mynaui:graduation-cap",
        isNew: true,
      },
      {
        title: "Logistics",
        url: "/dashboard/logistics",
        icon: "mynaui:truck",
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        title: "Email",
        url: "/dashboard/mail",
        icon: "mynaui:mail",
      },
      {
        title: "Chat",
        url: "/dashboard/chat",
        icon: "mynaui:chat",
      },
      {
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: "mynaui:calendar",
      },
      {
        title: "Kanban",
        url: "/dashboard/kanban",
        icon: "mynaui:columns",
      },
      {
        title: "Invoice",
        url: "/dashboard/invoice",
        icon: "mynaui:file-text",
        subItems: [
          { title: "List", url: "/dashboard/invoice" },
          { title: "Details", url: "/dashboard/invoice/details" },
          { title: "Create", url: "/dashboard/invoice/create" },
          { title: "Edit", url: "/dashboard/invoice/edit" },
        ],
      },
      {
        title: "Users",
        url: "/dashboard/users",
        icon: "mynaui:users",
      },
      {
        title: "Customers",
        url: "/dashboard/customers",
        icon: "mynaui:customer",
      },
      {
        title: "Tickets",
        url: "/dashboard/tickets",
        icon: "mynaui:ticket",
      },
      {
        title: "Contact",
        url: "/dashboard/contact",
        icon: "mynaui:contact",
      },
      {
        title: "Roles",
        url: "/dashboard/roles",
        icon: "mynaui:shield",
      },
      {
        title: "Blogs",
        url: "/dashboard/blog",
        icon: "mynaui:book-open",
        subItems: [
          { title: "Blog Posts", url: "/dashboard/blog" },
          { title: "Blog Detail", url: "/dashboard/blog/detail" },
          { title: "Blog Create", url: "/dashboard/blog/create" },
          { title: "Blog Edit", url: "/dashboard/blog/edit" },
          { title: "Manage Blog", url: "/dashboard/blog/manage" },
          { title: "Categories", url: "/dashboard/blog/categories" },
          { title: "Tags", url: "/dashboard/blog/tags" },
          { title: "Comments", url: "/dashboard/blog/comments" },
        ],
      },
      {
        title: "Authentication",
        url: "/auth",
        icon: "mynaui:lock",
        subItems: [
          { title: "Login v1", url: "/auth/v1/login", newTab: true },
          { title: "Login v2", url: "/auth/v2/login", newTab: true },
          { title: "Register v1", url: "/auth/v1/register", newTab: true },
          { title: "Register v2", url: "/auth/v2/register", newTab: true },
          { title: "Forgot Password", url: "/auth/v2/forgot-password", newTab: true },
          { title: "Two Steps", url: "/auth/v2/two-steps", newTab: true },
        ],
      },
      {
        title: "Errors",
        url: "/errors",
        icon: "mynaui:triangle-danger",
        subItems: [
          { title: "400 - Bad Request", url: "/errors/400" },
          { title: "401 - Unauthorized", url: "/errors/401" },
          { title: "403 - Forbidden", url: "/errors/403" },
          { title: "404 - Not Found", url: "/errors/404" },
          { title: "500 - Internal Server Error", url: "/errors/500" },
          { title: "503 - Service Unavailable", url: "/errors/503" },
        ],
      },
      {
        title: "Empty Pages",
        url: "/dashboard/empty",
        icon: "mynaui:file-off",
        subItems: [
          { title: "Empty Page 1", url: "/dashboard/empty/page-1" },
          { title: "Empty Page 2", url: "/dashboard/empty/page-2" },
          { title: "Empty Page 3", url: "/dashboard/empty/page-3" },
          { title: "Empty Page 4", url: "/dashboard/empty/page-4" },
        ],
      },
      {
        title: "API Keys",
        url: "/dashboard/api-keys",
        icon: "mynaui:key",
      },
      {
        title: "Integrations",
        url: "/dashboard/integrations",
        icon: "mynaui:plug",
        subItems: [
          { title: "All Integrations", url: "/dashboard/integrations" },
          { title: "Custom Builder", url: "/dashboard/integrations/custom", isNew: true },
        ],
      },
      {
        title: "Security",
        url: "/dashboard/security/settings",
        icon: "mynaui:shield-check",
        isNew: true,
        subItems: [{ title: "Settings", url: "/dashboard/security/settings" }],
      },
      {
        title: "Pricing",
        url: "/dashboard/pricing",
        icon: "mynaui:tag",
      },
      {
        title: "FAQs",
        url: "/dashboard/faqs",
        icon: "mynaui:help",
      },
    ],
  },
  {
    id: 3,
    label: "Products",
    items: [
      {
        title: "Products",
        url: "/dashboard/products",
        icon: "mynaui:box",
        subItems: [
          { title: "List", url: "/dashboard/products" },
          { title: "Shop", url: "/dashboard/products/shop" },
          { title: "Create", url: "/dashboard/products/create" },
          { title: "Edit", url: "/dashboard/products/edit" },
          { title: "Details", url: "/dashboard/products/details" },
          { title: "Checkout", url: "/dashboard/products/checkout" },
        ],
      },
      {
        title: "Orders",
        url: "/dashboard/orders",
        icon: "mynaui:cart",
      },
    ],
  },
  {
    id: 4,
    label: "Legacy",
    items: [
      {
        title: "Dashboards",
        url: "/dashboard/default-v1",
        subItems: [
          { title: "Default V1", url: "/dashboard/default-v1" },
          { title: "CRM V1", url: "/dashboard/crm-v1" },
          { title: "Finance V1", url: "/dashboard/finance-v1" },
          { title: "Analytics V1", url: "/dashboard/analytics-v1" },
        ],
      },
    ],
  },
  {
    id: 5,
    label: "Misc",
    items: [
      {
        title: "Others",
        url: "/dashboard/coming-soon",
        icon: "mynaui:arrow-up-right",
        comingSoon: true,
      },
    ],
  },
  {
    id: 6,
    label: "Team & Settings",
    items: [
      {
        title: "Team Management",
        url: "/dashboard/team",
        icon: "mynaui:users",
        isNew: true,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: "mynaui:settings",
        subItems: [
          { title: "Audit Logs", url: "/dashboard/settings/audit-logs", isNew: true },
          { title: "SSO Configuration", url: "/dashboard/settings/sso", isNew: true },
          { title: "Webhooks", url: "/dashboard/settings/webhooks", isNew: true },
          { title: "Data Export", url: "/dashboard/settings/data-export", isNew: true },
          { title: "Custom Branding", url: "/dashboard/settings/branding", isNew: true },
        ],
      },
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: "mynaui:bell",
        isNew: true,
      },
      {
        title: "Activity",
        url: "/dashboard/activity",
        icon: "mynaui:activity",
        isNew: true,
      },
    ],
  },
];
