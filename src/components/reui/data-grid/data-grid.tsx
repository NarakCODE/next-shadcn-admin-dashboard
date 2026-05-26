"use client";

import * as React from "react";

import { flexRender, type Table as TableType } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
  }
}

const TableContext = React.createContext<TableType<unknown> | null>(null);

function useTableContext<TData>() {
  const context = React.useContext(TableContext);
  if (!context) {
    throw new Error("DataGrid components must be used within a DataGrid");
  }
  return context as TableType<TData>;
}

interface DataGridProps<TData> {
  table: TableType<TData>;
  recordCount: number;
  children?: React.ReactNode;
  className?: string;
}

export function DataGrid<TData>({ table, recordCount, children, className }: DataGridProps<TData>) {
  return (
    <TableContext.Provider value={table as TableType<unknown>}>
      <div data-slot="data-grid" className={cn("w-full space-y-2.5", className)} data-record-count={recordCount}>
        {children}
      </div>
    </TableContext.Provider>
  );
}

export function DataGridContainer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="data-grid-container" className={cn("rounded-lg border bg-card shadow-sm", className)} {...props} />
  );
}

export function DataGridTable<TData>({ className }: { className?: string }) {
  const table = useTableContext<TData>();

  return (
    <Table className={className}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  className={cn(header.column.columnDef.meta?.headerClassName)}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className={cn(cell.column.columnDef.meta?.cellClassName)}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={table.getAllColumns().length} className="py-8 text-center text-muted-foreground">
              No results found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
