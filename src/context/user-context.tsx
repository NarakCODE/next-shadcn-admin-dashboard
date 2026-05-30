"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

import type { UsageMetrics, User } from "@/lib/types";

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  usage: UsageMetrics;
  updateUsage: (metrics: Partial<UsageMetrics>) => void;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "",
  role: "Product Designer",
  subscription: {
    tier: "pro",
    status: "active",
    currentPeriodStart: "2025-01-15",
    currentPeriodEnd: "2025-02-15",
    cancelAtPeriodEnd: false,
  },
};

const MOCK_USAGE: UsageMetrics = {
  projects: 8,
  storage: 45.2,
  teamMembers: 3,
  apiCalls: 4521,
  webhooks: 2,
  customIntegrations: 1,
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [usage, setUsage] = useState<UsageMetrics>(MOCK_USAGE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(MOCK_USER);
      }
    } else {
      setUser(MOCK_USER);
    }
    setIsLoading(false);
  }, []);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  };

  const updateUsage = (metrics: Partial<UsageMetrics>) => {
    setUsage((prev) => ({ ...prev, ...metrics }));
  };

  return (
    <UserContext.Provider value={{ user, isLoading, usage, updateUsage, setUser: handleSetUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
