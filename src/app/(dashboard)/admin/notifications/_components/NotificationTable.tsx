"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

export type Notification = {
  id: string;
  userId: string;
  employeeName: string;
  message: string;
  orderNumber: string | null;
  isRead: boolean;
  createdAt: Date | string;
};

export function getNotificationColumns(): ColumnDef<Notification>[] {
  return [
    {
      accessorKey: "employeeName",
      header: "الموظف",
    },
    {
      accessorKey: "message",
      header: "الرسالة",
    },
    {
      accessorKey: "orderNumber",
      header: "رقم الطلب",
      cell: ({ row }) => {
        const orderNumber = row.original.orderNumber;
        return orderNumber ? (
          <Badge variant="outline">{orderNumber}</Badge>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "isRead",
      header: "الحالة",
      cell: ({ row }) => (
        <Badge variant={row.original.isRead ? "secondary" : "default"}>
          {row.original.isRead ? "مقروء" : "غير مقروء"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "التاريخ",
      cell: ({ row }) => {
        const date =
          typeof row.original.createdAt === "string"
            ? row.original.createdAt
            : row.original.createdAt.toISOString();
        return formatDateTime(date);
      },
    },
  ];
}
