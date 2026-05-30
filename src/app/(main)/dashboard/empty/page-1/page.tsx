import { FolderPlus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function EmptyPage1() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl leading-none tracking-tight">Empty Page 1</h1>
        <p className="text-muted-foreground text-sm">Minimal empty state with icon and action button</p>
      </div>

      <div className="flex min-h-[60vh] items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderPlus className="size-6 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Get started by creating your first project. You can invite your team members once it is created.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
}
