"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export type Category = {
  id: string;
  name: string;
  servicesCount: number;
};

export function getCategoryColumns(
  onEdit: (category: Category) => void,
  onDelete: (category: Category) => void
): ColumnDef<Category>[] {
  return [
    {
      accessorKey: "name",
      header: "اسم الفئة",
    },
    {
      accessorKey: "servicesCount",
      header: "عدد الخدمات",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.servicesCount}</span>
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(category)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];
}
