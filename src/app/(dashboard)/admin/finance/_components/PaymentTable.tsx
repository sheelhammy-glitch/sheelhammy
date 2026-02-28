"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

export type Payment = {
  id: string;
  orderNumber: string;
  studentName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  isPaid: boolean;
  paymentType?: string;
  paidDate: string | null;
  lastPaymentDate?: string | null;
};

export function getPaymentColumns(
  onMarkAsPaid: (paymentId: string) => void
): ColumnDef<Payment>[] {
  return [
    {
      accessorKey: "orderNumber",
      header: "رقم الطلب",
    },
    {
      accessorKey: "studentName",
      header: "الطالب",
    },
    {
      accessorKey: "totalAmount",
      header: "المجموع",
      cell: ({ row }) => formatCurrency(row.original.totalAmount),
    },
    {
      accessorKey: "paidAmount",
      header: "المدفوع",
      cell: ({ row }) => (
        <span className="text-green-600 font-semibold">
          {formatCurrency(row.original.paidAmount)}
        </span>
      ),
    },
    {
      accessorKey: "remainingAmount",
      header: "المتبقي",
      cell: ({ row }) => (
        <span className="text-red-600 font-semibold">
          {formatCurrency(row.original.remainingAmount)}
        </span>
      ),
    },
    {
      accessorKey: "paymentType",
      header: "نوع الدفع",
      cell: ({ row }) => {
        const type = row.original.paymentType;
        return type === "installments" ? "أقساط" : "كاش";
      },
    },
    {
      accessorKey: "isPaid",
      header: "الحالة",
      cell: ({ row }) => (
        <StatusBadge status={row.original.isPaid ? "PAID" : "PENDING"} />
      ),
    },
    {
      accessorKey: "lastPaymentDate",
      header: "آخر دفع",
      cell: ({ row }) =>
        row.original.lastPaymentDate ? formatDate(row.original.lastPaymentDate) : "-",
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => {
        const payment = row.original;
        return !payment.isPaid ? (
          <Button size="sm" onClick={() => onMarkAsPaid(payment.id)}>
            تسجيل الدفع
          </Button>
        ) : null;
      },
    },
  ];
}
