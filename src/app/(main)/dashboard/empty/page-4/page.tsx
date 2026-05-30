import { BarChart3, BookOpen, HelpCircle, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function EmptyPage4() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl leading-none tracking-tight">Empty Page 4</h1>
        <p className="text-muted-foreground text-sm">Empty state with resource links</p>
      </div>

      <div className="flex min-h-[60vh] items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <BarChart3 className="size-20 text-muted-foreground/30" />
            </EmptyMedia>
            <EmptyTitle>No analytics data available</EmptyTitle>
            <EmptyDescription>
              Analytics data will appear here once your integration is active. In the meantime, explore our resources to
              get started.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="grid w-full grid-cols-2 gap-3">
              <Button variant="outline" className="flex h-auto flex-col items-center gap-2 py-4">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm">Documentation</span>
              </Button>
              <Button variant="outline" className="flex h-auto flex-col items-center gap-2 py-4">
                <Users className="h-5 w-5" />
                <span className="text-sm">Community</span>
              </Button>
            </div>
            <Button variant="ghost" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Need help? Contact support
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
}
