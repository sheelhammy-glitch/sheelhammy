"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export type FAQ = {
  id: string;
  question: string;
  answer: string;
};

export function getFAQColumns(
  onEdit: (faq: FAQ) => void,
  onDelete: (faq: FAQ) => void
): ColumnDef<FAQ>[] {
  return [
    {
      accessorKey: "question",
      header: "السؤال",
    },
    {
      accessorKey: "answer",
      header: "الجواب",
      cell: ({ row }) => (
        <p className="max-w-2xl truncate">{row.original.answer}</p>
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const faq = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(faq)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(faq)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];
}
