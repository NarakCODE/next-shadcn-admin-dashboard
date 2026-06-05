import { useCallback, useEffect, useState } from "react";

export interface SavedView<T> {
  id: string;
  name: string;
  filters: T;
  isDefault: boolean;
}

interface UseSavedViewsOptions<T> {
  namespace: string;
  defaultFilters: T;
}

export function useSavedViews<T extends Record<string, unknown>>({
  namespace,
  defaultFilters,
}: UseSavedViewsOptions<T>) {
  const [views, setViews] = useState<SavedView<T>[]>([]);
  const [activeViewId, setActiveViewId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const storageKey = `saved_views:${namespace}`;
  const activeKey = `active_view:${namespace}`;

  // Hydrate views on mount (client-side only to prevent SSR mismatch)
  useEffect(() => {
    try {
      const storedViews = localStorage.getItem(storageKey);
      const initialViews = storedViews ? JSON.parse(storedViews) : [];
      setViews(initialViews);

      const storedActiveId = localStorage.getItem(activeKey);
      if (storedActiveId) {
        setActiveViewId(storedActiveId);
      } else {
        // Find default view if exists
        const defaultView = initialViews.find((v: SavedView<T>) => v.isDefault);
        if (defaultView) {
          setActiveViewId(defaultView.id);
        }
      }
    } catch (error) {
      console.error("Error reading saved views from localStorage", error);
    } finally {
      setIsHydrated(true);
    }
  }, [storageKey, activeKey]);

  // Helper to save views
  const persistViews = useCallback(
    (newViews: SavedView<T>[]) => {
      setViews(newViews);
      try {
        localStorage.setItem(storageKey, JSON.stringify(newViews));
      } catch (error) {
        console.error("Error writing saved views to localStorage", error);
      }
    },
    [storageKey],
  );

  const saveView = useCallback(
    (name: string, filters: T) => {
      const newView: SavedView<T> = {
        id: `${namespace}-${Date.now()}`,
        name,
        filters,
        isDefault: false,
      };
      const updated = [...views, newView];
      persistViews(updated);
      setActiveViewId(newView.id);
      localStorage.setItem(activeKey, newView.id);
    },
    [namespace, views, persistViews, activeKey],
  );

  const updateView = useCallback(
    (id: string, updates: Partial<Omit<SavedView<T>, "id">>) => {
      const updated = views.map((v) => {
        if (v.id === id) {
          return { ...v, ...updates };
        }
        return v;
      });
      persistViews(updated);
    },
    [views, persistViews],
  );

  const deleteView = useCallback(
    (id: string) => {
      const updated = views.filter((v) => v.id !== id);
      persistViews(updated);
      if (activeViewId === id) {
        setActiveViewId(null);
        localStorage.removeItem(activeKey);
      }
    },
    [views, activeViewId, persistViews, activeKey],
  );

  const loadView = useCallback(
    (id: string) => {
      const view = views.find((v) => v.id === id);
      if (view) {
        setActiveViewId(id);
        localStorage.setItem(activeKey, id);
        return view.filters;
      }
      return defaultFilters;
    },
    [views, defaultFilters, activeKey],
  );

  const setActiveView = useCallback(
    (id: string | null) => {
      setActiveViewId(id);
      if (id) {
        localStorage.setItem(activeKey, id);
      } else {
        localStorage.removeItem(activeKey);
      }
    },
    [activeKey],
  );

  const setDefaultView = useCallback(
    (id: string | null) => {
      const updated = views.map((v) => ({
        ...v,
        isDefault: v.id === id,
      }));
      persistViews(updated);
    },
    [views, persistViews],
  );

  const hasUnsavedChanges = useCallback(
    (currentFilters: T) => {
      const activeView = views.find((v) => v.id === activeViewId);
      const baseline = activeView ? activeView.filters : defaultFilters;

      // Quick JSON comparison
      return JSON.stringify(currentFilters) !== JSON.stringify(baseline);
    },
    [views, activeViewId, defaultFilters],
  );

  return {
    views,
    activeViewId,
    saveView,
    updateView,
    deleteView,
    loadView,
    setActiveView,
    setDefaultView,
    hasUnsavedChanges,
    isHydrated,
  };
}
