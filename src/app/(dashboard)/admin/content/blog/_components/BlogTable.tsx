"use client";

import React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  author: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  views: number;
  category: string | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
};

export function getBlogColumns(
  onDelete: (post: BlogPost) => void
): ColumnDef<BlogPost>[] {
  return [
    {
      accessorKey: "title",
      header: "العنوان",
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <p className="font-medium truncate">{row.original.title}</p>
          {row.original.slug && (
            <p className="text-xs text-gray-500">/{row.original.slug}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "author",
      header: "الكاتب",
      cell: ({ row }) => row.original.author || "-",
    },
    {
      accessorKey: "category",
      header: "الفئة",
      cell: ({ row }) => {
        const category = row.original.category;
        return category ? (
          <Badge variant="outline">{category}</Badge>
        ) : (
          "-"
        );
      },
    },
    {
      accessorKey: "isPublished",
      header: "الحالة",
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.isPublished ? "ACTIVE" : "INACTIVE"}
        />
      ),
    },
    {
      accessorKey: "views",
      header: "المشاهدات",
      cell: ({ row }) => row.original.views || 0,
    },
    {
      accessorKey: "publishedAt",
      header: "تاريخ النشر",
      cell: ({ row }) => {
        const date = row.original.publishedAt;
        return date ? formatDate(date) : "-";
      },
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const post = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link href={`/admin/content/blog/${post.id}`}>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(post)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];
}
