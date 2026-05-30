"use client";

import { useState } from "react";

import { Bookmark, Check, MoreHorizontal, Pencil, Plus, Save, Star, Trash2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { SavedView } from "@/hooks/use-saved-views";

type SavedViewsManagerProps<TFilterState> = {
  views: SavedView<TFilterState>[];
  activeViewId: string | null;
  hasUnsavedChanges: boolean;
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onSetDefault: (id: string | null) => void;
  onClearActive: () => void;
};

export function SavedViewsManager<TFilterState extends Record<string, unknown>>({
  views,
  activeViewId,
  hasUnsavedChanges,
  onSave,
  onLoad,
  onDelete,
  onRename,
  onSetDefault,
  onClearActive,
}: SavedViewsManagerProps<TFilterState>) {
  const [isSavePopoverOpen, setIsSavePopoverOpen] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [editingViewId, setEditingViewId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const activeView = views.find((v) => v.id === activeViewId);

  const handleSave = () => {
    if (newViewName.trim()) {
      onSave(newViewName.trim());
      setNewViewName("");
      setIsSavePopoverOpen(false);
    }
  };

  const handleStartRename = (view: SavedView<TFilterState>) => {
    setEditingViewId(view.id);
    setEditingName(view.name);
  };

  const handleSaveRename = () => {
    if (editingViewId && editingName.trim()) {
      onRename(editingViewId, editingName.trim());
      setEditingViewId(null);
      setEditingName("");
    }
  };

  const handleCancelRename = () => {
    setEditingViewId(null);
    setEditingName("");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Active View Indicator */}
      {activeView && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Bookmark className="h-3 w-3" />
            {activeView.name}
            {activeView.isDefault && <Star className="h-3 w-3 fill-current" />}
          </Badge>
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-xs">
              Modified
            </Badge>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onClearActive}>
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear active view</TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Save Current View */}
      <Popover open={isSavePopoverOpen} onOpenChange={setIsSavePopoverOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" disabled={!hasUnsavedChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save View
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Save current filters as a view</TooltipContent>
        </Tooltip>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Save Current View</h4>
              <p className="text-muted-foreground text-xs">Save your current filters for quick access later</p>
            </div>
            <Input
              placeholder="View name"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsSavePopoverOpen(false);
                  setNewViewName("");
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!newViewName.trim()}>
                <Plus className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Views Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Bookmark className="mr-2 h-4 w-4" />
            Views
            {views.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {views.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Saved Views</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {views.length === 0 ? (
            <div className="px-2 py-4 text-center text-muted-foreground text-sm">No saved views yet</div>
          ) : (
            views.map((view) => (
              <div key={view.id} className="relative">
                {editingViewId === view.id ? (
                  <div className="flex items-center gap-2 px-2 py-1.5">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveRename();
                        } else if (e.key === "Escape") {
                          handleCancelRename();
                        }
                      }}
                      className="h-7 flex-1"
                      autoFocus
                    />
                    <Button variant="ghost" size="sm" onClick={handleSaveRename}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCancelRename}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <DropdownMenuItem className="flex items-center justify-between" onClick={() => onLoad(view.id)}>
                    <div className="flex flex-1 items-center gap-2">
                      <Bookmark className="h-4 w-4" />
                      <span className="flex-1">{view.name}</span>
                      {view.isDefault && <Star className="h-3 w-3 fill-current text-yellow-500" />}
                      {activeViewId === view.id && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartRename(view);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetDefault(view.isDefault ? null : view.id);
                          }}
                        >
                          <Star className="mr-2 h-4 w-4" />
                          {view.isDefault ? "Remove Default" : "Set as Default"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(view.id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </DropdownMenuItem>
                )}
              </div>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
