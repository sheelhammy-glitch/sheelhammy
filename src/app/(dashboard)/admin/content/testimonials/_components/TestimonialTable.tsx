"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

export type Testimonial = {
  id: string;
  clientName: string;
  content: string;
  rating: number;
  avatar: string | null;
  createdAt: Date | string;
};

export function getTestimonialColumns(
  onEdit: (testimonial: Testimonial) => void,
  onDelete: (testimonial: Testimonial) => void
): ColumnDef<Testimonial>[] {
  return [
    {
      accessorKey: "clientName",
      header: "اسم العميل",
      cell: ({ row }) => {
        const testimonial = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={testimonial.avatar || undefined} />
              <AvatarFallback>
                {testimonial.clientName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{testimonial.clientName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "content",
      header: "المحتوى",
      cell: ({ row }) => (
        <p className="max-w-md truncate">{row.original.content}</p>
      ),
    },
    {
      accessorKey: "rating",
      header: "التقييم",
      cell: ({ row }) => {
        const rating = row.original.rating;
        return (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
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
        const testimonial = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(testimonial)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(testimonial)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];
}
