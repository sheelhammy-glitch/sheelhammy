"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string | null;
  date: Date | string;
  description: string | null;
};

export function getExpenseColumns(
  onEdit: (expense: Expense) => void,
  onDelete: (expense: Expense) => void
): ColumnDef<Expense>[] {
  return [
    {
      accessorKey: "title",
      header: "المصروف",
    },
    {
      accessorKey: "category",
      header: "الفئة",
      cell: ({ row }) => row.original.category || "-",
    },
    {
      accessorKey: "amount",
      header: "المبلغ",
      cell: ({ row }) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: "date",
      header: "التاريخ",
      cell: ({ row }) => {
        const date =
          typeof row.original.date === "string"
            ? row.original.date
            : row.original.date.toISOString().split("T")[0];
        return formatDate(date);
      },
    },
    {
      accessorKey: "description",
      header: "الوصف",
      cell: ({ row }) => row.original.description || "-",
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(expense)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(expense)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];
}
