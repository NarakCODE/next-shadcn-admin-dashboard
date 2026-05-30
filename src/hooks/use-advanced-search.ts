"use client";

import { useCallback, useEffect, useState } from "react";

import { getLocalStorageValue, setLocalStorageValue } from "@/lib/local-storage.client";

const SEARCH_HISTORY_KEY = "search-history";
const SAVED_SEARCHES_KEY = "saved-searches";
const MAX_HISTORY_ITEMS = 10;

export type SearchResult = {
  id: string;
  type: "user" | "ticket" | "order" | "project" | "invoice" | "customer";
  title: string;
  subtitle: string;
  url: string;
  icon?: string;
  metadata?: Record<string, string>;
};

export type SavedSearch = {
  id: string;
  query: string;
  label: string;
  createdAt: string;
};

// Mock data for demonstration - in production, this would come from an API
const mockSearchData: SearchResult[] = [
  // Users
  {
    id: "user-1",
    type: "user",
    title: "John Doe",
    subtitle: "john.doe@example.com",
    url: "/dashboard/users",
    metadata: { role: "Admin", status: "Active" },
  },
  {
    id: "user-2",
    type: "user",
    title: "Jane Smith",
    subtitle: "jane.smith@example.com",
    url: "/dashboard/users",
    metadata: { role: "Editor", status: "Active" },
  },
  {
    id: "user-3",
    type: "user",
    title: "Bob Johnson",
    subtitle: "bob.johnson@example.com",
    url: "/dashboard/users",
    metadata: { role: "Viewer", status: "Inactive" },
  },
  // Tickets
  {
    id: "ticket-1",
    type: "ticket",
    title: "Login page not loading",
    subtitle: "TKT-001 • High Priority",
    url: "/dashboard/tickets",
    metadata: { status: "Open", assignee: "John Doe" },
  },
  {
    id: "ticket-2",
    type: "ticket",
    title: "Payment processing error",
    subtitle: "TKT-002 • Critical",
    url: "/dashboard/tickets",
    metadata: { status: "In Progress", assignee: "Jane Smith" },
  },
  {
    id: "ticket-3",
    type: "ticket",
    title: "Feature request: Dark mode",
    subtitle: "TKT-003 • Low Priority",
    url: "/dashboard/tickets",
    metadata: { status: "Open", assignee: "Unassigned" },
  },
  // Orders
  {
    id: "order-1",
    type: "order",
    title: "Order #12345",
    subtitle: "$299.00 • 3 items",
    url: "/dashboard/orders",
    metadata: { status: "Shipped", customer: "Alice Brown" },
  },
  {
    id: "order-2",
    type: "order",
    title: "Order #12346",
    subtitle: "$149.50 • 2 items",
    url: "/dashboard/orders",
    metadata: { status: "Processing", customer: "Charlie Wilson" },
  },
  {
    id: "order-3",
    type: "order",
    title: "Order #12347",
    subtitle: "$599.99 • 5 items",
    url: "/dashboard/orders",
    metadata: { status: "Delivered", customer: "Diana Martinez" },
  },
  // Projects
  {
    id: "project-1",
    type: "project",
    title: "Website Redesign",
    subtitle: "12 tasks • 3 members",
    url: "/dashboard/kanban",
    metadata: { status: "Active", progress: "65%" },
  },
  {
    id: "project-2",
    type: "project",
    title: "Mobile App Development",
    subtitle: "28 tasks • 5 members",
    url: "/dashboard/kanban",
    metadata: { status: "Active", progress: "40%" },
  },
  // Invoices
  {
    id: "invoice-1",
    type: "invoice",
    title: "Invoice INV-2024-001",
    subtitle: "$1,500.00 • Due Jan 15",
    url: "/dashboard/invoice",
    metadata: { status: "Pending", client: "Acme Corp" },
  },
  {
    id: "invoice-2",
    type: "invoice",
    title: "Invoice INV-2024-002",
    subtitle: "$2,750.00 • Due Jan 20",
    url: "/dashboard/invoice",
    metadata: { status: "Paid", client: "TechStart Inc" },
  },
  // Customers
  {
    id: "customer-1",
    type: "customer",
    title: "Acme Corporation",
    subtitle: "Enterprise • 150 employees",
    url: "/dashboard/customers",
    metadata: { status: "Active", revenue: "$45,000" },
  },
  {
    id: "customer-2",
    type: "customer",
    title: "TechStart Inc",
    subtitle: "Startup • 25 employees",
    url: "/dashboard/customers",
    metadata: { status: "Active", revenue: "$12,500" },
  },
];

export function useAdvancedSearch() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const history = getLocalStorageValue(SEARCH_HISTORY_KEY);
    const saved = getLocalStorageValue(SAVED_SEARCHES_KEY);

    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch (error) {
        console.error("[useAdvancedSearch] Failed to parse search history:", error);
      }
    }

    if (saved) {
      try {
        setSavedSearches(JSON.parse(saved));
      } catch (error) {
        console.error("[useAdvancedSearch] Failed to parse saved searches:", error);
      }
    }
  }, []);

  const search = useCallback((query: string): SearchResult[] => {
    if (!query.trim()) {
      return [];
    }

    const lowerQuery = query.toLowerCase();

    return mockSearchData.filter((item) => {
      const searchableText = [item.title, item.subtitle, item.type, ...Object.values(item.metadata || {})]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(lowerQuery);
    });
  }, []);

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;

    setSearchHistory((prev) => {
      const filtered = prev.filter((q) => q !== query);
      const updated = [query, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      setLocalStorageValue(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    setLocalStorageValue(SEARCH_HISTORY_KEY, JSON.stringify([]));
  }, []);

  const removeFromHistory = useCallback((query: string) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((q) => q !== query);
      setLocalStorageValue(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const saveSearch = useCallback((query: string, label: string) => {
    const newSaved: SavedSearch = {
      id: `saved_${Date.now()}`,
      query,
      label,
      createdAt: new Date().toISOString(),
    };

    setSavedSearches((prev) => {
      const updated = [newSaved, ...prev];
      setLocalStorageValue(SAVED_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteSavedSearch = useCallback((id: string) => {
    setSavedSearches((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      setLocalStorageValue(SAVED_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    search,
    searchHistory,
    savedSearches,
    addToHistory,
    clearHistory,
    removeFromHistory,
    saveSearch,
    deleteSavedSearch,
  };
}
