"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Clock, CreditCard, FileText, Folder, Search, ShoppingCart, Star, Ticket, Trash2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { LocalIcon } from "@/components/ui/local-icon";
import { type SearchResult, useAdvancedSearch } from "@/hooks/use-advanced-search";
import type { NavMainItem } from "@/navigation/sidebar/sidebar-items";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";

type SearchItem = {
  group: string;
  label: string;
  url: string;
  icon?: NavMainItem["icon"];
  disabled?: boolean;
  newTab?: boolean;
};

const sidebarGroupLabels = new Set(sidebarItems.flatMap((group) => (group.label ? [group.label] : [])));

function getSubItemGroup(groupLabel: string | undefined, itemTitle: string) {
  return sidebarGroupLabels.has(itemTitle) ? (groupLabel ?? "Other") : itemTitle;
}

const searchItems: SearchItem[] = sidebarItems.flatMap((group) =>
  group.items.flatMap((item) => {
    if (item.subItems) {
      return item.subItems.map((sub) => ({
        group: getSubItemGroup(group.label, item.title),
        label: sub.title,
        url: sub.url,
        icon: item.icon,
        disabled: sub.comingSoon,
        newTab: sub.newTab,
      }));
    }
    return [
      {
        group: group.label ?? "Other",
        label: item.title,
        url: item.url,
        icon: item.icon,
        disabled: item.comingSoon,
        newTab: item.newTab,
      },
    ];
  }),
);

function getAvailableItems(items: SearchItem[]) {
  return items.filter((item) => !item.disabled && !item.url.includes("coming-soon"));
}

const recommendations = getAvailableItems(searchItems);

function groupBy(items: SearchItem[]) {
  const groups = [...new Set(items.map((item) => item.group))];
  return groups.map((group) => ({
    group,
    items: items.filter((item) => item.group === group),
  }));
}

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const { search, searchHistory, savedSearches, addToHistory, clearHistory, removeFromHistory, deleteSavedSearch } =
    useAdvancedSearch();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) setQuery("");
  };

  const handleSelect = (item: SearchItem) => {
    if (item.disabled) return;
    handleOpenChange(false);
    addToHistory(item.label);
    if (item.newTab) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.url);
    }
  };

  const handleDataSelect = (result: SearchResult) => {
    handleOpenChange(false);
    addToHistory(result.title);
    router.push(result.url);
  };

  const handleHistorySelect = (historyQuery: string) => {
    setQuery(historyQuery);
  };

  const handleSavedSearchSelect = (savedQuery: string) => {
    setQuery(savedQuery);
  };

  const getTypeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "user":
        return <Users className="h-4 w-4" />;
      case "ticket":
        return <Ticket className="h-4 w-4" />;
      case "order":
        return <ShoppingCart className="h-4 w-4" />;
      case "project":
        return <Folder className="h-4 w-4" />;
      case "invoice":
        return <FileText className="h-4 w-4" />;
      case "customer":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const dataResults = query ? search(query) : [];

  const renderGroups = (items: SearchItem[]) =>
    groupBy(items).map(({ group, items: groupItems }, index) => (
      <React.Fragment key={group}>
        {index > 0 && <CommandSeparator />}
        <CommandGroup heading={group}>
          {groupItems.map((item) => (
            <CommandItem
              disabled={item.disabled}
              key={`${group}-${item.url}-${item.label}`}
              value={`${item.group} ${item.label}`}
              onSelect={() => handleSelect(item)}
            >
              {item.icon && <LocalIcon icon={item.icon} />}
              <span>{item.label}</span>

              {item.disabled && (
                <Badge variant="outline" className="text-xs">
                  Soon
                </Badge>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </React.Fragment>
    ));

  const renderDataResults = () => {
    if (dataResults.length === 0) return null;

    const grouped = dataResults.reduce(
      (acc, result) => {
        if (!acc[result.type]) {
          acc[result.type] = [];
        }
        acc[result.type].push(result);
        return acc;
      },
      {} as Record<string, SearchResult[]>,
    );

    return (
      <>
        <CommandSeparator />
        {Object.entries(grouped).map(([type, results]) => (
          <CommandGroup key={type} heading={`${type.charAt(0).toUpperCase() + type.slice(1)}s`}>
            {results.map((result) => (
              <CommandItem
                key={result.id}
                value={`${result.type} ${result.title} ${result.subtitle}`}
                onSelect={() => handleDataSelect(result)}
              >
                {getTypeIcon(result.type)}
                <div className="flex flex-1 flex-col">
                  <span className="font-medium">{result.title}</span>
                  <span className="text-muted-foreground text-xs">{result.subtitle}</span>
                </div>
                {result.metadata && (
                  <div className="flex gap-1">
                    {Object.entries(result.metadata)
                      .slice(0, 2)
                      .map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {value}
                        </Badge>
                      ))}
                  </div>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </>
    );
  };

  const renderHistory = () => {
    if (searchHistory.length === 0) return null;

    return (
      <>
        <CommandSeparator />
        <CommandGroup heading="Recent Searches">
          {searchHistory.slice(0, 5).map((historyQuery) => (
            <CommandItem
              key={historyQuery}
              value={`history ${historyQuery}`}
              onSelect={() => handleHistorySelect(historyQuery)}
            >
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{historyQuery}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromHistory(historyQuery);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </CommandItem>
          ))}
          {searchHistory.length > 0 && (
            <CommandItem onSelect={clearHistory}>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Clear history</span>
            </CommandItem>
          )}
        </CommandGroup>
      </>
    );
  };

  const renderSavedSearches = () => {
    if (savedSearches.length === 0) return null;

    return (
      <>
        <CommandSeparator />
        <CommandGroup heading="Saved Searches">
          {savedSearches.map((saved) => (
            <CommandItem
              key={saved.id}
              value={`saved ${saved.label} ${saved.query}`}
              onSelect={() => handleSavedSearchSelect(saved.query)}
            >
              <Star className="h-4 w-4 text-yellow-500" />
              <div className="flex flex-1 flex-col">
                <span className="font-medium">{saved.label}</span>
                <span className="text-muted-foreground text-xs">{saved.query}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSavedSearch(saved.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </CommandItem>
          ))}
        </CommandGroup>
      </>
    );
  };

  return (
    <>
      <Button
        onClick={() => handleOpenChange(true)}
        variant="link"
        className="px-0! font-normal text-muted-foreground hover:no-underline"
      >
        <Search data-icon="inline-start" />
        Search
        <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium text-[10px]">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <Command>
          <CommandInput placeholder="Search pages, users, tickets, orders…" value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {query ? (
              <>
                {renderDataResults()}
                {renderGroups(searchItems)}
              </>
            ) : (
              <>
                {renderSavedSearches()}
                {renderHistory()}
                {renderGroups(recommendations)}
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
