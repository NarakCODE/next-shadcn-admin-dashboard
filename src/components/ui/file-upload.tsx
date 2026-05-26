"use client";

import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  className?: string;
  onFilesChange?: (files: File[]) => void;
}

export function FileUpload({
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024,
  accept = "image/*",
  className,
  onFilesChange,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const errors: string[] = [];

    const validFiles = fileArray.filter((file) => {
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name} is not an image`);
        return false;
      }
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
        return false;
      }
      return true;
    });

    const combined = [...files, ...validFiles];
    if (combined.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} file(s) allowed`);
      return;
    }

    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    setError(null);
    setFiles(combined);

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);

    onFilesChange?.(combined);
  }, [files, maxFiles, maxSize, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const removeFile = useCallback((index: number) => {
    URL.revokeObjectURL(previews[index]);
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onFilesChange?.(newFiles);
  }, [files, previews, onFilesChange]);

  const clearAll = useCallback(() => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
    setError(null);
    onFilesChange?.([]);
  }, [previews, onFilesChange]);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative rounded-lg border border-dashed p-6 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleFileInput}
          className="sr-only"
          id={`file-upload-${maxFiles}`}
        />

        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            isDragging ? "bg-primary/10" : "bg-muted"
          )}>
            <Upload className={cn(
              "h-5 w-5",
              isDragging ? "text-primary" : "text-muted-foreground"
            )} />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">
              Drag and drop or{" "}
              <label
                htmlFor={`file-upload-${maxFiles}`}
                className="cursor-pointer text-primary underline underline-offset-4 hover:text-primary/80"
              >
                browse
              </label>
            </p>
            <p className="text-muted-foreground text-xs">
              PNG, JPG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-destructive text-xs">{error}</p>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs">
              {files.length} / {maxFiles} file(s)
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={clearAll}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Clear
            </Button>
          </div>

          <div className={cn(
            "grid gap-3",
            maxFiles === 1 ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"
          )}>
            {files.map((file, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border">
                {previews[index] ? (
                  <img
                    src={previews[index]}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1.5 text-white">
                  <p className="truncate text-[10px] font-medium">{file.name}</p>
                  <p className="text-[10px] text-gray-300">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
