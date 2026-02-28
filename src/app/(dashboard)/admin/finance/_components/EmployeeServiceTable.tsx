"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatDate } from "@/lib/utils";

export type EmployeeService = {
  employeeId: string;
  employeeName: string;
  serviceId: string;
  serviceTitle: string;
  totalOrders: number;
  totalReceived: number;
  lastPaymentDate: string | null;
};

export function getEmployeeServiceColumns(): ColumnDef<EmployeeService>[] {
  return [
    {
      accessorKey: "employeeName",
      header: "الموظف",
    },
    {
      accessorKey: "serviceTitle",
      header: "الخدمة",
    },
    {
      accessorKey: "totalOrders",
      header: "عدد الطلبات",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.totalOrders}</span>
      ),
    },
    {
      accessorKey: "totalReceived",
      header: "إجمالي المستلم",
      cell: ({ row }) => (
        <span className="text-green-600 font-semibold">
          {formatCurrency(row.original.totalReceived)}
        </span>
      ),
    },
    {
      accessorKey: "lastPaymentDate",
      header: "آخر دفعة",
      cell: ({ row }) =>
        row.original.lastPaymentDate
          ? formatDate(row.original.lastPaymentDate)
          : "-",
    },
  ];
}
