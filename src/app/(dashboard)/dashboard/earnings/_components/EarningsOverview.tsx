"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";
import { DollarSign, Clock, CheckCircle, Download } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { DataTable } from "@/components/common/data-table/DataTable";
import { ColumnDef } from "@tanstack/react-table";

type Job = {
  id: string;
  order: {
    providerPrice: number | null;
    status: string;
  };
};

interface EarningsOverviewProps {
  totalEarnings: number;
  pendingEarnings: number;
  jobs: Job[];
}

export function EarningsOverview({
  totalEarnings,
  pendingEarnings,
  jobs,
}: EarningsOverviewProps) {
  const earningsData = jobs
    .filter((j) => j.order.providerPrice)
    .map((job) => ({
      id: job.id,
      amount: job.order.providerPrice!,
      status: job.order.status,
      date: new Date(),
    }));

  const columns: ColumnDef<typeof earningsData[0]>[] = [
    {
      accessorKey: "amount",
      header: "المبلغ",
      cell: ({ row }) => formatCurrency(row.getValue("amount")),
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={
              status === "COMPLETED"
                ? "text-green-600 dark:text-green-400"
                : "text-yellow-600 dark:text-yellow-400"
            }
          >
            {status === "COMPLETED" ? "مدفوع" : "قيد الانتظار"}
          </span>
        );
      },
    },
    {
      accessorKey: "date",
      header: "التاريخ",
      cell: ({ row }) => formatDateTime(row.getValue("date")),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="إجمالي الأرباح"
          value={formatCurrency(totalEarnings)}
          icon={DollarSign}
        />
        <StatCard
          title="قيد الانتظار"
          value={formatCurrency(pendingEarnings)}
          icon={Clock}
        />
        <StatCard
          title="المهام المكتملة"
          value={jobs.filter((j) => j.order.status === "COMPLETED").length}
          icon={CheckCircle}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>سجل الأرباح</CardTitle>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              تصدير
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={earningsData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>طلب سحب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              الرصيد المتاح للسحب: {formatCurrency(totalEarnings)}
            </p>
            <Button disabled={totalEarnings === 0}>
              <DollarSign className="mr-2 h-4 w-4" />
              طلب سحب
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
