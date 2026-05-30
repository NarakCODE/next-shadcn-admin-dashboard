import { FileText, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function EmptyPage3() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl leading-none tracking-tight">Empty Page 3</h1>
        <p className="text-muted-foreground text-sm">Empty state inside a card with border</p>
      </div>

      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle>Documents</CardTitle>
            <CardDescription>Manage your uploaded files and documents</CardDescription>
          </CardHeader>
          <CardContent>
            <Empty className="border-0 p-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText className="size-6 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>No documents uploaded</EmptyTitle>
                <EmptyDescription>
                  Upload your first document to get started. Supported formats: PDF, DOC, DOCX, TXT.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
          <CardFooter className="flex justify-center gap-2">
            <Button variant="outline">Browse Files</Button>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
