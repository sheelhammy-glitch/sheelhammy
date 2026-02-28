"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

export type Transfer = {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  status: string;
  receiptImage: string | null;
  createdAt: string;
};

export function getTransferColumns(
  onViewReceipt: (transfer: Transfer) => void
): ColumnDef<Transfer>[] {
  return [
    {
      accessorKey: "employeeName",
      header: "الموظف",
    },
    {
      accessorKey: "amount",
      header: "المبلغ",
      cell: ({ row }) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => (
        <StatusBadge
          status={
            row.original.status === "COMPLETED" ? "COMPLETED" : "PENDING"
          }
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "التاريخ",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "receipt",
      header: "إثبات التحويل",
      cell: ({ row }) => {
        const transfer = row.original;
        return transfer.receiptImage ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewReceipt(transfer)}
          >
            <Receipt className="h-4 w-4 ml-1" />
            عرض
          </Button>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
  ];
}
