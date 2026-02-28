"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/common/StatusBadge";

export type Service = {
  id: string;
  title: string;
  shortDescription?: string | null;
  description: string;
  image: string | null;
  priceGuideline: number | null;
  features?: string[];
  isActive?: boolean;
  countries?: string[];
  category: {
    id: string;
    name: string;
  };
  createdAt: Date | string;
};

export function getServiceColumns(
  onEdit: (service: Service) => void,
  onDelete: (service: Service) => void,
  onView: (service: Service) => void
): ColumnDef<Service>[] {
  return [
    {
      accessorKey: "title",
      header: "العنوان",
    },
    {
      id: "category",
      accessorKey: "category",
      header: "الفئة",
      cell: ({ row }) => row.original.category.name,
    },
    {
      accessorKey: "priceGuideline",
      header: "السعر الاسترشادي",
      cell: ({ row }) =>
        row.original.priceGuideline
          ? formatCurrency(row.original.priceGuideline)
          : "-",
    },
    {
      accessorKey: "shortDescription",
      header: "الوصف المختصر",
      cell: ({ row }) => (
        <p className="max-w-md truncate">
          {row.original.shortDescription || row.original.description.substring(0, 50) + "..."}
        </p>
      ),
    },
    {
      accessorKey: "isActive",
      header: "الحالة",
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.isActive !== false ? "ACTIVE" : "INACTIVE"}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ الإضافة",
      cell: ({ row }) => {
        if (!row.original.createdAt) return "-";
        const date =
          typeof row.original.createdAt === "string"
            ? row.original.createdAt
            : row.original.createdAt instanceof Date
            ? row.original.createdAt.toISOString().split("T")[0]
            : "-";
        return date !== "-" ? formatDate(date) : "-";
      },
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(service)}
              title="عرض التفاصيل"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(service)}
              title="تعديل"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(service)}
              title="حذف"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}
