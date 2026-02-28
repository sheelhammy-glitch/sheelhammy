"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, Wallet, Receipt, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/common/data-table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/common/Skeletons";

type Transfer = {
  id: string;
  amount: number;
  status: string;
  receiptImage: string | null;
  createdAt: string;
};

type EarningsStats = {
  totalEarnings: number;
  pendingEarnings: number;
  transferredEarnings: number;
  completedOrders: number;
};

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<EarningsStats | null>(null);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  // Fetch earnings data
  useEffect(() => {
    const fetchEarnings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/dashboard/earnings");
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch earnings");
        }
        const data = await response.json();
        setEarnings(data.stats);
        setTransfers(data.transfers);
      } catch (error: any) {
        toast.error(error.message || "حدث خطأ أثناء تحميل الأرباح");
        console.error("Error fetching earnings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const columns: ColumnDef<Transfer>[] = [
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
          status={row.original.status === "COMPLETED" ? "COMPLETED" : "PENDING"}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ التحويل",
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
            onClick={() => setSelectedReceipt(transfer.receiptImage || null)}
          >
            <Receipt className="h-4 w-4 ml-1" />
            عرض الوصل
          </Button>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="الأرباح والتحويلات"
          description="متابعة أرباحك والتحويلات المستلمة"
        />
        <TableSkeleton rows={3} />
      </div>
    );
  }

  if (!earnings) {
    return (
      <div className="space-y-6" dir="rtl">
        <PageHeader
          title="الأرباح والتحويلات"
          description="متابعة أرباحك والتحويلات المستلمة"
        />
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">فشل تحميل بيانات الأرباح</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="الأرباح والتحويلات"
        description="متابعة أرباحك والتحويلات المستلمة"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="إجمالي الأرباح"
          value={formatCurrency(earnings.totalEarnings)}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="الأرباح المستحقة"
          value={formatCurrency(earnings.pendingEarnings)}
          icon={Wallet}
          variant="warning"
        />
        <StatCard
          title="المحولة"
          value={formatCurrency(earnings.transferredEarnings)}
          icon={DollarSign}
          variant="info"
        />
        <StatCard
          title="الطلبات المكتملة"
          value={earnings.completedOrders}
          icon={Receipt}
        />
      </div>

      {/* Earnings Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الأرباح</CardTitle>
          <CardDescription>
            تفصيل الأرباح حسب الحالة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">الطلبات المكتملة</p>
                <p className="text-sm text-gray-500">{earnings.completedOrders} طلب</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">
                  {formatCurrency(earnings.totalEarnings)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">في انتظار التحويل</p>
                <p className="text-sm text-gray-500">سيتم التحويل قريباً</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-orange-600">
                  {formatCurrency(earnings.pendingEarnings)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
              <div>
                <p className="font-semibold">تم التحويل</p>
                <p className="text-sm text-gray-500">المبلغ المستلم فعلياً</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">
                  {formatCurrency(earnings.transferredEarnings)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfers History */}
      <Card>
        <CardHeader>
          <CardTitle>سجل التحويلات</CardTitle>
          <CardDescription>
            قائمة بجميع التحويلات المالية المستلمة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transfers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">لا توجد تحويلات</p>
          ) : (
            <DataTable
              columns={columns}
              data={transfers}
              searchKey="amount"
              searchPlaceholder="البحث بالمبلغ..."
            />
          )}
        </CardContent>
      </Card>

      {/* Receipt Dialog */}
      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent dir="rtl" className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>صورة إثبات التحويل</DialogTitle>
            <DialogDescription>
              صورة الوصل المرفوعة من قبل الأدمن
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedReceipt && (
              <img
                src={selectedReceipt}
                alt="إثبات التحويل"
                className="w-full h-auto rounded-lg border"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
