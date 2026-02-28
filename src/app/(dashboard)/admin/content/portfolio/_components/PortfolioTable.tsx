"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ACADEMIC_LEVELS } from "@/lib/countries";

export type PortfolioItem = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  link: string | null;
  file?: string | null;
  academicLevel?: string | null;
  date?: Date | string | null;
  countries?: string[];
  createdAt: Date | string;
};

export function getPortfolioColumns(
  onEdit: (item: PortfolioItem) => void,
  onDelete: (item: PortfolioItem) => void
): ColumnDef<PortfolioItem>[] {
  return [
    {
      accessorKey: "title",
      header: "العنوان",
    },
    {
      accessorKey: "description",
      header: "الوصف",
      cell: ({ row }) => (
        <p className="max-w-md truncate">
          {row.original.description || "-"}
        </p>
      ),
    },
    {
      accessorKey: "academicLevel",
      header: "المرحلة الدراسية",
      cell: ({ row }) => {
        const level = row.original.academicLevel;
        if (!level) return "-";
        const levelInfo = ACADEMIC_LEVELS.find((l) => l.value === level);
        return levelInfo?.label || level;
      },
    },
    {
      accessorKey: "date",
      header: "التاريخ",
      cell: ({ row }) => {
        const date = row.original.date;
        if (!date) return "-";
        const dateStr =
          typeof date === "string"
            ? date
            : date instanceof Date
            ? date.toISOString().split("T")[0]
            : "-";
        return dateStr !== "-" ? formatDate(dateStr) : "-";
      },
    },
    {
      accessorKey: "link",
      header: "الرابط",
      cell: ({ row }) => {
        const link = row.original.link;
        return link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            عرض
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "file",
      header: "الملف",
      cell: ({ row }) => {
        const file = row.original.file;
        return file ? (
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-green-600 hover:underline"
          >
            <Download className="h-4 w-4" />
            تحميل
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ الإضافة",
      cell: ({ row }) => {
        const date =
          typeof row.original.createdAt === "string"
            ? row.original.createdAt
            : row.original.createdAt.toISOString().split("T")[0];
        return formatDate(date);
      },
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];
}
