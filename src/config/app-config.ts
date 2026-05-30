import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Rhea Admin",
  version: packageJson.version,
  copyright: `© ${currentYear}, Rhea Admin.`,
  meta: {
    title: "Rhea Admin - Modern Next.js Dashboard Starter Template",
    description:
      "Rhea Admin is a modern, open-source dashboard starter template built with Next.js 16, Tailwind CSS v4, and shadcn/ui. Perfect for SaaS apps, admin panels, and internal tools—fully customizable and production-ready.",
  },
};
