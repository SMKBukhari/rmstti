"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayPicker } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { CalendarIcon } from "lucide-react";
import { format, parse, parseISO, compareAsc } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface FilterableColumn {
  id: string;
  title: string;
  options?: string[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterableColumns?: FilterableColumn[];
  routePrefix?: string;
  userId?: string;
  title?: string;
  description?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterableColumns = [],
  routePrefix,
  userId,
  title,
  description,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {}
  );
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    sortingFns: {
      datetime: (rowA, rowB, columnId) => {
        const dateA = parseISO(rowA.getValue(columnId) as string);
        const dateB = parseISO(rowB.getValue(columnId) as string);
        return compareAsc(dateA, dateB);
      },
    },
    onRowSelectionChange: (newRowSelection) => {
      setRowSelection(newRowSelection);
    },
  });

  const handleRowClick = (row: TData, event: React.MouseEvent) => {
    if (!(event.target as HTMLElement).closest("button")) {
      const link =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (row as any).id === userId // Check if the row belongs to the signed-in user
          ? "/profile"
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            `/${routePrefix}/${(row as any).id}`;
      router.push(link);
    }
  };

  const resetFilters = () => {
    setColumnFilters([]);
    setGlobalFilter("");
    table.resetColumnFilters();
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <CardTitle>{title}</CardTitle>
            {description && (
              <p className='text-sm text-muted-foreground'>{description}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col space-y-4'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <Input
              placeholder='Search all columns...'
              value={globalFilter ?? ""}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setGlobalFilter(event.target.value)
              }
              className='max-w-sm'
            />
            <Button onClick={resetFilters} variant='outline'>
              Clear All Filters
            </Button>
          </div>
          <div className='flex flex-wrap gap-4'>
            {filterableColumns.map((column) => (
              <div key={column.id} className='flex flex-col space-y-2'>
                <label htmlFor={column.id} className='text-sm font-medium'>
                  {column.title}
                </label>
                {column.id === "date" ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !table.getColumn(column.id)?.getFilterValue() &&
                            "text-muted-foreground"
                        )}
                      >
                        {table.getColumn(column.id)?.getFilterValue() ? (
                          format(
                            parse(
                              table
                                .getColumn(column.id)
                                ?.getFilterValue() as string,
                              "yyyy-MM-dd",
                              new Date()
                            ),
                            "PPP"
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <DayPicker
                        mode='single'
                        selected={
                          table.getColumn(column.id)?.getFilterValue()
                            ? parse(
                                table
                                  .getColumn(column.id)
                                  ?.getFilterValue() as string,
                                "yyyy-MM-dd",
                                new Date()
                              )
                            : undefined
                        }
                        onSelect={(date) => {
                          table
                            .getColumn(column.id)
                            ?.setFilterValue(
                              date ? format(date, "yyyy-MM-dd") : undefined
                            );
                        }}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date > today;
                        }}
                        captionLayout='dropdown'
                        fromYear={2020}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                ) : column.options ? (
                  <Select
                    value={
                      (table
                        .getColumn(column.id)
                        ?.getFilterValue() as string) ?? ""
                    }
                    onValueChange={(value: string) =>
                      table
                        .getColumn(column.id)
                        ?.setFilterValue(value === "all" ? "" : value)
                    }
                  >
                    <SelectTrigger className='w-[200px]'>
                      <SelectValue placeholder={`Select ${column.title}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All</SelectItem>
                      {column.options?.map((option) => (
                        <SelectItem key={option} value={option || "undefined"}>
                          {option || "Undefined"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={column.id}
                    placeholder={`Filter ${column.title}...`}
                    value={
                      (table
                        .getColumn(column.id)
                        ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      table
                        .getColumn(column.id)
                        ?.setFilterValue(event.target.value)
                    }
                    className='max-w-sm'
                  />
                )}
              </div>
            ))}
          </div>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={(event) => {
                        if (routePrefix) {
                          handleRowClick(row.original, event);
                        }
                      }}
                      className={`${routePrefix ? "cursor-pointer" : ""}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className='flex items-center justify-between space-x-2 py-4'>
            <div className='flex-1 text-sm text-muted-foreground'>
              {table.getFilteredRowModel().rows.length} row(s) displayed
            </div>
            <div className='space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
