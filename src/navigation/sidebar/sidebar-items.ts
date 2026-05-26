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
      },
      {
        title: "Users",
        url: "/dashboard/users",
        icon: "mynaui:users",
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
];
