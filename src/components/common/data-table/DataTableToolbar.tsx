"use client";

import React from "react";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  filterOptions?: Array<{
    column: string;
    title: string;
    options: Array<{ label: string; value: string }>;
  }>;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "البحث...",
  filterOptions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        {searchKey && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pr-8 h-9"
            />
          </div>
        )}
        {filterOptions?.map((filter) => (
          <Select
            key={filter.column}
            value={(table.getColumn(filter.column)?.getFilterValue() as string) ?? ""}
            onValueChange={(value) =>
              table.getColumn(filter.column)?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder={filter.title} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 lg:px-3"
          >
            إعادة تعيين
            <X className="mr-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
