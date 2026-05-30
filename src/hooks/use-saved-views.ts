"use client";

import { useCallback, useEffect, useState } from "react";

import { getLocalStorageValue, setLocalStorageValue } from "@/lib/local-storage.client";

export type SavedView<TFilterState = Record<string, unknown>> = {
  id: string;
  name: string;
  filters: TFilterState;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
};

type UseSavedViewsOptions<TFilterState> = {
  namespace: string;
  defaultFilters: TFilterState;
  maxViews?: number;
};

type UseSavedViewsReturn<TFilterState> = {
  views: SavedView<TFilterState>[];
  activeViewId: string | null;
  activeView: SavedView<TFilterState> | null;
  saveView: (name: string, filters: TFilterState) => void;
  updateView: (id: string, updates: Partial<SavedView<TFilterState>>) => void;
  deleteView: (id: string) => void;
  loadView: (id: string) => TFilterState;
  setActiveView: (id: string | null) => void;
  setDefaultView: (id: string | null) => void;
  hasUnsavedChanges: (currentFilters: TFilterState) => boolean;
};

const STORAGE_PREFIX = "saved-views:";
const ACTIVE_VIEW_SUFFIX = ":active";
const DEFAULT_VIEW_SUFFIX = ":default";

function generateId(): string {
  return `view_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function deepEqual<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function useSavedViews<TFilterState extends Record<string, unknown>>({
  namespace,
  defaultFilters,
  maxViews = 20,
}: UseSavedViewsOptions<TFilterState>): UseSavedViewsReturn<TFilterState> {
  const storageKey = `${STORAGE_PREFIX}${namespace}`;
  const activeViewKey = `${storageKey}${ACTIVE_VIEW_SUFFIX}`;
  const defaultViewKey = `${storageKey}${DEFAULT_VIEW_SUFFIX}`;

  const [views, setViews] = useState<SavedView<TFilterState>[]>([]);
  const [activeViewId, setActiveViewId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load views from localStorage on mount
  useEffect(() => {
    const storedViews = getLocalStorageValue(storageKey);
    const storedActiveView = getLocalStorageValue(activeViewKey);

    if (storedViews) {
      try {
        setViews(JSON.parse(storedViews));
      } catch (error) {
        console.error("[useSavedViews] Failed to parse stored views:", error);
      }
    }

    if (storedActiveView) {
      setActiveViewId(storedActiveView);
    }

    setIsLoaded(true);
  }, [storageKey, activeViewKey]);

  // Persist views to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      setLocalStorageValue(storageKey, JSON.stringify(views));
    }
  }, [views, storageKey, isLoaded]);

  // Persist active view ID
  useEffect(() => {
    if (isLoaded) {
      if (activeViewId) {
        setLocalStorageValue(activeViewKey, activeViewId);
      } else {
        setLocalStorageValue(activeViewKey, "");
      }
    }
  }, [activeViewId, activeViewKey, isLoaded]);

  const activeView = views.find((v) => v.id === activeViewId) || null;

  const saveView = useCallback(
    (name: string, filters: TFilterState) => {
      const now = new Date().toISOString();
      const newView: SavedView<TFilterState> = {
        id: generateId(),
        name,
        filters,
        createdAt: now,
        updatedAt: now,
      };

      setViews((prev) => {
        const updated = [newView, ...prev];
        // Enforce max views limit
        if (updated.length > maxViews) {
          return updated.slice(0, maxViews);
        }
        return updated;
      });

      setActiveViewId(newView.id);
    },
    [maxViews],
  );

  const updateView = useCallback((id: string, updates: Partial<SavedView<TFilterState>>) => {
    setViews((prev) =>
      prev.map((view) =>
        view.id === id
          ? {
              ...view,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : view,
      ),
    );
  }, []);

  const deleteView = useCallback(
    (id: string) => {
      setViews((prev) => prev.filter((view) => view.id !== id));
      if (activeViewId === id) {
        setActiveViewId(null);
      }
      // Clear default if deleted
      const defaultViewId = getLocalStorageValue(defaultViewKey);
      if (defaultViewId === id) {
        setLocalStorageValue(defaultViewKey, "");
      }
    },
    [activeViewId, defaultViewKey],
  );

  const loadView = useCallback(
    (id: string): TFilterState => {
      const view = views.find((v) => v.id === id);
      if (view) {
        setActiveViewId(id);
        return view.filters;
      }
      return defaultFilters;
    },
    [views, defaultFilters],
  );

  const setActiveView = useCallback((id: string | null) => {
    setActiveViewId(id);
  }, []);

  const setDefaultView = useCallback(
    (id: string | null) => {
      if (id) {
        setLocalStorageValue(defaultViewKey, id);
        // Mark the view as default
        setViews((prev) =>
          prev.map((view) => ({
            ...view,
            isDefault: view.id === id,
          })),
        );
      } else {
        setLocalStorageValue(defaultViewKey, "");
        setViews((prev) =>
          prev.map((view) => ({
            ...view,
            isDefault: false,
          })),
        );
      }
    },
    [defaultViewKey],
  );

  const hasUnsavedChanges = useCallback(
    (currentFilters: TFilterState): boolean => {
      if (!activeView) {
        // Check if different from default filters
        return !deepEqual(currentFilters, defaultFilters);
      }
      return !deepEqual(currentFilters, activeView.filters);
    },
    [activeView, defaultFilters],
  );

  return {
    views,
    activeViewId,
    activeView,
    saveView,
    updateView,
    deleteView,
    loadView,
    setActiveView,
    setDefaultView,
    hasUnsavedChanges,
  };
}
