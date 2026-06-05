"use client";

import type React from "react";
import { useState } from "react";

import { Bookmark, Check, Edit2, MoreVertical, Plus, Star, Trash2, Undo } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface SavedView {
  id: string;
  name: string;
  isDefault: boolean;
  filters: unknown;
}

interface SavedViewsManagerProps {
  views: SavedView[];
  activeViewId: string | null;
  hasUnsavedChanges: boolean;
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onSetDefault: (id: string | null) => void;
  onClearActive: () => void;
}

export function SavedViewsManager({
  views,
  activeViewId,
  hasUnsavedChanges,
  onSave,
  onLoad,
  onDelete,
  onRename,
  onSetDefault,
  onClearActive,
}: SavedViewsManagerProps) {
  const [newViewName, setNewViewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const activeView = views.find((v) => v.id === activeViewId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newViewName.trim()) return;
    onSave(newViewName.trim());
    setNewViewName("");
  };

  const startRename = (view: SavedView) => {
    setEditingId(view.id);
    setEditingName(view.name);
  };

  const handleRename = (id: string) => {
    if (!editingName.trim()) return;
    onRename(id, editingName.trim());
    setEditingId(null);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative gap-2 border-dashed">
          <Bookmark className="h-4 w-4" />
          <span className="max-w-[120px] truncate">{activeView ? activeView.name : "Saved Views"}</span>
          {activeView && hasUnsavedChanges && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="font-semibold text-sm">Filter Views</div>
          {activeView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClearActive();
                setIsOpen(false);
              }}
              className="h-7 px-2 text-muted-foreground text-xs hover:text-foreground"
            >
              <Undo className="mr-1 h-3 w-3" />
              Reset
            </Button>
          )}
        </div>
        <Separator />

        <div className="max-h-[220px] overflow-y-auto px-1 py-1.5">
          {views.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground text-xs">No saved views yet.</div>
          ) : (
            <div className="space-y-1">
              {views.map((view) => {
                const isActive = view.id === activeViewId;
                const isEditing = view.id === editingId;

                return (
                  <div
                    key={view.id}
                    className={`flex items-center justify-between rounded-md px-2 py-1 text-sm transition-colors ${
                      isActive ? "bg-accent/50 text-accent-foreground" : "hover:bg-muted/50"
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex w-full items-center gap-1">
                        <Input
                          size={1}
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-7 py-1 text-xs"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRename(view.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRename(view.id)}
                          className="h-7 w-7 shrink-0 text-green-600 hover:text-green-700"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                          className="h-7 w-7 shrink-0 text-red-600 hover:text-red-700"
                        >
                          <Undo className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            onLoad(view.id);
                            setIsOpen(false);
                          }}
                          className="flex flex-1 items-center gap-1.5 text-left font-medium outline-none"
                        >
                          {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
                          <span className="truncate">{view.name}</span>
                          {view.isDefault && (
                            <Badge variant="secondary" className="h-4 px-1 py-0 font-normal text-[9px]">
                              Default
                            </Badge>
                          )}
                          {isActive && hasUnsavedChanges && (
                            <span className="text-[10px] text-amber-500 italic">(unsaved)</span>
                          )}
                        </button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => startRename(view)}>
                              <Edit2 className="mr-2 h-3.5 w-3.5" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSetDefault(view.isDefault ? null : view.id)}>
                              <Star className="mr-2 h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                              {view.isDefault ? "Remove Default" : "Set as Default"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => onDelete(view.id)}
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Separator />
        <form onSubmit={handleSave} className="p-3">
          <div className="flex flex-col gap-2">
            <div className="font-medium text-muted-foreground text-xs">Save current filter view</div>
            <div className="flex gap-2">
              <Input
                placeholder="View name..."
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                className="h-8 text-xs"
              />
              <Button type="submit" size="sm" className="h-8 shrink-0 px-3">
                <Plus className="mr-1 h-3.5 w-3.5" />
                Save
              </Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
