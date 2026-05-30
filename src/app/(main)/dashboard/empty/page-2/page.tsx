import { Inbox, Mail, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";

export default function EmptyPage2() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl leading-none tracking-tight">Empty Page 2</h1>
        <p className="text-muted-foreground text-sm">Empty state with search and multiple actions</p>
      </div>

      <div className="flex min-h-[60vh] items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <Inbox className="size-16 text-muted-foreground/50" />
            </EmptyMedia>
            <EmptyTitle>Your inbox is empty</EmptyTitle>
            <EmptyDescription>No messages yet. When you receive new messages, they will appear here.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="relative w-full max-w-xs">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Compose
              </Button>
              <Button variant="outline">Refresh</Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
}
